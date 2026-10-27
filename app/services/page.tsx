import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { ServicesShowcase } from "@/components/services/ServicesShowcase";
import { ServiceDirectory } from "@/components/services/ServiceDirectory";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CtaBand } from "@/components/home/CtaBand";
import { ButtonLink } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Services",
  description:
    "CCTV installation, access control, attendance systems, door access, POS systems, software development, website development and IT support.",
  alternates: { canonical: "/services" },
};

export default function ServicesPage() {
  return (
    <>
      <PageHero
        crumbs={[{ label: "Home", href: "/" }, { label: "Services" }]}
        title="Security, business technology, software and IT support"
        intro={<p>Eight services, one team. Explore each service below, or tell us what you need and we&apos;ll recommend the right combination.</p>}
        actions={
          <ButtonLink href="/contact#enquiry" arrow>
            Request a consultation
          </ButtonLink>
        }
      />
      <ServicesShowcase id="all-services" />
      <section aria-labelledby="directory-title" className="bg-paper py-20 lg:py-28">
        <div className="container-x">
          <SectionHeading id="directory-title" kicker="Service directory" title="Browse by category" />
          <div className="mt-10">
            <ServiceDirectory />
          </div>
        </div>
      </section>
      <CtaBand />
    </>
  );
}
