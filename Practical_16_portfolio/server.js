import express from "express";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import path from "path";
import helmet from "helmet";
import cors from "cors";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number((process.env.PORT || "3000").trim());

/* -------------------- Middleware -------------------- */
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
app.use(cors({ origin: false }));
app.use(express.json({ limit: "200kb" }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

/* -------------------- Utils -------------------- */
const trim = (v) => (typeof v === "string" ? v.trim() : v);
const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v || "").toLowerCase());
const escapeHtml = (s = "") =>
  String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

function resolveSecure(port, secureEnv) {
  const p = Number(port);
  if (p === 465) return true;           // SMTPS
  if (p === 587 || p === 25) return false; // STARTTLS/plain
  return String(secureEnv).toLowerCase() === "true";
}

/* -------------------- Transporter builders -------------------- */
function buildGmailTransporter() {
  const host = trim(process.env.SMTP_HOST);
  const port = Number(trim(process.env.SMTP_PORT || "587"));
  const secure = resolveSecure(port, trim(process.env.SMTP_SECURE));
  const user = trim(process.env.SMTP_USER);
  // Remove spaces from App Password just in case it was pasted with spaces
  const pass = (trim(process.env.SMTP_PASS) || "").replace(/\s+/g, "");

  const missing = [];
  if (!host) missing.push("SMTP_HOST");
  if (!port) missing.push("SMTP_PORT");
  if (!user) missing.push("SMTP_USER");
  if (!pass) missing.push("SMTP_PASS");
  if (missing.length) throw new Error(`Missing SMTP keys: ${missing.join(", ")}`);

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass }
  });
}

function buildMailtrapTransporter() {
  const host = trim(process.env.MAILTRAP_HOST);
  const port = Number(trim(process.env.MAILTRAP_PORT || "587"));
  const user = trim(process.env.MAILTRAP_USER);
  const pass = trim(process.env.MAILTRAP_PASS);

  const missing = [];
  if (!host) missing.push("MAILTRAP_HOST");
  if (!port) missing.push("MAILTRAP_PORT");
  if (!user) missing.push("MAILTRAP_USER");
  if (!pass) missing.push("MAILTRAP_PASS");
  if (missing.length) throw new Error(`Missing Mailtrap keys: ${missing.join(", ")}`);

  return nodemailer.createTransport({
    host,
    port,
    secure: false,
    auth: { user, pass }
  });
}

function getTransporter() {
  const useMailtrap = String(process.env.USE_MAILTRAP || "false").toLowerCase() === "true";
  return useMailtrap ? buildMailtrapTransporter() : buildGmailTransporter();
}

/* -------------------- Create & verify transporter -------------------- */
let transporter;
(async () => {
  try {
    transporter = getTransporter();
    await transporter.verify();
    console.log("✅ Mail transporter ready");
  } catch (err) {
    console.error("❌ Mail transporter not ready:", err?.message || err);
  }
})();

/* -------------------- API: Contact -------------------- */
app.post("/api/contact", async (req, res) => {
  try {
    const name = trim(req.body?.name);
    const email = trim(req.body?.email);
    const message = trim(req.body?.message);
    const company = trim(req.body?.company);

    if (!name || name.length < 2) return res.status(400).json({ ok: false, message: "Please enter your full name." });
    if (!email || !isEmail(email)) return res.status(400).json({ ok: false, message: "Please enter a valid email address." });
    if (!message || message.length < 10) return res.status(400).json({ ok: false, message: "Message should be at least 10 characters." });
    if (!transporter) return res.status(500).json({ ok: false, message: "Email transport is not configured on server." });

    const SMTP_USER = trim(process.env.SMTP_USER || "");
    const MAIL_TO = trim(process.env.MAIL_TO || SMTP_USER);
    const MAIL_FROM_NAME = trim(process.env.MAIL_FROM_NAME || "Portfolio");

    if (!MAIL_TO) return res.status(500).json({ ok: false, message: "Receiver email not configured on server." });

    // Gmail rule: from must equal authenticated user
    const mail = {
      to: MAIL_TO,
      from: { name: MAIL_FROM_NAME, address: SMTP_USER || MAIL_TO },
      replyTo: `${name} <${email}>`,
      subject: `Portfolio Inquiry — ${name}${company ? " · " + company : ""}`,
      text: `From: ${name} <${email}>\nCompany: ${company || "-"}\n\n${message}`,
      html: `
        <h2>New Portfolio Inquiry</h2>
        <p><b>Name:</b> ${escapeHtml(name)}</p>
        <p><b>Email:</b> ${escapeHtml(email)}</p>
        <p><b>Company:</b> ${escapeHtml(company || "-")}</p>
        <p><b>Message:</b></p>
        <p>${escapeHtml(message).replace(/\n/g, "<br/>")}</p>
      `
    };

    await transporter.sendMail(mail);
    return res.json({ ok: true, message: "Your message has been sent successfully!" });
  } catch (err) {
    // Friendly hints
    const code = err?.code || "";
    const hint =
      code === "EAUTH" ? "Email login failed. Check SMTP_USER and SMTP_PASS (use Gmail App Password—16 chars, no spaces, same account)." :
      code === "ENOTFOUND" ? "SMTP host not found. Check SMTP_HOST." :
      code === "ECONNECTION" ? "SMTP connection failed. Check SMTP_HOST/SMTP_PORT/SMTP_SECURE." :
      err?.response?.includes("Invalid login") ? "Invalid SMTP credentials." :
      "Server error while sending email. Please try again later.";

    console.error("Mailer error:", err);
    return res.status(500).json({ ok: false, message: hint });
  }
});

/* -------------------- Debug (safe) -------------------- */
app.get("/api/debug/env", (req, res) => {
  const has = (k) => Boolean(trim(process.env[k]));
  res.json({
    ok: true,
    provider: String(process.env.USE_MAILTRAP || "false").toLowerCase() === "true" ? "mailtrap" : "gmail",
    has: {
      SMTP_HOST: has("SMTP_HOST"),
      SMTP_PORT: has("SMTP_PORT"),
      SMTP_USER: has("SMTP_USER"),
      SMTP_PASS: has("SMTP_PASS"),
      MAIL_TO: has("MAIL_TO")
    }
  });
});

app.get("/api/debug/mail", async (req, res) => {
  try {
    const t = getTransporter();
    const ok = await t.verify();
    res.json({ ok: true, verify: ok });
  } catch (e) {
    res.status(500).json({ ok: false, error: String(e.message || e) });
  }
});

/* -------------------- Health & SPA -------------------- */
app.get("/health", (_, res) => res.json({ ok: true }));
app.get("*", (_, res) => res.sendFile(path.join(__dirname, "public", "index.html")));

app.listen(PORT, () => console.log(`🚀 Portfolio running at http://localhost:${PORT}`));
