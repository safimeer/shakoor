"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Fades content in once when it scrolls into view. Content is visible by default
 * (no JS, reduced motion), and only hidden after mount if it starts off-screen.
 */
export function Reveal({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (el.getBoundingClientRect().top < window.innerHeight * 0.9) return;
    el.dataset.reveal = "hidden";
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.dataset.reveal = "shown";
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -10% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-[opacity,translate] duration-700 ease-[var(--ease-out-soft)] data-[reveal=hidden]:translate-y-5 data-[reveal=hidden]:opacity-0 ${className}`}
    >
      {children}
    </div>
  );
}
