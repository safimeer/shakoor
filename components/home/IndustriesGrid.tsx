import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { industries } from "@/data/industries";
import { getService } from "@/data/services";
import { industryIcons } from "@/components/ui/icons";
import { Visual } from "@/components/ui/Visual";

/**
 * Potential markets — copy makes clear these are sectors served, not named clients.
 * Industries with a photo get an image card; the rest use a navy icon card.
 */
export function IndustriesGrid({ detailed = false }: { detailed?: boolean }) {
  return (
    <ul className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
      {industries.map((ind) => {
        const Icon = industryIcons[ind.icon];
        const relevant = ind.services.map(getService).filter((s) => s !== undefined);

        if (!ind.image) {
          return (
            <li
              key={ind.slug}
              id={detailed ? ind.slug : undefined}
              className="relative flex flex-col overflow-hidden rounded-[var(--radius-card)] bg-navy p-6 text-white"
            >
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0"
                style={{
                  backgroundImage:
                    "radial-gradient(80% 60% at 100% 0%, rgb(32 184 255 / 0.25), transparent 60%), linear-gradient(rgb(130 180 230 / 0.06) 1px, transparent 1px), linear-gradient(90deg, rgb(130 180 230 / 0.06) 1px, transparent 1px)",
                  backgroundSize: "auto, 32px 32px, 32px 32px",
                }}
              />
              <span aria-hidden="true" className="relative grid size-12 place-items-center rounded-xl border border-cyan/40 text-cyan">
                <Icon className="size-6" strokeWidth={1.7} />
              </span>
              <h3 className="t-h3 relative mt-auto pt-10">{ind.title}</h3>
              <p className="relative mt-2 leading-relaxed text-mist">{ind.text}</p>
              {detailed ? (
                <RelevantServices services={relevant} dark />
              ) : (
                <Link href="/contact#enquiry" className="relative mt-5 inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold text-cyan hover:text-white">
                  Talk to us <ArrowRight aria-hidden="true" className="size-4" />
                </Link>
              )}
            </li>
          );
        }

        return (
          <li
            key={ind.slug}
            id={detailed ? ind.slug : undefined}
            className="group flex flex-col overflow-hidden rounded-[var(--radius-card)] border border-line-light bg-white shadow-[0_1px_2px_rgb(4_20_38/0.04)] transition-[border-color,box-shadow] duration-300 hover:border-blue/30 hover:shadow-[0_18px_40px_-24px_rgb(4_20_38/0.35)]"
          >
            <div className="relative aspect-[16/10] overflow-hidden bg-navy">
              <div className="absolute inset-0 transition-transform duration-700 ease-[var(--ease-out-soft)] group-hover:scale-[1.04]">
                <Visual
                  src={ind.image.src}
                  alt={ind.image.alt}
                  icon={Icon}
                  position={ind.image.position}
                  sizes="(min-width:1280px) 24vw, (min-width:640px) 48vw, 100vw"
                />
              </div>
            </div>
            <div className="relative flex flex-1 flex-col px-6 pb-6">
              <span aria-hidden="true" className="-mt-6 grid size-12 place-items-center rounded-xl bg-white text-blue shadow-[0_8px_20px_-10px_rgb(4_20_38/0.45)]">
                <Icon className="size-6" strokeWidth={1.7} />
              </span>
              <h3 className="t-h3 mt-4 text-ink">{ind.title}</h3>
              <p className="mt-2 flex-1 leading-relaxed text-slate-ink">{ind.text}</p>
              {detailed ? <RelevantServices services={relevant} /> : null}
            </div>
          </li>
        );
      })}
    </ul>
  );
}

function RelevantServices({ services, dark = false }: { services: { slug: string; title: string }[]; dark?: boolean }) {
  return (
    <div className={`relative mt-5 border-t pt-4 ${dark ? "border-line-strong" : "border-line-light"}`}>
      <p className={`text-sm font-semibold ${dark ? "text-white" : "text-ink"}`}>Relevant services</p>
      <ul className="mt-2 flex flex-wrap gap-2">
        {services.map((s) => (
          <li key={s.slug}>
            <Link
              href={`/services/${s.slug}`}
              className={`inline-flex min-h-9 items-center rounded-lg px-3 text-sm font-medium transition-colors ${
                dark ? "bg-white/10 text-white hover:bg-cyan hover:text-midnight" : "bg-paper text-blue hover:bg-blue hover:text-white"
              }`}
            >
              {s.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
