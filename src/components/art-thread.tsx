"use client";

import { useEffect, useId, useRef, useState } from "react";
import { createThreadGeometry, getArtThread } from "@/lib/art-thread";

export { artThreadStyle } from "@/lib/art-thread";

type ArtThreadProps = { from: string; to: string; label: string; artOnly?: boolean };

export function ArtThread({ from, to, label, artOnly = false }: ArtThreadProps) {
  const container = useRef<HTMLDivElement>(null);
  const gradientId = useId();
  const [size, setSize] = useState({ width: 1000, height: 110, viewport: 1000 });

  useEffect(() => {
    const element = container.current;
    if (!element) return;
    function measure() {
      const rect = element!.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return;
      const next = { width: rect.width, height: rect.height, viewport: window.innerWidth };
      setSize((current) => current.width === next.width && current.height === next.height
        && current.viewport === next.viewport ? current : next);
    }
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    // The observer supplies its initial dimensions asynchronously. Resize also
    // catches picture/media-query changes when a fixed-width gallery does not resize.
    window.addEventListener("resize", measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [from, to]);

  const small = size.viewport <= 640;
  const outgoing = getArtThread(from, small).bottom;
  const incoming = getArtThread(to, small).top;
  if (!outgoing) return null;
  const geometry = createThreadGeometry(outgoing, incoming, {
    width: size.width,
    height: size.height,
    startVertical: !artOnly && size.viewport <= 760,
  });

  return <div ref={container} className="interlude art-thread" aria-hidden="true" data-thread-from={from} data-thread-to={to}>
    <span className="interlude-label">{label}</span>
    <svg viewBox={`0 0 ${size.width} ${size.height}`} preserveAspectRatio="none" focusable="false">
      <defs>
        <linearGradient id={gradientId} gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2={size.height}>
          <stop offset="0" stopColor={outgoing.color} />
          <stop offset="1" stopColor={incoming.color} />
        </linearGradient>
      </defs>
      <path d={geometry.path} style={{ fill: `url(#${gradientId})`, stroke: "none" }} />
    </svg>
    <span className="interlude-note">FØLG TRÅDEN</span>
  </div>;
}

export default ArtThread;
