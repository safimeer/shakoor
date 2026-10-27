import type { Metadata } from "next";
import { Info } from "lucide-react";
import { PageHero } from "@/components/layout/PageHero";
import { PortfolioGrid } from "@/components/portfolio/PortfolioGrid";
import { CtaBand } from "@/components/home/CtaBand";
import { projectCards } from "@/lib/portfolio";

export const metadata: Metadata = {
  title: "Portfolio",
  description: "Projects across CCTV, access control, attendance, POS, software, websites and IT infrastructure.",
  alternates: { canonical: "/portfolio" },
};

export default function PortfolioPage() {
  const items = projectCards();
  const hasDemo = items.some((p) => p.demo);

  return (
    <>
      <PageHero
        crumbs={[{ label: "Home", href: "/" }, { label: "Portfolio" }]}
        title="Portfolio and case studies"
        intro={<p>Projects across security systems, business technology, software and IT infrastructure.</p>}
      />
      <section aria-label="Projects" className="bg-paper py-16 lg:py-24">
        <div className="container-x">
          {hasDemo ? (
            <p className="mb-10 flex max-w-3xl gap-3 rounded-xl border border-blue/25 bg-white p-4 text-slate-ink">
              <Info aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-blue" />
              <span>
                Entries marked <strong className="text-ink">Sample layout</strong> show how case studies will be presented.
                They are not completed client projects.
              </span>
            </p>
          ) : null}
          <PortfolioGrid items={items} />
        </div>
      </section>
      <CtaBand />
    </>
  );
}
