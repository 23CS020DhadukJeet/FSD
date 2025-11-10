// Clock (IST)
const clockEl = document.getElementById("clock");
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

function tick() {
  const now = new Date();
  const utc = now.getTime() + now.getTimezoneOffset() * 60000;
  const ist = new Date(utc + 5.5 * 3600000);
  const hh = String(ist.getHours()).padStart(2, "0");
  const mm = String(ist.getMinutes()).padStart(2, "0");
  const ss = String(ist.getSeconds()).padStart(2, "0");
  if (clockEl) clockEl.textContent = `${hh}:${mm}:${ss}`;
}
setInterval(tick, 1000); tick();

// Contact form
const $ = (q) => document.querySelector(q);
const form = $("#contactForm");
const statusBox = $("#status");
const btn = $("#submitBtn");

function showStatus(msg, type = "info") {
  statusBox.hidden = false;
  statusBox.textContent = msg;
  statusBox.className = `toast ${type === "ok" ? "ok" : type === "err" ? "err" : ""}`;
}

function validate() {
  const name = $("#name").value.trim();
  const email = $("#email").value.trim();
  const company = $("#company").value.trim();
  const message = $("#message").value.trim();
  const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  const errors = {};
  if (name.length < 2) errors.name = "Please enter your full name.";
  if (!isEmail(email)) errors.email = "Please enter a valid email address.";
  if (message.length < 10) errors.message = "Message should be at least 10 characters.";
  return { ok: Object.keys(errors).length === 0, errors, data: { name, email, company, message } };
}

if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const { ok, errors, data } = validate();
    if (!ok) {
      showStatus(Object.values(errors)[0], "err");
      return;
    }
    btn.disabled = true;
    btn.textContent = "Sending…";
    showStatus("Sending your message…");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, honeypot: form.querySelector("[name='honeypot']").value })
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok || !body.ok) {
        const msg = body.errors ? Object.values(body.errors)[0] : (body.message || "Failed to send.");
        showStatus(msg, "err");
      } else {
        showStatus("Thank you! Your message has been sent.", "ok");
        form.reset();
      }
    } catch (err) {
      showStatus("Network error. Please try again.", "err");
    } finally {
      btn.disabled = false;
      btn.textContent = "Submit";
    }
  });
}
