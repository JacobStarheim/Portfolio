import SiteDocument from "@/components/site-document";
import { siteMetadata } from "@/lib/site-metadata";

export const metadata = siteMetadata();

export default function EntryLayout({ children }: { children: React.ReactNode }) {
  return <SiteDocument lang="en">{children}</SiteDocument>;
}
