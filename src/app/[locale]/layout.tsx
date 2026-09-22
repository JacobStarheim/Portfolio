import { notFound } from "next/navigation";
import SiteDocument from "@/components/site-document";
import { isLocale } from "@/lib/language";
import { siteMetadata } from "@/lib/site-metadata";

export const dynamicParams = false;
export function generateStaticParams() { return [{ locale: "no" }, { locale: "en" }]; }

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return siteMetadata(locale);
}

export default async function LocaleLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return <SiteDocument lang={locale === "no" ? "nb" : "en"}>{children}</SiteDocument>;
}
