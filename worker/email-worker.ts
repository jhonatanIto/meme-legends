import { Worker } from "bullmq";
import { connection } from "../lib/redis";
import { sendOrderConfirmationEmail } from "../lib/email";

new Worker(
  "order-queue",
  async (job) => {
    if (job.name === "send-order-confirmation-email") {
      const { email, orderId, name } = job.data;

      await sendOrderConfirmationEmail({
        email,
        orderId,
        name,
      });
    }
  },
  {
    connection,
  },
);
