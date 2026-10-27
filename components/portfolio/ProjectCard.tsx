import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Project } from "@/data/portfolio";
import { portfolioCategories } from "@/data/portfolio";
import { getService } from "@/data/services";
import { serviceIcons } from "@/components/ui/icons";
import { FallbackScene } from "@/components/ui/FallbackScene";

export type ProjectCardData = Pick<Project, "slug" | "demo" | "title" | "category" | "service" | "summary"> & {
  image: string | null;
  expectedImage: string;
  imageAlt: string;
};

/** Pure component so it can render inside the client-side portfolio filter. */
export function ProjectCard({ project: p }: { project: ProjectCardData }) {
  const service = getService(p.service);
  const Icon = serviceIcons[service?.icon ?? "software"];
  const category = portfolioCategories.find((c) => c.id === p.category)?.label;
  return (
    <Link
      href={`/portfolio/${p.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-[var(--radius-card)] border border-line-light bg-white transition-colors hover:border-blue/40"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-navy">
        <div className="absolute inset-0 transition-transform duration-700 ease-[var(--ease-out-soft)] group-hover:scale-[1.04]">
          {p.image ? (
            <Image src={p.image} alt={p.imageAlt} fill sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw" className="object-cover" />
          ) : (
            <FallbackScene icon={Icon} expected={p.expectedImage} />
          )}
        </div>
        {p.demo ? (
          <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-ink">
            Sample layout
          </span>
        ) : null}
      </div>
      <div className="flex flex-1 flex-col p-6">
        <p className="text-sm font-semibold text-blue">{category}</p>
        <h3 className="t-h3 mt-2 text-ink">{p.title}</h3>
        <p className="mt-2 flex-1 leading-relaxed text-slate-ink">{p.summary}</p>
        <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-blue">
          View project <ArrowRight aria-hidden="true" className="size-4 transition-transform group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}
