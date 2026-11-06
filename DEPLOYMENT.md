# Deployment (Hostinger + GitHub)

## Architecture: Node.js server (not a static export)

This site must run as a **Node.js application**: `npm run build`, then `npm start`. A static export (`output: "export"`) is not compatible because the site uses:

| Feature | Where | Why it needs a server |
| --- | --- | --- |
| Enquiry API route (POST) | `app/api/enquiry/route.ts` | Validates the form and sends email with a secret API key |
| Image optimization | `next/image` throughout | Resizes and converts photos (2.4 MB PNG → ~200 KB WebP) on request |
| Cache Components / Partial Prefetching | `next.config.ts`, dynamic routes | Pages are prerendered, then revalidated and streamed by the server |

Not used: server actions, middleware/proxy, authentication, database.

## Why the earlier deployment returned 403 Forbidden

The source code was copied into `public_html`, which Hostinger serves as plain static files. A Next.js project has no `index.html` there, and nothing starts the app, so the web server refuses to list the folder and returns **403**. The fix is to deploy it as a Node.js web app, which installs dependencies, builds and starts the server.

## Hostinger settings

Use hPanel's **Node.js** web app deployment from GitHub (a plan that supports Node.js apps, such as Business or Cloud). Settings:

| Setting | Value |
| --- | --- |
| Repository / branch | `safimeer/shakoor` / `main` |
| Framework preset | Next.js |
| Node version | 22.x (minimum 20.9, declared in `package.json` → `engines`) |
| Root directory | `./` |
| Install | `npm install` (default) |
| Build command | `npm run build` |
| Output directory | `.next` |
| Start command | `npm start` (runs `next start`, which listens on the `PORT` Hostinger provides) |
| Environment variables | See [ENVIRONMENT_SETUP.md](ENVIRONMENT_SETUP.md). Set `NEXT_PUBLIC_SITE_URL` before the first build. |

`npm run build` runs `next build --webpack`. Turbopack, the default bundler, failed on Hostinger with "node process exited before we could connect to it": it runs PostCSS/Tailwind in a separate Node process that the hosting environment doesn't allow. Webpack runs it in-process. Tailwind is set up through `postcss.config.mjs`, which both bundlers read, so local `npm run dev` still uses Turbopack.

The build tools (Tailwind CSS, PostCSS, TypeScript, type definitions) are in `dependencies` rather than `devDependencies`, so the build works even if the host installs in production mode. Only ESLint stays a dev dependency; it isn't needed to build.

## Cleaning up the old deployment

If the earlier attempt left project files (`app/`, `components/`, `package.json` …) inside `public_html` of the domain:

1. In hPanel → **File Manager**, check what's in that domain's `public_html`.
2. Remove or move out the copied source files so they aren't served publicly. Back up first if anything else lives there.
3. Make sure the domain is attached to the Node.js app, not to the static `public_html` site.

## Deploying updates

Hostinger redeploys from `main`. To publish a change:

```bash
git add -A
git commit -m "Describe the change"
git push
```

Each push to `main` triggers a new build on Hostinger. Watch the build log in hPanel; the site switches over once the build succeeds.

## After deploying, check

- Home, a service page (e.g. `/services/cctv-installation`) and `/contact` load.
- Photos load (their URLs start with `/_next/image`).
- `/robots.txt` and `/sitemap.xml` load; the sitemap lists pages only if `NEXT_PUBLIC_SITE_URL` is set.
- Submitting the contact form: with the email variables set, you get "Enquiry sent" and the email arrives. Without them, the form says enquiries are not connected (HTTP 503), which is expected.

## Troubleshooting

| Symptom | Likely cause |
| --- | --- |
| 403 Forbidden | The domain is still serving static `public_html` instead of the Node.js app |
| 502/503 page from Hostinger | The app didn't start; check the runtime log, and that the start command is `npm start` |
| Build fails with "JavaScript heap out of memory" | The build ran short of memory. Retry; if it persists, set `NODE_OPTIONS=--max-old-space-size=2048` as a build environment variable |
| Contact form says "not connected" | `RESEND_API_KEY`, `ENQUIRY_TO_EMAIL` or `ENQUIRY_FROM_EMAIL` missing; set them and restart |
| Form says "couldn't send" (502) | Resend rejected the email, usually because the sender domain isn't verified |
| New photos don't appear | Images are checked at build time; redeploy after adding files to `public/images/` |

## Local production test

```bash
npm.cmd run build
npm.cmd start -- -p 3001
```

Then open http://localhost:3001. On this PC use `npm.cmd`, because PowerShell blocks `npm.ps1`. If the local build runs out of memory, close other programs or run it with `NODE_OPTIONS=--max-semi-space-size=2`.
