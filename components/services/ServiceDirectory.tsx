import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { categoryLabel, services, type ServiceCategory } from "@/data/services";
import { serviceIcons } from "@/components/ui/icons";

const order: ServiceCategory[] = ["security", "business", "software", "support"];

/** Plain, scannable list of every service, grouped by category. */
export function ServiceDirectory() {
  return (
    <div className="grid gap-10 md:grid-cols-2">
      {order.map((cat) => (
        <div key={cat}>
          <h3 className="text-lg font-bold text-ink">{categoryLabel[cat]}</h3>
          <ul className="mt-3 divide-y divide-line-light border-y border-line-light">
            {services
              .filter((s) => s.category === cat)
              .map((s) => {
                const Icon = serviceIcons[s.icon];
                return (
                  <li key={s.slug}>
                    <Link href={`/services/${s.slug}`} className="group flex items-start gap-4 py-5">
                      <Icon aria-hidden="true" strokeWidth={1.7} className="mt-0.5 size-6 shrink-0 text-blue" />
                      <span className="flex-1">
                        <span className="block font-semibold text-ink group-hover:text-blue">{s.title}</span>
                        <span className="mt-1 block leading-relaxed text-slate-ink">{s.shortDescription}</span>
                      </span>
                      <ArrowRight aria-hidden="true" className="mt-1 size-5 shrink-0 text-slate-ink transition-transform group-hover:translate-x-1 group-hover:text-blue" />
                    </Link>
                  </li>
                );
              })}
          </ul>
        </div>
      ))}
    </div>
  );
}
