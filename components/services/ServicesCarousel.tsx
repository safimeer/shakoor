"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { serviceCategories, type ServiceCategory, type ServiceIconKey } from "@/data/services";
import { serviceIcons } from "@/components/ui/icons";
import { FallbackScene } from "@/components/ui/FallbackScene";

export type CarouselService = {
  slug: string;
  title: string;
  category: ServiceCategory;
  icon: ServiceIconKey;
  shortDescription: string;
  /** Resolved on the server; null when the image file is not in /public yet. */
  image: string | null;
  expectedImage: string;
  imageAlt: string;
  /** CSS object-position for the card crop. */
  position?: string;
  zoom?: number;
};

const DRAG_THRESHOLD = 6;

export function ServicesCarousel({ items }: { items: CarouselService[] }) {
  const [filter, setFilter] = useState<(typeof serviceCategories)[number]["id"]>("all");
  const [page, setPage] = useState(0);
  const [pages, setPages] = useState(1);
  const [edges, setEdges] = useState({ start: true, end: false });
  const trackRef = useRef<HTMLUListElement>(null);
  const drag = useRef({ active: false, startX: 0, startLeft: 0, moved: false });

  const visible = filter === "all" ? items : items.filter((s) => s.category === filter);

  const measure = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    const view = el.clientWidth || 1;
    // Page i starts at i * viewport width; the last page is clamped to the end.
    const count = max <= 4 ? 1 : Math.ceil(max / view) + 1;
    const atEnd = el.scrollLeft >= max - 4;
    setPages(count);
    setPage(atEnd ? count - 1 : Math.min(count - 1, Math.round(el.scrollLeft / view)));
    setEdges({ start: el.scrollLeft <= 4, end: atEnd });
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(measure);
    };
    // ResizeObserver also fires once on observe, which performs the initial measurement.
    const ro = new ResizeObserver(onScroll);
    ro.observe(el);
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      ro.disconnect();
      el.removeEventListener("scroll", onScroll);
    };
  }, [measure]);

  const scrollToPage = (target: number) => {
    const el = trackRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    el.scrollTo({ left: Math.min(max, Math.max(0, target * el.clientWidth)), behavior: "smooth" });
  };

  const step = (dir: -1 | 1) => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelector("li");
    const gap = parseFloat(getComputedStyle(el).columnGap) || 0;
    const cardW = card ? card.getBoundingClientRect().width + gap : el.clientWidth;
    // Advance by as many whole cards as fit, so the snap lands on a card edge.
    const perView = Math.max(1, Math.floor((el.clientWidth + gap) / cardW));
    el.scrollBy({ left: dir * perView * cardW, behavior: "smooth" });
  };

  const changeFilter = (id: typeof filter) => {
    setFilter(id);
    trackRef.current?.scrollTo({ left: 0 });
    requestAnimationFrame(measure);
  };

  // Mouse drag-to-scroll. Touch and pen use native scrolling.
  const onPointerDown = (e: React.PointerEvent<HTMLUListElement>) => {
    if (e.pointerType !== "mouse" || e.button !== 0) return;
    const el = trackRef.current;
    if (!el) return;
    drag.current = { active: true, startX: e.clientX, startLeft: el.scrollLeft, moved: false };
  };
  const onPointerMove = (e: React.PointerEvent<HTMLUListElement>) => {
    const d = drag.current;
    const el = trackRef.current;
    if (!d.active || !el) return;
    const dx = e.clientX - d.startX;
    if (!d.moved && Math.abs(dx) > DRAG_THRESHOLD) {
      d.moved = true;
      el.setPointerCapture(e.pointerId);
      el.dataset.dragging = "true";
    }
    if (d.moved) el.scrollLeft = d.startLeft - dx;
  };
  const endDrag = (e: React.PointerEvent<HTMLUListElement>) => {
    const el = trackRef.current;
    if (!drag.current.active || !el) return;
    drag.current.active = false;
    if (el.hasPointerCapture(e.pointerId)) el.releasePointerCapture(e.pointerId);
    delete el.dataset.dragging;
  };
  // Swallow the click that ends a drag so it doesn't open a card.
  const onClickCapture = (e: React.MouseEvent) => {
    if (drag.current.moved) {
      e.preventDefault();
      e.stopPropagation();
      drag.current.moved = false;
    }
  };

  return (
    <div>
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div
          role="group"
          aria-label="Filter services by category"
          className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0"
        >
          {serviceCategories.map((c) => {
            const active = filter === c.id;
            return (
              <button
                key={c.id}
                type="button"
                aria-pressed={active}
                onClick={() => changeFilter(c.id)}
                className={`min-h-11 shrink-0 cursor-pointer rounded-xl border px-4 text-sm font-semibold transition-colors ${
                  active
                    ? "border-blue bg-blue text-white"
                    : "border-line-strong text-mist hover:border-cyan/60 hover:text-white"
                }`}
              >
                {c.label}
              </button>
            );
          })}
        </div>
        <div className="hidden items-center gap-3 lg:flex">
          <CarouselButton dir={-1} disabled={edges.start} onClick={() => step(-1)} />
          <CarouselButton dir={1} disabled={edges.end} onClick={() => step(1)} />
        </div>
      </div>

      <p className="sr-only" aria-live="polite">
        Showing {visible.length} {visible.length === 1 ? "service" : "services"}
      </p>

      <ul
        ref={trackRef}
        aria-label="Services"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onClickCapture={onClickCapture}
        className="no-scrollbar -mx-4 mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-4 px-4 pb-2 sm:-mx-6 sm:scroll-px-6 sm:px-6 lg:mx-0 lg:scroll-px-0 lg:px-0 data-[dragging=true]:cursor-grabbing data-[dragging=true]:snap-none data-[dragging=true]:select-none"
      >
        {visible.map((s, i) => (
          <li
            key={s.slug}
            className="w-[84%] shrink-0 snap-start sm:w-[58%] md:w-[44%] lg:w-[calc((100%-2rem)/3)] xl:w-[calc((100%-3rem)/4)] 2xl:w-[calc((100%-4rem)/5)]"
          >
            <ServiceCard service={s} index={i} total={visible.length} />
          </li>
        ))}
      </ul>

      <div className="mt-6 flex items-center justify-center gap-4">
        <CarouselButton dir={-1} disabled={edges.start} onClick={() => step(-1)} className="lg:hidden" />
        {pages > 1 ? (
          <div className="flex items-center gap-1" role="group" aria-label="Carousel pages">
            {Array.from({ length: pages }).map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Go to page ${i + 1} of ${pages}`}
                aria-current={i === page ? "true" : undefined}
                onClick={() => scrollToPage(i)}
                className="grid size-8 cursor-pointer place-items-center"
              >
                <span
                  className={`block h-2 rounded-full transition-all duration-300 ${
                    i === page ? "w-6 bg-cyan" : "w-2 bg-white/30 hover:bg-white/60"
                  }`}
                />
              </button>
            ))}
          </div>
        ) : null}
        <CarouselButton dir={1} disabled={edges.end} onClick={() => step(1)} className="lg:hidden" />
      </div>
    </div>
  );
}

function CarouselButton({
  dir,
  disabled,
  onClick,
  className = "",
}: {
  dir: -1 | 1;
  disabled: boolean;
  onClick: () => void;
  className?: string;
}) {
  const Icon = dir === -1 ? ArrowLeft : ArrowRight;
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={dir === -1 ? "Previous services" : "Next services"}
      className={`grid size-12 cursor-pointer place-items-center rounded-full border border-line-strong text-white transition-colors hover:border-cyan hover:bg-cyan/10 disabled:cursor-default disabled:opacity-35 disabled:hover:border-line-strong disabled:hover:bg-transparent ${className}`}
    >
      <Icon aria-hidden="true" className="size-5" />
    </button>
  );
}

function ServiceCard({ service: s, index, total }: { service: CarouselService; index: number; total: number }) {
  const Icon = serviceIcons[s.icon];
  return (
    <Link
      href={`/services/${s.slug}`}
      draggable={false}
      aria-label={`${s.title}: ${s.shortDescription} Learn more (${index + 1} of ${total})`}
      className="group flex h-full flex-col overflow-hidden rounded-[var(--radius-card)] border border-line-strong bg-navy-2 transition-colors duration-300 hover:border-cyan/50"
    >
      {/* Photo only — no text on the image. */}
      <div className="relative aspect-[4/3] overflow-hidden bg-navy">
        <div className="absolute inset-0 transition-transform duration-700 ease-[var(--ease-out-soft)] group-hover:scale-[1.04]">
          {s.image ? (
            <Image
              src={s.image}
              alt={s.imageAlt}
              fill
              draggable={false}
              sizes="(min-width:1536px) 19vw, (min-width:1280px) 24vw, (min-width:1024px) 31vw, (min-width:768px) 44vw, (min-width:640px) 58vw, 84vw"
              className="object-cover"
              style={{
                objectPosition: s.position,
                ...(s.zoom ? { transform: `scale(${s.zoom})`, transformOrigin: s.position } : null),
              }}
            />
          ) : (
            <FallbackScene icon={Icon} expected={s.expectedImage} />
          )}
        </div>
        <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-navy-2/90 to-transparent" />
      </div>
      <div className="relative flex flex-1 flex-col px-5 pb-6 sm:px-6">
        <span aria-hidden="true" className="-mt-6 mb-4 grid size-12 place-items-center rounded-xl border border-cyan/40 bg-midnight text-cyan shadow-[0_8px_20px_-8px_rgb(0_0_0/0.6)]">
          <Icon className="size-5" />
        </span>
        <h3 className="t-h3 text-white">{s.title}</h3>
        <p className="mt-2 line-clamp-3 text-[0.95rem] leading-relaxed text-mist">{s.shortDescription}</p>
        <span aria-hidden="true" className="mt-auto inline-flex items-center gap-2 pt-5 text-sm font-semibold text-cyan transition-colors group-hover:text-white">
          Learn more
          <span className="grid size-8 place-items-center rounded-full bg-blue text-white transition-transform duration-300 group-hover:translate-x-1">
            <ArrowRight className="size-4" />
          </span>
        </span>
      </div>
    </Link>
  );
}
