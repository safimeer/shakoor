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
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), browsing-topics=()" },
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
