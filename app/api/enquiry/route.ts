import { getService } from "@/data/services";
import { site } from "@/data/site";
import { normaliseEnquiry, validateEnquiry, type EnquiryValues } from "@/lib/enquiry";

/**
 * Receives enquiries and emails them to the company via the Resend HTTP API.
 * Configure in .env.local (see .env.example). Without configuration the route
 * returns 503 — it never pretends a message was delivered.
 */

const MIN_FILL_MS = 3000; // Faster than this is almost certainly automated.
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;

// Best-effort, per-instance rate limit. Use a shared store (e.g. Redis) if deployed across many instances.
const hits = new Map<string, number[]>();

function rateLimited(ip: string, now: number) {
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > MAX_PER_WINDOW;
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

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "invalid_request", message: "The request could not be read." }, { status: 400 });
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
  if (process.env.ENQUIRY_SEND_CONFIRMATION === "true") {
    try {
      await sendEmail(apiKey, {
        from,
        to: [values.email],
        subject: `We've received your enquiry — ${site.shortName} Integrated Solutions`,
        text: `Hello ${values.name},\n\nThank you for contacting ${site.name}. We've received your enquiry about "${values.subject}" and our team will reply soon.\n\nThis is an automatic confirmation.`,
      });
    } catch (err) {
      console.error("[enquiry] Confirmation email failed:", err);
    }
  }

  return Response.json({ ok: true });
}
