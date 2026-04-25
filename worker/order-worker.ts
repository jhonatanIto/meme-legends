import { Job, Worker } from "bullmq";
import { connection } from "../lib/redis";
import { createOrder, submitOrder } from "./controller";

new Worker(
  "order-queue",
  async (job: Job) => {
    switch (job.name) {
      case "create-order":
        return createOrder(job);

      case "submit-order":
        console.log("PROCESSANDO SUBMIT ORDER", job.data);
        return submitOrder(job);
    }
  },
  {
    connection,
    concurrency: 5,
  },
);
