import { Queue } from "bullmq";
import { redis } from "../config/redis";

export const medicineQueue = new Queue("medicine-jobs", {
  connection: redis,
});