import { about, whyChooseUs } from "@/data/company";
import { Building2 } from "lucide-react";
import { featureIcons } from "@/components/ui/icons";
import { ButtonLink } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Visual } from "@/components/ui/Visual";
import { Reveal } from "@/components/ui/Reveal";

export function AboutIntro() {
  return (
    <section aria-labelledby="about-title" className="bg-paper py-20 lg:py-28">
      <div className="container-x grid gap-14 lg:grid-cols-[1fr_1.05fr] lg:items-center lg:gap-20">
        <Reveal>
          <SectionHeading id="about-title" kicker="About Shakoor" title="Your partner in security and IT solutions" intro={about.intro} />
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href="/about" arrow>
              Learn more about us
            </ButtonLink>
            <ButtonLink href="/contact" variant="outline-light">
              Talk to our team
            </ButtonLink>
          </div>
        </Reveal>
        <Reveal>
          <div className="viewfinder relative aspect-[4/3] overflow-hidden rounded-[var(--radius-panel)] bg-navy shadow-[0_40px_80px_-40px_rgb(4_20_38/0.6)]">
            <Visual
              src="/images/industries/corporate-office.png"
              alt="Busy open-plan office where staff work at desks while a colleague badges through a secured glass door"
              icon={Building2}
              sizes="(min-width:1024px) 50vw, 100vw"
            />
          </div>
        </Reveal>
      </div>

      <div className="container-x mt-24">
        <Reveal>
          <SectionHeading kicker="Why choose us" title="What working with us looks like" />
        </Reveal>
        <ul className="mt-10 grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
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
  );
}
