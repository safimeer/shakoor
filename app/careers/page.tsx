import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ButtonLink } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Careers",
  description: "Careers at Shakoor Integrated Solutions Private Limited.",
  alternates: { canonical: "/careers" },
};

/**
 * TODO(company): add verified openings to `openings`. Each appears as a card
 * with a link to apply via the contact form.
 */
const openings: { title: string; type: string; location: string; summary: string }[] = [];

const areas = [
  { title: "Security systems installation", text: "CCTV, access control and door hardware fitted on client sites." },
  { title: "Business technology", text: "Attendance and POS setup, configuration and training." },
  { title: "Software and web development", text: "Business applications, dashboards and websites." },
  { title: "IT support", text: "Networks, workstations, servers and backups." },
];

export default function CareersPage() {
  return (
    <>
      <PageHero
        crumbs={[{ label: "Home", href: "/" }, { label: "Careers" }]}
        title="Work with us"
        intro={<p>We bring together technicians, developers and support specialists. Current openings are listed below when available.</p>}
      />
      <section aria-labelledby="openings-title" className="bg-paper py-20 lg:py-28">
        <div className="container-x grid gap-14 lg:grid-cols-[1fr_1.3fr] lg:gap-20">
          <div>
            <SectionHeading id="openings-title" kicker="Open positions" title={openings.length ? "Current openings" : "No open positions right now"} />
            {openings.length === 0 ? (
              <p className="t-lead mt-4 text-slate-ink">
                You&apos;re welcome to introduce yourself. Send a short note about your experience and the area you&apos;d like to work in.
              </p>
            ) : null}
            <ButtonLink href="/contact#enquiry" className="mt-8" arrow>
              Get in touch
            </ButtonLink>
          </div>
          <div>
            {openings.length > 0 ? (
              <ul className="grid gap-4">
                {openings.map((o) => (
                  <li key={o.title} className="rounded-[var(--radius-card)] border border-line-light bg-white p-6">
                    <h3 className="t-h3 text-ink">{o.title}</h3>
                    <p className="mt-1 text-sm text-slate-ink">{o.type}, {o.location}</p>
                    <p className="mt-3 leading-relaxed text-slate-ink">{o.summary}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <>
                <h3 className="text-lg font-bold text-ink">Areas of work</h3>
                <ul className="mt-4 divide-y divide-line-light border-y border-line-light">
                  {areas.map((a) => (
                    <li key={a.title} className="py-5">
                      <p className="font-semibold text-ink">{a.title}</p>
                      <p className="mt-1 leading-relaxed text-slate-ink">{a.text}</p>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
