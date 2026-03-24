import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  try {
    const response = await resend.emails.send({
      from: process.env.EMAIL_FROM as string,
      to,
      subject,
      html,
    });

    console.log("✅ Email enviado:", response);
    return response;
  } catch (error) {
    console.error("❌ Error enviando email:", error);
    throw error;
  }
}
