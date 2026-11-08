/*
 * SHAKOOR Integrated Solutions — corporate marketing flyer (A4 landscape, single-sided).
 *
 * Editable source. Change the content below, then run:
 *   node print/voucher/build.cjs      (writes voucher.html)
 *   print/voucher/export.cmd          (writes the print PDF and 300 DPI PNG preview)
 *
 * Page = A4 landscape 297 × 210 mm + 3 mm bleed on every side = 303 × 216 mm.
 * Everything that must not be trimmed sits at least 8 mm inside the trim line.
 */
const fs = require("fs");
const path = require("path");
const React = require("react");
const { renderToStaticMarkup } = require("react-dom/server");
const { Phone, Mail, Globe } = require("lucide-react");

const ROOT = path.resolve(__dirname, "../..");
const img = (p) => path.relative(__dirname, path.join(ROOT, "public", p)).split(path.sep).join("/");
const icon = (Cmp) => renderToStaticMarkup(React.createElement(Cmp, { size: 13, strokeWidth: 2, "aria-hidden": true }));

/* ── Content (verified against the website and the company's mailboxes) ────────── */
const company = {
  name: "SHAKOOR INTEGRATED SOLUTIONS (PVT.) LTD.",
  tagline: "Integrated Solutions for a Smarter, Safer & Connected World",
  phone: "0345 9319469",
  // Only addresses that exist as mailboxes on the company domain.
  emails: ["info@shakoorsolutions.com", "safiullah@shakoorsolutions.com"],
  web: "shakoorsolutions.com",
};

const categories = [
  {
    title: "Security & Surveillance",
    image: "/images/industries/commercial-buildings-security.png",
    position: "28% 50%",
    items: [
      "CCTV installation & surveillance systems",
      "Indoor & outdoor security cameras",
      "Recording, storage & remote viewing",
      "Site surveys, integration & maintenance",
    ],
  },
  {
    title: "Access Control & Attendance",
    image: "/images/portfolio/workforce-attendance-system.jpg",
    position: "60% 50%",
    items: [
      "Door access control & electronic locks",
      "NFC / RFID card, PIN & biometric access",
      "Fingerprint & face-recognition attendance",
      "Employee time & attendance reporting",
    ],
  },
  {
    title: "Retail & POS Solutions",
    image: "/images/industries/retail-supermarkets-pos.png",
    position: "45% 45%",
    items: [
      "POS terminals, hardware & software",
      "Barcode scanners, printers & cash drawers",
      "Retail & supermarket checkout solutions",
      "Inventory, billing & sales reporting",
    ],
  },
  {
    title: "IT Support & Infrastructure",
    image: "/images/services/it-support/it-support-onsite-workstation.png",
    position: "40% 40%",
    items: [
      "Computer & IT hardware support",
      "Software installation & support",
      "Network troubleshooting & maintenance",
      "Workstations, servers & backups",
    ],
  },
  {
    title: "Software & Website Development",
    image: "/images/services/website-development/developer-workspace-code-and-website.png",
    position: "55% 45%",
    items: [
      "Business website design & development",
      "Custom business software",
      "Web applications & dashboards",
      "APIs, integrations & workflow automation",
    ],
  },
  {
    title: "IoT & Smart Automation",
    image: "/images/services/iot/iot-smart-automation.png",
    position: "30% 55%",
    items: [
      "Smart door, gate, home & office automation",
      "Smart agriculture & automated irrigation",
      "Soil moisture, water level & climate monitoring",
      "Industrial IoT & remote equipment monitoring",
      "Smart energy monitoring",
      "Custom dashboards & real-time alerts",
    ],
  },
  {
    title: "Digital Marketing",
    image: "/images/services/digital-marketing/digital-marketing-team.png",
    position: "55% 45%",
    items: [
      "SEO & search engine marketing",
      "Social media marketing & management",
      "Google, Facebook & Instagram advertising",
      "Email marketing & lead generation",
      "Digital branding, analytics & reporting",
    ],
  },
  {
    title: "Content Writing",
    image: "/images/services/content-writing/content-writing-workspace.png",
    position: "62% 45%",
    items: [
      "Website & SEO content writing",
      "Blogs, articles & social media content",
      "Business profiles & product descriptions",
      "Marketing & technical copywriting",
      "Editing & proofreading",
    ],
  },
];

/* ── Layout ───────────────────────────────────────────────────────────────────── */
const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const cards = categories
  .map(
    (c) => `
    <article class="card">
      <div class="photo"><img src="${img(c.image)}" alt="" style="object-position:${c.position}"></div>
      <div class="body">
        <h2>${esc(c.title)}</h2>
        <ul>${c.items.map((i) => `<li>${esc(i)}</li>`).join("")}</ul>
      </div>
    </article>`,
  )
  .join("");

const emails = company.emails.map((e) => `<li>${icon(Mail)}<span>${esc(e)}</span></li>`).join("");

const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>SHAKOOR Integrated Solutions — Corporate Flyer</title>
<style>
  /* Static weights (SIL OFL, see fonts/OFL-LICENSE.txt) so the PDF embeds real font programs. */
  @font-face { font-family: "Plus Jakarta Sans"; font-weight: 500; src: url("fonts/plus-jakarta-sans-latin-500-normal.woff2") format("woff2"); }
  @font-face { font-family: "Plus Jakarta Sans"; font-weight: 600; src: url("fonts/plus-jakarta-sans-latin-600-normal.woff2") format("woff2"); }
  @font-face { font-family: "Plus Jakarta Sans"; font-weight: 700; src: url("fonts/plus-jakarta-sans-latin-700-normal.woff2") format("woff2"); }
  @font-face { font-family: "Plus Jakarta Sans"; font-weight: 800; src: url("fonts/plus-jakarta-sans-latin-800-normal.woff2") format("woff2"); }
  @page { size: 303mm 216mm; margin: 0; }
  :root {
    --midnight: #041426; --navy: #071f38; --navy2: #0b2a4a; --blue: #0a6fd1; --bright: #087fe5;
    --cyan: #20b8ff; --mist: #afc2d6; --paper: #f4f8fc; --ink: #06182c; --slate: #4a5e75; --line: #dde6f0;
  }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  html, body { width: 303mm; height: 216mm; }
  body {
    font-family: "Plus Jakarta Sans", Arial, sans-serif; color: var(--ink); background: var(--paper);
    -webkit-print-color-adjust: exact; print-color-adjust: exact; position: relative; overflow: hidden;
  }
  /* Trim box: 3 mm inside the page edge. Safe area: 8 mm further in. */
  .trim { position: absolute; left: 3mm; top: 3mm; width: 297mm; height: 210mm; }

  /* Header — runs into the bleed at the top, left and right. */
  .header {
    position: absolute; left: 0; top: 0; width: 303mm; height: 47mm; color: #fff; overflow: hidden;
    background:
      radial-gradient(60% 140% at 92% 0%, rgba(32,184,255,.30), transparent 60%),
      radial-gradient(50% 120% at 0% 100%, rgba(10,111,209,.35), transparent 65%),
      linear-gradient(135deg, var(--navy2) 0%, var(--navy) 45%, var(--midnight) 100%);
  }
  .header::after {
    content: ""; position: absolute; inset: 0; opacity: .5;
    background-image: linear-gradient(rgba(130,180,230,.07) 1px, transparent 1px), linear-gradient(90deg, rgba(130,180,230,.07) 1px, transparent 1px);
    background-size: 8mm 8mm;
  }
  .header-inner {
    position: absolute; left: 11mm; right: 11mm; top: 10mm; height: 30mm; z-index: 1;
    display: flex; align-items: center; justify-content: space-between; gap: 10mm;
  }
  .brand { display: flex; align-items: center; gap: 5mm; }
  .brand img { height: 25mm; width: auto; filter: drop-shadow(0 1.5mm 3mm rgba(0,0,0,.35)); }
  .brand .name { font-size: 15.5pt; font-weight: 800; letter-spacing: .04em; line-height: 1.15; }
  .nowrap { white-space: nowrap; }
  .brand .tagline { margin-top: 2mm; font-size: 9.5pt; font-weight: 500; color: var(--mist); }
  .brand .rule { margin-top: 2.5mm; width: 18mm; height: .7mm; border-radius: 1mm; background: linear-gradient(90deg, var(--cyan), var(--bright)); }
  .headline { text-align: right; max-width: 112mm; }
  .headline .kicker { font-size: 8.5pt; font-weight: 600; color: var(--cyan); letter-spacing: .02em; }
  .headline h1 { margin-top: 1.5mm; font-size: 22pt; line-height: 1.08; font-weight: 800; letter-spacing: -.01em; }

  /* Service grid */
  .grid {
    position: absolute; left: 11mm; right: 11mm; top: 51mm; height: 126mm;
    display: grid; grid-template-columns: repeat(4, 1fr); grid-template-rows: repeat(2, 1fr); gap: 4mm;
  }
  .card {
    background: #fff; border: .25mm solid var(--line); border-radius: 3mm; overflow: hidden;
    display: flex; flex-direction: column; box-shadow: 0 .6mm 2mm rgba(4,20,38,.06);
  }
  .photo { height: 22mm; flex: none; overflow: hidden; background: var(--navy); }
  .photo img { width: 100%; height: 100%; object-fit: cover; display: block; }
  .body { padding: 3mm 3.4mm 2.6mm; flex: 1; }
  .body h2 {
    font-size: 9.6pt; font-weight: 800; color: var(--ink); line-height: 1.2;
    padding-left: 2.6mm; border-left: .8mm solid var(--cyan);
  }
  .body ul { list-style: none; margin-top: 2mm; }
  .body li {
    position: relative; padding-left: 3mm; font-size: 7.4pt; line-height: 1.32; color: var(--slate); font-weight: 500;
  }
  .body li + li { margin-top: .75mm; }
  .body li::before {
    content: ""; position: absolute; left: 0; top: 1.25mm; width: 1.2mm; height: 1.2mm; border-radius: .3mm; background: var(--blue);
  }

  /* Footer — runs into the bleed at the bottom, left and right. */
  .footer {
    position: absolute; left: 0; bottom: 0; width: 303mm; height: 36mm; color: #fff;
    background:
      radial-gradient(40% 160% at 100% 100%, rgba(32,184,255,.22), transparent 60%),
      linear-gradient(90deg, var(--midnight), var(--navy) 60%, var(--navy2));
  }
  .footer-inner {
    position: absolute; left: 11mm; right: 11mm; top: 6.5mm; bottom: 11mm;
    display: flex; align-items: center; justify-content: space-between; gap: 8mm;
  }
  .cta { display: flex; align-items: center; gap: 4mm; }
  .cta .bar { width: 1mm; align-self: stretch; border-radius: 1mm; background: linear-gradient(var(--cyan), var(--blue)); }
  .cta strong { display: block; font-size: 12.5pt; font-weight: 800; line-height: 1.2; }
  .cta span { display: block; margin-top: 1.2mm; font-size: 8.4pt; color: var(--mist); font-weight: 500; }
  .contacts { display: flex; align-items: center; gap: 6mm; }
  .contacts ul { list-style: none; }
  /* No ligatures in contact details, so addresses copy correctly from the PDF (e.g. "fi" in safiullah). */
  .contacts, .phone { font-variant-ligatures: none; font-feature-settings: "liga" 0, "clig" 0; }
  .contacts li { display: flex; align-items: center; gap: 2mm; font-size: 9.2pt; font-weight: 600; white-space: nowrap; }
  .contacts li + li { margin-top: 1.4mm; }
  .contacts svg { color: var(--cyan); flex: none; width: 3.6mm; height: 3.6mm; }
  .phone {
    display: flex; align-items: center; gap: 2.4mm; padding: 2.6mm 4.4mm; border-radius: 2.4mm;
    background: linear-gradient(135deg, var(--blue), var(--bright)); font-size: 12pt; font-weight: 800; white-space: nowrap;
  }
  .phone svg { width: 4.2mm; height: 4.2mm; color: #fff; }
</style>
</head>
<body>
  <header class="header">
    <div class="header-inner">
      <div class="brand">
        <img src="${img("/images/brand/shakoor-logo.png")}" alt="SHAKOOR logo">
        <div>
          <div class="name">${esc(company.name).replace(" (PVT.) LTD.", "<br><span class=\"nowrap\">(PVT.) LTD.</span>")}</div>
          <div class="tagline">${esc(company.tagline)}</div>
          <div class="rule"></div>
        </div>
      </div>
      <div class="headline">
        <div class="kicker">Security, business technology, IoT and digital services</div>
        <h1>Your complete integrated solutions partner</h1>
      </div>
    </div>
  </header>

  <main class="grid">${cards}
  </main>

  <footer class="footer">
    <div class="footer-inner">
      <div class="cta">
        <div class="bar"></div>
        <div>
          <strong>Contact us for business enquiries &amp; custom solutions</strong>
          <span>Consultations, site assessments and solutions planned around your business.</span>
        </div>
      </div>
      <div class="contacts">
        <div class="phone">${icon(Phone)}<span>${esc(company.phone)}</span></div>
        <ul>${emails}<li>${icon(Globe)}<span>${esc(company.web)}</span></li></ul>
      </div>
    </div>
  </footer>
</body>
</html>`;

fs.writeFileSync(path.join(__dirname, "voucher.html"), html);
console.log(`voucher.html written (${company.emails.length} email address${company.emails.length === 1 ? "" : "es"})`);
