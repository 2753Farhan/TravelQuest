import nodemailer from 'nodemailer';
import { env } from "../../shared/config/env.ts";

export class EmailService {
  private transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: env.EMAIL_USER,
      pass: env.EMAIL_PASS
    }
  });

  async sendVerificationEmail(to: string, token: string): Promise<void> {
    const verificationUrl = `${env.FRONTEND_URL}/auth/verify-email/${token}`;
    
    await this.transporter.sendMail({
      from: `"Cefalo TravelQuest" <${env.EMAIL_USER}>`,
      to,
      subject: 'Verify Your Email',
      html: `
        <h1>Welcome to Cefalo TravelQuest!</h1>
        <p>Please click the link below to verify your email address:</p>
        <a href="${verificationUrl}">Verify Email</a>
      `
    });
  }

  async sendPasswordResetEmail(to: string, token: string): Promise<void> {
    const resetUrl = `${env.FRONTEND_URL}/reset-password?token=${token}`;
    
    await this.transporter.sendMail({
      from: `"Cefalo Travel Connect" <${env.EMAIL_USER}>`,
      to,
      subject: 'Password Reset Request',
      html: `
        <h1>Password Reset</h1>
        <p>You requested to reset your password. Click the link below to proceed:</p>
        <a href="${resetUrl}">Reset Password</a>
        <p>This link will expire in 1 hour.</p>
      `
    });
  }
}