import express from "express";
import Admin from "./models/admin.js";
import crypto from "crypto";
import nodemailer from "nodemailer";

const router = express.Router();
const otpStore = {}; // optional, future OTP use ke liye

// POST /api/admin/forgot-password
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ success: false, message: "Email required" });

    // Admin check
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(404).json({ success: false, message: "Admin not found" });

    // Generate temporary password
    const tempPassword = crypto.randomBytes(4).toString("hex"); // 8-char hex
    admin.password = tempPassword; // NOTE: hash if using bcrypt in production
    await admin.save();

    // Optional OTP storage
    const otp = crypto.randomInt(100000, 999999); // 6-digit OTP
    otpStore[email] = { otp, expires: Date.now() + 5*60*1000 }; // 5 min expiry

    // Send email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: admin.email,
      subject: "Kindergarten Admin Password Reset",
      text: `Hello Admin,

You requested a password reset.

Your temporary password is: ${tempPassword}

(Optional) Your OTP for verification is: ${otp}

Please use this password to login and change it immediately.
- Kindergarten Team`
    });

    res.json({ success: true, message: "Temporary password sent to your email." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Could not send reset email." });
  }
});

export default router;

