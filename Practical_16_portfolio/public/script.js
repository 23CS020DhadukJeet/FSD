(function () {
  const $ = (q) => document.querySelector(q);

  // ===== IST Clock =====
  function startISTClock() {
    const el = $("#clock");
    if (!el) return;
    function tick() {
      const now = new Date();
      const utc = now.getTime() + now.getTimezoneOffset() * 60000;
      const ist = new Date(utc + 5.5 * 3600000);
      const hh = String(ist.getHours()).padStart(2, "0");
      const mm = String(ist.getMinutes()).padStart(2, "0");
      const ss = String(ist.getSeconds()).padStart(2, "0");
      el.textContent = `${hh}:${mm}:${ss}`;
    }
    tick();
    setInterval(tick, 1000);
  }

  // ===== Contact Form =====
  function setupContactForm() {
    const form = $("#contactForm");
    if (!form) return;

    const statusBox = $("#status");
    const btn = $("#submitBtn");

    function showStatus(msg, type = "info") {
      statusBox.hidden = false;
      statusBox.textContent = msg;
      statusBox.className = `toast ${type === "ok" ? "ok" : type === "err" ? "err" : ""}`;
    }

    function isEmail(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }

    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const name = $("#name")?.value.trim() || "";
      const email = $("#email")?.value.trim() || "";
      const company = $("#company")?.value.trim() || "";
      const message = $("#message")?.value.trim() || "";

      if (name.length < 2) return showStatus("Please enter your full name.", "err");
      if (!isEmail(email)) return showStatus("Please enter a valid email address.", "err");
      if (message.length < 10) return showStatus("Message should be at least 10 characters.", "err");

      btn.disabled = true;
      btn.textContent = "Sending…";
      showStatus("Sending your message…", "info");

      try {
        const res = await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, company, message })
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok || !data.ok) {
          showStatus(data.message || "Server error while sending email. Please try again later.", "err");
        } else {
          showStatus("Thank you! Your message has been sent.", "ok");
          form.reset();
        }
      } catch (_) {
        showStatus("Network error. Please try again.", "err");
      } finally {
        btn.disabled = false;
        btn.textContent = "Submit";
      }
    });
  }

  function setYear() {
    const y = document.getElementById("year");
    if (y) y.textContent = new Date().getFullYear();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      startISTClock(); setupContactForm(); setYear();
    });
  } else {
    startISTClock(); setupContactForm(); setYear();
  }
})();
