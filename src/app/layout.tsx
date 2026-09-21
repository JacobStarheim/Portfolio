import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000"),
  title: "Jacob Starheim — En rød tråd",
  description: "Jacob Vindal Starheim. Programvareutvikler med sans for mobil, gode brukeropplevelser og hvordan ting virker. Utforsk arbeid, prosjekter og utdanning.",
  applicationName: "Jacob Starheim",
  icons: { icon: "/icon.svg" },
  authors: [{ name: "Jacob Vindal Starheim" }],
  openGraph: {
    title: "Jacob Starheim — En rød tråd",
    description: "Mobilutvikling, åpne verdener og en god dose nysgjerrighet.",
    type: "website",
    locale: "nb_NO",
    images: [{ url: "/art/chess.webp", width: 1254, height: 1254, alt: "Et gravert sjakklandskap med en rød tråd" }],
  },
  twitter: { card: "summary_large_image" },
  robots: { index: process.env.VERCEL_ENV === "production", follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nb">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {children}
      </body>
    </html>
  );
}
