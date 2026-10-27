import Link from "next/link";
import { cacheLife } from "next/cache";
import { Mail, MapPin, Phone } from "lucide-react";
import { mainNav, site, telHref } from "@/data/site";
import { services } from "@/data/services";
import { Logo } from "./Logo";

async function CopyrightYear() {
  "use cache";
  cacheLife("days");
  return <>{new Date().getFullYear()}</>;
}

export function Footer() {
  const { phone, email, address } = site.contact;
  const hasContact = Boolean(phone || email || address);

  return (
    <footer className="relative overflow-hidden bg-midnight text-mist">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 left-1/2 h-80 w-[900px] -translate-x-1/2 rounded-full bg-blue/20 blur-[120px]"
      />
      <div className="container-x relative grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1.2fr_1.1fr] lg:py-20">
        <div className="max-w-sm">
          <Logo />
          <p className="mt-5 font-semibold text-white">{site.name}</p>
          <p className="mt-3 leading-relaxed">{site.description}</p>
          {site.social.length > 0 ? (
            <ul className="mt-6 flex flex-wrap gap-3">
              {site.social.map((s) => (
                <li key={s.href}>
                  <a href={s.href} rel="noopener noreferrer" target="_blank" className="text-sm font-medium text-white hover:text-cyan">
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        <FooterList title="Company" links={mainNav.filter((n) => n.href !== "/services").map((n) => ({ label: n.label, href: n.href }))} />
        <FooterList title="Services" links={services.map((s) => ({ label: s.title, href: `/services/${s.slug}` }))} />

        <div>
          <h2 className="mb-4 font-semibold text-white">Get in touch</h2>
          {hasContact ? (
            <ul className="space-y-3">
              {phone ? (
                <li className="flex gap-3">
                  <Phone aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-cyan" />
                  <a href={telHref(phone)} className="hover:text-white">{phone}</a>
                </li>
              ) : null}
              {email ? (
                <li className="flex gap-3">
                  <Mail aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-cyan" />
                  <a href={`mailto:${email}`} className="break-all hover:text-white">{email}</a>
                </li>
              ) : null}
              {address ? (
                <li className="flex gap-3">
                  <MapPin aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-cyan" />
                  <span>{address}</span>
                </li>
              ) : null}
            </ul>
          ) : (
            <p className="leading-relaxed">Tell us about your site or project and our team will get back to you.</p>
          )}
          <Link href="/contact#enquiry" className="mt-5 inline-flex min-h-11 items-center font-semibold text-cyan hover:text-white">
            Send an enquiry
          </Link>
        </div>
      </div>

      <div className="border-t border-line">
        <div className="container-x flex flex-col gap-3 py-6 text-sm text-fog sm:flex-row sm:items-center sm:justify-between">
          <p>
            © <CopyrightYear /> {site.name}. All rights reserved.
          </p>
          <ul className="flex gap-6">
            <li><Link href="/privacy" className="hover:text-white">Privacy policy</Link></li>
            <li><Link href="/terms" className="hover:text-white">Terms and conditions</Link></li>
          </ul>
        </div>
      </div>
    </footer>
  );
}

function FooterList({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div>
      <h2 className="mb-4 font-semibold text-white">{title}</h2>
      <ul className="space-y-1">
        {links.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="inline-flex min-h-9 items-center hover:text-white">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
