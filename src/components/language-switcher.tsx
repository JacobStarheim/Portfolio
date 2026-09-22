"use client";

import type { MouseEvent } from "react";
import Link from "next/link";
import { LANGUAGE_STORAGE_KEY, localizedHref, type Locale } from "@/lib/language";

export default function LanguageSwitcher({ locale }: { locale: Locale }) {
  function choose(event: MouseEvent<HTMLAnchorElement>, next: Locale) {
    // Only an explicit choice is remembered; following a shared link must not
    // overwrite somebody's saved preference. Storage can be unavailable.
    try { window.localStorage.setItem(LANGUAGE_STORAGE_KEY, next); } catch { /* Navigation still works. */ }
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    window.location.assign(localizedHref(next, window.location.search, window.location.hash));
  }

  return <nav className="language-switcher" aria-label={locale === "no" ? "Språk" : "Language"}>
    <Link href="/no" prefetch={false} hrefLang="nb" lang="nb" aria-current={locale === "no" ? "page" : undefined} onClick={(event) => choose(event, "no")}>Norsk</Link>
    <span aria-hidden="true">/</span>
    <Link href="/en" prefetch={false} hrefLang="en" lang="en" aria-current={locale === "en" ? "page" : undefined} onClick={(event) => choose(event, "en")}>English</Link>
  </nav>;
}
