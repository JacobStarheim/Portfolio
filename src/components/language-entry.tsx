"use client";

import { useEffect } from "react";
import { LANGUAGE_STORAGE_KEY, localizedHref, resolveLocale } from "@/lib/language";
import LanguageSwitcher from "./language-switcher";

export default function LanguageEntry() {
  useEffect(() => {
    let saved: string | null = null;
    try { saved = window.localStorage.getItem(LANGUAGE_STORAGE_KEY); } catch { /* Browser preference remains available. */ }
    const languages = navigator.languages?.length ? navigator.languages : [navigator.language];
    const locale = resolveLocale(window.location.pathname, saved, languages);
    window.location.replace(localizedHref(locale, window.location.search, window.location.hash));
  }, []);

  // Both links work without JavaScript. No full Norwegian/English portfolio is
  // rendered here before detection, so there is no wrong-language content flash.
  return <main className="language-entry">
    <p className="thread-mark" aria-hidden="true">js</p>
    <h1>Jacob Starheim</h1>
    <p><span lang="en">Portfolio</span> · <span lang="nb">Portefølje</span></p>
    <LanguageSwitcher locale="en" />
  </main>;
}
