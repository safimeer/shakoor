import type { MetadataRoute } from "next";
import { services } from "@/data/services";
import { projects } from "@/data/portfolio";
import { site } from "@/data/site";

export default function sitemap(): MetadataRoute.Sitemap {
  // Without a production URL there is nothing meaningful to publish.
  if (!site.url) return [];
  const base = site.url.replace(/\/$/, "");
  const pages = ["", "/about", "/services", "/industries", "/portfolio", "/careers", "/contact", "/privacy", "/terms"];
  return [
    ...pages.map((p) => ({ url: `${base}${p}`, priority: p === "" ? 1 : 0.7 })),
    ...services.map((s) => ({ url: `${base}/services/${s.slug}`, priority: 0.8 })),
    // Demonstration entries are excluded until replaced with real projects.
    ...projects.filter((p) => !p.demo).map((p) => ({ url: `${base}/portfolio/${p.slug}`, priority: 0.6 })),
  ];
}
