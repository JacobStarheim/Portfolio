import path from 'node:path';
import { mkdir, readFile } from 'node:fs/promises';
import sharp from 'sharp';

// Package only the tiny image-generated entry correction. Preserve the existing
// decoded artwork everywhere else, including its complete outgoing edge.
// Never draw a replacement line or use a newly generated full scene here.
const [generatedPath, baselineDirectory, outputDirectory] = process.argv.slice(2);
if (!generatedPath || !baselineDirectory || !outputDirectory) {
  throw new Error('Usage: node scripts/prepare-driver-entry.mjs generated.png original-art-directory new-output-directory');
}
if (path.resolve(baselineDirectory) === path.resolve(outputDirectory)) throw new Error('Use a separate output directory to preserve the originals.');
await mkdir(outputDirectory, { recursive: true });
const generated = await readFile(generatedPath);
const smooth = value => { const t = Math.max(0, Math.min(1, value)); return t * t * (3 - 2 * t); };

function strandRange(data, width, y, expected) {
  const red = [];
  const radius = Math.max(5, 8 * width / 1254);
  for (let x = Math.floor(expected - radius); x <= Math.ceil(expected + radius); x++) {
    const i = (y * width + x) * 4, r = data[i], g = data[i + 1], b = data[i + 2];
    if (r > 60 && r >= g * 1.4 && r >= b * 1.4) red.push(x);
  }
  if (!red.length) throw new Error(`No source strand at y=${y}`);
  return [red[0], red.at(-1)];
}

for (const filename of ['driver.webp', 'driver-640.webp']) {
  const original = await sharp(path.join(baselineDirectory, filename)).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width, height } = original.info;
  const edit = await sharp(generated).resize(width, height).ensureAlpha().raw().toBuffer();
  const data = Buffer.from(original.data);
  const factor = width / 1254, end = Math.ceil(200 * factor), fadeStart = 120 * factor, fringe = 4 * factor;
  let changed = 0;
  let oldCenter = width * .499, newCenter = width * .499;
  const bounds = { left: width, right: 0, bottom: 0 };
  for (let y = 0; y < end; y++) {
    const a = strandRange(original.data, width, y, oldCenter), b = strandRange(edit, width, y, newCenter);
    oldCenter = (a[0] + a[1]) / 2; newCenter = (b[0] + b[1]) / 2;
    const left = Math.min(a[0], b[0]), right = Math.max(a[1], b[1]);
    if (right - left > 25 * factor) throw new Error(`Generated strand moved too far at ${filename}:${y}`);
    const vertical = 1 - smooth((y - fadeStart) / (end - fadeStart));
    for (let x = Math.max(0, Math.floor(left - fringe)); x <= Math.min(width - 1, Math.ceil(right + fringe)); x++) {
      const distance = Math.max(left - x, x - right, 0);
      const weight = vertical * (1 - smooth(distance / fringe));
      const i = (y * width + x) * 4;
      for (let channel = 0; channel < 3; channel++) data[i + channel] = Math.round(original.data[i + channel] * (1 - weight) + edit[i + channel] * weight);
      if (data[i] !== original.data[i] || data[i + 1] !== original.data[i + 1] || data[i + 2] !== original.data[i + 2]) {
        changed++; bounds.left = Math.min(bounds.left, x); bounds.right = Math.max(bounds.right, x); bounds.bottom = y;
      }
    }
  }
  // Lossless output prevents re-encoding from changing any unrelated source pixels.
  const destination = path.join(outputDirectory, filename);
  await sharp(data, { raw: { width, height, channels: 4 } }).webp({ lossless: true, effort: 6 }).toFile(destination);
  const verified = await sharp(destination).ensureAlpha().raw().toBuffer();
  if (!verified.equals(data) || !verified.subarray(end * width * 4).equals(original.data.subarray(end * width * 4))) {
    throw new Error('The packaged edit changed pixels outside its entry region.');
  }
  console.log(JSON.stringify({ filename, width, height, changedPixels: changed, changedPercent: +(changed / (width * height) * 100).toFixed(3), bounds, allOtherPixelsUnchanged: true }));
}
