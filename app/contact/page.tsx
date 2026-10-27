import type { Metadata } from "next";
import { Suspense } from "react";
import { Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { site, telHref } from "@/data/site";
import { PageHero } from "@/components/layout/PageHero";
import { EnquiryForm } from "@/components/forms/EnquiryForm";
import { ContactEnquiry } from "@/components/forms/ContactEnquiry";

export const metadata: Metadata = {
  title: "Contact",
  description: "Request a quote or consultation from Shakoor Integrated Solutions Private Limited.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  const { phone, email, address, whatsapp, hours } = site.contact;
  const details = [
    phone && { icon: Phone, label: "Phone", value: phone, href: telHref(phone) },
    email && { icon: Mail, label: "Email", value: email, href: `mailto:${email}` },
    whatsapp && { icon: MessageCircle, label: "WhatsApp", value: whatsapp, href: `https://wa.me/${whatsapp.replace(/\D/g, "")}` },
    address && { icon: MapPin, label: "Office", value: address },
    hours && { icon: Clock, label: "Hours", value: hours },
  ].filter(Boolean) as { icon: typeof Phone; label: string; value: string; href?: string }[];

  return (
    <>
      <PageHero
        crumbs={[{ label: "Home", href: "/" }, { label: "Contact" }]}
        title="Tell us what you need"
        intro={<p>Request a quote, book a consultation or ask a question. Share as much detail as you can and our team will reply.</p>}
      />
      <section id="enquiry" aria-labelledby="enquiry-title" className="bg-paper py-16 lg:py-24">
        <div className="container-x grid gap-12 lg:grid-cols-[1fr_1.6fr] lg:gap-16">
          <div id="details">
            <h2 id="enquiry-title" className="t-h2 text-ink">Send an enquiry</h2>
            <p className="t-lead mt-4 text-slate-ink">
              Useful details include the type of site, approximate size, what you have today and when you&apos;d like the work done.
            </p>

            <h3 className="mt-10 text-lg font-bold text-ink">Contact details</h3>
            {details.length > 0 ? (
              <ul className="mt-4 space-y-4">
                {details.map((d) => (
                  <li key={d.label} className="flex gap-4">
                    <span aria-hidden="true" className="grid size-11 shrink-0 place-items-center rounded-xl bg-white text-blue">
                      <d.icon className="size-5" />
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-slate-ink">{d.label}</p>
                      {d.href ? (
                        <a href={d.href} className="font-semibold text-ink hover:text-blue">{d.value}</a>
                      ) : (
                        <p className="font-semibold text-ink">{d.value}</p>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              // TODO(company): verified details are set in data/site.ts and replace this note automatically.
              <p className="mt-3 rounded-xl border border-dashed border-line-light bg-white p-4 leading-relaxed text-slate-ink">
                Phone, email and office details will be published here once confirmed. In the meantime, the enquiry form is the
                best way to reach us.
              </p>
            )}
          </div>
          <Suspense fallback={<EnquiryForm />}>
            <ContactEnquiry />
          </Suspense>
        </div>
      </section>
    </>
  );
}
