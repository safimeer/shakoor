import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { ComponentProps, ReactNode } from "react";

type Variant = "primary" | "outline-dark" | "outline-light" | "ghost-dark";

const base =
  "inline-flex min-h-12 items-center justify-center gap-2 rounded-xl px-6 text-[0.975rem] font-semibold transition-colors duration-200 cursor-pointer disabled:cursor-not-allowed disabled:opacity-60";

const variants: Record<Variant, string> = {
  primary: "bg-blue text-white hover:bg-blue-deep shadow-[0_10px_30px_-12px_rgb(10_111_209/0.9)]",
  "outline-dark": "border border-white/35 text-white hover:border-white hover:bg-white/5",
  "outline-light": "border border-ink/20 text-ink hover:border-ink/50 hover:bg-ink/[0.03]",
  "ghost-dark": "text-cyan hover:text-white px-0 min-h-11",
};

export function buttonClass(variant: Variant = "primary", extra = "") {
  return `${base} ${variants[variant]} ${extra}`;
}

export function ButtonLink({
  href,
  variant = "primary",
  arrow = false,
  className = "",
  children,
  ...rest
}: Omit<ComponentProps<typeof Link>, "className"> & {
  variant?: Variant;
  arrow?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <Link href={href} className={buttonClass(variant, className)} {...rest}>
      {children}
      {arrow ? <ArrowRight aria-hidden="true" className="size-4" /> : null}
    </Link>
  );
}
