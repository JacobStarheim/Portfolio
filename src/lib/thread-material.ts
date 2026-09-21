/** Raster-only thread rendering. Geometry supplies the route, never its appearance. */
export type ThreadRaster = { width: number; height: number; data: ArrayLike<number> };
export type ThreadProfile = { rows: number[][]; profileWidth?: number; span?: number };
export type ThreadProfiles = {
  version: number;
  profileWidth: number;
  span: number;
  artworks: Record<string, Record<"large" | "small", { top: ThreadProfile; bottom: ThreadProfile | null }>>;
};
type Point = { x: number; y: number };
export type RasterThreadGeometry = { centerline: Point[]; startWidth: number; endWidth: number };
type Pixel = [number, number, number, number];
export type PreparedThreadMaterial = ThreadRaster & { centers: number[]; widths: number[]; mean: Pixel };
export type PreparedThreadProfile = ThreadRaster & { span: number; mean: Pixel };

const clamp = (value: number, low = 0, high = 1) => Math.min(high, Math.max(low, value));
const smooth = (value: number) => { const t = clamp(value); return t * t * (3 - 2 * t); };
const mix = (a: number, b: number, amount: number) => a + (b - a) * amount;

/** Soft red-chroma key keeps the cord's shadow/highlight detail and its fine fringe. */
export function threadAlpha(red: number, green: number, blue: number): number {
  return smooth((red - Math.max(green, blue) - 2) / 22);
}

function isolatePixel(data: ArrayLike<number>, offset: number, matte: Pixel): Pixel {
  const alpha = threadAlpha(data[offset], data[offset + 1], data[offset + 2]) * data[offset + 3] / 255;
  if (alpha < 0.001) return [0, 0, 0, 0];
  // Undo the source matte before compositing, preserving the fine fibres rather
  // than giving their antialiased borders an artificial dark outline.
  return [
    clamp(matte[0] + (data[offset] - matte[0]) / alpha, 0, 255),
    clamp(matte[1] + (data[offset + 1] - matte[1]) / alpha, 0, 255),
    clamp(matte[2] + (data[offset + 2] - matte[2]) / alpha, 0, 255),
    alpha * 255,
  ];
}

function rowMatte(raster: ThreadRaster, row: number): Pixel {
  const first = row * raster.width * 4;
  const last = first + (raster.width - 1) * 4;
  return [0, 1, 2].map((channel) => (raster.data[first + channel] + raster.data[last + channel]) / 2).concat(255) as Pixel;
}

function averagePixels(data: ArrayLike<number>, start = 0, end = data.length): Pixel {
  let weight = 0;
  const result: Pixel = [0, 0, 0, 255];
  for (let offset = start; offset < end; offset += 4) {
    const alpha = data[offset + 3] / 255;
    weight += alpha;
    for (let channel = 0; channel < 3; channel++) result[channel] += data[offset + channel] * alpha;
  }
  if (weight) for (let channel = 0; channel < 3; channel++) result[channel] /= weight;
  return result;
}

/** Prepare the one generated, straight cord once; individual bridges reuse it. */
export function prepareThreadMaterial(raster: ThreadRaster): PreparedThreadMaterial {
  if (raster.width < 2 || raster.height < 2 || raster.data.length !== raster.width * raster.height * 4) {
    throw new Error("Thread material must contain a complete RGBA raster.");
  }
  const data = new Float32Array(raster.data.length);
  const centers: number[] = [];
  const widths: number[] = [];
  for (let row = 0; row < raster.height; row++) {
    const matte = rowMatte(raster, row);
    let first = raster.width;
    let last = -1;
    for (let column = 0; column < raster.width; column++) {
      const offset = (row * raster.width + column) * 4;
      const pixel = isolatePixel(raster.data, offset, matte);
      data.set(pixel, offset);
      if (pixel[3] >= 160) { first = Math.min(first, column); last = column; }
    }
    if (last < first) throw new Error(`Generated thread has no red cord in row ${row}.`);
    centers.push((first + last) / 2);
    widths.push(last - first + 1);
  }
  return { width: raster.width, height: raster.height, data, centers, widths, mean: averagePixels(data) };
}

export function prepareThreadProfile(profile: ThreadProfile, defaults: Pick<ThreadProfiles, "profileWidth" | "span">): PreparedThreadProfile {
  const width = profile.profileWidth ?? defaults.profileWidth;
  const height = profile.rows.length;
  const span = profile.span ?? defaults.span;
  if (width < 2 || height < 1 || !Number.isFinite(span) || span <= 0
    || profile.rows.some((row) => row.length !== width * 4)) throw new Error("Thread edge profile has invalid dimensions.");
  const raw = { width, height, data: profile.rows.flat() };
  const data = new Float32Array(raw.data.length);
  for (let row = 0; row < height; row++) {
    const matte = rowMatte(raw, row);
    for (let column = 0; column < width; column++) {
      const offset = (row * width + column) * 4;
      data.set(isolatePixel(raw.data, offset, matte), offset);
    }
  }
  return { width, height, span, data, mean: averagePixels(data, 0, width * 4) };
}

function sample(raster: ThreadRaster, x: number, y: number): Pixel {
  if (x < 0 || x > raster.width - 1) return [0, 0, 0, 0];
  y = clamp(y, 0, raster.height - 1);
  const x0 = Math.floor(x);
  const x1 = Math.min(x0 + 1, raster.width - 1);
  const y0 = Math.floor(y);
  const y1 = Math.min(y0 + 1, raster.height - 1);
  const result: Pixel = [0, 0, 0, 0];
  const fx = x - x0;
  const fy = y - y0;
  for (const [column, row, weight] of [
    [x0, y0, (1 - fx) * (1 - fy)], [x1, y0, fx * (1 - fy)],
    [x0, y1, (1 - fx) * fy], [x1, y1, fx * fy],
  ]) {
    const offset = (row * raster.width + column) * 4;
    const alphaWeight = raster.data[offset + 3] * weight;
    result[3] += alphaWeight;
    for (let channel = 0; channel < 3; channel++) result[channel] += raster.data[offset + channel] * alphaWeight;
  }
  // Bilinear interpolation is premultiplied too: otherwise transparent black
  // neighbours darken the cord's delicate keyed fibre edges a second time.
  if (result[3]) for (let channel = 0; channel < 3; channel++) result[channel] /= result[3];
  return result;
}

export type ThreadScanline = { x: number; y: number; width: number; arc: number; textureDistance: number };

/** Arc-length UVs keep fibres equally spaced when the bridge bends or tapers. */
export function threadScanlines(geometry: RasterThreadGeometry, count: number): ThreadScanline[] {
  const points = geometry.centerline;
  if (points.length < 2 || count < 2 || !Number.isInteger(count)) throw new Error("A thread needs at least two scanlines and geometry points.");
  const height = points.at(-1)!.y;
  if (height <= 0 || geometry.startWidth <= 0 || geometry.endWidth <= 0) throw new Error("Thread dimensions must be positive.");
  const arcs = [0];
  for (let index = 1; index < points.length; index++) {
    if (points[index].y <= points[index - 1].y) throw new Error("Thread centerline must travel downwards.");
    arcs.push(arcs[index - 1] + Math.hypot(points[index].x - points[index - 1].x, points[index].y - points[index - 1].y));
  }
  const result: ThreadScanline[] = [];
  let segment = 0;
  for (let index = 0; index < count; index++) {
    const y = height * index / (count - 1);
    while (segment < points.length - 2 && points[segment + 1].y < y) segment++;
    const fraction = (y - points[segment].y) / (points[segment + 1].y - points[segment].y);
    const t = (segment + fraction) / (points.length - 1);
    const width = mix(geometry.startWidth, geometry.endWidth, smooth(t));
    const arc = mix(arcs[segment], arcs[segment + 1], fraction);
    const previous = result.at(-1);
    result.push({
      x: mix(points[segment].x, points[segment + 1].x, fraction), y, width, arc,
      textureDistance: previous ? previous.textureDistance + (arc - previous.arc) / ((previous.width + width) / 2) : 0,
    });
  }
  return result;
}

/** Ping-pong the long material strip to avoid a hard texture seam when repeated. */
export function reflectedTextureRow(distance: number, height: number): number {
  const last = height - 1;
  if (last <= 0) return 0;
  const phase = ((distance % (last * 2)) + last * 2) % (last * 2);
  return phase <= last ? phase : last * 2 - phase;
}

type ThreadRenderOptions = { scale?: number; blendLength?: number; from: PreparedThreadProfile; to: PreparedThreadProfile };

/**
 * Shift the photographed/generated fibre shading as one colour, not three
 * independent channels. Per-channel gains turn the red cord's pale highlights
 * into an ivory stripe when a dark source channel needs a large average lift.
 */
export function calibrateThreadPixel(pixel: Pixel, sourceMean: Pixel, targetMean: Pixel): Pixel {
  const gain = clamp(targetMean[0] / Math.max(1, sourceMean[0]), 0.35, 1.35) * 0.65;
  return [
    clamp(targetMean[0] + (pixel[0] - sourceMean[0]) * gain, 0, 255),
    clamp(targetMean[1] + (pixel[1] - sourceMean[1]) * gain, 0, 255),
    clamp(targetMean[2] + (pixel[2] - sourceMean[2]) * gain, 0, 255),
    pixel[3],
  ];
}

/** Every pixel is sampled from the generated cord or actual artwork border. */
export function rasterizeThread(material: PreparedThreadMaterial, geometry: RasterThreadGeometry, {
  scale = 2, blendLength = 16, from, to,
}: ThreadRenderOptions) {
  if (!Number.isFinite(scale) || scale <= 0 || !Number.isFinite(blendLength) || blendLength <= 0) throw new Error("Invalid thread raster scale.");
  const height = geometry.centerline.at(-1)!.y;
  const span = Math.max(from.span, to.span, 1.8);
  const fringe = Math.max(geometry.startWidth, geometry.endWidth) * span / 2 + 1;
  const left = Math.floor(Math.min(...geometry.centerline.map((point) => point.x)) - fringe);
  const right = Math.ceil(Math.max(...geometry.centerline.map((point) => point.x)) + fringe);
  const pixelWidth = Math.max(1, Math.ceil((right - left) * scale));
  const pixelHeight = Math.max(2, Math.ceil(height * scale));
  const data = new Uint8ClampedArray(pixelWidth * pixelHeight * 4);
  const rows = threadScanlines(geometry, pixelHeight);
  const core = material.widths.reduce((sum, width) => sum + width, 0) / material.widths.length;
  const fade = Math.min(blendLength, height / 3);
  for (let row = 0; row < pixelHeight; row++) {
    const line = rows[row];
    const textureY = reflectedTextureRow(line.textureDistance * core, material.height);
    const lowerRow = Math.floor(textureY);
    const upperRow = Math.min(lowerRow + 1, material.height - 1);
    const center = mix(material.centers[lowerRow], material.centers[upperRow], textureY - lowerRow);
    const coreWidth = mix(material.widths[lowerRow], material.widths[upperRow], textureY - lowerRow);
    const toneProgress = smooth(line.y / height);
    const targetMean: Pixel = [
      mix(from.mean[0], to.mean[0], toneProgress),
      mix(from.mean[1], to.mean[1], toneProgress),
      mix(from.mean[2], to.mean[2], toneProgress), 255,
    ];
    const endDistance = height - line.y;
    const edge = line.y < fade ? from : endDistance < fade ? to : null;
    const edgeDistance = edge === from ? line.y : endDistance;
    const blend = edge ? 1 - smooth(edgeDistance / fade) : 0;
    for (let column = 0; column < pixelWidth; column++) {
      const x = left + (column + 0.5) / scale;
      const across = (x - line.x) / line.width;
      const pixel = calibrateThreadPixel(sample(material, center + across * coreWidth, textureY), material.mean, targetMean);
      if (edge) {
        // Profile columns were sampled at pixel centres within their span.
        const border = sample(edge, (across / edge.span + 0.5) * edge.width - 0.5, edgeDistance / fade * (edge.height - 1));
        const alpha = mix(pixel[3], border[3], blend);
        // Premultiplied interpolation preserves soft fibres as both rasters fade.
        for (let channel = 0; channel < 3; channel++) pixel[channel] = alpha ? mix(pixel[channel] * pixel[3], border[channel] * border[3], blend) / alpha : 0;
        pixel[3] = alpha;
      }
      data.set(pixel, (row * pixelWidth + column) * 4);
    }
  }
  return { width: pixelWidth, height: pixelHeight, left, cssWidth: right - left, cssHeight: height, data };
}
