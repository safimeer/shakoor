"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { ArrowRight, ChevronDown, Menu, Phone, X } from "lucide-react";
import { mainNav, site, telHref } from "@/data/site";
import { categoryLabel, services, type ServiceCategory } from "@/data/services";
import { serviceIcons } from "@/components/ui/icons";
import { Logo } from "./Logo";
import { buttonClass } from "@/components/ui/Button";

const categoryOrder: ServiceCategory[] = ["security", "business", "software", "support"];

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const servicesRef = useRef<HTMLLIElement>(null);
  const servicesButtonRef = useRef<HTMLButtonElement>(null);
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const panelId = useId();
  const mobileId = useId();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the services panel on outside click or Escape.
  useEffect(() => {
    if (!servicesOpen) return;
    const onPointer = (e: PointerEvent) => {
      if (!servicesRef.current?.contains(e.target as Node)) setServicesOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setServicesOpen(false);
        servicesButtonRef.current?.focus();
      }
    };
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [servicesOpen]);

  // Mobile menu: lock page scroll and close on Escape.
  useEffect(() => {
    if (!menuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  const openWithHover = () => {
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
    setServicesOpen(true);
  };
  const closeWithHover = () => {
    hoverTimer.current = setTimeout(() => setServicesOpen(false), 160);
  };

  const solid = scrolled || menuOpen;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-300 ${
        solid
          ? "border-b border-line bg-midnight/90 backdrop-blur-md"
          : "border-b border-transparent bg-gradient-to-b from-midnight/80 to-transparent"
      }`}
    >
      <a
        href="#main"
        className="sr-only rounded-md bg-white px-4 py-2 font-semibold text-ink focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-[60]"
      >
        Skip to content
      </a>
      <div className="container-x flex h-[var(--header-h)] items-center justify-between gap-6 lg:gap-2 xl:gap-6">
        <Logo />

        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {mainNav.map((item) => {
              const active = isActive(pathname, item.href);
              if (item.href === "/services") {
                return (
                  <li
                    key={item.href}
                    ref={servicesRef}
                    className="relative"
                    onMouseEnter={openWithHover}
                    onMouseLeave={closeWithHover}
                  >
                    <button
                      ref={servicesButtonRef}
                      type="button"
                      aria-expanded={servicesOpen}
                      aria-controls={panelId}
                      onClick={() => setServicesOpen((v) => !v)}
                      className={`flex min-h-11 cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-lg px-2.5 text-[0.95rem] xl:px-3.5 font-medium transition-colors ${
                        active || servicesOpen ? "text-white" : "text-mist hover:text-white"
                      }`}
                    >
                      Services
                      <ChevronDown
                        aria-hidden="true"
                        className={`size-4 transition-transform duration-200 ${servicesOpen ? "rotate-180" : ""}`}
                      />
                    </button>
                    {active ? <ActiveBar /> : null}
                    <div
                      id={panelId}
                      hidden={!servicesOpen}
                      className="absolute left-1/2 top-full w-[min(760px,90vw)] -translate-x-1/2 pt-3"
                    >
                      <div className="rounded-[var(--radius-panel)] border border-line-strong bg-navy/95 p-6 shadow-[0_30px_80px_-20px_rgb(0_0_0/0.7)] backdrop-blur-xl">
                        <div className="grid grid-cols-2 gap-x-8 gap-y-6">
                          {categoryOrder.map((cat) => (
                            <div key={cat}>
                              <p className="mb-2 text-sm font-semibold text-cyan">{categoryLabel[cat]}</p>
                              <ul className="space-y-0.5">
                                {services
                                  .filter((s) => s.category === cat)
                                  .map((s) => {
                                    const Icon = serviceIcons[s.icon];
                                    return (
                                      <li key={s.slug}>
                                        <Link
                                          href={`/services/${s.slug}`}
                                          onClick={() => setServicesOpen(false)}
                                          className="flex items-center gap-3 rounded-lg px-2 py-2 text-[0.95rem] text-white/90 transition-colors hover:bg-white/5 hover:text-white"
                                        >
                                          <Icon aria-hidden="true" className="size-[18px] text-cyan" />
                                          {s.title}
                                        </Link>
                                      </li>
                                    );
                                  })}
                              </ul>
                            </div>
                          ))}
                        </div>
                        <div className="mt-6 flex items-center justify-between border-t border-line pt-5">
                          <p className="text-sm text-mist">Not sure what you need? Tell us about your site.</p>
                          <Link
                            href="/services"
                            onClick={() => setServicesOpen(false)}
                            className="inline-flex items-center gap-1.5 text-sm font-semibold text-cyan hover:text-white"
                          >
                            View all services <ArrowRight aria-hidden="true" className="size-4" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </li>
                );
              }
              return (
                <li key={item.href} className="relative">
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={`flex min-h-11 items-center whitespace-nowrap rounded-lg px-2.5 text-[0.95rem] font-medium xl:px-3.5 transition-colors ${
                      active ? "text-white" : "text-mist hover:text-white"
                    }`}
                  >
                    {item.label}
                  </Link>
                  {active ? <ActiveBar /> : null}
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          <PhoneLink className="inline-flex whitespace-nowrap max-2xl:hidden" />
          <Link href="/contact#enquiry" className={buttonClass("primary", "min-h-11 whitespace-nowrap px-5 max-sm:hidden")}>
            Get a quote
          </Link>
          <button
            type="button"
            className="grid size-11 cursor-pointer place-items-center rounded-xl border border-line-strong text-white lg:hidden"
            aria-expanded={menuOpen}
            aria-controls={mobileId}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen((v) => !v)}
          >
            {menuOpen ? <X aria-hidden="true" className="size-5" /> : <Menu aria-hidden="true" className="size-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        id={mobileId}
        hidden={!menuOpen}
        className="h-[calc(100dvh-var(--header-h))] overflow-y-auto border-t border-line bg-midnight lg:hidden"
      >
        <nav aria-label="Mobile" className="container-x py-6">
          <ul className="space-y-1">
            {mainNav.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    onClick={() => setMenuOpen(false)}
                    className={`flex min-h-12 items-center rounded-xl px-4 text-lg font-semibold ${
                      active ? "bg-white/[0.06] text-white" : "text-mist"
                    }`}
                  >
                    {item.label}
                  </Link>
                  {item.href === "/services" ? (
                    <ul className="mb-2 ml-4 mt-1 grid gap-0.5 border-l border-line pl-3">
                      {services.map((s) => (
                        <li key={s.slug}>
                          <Link
                            href={`/services/${s.slug}`}
                            onClick={() => setMenuOpen(false)}
                            className="flex min-h-11 items-center px-2 text-[0.975rem] text-white/85"
                          >
                            {s.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </li>
              );
            })}
          </ul>
          <div className="mt-6 grid gap-3 border-t border-line pt-6">
            <Link href="/contact#enquiry" onClick={() => setMenuOpen(false)} className={buttonClass("primary")}>
              Get a quote
            </Link>
            <PhoneLink className="inline-flex justify-center" />
          </div>
        </nav>
      </div>
    </header>
  );
}

function ActiveBar() {
  return <span aria-hidden="true" className="absolute inset-x-2.5 -bottom-[3px] xl:inset-x-3.5 h-0.5 rounded-full bg-cyan" />;
}

/** Shows the phone number once configured in data/site.ts; a labelled placeholder in development only. */
function PhoneLink({ className = "" }: { className?: string }) {
  const phone = site.contact.phone;
  if (phone) {
    return (
      <a href={telHref(phone)} className={buttonClass("outline-dark", `min-h-11 whitespace-nowrap px-4 ${className}`)}>
        <Phone aria-hidden="true" className="size-4 text-cyan" />
        {phone}
      </a>
    );
  }
  if (process.env.NODE_ENV !== "development") return null;
  return (
    <span
      title="Set site.contact.phone in data/site.ts"
      className={`min-h-11 items-center gap-2 rounded-xl border border-dashed border-cyan/50 px-4 text-sm text-mist ${className}`}
    >
      <Phone aria-hidden="true" className="size-4 text-cyan" />
      Phone placeholder
    </span>
  );
}
