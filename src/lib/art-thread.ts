import type { CSSProperties } from "react";

/** Measured at the actual raster edge. Positions and horizontal widths use 0–1000. */
export type ThreadEdge = { x: number; width: number; color: string; slope: number };
export type ThreadEdges = { top: ThreadEdge; bottom: ThreadEdge | null };
type ArtMeasurements = { large: ThreadEdges; small: ThreadEdges };

// Regenerate measurements with scripts/measure-art-threads.mjs after replacing art.
// Each resolution is sampled separately: WebP resampling changes edge color and width.
export const ART_THREADS: Record<string, ArtMeasurements> = {
  nimmo: {
    large: { top: { x: 520.8396, width: 3.9872, color: "#a63333", slope: -0.1011 }, bottom: { x: 527.6452, width: 3.9872, color: "#87312d", slope: -0.44 } },
    small: { top: { x: 520.6224, width: 4.6875, color: "#7c2e2d", slope: -0.0068 }, bottom: { x: 528.2239, width: 6.25, color: "#5b2c23", slope: -0.3556 } },
  },
  traveller: {
    large: { top: { x: 501.0545, width: 3.1898, color: "#92312e", slope: 0.1364 }, bottom: { x: 500.9117, width: 3.1898, color: "#993c37", slope: -0.0369 } },
    small: { top: { x: 501.5734, width: 3.125, color: "#762e2c", slope: 0.0464 }, bottom: { x: 501.5518, width: 3.125, color: "#793029", slope: -0.0089 } },
  },
  driver: {
    large: { top: { x: 499.0271, width: 7.177, color: "#d34835", slope: -0.0874 }, bottom: { x: 497.9077, width: 5.5821, color: "#8b0f0c", slope: 0.0726 } },
    small: { top: { x: 499.1652, width: 7.8125, color: "#d14c42", slope: -0.0403 }, bottom: { x: 497.7919, width: 4.6875, color: "#821816", slope: 0.0061 } },
  },
  education: {
    large: { top: { x: 489.8403, width: 3.1898, color: "#842d2a", slope: 0.2686 }, bottom: { x: 473.179, width: 3.9872, color: "#8e2e24", slope: 0.3585 } },
    small: { top: { x: 489.8313, width: 4.6875, color: "#4b2522", slope: 0.1101 }, bottom: { x: 473.402, width: 3.125, color: "#79372d", slope: 0.2572 } },
  },
  in5320: {
    large: { top: { x: 500.2263, width: 2.3923, color: "#b83e3f", slope: -0.0011 }, bottom: { x: 500.2683, width: 2.3923, color: "#b54d47", slope: 0.0029 } },
    small: { top: { x: 500.7812, width: 1.5625, color: "#69464b", slope: -0.0494 }, bottom: { x: 500.1116, width: 3.125, color: "#684245", slope: -0.0382 } },
  },
  hobbies: {
    large: { top: { x: 498.6663, width: 3.9872, color: "#b3362e", slope: 0.1064 }, bottom: { x: 499.5673, width: 3.9872, color: "#9e3023", slope: 0.0126 } },
    small: { top: { x: 498.4457, width: 3.125, color: "#97382e", slope: 0.1527 }, bottom: { x: 499.0683, width: 4.6875, color: "#702a21", slope: -0.0241 } },
  },
  bfme: {
    large: { top: { x: 502.5867, width: 3.1898, color: "#8e292c", slope: 0.0673 }, bottom: { x: 523.4105, width: 3.1898, color: "#9b2818", slope: -0.2093 } },
    small: { top: { x: 503.0362, width: 3.125, color: "#5b2f2f", slope: -0.0997 }, bottom: { x: 523.447, width: 3.125, color: "#812f26", slope: -0.1205 } },
  },
  podcast: {
    large: { top: { x: 502.1096, width: 3.9872, color: "#75312c", slope: 0.3206 }, bottom: { x: 506.0519, width: 2.3923, color: "#853b2d", slope: -0.3873 } },
    small: { top: { x: 501.6067, width: 3.125, color: "#653030", slope: 0.0977 }, bottom: { x: 506.25, width: 3.125, color: "#5c3835", slope: -0.178 } },
  },
  chess: {
    large: { top: { x: 501.6893, width: 4.7847, color: "#a53836", slope: 0.2842 }, bottom: { x: 523.6573, width: 3.9872, color: "#9b3022", slope: -0.3611 } },
    small: { top: { x: 501.5728, width: 3.125, color: "#833734", slope: 0.1873 }, bottom: { x: 523.4592, width: 3.125, color: "#7f3731", slope: -0.2894 } },
  },
  about: {
    large: { top: { x: 546.6326, width: 3.9872, color: "#8e2e2b", slope: -0.0387 }, bottom: null },
    small: { top: { x: 545.9803, width: 4.6875, color: "#562920", slope: 0.136 }, bottom: null },
  },
};

export function getArtThread(name: string, small = false): ThreadEdges {
  if (!Object.hasOwn(ART_THREADS, name)) throw new Error(`No thread measurements for artwork: ${name}`);
  return ART_THREADS[name][small ? "small" : "large"];
}

/** The plate's mobile continuation shares the artwork's measured endpoint. */
export function artThreadStyle(name: string): CSSProperties {
  const large = getArtThread(name).bottom;
  const small = getArtThread(name, true).bottom;
  if (!large || !small) return {};
  return {
    "--thread-end": `${large.x / 10}%`,
    "--thread-width": `${large.width / 10}%`,
    "--thread-color": large.color,
    "--thread-end-small": `${small.x / 10}%`,
    "--thread-width-small": `${small.width / 10}%`,
    "--thread-color-small": small.color,
  } as CSSProperties;
}

export type ThreadPoint = { x: number; y: number };
export type ThreadGeometryOptions = {
  width: number;
  height: number;
  startVertical?: boolean;
  minimumWidth?: number;
};

/** Account for the mobile text-card section between an image and its next gap. */
export function createArtworkThreadGeometry(from: string, to: string | null, {
  width, height, small = false, mobile = false, artOnly = false,
}: { width: number; height: number; small?: boolean; mobile?: boolean; artOnly?: boolean }) {
  const outgoing = getArtThread(from, small).bottom;
  if (!outgoing) throw new Error(`Artwork has no outgoing thread: ${from}`);
  const continuation = to === null;
  const incoming = continuation ? { ...outgoing, slope: 0 } : getArtThread(to, small).top;
  return createThreadGeometry(outgoing, incoming, {
    width, height, minimumWidth: 0,
    // Behind the card, preserve the image's exit tangent then settle vertically.
    // Only the gap after that continuation starts vertically. In art-only mode
    // there is no card, so both tangents come directly from the artwork.
    startVertical: !continuation && mobile && !artOnly,
  });
}

/** Build in actual CSS pixels so resizing cannot stretch the measured tangents. */
export function createThreadGeometry(from: ThreadEdge, to: ThreadEdge, {
  width, height, startVertical = false, minimumWidth = 1,
}: ThreadGeometryOptions) {
  if (![width, height, minimumWidth].every(Number.isFinite) || width <= 0 || height <= 0 || minimumWidth < 0) {
    throw new Error("Thread dimensions must be positive and finite; minimum width cannot be negative.");
  }
  const start = { x: from.x / 1000 * width, y: 0 };
  const end = { x: to.x / 1000 * width, y: height };
  const startSlope = startVertical ? 0 : from.slope;
  // Shorten handles for steep edges, preserving the measured angle exactly.
  const startHandle = Math.min(height * 0.32, 60, width * 0.08 / Math.max(1, Math.abs(startSlope)));
  const endHandle = Math.min(height * 0.32, 60, width * 0.08 / Math.max(1, Math.abs(to.slope)));
  const control1 = { x: start.x + startSlope * startHandle, y: startHandle };
  const control2 = { x: end.x - to.slope * endHandle, y: height - endHandle };
  const startWidth = Math.max(minimumWidth, from.width / 1000 * width);
  const endWidth = Math.max(minimumWidth, to.width / 1000 * width);
  const centerline: ThreadPoint[] = [];
  const left: ThreadPoint[] = [];
  const right: ThreadPoint[] = [];
  const sampleCount = 80;
  for (let index = 0; index <= sampleCount; index++) {
    const t = index / sampleCount;
    const u = 1 - t;
    const point = {
      x: u ** 3 * start.x + 3 * u ** 2 * t * control1.x + 3 * u * t ** 2 * control2.x + t ** 3 * end.x,
      y: u ** 3 * start.y + 3 * u ** 2 * t * control1.y + 3 * u * t ** 2 * control2.y + t ** 3 * end.y,
    };
    // Horizontal widths meet the raster's horizontal border. Smoothstep has zero
    // derivative at both ends, so tapering adds no kink to the measured tangents.
    const taper = t * t * (3 - 2 * t);
    const halfWidth = (startWidth + (endWidth - startWidth) * taper) / 2;
    centerline.push(point);
    left.push({ x: point.x - halfWidth, y: point.y });
    right.push({ x: point.x + halfWidth, y: point.y });
  }
  const outline = [...left, ...right.reverse()];
  const path = outline.map((point, index) => `${index ? "L" : "M"} ${point.x.toFixed(4)} ${point.y.toFixed(4)}`).join(" ") + " Z";
  return { start, end, control1, control2, startWidth, endWidth, path, centerline };
}
