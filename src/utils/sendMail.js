import dotenv from "dotenv";
dotenv.config();
import nodemailer from "nodemailer";
import express from "express";
const router = express.Router();

export async function sendVerificationEmail(to, code) {
  try {
    await transporter.sendMail({
      from: `"PromptVault" <${process.env.GMAIL_USER}>`,
      to,
      subject: "Your Verification Code",
      text: `Your verification code is: ${code}`,
      html: `<b>Your verification code is: ${code}</b>`,
    });
    console.log(`Verification email sent to ${to}`);
    return true; // optional
  } catch (err) {
    console.error(`Failed to send verification email to ${to}:`, err.message);
    return false; // continue registration without crashing
  }
}
