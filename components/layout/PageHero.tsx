import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { ChevronRight } from "lucide-react";
import { Visual } from "@/components/ui/Visual";

/** Dark introduction used at the top of every inner page. */
export function PageHero({
  title,
  intro,
  kicker,
  crumbs,
  image,
  actions,
}: {
  title: string;
  intro?: ReactNode;
  kicker?: string;
  crumbs: { label: string; href?: string }[];
  image?: { src: string; alt: string; icon: LucideIcon; position?: string };
  actions?: ReactNode;
}) {
  return (
    <section className="relative isolate overflow-hidden bg-midnight text-white">
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10"
        style={{
          backgroundImage:
            "radial-gradient(50% 80% at 85% 10%, rgb(32 184 255 / 0.22), transparent 60%), linear-gradient(rgb(130 180 230 / 0.05) 1px, transparent 1px), linear-gradient(90deg, rgb(130 180 230 / 0.05) 1px, transparent 1px)",
          backgroundSize: "auto, 44px 44px, 44px 44px",
        }}
      />
      <div
        className={`container-x grid gap-12 pb-16 pt-[calc(var(--header-h)+40px)] lg:pb-20 ${
          image ? "lg:grid-cols-[1.05fr_1fr] lg:items-center" : ""
        }`}
      >
        <div className="max-w-3xl">
          <nav aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center gap-1.5 text-sm text-mist">
              {crumbs.map((c, i) => (
                <li key={c.label} className="flex items-center gap-1.5">
                  {i > 0 ? <ChevronRight aria-hidden="true" className="size-3.5 text-fog" /> : null}
                  {c.href ? (
                    <Link href={c.href} className="hover:text-white">
                      {c.label}
                    </Link>
                  ) : (
                    <span aria-current="page" className="text-white">
                      {c.label}
                    </span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
          {kicker ? <p className="t-kicker mt-8 text-cyan">{kicker}</p> : null}
          <h1 className={`t-h1 animate-rise text-balance ${kicker ? "mt-3" : "mt-8"}`}>{title}</h1>
          {intro ? <div className="t-lead mt-5 max-w-2xl animate-rise text-pretty text-mist [animation-delay:100ms]">{intro}</div> : null}
          {actions ? <div className="mt-8 flex animate-rise flex-wrap gap-3 [animation-delay:180ms]">{actions}</div> : null}
        </div>
        {image ? (
          <div className="viewfinder relative aspect-[16/11] animate-rise overflow-hidden rounded-[var(--radius-panel)] border border-line-strong [animation-delay:160ms]">
            <Visual src={image.src} alt={image.alt} icon={image.icon} position={image.position} sizes="(min-width:1024px) 48vw, 100vw" preload />
          </div>
        ) : null}
      </div>
    </section>
  );
}
