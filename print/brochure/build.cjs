/*
 * SHAKOOR Integrated Solutions — 8-panel Z-fold (accordion) brochure, version 2 (image-rich redesign).
 *
 * One sheet, printed both sides, four equal vertical panels per side, three folds.
 *
 *   OUTSIDE (side A), as printed and viewed:
 *   | P1 Back cover | P2 What we do | P3 Who we are | P4 FRONT COVER |
 *
 *   INSIDE (side B), as printed and viewed after turning the sheet over left-to-right:
 *   | P5 Security & Surveillance | P6 Access, Attendance & POS | P7 IT, Software & Web | P8 IoT, Marketing & Content |
 *
 * Duplex: turn on the SHORT edge (left-right), so P4 backs onto P5, P3 onto P6, P2 onto P7, P1 onto P8.
 * Folding (viewed from the outside): P1|P2 mountain, P2|P3 valley, P3|P4 mountain.
 *
 * Photos: public/images/brochure/ (see README.md there for sources and licences).
 *
 * Usage:
 *   node print/brochure/build.cjs              previews with fold/trim guides (default)
 *   PREVIEW=0 node print/brochure/build.cjs    print files without guides (only after approval)
 *
 * SHEET SIZE IS PROVISIONAL until the printer confirms their K4 dimensions. Change PANEL_W / PANEL_H.
 */
const fs = require("fs");
const path = require("path");
const React = require("react");
const { renderToStaticMarkup } = require("react-dom/server");
const L = require("lucide-react");

/* ── Physical spec ───────────────────────────────────────────────────────────── */
const PANEL_W = 105; // mm — PROVISIONAL (420 mm sheet / 4)
const PANEL_H = 297; // mm — PROVISIONAL
const BLEED = 3; // mm
const SAFE = 7; // mm inside trim and fold lines
const SHEET_W = PANEL_W * 4;
const PROVISIONAL = true;
const PREVIEW = process.env.PREVIEW !== "0";

const ROOT = path.resolve(__dirname, "../..");
const photo = (f) => path.relative(__dirname, path.join(ROOT, "public/images/brochure", f)).split(path.sep).join("/");
const LOGO = path.relative(__dirname, path.join(ROOT, "public/images/brand/shakoor-logo.png")).split(path.sep).join("/");
const icon = (name, size = 14, sw = 2) => renderToStaticMarkup(React.createElement(L[name], { size, strokeWidth: sw, "aria-hidden": true }));
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const QR = JSON.parse(fs.readFileSync(path.join(ROOT, "print/SHAKOOR_Business_Card/qr.json"), "utf8"));

const company = {
  name1: "SHAKOOR INTEGRATED SOLUTIONS",
  name2: "(PVT.) LTD.",
  tagline: "Integrated Solutions for a Smarter, Safer & Connected World",
  phone: "0345 9319469",
  emails: ["info@shakoorsolutions.com", "safiullah@shakoorsolutions.com"],
  web: "shakoorsolutions.com",
};

/* ── Shared CSS ───────────────────────────────────────────────────────────────── */
const css = (pageW, pageH) => `
  ${[500, 600, 700, 800].map((w) => `@font-face { font-family: "Plus Jakarta Sans"; font-weight: ${w}; src: url("fonts/plus-jakarta-sans-latin-${w}-normal.woff2") format("woff2"); }`).join("\n  ")}
  @page { size: ${pageW}mm ${pageH}mm; margin: 0; }
  :root { --midnight:#041426; --navy:#071f38; --navy2:#0b2a4a; --blue:#0a6fd1; --bright:#087fe5; --cyan:#20b8ff; --mist:#afc2d6; --silver:#c9d3de; --paper:#f4f8fc; --ink:#06182c; --slate:#4a5e75; --line:#dde6f0; }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  html, body { width: ${pageW}mm; height: ${pageH}mm; }
  body { font-family: "Plus Jakarta Sans", Arial, sans-serif; color: var(--ink); background: #fff; position: relative; overflow: hidden;
         -webkit-print-color-adjust: exact; print-color-adjust: exact; font-variant-ligatures: none; font-feature-settings: "liga" 0, "clig" 0; }
`;

/* Panel k (1–4) on a print side. Outer panels extend into the bleed; padding keeps content SAFE mm inside trim/folds. */
const panel = (k, cls, inner, style = "") => {
  const left = BLEED + (k - 1) * PANEL_W - (k === 1 ? BLEED : 0);
  const width = PANEL_W + (k === 1 || k === 4 ? BLEED : 0);
  const pl = (k === 1 ? BLEED : 0) + SAFE, pr = (k === 4 ? BLEED : 0) + SAFE;
  return `<section class="panel ${cls}" style="left:${left}mm;width:${width}mm;--pl:${pl}mm;--pr:${pr}mm;--pt:${BLEED + SAFE}mm;--pb:${BLEED + SAFE}mm;${style}">${inner}</section>`;
};

const panelCss = `
  .panel { position:absolute; top:0; height:${PANEL_H + 2 * BLEED}mm; overflow:hidden; display:flex; flex-direction:column; padding: var(--pt) var(--pr) var(--pb) var(--pl); }
  .full-x { margin-left: calc(-1 * var(--pl)); margin-right: calc(-1 * var(--pr)); }
  .full-top { margin-top: calc(-1 * var(--pt)); }
  .ph { position:relative; overflow:hidden; border-radius:2.2mm; background:var(--navy); }
  .ph img { position:absolute; inset:0; width:100%; height:100%; object-fit:cover; display:block; }
  .cap { position:absolute; left:1.8mm; bottom:1.8mm; background:rgba(4,20,38,.8); color:#fff; font-size:6.2pt; font-weight:700; padding:.8mm 2mm; border-radius:1mm; letter-spacing:.01em; }
  .kicker { font-size:7pt; font-weight:800; letter-spacing:.14em; text-transform:uppercase; color:var(--cyan); }
  .ticks { list-style:none; display:grid; grid-template-columns:1fr 1fr; gap:1.25mm 3mm; margin-top:2.4mm; }
  .ticks.one { grid-template-columns:1fr; }
  .ticks li { display:flex; gap:1.4mm; align-items:flex-start; font-size:7.3pt; line-height:1.3; font-weight:500; color:var(--slate); }
  .ticks svg { flex:none; width:2.9mm; height:2.9mm; margin-top:.15mm; color:var(--acc, var(--blue)); }
`;

const ticks = (items, one = false) => `<ul class="ticks${one ? " one" : ""}">${items.map((t) => `<li>${icon("Check", 12, 3)}<span>${esc(t)}</span></li>`).join("")}</ul>`;
const ph = (file, cap, style = "", pos = "50% 50%") => `<div class="ph" style="${style}"><img src="${photo(file)}" alt="" style="object-position:${pos}">${cap ? `<span class="cap">${esc(cap)}</span>` : ""}</div>`;

const guideCss = `
  .g-trim { position:absolute; left:${BLEED}mm; top:${BLEED}mm; width:${SHEET_W}mm; height:${PANEL_H}mm; outline:.3mm dashed rgba(255,0,128,.85); z-index:50; pointer-events:none; }
  .g-fold { position:absolute; top:0; bottom:0; width:0; border-left:.45mm dashed #ff0080; z-index:50; }
  .g-fold span { position:absolute; top:${BLEED + 1}mm; left:1mm; background:#ff0080; color:#fff; font-size:6pt; font-weight:700; padding:.4mm 1.2mm; border-radius:.6mm; white-space:nowrap; }
  .g-label { position:absolute; bottom:${BLEED + 1}mm; transform:translateX(-50%); background:rgba(255,0,128,.92); color:#fff; font-size:7pt; font-weight:800; padding:.6mm 2mm; border-radius:1mm; z-index:50; white-space:nowrap; }
  .g-prov { position:absolute; left:50%; top:${BLEED + 7}mm; transform:translateX(-50%); background:#ff0080; color:#fff; font-size:7pt; font-weight:800; padding:.8mm 3mm; border-radius:1mm; z-index:51; letter-spacing:.04em; }
`;
const guides = (labels, folds) =>
  !PREVIEW
    ? ""
    : `
  <div class="g-trim"></div>
  ${[1, 2, 3].map((i) => `<div class="g-fold" style="left:${BLEED + i * PANEL_W}mm"><span>${folds[i - 1]}</span></div>`).join("")}
  ${labels.map((l, i) => `<div class="g-label" style="left:${BLEED + i * PANEL_W + PANEL_W / 2}mm">${l}</div>`).join("")}
  ${PROVISIONAL ? `<div class="g-prov">PREVIEW · PROVISIONAL SIZE ${SHEET_W} × ${PANEL_H} mm · NOT FOR PRINT</div>` : ""}`;

const doc = (title, extraCss, body) => `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><title>${title}</title><style>
${css(SHEET_W + 2 * BLEED, PANEL_H + 2 * BLEED)}
${panelCss}
${guideCss}
${extraCss}
</style></head><body>${body}</body></html>`;

/* ══ OUTSIDE (side A) ════════════════════════════════════════════════════════════ */
const qrSvg = (size) => `<svg viewBox="0 0 ${QR.size} ${QR.size}" width="${size}mm" height="${size}mm" shape-rendering="crispEdges"><path d="${QR.path}" fill="#041426"/></svg>`;

const whyItems = [
  ["Layers", "Tailored solutions", "Planned around your site, workflow and budget."],
  ["Network", "Integrated services", "Security, business technology, software and IT from one team."],
  ["ShieldCheck", "Security-focused installation", "Equipment placed and configured with protection in mind."],
  ["LifeBuoy", "Professional support", "Technical help after handover, as agreed with each client."],
  ["TrendingUp", "Scalable by design", "Start with what you need now and extend later."],
  ["Wrench", "Maintenance options", "Preventive checks and servicing plans on request."],
];

const overview = [
  ["Cctv", "CCTV &", "surveillance"],
  ["KeyRound", "Access", "control"],
  ["Fingerprint", "Attendance", "systems"],
  ["ShoppingCart", "Retail &", "POS"],
  ["Wrench", "IT support &", "networks"],
  ["Code", "Software &", "websites"],
  ["Cpu", "IoT &", "automation"],
  ["Megaphone", "Digital", "marketing"],
  ["PenLine", "Content", "writing"],
];

const steps = [
  ["Consultation", "Understand your requirements"],
  ["Assessment", "Review the site and systems"],
  ["Solution design", "Agree approach and scope"],
  ["Implementation", "Install or develop the solution"],
  ["Testing & handover", "Verify and train your team"],
  ["Ongoing support", "Follow-up support as agreed"],
];

const values = [
  ["Honest advice", "What a site needs, not the most expensive option."],
  ["Careful workmanship", "Neat installations, tested before handover."],
  ["Clear communication", "Plain explanations and agreed scope."],
  ["Long-term thinking", "Planned to be maintained and extended."],
];

const outsideCss = `
  .navy { color:#fff; background: radial-gradient(90% 45% at 100% 0%, rgba(32,184,255,.20), transparent 70%), linear-gradient(170deg, var(--navy2), var(--navy) 45%, var(--midnight)); }
  .arcs { position:absolute; pointer-events:none; border-radius:50%; border:.3mm solid rgba(32,184,255,.12); }
  h2 { font-size:17pt; font-weight:800; line-height:1.1; letter-spacing:-.01em; }
  .lead { font-size:8.4pt; line-height:1.5; font-weight:600; color:var(--ink); }

  /* P1 back cover */
  .p1 .brand { display:flex; align-items:center; gap:3mm; position:relative; }
  .p1 .brand img { width:17mm; height:auto; }
  .p1 .brand b { display:block; font-size:9.4pt; font-weight:800; letter-spacing:.06em; line-height:1.2; }
  .p1 .brand span { display:block; font-size:6.6pt; color:var(--mist); letter-spacing:.12em; font-weight:700; margin-top:.6mm; }
  .p1 .why { margin-top:4mm; flex:1; display:grid; grid-auto-rows:1fr; gap:2.2mm; position:relative; }
  .p1 .why div { display:flex; gap:3mm; align-items:center; padding:2.4mm 3mm; border-radius:2.4mm; background:linear-gradient(100deg, rgba(32,184,255,.10), rgba(255,255,255,.03)); border:.3mm solid rgba(32,184,255,.22); border-left:.9mm solid var(--cyan); }
  .p1 .why i { flex:none; width:8.5mm; height:8.5mm; border-radius:2mm; display:grid; place-items:center; background:rgba(32,184,255,.12); border:.3mm solid rgba(32,184,255,.35); color:var(--cyan); }
  .p1 .why i svg { width:4.4mm; height:4.4mm; }
  .p1 .why b { display:block; font-size:8.4pt; font-weight:800; }
  .p1 .why span { display:block; font-size:7.2pt; color:var(--mist); line-height:1.4; font-weight:500; margin-top:.4mm; }
  .p1 .contact { margin-top:5mm; position:relative; padding-top:5mm; border-top:.3mm solid rgba(32,184,255,.25); }
  .p1 h3 { font-size:14pt; font-weight:800; line-height:1.15; margin-top:2mm; }
  .p1 .phone { display:flex; align-items:center; justify-content:center; gap:2.4mm; margin-top:4.5mm; padding:3.4mm; border-radius:2.4mm; background:linear-gradient(135deg,var(--blue),var(--bright)); font-size:14pt; font-weight:800; }
  .p1 .phone svg { width:5mm; height:5mm; }
  .p1 .lines { list-style:none; margin-top:3.6mm; display:grid; gap:2.2mm; }
  .p1 .lines li { display:flex; align-items:center; gap:2.2mm; font-size:8.4pt; font-weight:600; white-space:nowrap; }
  .p1 .lines svg { width:3.8mm; height:3.8mm; color:var(--cyan); flex:none; }
  .p1 .qr { margin-top:5mm; display:flex; align-items:center; gap:4mm; padding:3mm; border-radius:2.4mm; background:rgba(255,255,255,.06); border:.3mm solid rgba(32,184,255,.3); }
  .p1 .qr .code { flex:none; background:#fff; padding:1.6mm; border-radius:1.6mm; }
  .p1 .qr .code svg { display:block; }
  .p1 .qr b { display:block; font-size:9pt; font-weight:800; }
  .p1 .qr span { display:block; font-size:7.2pt; color:var(--mist); margin-top:1mm; line-height:1.4; font-weight:500; }

  /* P2 what we do */
  .p2 { background:var(--paper); }
  .p2 .tiles { margin-top:4.5mm; display:grid; grid-template-columns:repeat(3,1fr); gap:2.2mm; }
  .p2 .tiles div { background:#fff; border:.3mm solid var(--line); border-radius:2.2mm; padding:3mm 2mm 2.6mm; text-align:center; }
  .p2 .tiles i { display:grid; place-items:center; width:9.5mm; height:9.5mm; margin:0 auto; border-radius:2.2mm; background:linear-gradient(140deg,var(--navy2),var(--navy)); color:var(--cyan); }
  .p2 .tiles i svg { width:5mm; height:5mm; }
  .p2 .tiles b { display:block; margin-top:2mm; font-size:7.4pt; font-weight:800; line-height:1.2; }
  .p2 .how { margin-top:5mm; flex:1; display:flex; flex-direction:column; min-height:0; }
  .p2 .how .ph { flex:1; min-height:30mm; }
  .p2 .steps { list-style:none; margin-top:3.2mm; display:grid; grid-template-columns:1fr 1fr; gap:2.4mm 3mm; counter-reset:s; }
  .p2 .steps li { counter-increment:s; display:flex; gap:2mm; align-items:flex-start; }
  .p2 .steps li::before { content:counter(s, decimal-leading-zero); flex:none; width:6.4mm; height:6.4mm; border-radius:50%; background:var(--navy); color:var(--cyan); font-size:6.4pt; font-weight:800; display:grid; place-items:center; }
  .p2 .steps b { display:block; font-size:7.8pt; font-weight:800; }
  .p2 .steps span { display:block; font-size:6.9pt; color:var(--slate); line-height:1.3; font-weight:500; }

  /* P3 who we are */
  .p3 .hero { height:78mm; border-radius:0; flex:none; }
  .p3 .hero::after { content:""; position:absolute; inset:0; background:linear-gradient(180deg, transparent 55%, rgba(4,20,38,.55)); }
  .p3 .hero .chip { position:absolute; left:var(--pl); bottom:4mm; z-index:2; background:var(--cyan); color:var(--midnight); font-size:7pt; font-weight:800; letter-spacing:.12em; padding:1mm 2.6mm; border-radius:1mm; text-transform:uppercase; }
  .p3 .vals { margin-top:4.2mm; display:grid; grid-template-columns:1fr 1fr; gap:2mm; }
  .p3 .vals div { background:var(--paper); border-radius:2mm; padding:2.6mm 2.8mm; border-top:.8mm solid var(--cyan); }
  .p3 .vals b { display:block; font-size:7.8pt; font-weight:800; }
  .p3 .vals span { display:block; margin-top:.6mm; font-size:6.9pt; line-height:1.35; color:var(--slate); font-weight:500; }
  .p3 .ind { margin-top:5mm; flex:1; display:flex; flex-direction:column; min-height:0; }
  .p3 .ind .row { flex:1; min-height:26mm; display:grid; grid-template-columns:repeat(3,1fr); gap:2mm; margin-top:2.6mm; }
  .p3 .chips { display:flex; flex-wrap:wrap; gap:1.4mm; margin-top:2.6mm; }
  .p3 .chips span { font-size:6.8pt; font-weight:700; color:var(--navy); background:var(--paper); border:.3mm solid var(--line); border-radius:5mm; padding:.8mm 2.4mm; }

  /* P4 front cover */
  .p4 { background:var(--midnight); color:#fff; padding-bottom:0; }
  .p4 .top { position:relative; z-index:2; text-align:center; display:flex; flex-direction:column; align-items:center; }
  .p4 .top img { width:40mm; height:auto; margin-top:3mm; filter: drop-shadow(0 2mm 4mm rgba(0,0,0,.5)); }
  .p4 .name { margin-top:5mm; font-size:11.5pt; font-weight:800; letter-spacing:.07em; line-height:1.25; }
  .p4 .name small { display:block; font-size:7.6pt; letter-spacing:.2em; color:var(--silver); margin-top:.8mm; }
  .p4 .rule { width:16mm; height:.8mm; border-radius:1mm; background:linear-gradient(90deg,var(--cyan),var(--bright)); margin:5mm auto 0; }
  .p4 h1 { margin-top:5mm; font-size:20pt; font-weight:800; line-height:1.08; letter-spacing:-.005em; }
  .p4 h1 em { font-style:normal; color:#3cc4ff; }
  .p4 .tag { margin-top:3.6mm; font-size:8.4pt; color:var(--mist); font-weight:500; line-height:1.45; max-width:78mm; }
  .p4 .building { position:relative; flex:1; margin-top:6mm; }
  .p4 .building .ph { position:absolute; inset:0; border-radius:0; background:var(--midnight); }
  .p4 .building .ph::after { content:""; position:absolute; inset:0; background:linear-gradient(180deg, var(--midnight) 0%, rgba(4,20,38,0) 22%, rgba(4,20,38,0) 62%, rgba(4,20,38,.92) 100%); }
  .p4 .pillars { position:absolute; left:var(--pl); right:var(--pr); bottom:calc(var(--pb) + 1mm); z-index:2; display:grid; grid-template-columns:1fr 1fr; gap:2mm; }
  .p4 .pillars div { display:flex; align-items:center; gap:1.8mm; font-size:7.4pt; font-weight:700; padding:2.2mm 2.4mm; border-radius:2mm; background:rgba(4,20,38,.72); border:.3mm solid rgba(32,184,255,.4); }
  .p4 .pillars svg { width:3.6mm; height:3.6mm; color:var(--cyan); flex:none; }
`;

const p1 = panel(1, "navy p1", `
  <div class="arcs" style="width:120mm;height:120mm;right:-60mm;top:-50mm"></div>
  <div class="arcs" style="width:150mm;height:150mm;right:-75mm;top:-65mm"></div>
  <div class="brand"><img src="${LOGO}" alt=""><div><b>SHAKOOR</b><span>INTEGRATED SOLUTIONS (PVT.) LTD.</span></div></div>
  <div class="kicker" style="margin-top:7mm;position:relative">Why choose SHAKOOR</div>
  <div class="why">${whyItems.map(([ic, t, s]) => `<div><i>${icon(ic, 18)}</i><p><b>${esc(t)}</b><span>${esc(s)}</span></p></div>`).join("")}</div>
  <div class="contact">
    <div class="kicker">Get in touch</div>
    <h3>Contact us for business enquiries &amp; custom solutions</h3>
    <div class="phone">${icon("Phone", 18)}<span>${company.phone}</span></div>
    <ul class="lines">
      ${company.emails.map((e) => `<li>${icon("Mail")}<span>${esc(e)}</span></li>`).join("")}
      <li>${icon("Globe")}<span>${company.web}</span></li>
    </ul>
    <div class="qr"><div class="code">${qrSvg(19)}</div><div><b>Scan to visit our website</b><span>Services, enquiry form and contact details at ${company.web}</span></div></div>
  </div>`);

const p2 = panel(2, "p2", `
  <div class="kicker" style="color:var(--blue)">What we do</div>
  <h2 style="margin-top:2mm">Integrated solutions from one team</h2>
  <p class="lead" style="margin-top:2.6mm">Security, business systems, IT, software and digital services, planned to work together.</p>
  <div class="tiles">${overview.map(([ic, a, b]) => `<div><i>${icon(ic, 20)}</i><b>${a}<br>${b}</b></div>`).join("")}</div>
  <div class="how">
    <div class="kicker" style="color:var(--blue);margin-bottom:2.6mm">How we work</div>
    ${ph("consultation-client-meeting.jpg", "Consultation first", "", "55% 40%")}
    <ol class="steps">${steps.map(([t, s]) => `<li><p><b>${esc(t)}</b><span>${esc(s)}</span></p></li>`).join("")}</ol>
  </div>`);

const p3 = panel(3, "p3", `
  <div class="ph hero full-x full-top"><img src="${photo("about-corporate-office-team.png")}" alt="" style="object-position:50% 45%"><span class="chip">Who we are</span></div>
  <h2 style="margin-top:5mm">Your partner in security &amp; IT solutions</h2>
  <p class="lead" style="margin-top:2.6mm">We bring security systems, business technology, software and IT support together under one team, so you can plan, install and maintain your technology with a single partner.</p>
  <div class="vals">${values.map(([t, s]) => `<div><b>${esc(t)}</b><span>${esc(s)}</span></div>`).join("")}</div>
  <div class="ind">
    <div class="kicker" style="color:var(--blue)">Industries we serve</div>
    <div class="row">
      ${ph("industry-education-campus.png", "Education", "", "50% 40%")}
      ${ph("industry-healthcare.png", "Healthcare", "", "55% 40%")}
      ${ph("industry-retail-supermarket.png", "Retail", "", "45% 40%")}
    </div>
    <div class="chips"><span>Corporate offices</span><span>Warehouses</span><span>Restaurants</span><span>Commercial buildings</span><span>SMEs</span></div>
  </div>`);

const p4 = panel(4, "p4", `
  <div class="top">
    <img src="${LOGO}" alt="SHAKOOR logo">
    <div class="name">${company.name1}<small>${company.name2}</small></div>
    <div class="rule"></div>
    <h1>YOUR COMPLETE<br><em>INTEGRATED SOLUTIONS</em><br>PARTNER</h1>
    <div class="tag">${esc(company.tagline)}</div>
  </div>
  <div class="building full-x">
    ${ph("cover-headquarters-glass-building.png", "", "", "34% 50%")}
    <div class="pillars">
      <div>${icon("ShieldCheck")}Security systems</div><div>${icon("Fingerprint")}Business technology</div>
      <div>${icon("Code")}IT &amp; software</div><div>${icon("Cpu")}IoT &amp; digital</div>
    </div>
  </div>`);

const outside = doc(
  "Brochure outside",
  outsideCss,
  `${p1}${p2}${p3}${p4}
  ${guides(["P1 · BACK COVER", "P2 · WHAT WE DO", "P3 · WHO WE ARE", "P4 · FRONT COVER"], ["FOLD 1 · MOUNTAIN", "FOLD 2 · VALLEY", "FOLD 3 · MOUNTAIN"])}`,
);

/* ══ INSIDE (side B) ═════════════════════════════════════════════════════════════ */
const insideCss = `
  body { background:#fff; }
  .ihead { margin: calc(-1 * var(--pt)) calc(-1 * var(--pr)) 0 calc(-1 * var(--pl)); padding: var(--pt) var(--pr) 4.6mm var(--pl);
           color:#fff; background: radial-gradient(80% 120% at 100% 0%, rgba(32,184,255,.22), transparent 70%), linear-gradient(160deg, var(--navy2), var(--midnight)); display:flex; align-items:center; gap:3.4mm; }
  .ihead .num { font-size:21pt; font-weight:800; line-height:1; color:var(--cyan); opacity:.85; padding-right:3.4mm; border-right:.3mm solid rgba(32,184,255,.4); }
  .ihead h2 { font-size:14pt; font-weight:800; line-height:1.1; margin-top:1mm; }
  .ibody { flex:1; display:flex; flex-direction:column; gap:4.6mm; padding-top:4.6mm; min-height:0; }
  .grp { flex: var(--f, 1) 1 0; display:flex; flex-direction:column; min-height:0; }
  .gimgs { flex:1; min-height:24mm; display:flex; gap:2mm; }
  .gimgs .ph { flex:1; }
  .gimgs .ph.side { flex:0 0 37%; }
  .gt { display:flex; align-items:center; gap:2mm; margin-top:3mm; }
  .gt i { flex:none; width:1.1mm; height:4.6mm; border-radius:.6mm; background:var(--acc); }
  .gt h3 { font-size:10.8pt; font-weight:800; line-height:1.15; }
  .gi { margin-top:1.3mm; font-size:7.7pt; line-height:1.35; font-weight:600; color:var(--ink); }
  .grp.row { flex-direction:row; gap:3.4mm; }
  .grp.row .gimgs { flex:0 0 38%; min-height:0; }
  .grp.row .txt { flex:1; display:flex; flex-direction:column; justify-content:center; }
  .grp.row .gt { margin-top:0; }
  .split { display:grid; grid-template-columns:1fr 1fr; gap:3mm; margin-top:2.2mm; }
  .split b { display:block; font-size:7.4pt; font-weight:800; color:var(--acc); text-transform:uppercase; letter-spacing:.08em; }
  .split .ticks { margin-top:1.4mm; grid-template-columns:1fr; }
  .ideal { display:flex; flex-wrap:wrap; gap:1.3mm; margin-top:2.2mm; }
  .ideal span { font-size:6.8pt; font-weight:700; color:var(--navy); background:var(--paper); border:.3mm solid var(--line); border-radius:5mm; padding:.8mm 2.3mm; }
  .band { position:absolute; left:0; right:0; bottom:0; height:${BLEED + 2}mm; background:linear-gradient(90deg,var(--navy),var(--blue),var(--cyan)); z-index:5; }
`;

const ihead = (num, kicker, title) => `<div class="ihead"><span class="num">${num}</span><div><div class="kicker">${esc(kicker)}</div><h2>${esc(title)}</h2></div></div>`;
const gt = (title) => `<div class="gt"><i></i><h3>${esc(title)}</h3></div>`;
const grp = ({ acc, f = 1, imgs, title, intro, items, one }) => `
  <div class="grp" style="--acc:${acc};--f:${f}">
    <div class="gimgs">${imgs.map(([file, cap, pos], i) => ph(file, cap, "", pos).replace('class="ph"', `class="ph${i ? " side" : ""}"`)).join("")}</div>
    ${gt(title)}<p class="gi">${esc(intro)}</p>${ticks(items, one)}
  </div>`;
const rowGrp = ({ acc, f = 1, img, title, intro, items }) => `
  <div class="grp row" style="--acc:${acc};--f:${f}">
    <div class="gimgs">${ph(img[0], img[1], "", img[2])}</div>
    <div class="txt">${gt(title)}<p class="gi">${esc(intro)}</p>${ticks(items, true)}</div>
  </div>`;

const p5 = panel(1, "", `
  ${ihead("01", "Security systems", "Security & Surveillance")}
  <div class="ibody">
    <div class="grp" style="--acc:#20b8ff;--f:1.55">
      <div class="gimgs">${ph("security-cctv-installation.png", "CCTV installation", "", "70% 40%")}</div>
      ${gt("CCTV & Surveillance")}
      <p class="gi">Professional camera systems planned around how your site actually works, from survey to handover.</p>
      ${ticks(["Site survey & camera plan", "Indoor & outdoor cameras", "Recording & storage sizing", "Secure remote viewing", "Neat, labelled cabling", "Testing & handover", "Commercial surveillance", "Maintenance options"])}
    </div>
    <div class="grp" style="--acc:#20b8ff;--f:.9">
      <div class="gimgs">${ph("security-monitoring-reception.png", "Security monitoring", "", "30% 50%")}${ph("security-commercial-surveillance-warehouse.png", "Warehouses", "", "60% 50%").replace('class="ph"', 'class="ph side"')}</div>
      ${gt("Ideal for")}
      <div class="ideal"><span>Offices</span><span>Retail stores</span><span>Warehouses</span><span>Schools</span><span>Hospitals</span><span>Restaurants</span></div>
    </div>
  </div>`);

const p6 = panel(2, "", `
  ${ihead("02", "Business systems", "Access, Attendance & POS")}
  <div class="ibody">
    ${grp({ acc: "#2f7bf5", imgs: [["access-control-rfid-card-reader.jpg", "NFC / RFID card access", "60% 45%"], ["access-control-door-lock-installation.png", "Door access", "75% 40%"]], title: "Access Control & Door Access", intro: "Control who enters which areas, and when.", items: ["NFC & RFID cards", "PIN keypads", "Biometric readers", "Electronic door locks", "Exit buttons & controllers", "Entry logs & permissions"] })}
    ${grp({ acc: "#14b8a6", imgs: [["attendance-face-recognition-terminal.png", "Face recognition", "62% 40%"], ["attendance-fingerprint-time-recording.jpg", "Fingerprint", "45% 55%"]], title: "Attendance Systems", intro: "Accurate time records without manual registers.", items: ["Fingerprint terminals", "Face-recognition terminals", "RFID card clocking", "Shift & overtime reports"] })}
    ${grp({ acc: "#5b6cf0", imgs: [["pos-supermarket-checkout.png", "Supermarket checkout", "55% 45%"], ["pos-restaurant-billing.png", "Restaurant POS", "45% 50%"]], title: "Retail & POS Systems", intro: "Faster checkout, with stock and sales in one place.", items: ["POS terminals & software", "Barcode scanners", "Printers & cash drawers", "Inventory & billing", "Sales reporting", "Restaurant POS"] })}
  </div>`);

const p7 = panel(3, "", `
  ${ihead("03", "IT & development", "IT, Software & Web")}
  <div class="ibody">
    ${grp({ acc: "#0ea5e9", imgs: [["it-support-hardware-engineer.png", "Hardware support", "40% 40%"], ["it-network-infrastructure-cabling.jpg", "Network infrastructure", "45% 50%"]], title: "IT Support & Infrastructure", intro: "Keep computers, networks and servers running reliably.", items: ["Computer & hardware support", "Network setup & Wi-Fi", "Server assistance", "Data backup", "Workstation setup", "Business IT troubleshooting"] })}
    <div class="grp" style="--acc:#2563eb">
      <div class="gimgs">${ph("software-website-development.png", "Software & web development", "", "55% 45%")}</div>
      ${gt("Software & Website Development")}
      <p class="gi">Business software and websites built around how you work.</p>
      <div class="split">
        <div><b>Software</b>${ticks(["Custom business tools", "Dashboards & reports", "Workflow automation", "System integrations"], true)}</div>
        <div><b>Websites</b>${ticks(["Corporate websites", "Landing pages", "Responsive design", "SEO-ready content"], true)}</div>
      </div>
    </div>
  </div>`);

const p8 = panel(4, "", `
  ${ihead("04", "Smart & digital", "IoT, Marketing & Content")}
  <div class="ibody">
    ${grp({ acc: "#10b981", f: 1.8, imgs: [["iot-smart-agriculture-buildings.png", "Smart agriculture · buildings · industry", "40% 50%"]], title: "IoT & Smart Automation", intro: "Monitor and automate equipment, sites and farms remotely.", items: ["Smart agriculture sensors", "Automated irrigation", "Smart buildings & offices", "Industrial IoT monitoring", "Energy monitoring", "Dashboards & alerts"] })}
    ${rowGrp({ acc: "#7c6cf0", f: .9, img: ["digital-marketing-team.png", "", "22% 50%"], title: "Digital Marketing", intro: "Help the right customers find your business.", items: ["SEO & search marketing", "Social media campaigns", "Digital advertising", "Analytics & reporting"] })}
    ${rowGrp({ acc: "#0891b2", f: .9, img: ["content-writing-workspace.png", "", "66% 50%"], title: "Content Writing", intro: "Clear, professional writing for web and print.", items: ["Website & SEO content", "Blogs & articles", "Business profiles", "Editing & proofreading"] })}
  </div>`);

const insideHtml = doc(
  "Brochure inside",
  insideCss,
  `${p5}${p6}${p7}${p8}<div class="band"></div>
  ${guides(["P5 · SECURITY & SURVEILLANCE", "P6 · ACCESS, ATTENDANCE & POS", "P7 · IT, SOFTWARE & WEB", "P8 · IoT, MARKETING & CONTENT"], ["FOLD 3 · VALLEY", "FOLD 2 · MOUNTAIN", "FOLD 1 · VALLEY"])}`,
);

/* ── FOLDING PROOF ────────────────────────────────────────────────────────────── */
const strip = (title, cells, folds, note, dark) => `
  <div class="strip-wrap">
    <div class="strip-title">${title}</div>
    <div class="strip">
      ${cells.map(([n, t, sub, hl]) => `<div class="cell${hl ? " hl" : ""}${dark ? " dk" : ""}"><b>${n}</b><span>${t}</span><em>${sub}</em></div>`).join("")}
      ${folds.map((f, i) => `<div class="fold" style="left:${(i + 1) * 25}%"><span>${f}</span></div>`).join("")}
    </div>
    <div class="note">${note}</div>
  </div>`;

const proof = `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><title>Folding proof</title><style>
${css(SHEET_W + 2 * BLEED, PANEL_H + 2 * BLEED)}
  body { background:#fff; padding:12mm 16mm; }
  h1 { font-size:20pt; font-weight:800; } .sub { margin-top:2mm; font-size:9.5pt; color:var(--slate); font-weight:500; }
  .row { display:grid; grid-template-columns:1fr 1fr; gap:10mm; margin-top:8mm; }
  .strip-wrap { margin-top:6mm; } .strip-title { font-size:10pt; font-weight:800; margin-bottom:2.5mm; }
  .strip { position:relative; display:grid; grid-template-columns:repeat(4,1fr); height:25mm; border:.4mm solid var(--ink); }
  .cell { padding:2.5mm; border-right:.2mm solid var(--line); display:flex; flex-direction:column; gap:.6mm; background:var(--paper); }
  .cell.dk { background:#e8f0f8; } .cell.hl { background:var(--navy); color:#fff; }
  .cell b { font-size:12pt; font-weight:800; } .cell span { font-size:8pt; font-weight:700; line-height:1.25; } .cell em { font-style:normal; font-size:7pt; color:var(--slate); }
  .cell.hl em { color:var(--mist); }
  .fold { position:absolute; top:-3mm; bottom:-3mm; border-left:.6mm dashed #ff0080; }
  .fold span { position:absolute; bottom:-5.5mm; left:-15mm; width:30mm; text-align:center; font-size:6.8pt; font-weight:800; color:#ff0080; }
  .note { margin-top:12mm; font-size:7.6pt; color:var(--slate); font-weight:500; }
  .box { border:.3mm solid var(--line); border-radius:2mm; padding:5mm; background:var(--paper); }
  .box h3 { font-size:10.5pt; font-weight:800; margin-bottom:2.5mm; }
  .box li { font-size:8.2pt; line-height:1.55; margin-left:4mm; color:var(--ink); font-weight:500; }
  .stack { display:flex; flex-direction:column; gap:1.2mm; margin-top:2mm; }
  .stack div { font-size:8pt; font-weight:700; padding:1.6mm 3mm; border-radius:1mm; background:#fff; border:.3mm solid var(--line); }
  .stack div.t { background:var(--navy); color:#fff; } .stack div.b { background:#e8f0f8; }
  .zig { margin-top:3mm; }
  .side { margin-top:7mm; border:.3mm solid var(--line); border-radius:2mm; padding:5mm 6mm; display:grid; grid-template-columns:1fr 1.15fr; gap:8mm; align-items:center; }
  .side h3 { font-size:10.5pt; font-weight:800; margin-bottom:2mm; } .side p { font-size:8.2pt; line-height:1.55; color:var(--slate); font-weight:500; }
  .side svg { width:100%; height:42mm; display:block; }
  .warn { margin-top:6mm; padding:4mm 5mm; border-radius:2mm; background:#fff4e5; border:.3mm solid #f5b041; font-size:8.4pt; line-height:1.5; }
  .warn b { font-weight:800; }
</style></head><body>
  <h1>Folding proof — 8-panel Z-fold (accordion) brochure</h1>
  <div class="sub">SHAKOOR Integrated Solutions (Pvt.) Ltd. · one sheet, printed both sides, 4 equal panels per side, 3 folds · ${PROVISIONAL ? `<b>provisional size ${SHEET_W} × ${PANEL_H} mm (${PANEL_W} mm panels) — awaiting printer's K4 specification</b>` : `${SHEET_W} × ${PANEL_H} mm`}</div>

  ${strip("Side A — OUTSIDE (print side 1), as viewed", [["P1", "Back cover", "Contact & enquiries"], ["P2", "What we do", "Services + how we work"], ["P3", "Who we are", "Company + industries"], ["P4", "FRONT COVER", "Logo, name, tagline", true]], ["FOLD 1 · MOUNTAIN", "FOLD 2 · VALLEY", "FOLD 3 · MOUNTAIN"], "Mountain = fold peak toward you on this side; valley = fold dips away from you on this side.", false)}

  ${strip("Side B — INSIDE (print side 2), as viewed after turning the sheet over left-to-right", [["P5", "Security & surveillance", "behind P4 (front cover)"], ["P6", "Access, attendance & POS", "behind P3"], ["P7", "IT, software & web", "behind P2"], ["P8", "IoT, marketing & content", "behind P1 (back cover)"]], ["FOLD 3 · VALLEY", "FOLD 2 · MOUNTAIN", "FOLD 1 · VALLEY"], "Each fold is the opposite type on this side. Fully opened, the inside reads left to right: P5 → P6 → P7 → P8.", true)}

  <div class="row">
    <div class="box">
      <h3>Duplex (two-sided) printing</h3>
      <ul>
        <li>Turn the sheet on its <b>short edge</b> (left ↔ right), keeping the top edge at the top.</li>
        <li>Back-to-back pairs: <b>P4 ↔ P5</b>, <b>P3 ↔ P6</b>, <b>P2 ↔ P7</b>, <b>P1 ↔ P8</b>.</li>
        <li>Fold lines on both sides must line up exactly; panels are equal width (standard for accordion folds).</li>
        <li>Folding direction: P1|P2 mountain, P2|P3 valley, P3|P4 mountain (seen from the outside).</li>
      </ul>
      <h3 style="margin-top:4mm">Folded stack (top to bottom)</h3>
      <div class="stack">
        <div class="t">P4 — FRONT COVER (face up)</div>
        <div>P5 + P6 — revealed when the cover is opened</div>
        <div>P3 + P2 — next spread (introduction, then overview)</div>
        <div>P7 + P8 — next spread</div>
        <div class="b">P1 — BACK COVER (face down)</div>
      </div>
    </div>
    <div class="box">
      <h3>Reading sequence</h3>
      <ul>
        <li><b>Closed:</b> front cover P4 on top, back cover P1 underneath.</li>
        <li><b>Paging through like a booklet:</b> P4 → P5|P6 → P3|P2 → P7|P8 → P1.</li>
        <li><b>Fully opened, inside up:</b> all four service panels P5 → P8 in one row.</li>
        <li><b>Fully opened, outside up:</b> P1 back cover · P2 overview · P3 introduction · P4 front cover.</li>
      </ul>
      <div class="warn">
        <b>To confirm with the printing agency before the print PDF is made:</b><br>
        1. Exact K4 sheet size (width × height) and whether panels stay equal width.<br>
        2. Paper stock and weight (e.g. glossy art paper, gsm) and whether creasing is used.<br>
        3. Bleed (3 mm assumed) and whether crop / fold marks are required.<br>
        4. Duplex turn: short edge (assumed here) or long edge.<br>
        5. Colour: whether they accept RGB PDF and convert to CMYK, or require a CMYK/PDF-X file.
      </div>
    </div>
  </div>

  <div class="side">
    <div>
      <h3>Side view while folding (looking at the top edge)</h3>
      <p>The sheet zig-zags like an accordion. Each segment is one panel: each label gives the outside-face panel first and the inside-face panel second. Mountain and valley folds alternate, so all four panels stack flat with the front cover P4 on top.</p>
      <p style="margin-top:2mm">When fully folded the brochure measures one panel: <b>${PANEL_W} × ${PANEL_H} mm</b> (provisional).</p>
    </div>
    <svg viewBox="0 0 560 165" xmlns="http://www.w3.org/2000/svg" font-family="Plus Jakarta Sans, Arial" font-weight="700">
      <polyline points="20,120 150,40 280,120 410,40 540,120" fill="none" stroke="#071f38" stroke-width="7" stroke-linejoin="round"/>
      <polyline points="20,120 150,40 280,120 410,40 540,120" fill="none" stroke="#20b8ff" stroke-width="2" stroke-linejoin="round" transform="translate(0,-5)"/>
      ${[[150, 40, "FOLD 1", "MOUNTAIN", -16], [280, 120, "FOLD 2", "VALLEY", 26], [410, 40, "FOLD 3", "MOUNTAIN", -16]].map(([x, y, a, b, dy]) => `<circle cx="${x}" cy="${y}" r="6" fill="#ff0080"/><text x="${x}" y="${y + dy}" text-anchor="middle" font-size="11" fill="#ff0080">${a} · ${b}</text>`).join("")}
      ${[[85, "P1 / P8"], [215, "P2 / P7"], [345, "P3 / P6"], [475, "P4 / P5"]].map(([x, t]) => `<rect x="${x - 30}" y="69" width="60" height="20" rx="10" fill="#fff" stroke="#dde6f0"/><text x="${x}" y="83" text-anchor="middle" font-size="12" fill="#06182c">${t}</text>`).join("")}
      <text x="560" y="162" text-anchor="end" font-size="10" fill="#4a5e75" font-weight="500">P1 / P8 = outside face / inside face of the same panel</text>
    </svg>
  </div>
</body></html>`;


// Two-page print file: page 1 = outside (side A), page 2 = inside (side B). No guides when PREVIEW=0.
const printHtml = doc(
  "SHAKOOR brochure print",
  `${outsideCss}${insideCss}
  .sheet { position:relative; width:${SHEET_W + 2 * BLEED}mm; height:${PANEL_H + 2 * BLEED}mm; overflow:hidden; break-after:page; }
  .sheet:last-child { break-after:auto; }`,
  `<div class="sheet">${p1}${p2}${p3}${p4}</div><div class="sheet">${p5}${p6}${p7}${p8}<div class="band"></div></div>`,
);
fs.writeFileSync(path.join(__dirname, "print.html"), printHtml);
fs.writeFileSync(path.join(__dirname, "outside.html"), outside);
fs.writeFileSync(path.join(__dirname, "inside.html"), insideHtml);
fs.writeFileSync(path.join(__dirname, "proof.html"), proof);
console.log(`Brochure v2 built: ${SHEET_W} × ${PANEL_H} mm sheet, ${PANEL_W} mm panels${PROVISIONAL ? " (PROVISIONAL)" : ""}, guides ${PREVIEW ? "ON" : "OFF"}.`);
