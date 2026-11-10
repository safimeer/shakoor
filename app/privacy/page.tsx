import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/data/site";
import { LegalPage } from "@/components/layout/LegalPage";

export const metadata: Metadata = {
  title: "Privacy policy",
  description: `How ${site.name} handles information submitted through this website, and how advertising cookies are used.`,
  alternates: { canonical: "/privacy" },
};

const externalLink = "font-semibold text-blue underline underline-offset-2";

// TODO(company): have this draft reviewed by a legal adviser before launch.
export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy policy">
      <p>
        This policy explains how {site.name} (&ldquo;we&rdquo;, &ldquo;us&rdquo;) handles information you submit through this
        website.
      </p>
      <h2>Information we collect</h2>
      <p>When you send an enquiry, we receive the details you enter in the form:</p>
      <ul>
        <li>Your name, email address and, if provided, phone number and company name</li>
        <li>The service you&apos;re interested in, your subject and message</li>
        <li>Your preferred contact method, if selected</li>
      </ul>
      <h2>How we use it</h2>
      <p>
        We use these details only to respond to your enquiry and to discuss the services you asked about. We do not sell
        your information.
      </p>
      <h2>How it is delivered</h2>
      <p>
        Enquiries are sent to our team by email through an email delivery provider. Your details are not stored in a
        database on this website.
      </p>
      {site.adsensePublisherId ? (
        <>
          <h2>Advertising and cookies</h2>
          <p>
            This website shows advertisements served by Google AdSense. Third-party vendors, including Google, use cookies
            and similar technologies to serve ads based on your previous visits to this website and other websites, and to
            measure how ads perform.
          </p>
          <p>
            Google&apos;s use of advertising cookies enables it and its partners to serve ads to you based on your visits to
            this and other sites on the internet. You can learn more in{" "}
            <a href="https://policies.google.com/technologies/partner-sites" rel="noopener noreferrer" target="_blank" className={externalLink}>
              how Google uses information from sites that use its services
            </a>
            .
          </p>
          <p>
            You can turn off personalised advertising in{" "}
            <a href="https://myadcenter.google.com/" rel="noopener noreferrer" target="_blank" className={externalLink}>
              Google&apos;s My Ad Center
            </a>
            , or opt out of personalised advertising from other participating vendors at{" "}
            <a href="https://www.aboutads.info/choices/" rel="noopener noreferrer" target="_blank" className={externalLink}>
              www.aboutads.info
            </a>
            . You can also block or delete cookies in your browser settings.
          </p>
        </>
      ) : null}
      <h2>Your choices</h2>
      <p>
        You can ask us to update or delete the details you sent by contacting us through the{" "}
        <Link href="/contact" className="font-semibold text-blue underline underline-offset-2">contact page</Link>.
      </p>
      <h2>Changes</h2>
      <p>We may update this policy. The current version will always be available on this page.</p>
    </LegalPage>
  );
}
