import { projects } from "@/data/portfolio";
import { resolveAsset } from "@/lib/assets";
import type { ProjectCardData } from "@/components/portfolio/ProjectCard";

/** Server-side: card data with image paths resolved against /public. */
export function projectCards(): ProjectCardData[] {
  return projects.map((p) => {
    const first = p.images[0];
    return {
      slug: p.slug,
      demo: p.demo,
      title: p.title,
      category: p.category,
      service: p.service,
      summary: p.summary,
      image: first ? resolveAsset(first.src) : null,
      expectedImage: first?.src ?? "",
      imageAlt: first?.alt ?? "",
    };
  });
}
