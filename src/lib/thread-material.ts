/** Continue the illustrated line using only pixels from its two artwork edges. */
export type ThreadRaster = { width: number; height: number; data: ArrayLike<number> };
export type ThreadProfile = { rows: number[][]; profileWidth?: number; span?: number; matte?: [number, number, number] };
export type ThreadProfiles = {
  version: number;
  profileWidth: number;
  span: number;
  artworks: Record<string, Record<"large" | "small", { top: ThreadProfile; bottom: ThreadProfile | null }>>;
};
type Point = { x: number; y: number };
export type RasterThreadGeometry = { centerline: Point[]; startWidth: number; endWidth: number };
type Pixel = [number, number, number, number];
export type PreparedThreadProfile = ThreadRaster & { span: number; mean: Pixel };

const clamp = (value: number, low = 0, high = 1) => Math.min(high, Math.max(low, value));
const smooth = (value: number) => { const t = clamp(value); return t * t * (3 - 2 * t); };
const mix = (a: number, b: number, amount: number) => a + (b - a) * amount;

/** Separate the illustrated red stroke from its dark paper background. */
export function threadAlpha(red: number, green: number, blue: number): number {
  return smooth((red - Math.max(green, blue) - 2) / 22);
}

function isolatePixel(data: ArrayLike<number>, offset: number, matte: Pixel): Pixel {
  const alpha = threadAlpha(data[offset], data[offset + 1], data[offset + 2]) * data[offset + 3] / 255;
  if (alpha < 0.001) return [0, 0, 0, 0];
  // Undo the source matte so the original soft edge is not darkened twice.
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

/** Keep the measured stroke and its complete connected antialiased fringe. */
function isolateStrokeRun(data: Float32Array, row: number, width: number, span: number) {
  const rowOffset = row * width * 4;
  const center = (width - 1) / 2;
  // The measured bright core is centered in the much wider source sample. Find
  // its strongest pixel, not a warm paper fleck elsewhere in that sample.
  const coreRadius = width / span / 2;
  let seed = -1;
  let strongest = 0;
  for (let column = 0; column < width; column++) {
    if (Math.abs(column - center) > Math.max(1, coreRadius)) continue;
    const alpha = data[rowOffset + column * 4 + 3];
    if (alpha > strongest) { seed = column; strongest = alpha; }
  }
  if (seed === -1) { data.fill(0, rowOffset, rowOffset + width * 4); return; }
  let left = seed;
  let right = seed;
  // Do not introduce a stronger alpha threshold: very dim compression fringes
  // still belong to the line when they remain connected to the actual stroke.
  while (left > 0 && data[rowOffset + (left - 1) * 4 + 3] > 0) left--;
  while (right < width - 1 && data[rowOffset + (right + 1) * 4 + 3] > 0) right++;
  data.fill(0, rowOffset, rowOffset + left * 4);
  data.fill(0, rowOffset + (right + 1) * 4, rowOffset + width * 4);
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
    const matte: Pixel = profile.matte ? [...profile.matte, 255] : rowMatte(raw, row);
    for (let column = 0; column < width; column++) {
      const offset = (row * width + column) * 4;
      data.set(isolatePixel(raw.data, offset, matte), offset);
    }
    isolateStrokeRun(data, row, width, span);
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
  // Premultiplied sampling preserves the soft source edge next to transparency.
  if (result[3]) for (let channel = 0; channel < 3; channel++) result[channel] /= result[3];
  return result;
}

export type ThreadScanline = { x: number; y: number; width: number };

/** Follow the measured curve and gradually interpolate its horizontal width. */
export function threadScanlines(geometry: RasterThreadGeometry, count: number): ThreadScanline[] {
  const points = geometry.centerline;
  if (points.length < 2 || count < 2 || !Number.isInteger(count)) throw new Error("A thread needs at least two scanlines and geometry points.");
  const height = points.at(-1)!.y;
  if (height <= 0 || geometry.startWidth <= 0 || geometry.endWidth <= 0) throw new Error("Thread dimensions must be positive.");
  for (let index = 1; index < points.length; index++) {
    if (points[index].y <= points[index - 1].y) throw new Error("Thread centerline must travel downwards.");
  }
  const result: ThreadScanline[] = [];
  let segment = 0;
  for (let index = 0; index < count; index++) {
    const y = height * index / (count - 1);
    while (segment < points.length - 2 && points[segment + 1].y < y) segment++;
    const fraction = (y - points[segment].y) / (points[segment + 1].y - points[segment].y);
    const t = (segment + fraction) / (points.length - 1);
    const width = mix(geometry.startWidth, geometry.endWidth, smooth(t));
    result.push({
      x: mix(points[segment].x, points[segment + 1].x, fraction), y, width,
    });
  }
  return result;
}

type ThreadRenderOptions = { scale?: number; from: PreparedThreadProfile; to: PreparedThreadProfile };

/**
 * Carry the source line's entire cross-section through the gap, gently blending
 * to the next line's cross-section. No added material, grain, fibres or highlight.
 * Only the outermost row is used: inner rows can contain the illustration frame.
 */
export function rasterizeThread(geometry: RasterThreadGeometry, {
  scale = 2, from, to,
}: ThreadRenderOptions) {
  if (!Number.isFinite(scale) || scale <= 0) throw new Error("Invalid thread raster scale.");
  const height = geometry.centerline.at(-1)!.y;
  const span = Math.max(from.span, to.span, 1.8);
  const fringe = Math.max(geometry.startWidth, geometry.endWidth) * span / 2 + 1;
  const left = Math.floor(Math.min(...geometry.centerline.map((point) => point.x)) - fringe);
  const right = Math.ceil(Math.max(...geometry.centerline.map((point) => point.x)) + fringe);
  const pixelWidth = Math.max(1, Math.ceil((right - left) * scale));
  const pixelHeight = Math.max(2, Math.ceil(height * scale));
  const data = new Uint8ClampedArray(pixelWidth * pixelHeight * 4);
  const rows = threadScanlines(geometry, pixelHeight);
  for (let row = 0; row < pixelHeight; row++) {
    const line = rows[row];
    const progress = smooth(line.y / height);
    for (let column = 0; column < pixelWidth; column++) {
      const x = left + (column + 0.5) / scale;
      const across = (x - line.x) / line.width;
      const a = sample(from, (across / from.span + 0.5) * from.width - 0.5, 0);
      const b = sample(to, (across / to.span + 0.5) * to.width - 0.5, 0);
      const alpha = mix(a[3], b[3], progress);
      const pixel: Pixel = [0, 0, 0, alpha];
      for (let channel = 0; channel < 3; channel++) {
        pixel[channel] = alpha ? mix(a[channel] * a[3], b[channel] * b[3], progress) / alpha : 0;
      }
      data.set(pixel, (row * pixelWidth + column) * 4);
    }
  }
  return { width: pixelWidth, height: pixelHeight, left, cssWidth: right - left, cssHeight: height, data };
}
