# SHAKOOR Integrated Solutions — website

Corporate website for **Shakoor Integrated Solutions Private Limited**, built with Next.js 16 (App Router, Cache Components), React 19, TypeScript and Tailwind CSS v4.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm run lint
npm run build      # production build
```

## Where to edit content

| What | File |
| --- | --- |
| Company name, contact details, logo, social links | `data/site.ts` |
| All eight services (cards, menu, detail pages, form options) | `data/services.ts` |
| About copy, mission, values, why choose us, process | `data/company.ts` |
| Industries | `data/industries.ts` |
| Portfolio and case studies | `data/portfolio.ts` |
| Design tokens (colours, type scale) | `app/globals.css` |

Search for `TODO(company)` to find every value waiting for verified information. Contact details are `null` until set, and the UI hides them until then; they are never shown as fake values.

Portfolio entries are **sample layouts** (`demo: true`). They are labelled on screen, marked `noindex` and left out of the sitemap. Set `demo: false` only for genuine projects.

## Images and logo

See [`IMAGES.md`](IMAGES.md) for every expected file path and a generation prompt for each. Save an image at its listed path and it replaces the placeholder automatically. In production, rebuild after adding images.

The logo is configured in `data/site.ts` (`site.logo`) and rendered only by `components/layout/Logo.tsx`.

## Enquiry email

Enquiries are sent through [Resend](https://resend.com) from `app/api/enquiry/route.ts`. Copy `.env.example` to `.env.local` and set:

- `RESEND_API_KEY`
- `ENQUIRY_TO_EMAIL`: where enquiries are delivered
- `ENQUIRY_FROM_EMAIL`: must be on a domain you've verified with Resend
- `NEXT_PUBLIC_SITE_URL`: enables canonical URLs and the sitemap

Without these, the form validates normally but reports that the message was not sent; it never pretends to deliver. Spam protection uses a honeypot field, a minimum time on the form and a per-server rate limit.

## Structure

```
app/                 routes (/, /about, /services, /services/[slug], /industries,
                     /portfolio, /portfolio/[slug], /careers, /contact, /privacy, /terms)
app/api/enquiry/     enquiry endpoint
components/layout/   header, footer, logo, page hero
components/home/     homepage sections
components/services/ services carousel, showcase, directory
components/portfolio/ project cards and filter
components/forms/    enquiry form
components/ui/       buttons, headings, icons, image fallback, reveal
data/                all editable content
lib/                 asset lookup, enquiry validation, portfolio helpers
```
