import { ButtonLink } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <section className="relative isolate grid min-h-[80svh] place-items-center overflow-hidden bg-midnight px-4 pt-[var(--header-h)] text-center text-white">
      <div className="viewfinder relative max-w-xl rounded-[var(--radius-panel)] border border-line-strong px-8 py-14">
        <p className="t-kicker text-cyan">Error 404</p>
        <h1 className="t-h1 mt-3">This page isn&apos;t in view</h1>
        <p className="t-lead mt-4 text-mist">The link may be out of date, or the page may have moved.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <ButtonLink href="/">Back to home</ButtonLink>
          <ButtonLink href="/services" variant="outline-dark">
            Browse services
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
