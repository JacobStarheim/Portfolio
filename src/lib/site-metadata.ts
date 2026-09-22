import type { Metadata } from "next";
import { artAssetUrl } from "./art-assets";
import type { Locale } from "./language";

export function siteMetadata(locale?: Locale): Metadata {
  const norwegian = locale === "no";
  const title = locale ? (norwegian ? "Jacob Starheim — En rød tråd" : "Jacob Starheim — A common thread") : "Jacob Starheim — Portfolio";
  const description = norwegian
    ? "Jacob Vindal Starheim. Programvareutvikler med sans for mobil, gode brukeropplevelser og hvordan ting virker. Utforsk arbeid, prosjekter og utdanning."
    : "Jacob Vindal Starheim. Software developer interested in mobile apps, thoughtful user experiences and how things work. Explore my work, projects and education.";
  const origin = process.env.VERCEL_ENV === "production" ? "https://jacobstarheim.vercel.app"
    : process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3100";
  return {
    metadataBase: new URL(origin), title, description,
    applicationName: "Jacob Starheim", icons: { icon: "/icon.svg" }, authors: [{ name: "Jacob Starheim" }],
    alternates: { canonical: locale ? `/${locale}` : "/", languages: { nb: "/no", en: "/en", "x-default": "/" } },
    openGraph: {
      title, description, type: "website", url: locale ? `/${locale}` : "/",
      locale: norwegian ? "nb_NO" : "en_GB", alternateLocale: norwegian ? "en_GB" : "nb_NO",
      images: [{ url: artAssetUrl("chess.webp"), width: 1254, height: 1254, alt: norwegian ? "Et gravert sjakklandskap med en rød tråd" : "An engraved chess landscape connected by a red thread" }],
    },
    twitter: { card: "summary_large_image" },
    robots: { index: process.env.VERCEL_ENV === "production", follow: true },
  };
}
