import type { Metadata } from "next";
import { site } from "@/data/site";
import { LegalPage } from "@/components/layout/LegalPage";

export const metadata: Metadata = {
  title: "Terms and conditions",
  description: `Terms for using the ${site.name} website.`,
  alternates: { canonical: "/terms" },
};

// TODO(company): have this draft reviewed by a legal adviser before launch.
export default function TermsPage() {
  return (
    <LegalPage title="Terms and conditions">
      <p>These terms apply to your use of the {site.name} website.</p>
      <h2>Website content</h2>
      <p>
        Content on this website describes our services in general terms. It is not an offer or a binding quotation.
        The scope, price and terms of any work are agreed separately in writing.
      </p>
      <h2>Enquiries</h2>
      <p>
        Sending an enquiry does not create a contract. We will respond to discuss your requirements and, where
        appropriate, provide a proposal.
      </p>
      <h2>Intellectual property</h2>
      <p>
        The text, design and images on this website belong to {site.name} or are used with permission, and may not be
        reused without consent.
      </p>
      <h2>Liability</h2>
      <p>
        We aim to keep this website accurate and available, but we cannot guarantee that it will always be error-free
        or uninterrupted.
      </p>
      <h2>Changes</h2>
      <p>We may update these terms. The current version will always be available on this page.</p>
    </LegalPage>
  );
}
