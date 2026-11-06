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

function companyEmail(v: EnquiryValues) {
  const rows: [string, string][] = [
    ["Name", v.name],
    ["Email", v.email],
    ["Phone", v.phone || "—"],
    ["Company", v.company || "—"],
    ["Service", serviceName(v.service)],
    ["Preferred contact", v.preferredContact || "—"],
    ["Subject", v.subject],
  ];
  const text = `${rows.map(([k, val]) => `${k}: ${val}`).join("\n")}\n\nMessage:\n${v.message}`;
  const html = `<h2>New website enquiry</h2><table cellpadding="6">${rows
    .map(([k, val]) => `<tr><td><strong>${k}</strong></td><td>${escapeHtml(val)}</td></tr>`)
    .join("")}</table><h3>Message</h3><p style="white-space:pre-wrap">${escapeHtml(v.message)}</p>`;
  return { text, html };
}

async function sendEmail(apiKey: string, payload: Record<string, unknown>) {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
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

  const { text, html } = companyEmail(values);
  try {
    await sendEmail(apiKey, {
      from,
      to: to.split(",").map((s) => s.trim()),
      reply_to: values.email,
      subject: `Website enquiry: ${values.subject} (${serviceName(values.service)})`,
      text,
      html,
    });
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
      await sendEmail(apiKey, {
        from,
        to: [values.email],
        subject: `We've received your enquiry — ${site.shortName} Integrated Solutions`,
        text: `Hello,\n\nThank you for contacting ${site.name}. We've received your enquiry and our team will reply soon.\n\nIf you didn't send this enquiry, you can ignore this email.\n\nThis is an automatic confirmation.`,
      });
    } catch (err) {
      console.error("[enquiry] Confirmation email failed:", err);
    }
  }

  return Response.json({ ok: true });
}
