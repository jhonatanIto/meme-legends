import { Queue } from "bullmq";
import { connection } from "./redis";

export const orderQueue = new Queue("order-queue", {
  connection,
});

export const emailQueue = new Queue("email-queue", {
  connection,
});
