import { ButtonLink } from "@/components/ui/Button";

export function CtaBand({
  title = "Let's build a safer, smarter workplace",
  text = "Tell us about your site, your team and what you need. We'll recommend a practical next step.",
  href = "/contact#enquiry",
  label = "Request a consultation",
}: {
  title?: string;
  text?: string;
  href?: string;
  label?: string;
}) {
  return (
    <section aria-label="Contact us" className="bg-paper pb-20 lg:pb-28">
      <div className="container-x">
        <div className="viewfinder relative overflow-hidden rounded-[var(--radius-panel)] bg-navy px-6 py-14 text-center sm:px-12 lg:py-20">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(60% 120% at 50% 120%, rgb(32 184 255 / 0.30), transparent 60%), linear-gradient(rgb(130 180 230 / 0.06) 1px, transparent 1px), linear-gradient(90deg, rgb(130 180 230 / 0.06) 1px, transparent 1px)",
              backgroundSize: "auto, 40px 40px, 40px 40px",
            }}
          />
          <div className="relative mx-auto max-w-2xl">
            <h2 className="t-h2 text-balance text-white">{title}</h2>
            <p className="t-lead mx-auto mt-4 max-w-xl text-pretty text-mist">{text}</p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <ButtonLink href={href} arrow>
                {label}
              </ButtonLink>
              <ButtonLink href="/services" variant="outline-dark">
                Browse services
              </ButtonLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
