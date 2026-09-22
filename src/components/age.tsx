"use client";

import { useSyncExternalStore } from "react";
import { getAge } from "@/lib/age";
import type { Locale } from "@/lib/language";

function subscribe(onChange: () => void) {
  let timeout: number;

  function refresh() {
    window.clearTimeout(timeout);
    onChange();
    // Oslo midnight falls on a UTC hour boundary. Recheck each hour even in a
    // long-lived tab, and realign after the browser wakes from sleep.
    timeout = window.setTimeout(refresh, 3_600_000 - (Date.now() % 3_600_000));
  }

  function onVisibilityChange() {
    if (document.visibilityState === "visible") refresh();
  }

  refresh();
  window.addEventListener("focus", refresh);
  document.addEventListener("visibilitychange", onVisibilityChange);

  return () => {
    window.clearTimeout(timeout);
    window.removeEventListener("focus", refresh);
    document.removeEventListener("visibilitychange", onVisibilityChange);
  };
}

// The static export and first hydration render omit the age; only the browser
// calculates it, so an old deployment can never supply a stale build-time age.
const getServerSnapshot = () => null;

export default function Age({ locale = "no" }: { locale?: Locale }) {
  const age = useSyncExternalStore(subscribe, getAge, getServerSnapshot);
  return age === null ? null : `${age} ${locale === "no" ? "år" : "years old"}, `;
}
