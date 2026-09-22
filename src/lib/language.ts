export type Locale = "no" | "en";
export const LANGUAGE_STORAGE_KEY = "jacobstarheim-language";

export function isLocale(value: unknown): value is Locale {
  return value === "no" || value === "en";
}

export function detectLocale(languages: readonly string[]): Locale {
  for (const language of languages) {
    const base = language.toLowerCase().split("-")[0];
    if (base === "no" || base === "nb" || base === "nn") return "no";
    if (base === "en") return "en";
  }
  return "en";
}

export function resolveLocale(pathname: string, saved: unknown, languages: readonly string[]): Locale {
  const explicit = /^\/(no|en)\/?$/.exec(pathname)?.[1];
  if (isLocale(explicit)) return explicit;
  if (isLocale(saved)) return saved;
  return detectLocale(languages);
}

export function localizedHref(locale: Locale, search = "", hash = ""): string {
  return `/${locale}${search}${hash}`;
}
