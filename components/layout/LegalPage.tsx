import type { ReactNode } from "react";
import { PageHero } from "./PageHero";

export function LegalPage({ title, children }: { title: string; children: ReactNode }) {
  return (
    <>
      <PageHero crumbs={[{ label: "Home", href: "/" }, { label: title }]} title={title} />
      <section className="bg-paper py-16 lg:py-24">
        <div className="container-x">
          <div className="max-w-[70ch] space-y-5 text-[1.0625rem] leading-[1.75] text-slate-ink [&_h2]:mt-10 [&_h2]:text-[1.3125rem] [&_h2]:font-bold [&_h2]:leading-snug [&_h2]:text-ink [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5">
            {children}
          </div>
        </div>
      </section>
    </>
  );
}
