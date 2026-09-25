import express from "express";
import cors from "cors";
import helmet from "helmet";
import authRoutes from "./routes/authRoutes";
import testRoutes from "./routes/testRoutes";
import medicineRoutes from "./routes/medicineRoutes";
import inventoryRoutes from "./routes/inventoryRoutes";
import transferRoutes from "./routes/transferRoutes";
import shipmentRoutes from "./routes/shipmentRoutes";
import alertRoutes from "./routes/alertRoutes";
import bedRoutes from "./routes/bedRoutes";
import patientRoutes from "./routes/patientRoutes";
import resourceRoutes from "./routes/resourceRoutes";
import staffRoutes from "./routes/staffRoutes";
import auditRoutes from "./routes/auditRoutes";
import jobRoutes from "./routes/jobRoutes";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler";
import { prisma } from "./config/database";
import { redis } from "./config/redis";
const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/test", testRoutes);
app.use("/api/medicines", medicineRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/transfers", transferRoutes);
app.use("/api/shipments", shipmentRoutes);
app.use("/api/alerts", alertRoutes);
app.use("/api/beds", bedRoutes);
app.use("/api/patients", patientRoutes);
app.use("/api/resources", resourceRoutes);
app.use("/api/staff", staffRoutes);
app.use("/api/audit", auditRoutes);
app.use("/api/jobs", jobRoutes);

app.get("/health", async (_req, res) => {
  let dbStatus = "connected";
  let redisStatus = "connected";

  try {
    await prisma.$queryRaw`SELECT 1`;
  } catch (err) {
    dbStatus = "disconnected";
  }

  try {
    await redis.ping();
  } catch (err) {
    redisStatus = "disconnected";
  }

  const isHealthy = dbStatus === "connected" && redisStatus === "connected";
  const statusCode = isHealthy ? 200 : 503;

  res.status(statusCode).json({
    status: isHealthy ? "ok" : "degraded",
    timestamp: new Date().toISOString(),
    services: {
      database: dbStatus,
      redis: redisStatus,
    },
  });
});

// Centralized 404 and Error handling
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
