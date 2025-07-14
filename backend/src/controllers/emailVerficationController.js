import nodemailer from "nodemailer";
import User from "../models/user.js";
export const sendOtp = async (email, otp) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASS,
    },
  });

  const html = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verify Your Email - Daintree</title>
    <style>
      @media only screen and (max-width: 600px) {
        .container { max-width: 100% !important; }
        .header { padding: 24px 16px !important; }
        .header h1 { font-size: 2rem !important; }
        .header p { font-size: 0.9rem !important; }
        .content { padding: 24px 16px !important; }
        .content-card { padding: 24px 16px !important; }
        .otp-container { padding: 16px 20px !important; margin: 20px 0 !important; }
        .otp-code { font-size: 2.2rem !important; letter-spacing: 0.3em !important; }
        .tip-box { padding: 12px 16px !important; margin: 16px 0 !important; }
        .security-notice { padding: 16px !important; margin: 16px 0 !important; }
        .features { grid-template-columns: 1fr !important; gap: 12px !important; margin: 24px 0 !important; }
        .footer { padding: 24px 16px !important; }
      }
    </style>
  </head>
  <body style="margin:0;padding:0;background:#0a0e1a;font-family:'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
    <div class="container" style="max-width:600px;margin:0 auto;background:linear-gradient(135deg,#0f172a 0%,#1e293b 100%);min-height:100vh;padding:0;">
      
      <!-- Header -->
      <div class="header" style="background:#1e293b;padding:40px 24px;text-align:center;border-bottom:3px solid #3b82f6;">
        <h1 style="color:#60a5fa;font-size:2.5rem;margin:0;font-weight:700;letter-spacing:0.5px;">Daintree</h1>
        <p style="color:#94a3b8;margin:8px 0 0 0;font-size:1rem;font-weight:400;">E-Commerce Platform</p>
      </div>

      <!-- Content -->
      <div class="content" style="padding:48px 24px;text-align:center;">
        <div class="content-card" style="background:rgba(59,130,246,0.1);border-radius:20px;padding:40px 32px;margin-bottom:32px;border:1px solid rgba(59,130,246,0.3);">
          <h2 style="color:#60a5fa;font-size:2rem;margin:0 0 16px 0;font-weight:700;">Verify Your Email</h2>
          <p style="color:#cbd5e1;font-size:1.1rem;margin:0 0 32px 0;line-height:1.6;">
            Welcome to Daintree! Please use the verification code below to confirm your email address and activate your account.
          </p>
          
          <!-- OTP Container -->
          <div class="otp-container" style="background:linear-gradient(135deg,#1e293b 0%,#334155 100%);padding:24px 32px;border-radius:16px;margin:32px 0;border:2px solid rgba(59,130,246,0.5);box-shadow:0 8px 32px rgba(0,0,0,0.3);">
            <span class="otp-code" style="font-size:2.8rem;letter-spacing:0.5em;font-weight:800;color:#60a5fa;text-shadow:0 2px 8px rgba(96,165,250,0.4);">${otp}</span>
          </div>
          
          <div class="tip-box" style="background:rgba(59,130,246,0.1);border-left:4px solid #60a5fa;padding:16px 20px;border-radius:0 12px 12px 0;margin:24px 0;text-align:left;">
            <p style="color:#cbd5e1;font-size:0.95rem;margin:0;line-height:1.5;">
              <strong style="color:#60a5fa;">💡 Quick Tip:</strong> Select the code above and copy it to your clipboard for easy pasting.
            </p>
          </div>
        </div>

        <!-- Security Notice -->
        <div class="security-notice" style="background:rgba(239,68,68,0.1);border:1px solid rgba(239,68,68,0.3);border-radius:12px;padding:20px;margin:24px 0;text-align:left;">
          <h3 style="color:#f87171;font-size:1.1rem;margin:0 0 8px 0;font-weight:600;">🔒 Security Notice</h3>
          <p style="color:#cbd5e1;font-size:0.9rem;margin:0;line-height:1.5;">
            This code will expire in <strong style="color:#60a5fa;">10 minutes</strong>. If you didn't request this verification, please ignore this email and your account will remain secure.
          </p>
        </div>

        <!-- Features -->
        <div class="features" style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin:32px 0;max-width:400px;margin-left:auto;margin-right:auto;">
          <div style="background:rgba(34,197,94,0.1);border:1px solid rgba(34,197,94,0.3);border-radius:12px;padding:16px;text-align:center;">
            <div style="font-size:1.5rem;margin-bottom:8px;">✅</div>
            <p style="color:#cbd5e1;font-size:0.85rem;margin:0;font-weight:500;">Secure Shopping</p>
          </div>
          <div style="background:rgba(168,85,247,0.1);border:1px solid rgba(168,85,247,0.3);border-radius:12px;padding:16px;text-align:center;">
            <div style="font-size:1.5rem;margin-bottom:8px;">🚀</div>
            <p style="color:#cbd5e1;font-size:0.85rem;margin:0;font-weight:500;">Fast Delivery</p>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="footer" style="background:rgba(0,0,0,0.3);padding:32px 24px;text-align:center;border-radius:20px 20px 0 0;">
        <div style="border-top:1px solid rgba(59,130,246,0.3);padding-top:24px;">
          <p style="color:#64748b;font-size:0.9rem;margin:0 0 8px 0;">
            &copy; ${new Date().getFullYear()} <strong style="color:#60a5fa;">Daintree</strong>. All rights reserved.
          </p>
          <p style="color:#64748b;font-size:0.85rem;margin:0;">
            Your trusted e-commerce platform for quality products.
          </p>
        </div>
      </div>
    </div>
  </body>
  </html>
  `;

  await transporter.sendMail({
    from: `"Daintree" <${process.env.EMAIL}>`,
    to: email,
    subject: "Your Daintree OTP Code",
    html,
  });
};
export const sendMailTest = async (req, res) => {
  try {
    const email = "mashrur950@gmail.com";
    const otp = "123456";
    await sendOtp(email, otp);
    res.status(200).json({ message: "Email sent successfully" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ message: "Failed to send email" });
  }
};
export const verifyOtp = async (req, res) => {
  try {
   
    const user = req.user;
    const email = user.email;
    const { otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }

    if (!user || user.otp !== otp || user.otpExpiresAt < Date.now()) {
      return res.status(404).json({ message: "Invalid OTP" });
    }
    user.emailVerified = true;
    user.otp = null;
    user.otpExpiresAt = null;
    await user.save();
    return res.status(200).json({ message: "OTP verified successfully" });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    res.status(500).json({ message: "Failed to verify OTP" });
  }
};
