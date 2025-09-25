import dotenv from "dotenv";
dotenv.config();
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});
   
export async function sendVerificationEmail(to, code) {
  await transporter.sendMail({
    from: `"PromptVault" <${process.env.GMAIL_USER}>`,
    to,
    subject: "Your Verification Code",
    text: `Your verification code is: ${code}`,
    html: `<b>Your verification code is: ${code}</b>`
  });
}
