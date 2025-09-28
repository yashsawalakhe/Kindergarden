import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import crypto from "crypto";
import nodemailer from "nodemailer";

import Contact from "./models/Contact.js";
import Admission from "./models/Admission.js";
import Admin from "./admin.js"; // Admin model for login & forgot password

dotenv.config();

const app = express();

// =========================
// ✅ Middleware
// =========================
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// =========================
// ✅ MongoDB Connection
// =========================
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/kindergarten";

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB Connected"))
.catch(err => {
  console.error("❌ DB Connection Error:", err.message);
  process.exit(1);
});

// =========================
// 📌 Routes
// =========================

// GET all contact messages
app.get("/api/contact", async (req, res) => {
  try {
    const contacts = await Contact.find();
    res.json({ success: true, contacts });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET all admission forms
app.get("/api/admission", async (req, res) => {
  try {
    const admissions = await Admission.find();
    res.json({ success: true, admissions });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST contact form
app.post("/api/contact", async (req, res) => {
  try {
    const contact = new Contact(req.body);
    await contact.save();
    res.json({ success: true, message: "Contact message saved!" });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// POST admission form
app.post("/api/admission", async (req, res) => {
  try {
    const admission = new Admission(req.body);
    await admission.save();
    res.json({ success: true, message: "Admission form submitted!" });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// =========================
// 📌 Admin Forgot Password
// =========================
app.post("/api/admin/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ success: false, message: "Email required" });

    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(404).json({ success: false, message: "Admin not found" });

    const tempPassword = crypto.randomBytes(4).toString("hex"); // 8 char temp password
    admin.password = tempPassword; // hash if using bcrypt
    await admin.save();

    // Nodemailer setup
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: admin.email,
      subject: "Kindergarten Admin Password Reset",
      text: `Your temporary password is: ${tempPassword}`
    });

    res.json({ success: true, message: "Temporary password sent to your email." });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
});

// =========================
// ✅ Start Server
// =========================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

