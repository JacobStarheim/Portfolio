import { notFound } from "next/navigation";
import Portfolio from "@/components/portfolio";
import { getPortfolioContent } from "@/content/portfolio";
import { isLocale } from "@/lib/language";

export default async function LocalizedHome({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return <Portfolio locale={locale} content={getPortfolioContent(locale)} />;
}
