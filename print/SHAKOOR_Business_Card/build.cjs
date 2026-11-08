/*
 * SHAKOOR Integrated Solutions — corporate business card (90 × 54 mm, double-sided).
 *
 * One SVG per side is the single source for every export. All coordinates are in millimetres,
 * measured from the TRIM corner; the artboard adds a 3 mm bleed on every side (96 × 60 mm).
 *
 *   node build.cjs        → writes the SVG/HTML sources, then run export.cmd for PNG + PDF
 *
 * Outputs (after export.cmd):
 *   SHAKOOR_Business_Card_Editable.svg    both artboards (front above, back below), fonts + logo embedded
 *   SHAKOOR_Business_Card_Front.png       front, 300 DPI, including 3 mm bleed
 *   SHAKOOR_Business_Card_Back.png        back, 300 DPI, including 3 mm bleed
 *   SHAKOOR_Business_Card_Print_Ready.pdf 2 pages (front, back), 96 × 60 mm with bleed, vector text
 *   SHAKOOR_Business_Card_Preview.png     presentation mock-up of both trimmed sides
 */
const fs = require("fs");
const path = require("path");
const React = require("react");
const { renderToStaticMarkup } = require("react-dom/server");
const { Phone, Mail, Globe, MapPin } = require("lucide-react");

const W = 90, H = 54, BLEED = 3, SAFE = 4;
const ROOT = path.resolve(__dirname, "../..");
const OUT = __dirname;

const C = { midnight: "#041426", navy: "#071f38", navy2: "#0b2a4a", royal: "#0a6fd1", electric: "#087fe5", cyan: "#20b8ff", mist: "#afc2d6", silver: "#c9d3de", ink: "#06182c", slate: "#4a5e75", line: "#dde6f0", qr: "#eef6fc" };

const contact = {
  company: "SHAKOOR Integrated Solutions (Pvt.) Ltd.",
  phone: "0345 9319469",
  emails: ["info@shakoorsolutions.com", "safiullah@shakoorsolutions.com"],
  web: "shakoorsolutions.com",
  address: "Mathelo Road, Near VDO Office, Ghotki",
  tagline: "Integrated Solutions for a Smarter, Safer & Connected World",
};

/* ── Embedded assets ─────────────────────────────────────────────────────────── */
const LOGO = { w: 1221, h: 960, href: "data:image/png;base64," + fs.readFileSync(path.join(ROOT, "public/images/brand/shakoor-logo.png")).toString("base64") };
const logoH = (w) => (w * LOGO.h) / LOGO.w; // keep the original proportions exactly
const font = (wt) => "data:font/woff2;base64," + fs.readFileSync(path.join(OUT, `fonts/plus-jakarta-sans-latin-${wt}-normal.woff2`)).toString("base64");
const fontCss = [500, 600, 700, 800].map((wt) => `@font-face{font-family:"Plus Jakarta Sans";font-weight:${wt};src:url(${font(wt)}) format("woff2");}`).join("");
const textCss = `text{font-family:"Plus Jakarta Sans",Arial,sans-serif;font-variant-ligatures:none;font-feature-settings:"liga" 0,"clig" 0;}`;

/* Lucide icon as a nested <svg> placed at (x, y) with size s (mm), stroked in colour c. */
const icon = (Cmp, x, y, s, c) =>
  renderToStaticMarkup(React.createElement(Cmp, { size: 24, strokeWidth: 2 }))
    .replace(/<svg[^>]*?viewBox="0 0 24 24"[^>]*>/, `<svg x="${x}" y="${y}" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">`);

const defs = (id) => `
  <defs>
    <linearGradient id="${id}-bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${C.navy2}"/><stop offset=".55" stop-color="${C.navy}"/><stop offset="1" stop-color="${C.midnight}"/>
    </linearGradient>
    <radialGradient id="${id}-glow" cx="1" cy="0" r=".9">
      <stop offset="0" stop-color="${C.cyan}" stop-opacity=".16"/><stop offset="1" stop-color="${C.cyan}" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="${id}-rule" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="${C.electric}"/><stop offset=".45" stop-color="${C.cyan}"/><stop offset="1" stop-color="${C.cyan}" stop-opacity="0"/>
    </linearGradient>
  </defs>`;

/* ── FRONT ───────────────────────────────────────────────────────────────────── */
const front = () => {
  const lw = 24, lh = logoH(lw), ly = 21.5 - lh / 2;
  return `<g id="front">
  ${defs("f")}
  <rect x="${-BLEED}" y="${-BLEED}" width="${W + 2 * BLEED}" height="${H + 2 * BLEED}" fill="url(#f-bg)"/>
  <rect x="${-BLEED}" y="${-BLEED}" width="${W + 2 * BLEED}" height="${H + 2 * BLEED}" fill="url(#f-glow)"/>
  <g fill="none" stroke="${C.cyan}" stroke-width=".22" opacity=".14">
    <circle cx="${W + 6}" cy="-6" r="26"/><circle cx="${W + 6}" cy="-6" r="33"/><circle cx="${W + 6}" cy="-6" r="40"/>
  </g>
  <image id="logo" href="${LOGO.href}" x="6" y="${ly.toFixed(2)}" width="${lw}" height="${lh.toFixed(2)}" preserveAspectRatio="xMidYMid meet"/>
  <line x1="34.2" y1="13.2" x2="34.2" y2="29.8" stroke="${C.cyan}" stroke-width=".25" opacity=".55"/>
  <text id="name" x="37.4" y="22.2" font-size="7.3" font-weight="800" fill="#ffffff" letter-spacing=".55">SHAKOOR</text>
  <text id="name-2" x="37.5" y="27.1" font-size="2.02" font-weight="700" fill="${C.silver}" letter-spacing=".13">INTEGRATED SOLUTIONS (PVT.) LTD.</text>
  <rect x="37.5" y="15.2" width="6" height=".6" rx=".3" fill="${C.cyan}"/>
  <rect x="6" y="40.6" width="78" height=".28" fill="url(#f-rule)"/>
  <text id="tagline" x="6" y="46.6" font-size="2.2" font-weight="500" fill="${C.mist}" letter-spacing=".02">${contact.tagline.replace("&", "&amp;")}</text>
</g>`;
};

/* ── BACK ────────────────────────────────────────────────────────────────────── */
const QR = { x: 61.5, y: 15, s: 24 };
// Company QR code (https://shakoorsolutions.com/), stored as vector module data in qr.json.
// Delete qr.json to go back to the empty reserved square.
const QRDATA = fs.existsSync(path.join(OUT, "qr.json")) ? JSON.parse(fs.readFileSync(path.join(OUT, "qr.json"), "utf8")) : null;
const QR_CODE = 19.6; // mm — leaves ~3 modules of white quiet zone inside the frame
const back = () => {
  const row = (y, Cmp, text, size, weight, fill) => `
    <circle cx="8.1" cy="${y}" r="2.05" fill="${C.navy}"/>
    ${icon(Cmp, 8.1 - 1.15, y - 1.15, 2.3, C.cyan)}
    <text x="12" y="${(y + size * 0.36).toFixed(2)}" font-size="${size}" font-weight="${weight}" fill="${fill}">${text}</text>`;
  return `<g id="back">
  ${defs("b")}
  <rect x="${-BLEED}" y="${-BLEED}" width="${W + 2 * BLEED}" height="${H + 2 * BLEED}" fill="#ffffff"/>
  <g fill="none" stroke="${C.royal}" stroke-width=".22" opacity=".09">
    <circle cx="${W + 6}" cy="${H + 6}" r="22"/><circle cx="${W + 6}" cy="${H + 6}" r="29"/>
  </g>
  <image href="${LOGO.href}" x="6" y="6.3" width="9" height="${logoH(9).toFixed(2)}" preserveAspectRatio="xMidYMid meet"/>
  <text x="17.2" y="10.1" font-size="3.6" font-weight="800" fill="${C.ink}" letter-spacing=".22">SHAKOOR</text>
  <text x="17.2" y="13.3" font-size="1.95" font-weight="600" fill="${C.slate}">Integrated Solutions (Pvt.) Ltd.</text>
  <rect x="6" y="17.4" width="50" height=".28" fill="url(#b-rule)"/>
  <g id="contacts">
    ${row(22.7, Phone, contact.phone, 2.75, 800, C.ink)}
    ${row(28.3, Mail, contact.emails[0], 2.3, 600, C.ink)}
    ${row(33.9, Mail, contact.emails[1], 2.3, 600, C.ink)}
    ${row(39.5, Globe, contact.web, 2.3, 700, C.royal)}
    ${row(45.1, MapPin, contact.address, 2.15, 600, C.ink)}
  </g>
  <line x1="58.4" y1="13" x2="58.4" y2="44" stroke="${C.line}" stroke-width=".25"/>
  ${
    QRDATA
      ? `<!-- QR code (${QRDATA.data}), vector, error correction ${QRDATA.ecc}. Frame ${QR.s} mm; code ${QR_CODE} mm. -->
  <rect id="qr-frame" x="${QR.x}" y="${QR.y}" width="${QR.s}" height="${QR.s}" rx="1.6" fill="#ffffff" stroke="${C.cyan}" stroke-width=".3"/>
  <g id="qr-code" transform="translate(${QR.x + (QR.s - QR_CODE) / 2} ${QR.y + (QR.s - QR_CODE) / 2}) scale(${QR_CODE / QRDATA.size})"><path d="${QRDATA.path}" fill="${C.midnight}" shape-rendering="crispEdges"/></g>`
      : `<!-- QR CODE RESERVED AREA: ${QR.s} × ${QR.s} mm. Keep empty; place the real QR code inside this square later. -->
  <rect id="qr-placeholder" x="${QR.x}" y="${QR.y}" width="${QR.s}" height="${QR.s}" rx="1.6" fill="${C.qr}" stroke="${C.cyan}" stroke-width=".3"/>`
  }
</g>`;
};

/* ── Writers ─────────────────────────────────────────────────────────────────── */
const svgDoc = (body, { w = W + 2 * BLEED, h = H + 2 * BLEED, vb = `${-BLEED} ${-BLEED} ${W + 2 * BLEED} ${H + 2 * BLEED}` } = {}) =>
  `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${w}mm" height="${h}mm" viewBox="${vb}"><style>${fontCss}${textCss}</style>${body}</svg>`;

// 1. Editable SVG: two artboards stacked (front at top, back 10 mm below), each with its own bleed.
const GAP = 10, AB_H = H + 2 * BLEED;
const editable = `<?xml version="1.0" encoding="UTF-8"?>
<!-- SHAKOOR Integrated Solutions business card — editable source.
     Artboard 1 (top): FRONT. Artboard 2 (bottom): BACK. Each 96 × 60 mm = 90 × 54 mm trim + 3 mm bleed.
     Units are millimetres. Keep text 4 mm inside the trim. Font: Plus Jakarta Sans (OFL, files in fonts/).
     The QR code on the back (id="qr-code") links to https://shakoorsolutions.com/ and is vector. -->
<svg xmlns="http://www.w3.org/2000/svg" width="${W + 2 * BLEED}mm" height="${2 * AB_H + GAP}mm" viewBox="${-BLEED} ${-BLEED} ${W + 2 * BLEED} ${2 * AB_H + GAP}">
<style>${fontCss}${textCss}</style>
<g id="artboard-front">${front()}</g>
<g id="artboard-back" transform="translate(0 ${AB_H + GAP})">${back()}</g>
</svg>`;
fs.writeFileSync(path.join(OUT, "SHAKOOR_Business_Card_Editable.svg"), editable);

// 2. Print HTML → PDF (page 1 front, page 2 back; bleed included).
const page = (body) => `<div class="page">${svgDoc(body).replace(/width="[\d.]+mm" height="[\d.]+mm"/, 'width="96mm" height="60mm"')}</div>`;
fs.writeFileSync(
  path.join(OUT, "card-print.html"),
  `<!DOCTYPE html><html><head><meta charset="utf-8"><title>SHAKOOR business card</title><style>
@page{size:96mm 60mm;margin:0} *{margin:0;padding:0} html,body{width:96mm}
.page{width:96mm;height:60mm;overflow:hidden;break-after:page;-webkit-print-color-adjust:exact;print-color-adjust:exact} .page:last-child{break-after:auto} svg{display:block}
</style></head><body>${page(front())}${page(back())}</body></html>`,
);

// 3. Single-side HTML for the 300 DPI PNG exports (with bleed).
for (const [name, body] of [["front", front()], ["back", back()]]) {
  fs.writeFileSync(
    path.join(OUT, `card-${name}.html`),
    `<!DOCTYPE html><html><head><meta charset="utf-8"><style>*{margin:0}html,body{width:1134px;height:709px;overflow:hidden}svg{display:block;width:1134px;height:709px}</style></head><body>${svgDoc(body)}</body></html>`,
  );
}

// 4. Presentation preview: both sides trimmed (bleed hidden), on a soft backdrop.
const trimmed = (body) => svgDoc(body, { vb: `0 0 ${W} ${H}` }).replace(/width="[\d.]+mm" height="[\d.]+mm"/, "");
fs.writeFileSync(
  path.join(OUT, "card-preview.html"),
  `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
@font-face{font-family:"Plus Jakarta Sans";font-weight:600;src:url(fonts/plus-jakarta-sans-latin-600-normal.woff2) format("woff2")}
*{margin:0;box-sizing:border-box} html,body{width:1600px;height:1000px;overflow:hidden}
body{font-family:"Plus Jakarta Sans",Arial,sans-serif;background:radial-gradient(80% 70% at 30% 20%,#e9eff6,#cfd9e4);display:flex;align-items:center;justify-content:center;gap:70px}
figure{display:flex;flex-direction:column;align-items:center;gap:22px}
.card{width:680px;height:408px;border-radius:6px;overflow:hidden;box-shadow:0 2px 4px rgba(4,20,38,.12),0 30px 60px -18px rgba(4,20,38,.45)}
.card svg{width:100%;height:100%;display:block}
figcaption{font-size:17px;font-weight:600;color:#4a5e75;letter-spacing:.08em;text-transform:uppercase}
</style></head><body>
<figure><div class="card">${trimmed(front())}</div><figcaption>Front</figcaption></figure>
<figure><div class="card">${trimmed(back())}</div><figcaption>Back</figcaption></figure>
</body></html>`,
);

console.log("Business card sources written. Run export.cmd for PNG + PDF.");
