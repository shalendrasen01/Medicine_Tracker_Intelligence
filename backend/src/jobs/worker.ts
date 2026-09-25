import { Worker, Job } from "bullmq";
import { redis } from "../config/redis";
import { prisma } from "../config/database";
import { emitAlertCreated } from "../sockets/socket";

export interface LowStockJobPayload {
  phcId?: string;
  threshold?: number;
  message?: string;
}

export async function runLowStockCheck(payload?: LowStockJobPayload) {
  const whereClause: any = {};
  if (payload?.phcId) {
    whereClause.phcId = payload.phcId;
  }

  const inventories = await prisma.inventory.findMany({
    where: whereClause,
    include: {
      medicine: true,
      phc: true,
    },
  });

  let alertsCreated = 0;
  let alertsUpdated = 0;

  for (const item of inventories) {
    const isLow = item.quantity < item.minStock;

    // Check for existing unread alert
    const existingAlert = await prisma.alert.findFirst({
      where: {
        phcId: item.phcId,
        medicineId: item.medicineId,
        type: "LOW_STOCK",
        isRead: false,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (isLow) {
      const message = `Low stock alert: ${item.medicine.name} at ${item.phc.name} (Current: ${item.quantity} ${item.medicine.unit}, Min: ${item.minStock} ${item.medicine.unit})`;

      if (existingAlert) {
        // Update existing unread alert without spamming new alerts
        await prisma.alert.update({
          where: { id: existingAlert.id },
          data: { message },
        });
        alertsUpdated++;
      } else {
        // Create new alert and emit real-time event
        const alert = await prisma.alert.create({
          data: {
            phcId: item.phcId,
            medicineId: item.medicineId,
            type: "LOW_STOCK",
            message,
            isRead: false,
          },
        });
        emitAlertCreated(alert);
        alertsCreated++;
      }
    } else if (existingAlert && !isLow) {
      // Stock has been replenished, auto-resolve previous unread low-stock alert
      await prisma.alert.update({
        where: { id: existingAlert.id },
        data: {
          isRead: true,
          message: `${existingAlert.message} (Resolved: current stock is ${item.quantity} ${item.medicine.unit})`,
        },
      });
      alertsUpdated++;
    }
  }

  return {
    status: "completed",
    scanned: inventories.length,
    lowStockFound: inventories.filter((i) => i.quantity < i.minStock).length,
    alertsCreated,
    alertsUpdated,
  };
}

export const medicineWorker = new Worker(
  "medicine-jobs",
  async (job: Job) => {
    console.log(`[BullMQ Worker] Processing job ${job.id}: ${job.name}`);

    switch (job.name) {
      case "low-stock-check": {
        const result = await runLowStockCheck(job.data as LowStockJobPayload);
        console.log(`[BullMQ Worker] low-stock-check completed:`, result);
        return result;
      }
      case "test-job": {
        console.log(`[BullMQ Worker] test-job received:`, job.data);
        return { status: "success", data: job.data };
      }
      default: {
        console.warn(`[BullMQ Worker] Unknown job name: ${job.name}`);
        return { status: "unknown_job", name: job.name };
      }
    }
  },
  {
    connection: redis,
  }
);

medicineWorker.on("completed", (job) => {
  console.log(`[BullMQ Worker] Job ${job.id} completed successfully`);
});

medicineWorker.on("failed", (job, err) => {
  console.error(`[BullMQ Worker] Job ${job?.id} failed:`, err);
});