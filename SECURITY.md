# Security report — shakoorsolutions.com

Audit and hardening completed November 2026. Every result below was observed directly: Git history scans, `npm audit`, Hostinger API reads, and requests against the live site. Nothing here is assumed.

To report a vulnerability, contact the company privately (see the website's contact page). Don't open a public GitHub issue.

## 1. Initial posture

| Area | Finding |
| --- | --- |
| Architecture | Next.js 16 / React 19 / TypeScript, Node.js app on Hostinger, deployed from GitHub `safimeer/shakoor` → `main` |
| Attack surface | One server endpoint, `POST /api/enquiry` (contact form). No database, no login, no sessions or cookies, no file uploads |
| Third parties | Resend (email), configured November 2026: domain verified, send-only key |
| Secrets in repo | **None.** All commits and all file versions scanned; only the `re_xxxx…` placeholder in `.env.example`. No `.env` file ever committed. **No credentials need rotating.** |
| TLS | Let's Encrypt certificate for apex and `www`, valid to 23 Jan 2027. TLS 1.0/1.1 refused; TLS 1.2/1.3 with strong AEAD ciphers. HTTP → HTTPS 301 |
| Sensitive files | `.env*`, `.git/*`, `.htaccess` → 403; source, build output, `node_modules` → 404; no directory listings |
| Dependencies | Production tree: 0 vulnerabilities. Dev tooling: 8 moderate (`minimatch` via ESLint), not shipped to the server runtime |
| Databases (Hostinger) | None; no remote database access rules |

## 2. Findings and status

| # | Severity | Finding | Status |
| --- | --- | --- | --- |
| M1 | Medium | Form rate limit keyed on a spoofable `X-Forwarded-For` value; email flooding possible once email is on | **Fixed:** hard site-wide cap of 30 emails/hour; per-client limit kept as a courtesy |
| M2 | Medium | Optional confirmation email echoed visitor text to any address (spam relay from your domain) | **Fixed:** fixed wording only; feature stays off by default |
| M3 | Medium | No HSTS | **Fixed:** `max-age=31536000` (apex and www) |
| L1 | Low | No real Content-Security-Policy | **Fixed:** first-party-only CSP (see §4) |
| L2 | Low | No request-size limit on the API | **Fixed:** 32 KB limit (413) |
| L3 | Low | Cross-site "simple" POSTs accepted | **Fixed:** JSON content type required (415); foreign `Origin` rejected (403) |
| L4 | Low | Line breaks in single-line fields could reach the email subject | **Fixed:** control characters stripped from single-line fields |
| L5 | Low | Rate-limit memory never pruned | **Fixed:** stale entries pruned, size bounded |
| L6 | Low (dev only) | `minimatch` advisory in ESLint tooling | **Open:** no upstream fix yet; Dependabot will propose it |
| L7 | Info | Bot protection is a honeypot plus a form timer | **Open:** optional Cloudflare Turnstile (§9) |
| E1 | Medium | Resend not verified for the domain (no DKIM), so the form couldn't send | **Fixed:** domain verified (DKIM, return-path SPF/MX); live test delivered to info@ |
| E2 | Low | DMARC is `p=none` with no reporting address | **Open:** tighten after email works (§6) |

OWASP review: no SQL/NoSQL (no database); output escaped by React and in email HTML; no SSRF (the server only calls the fixed Resend URL); no access-control or session surface; no uploads; errors return generic messages with no stack traces (verified live); no secrets in client code (only `NEXT_PUBLIC_SITE_URL`, a public URL, reaches the browser).

## 3. Files changed

| File | Change |
| --- | --- |
| `app/api/enquiry/route.ts` | Content-type and Origin checks, 32 KB body limit, object-only payloads, site-wide cap, pruning, fixed-text confirmation |
| `lib/enquiry.ts` | Control characters stripped from single-line fields |
| `next.config.ts` | HSTS and production CSP added to the existing security headers |
| `.github/dependabot.yml` | Weekly npm and monthly Actions update PRs |
| `SECURITY.md` | This report |

Earlier production work (already live): security headers, `X-Powered-By` removed, Node.js deployment instead of serving source from `public_html`.

## 4. Headers (verified live)

`Strict-Transport-Security: max-age=31536000` · `X-Content-Type-Options: nosniff` · `X-Frame-Options: SAMEORIGIN` · `Referrer-Policy: strict-origin-when-cross-origin` · `Permissions-Policy: camera=(), microphone=(), geolocation=(), browsing-topics=()`

```
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';
  img-src 'self' data: blob:; font-src 'self'; connect-src 'self'; manifest-src 'self'; worker-src 'self' blob:;
  object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'self'; upgrade-insecure-requests
```

`'unsafe-inline'` for scripts is required by Next.js's inline page data; a nonce-based policy would make every page render per request. Hostinger also adds its own `Content-Security-Policy: upgrade-insecure-requests`; browsers enforce both. Live browser test: no CSP violations, all images, fonts and the form work.

**Adding a third-party service later** (analytics, chat widget, maps, Turnstile) means adding its domains to the CSP in `next.config.ts`, or it will be blocked.

**HSTS:** `includeSubDomains` and `preload` are deliberately not set. Add them only once every subdomain serves HTTPS, because browsers then refuse plain HTTP for all of them, and preload is hard to undo.

## 5. GitHub settings (do these in the repository's Settings)

The GitHub CLI isn't signed in on the build PC, so these weren't changed automatically.

1. **Settings → Code security:** turn on **Secret scanning** and **Push protection** (free for public repos), **Dependabot alerts**, **Dependabot security updates**, and **CodeQL → Default setup**.
2. **Settings → Branches → Add rule for `main`:** require a pull request before merging if anyone else gets write access; block force pushes and deletions. Every push to `main` deploys to production.
3. **Settings → Collaborators:** keep write access to people who need it.
4. **Optional:** make the repository private. No secrets are in it, but private hides the code from casual inspection. Hostinger's GitHub app keeps working.

## 6. Email (Resend) setup

**Status: done.** Resend domain verified (EU region, sending only). Added DNS records: TXT `resend._domainkey` (DKIM), MX and TXT on `send` (bounce return-path with SPF `include:amazonses.com`), CNAME `rsend`. Unchanged: root MX → Hostinger Mail, root SPF, Hostinger DKIM, DMARC `p=none`. Website emails come from `noreply@shakoorsolutions.com` to `info@shakoorsolutions.com`, with Reply-To set to the visitor. DMARC passes through DKIM alignment.

Original setup steps, for reference:

1. Resend → **Domains → Add domain** → `shakoorsolutions.com` (or a subdomain like `mail.shakoorsolutions.com` to keep it separate from Hostinger Mail).
2. Add exactly the records Resend shows (DKIM TXT, plus MX and SPF TXT on its `send` subdomain) in hPanel → Domains → DNS. These don't affect existing Hostinger mailboxes. **Don't** replace the root SPF record.
3. Wait for Resend to show **Verified**.
4. Set the variables in §7.
5. After a week of working delivery, tighten DMARC to `v=DMARC1; p=quarantine; rua=mailto:<a mailbox you read>`.

The API key is used only server-side (`app/api/enquiry/route.ts`), never sent to browsers or logged.

## 7. Environment variables

| Variable | Where | Type | Status |
| --- | --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Hostinger | Public, **build-time** | **Configured and verified** (sitemap and canonical URLs live) |
| `RESEND_API_KEY` | Hostinger | Secret, runtime | **Configured and tested** (send-only, restricted to shakoorsolutions.com) |
| `ENQUIRY_TO_EMAIL` | Hostinger | Runtime | **Configured and tested** (info@shakoorsolutions.com) |
| `ENQUIRY_FROM_EMAIL` | Hostinger | Runtime, verified domain | **Configured and tested** (noreply@shakoorsolutions.com) |
| `ENQUIRY_SEND_CONFIRMATION` | Hostinger | Optional, runtime | Set to `false` (off) |

No GitHub Actions secrets are needed: Hostinger builds the site. Details are in [ENVIRONMENT_SETUP.md](ENVIRONMENT_SETUP.md). Enter secrets only in hPanel. The Hostinger API **replaces the whole variable set**, so keep `NEXT_PUBLIC_SITE_URL` when editing.

## 8. Backups and recovery

- **Code:** GitHub holds full history; the site can always be rebuilt from `main`.
- **Rollback:** `git revert <commit>` then `git push`; Hostinger rebuilds the previous state in about 2½ minutes. Hostinger also keeps each published build as a separate version.
- **Hostinger backups:** not visible through the API for this plan. **Check hPanel → Backups** that automatic backups are on and note the retention. There's no database, so there's nothing else to back up.
- **Secrets:** keep a copy of the Resend API key in a password manager; a lost key can be regenerated in Resend.

## 9. Remaining risks and recommendations

1. Configure email (E1) and then tighten DMARC (E2).
2. Apply the GitHub settings in §5; they aren't verified yet.
3. Confirm Hostinger backups (§8).
4. Rate limits are per server instance and in memory: fine for one Hostinger instance, and they reset on restart. For heavy abuse, add Cloudflare Turnstile to the form (needs a site key and secret, and CSP changes).
5. Re-run `npm audit` after Dependabot PRs; update Next.js patch releases promptly.
6. Review the CSP whenever a third-party script is added.

## 10. Score

**8 / 10** after hardening, based on the evidence above. What earns it: no secrets ever committed; strong TLS and HSTS; restrictive CSP; no exposed files; minimal attack surface; a hardened, rate-limited API with generic errors; 0 production vulnerabilities.

Held back by items not yet verifiable or configured: email domain authentication (E1/E2), GitHub security settings, backup confirmation, `'unsafe-inline'` scripts in the CSP, and per-instance rate limiting.
