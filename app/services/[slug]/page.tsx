import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { PageSkeleton } from "@/components/layout/PageSkeleton";
import { ArrowRight, Check, CircleAlert, Plus } from "lucide-react";
import { categoryLabel, getService, services } from "@/data/services";
import { serviceIcons } from "@/components/ui/icons";
import { PageHero } from "@/components/layout/PageHero";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { ProcessSteps } from "@/components/home/ProcessSteps";
import { EnquiryForm } from "@/components/forms/EnquiryForm";
import { Visual } from "@/components/ui/Visual";

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: PageProps<"/services/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) return {};
  return {
    title: service.title,
    description: service.shortDescription,
    alternates: { canonical: `/services/${service.slug}` },
    openGraph: { title: service.title, description: service.shortDescription },
  };
}

export default function ServicePage({ params }: PageProps<"/services/[slug]">) {
  // Params are read inside Suspense so the route keeps a static shell for instant navigation.
  return (
    <Suspense fallback={<PageSkeleton />}>
      <ServiceContent params={params} />
    </Suspense>
  );
}

async function ServiceContent({ params }: { params: PageProps<"/services/[slug]">["params"] }) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();

  const Icon = serviceIcons[service.icon];
  const related = service.relatedServices.map(getService).filter((s) => s !== undefined);

  return (
    <>
      <PageHero
        crumbs={[{ label: "Home", href: "/" }, { label: "Services", href: "/services" }, { label: service.title }]}
        kicker={categoryLabel[service.category]}
        title={service.title}
        intro={<p>{service.headline}</p>}
        image={{ src: service.heroImage, alt: service.imageAlt, icon: Icon, position: service.heroPosition }}
        actions={
          <>
            <ButtonLink href="#enquiry" arrow>
              Request a consultation
            </ButtonLink>
            <ButtonLink href={`/contact?service=${service.slug}#enquiry`} variant="outline-dark">
              Get a quote
            </ButtonLink>
          </>
        }
      />

      {/* Overview + problems */}
      <section aria-labelledby="overview-title" className="bg-paper py-20 lg:py-24">
        <div className="container-x grid gap-12 lg:grid-cols-[1.2fr_1fr] lg:gap-20">
          <Reveal>
            <SectionHeading id="overview-title" kicker="Overview" title="What this service covers" />
            <div className="mt-6 max-w-[65ch] space-y-5 text-[1.0625rem] leading-[1.75] text-slate-ink">
              {service.overview.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
          </Reveal>
          <Reveal>
            <div className="rounded-[var(--radius-card)] border border-line-light bg-white p-7">
              <h3 className="t-h3 text-ink">Problems this solves</h3>
              <ul className="mt-5 space-y-4">
                {service.problems.map((p) => (
                  <li key={p} className="flex gap-3 leading-relaxed text-slate-ink">
                    <CircleAlert aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-blue" />
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Capabilities */}
      <section aria-labelledby="capabilities-title" className="bg-white py-20 lg:py-24">
        <div className="container-x">
          <Reveal>
            <SectionHeading id="capabilities-title" kicker="Key capabilities" title="What the service can include" intro="Exact scope is confirmed after an assessment of your site and requirements." />
          </Reveal>
          <ul className="mt-12 grid gap-px overflow-hidden rounded-[var(--radius-card)] border border-line-light bg-line-light sm:grid-cols-2 lg:grid-cols-3">
            {service.features.map((f) => (
              <li key={f.title} className="bg-white p-7">
                <Check aria-hidden="true" className="size-6 text-blue" />
                <h3 className="mt-4 text-lg font-bold text-ink">{f.title}</h3>
                <p className="mt-2 leading-relaxed text-slate-ink">{f.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Benefits + use cases */}
      <section aria-labelledby="benefits-title" className="bg-navy py-20 text-white lg:py-24">
        <div className="container-x grid gap-14 lg:grid-cols-[1.3fr_1fr] lg:gap-20">
          <div>
            <SectionHeading id="benefits-title" tone="dark" kicker="Business benefits" title="Why it's worth doing properly" />
            <ul className="mt-10 grid gap-8 sm:grid-cols-2">
              {service.benefits.map((b) => (
                <li key={b.title} className="border-l-2 border-cyan pl-5">
                  <h3 className="text-lg font-bold">{b.title}</h3>
                  <p className="mt-1.5 leading-relaxed text-mist">{b.text}</p>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-[var(--radius-card)] border border-line-strong bg-midnight/60 p-7">
            <h3 className="t-h3">Suitable for</h3>
            <ul className="mt-5 flex flex-wrap gap-2">
              {service.useCases.map((u) => (
                <li key={u} className="rounded-full border border-line-strong px-4 py-2 text-sm text-white/90">
                  {u}
                </li>
              ))}
            </ul>
            <Link href="/industries" className="mt-6 inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold text-cyan hover:text-white">
              See industries we work with <ArrowRight aria-hidden="true" className="size-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Process */}
      <section aria-labelledby="process-title" className="bg-midnight py-20 lg:py-24">
        <div className="container-x">
          <SectionHeading id="process-title" tone="dark" kicker="Implementation process" title="How a project runs" />
          <div className="mt-14">
            <ProcessSteps steps={service.process} />
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section aria-labelledby="faq-title" className="bg-paper py-20 lg:py-24">
        <div className="container-x grid gap-12 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
          <SectionHeading id="faq-title" kicker="FAQs" title="Frequently asked questions" intro={<>Have a question that isn&apos;t here? <Link href="#enquiry" className="font-semibold text-blue underline underline-offset-2">Ask us directly</Link>.</>} />
          <div className="divide-y divide-line-light border-y border-line-light">
            {service.faqs.map((f) => (
              <details key={f.q} className="group">
                <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-6 py-5 text-lg font-semibold text-ink [&::-webkit-details-marker]:hidden">
                  {f.q}
                  <Plus aria-hidden="true" className="size-5 shrink-0 text-blue transition-transform duration-200 group-open:rotate-45" />
                </summary>
                <p className="max-w-[65ch] pb-6 leading-relaxed text-slate-ink">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Related services */}
      <section aria-labelledby="related-title" className="bg-white py-20 lg:py-24">
        <div className="container-x">
          <SectionHeading id="related-title" kicker="Related services" title="Often combined with" />
          <ul className="mt-10 grid gap-6 md:grid-cols-3">
            {related.map((r) => {
              const RIcon = serviceIcons[r.icon];
              return (
                <li key={r.slug}>
                  <Link href={`/services/${r.slug}`} className="group block overflow-hidden rounded-[var(--radius-card)] border border-line-light bg-white transition-colors hover:border-blue/40">
                    <div className="relative aspect-[16/9] overflow-hidden bg-navy">
                      <Visual src={r.cardImage} alt={r.imageAlt} icon={RIcon} position={r.cardPosition} sizes="(min-width:768px) 33vw, 100vw" />
                    </div>
                    <div className="p-6">
                      <h3 className="t-h3 text-ink group-hover:text-blue">{r.title}</h3>
                      <p className="mt-2 leading-relaxed text-slate-ink">{r.shortDescription}</p>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* Enquiry */}
      <section id="enquiry" aria-labelledby="enquiry-title" className="bg-paper py-20 lg:py-24">
        <div className="container-x grid gap-12 lg:grid-cols-[1fr_1.5fr] lg:gap-16">
          <div>
            <SectionHeading
              id="enquiry-title"
              kicker="Request a consultation"
              title={`Talk to us about ${service.title}`}
              intro="Share a few details about your site and requirements. We'll reply to discuss the next step, usually starting with a consultation or site assessment."
            />
          </div>
          <EnquiryForm defaultService={service.slug} subjectHint={`${service.title} enquiry`} />
        </div>
      </section>
    </>
  );
}
