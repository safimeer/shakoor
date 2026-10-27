import { services } from "@/data/services";
import { resolveAsset } from "@/lib/assets";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ServicesCarousel, type CarouselService } from "./ServicesCarousel";

export function carouselItems(): CarouselService[] {
  return services.map((s) => ({
    slug: s.slug,
    title: s.title,
    category: s.category,
    icon: s.icon,
    shortDescription: s.shortDescription,
    image: resolveAsset(s.cardImage),
    expectedImage: s.cardImage,
    imageAlt: s.imageAlt,
    position: s.cardPosition,
    zoom: s.cardZoom,
  }));
}

/** The framed, dark services panel from the homepage. */
export function ServicesShowcase({ id = "services" }: { id?: string }) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="relative bg-midnight pb-20 pt-4 lg:pb-28">
      <div className="container-x">
        <div className="relative overflow-hidden rounded-[var(--radius-panel)] border border-line-strong bg-[linear-gradient(180deg,#0b2a4a_0%,#071f38_55%,#041426_100%)] px-4 py-10 shadow-[0_40px_120px_-40px_rgb(8_127_229/0.55)] sm:px-8 lg:px-10 lg:py-12">
          <div aria-hidden="true" className="pointer-events-none absolute -right-40 -top-40 size-[480px] rounded-full bg-cyan/10 blur-[100px]" />
          <div className="relative">
            <SectionHeading
              id={`${id}-title`}
              tone="dark"
              kicker="Our services"
              title="Comprehensive solutions for your business"
              intro="Security systems, business technology, software and IT support, planned and delivered by one team."
            />
            <div className="mt-10">
              <ServicesCarousel items={carouselItems()} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
