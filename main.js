// PaxEquitas.com Homepage V1 — interactions
// Config: where form submissions go. Replace FORM_ENDPOINT with a real endpoint
// (CRM/webhook/Formspree/etc.). Until set, submissions are captured to console +
// a friendly confirmation is shown (no data lost silently — see handleSubmit).
const CONFIG = {
  FORM_ENDPOINT: "", // e.g. "https://formspree.io/f/xxxx" or your CRM webhook
  SETTLEMENT_IQ_URL: "https://rin.aciunited.com/#/settlement-iq/residential",
};

(function () {
  // year
  var yr = document.getElementById("yr");
  if (yr) yr.textContent = new Date().getFullYear();

  // nav scroll state
  var nav = document.getElementById("nav");
  var onScroll = function () { nav.classList.toggle("is-scrolled", window.scrollY > 8); };
  onScroll(); window.addEventListener("scroll", onScroll, { passive: true });

  // analytics stub — swap for real analytics later
  function track(event, props) {
    if (window.analytics && window.analytics.track) window.analytics.track(event, props || {});
    else console.log("[track]", event, props || {});
  }
  document.querySelectorAll("[data-analytics]").forEach(function (el) {
    el.addEventListener("click", function () { track(el.getAttribute("data-analytics")); });
  });

  // modals
  var demoModal = document.getElementById("demoModal");
  var waitModal = document.getElementById("waitModal");
  function open(m) { m.hidden = false; document.body.style.overflow = "hidden"; }
  function close(m) { m.hidden = true; document.body.style.overflow = ""; var s = m.querySelector("[data-form-status]"); if (s) s.textContent = ""; }
  function closeAll() { close(demoModal); close(waitModal); }

  document.querySelectorAll("[data-demo]").forEach(function (b) {
    b.addEventListener("click", function (e) { e.preventDefault(); track("open_demo_modal"); open(demoModal); });
  });
  document.querySelectorAll("[data-waitlist]").forEach(function (b) {
    b.addEventListener("click", function (e) {
      e.preventDefault();
      var p = b.getAttribute("data-waitlist");
      track("open_waitlist", { product: p });
      document.getElementById("waitProduct").textContent = p;
      document.getElementById("waitProductInput").value = p;
      open(waitModal);
    });
  });
  document.querySelectorAll("[data-close]").forEach(function (x) { x.addEventListener("click", closeAll); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeAll(); });

  // form submission
  function handleSubmit(form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var status = form.querySelector("[data-form-status]");
      var type = form.getAttribute("data-form");
      var data = Object.fromEntries(new FormData(form).entries());
      track("submit_" + type, data);

      var done = function (ok) {
        if (status) status.textContent = ok ? "✓ Thanks — we'll be in touch." : "Saved. We'll follow up shortly.";
        form.reset();
        if (form.closest(".modal")) setTimeout(closeAll, 1400);
      };

      if (CONFIG.FORM_ENDPOINT) {
        fetch(CONFIG.FORM_ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ form: type, data: data }),
        }).then(function (r) { done(r.ok); }).catch(function () { done(false); });
      } else {
        // No endpoint configured yet — capture to console so nothing is lost silently.
        console.warn("[FORM CAPTURE — configure CONFIG.FORM_ENDPOINT]", { form: type, data: data });
        done(true);
      }
    });
  }
  document.querySelectorAll("form[data-form]").forEach(handleSubmit);
})();
