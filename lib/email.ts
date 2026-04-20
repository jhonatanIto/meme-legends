import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendShippingEmail = async ({
  email,
  orderId,
  trackingNumber,
}: {
  email: string;
  orderId: number;
  trackingNumber: string | null;
}) => {
  if (!email) return;

  await resend.emails.send({
    from: "Your Store <onboarding@resend.dev>",
    replyTo: "jhonatan-ito@hotmail.com",
    to: email,
    subject: `Your order #${orderId} has shipped 🚚`,
    html: `
      <div>
        <h2>Your order #${orderId} has been shipped!</h2>
        ${
          trackingNumber
            ? `<p>Tracking number: <b>${trackingNumber}</b></p>`
            : "<p>Tracking will be available soon.</p>"
        } 
      </div>`,
  });
};

export const sendOrderConfirmationEmail = async ({
  email,
  orderId,
  name,
}: {
  email: string;
  orderId: number;
  name: string;
}) => {
  if (!email) return;

  await resend.emails.send({
    from: "Your Store <onboarding@resend.dev>",
    replyTo: "jhonatan-ito@hotmail.com",
    to: email,
    subject: `Payment confirmed for order #${orderId}`,
    html: `
      <div>
        <h2>Payment confirmed 🎉</h2>
        <p>Hi ${name}! Your order #${orderId} has been received.</p>
        <p>We are now preparing your items.</p>
      </div>
    `,
  });
};
