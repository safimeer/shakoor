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
| Portfolio (7 sample entries) | `images/portfolio/sample-*.png` | Only needed if the sample entries stay. Replace them with photos from genuine projects. |

## Logo

The site still shows the text placeholder. Save the official logo in `public/images/brand/` and set `site.logo` in `data/site.ts` (path, plus the file's real width and height so its proportions are preserved).

## Video (optional)

No video is referenced. A muted, looping hero clip (under 4 MB, with a poster image) can be added to `public/videos/` later.
