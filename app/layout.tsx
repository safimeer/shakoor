import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { site } from "@/data/site";
import "./globals.css";

/** AdSense client ID ("ca-pub-…"), or null when AdSense is switched off in data/site.ts. */
const adsenseClient = site.adsensePublisherId ? `ca-${site.adsensePublisherId}` : null;

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: site.url ? new URL(site.url) : undefined,
  title: {
    default: `${site.name} | Security, Business Technology & IT Solutions`,
    template: `%s | ${site.shortName} Integrated Solutions`,
  },
  description: site.description,
  applicationName: site.name,
  openGraph: {
    type: "website",
    siteName: site.name,
    title: site.name,
    description: site.description,
    locale: "en_GB",
  },
  twitter: { card: "summary_large_image" },
  // AdSense site-ownership verification.
  ...(adsenseClient ? { other: { "google-adsense-account": adsenseClient } } : {}),
};

export const viewport: Viewport = {
  themeColor: "#041426",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${jakarta.variable} antialiased`}>
      {adsenseClient ? (
        <head>
          {/*
            Google AdSense loader, exactly as AdSense issues it: a plain async script in <head>.
            next/script is avoided because it adds a data-nscript attribute that AdSense warns about.
            Auto ads placement is controlled from the AdSense dashboard (Ads → By site).
          */}
          <script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClient}`}
            crossOrigin="anonymous"
          />
        </head>
      ) : null}
      <body className="flex min-h-dvh flex-col">
        <Header />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
