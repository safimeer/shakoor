import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { IndustriesGrid } from "@/components/home/IndustriesGrid";
import { CtaBand } from "@/components/home/CtaBand";

export const metadata: Metadata = {
  title: "Industries",
  description:
    "Security, business technology, software and IT support for offices, retail, hospitality, warehouses, education, healthcare and commercial buildings.",
  alternates: { canonical: "/industries" },
};

export default function IndustriesPage() {
  return (
    <>
      <PageHero
        crumbs={[{ label: "Home", href: "/" }, { label: "Industries" }]}
        title="Solutions for the environments businesses operate in"
        intro={<p>Every site has different risks, workflows and equipment. Here&apos;s how our services typically apply across sectors.</p>}
      />
      <section aria-label="Industries" className="bg-paper py-20 lg:py-28">
        <div className="container-x">
          <IndustriesGrid detailed />
        </div>
      </section>
      <CtaBand title="Don't see your industry?" text="We work with businesses of many kinds. Tell us about your site and we'll suggest what fits." />
    </>
  );
}
