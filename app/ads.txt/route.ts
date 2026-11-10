import { site } from "@/data/site";

/**
 * /ads.txt — declares Google as an authorised seller of this site's ad inventory.
 * f08c47fec0942fa0 is Google's fixed certification authority ID for AdSense.
 */
export function GET() {
  const body = site.adsensePublisherId
    ? `google.com, ${site.adsensePublisherId}, DIRECT, f08c47fec0942fa0\n`
    : "";
  return new Response(body, {
    status: site.adsensePublisherId ? 200 : 404,
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
