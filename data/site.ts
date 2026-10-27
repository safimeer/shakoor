/**
 * Company-wide settings. Every value marked `null` is intentionally unset:
 * the UI hides or labels it until verified details are supplied.
 * Do not fill these in with guesses.
 */
export const site = {
  name: "Shakoor Integrated Solutions Private Limited",
  shortName: "SHAKOOR",
  tagline: "Integrated Solutions",
  description:
    "Shakoor Integrated Solutions Private Limited delivers security systems, business technology, software development and IT support solutions tailored to modern business requirements.",

  /** Production URL, e.g. "https://www.example.com". Set NEXT_PUBLIC_SITE_URL in .env. */
  url: process.env.NEXT_PUBLIC_SITE_URL || null,

  contact: {
    /** TODO(company): verified phone number in international format, e.g. "+92 300 0000000". */
    phone: null as string | null,
    /** TODO(company): public business email address. */
    email: null as string | null,
    /** TODO(company): verified office address. */
    address: null as string | null,
    /** TODO(company): WhatsApp number, if the company uses one. */
    whatsapp: null as string | null,
    /** TODO(company): business hours, e.g. "Mon–Sat, 9:00–18:00". */
    hours: null as string | null,
  },

  /**
   * Official logo. Until it is supplied, a text placeholder is shown.
   * To use it: save the file in /public/images/brand/ and set src, width and height
   * to the file's real pixel dimensions so its proportions are preserved, e.g.
   * { src: "/images/brand/shakoor-logo.svg", width: 480, height: 120 }.
   */
  logo: { src: "/images/brand/shakoor-logo.png", width: 1221, height: 960 } as { src: string; width: number; height: number } | null,

  /** TODO(company): add only official profiles, e.g. { label: "LinkedIn", href: "https://…" }. */
  social: [] as { label: string; href: string }[],
};

export const mainNav = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Industries", href: "/industries" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "Careers", href: "/careers" },
  { label: "Contact", href: "/contact" },
] as const;

export function telHref(phone: string) {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}
