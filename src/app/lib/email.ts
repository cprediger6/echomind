import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail", // o configuración SMTP
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function sendAlertEmail(
  to: string,
  subject: string,
  html: string,
) {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject,
    html,
  });
}
