import { Router } from "express";
import { prisma } from "../config/database";
import { authenticate, AuthUser } from "../middleware/auth";
import { authorize } from "../middleware/authorize";
import { authorizePhcAccess } from "../middleware/resourceAccess";
import { validate } from "../middleware/validate";
import {
  demandForecastSchema,
  stockoutPredictionSchema,
  optimizationSchema,
} from "../validators/schemas";
import { MLService } from "../services/mlService";
import { logAudit } from "../services/auditService";

const router = Router();

/**
 * GET /api/predictions/health
 * Checks connection status to the ML Microservice
 */
router.get("/health", authenticate, async (_req, res) => {
  const health = await MLService.checkHealth();
  res.json(health);
});

/**
 * POST /api/predictions/demand
 * Predicts daily demand for a specific PHC and medicine
 */
router.post(
  "/demand",
  authenticate,
  authorize("CENTRAL_ADMIN", "STATE_ADMIN", "PHC_ADMIN"),
  validate(demandForecastSchema),
  authorizePhcAccess("body", "phc_id"),
  async (req, res, next) => {
    try {
      const user = (req as any).user as AuthUser;
      const result = await MLService.predictDemand(req.body);

      await logAudit({
        userId: user.userId,
        action: "PREDICT_DEMAND",
        entity: "Prediction",
        entityId: req.body.medicine_id,
        details: { phc_id: req.body.phc_id, predicted_demand: result.predicted_demand, risk_level: result.risk_level },
      });

      res.json(result);
    } catch (err) {
      next(err);
    }
  }
);

/**
 * POST /api/predictions/stockout
 * Estimates days remaining and stockout risk level
 */
router.post(
  "/stockout",
  authenticate,
  authorize("CENTRAL_ADMIN", "STATE_ADMIN", "PHC_ADMIN"),
  validate(stockoutPredictionSchema),
  authorizePhcAccess("body", "phc_id"),
  async (req, res, next) => {
    try {
      const user = (req as any).user as AuthUser;
      const result = await MLService.predictStockout(req.body);

      await logAudit({
        userId: user.userId,
        action: "PREDICT_STOCKOUT",
        entity: "Prediction",
        entityId: req.body.medicine_id,
        details: { phc_id: req.body.phc_id, days_remaining: result.days_remaining, risk_level: result.risk_level },
      });

      res.json(result);
    } catch (err) {
      next(err);
    }
  }
);

/**
 * POST /api/predictions/optimize
 * Computes optimal redistribution plan between facilities
 */
router.post(
  "/optimize",
  authenticate,
  authorize("CENTRAL_ADMIN", "STATE_ADMIN", "LOGISTICS_COORDINATOR"),
  validate(optimizationSchema),
  async (req, res, next) => {
    try {
      const user = (req as any).user as AuthUser;
      const result = await MLService.optimizeRedistribution(req.body);

      await logAudit({
        userId: user.userId,
        action: "OPTIMIZE_REDISTRIBUTION",
        entity: "Optimization",
        details: {
          sourcesCount: req.body.sources.length,
          destinationsCount: req.body.destinations.length,
          planCount: result.redistribution_plan.length,
        },
      });

      res.json(result);
    } catch (err) {
      next(err);
    }
  }
);

/**
 * GET /api/predictions/phc/:phcId
 * Aggregated prediction and risk report for all inventory at a PHC
 */
router.get(
  "/phc/:phcId",
  authenticate,
  authorize("CENTRAL_ADMIN", "STATE_ADMIN", "PHC_ADMIN"),
  authorizePhcAccess("params", "phcId"),
  async (req, res, next) => {
    try {
      const phcId = Array.isArray(req.params.phcId) ? req.params.phcId[0] : req.params.phcId;

      const inventoryItems = await prisma.inventory.findMany({
        where: { phcId },
        include: { medicine: true },
      });

      const today = new Date();
      const dayOfWeek = (today.getDay() + 6) % 7; // Monday = 0
      const month = today.getMonth() + 1; // Jan = 1

      // Fetch recent patient footfall estimate for context
      const latestPatientData = await prisma.patientData.findFirst({
        where: { phcId },
        orderBy: { date: "desc" },
      });
      const patientFootfall = latestPatientData?.totalVisits ?? 50;

      const results = await Promise.all(
        inventoryItems.map(async (inv) => {
          let predictedDemand = Math.max(1, Math.round(inv.minStock * 0.3));
          let riskLevel: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW" = "LOW";
          let daysRemaining: number | null = inv.quantity > 0 && predictedDemand > 0
            ? Math.round((inv.quantity / predictedDemand) * 10) / 10
            : 0;

          try {
            // Attempt live ML demand prediction
            const mlDemand = await MLService.predictDemand({
              phc_id: phcId,
              medicine_id: inv.medicineId,
              stock: inv.quantity,
              patient_footfall: patientFootfall,
              temperature: 28.0,
              disease_cases: 5,
              day_of_week: dayOfWeek,
              month: month,
              lag_1: predictedDemand,
              lag_7: predictedDemand,
              rolling_mean_7: predictedDemand,
            });
            predictedDemand = mlDemand.predicted_demand;
            riskLevel = mlDemand.risk_level as any;

            if (predictedDemand > 0) {
              daysRemaining = Math.round((inv.quantity / predictedDemand) * 10) / 10;
            } else {
              daysRemaining = null;
            }
          } catch {
            // Fallback calculation if ML service is offline
            if (daysRemaining !== null) {
              if (daysRemaining < 3) riskLevel = "CRITICAL";
              else if (daysRemaining < 7) riskLevel = "HIGH";
              else if (daysRemaining <= 14) riskLevel = "MEDIUM";
              else riskLevel = "LOW";
            }
          }

          return {
            id: inv.id,
            medicineId: inv.medicineId,
            medicineName: inv.medicine.name,
            category: inv.medicine.category || "General",
            unit: inv.medicine.unit,
            currentStock: inv.quantity,
            minStock: inv.minStock,
            predictedDailyDemand: predictedDemand,
            daysRemaining,
            riskLevel,
          };
        })
      );

      res.json({
        phcId,
        count: results.length,
        items: results,
      });
    } catch (err) {
      next(err);
    }
  }
);

export default router;
