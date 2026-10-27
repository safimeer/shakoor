import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { PageSkeleton } from "@/components/layout/PageSkeleton";
import { ArrowRight, Info } from "lucide-react";
import { getProject, portfolioCategories, projects } from "@/data/portfolio";
import { getService } from "@/data/services";
import { serviceIcons } from "@/components/ui/icons";
import { PageHero } from "@/components/layout/PageHero";
import { Visual } from "@/components/ui/Visual";
import { CtaBand } from "@/components/home/CtaBand";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/portfolio/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  return {
    title: project.demo ? `${project.title} (sample layout)` : project.title,
    description: project.summary,
    alternates: { canonical: `/portfolio/${project.slug}` },
    // Keep demonstration entries out of search results.
    robots: project.demo ? { index: false, follow: true } : undefined,
  };
}

export default function ProjectPage({ params }: PageProps<"/portfolio/[slug]">) {
  // Params are read inside Suspense so the route keeps a static shell for instant navigation.
  return (
    <Suspense fallback={<PageSkeleton />}>
      <ProjectContent params={params} />
    </Suspense>
  );
}

async function ProjectContent({ params }: { params: PageProps<"/portfolio/[slug]">["params"] }) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const service = getService(project.service);
  const Icon = serviceIcons[service?.icon ?? "software"];
  const category = portfolioCategories.find((c) => c.id === project.category)?.label;
  const [cover, ...gallery] = project.images;

  return (
    <>
      <PageHero
        crumbs={[{ label: "Home", href: "/" }, { label: "Portfolio", href: "/portfolio" }, { label: project.title }]}
        kicker={category}
        title={project.title}
        intro={<p>{project.summary}</p>}
        image={cover ? { src: cover.src, alt: cover.alt, icon: Icon } : undefined}
      />

      <section className="bg-paper py-16 lg:py-24">
        <div className="container-x grid gap-12 lg:grid-cols-[1.5fr_1fr] lg:gap-16">
          <div className="max-w-[68ch]">
            {project.demo ? (
              <p className="mb-10 flex gap-3 rounded-xl border border-blue/25 bg-white p-4 text-slate-ink">
                <Info aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-blue" />
                <span>
                  <strong className="text-ink">Sample layout.</strong> This page demonstrates how a case study is structured.
                  It does not describe a completed client project.
                </span>
              </p>
            ) : null}

            <Block title="Overview">
              <p>{project.overview}</p>
            </Block>
            <Block title="Requirements">
              <ul className="list-disc space-y-2 pl-5">
                {project.requirements.map((r) => (
                  <li key={r}>{r}</li>
                ))}
              </ul>
            </Block>
            <Block title="Solution">
              <ul className="list-disc space-y-2 pl-5">
                {project.solution.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </Block>
            <Block title="Implementation">
              <p>{project.implementation}</p>
            </Block>
            {project.outcomes && project.outcomes.length > 0 ? (
              <Block title="Outcomes">
                <ul className="list-disc space-y-2 pl-5">
                  {project.outcomes.map((o) => (
                    <li key={o}>{o}</li>
                  ))}
                </ul>
              </Block>
            ) : null}

            {gallery.length > 0 ? (
              <div className="mt-12 grid gap-4 sm:grid-cols-2">
                {gallery.map((img) => (
                  <div key={img.src} className="relative aspect-[4/3] overflow-hidden rounded-[var(--radius-card)] bg-navy">
                    <Visual src={img.src} alt={img.alt} icon={Icon} sizes="(min-width:640px) 33vw, 100vw" />
                  </div>
                ))}
              </div>
            ) : null}
          </div>

          <aside className="h-fit rounded-[var(--radius-card)] border border-line-light bg-white p-7 lg:sticky lg:top-[calc(var(--header-h)+24px)]">
            <h2 className="text-sm font-semibold text-slate-ink">Service</h2>
            {service ? (
              <Link href={`/services/${service.slug}`} className="mt-2 inline-flex items-center gap-2 text-lg font-bold text-ink hover:text-blue">
                {service.title} <ArrowRight aria-hidden="true" className="size-4" />
              </Link>
            ) : null}
            <h2 className="mt-6 text-sm font-semibold text-slate-ink">Category</h2>
            <p className="mt-2 font-semibold text-ink">{category}</p>
            <Link href={`/contact?service=${project.service}#enquiry`} className="mt-8 inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-blue px-6 font-semibold text-white hover:bg-blue-deep">
              Discuss a similar project
            </Link>
          </aside>
        </div>
      </section>
      <CtaBand />
    </>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-10 first:mt-0">
      <h2 className="t-h3 text-ink">{title}</h2>
      <div className="mt-3 text-[1.0625rem] leading-[1.75] text-slate-ink">{children}</div>
    </div>
  );
}
