import Image from "next/image";
import { capabilityStrip } from "@/data/company";
import { resolveAsset } from "@/lib/assets";
import { serviceIcons } from "@/components/ui/icons";
import { ButtonLink } from "@/components/ui/Button";

const HERO_IMAGE = "/images/hero/shakoor-headquarters-blue-hour.png";

export function Hero() {
  const image = resolveAsset(HERO_IMAGE);

  return (
    <section aria-labelledby="hero-title" className="relative isolate overflow-hidden bg-midnight text-white">
      {/* Background: photography when supplied, otherwise a lit architectural backdrop. */}
      <div className="absolute inset-0 -z-10">
        {image ? (
          <Image
            src={image}
            alt=""
            fill
            preload
            sizes="100vw"
            className="object-cover object-[82%_center]"
          />
        ) : (
          <HeroBackdrop />
        )}
        <div className="absolute inset-0 bg-[linear-gradient(90deg,#041426_0%,rgb(4_20_38/0.92)_32%,rgb(4_20_38/0.45)_62%,rgb(4_20_38/0.15)_100%)]" />
        {/* On narrow screens text sits over the whole photo, so darken it evenly. */}
        <div className="absolute inset-0 bg-midnight/70 lg:hidden" />
        <div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-midnight to-transparent" />
      </div>

      <div className="container-x relative grid min-h-[min(880px,100svh)] items-center gap-12 pb-16 pt-[calc(var(--header-h)+48px)] lg:grid-cols-[1.05fr_1fr] lg:pb-24">
        <div className="max-w-[40rem]">
          <p className="t-kicker flex animate-rise items-center gap-2.5 text-cyan">
            <span aria-hidden="true" className="h-px w-8 bg-cyan" />
            Security, IT and business technology
          </p>
          <h1 id="hero-title" className="t-display mt-5 animate-rise text-balance [animation-delay:80ms]">
            Integrated solutions for a safer, smarter and connected future
          </h1>
          <p className="t-lead mt-6 max-w-[34rem] animate-rise text-pretty text-mist [animation-delay:160ms]">
            Shakoor Integrated Solutions Private Limited delivers security systems, business technology,
            software development and IT support solutions tailored to modern business requirements.
          </p>
          <div className="mt-9 flex animate-rise flex-wrap gap-3 [animation-delay:240ms]">
            <ButtonLink href="#services" arrow>
              Explore our services
            </ButtonLink>
            <ButtonLink href="/contact" variant="outline-dark">
              Contact our team
            </ButtonLink>
          </div>
        </div>

        {/* Viewfinder motif fills the space only when there's no photo; a real photo carries the right side itself. */}
        <div aria-hidden="true" className={`relative hidden h-[420px] ${image ? "" : "lg:block"}`}>
          <div className="viewfinder absolute inset-y-0 right-0 w-[88%] animate-rise rounded-[var(--radius-panel)] border border-white/10 [animation-delay:320ms]">
            <span className="absolute left-6 top-6 z-[4] inline-flex items-center gap-2 rounded-full bg-midnight/70 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur">
              <span className="size-2 animate-pulse-dot rounded-full bg-cyan" />
              Live view
            </span>
            <span className="absolute bottom-6 left-6 z-[4] text-xs font-medium text-mist">CAM 01</span>
            <span className="absolute left-1/2 top-1/2 size-10 -translate-x-1/2 -translate-y-1/2">
              <span className="absolute left-1/2 top-0 h-full w-px bg-cyan/50" />
              <span className="absolute left-0 top-1/2 h-px w-full bg-cyan/50" />
            </span>
          </div>
        </div>
      </div>

      {/* Capability strip — replaces statistics until verified figures are available. */}
      <div className="container-x relative pb-10">
        <ul className="grid grid-cols-2 gap-px overflow-hidden rounded-[var(--radius-card)] border border-line bg-line lg:grid-cols-4">
          {capabilityStrip.map((c) => {
            const Icon = serviceIcons[c.icon];
            return (
              <li key={c.label} className="flex items-center gap-4 bg-midnight/80 px-5 py-5 backdrop-blur sm:px-6">
                <Icon aria-hidden="true" strokeWidth={1.6} className="size-8 shrink-0 text-cyan" />
                <div>
                  <p className="font-semibold text-white">{c.label}</p>
                  <p className="text-sm text-mist">{c.text}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

/** Stand-in backdrop: city-at-dusk lighting built from gradients, no image required. */
function HeroBackdrop() {
  return (
    <div
      className="absolute inset-0"
      style={{
        backgroundImage: [
          "radial-gradient(60% 70% at 78% 38%, rgb(32 184 255 / 0.30), transparent 60%)",
          "radial-gradient(40% 40% at 92% 80%, rgb(10 111 209 / 0.45), transparent 70%)",
          "linear-gradient(rgb(130 180 230 / 0.06) 1px, transparent 1px)",
          "linear-gradient(90deg, rgb(130 180 230 / 0.06) 1px, transparent 1px)",
          "linear-gradient(180deg, #071f38 0%, #041426 100%)",
        ].join(","),
        backgroundSize: "auto, auto, 44px 44px, 44px 44px, auto",
      }}
    >
      {/* Abstract skyline */}
      <svg className="absolute bottom-0 right-0 h-[70%] w-[65%] text-navy-3" viewBox="0 0 600 400" preserveAspectRatio="xMaxYMax slice" fill="currentColor">
        <rect x="40" y="170" width="70" height="230" opacity="0.55" />
        <rect x="120" y="90" width="90" height="310" opacity="0.7" />
        <rect x="220" y="140" width="60" height="260" opacity="0.5" />
        <rect x="290" y="40" width="110" height="360" opacity="0.85" />
        <rect x="410" y="120" width="80" height="280" opacity="0.6" />
        <rect x="500" y="70" width="100" height="330" opacity="0.75" />
        {Array.from({ length: 9 }).map((_, row) =>
          Array.from({ length: 4 }).map((__, col) => (
            <rect key={`${row}-${col}`} x={302 + col * 24} y={60 + row * 34} width="12" height="16" fill="#20b8ff" opacity={(row + col) % 3 === 0 ? 0.35 : 0.1} />
          )),
        )}
      </svg>
    </div>
  );
}
