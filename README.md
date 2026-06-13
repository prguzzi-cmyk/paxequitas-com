# PaxEquitas.com — Homepage V1

Production-ready static marketing homepage for the Pax Equitas platform.
Dark, premium, outcome-organized (Detect / Recover / Verify / Scale).
No build step — pure HTML/CSS/JS. Deploy anywhere static (Vercel recommended).

## Files
- `index.html` — homepage (all sections + demo & waitlist modals)
- `styles.css` — dark design system
- `main.js` — modals, form capture, nav, analytics stubs
- `privacy.html` / `terms.html` — legal placeholders (**require counsel review**)
- `favicon.svg`, `vercel.json`

## Before launch (configure these)
1. **Forms:** set `CONFIG.FORM_ENDPOINT` in `main.js` to a real endpoint (CRM webhook / Formspree / etc.). Until set, submissions log to console + show a confirmation (nothing is lost silently, but nothing is delivered either).
2. **Settlement IQ link:** `CONFIG.SETTLEMENT_IQ_URL` and the two "Try Settlement IQ" hrefs point to the live funnel. **Confirm the LIVE payment path is ready before driving paid traffic.**
3. **Analytics:** wire `window.analytics.track` (or replace the `track()` stub) to your analytics tool.
4. **Legal:** replace privacy/terms placeholders with counsel-reviewed copy.
5. **Assets:** swap the favicon / add a real OG image for social sharing.

## Honesty guardrails (intentional)
- Status badges reflect the audit: **Live** = Settlement IQ, UPASign, ClaimRush; **Early Access** = Fire, Roof, AI Estimating, Veritas IQ; **Coming Soon** = Contractor Advantage.
- No fabricated logos, metrics, or certifications anywhere.
- Internal/dormant products (RIN, Lead/Comms engines, AI Receptionist, etc.) are not shown.

## Deploy (Vercel)
`vercel --prod` from this directory (static, zero-config), or point a Vercel project's root at this folder. Set the domain to paxequitas.com.

## Local preview
`python3 -m http.server 8080` then open http://localhost:8080
