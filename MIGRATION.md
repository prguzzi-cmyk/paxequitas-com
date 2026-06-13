# Migration Plan — GitHub Pages → paxequitas.com

> Planning only. No deployment. No redesign — the site as-built ships unchanged; only hosting/domain moves.
> **Current live URL:** `https://prguzzi-cmyk.github.io/paxequitas-com/` (verified HTTP 200, Pages status `built`).

---

## 1. Current deployment architecture

| Aspect | Reality today |
|---|---|
| **Site** | Static — HTML/CSS/JS, **no build step**, all asset paths relative (works at subpath or root) |
| **Repo** | `prguzzi-cmyk/paxequitas-com` (public) |
| **Source** | GitHub Pages, branch `main`, path `/` |
| **Served at** | `prguzzi-cmyk.github.io/paxequitas-com/` (project **subpath**) |
| **TLS** | Auto, GitHub-managed |
| **Backend** | None. Demo/waitlist forms log to console (`CONFIG.FORM_ENDPOINT` unset) |
| **CI/CD** | Push to `main` → Pages rebuilds automatically |

**Implication:** the repo is the single source of truth; the live site is a pure artifact of `main`. Moving hosting changes *where DNS points*, not the code.

---

## 2. DNS changes required (for `paxequitas.com`)

> Prerequisite: confirm the domain is **registered and owned**, and identify the **DNS provider** (registrar or Cloudflare/Route53/etc.). All records below are added there.

### Path A — Vercel (recommended, see §5)
1. Create a Vercel project from the `paxequitas-com` repo (static, zero-config) or `vercel --prod` from the folder.
2. Add `paxequitas.com` + `www.paxequitas.com` as domains in the Vercel project.
3. DNS records (Vercel's standard targets — **confirm exact values in the Vercel dashboard at cutover**):
   - **Apex** `paxequitas.com` → `A` record → `76.76.21.21`
   - **www** `www.paxequitas.com` → `CNAME` → `cname.vercel-dns.com`
   - *(Alternative: delegate the domain to Vercel nameservers for full management.)*
4. Vercel auto-provisions TLS once DNS resolves.

### Path B — Stay on GitHub Pages, add the custom domain
1. Repo → Settings → Pages → set **Custom domain** = `paxequitas.com` (writes a `CNAME` file to the repo).
2. DNS records:
   - **Apex** `paxequitas.com` → four `A` records → `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153` (+ AAAA `2606:50c0:8000::153` … `::8003::153` for IPv6)
   - **www** `www.paxequitas.com` → `CNAME` → `prguzzi-cmyk.github.io`
3. After DNS resolves, enable **Enforce HTTPS** in Pages settings (cert auto-issues).

> Either path moves the site from the `/paxequitas-com/` subpath to the **domain root** — relative paths already handle this, so **no code change**.

**Pre-cutover step (both paths):** ~24–48h before, **lower the TTL** on the affected records to **300s** so propagation (and any rollback) is fast.

---

## 3. Estimated cutover time

| Phase | Time |
|---|---|
| Hands-on config (add domain + records, or Vercel import) | ~15–30 min |
| DNS propagation (with pre-lowered 300s TTL) | minutes–~1 hr (worst case up to 24–48h on stale caches) |
| TLS issuance | Vercel: seconds–minutes · GitHub Pages: minutes–~1 hr after DNS resolves |
| **Realistic "live on paxequitas.com"** | **same day — plan a ~1–3 hr window; allow 24h for full global propagation** |

Best practice: cut over in a **low-traffic window**, verify on the new domain before announcing.

---

## 4. Rollback plan

Low-risk because the content is static and the repo is the source of truth:

1. **The old URL never goes away.** `prguzzi-cmyk.github.io/paxequitas-com/` keeps serving regardless — instant fallback to share if needed.
2. **DNS revert.** Roll back by restoring the previous DNS records (or removing the new ones). With TTL pre-lowered to 300s, this propagates in minutes.
3. **Vercel instant rollback** (Path A): one-click redeploy to any previous deployment in the Vercel dashboard — independent of DNS.
4. **Bad content** (either path): `git revert` on `main` → auto-redeploys. No database, no migrations, nothing to corrupt.
5. **Cert failure:** if HTTPS won't provision, leave DNS on the old host and retry; the github.io URL stays valid throughout.

**Net:** worst case is "point DNS back," which is fast and complete. No data loss is possible (static site).

---

## 5. Vercel vs GitHub Pages — long-term recommendation

**Recommendation: migrate production to Vercel.** Keep GitHub Pages as today's free preview, but `paxequitas.com` should run on Vercel.

| Factor | GitHub Pages | Vercel |
|---|---|---|
| Static hosting | ✅ free, simple | ✅ free tier |
| **Server-side / forms** | ❌ none (needs 3rd-party form service) | ✅ serverless/edge functions — wire demo/waitlist capture natively |
| **Next.js** (the plan's intended stack) | ❌ not supported | ✅ first-class |
| Preview deploys per PR | ❌ | ✅ |
| Instant rollback | ➖ via git | ✅ one-click |
| Env vars / secrets | ❌ | ✅ (e.g. `FORM_ENDPOINT`, analytics keys) |
| Redirects / headers / edge config | ➖ limited | ✅ |
| Matches existing infra | ➖ | ✅ ClaimRush + RIN already on Vercel |

**Why Vercel wins here:** this homepage's near-term roadmap needs exactly what Pages can't do — **working form capture, analytics, likely a Next.js migration, and preview/rollback** — and it matches the stack the rest of the platform already deploys on. GitHub Pages is great for *today's* static preview; it caps out the moment the site needs to be dynamic.

**Sequencing:** if Vercel access (account/token) isn't ready, **Path B (Pages custom domain)** is a valid interim — it gets `paxequitas.com` live now with zero new accounts, and a later move to Vercel is just another DNS repoint.

---

## Pre-cutover checklist (planning, do not execute yet)
- [ ] Confirm `paxequitas.com` is registered + identify DNS provider (need access)
- [ ] Decide Path A (Vercel) vs B (Pages) — recommend A
- [ ] (Path A) Vercel account + `VERCEL_TOKEN` or interactive `vercel` login
- [ ] Lower TTL to 300s ~24–48h ahead
- [ ] Decide `FORM_ENDPOINT` (Vercel function or 3rd-party) so capture works post-cutover
- [ ] Counsel-review privacy/terms before public domain launch
- [ ] Confirm Settlement IQ LIVE payment path before driving paid traffic
- [ ] Pick a low-traffic cutover window

*Planning only — nothing in this document has been executed. The site remains live solely at the github.io URL until you approve a cutover path.*
