import { Worker } from "bullmq";
import { redis } from "../config/redis";

export const medicineWorker = new Worker(
  "medicine-jobs",
  async (job) => {
    console.log("Processing job:", job.name, job.data);
  },
  {
    connection: redis,
  }
);