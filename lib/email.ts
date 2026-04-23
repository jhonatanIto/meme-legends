"use server";

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
    from: "Meme Legends <noreply@meme-legends.com>",
    replyTo: "contact@meme-legends.com",
    to: email,
    subject: `Your order #${orderId} is confirmed!`,
    html: `
      <div>
        <h2>Payment confirmed 🎉</h2>
        <p>Hi ${name}! Your order #${orderId} has been received.</p>
        <p>We are now preparing your items.</p>
      </div>
    `,
  });
};

export const receiveIssueMessage = async (formData: FormData) => {
  const email = formData.get("email") as string;
  const name = formData.get("name") as string;
  const message = formData.get("message") as string;
  console.log("entrou aqui");

  if (!email || !name || !message) {
    throw new Error("Missing fields");
  }

  await resend.emails.send({
    from: "Your Store <onboarding@resend.dev>",
    replyTo: email,
    to: "jhonatan-ito@hotmail.com",
    subject: `Issue for the user ${name}`,
    html: `<div>${message}</div>`,
  });
};
