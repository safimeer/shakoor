import type { Metadata } from "next";
import { Building2, Compass, Eye } from "lucide-react";
import { about, processSteps, whyChooseUs } from "@/data/company";
import { PageHero } from "@/components/layout/PageHero";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProcessSteps } from "@/components/home/ProcessSteps";
import { CtaBand } from "@/components/home/CtaBand";
import { featureIcons } from "@/components/ui/icons";
import { Reveal } from "@/components/ui/Reveal";

export const metadata: Metadata = {
  title: "About us",
  description:
    "Shakoor Integrated Solutions Private Limited brings security systems, business technology, software and IT support together under one team.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        crumbs={[{ label: "Home", href: "/" }, { label: "About" }]}
        kicker="About Shakoor"
        title="One team for the technology your business depends on"
        intro={<p>{about.intro}</p>}
        image={{ src: "/images/hero/shakoor-headquarters-blue-hour.png", alt: "Modern glass office building at blue hour with the SHAKOOR Integrated Solutions sign on its facade", icon: Building2, position: "85% 50%" }}
      />

      <section aria-labelledby="overview-title" className="bg-paper py-20 lg:py-28">
        <div className="container-x grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:gap-20">
          <SectionHeading id="overview-title" kicker="Company overview" title="Why we bring these services together" />
          <div className="max-w-[65ch] space-y-5 text-[1.0625rem] leading-[1.75] text-slate-ink">
            {about.overview.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </div>

        <div className="container-x mt-20 grid gap-6 md:grid-cols-2">
          <Reveal>
            <div className="h-full rounded-[var(--radius-card)] bg-navy p-8 text-white">
              <Compass aria-hidden="true" className="size-8 text-cyan" strokeWidth={1.6} />
              <h2 className="t-h3 mt-5">Mission</h2>
              <p className="mt-3 text-lg leading-relaxed text-mist">{about.mission}</p>
            </div>
          </Reveal>
          <Reveal>
            <div className="h-full rounded-[var(--radius-card)] border border-line-light bg-white p-8">
              <Eye aria-hidden="true" className="size-8 text-blue" strokeWidth={1.6} />
              <h2 className="t-h3 mt-5 text-ink">Vision</h2>
              <p className="mt-3 text-lg leading-relaxed text-slate-ink">{about.vision}</p>
            </div>
          </Reveal>
        </div>
      </section>

      <section aria-labelledby="values-title" className="bg-white py-20 lg:py-28">
        <div className="container-x">
          <SectionHeading id="values-title" kicker="Core values" title="How we work with clients" />
          <ul className="mt-12 grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
            {about.values.map((v) => (
              <li key={v.title} className="border-t-2 border-blue pt-5">
                <h3 className="text-lg font-bold text-ink">{v.title}</h3>
                <p className="mt-2 leading-relaxed text-slate-ink">{v.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="approach-title" className="bg-navy py-20 lg:py-28">
        <div className="container-x">
          <SectionHeading id="approach-title" tone="dark" kicker="Service approach" title="From first conversation to ongoing support" />
          <ul className="mt-12 grid gap-6 md:grid-cols-3">
            {about.approach.map((a) => (
              <li key={a.title} className="rounded-[var(--radius-card)] border border-line-strong bg-midnight/50 p-7">
                <h3 className="text-lg font-bold text-white">{a.title}</h3>
                <p className="mt-2 leading-relaxed text-mist">{a.text}</p>
              </li>
            ))}
          </ul>
          <div className="mt-16">
            <ProcessSteps steps={processSteps} />
          </div>
        </div>
      </section>

      <section aria-labelledby="why-title" className="bg-paper py-20 lg:py-28">
        <div className="container-x">
          <SectionHeading
            id="why-title"
            kicker="Quality and support"
            title="Why businesses choose an integrated partner"
          />
          <ul className="mt-12 grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {whyChooseUs.map((f) => {
              const Icon = featureIcons[f.icon];
              return (
                <li key={f.title} className="border-t border-line-light pt-6">
                  <Icon aria-hidden="true" strokeWidth={1.6} className="size-8 text-blue" />
                  <h3 className="t-h3 mt-4 text-ink">{f.title}</h3>
                  <p className="mt-2 leading-relaxed text-slate-ink">{f.text}</p>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
