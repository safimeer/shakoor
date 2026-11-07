# Image assets

Image paths are set in `data/services.ts`, `data/industries.ts`, `data/portfolio.ts`, `components/home/Hero.tsx`, `components/home/AboutIntro.tsx` and `app/about/page.tsx`. Any slot whose file is missing shows a designed navy placeholder; in `npm run dev` the placeholder names the file it expects.

Next.js serves resized, optimized versions of these images automatically, so the PNG originals can stay as they are. In production, rebuild after adding or replacing images.

Each card has a crop focus (`cardPosition`, `heroPosition`, `image.position`) so the subject stays in frame. Adjust these if a replacement photo is composed differently.

## Supplied images in use

| File | Used for |
| --- | --- |
| `images/hero/shakoor-headquarters-blue-hour.png` | Homepage hero background; About page hero |
| `images/services/cctv/cctv-installation-technicians.png` | CCTV Installation |
| `images/industries/commercial-buildings-security.png` | Access Control Systems; Commercial buildings |
| `images/services/attendance/attendance-biometric-terminal-install.png` | Attendance Systems |
| `images/services/door-access/door-access-maglock-installation.png` | Door Access Installation |
| `images/services/pos/pos-grocery-checkout-setup.png` | Point of Sale (POS) Systems |
| `images/services/website-development/developer-workspace-code-and-website.png` | Website Development; Software Development (temporary, zoomed onto the code screen) |
| `images/services/it-support/it-support-onsite-workstation.png` | IT Support Services |
| `images/industries/corporate-office.png` | Corporate offices; homepage About section |
| `images/industries/retail-supermarkets-pos.png` | Retail and supermarkets |
| `images/industries/restaurants-hospitality-pos.png` | Restaurants and hospitality |
| `images/industries/warehouses-logistics.png` | Warehouses and logistics |
| `images/industries/educational-institutions-campus.png` | Educational institutions |
| `images/industries/healthcare-facilities-hospital.png` | Healthcare facilities |

## Still needed

| Slot | Suggested file | Notes |
| --- | --- | --- |
| Software Development | `images/services/software-development/software-development-team.png` | Currently borrows the website-development photo. Suggested subject: a developer or small team working on a business dashboard or internal application. Update `cardImage`/`heroImage` and remove `cardZoom` in `data/services.ts` once it's added. |
| Small and medium-sized businesses | `images/industries/small-medium-businesses.png` | The card currently uses an intentional navy icon layout. Add an `image` entry in `data/industries.ts` to switch it to a photo card. |
| Homepage About section (optional) | `images/about/about-team.png` | Currently reuses the corporate-office photo, which also appears in the Industries grid. A team or company photo would avoid the repeat. |
| Portfolio (4 remaining sample entries) | `images/portfolio/sample-*.webp` | The 3 entries shown on the homepage now have photos (see Image sources below). The other 4 (retail POS, operations dashboard, corporate website, office network) still use placeholders. Replace with genuine project photos when real case studies are added. |
| ~~IoT & Smart Automation~~ | `images/services/iot/iot-smart-automation.png` | **Done** (IoT Smart Automation Dashboard Montage). |
| ~~Digital Marketing Solutions~~ | `images/services/digital-marketing/digital-marketing-team.png` | **Done** (Modern Digital Marketing Team Workspace). |
| ~~Professional Content Writing~~ | `images/services/content-writing/content-writing-workspace.png` | **Done** (Professional Content Writing Workspace). |

### Image sources and licences

| File | Source | Licence |
| --- | --- | --- |
| `images/portfolio/office-access-control.jpg` | [Pexels #13657375](https://www.pexels.com/photo/close-up-of-man-holding-access-card-over-reader-13657375/), photo by Susanne Plank | [Pexels licence](https://www.pexels.com/license/): free for commercial use, no attribution required. Don't sell it unaltered or imply the pictured person endorses the company. |
| `images/portfolio/workforce-attendance-system.jpg` | [Pexels #17155842](https://www.pexels.com/photo/finger-scan-17155842/), photo by panumas nikhomkhai | Pexels licence, as above |
| `images/portfolio/warehouse-cctv-surveillance.png` | Company-supplied (Modern Warehouse Logistics Operations); also used for the Warehouses industry card | Company-owned |
| All other images under `public/images/` | Company-supplied | Company-owned |

The portfolio photos illustrate the *type* of work. Those projects stay labelled "Sample layout" until real case studies replace them.

## Logo

The site still shows the text placeholder. Save the official logo in `public/images/brand/` and set `site.logo` in `data/site.ts` (path, plus the file's real width and height so its proportions are preserved).

## Video (optional)

No video is referenced. A muted, looping hero clip (under 4 MB, with a poster image) can be added to `public/videos/` later.
