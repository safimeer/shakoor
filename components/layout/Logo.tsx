import Image from "next/image";
import Link from "next/link";
import { site } from "@/data/site";

/**
 * The only place the logo is rendered. Configure the official file in data/site.ts;
 * the placeholder below is used until then and is not a brand mark.
 */
export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link href="/" aria-label={`${site.name} home`} className={`inline-flex shrink-0 items-center ${className}`}>
      {site.logo ? (
        <span className="flex items-center gap-2.5 lg:gap-2 xl:gap-2.5">
          <Image
            src={site.logo.src}
            alt=""
            width={site.logo.width}
            height={site.logo.height}
            sizes="64px"
            preload
            className="h-10 w-auto"
          />
          {/* Wordmark — decorative; the link's aria-label carries the name. */}
          <span aria-hidden="true" className="flex flex-col justify-center leading-none">
            <span className="text-[1.2rem] font-extrabold tracking-[0.06em] text-white lg:text-[1.05rem] xl:text-[1.2rem]">SHAKOOR</span>
            <span className="mt-[5px] text-[0.6rem] font-semibold tracking-[0.12em] text-mist lg:text-[0.55rem] lg:tracking-[0.08em] xl:text-[0.6rem] xl:tracking-[0.12em]">INTEGRATED SOLUTIONS</span>
          </span>
        </span>
      ) : (
        <LogoPlaceholder />
      )}
    </Link>
  );
}

function LogoPlaceholder() {
  return (
    <span className="flex items-center gap-3" data-logo-placeholder>
      <span
        aria-hidden="true"
        className="grid size-10 place-items-center rounded-[11px] border border-dashed border-cyan/70 text-[0.7rem] font-bold tracking-wide text-cyan"
      >
        LOGO
      </span>
      <span className="flex flex-col leading-none">
        <span className="text-[1.15rem] font-extrabold tracking-[0.04em] text-white">{site.shortName}</span>
        <span className="mt-1 text-[0.7rem] font-medium tracking-[0.02em] text-mist">Integrated Solutions</span>
      </span>
    </span>
  );
}
