import type { LucideIcon } from "lucide-react";

/**
 * Designed stand-in for photography that hasn't been supplied yet.
 * Decorative only — the surrounding card or heading carries the meaning.
 * In development it shows which file is expected, so missing assets are obvious.
 */
export function FallbackScene({
  icon: Icon,
  expected,
  className = "",
}: {
  icon: LucideIcon;
  expected?: string;
  className?: string;
}) {
  return (
    <div
      aria-hidden="true"
      className={`absolute inset-0 overflow-hidden bg-navy-2 ${className}`}
      style={{
        backgroundImage: [
          "radial-gradient(120% 90% at 85% 15%, rgb(32 184 255 / 0.28), transparent 55%)",
          "radial-gradient(90% 70% at 10% 100%, rgb(10 111 209 / 0.35), transparent 60%)",
          "linear-gradient(rgb(130 180 230 / 0.07) 1px, transparent 1px)",
          "linear-gradient(90deg, rgb(130 180 230 / 0.07) 1px, transparent 1px)",
          "linear-gradient(160deg, #0b2a4a, #041426)",
        ].join(","),
        backgroundSize: "auto, auto, 32px 32px, 32px 32px, auto",
      }}
    >
      <Icon
        strokeWidth={0.9}
        className="absolute right-[8%] top-1/2 h-[58%] w-auto -translate-y-1/2 text-cyan/35"
      />
      <Icon
        strokeWidth={1.4}
        className="absolute right-[14%] top-1/2 h-[22%] w-auto -translate-y-1/2 text-cyan/80"
      />
      {process.env.NODE_ENV === "development" && expected ? (
        <span className="absolute left-3 top-3 z-10 max-w-[85%] truncate rounded-md bg-midnight/80 px-2 py-1 font-mono text-[11px] text-cyan">
          Image pending: {expected}
        </span>
      ) : null}
    </div>
  );
}
