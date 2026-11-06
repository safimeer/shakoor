import { createHash } from "node:crypto";
import { getService } from "@/data/services";
import { site } from "@/data/site";
import { normaliseEnquiry, validateEnquiry, type EnquiryValues } from "@/lib/enquiry";

/**
 * Receives enquiries and emails them to the company via the Resend HTTP API.
 * Configure in .env.local (see .env.example). Without configuration the route
 * returns 503 — it never pretends a message was delivered.
 */

const MIN_FILL_MS = 3000; // Faster than this is almost certainly automated.
const MAX_BODY_BYTES = 32 * 1024; // A full enquiry is well under 10 KB.
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const GLOBAL_WINDOW_MS = 60 * 60 * 1000;
const GLOBAL_MAX_SENDS = 30;
const MAX_TRACKED_CLIENTS = 1000;

/*
 * Rate limiting (best-effort, per server instance).
 * - Per client: keyed on the forwarded client address. Proxies let clients prepend their
 *   own X-Forwarded-For values, so this is a courtesy limit, not a guarantee.
 * - Site-wide: a hard cap on emails sent per hour that no request header can bypass.
 *   It bounds inbox flooding and email-provider usage even if the per-client key is spoofed.
 */
const hits = new Map<string, number[]>();
let sends: number[] = [];

function rateLimited(ip: string, now: number) {
  if (hits.size > MAX_TRACKED_CLIENTS) {
    for (const [key, times] of hits) {
      if (times.every((t) => now - t >= WINDOW_MS)) hits.delete(key);
    }
    if (hits.size > MAX_TRACKED_CLIENTS) hits.clear();
  }
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > MAX_PER_WINDOW;
}

function globalCapReached(now: number) {
  sends = sends.filter((t) => now - t < GLOBAL_WINDOW_MS);
  return sends.length >= GLOBAL_MAX_SENDS;
}

/** Hosts this site is served from, for the same-origin check. */
function allowedHosts(request: Request) {
  const hosts = new Set<string>();
  for (const h of [request.headers.get("host"), request.headers.get("x-forwarded-host")]) {
    if (h) hosts.add(h.split(",")[0].trim().toLowerCase());
  }
  if (site.url) {
    const host = new URL(site.url).host.toLowerCase();
    hosts.add(host);
    hosts.add(host.startsWith("www.") ? host.slice(4) : `www.${host}`);
  }
  return hosts;
}

function reject(status: number, error: string, message: string) {
  return Response.json({ error, message }, { status });
}

function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
}

function serviceName(slug: string) {
  return getService(slug)?.title ?? "Not sure yet / multiple services";
}

/**
 * Notification to the company inbox. Deliberately plain for good inbox placement:
 * a complete HTML document with inline styles, a matching text/plain part, no images,
 * no links, no tracking and no promotional wording.
 */
function companyEmail(v: EnquiryValues) {
  const rows: [string, string][] = [
    ["Name", v.name],
    ["Email", v.email],
    ["Phone", v.phone || "Not provided"],
    ["Company", v.company || "Not provided"],
    ["Service", serviceName(v.service)],
    ["Preferred contact", v.preferredContact ? v.preferredContact[0].toUpperCase() + v.preferredContact.slice(1) : "No preference"],
    ["Subject", v.subject],
  ];
  const footer = `This enquiry was submitted through the contact form on shakoorsolutions.com. Reply to this email to respond to ${v.name} directly.`;

  const subject = `Website enquiry from ${v.name}: ${v.subject}`.slice(0, 180);

  const text = [
    `New website enquiry`,
    ``,
    ...rows.map(([k, val]) => `${k}: ${val}`),
    ``,
    `Message:`,
    v.message,
    ``,
    `--`,
    `${site.name}`,
    footer,
  ].join("\n");

  const cell = "padding:8px 12px;border-bottom:1px solid #dde6f0;font-size:14px;line-height:1.5;vertical-align:top;";
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeHtml(subject)}</title>
</head>
<body style="margin:0;padding:0;background:#f4f8fc;font-family:Arial,Helvetica,sans-serif;color:#06182c;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f8fc;padding:24px 12px;">
<tr><td align="center">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border:1px solid #dde6f0;border-radius:8px;">
<tr><td style="background:#071f38;color:#ffffff;padding:18px 24px;border-radius:8px 8px 0 0;font-size:16px;font-weight:bold;letter-spacing:0.5px;">${escapeHtml(site.name)}</td></tr>
<tr><td style="padding:24px 24px 8px;">
<h1 style="margin:0 0 16px;font-size:20px;line-height:1.3;color:#06182c;">New website enquiry</h1>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
${rows.map(([k, val]) => `<tr><td style="${cell}width:150px;color:#4a5e75;font-weight:bold;">${k}</td><td style="${cell}">${escapeHtml(val)}</td></tr>`).join("\n")}
</table>
<h2 style="margin:24px 0 8px;font-size:16px;color:#06182c;">Message</h2>
<p style="margin:0 0 16px;font-size:14px;line-height:1.6;white-space:pre-wrap;">${escapeHtml(v.message)}</p>
</td></tr>
<tr><td style="padding:16px 24px 24px;border-top:1px solid #dde6f0;font-size:12px;line-height:1.5;color:#4a5e75;">${escapeHtml(footer)}</td></tr>
</table>
</td></tr>
</table>
</body>
</html>`;
  return { subject, text, html };
}

async function sendEmail(apiKey: string, payload: Record<string, unknown>, idempotencyKey: string) {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "Idempotency-Key": idempotencyKey,
    },
    body: JSON.stringify(payload),
  });
  // 409: this idempotency key was already used (a retry or double submit), so the email is sent or in flight.
  if (res.status === 409) {
    console.warn("[enquiry] Duplicate submission ignored (idempotency key already used).");
    return;
  }
  if (!res.ok) throw new Error(`Email provider responded ${res.status}: ${await res.text()}`);
}

export async function POST(request: Request) {
  const now = Date.now();
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";

  // Only JSON from this site's own pages. Blocks cross-site "simple" form posts (text/plain, form-encoded).
  if (!request.headers.get("content-type")?.toLowerCase().startsWith("application/json")) {
    return reject(415, "unsupported_media_type", "The request could not be read.");
  }
  const origin = request.headers.get("origin");
  if (origin) {
    let originHost = "";
    try {
      originHost = new URL(origin).host.toLowerCase();
    } catch {}
    if (!allowedHosts(request).has(originHost)) {
      return reject(403, "forbidden_origin", "Enquiries can only be sent from this website.");
    }
  }

  // Bound the body before parsing it.
  if (Number(request.headers.get("content-length") ?? 0) > MAX_BODY_BYTES) {
    return reject(413, "too_large", "Your enquiry is too long. Please shorten the message and try again.");
  }
  let body: Record<string, unknown>;
  try {
    const raw = await request.text();
    if (raw.length > MAX_BODY_BYTES) {
      return reject(413, "too_large", "Your enquiry is too long. Please shorten the message and try again.");
    }
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new Error("not an object");
    body = parsed as Record<string, unknown>;
  } catch {
    return reject(400, "invalid_request", "The request could not be read.");
  }

  // Spam checks: hidden honeypot field and minimum time on the form.
  const filledTooFast = typeof body.elapsedMs !== "number" || body.elapsedMs < MIN_FILL_MS;
  if ((typeof body.website === "string" && body.website !== "") || filledTooFast) {
    return Response.json({ error: "rejected", message: "Your enquiry could not be accepted. Please try again." }, { status: 400 });
  }
  if (rateLimited(ip, now)) {
    return Response.json(
      { error: "rate_limited", message: "Too many enquiries from this connection. Please wait a few minutes and try again." },
      { status: 429 },
    );
  }

  const values = normaliseEnquiry(body);
  const errors = validateEnquiry(values);
  if (Object.keys(errors).length > 0) {
    return Response.json({ error: "validation", message: "Please correct the highlighted fields.", errors }, { status: 422 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.ENQUIRY_TO_EMAIL;
  const from = process.env.ENQUIRY_FROM_EMAIL;
  if (!apiKey || !to || !from) {
    console.error("[enquiry] Email is not configured: set RESEND_API_KEY, ENQUIRY_TO_EMAIL and ENQUIRY_FROM_EMAIL.");
    return Response.json(
      {
        error: "not_configured",
        message: "Online enquiries are not connected yet, so your message was not sent. Please try again later.",
      },
      { status: 503 },
    );
  }

  if (globalCapReached(now)) {
    console.error("[enquiry] Hourly site-wide sending cap reached; enquiry rejected.");
    return reject(429, "busy", "We're receiving a lot of enquiries right now. Please try again later.");
  }
  sends.push(now);

  const recipients = to.split(",").map((s) => s.trim());
  const { subject, text, html } = companyEmail(values);
  // The same submission always yields the same key, so a retried request (e.g. by the hosting
  // proxy) or a double click is delivered once: Resend ignores repeats of a key for 24 hours.
  const idempotencyKey = `enquiry-${createHash("sha256").update(JSON.stringify(values)).digest("hex").slice(0, 40)}`;
  try {
    await sendEmail(
      apiKey,
      {
        from,
        to: recipients,
        reply_to: values.email,
        subject,
        text,
        html,
      },
      idempotencyKey,
    );
  } catch (err) {
    console.error("[enquiry] Delivery failed:", err);
    return Response.json(
      { error: "delivery_failed", message: "We couldn't send your enquiry just now. Please try again in a few minutes." },
      { status: 502 },
    );
  }

  // Optional confirmation to the visitor. A failure here doesn't undo the delivered enquiry.
  // Fixed wording only: echoing visitor-typed text would let anyone send their own content
  // from this domain to any address they enter.
  if (process.env.ENQUIRY_SEND_CONFIRMATION === "true") {
    try {
      await sendEmail(
        apiKey,
        {
          from,
          to: [values.email],
          // Customers who reply reach the business inbox, not the sending address.
          reply_to: recipients[0],
          subject: `We've received your enquiry — ${site.shortName} Integrated Solutions`,
          text: `Hello,\n\nThank you for contacting ${site.name}. We've received your enquiry and our team will reply soon.\n\nIf you didn't send this enquiry, you can ignore this email.\n\nThis is an automatic confirmation.`,
        },
        `${idempotencyKey}-confirmation`,
      );
    } catch (err) {
      console.error("[enquiry] Confirmation email failed:", err);
    }
  }

  return Response.json({ ok: true });
}
