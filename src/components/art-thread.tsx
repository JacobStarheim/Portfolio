"use client";

import { useEffect, useRef } from "react";
import { createArtworkThreadGeometry } from "@/lib/art-thread";
import { artAssetUrl } from "@/lib/art-assets";
import {
  prepareThreadProfile, rasterizeThread,
  type PreparedThreadProfile, type ThreadProfiles,
} from "@/lib/thread-material";

export { artThreadStyle } from "@/lib/art-thread";

type ArtThreadProps = { from: string; to: string; label: string; artOnly?: boolean };
type ThreadAssets = { profiles: ThreadProfiles };
let assetsPromise: Promise<ThreadAssets> | undefined;
const profiles = new Map<string, PreparedThreadProfile>();

function loadThreadAssets(): Promise<ThreadAssets> {
  if (!assetsPromise) assetsPromise = fetch(artAssetUrl("thread-profiles.json"), { credentials: "same-origin" }).then(async (response) => {
    if (!response.ok) throw new Error("Thread edge profiles could not load.");
    return response.json() as Promise<ThreadProfiles>;
  }).then((profiles) => ({ profiles })).catch((error) => {
    assetsPromise = undefined;
    throw error;
  });
  return assetsPromise;
}

function profileFor(assets: ThreadAssets, name: string, small: boolean, edge: "top" | "bottom") {
  const variant = small ? "small" : "large";
  const key = `${name}:${variant}:${edge}`;
  let prepared = profiles.get(key);
  if (!prepared) {
    const profile = assets.profiles.artworks[name]?.[variant]?.[edge];
    if (!profile) throw new Error(`Missing thread profile: ${key}`);
    prepared = prepareThreadProfile(profile, assets.profiles);
    profiles.set(key, prepared);
  }
  return prepared;
}

function useRasterThread(from: string, to: string | null, artOnly: boolean) {
  const container = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const element = container.current;
    const surface = canvas.current;
    if (!element || !surface) return;
    let disposed = false;
    let visible = false;
    let frame = 0;
    let revision = 0;
    let previousSize = "";

    async function draw() {
      frame = 0;
      if (!visible || disposed) return;
      const rect = element!.getBoundingClientRect();
      const continuation = to === null;
      const mobile = window.innerWidth <= 760;
      if (rect.width <= 0 || rect.height <= 0 || continuation && !mobile) return;
      const picture = continuation ? element!.parentElement?.querySelector(".artwork") : null;
      // The opening plate has an in-flow introduction above its mobile picture.
      // Use the actual border position, not just the image's own height.
      const top = picture ? picture.getBoundingClientRect().bottom - rect.top : 0;
      const height = rect.height - top;
      if (height <= 0) { surface!.width = 0; return; }
      const small = window.innerWidth <= 640;
      const scale = Math.min(4, Math.max(2, window.devicePixelRatio || 1));
      const sizeKey = `${rect.width}:${top}:${height}:${small}:${scale}:${mobile}:${artOnly}`;
      if (sizeKey === previousSize) return;
      const request = ++revision;
      try {
        const assets = await loadThreadAssets();
        if (disposed || request !== revision) return;
        const geometry = createArtworkThreadGeometry(from, to, {
          width: rect.width, height, small, mobile, artOnly,
        });
        const raster = rasterizeThread(geometry, {
          scale,
          from: profileFor(assets, from, small, "bottom"),
          to: profileFor(assets, continuation ? from : to!, small, continuation ? "bottom" : "top"),
        });
        surface!.width = raster.width;
        surface!.height = raster.height;
        surface!.style.left = `${raster.left}px`;
        surface!.style.top = `${top}px`;
        surface!.style.width = `${raster.cssWidth}px`;
        surface!.style.height = `${raster.cssHeight}px`;
        const context = surface!.getContext("2d");
        if (!context) return;
        context.putImageData(new ImageData(raster.data, raster.width, raster.height), 0, 0);
        surface!.dataset.ready = "true";
        previousSize = sizeKey;
      } catch {
        // Decorative only: preserve the gallery if a raster cannot load. Never
        // fall back to the flat stripe that this renderer explicitly replaces.
        surface!.dataset.ready = "false";
      }
    }

    const schedule = () => {
      if (frame) cancelAnimationFrame(frame);
      frame = requestAnimationFrame(draw);
    };
    const resize = new ResizeObserver(schedule);
    resize.observe(element);
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { visible = true; schedule(); }
    }, { rootMargin: "800px" });
    observer.observe(element);
    window.addEventListener("resize", schedule);
    return () => {
      disposed = true;
      revision++;
      cancelAnimationFrame(frame);
      resize.disconnect();
      observer.disconnect();
      window.removeEventListener("resize", schedule);
    };
  }, [from, to, artOnly]);

  return { container, canvas };
}

export function ArtThread({ from, to, label, artOnly = false }: ArtThreadProps) {
  const { container, canvas } = useRasterThread(from, to, artOnly);
  return <div ref={container} className="interlude art-thread" aria-hidden="true" data-thread-from={from} data-thread-to={to}>
    <span className="interlude-label">{label}</span>
    <canvas ref={canvas} className="thread-canvas" />
    <span className="interlude-note">FØLG TRÅDEN</span>
  </div>;
}

/** The source illustration's stroke continues behind stacked cards on mobile. */
export function ThreadContinuation({ name }: { name: string }) {
  const { container, canvas } = useRasterThread(name, null, false);
  return <div ref={container} className="thread-continuation" aria-hidden="true" data-thread-continuation={name}>
    <canvas ref={canvas} className="thread-canvas" />
  </div>;
}

export default ArtThread;
