import type { ReactNode } from "react";

/** Section heading with a short sentence-case kicker. `tone` follows the section background. */
export function SectionHeading({
  kicker,
  title,
  intro,
  tone = "light",
  align = "left",
  id,
  as: Tag = "h2",
}: {
  kicker?: string;
  title: ReactNode;
  intro?: ReactNode;
  tone?: "light" | "dark";
  align?: "left" | "center";
  id?: string;
  as?: "h1" | "h2";
}) {
  const dark = tone === "dark";
  return (
    <div className={align === "center" ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}>
      {kicker ? (
        <p className={`t-kicker mb-3 flex items-center gap-2.5 ${align === "center" ? "justify-center" : ""} ${dark ? "text-cyan" : "text-blue"}`}>
          <span aria-hidden="true" className={`h-px w-8 ${dark ? "bg-cyan" : "bg-blue"}`} />
          {kicker}
        </p>
      ) : null}
      <Tag id={id} className={`${Tag === "h1" ? "t-h1" : "t-h2"} text-balance ${dark ? "text-white" : "text-ink"}`}>
        {title}
      </Tag>
      {intro ? (
        <p className={`t-lead mt-4 text-pretty ${dark ? "text-mist" : "text-slate-ink"}`}>{intro}</p>
      ) : null}
    </div>
  );
}
