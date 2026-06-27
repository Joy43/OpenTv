import nodemailer from "nodemailer";
import config from "../config";

import status from "http-status";
import AppError from "../errors/AppError";

const sendEmail = async (email: string, resetLink: string) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for port 465, false for other ports
    auth: {
      user: config.email.sender,
      pass: config.email.pass,
    },
  });

  try {
    const info = await transporter.sendMail({
      from: '"Alamin Sujon 👻" <alsujon2001@gmail.com>',
      to: email,
      subject: "Reset Your Password",
      html: `
               <div style="font-family: Arial, sans-serif; line-height: 1.5;">
          <h2>Password Reset Request</h2>
          <p>Hi there,</p>
          <p>You requested to reset your password. Click the button below to set a new password:</p>
          <a href="${resetLink}" style="display: inline-block; margin-top: 10px; padding: 10px 20px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px;">Reset Password</a>
          <p style="margin-top: 20px;">If you did not request a password reset, you can safely ignore this email.</p>
          <p>Thanks,<br/>The Your Company Team</p>
        </div>

        `,
    });
  } catch (error) {
    throw new AppError(status.BAD_REQUEST, "Email sending failed");
  }
};

export default sendEmail;
