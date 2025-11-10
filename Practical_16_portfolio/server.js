import express from "express";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import helmet from "helmet";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Security headers (allow our CSS/JS + inline styles for effects)
app.use(
  helmet({
    contentSecurityPolicy: {
      useDefaults: true,
      directives: {
        "default-src": ["'self'"],
        "script-src": ["'self'"],
        "style-src": ["'self'", "'unsafe-inline'"],
        "img-src": ["'self'", "data:"],
        "connect-src": ["'self'"],
        "font-src": ["'self'", "data:"]
      }
    }
  })
);

app.use(cors({ origin: false })); // same-origin only
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname, "public")));

// Helpers
const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v || "").toLowerCase());
const clean = (s) => String(s || "").trim();
const escapeHtml = (s = "") =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

// Contact API
app.post("/api/contact", async (req, res) => {
  try {
    const { name, email, message, company, honeypot } = req.body || {};
    const n = clean(name);
    const e = clean(email);
    const m = clean(message);
    const c = clean(company);

    const errors = {};
    if (honeypot) return res.status(400).json({ ok: false, message: "Spam detected." });
    if (!n || n.length < 2) errors.name = "Please enter your full name.";
    if (!e || !isEmail(e)) errors.email = "Please enter a valid email address.";
    if (!m || m.length < 10) errors.message = "Message should be at least 10 characters.";
    if (m.length > 4000) errors.message = "Message too long (max 4000 characters).";
    if (Object.keys(errors).length) return res.status(400).json({ ok: false, errors });

    const {
      SMTP_HOST,
      SMTP_PORT,
      SMTP_SECURE,
      SMTP_USER,
      SMTP_PASS,
      MAIL_TO,
      MAIL_FROM_NAME,
      MAIL_FROM_EMAIL
    } = process.env;

    if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS || !MAIL_TO) {
      return res
        .status(500)
        .json({ ok: false, message: "Email is not configured on the server." });
    }

    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: Number(SMTP_PORT),
      secure: String(SMTP_SECURE).toLowerCase() === "true", // true for 465
      auth: { user: SMTP_USER, pass: SMTP_PASS }
    });

    const subject = `New inquiry from ${n}${c ? " · " + c : ""}`;
    const text = `From: ${n} <${e}>\nCompany: ${c || "-"}\n\n${m}`;
    const html = `
      <h2>New Portfolio Inquiry</h2>
      <p><b>Name:</b> ${escapeHtml(n)}</p>
      <p><b>Email:</b> ${escapeHtml(e)}</p>
      <p><b>Company:</b> ${escapeHtml(c || "-")}</p>
      <p><b>Message:</b></p>
      <p>${escapeHtml(m).replace(/\n/g, "<br/>")}</p>
    `;

    const info = await transporter.sendMail({
      to: MAIL_TO,
      from: {
        name: MAIL_FROM_NAME || "Portfolio",
        address: MAIL_FROM_EMAIL || SMTP_USER
      },
      replyTo: `${n} <${e}>`,
      subject,
      text,
      html
    });

    return res.json({ ok: true, messageId: info.messageId });
  } catch (err) {
    console.error("Mailer error:", err);
    return res.status(500).json({ ok: false, message: "Failed to send message. Try later." });
  }
});

// Health check
app.get("/health", (req, res) => res.json({ ok: true }));

// SPA-style fallback
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
