import { Hero } from "@/components/home/Hero";
import { ServicesShowcase } from "@/components/services/ServicesShowcase";
import { AboutIntro } from "@/components/home/AboutIntro";
import { IndustriesGrid } from "@/components/home/IndustriesGrid";
import { ProcessSteps } from "@/components/home/ProcessSteps";
import { CtaBand } from "@/components/home/CtaBand";
import { ServiceDirectory } from "@/components/services/ServiceDirectory";
import { ProjectCard } from "@/components/portfolio/ProjectCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { processSteps } from "@/data/company";
import { projectCards } from "@/lib/portfolio";

export default function HomePage() {
  const featured = projectCards().slice(0, 3);
  const allDemo = featured.every((p) => p.demo);

  return (
    <>
      <Hero />
      <ServicesShowcase />
      <AboutIntro />

      <section aria-labelledby="industries-title" className="bg-white py-20 lg:py-28">
        <div className="container-x">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <Reveal>
              <SectionHeading
                id="industries-title"
                kicker="Industries"
                title="Built for the places businesses work"
                intro="From a single shop to a multi-floor office, the right mix of systems depends on the site. These are some of the environments our services suit."
              />
            </Reveal>
            <ButtonLink href="/industries" variant="outline-light" arrow className="self-start lg:self-auto">
              All industries
            </ButtonLink>
          </div>
          <div className="mt-12">
            <IndustriesGrid />
          </div>
        </div>
      </section>

      <section aria-labelledby="process-title" className="bg-navy py-20 lg:py-28">
        <div className="container-x">
          <Reveal>
            <SectionHeading
              id="process-title"
              tone="dark"
              kicker="How we work"
              title="A clear process from first call to ongoing support"
            />
          </Reveal>
          <div className="mt-14">
            <ProcessSteps steps={processSteps} />
          </div>
        </div>
      </section>

      <section aria-labelledby="portfolio-title" className="bg-paper py-20 lg:py-28">
        <div className="container-x">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <Reveal>
              <SectionHeading
                id="portfolio-title"
                kicker="Portfolio"
                title="How we present our work"
                intro={
                  allDemo
                    ? "Project case studies will appear here. The cards below are sample layouts, not completed client work."
                    : "A selection of recent projects across security, business technology and software."
                }
              />
            </Reveal>
            <ButtonLink href="/portfolio" variant="outline-light" arrow className="self-start lg:self-auto">
              View portfolio
            </ButtonLink>
          </div>
          <ul className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featured.map((p) => (
              <li key={p.slug}>
                <ProjectCard project={p} />
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="directory-title" className="bg-paper pb-20 lg:pb-28">
        <div className="container-x">
          <Reveal>
            <SectionHeading id="directory-title" kicker="Service directory" title="Every service at a glance" />
          </Reveal>
          <div className="mt-10">
            <ServiceDirectory />
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
