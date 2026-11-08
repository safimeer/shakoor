/*
 * SHAKOOR Integrated Solutions — LinkedIn Company Page images.
 *
 *   node build.cjs   → writes logo.html and banner.html, then run export.cmd
 *
 * Outputs (after export.cmd):
 *   SHAKOOR_LinkedIn_Logo.png    800 × 800 (LinkedIn shows it at 400 × 400 and smaller)
 *   SHAKOOR_LinkedIn_Banner.png  2256 × 382 (LinkedIn's 1128 × 191 cover at 2×)
 *
 * The page logo sits over the banner's lower-left corner, so the banner keeps
 * its text to the right and leaves that corner as background.
 */
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "../..");
const OUT = __dirname;
const FONTS = path.join(ROOT, "print/SHAKOOR_Business_Card/fonts");

const C = { midnight: "#041426", navy: "#071f38", navy2: "#0b2a4a", electric: "#087fe5", cyan: "#20b8ff", mist: "#afc2d6", silver: "#c9d3de" };

const logo = "data:image/png;base64," + fs.readFileSync(path.join(ROOT, "public/images/brand/shakoor-logo.png")).toString("base64");
const fontCss = [500, 600, 700, 800]
  .map((wt) => `@font-face{font-family:"PJS";font-weight:${wt};src:url(data:font/woff2;base64,${fs.readFileSync(path.join(FONTS, `plus-jakarta-sans-latin-${wt}-normal.woff2`)).toString("base64")}) format("woff2");}`)
  .join("");

const page = (w, h, body, css) => `<!doctype html><html><head><meta charset="utf-8"><style>${fontCss}
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:${w}px;height:${h}px;overflow:hidden;font-family:"PJS",Arial,sans-serif;-webkit-font-smoothing:antialiased}
${css}</style></head><body>${body}</body></html>`;

// Square logo: the mark centred on the brand navy, with room for LinkedIn's rounded crop.
const logoHtml = page(400, 400, `<div class="sq"><img src="${logo}" alt=""></div>`, `
.sq{width:400px;height:400px;display:flex;align-items:center;justify-content:center;
  background:radial-gradient(circle at 50% 42%, ${C.navy2} 0%, ${C.navy} 55%, ${C.midnight} 100%)}
.sq img{width:300px;height:auto;filter:drop-shadow(0 6px 18px rgba(32,184,255,.25))}`);

const services = ["IT Infrastructure", "Networking", "Cybersecurity", "Software", "CCTV & Access Control", "Attendance Systems", "IoT & Automation"];

const arcs = [260, 340, 420, 500]
  .map((r) => `<circle cx="1128" cy="0" r="${r}" fill="none" stroke="${C.cyan}" stroke-opacity=".09" stroke-width="1"/>`)
  .join("");

const bannerHtml = page(1128, 191, `
<svg class="arcs" width="1128" height="191" viewBox="0 0 1128 191">${arcs}</svg>
<div class="glow"></div>
<div class="content">
  <div class="name"><span class="bar"></span>SHAKOOR INTEGRATED SOLUTIONS (PVT.) LTD.</div>
  <h1>Integrated Solutions for a Smarter, Safer &amp; Connected World</h1>
  <div class="rule"></div>
  <ul>${services.map((s) => `<li>${s}</li>`).join("")}</ul>
</div>`, `
body{background:linear-gradient(115deg, ${C.midnight} 0%, ${C.navy} 45%, ${C.navy2} 100%);position:relative}
.arcs{position:absolute;inset:0}
.glow{position:absolute;right:-120px;top:-160px;width:520px;height:420px;border-radius:50%;
  background:radial-gradient(closest-side, rgba(8,127,229,.28), rgba(8,127,229,0))}
.content{position:absolute;left:300px;right:40px;top:0;bottom:0;display:flex;flex-direction:column;justify-content:center}
.name{display:flex;align-items:center;gap:10px;font-size:11.5px;font-weight:700;letter-spacing:.14em;color:${C.silver}}
.bar{display:inline-block;width:22px;height:3px;border-radius:2px;background:${C.cyan}}
h1{margin-top:9px;font-size:25px;white-space:nowrap;line-height:1.15;font-weight:800;color:#fff;letter-spacing:-.005em}
.rule{margin:13px 0 11px;height:2px;width:100%;background:linear-gradient(90deg, ${C.electric}, rgba(32,184,255,0))}
ul{list-style:none;display:flex;flex-wrap:wrap;gap:6px 13px}
li{font-size:11.5px;white-space:nowrap;font-weight:600;color:${C.mist};display:flex;align-items:center;gap:7px}
li::before{content:"";width:5px;height:5px;border-radius:50%;background:${C.cyan}}`);

fs.writeFileSync(path.join(OUT, "logo.html"), logoHtml);
fs.writeFileSync(path.join(OUT, "banner.html"), bannerHtml);
console.log("Wrote logo.html and banner.html");
