# Environment setup

This site has five environment variables. There is no database, authentication or other third-party integration. The only external service is [Resend](https://resend.com), which delivers contact-form email.

`NODE_ENV` is also read by the code, but Next.js sets it automatically (`development` for `npm run dev`, `production` for `npm run build` and `npm start`). Don't set it yourself.

## Summary

| Variable | Type | Required | Read when |
| --- | --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Public | Recommended | **Build time** (embedded into pages) |
| `RESEND_API_KEY` | Server-only secret | Required for the contact form | Run time |
| `ENQUIRY_TO_EMAIL` | Server-only | Required for the contact form | Run time |
| `ENQUIRY_FROM_EMAIL` | Server-only | Required for the contact form | Run time |
| `ENQUIRY_SEND_CONFIRMATION` | Server-only | Optional (default `false`) | Run time |

The site builds and runs with none of them set. Without the three email variables the contact form still validates input, but tells visitors their message was not sent. It never pretends to deliver.

## Variables

### `NEXT_PUBLIC_SITE_URL`

- **Purpose:** the public address of the live site. Used for canonical URLs, Open Graph metadata, `sitemap.xml` and the sitemap line in `robots.txt`.
- **Required:** recommended. Without it the sitemap is empty and pages have no absolute canonical URL.
- **Value:** your production domain with `https://` and no trailing slash, e.g. `https://www.yourdomain.com`. Use exactly the version visitors will see (with or without `www`).
- **Important:** variables starting with `NEXT_PUBLIC_` are embedded during `npm run build`. On Hostinger, set it **before** deploying; after changing it, redeploy so the site rebuilds.
- **Not secret:** this value is visible in the page source.

### `RESEND_API_KEY`

- **Purpose:** authorises the server to send email through Resend.
- **Required:** yes, for the contact form.
- **Where to get it:** Resend dashboard → **API Keys** → **Create API key**. "Sending access" is enough.
- **Secret:** never commit it, paste it into chat or put it in client code. It is only read by `app/api/enquiry/route.ts` on the server.

### `ENQUIRY_TO_EMAIL`

- **Purpose:** the inbox that receives website enquiries.
- **Required:** yes, for the contact form.
- **Value:** the company's business email address. Separate several addresses with commas.

### `ENQUIRY_FROM_EMAIL`

- **Purpose:** the sender shown on enquiry emails.
- **Required:** yes, for the contact form.
- **Value:** an address on a domain **verified in Resend**, e.g. `Shakoor Website <website@yourdomain.com>`. To verify the domain: Resend → **Domains** → **Add domain**, then add the DNS records Resend shows you in Hostinger hPanel → **Domains** → your domain → **DNS / Nameservers**. Sending from an unverified domain fails.
- **Reply-to:** each enquiry email is sent with the visitor's address as reply-to, so pressing Reply answers the visitor.

### `ENQUIRY_SEND_CONFIRMATION`

- **Purpose:** when `true`, visitors also receive an automatic "we've received your enquiry" email.
- **Required:** no. Defaults to off; any value other than `true` means off.

## Configure locally

1. Copy `.env.example` to `.env.local` in the project root.
2. Fill in the values. `.env.local` is ignored by git and never uploaded.
3. Restart `npm run dev` (on this PC: `npm.cmd run dev`) so the changes are picked up.

## Configure on Hostinger

1. hPanel → **Websites** → your Node.js website → **Settings** / **Environment variables** (the same screen as the build settings).
2. Add each variable as a key and value. Delete any rows you don't need rather than leaving their values empty.
3. Save, then **redeploy**. Changes to `NEXT_PUBLIC_SITE_URL` only take effect after a rebuild; the email variables take effect when the app restarts.

Never add real values to `.env.example`, the repository or any file inside `public/`.
