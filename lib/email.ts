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

export const receiveIssueMessage = async (
  prevState: { success: boolean } | null,
  formData: FormData,
): Promise<{ success: boolean }> => {
  const email = formData.get("email") as string;
  const name = formData.get("name") as string;
  const message = formData.get("message") as string;
  const file = formData.get("file") as File | null;

  if (!email || !name || !message) {
    throw new Error("Missing fields");
  }

  const attachments = [];

  if (file && file.size > 0) {
    if (file.size > 5 * 1024 * 1024) {
      throw new Error("File too large (max 5MB)");
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    attachments.push({
      filename: file.name,
      content: buffer,
    });
  }

  await resend.emails.send({
    from: "Meme Legends <contact@meme-legends.com>",
    replyTo: email,
    to: "contact@meme-legends.com",
    subject: `Issue for the user ${name}`,
    html: `
  <div>
    <p><strong>Name:</strong> ${name}</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Message:</strong></p>
    <p>${message}</p>
  </div>
`,
    attachments,
  });

  return { success: true };
};
