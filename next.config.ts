import type { NextConfig } from "next";

/**
 * Deployment: this site runs as a Node.js server (`npm run build` then `npm start`).
 * Do not switch to `output: "export"` — the enquiry API route, image optimization
 * and Cache Components streaming all require a server. See DEPLOYMENT.md.
 *
 * Production builds use webpack (`next build --webpack` in package.json): on Hostinger,
 * Turbopack cannot start the separate Node process it uses to run PostCSS/Tailwind.
 * Tailwind is configured through postcss.config.mjs, which both bundlers read.
 */
/*
 * Content-Security-Policy tuned to what the site actually loads: everything is first-party
 * (self-hosted fonts via next/font, images from /public via /_next/image, the /api/enquiry
 * endpoint). 'unsafe-inline' scripts are required because Next.js streams page data in inline
 * <script> tags; a nonce-based policy would force every page to render per request.
 * Applied to production builds only — development needs 'unsafe-eval' for hot reloading.
 */
const contentSecurityPolicy = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  "connect-src 'self'",
  "manifest-src 'self'",
  "worker-src 'self' blob:",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'self'",
  "upgrade-insecure-requests",
].join("; ");

const isProduction = process.env.NODE_ENV === "production";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), browsing-topics=()" },
  // One year, apex and www only. Add includeSubDomains (and consider preload) only after every
  // subdomain of the domain is confirmed to serve HTTPS — browsers then refuse plain HTTP for all of them.
  { key: "Strict-Transport-Security", value: "max-age=31536000" },
  ...(isProduction ? [{ key: "Content-Security-Policy", value: contentSecurityPolicy }] : []),
];

const nextConfig: NextConfig = {
  experimental: {
    agentFeedback: true,
  },
  cacheComponents: true,
  partialPrefetching: true,
  poweredByHeader: false,
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
