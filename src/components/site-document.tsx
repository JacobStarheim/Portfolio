import localFont from "next/font/local";
import "../app/globals.css";

const geistSans = localFont({ src: "../app/fonts/GeistVF.woff", variable: "--font-geist-sans", weight: "100 900" });
const geistMono = localFont({ src: "../app/fonts/GeistMonoVF.woff", variable: "--font-geist-mono", weight: "100 900" });

export default function SiteDocument({ children, lang }: { children: React.ReactNode; lang: "nb" | "en" }) {
  return <html lang={lang}><body className={`${geistSans.variable} ${geistMono.variable}`}>{children}</body></html>;
}
