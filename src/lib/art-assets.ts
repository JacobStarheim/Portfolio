// Next inlines this public, content-derived value into HTML and client bundles.
// It is computed from artwork + profiles, never from a date or manual version.
export const ART_REVISION = process.env.NEXT_PUBLIC_ART_REVISION ?? "";

export function artAssetUrl(filename: string, revision = ART_REVISION): string {
  if (!revision) throw new Error("Missing artwork revision; load through the Next build or proof generator.");
  return `/art/${filename}?v=${revision}`;
}
