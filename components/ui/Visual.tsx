import Image from "next/image";
import type { LucideIcon } from "lucide-react";
import { resolveAsset } from "@/lib/assets";
import { FallbackScene } from "./FallbackScene";

/**
 * Server component: renders the image if it exists in /public, otherwise a
 * designed fallback. Parent must be positioned with a defined size.
 * `position` is a CSS object-position that keeps the subject in frame when cropped.
 */
export function Visual({
  src,
  alt,
  icon,
  sizes,
  preload = false,
  position,
  className = "object-cover",
}: {
  src: string;
  alt: string;
  icon: LucideIcon;
  sizes: string;
  preload?: boolean;
  position?: string;
  className?: string;
}) {
  const resolved = resolveAsset(src);
  if (!resolved) return <FallbackScene icon={icon} expected={src} />;
  return (
    <Image
      src={resolved}
      alt={alt}
      fill
      sizes={sizes}
      preload={preload}
      className={className}
      style={position ? { objectPosition: position } : undefined}
    />
  );
}
