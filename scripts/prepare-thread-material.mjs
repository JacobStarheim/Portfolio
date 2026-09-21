import path from 'node:path';
import { readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import sharp from 'sharp';
import { ART_THREADS } from '../src/lib/art-thread.ts';

// Sample the illustration's own border pixels. There is no generated cord or
// synthetic material: the renderer interpolates these transverse line profiles.
// Run: node --experimental-strip-types scripts/prepare-thread-material.mjs
// This script only writes thread-profiles.json, never the chapter artworks.
const target = path.resolve('public/art');
const profileWidth = 128;
// Narrow mobile lines can have WebP colour fringes several times wider than the
// measured bright core. Retain that existing softness rather than clipping it.
const span = 8;
const artworks = {};
const sourceHashes = new Map();
const hash = (buffer) => createHash('sha256').update(buffer).digest('hex');
const median = (values) => {
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[middle] : Math.round((sorted[middle - 1] + sorted[middle]) / 2);
};

function backgroundMatte(pixels, width, y, center, coreWidth) {
  const distance = Math.max(4 * coreWidth, 8);
  const band = Math.max(coreWidth, 4);
  const samples = [];
  for (const sign of [-1, 1]) {
    for (let offset = 0; offset <= band; offset++) {
      const x = Math.max(0, Math.min(width - 1, Math.floor(center + sign * (distance + offset))));
      const pixelOffset = (y * width + x) * 4;
      const rgb = [...pixels.subarray(pixelOffset, pixelOffset + 3)];
      // A backdrop estimate must not contain the red line or its compression fringe.
      if (rgb[0] - Math.max(rgb[1], rgb[2]) <= 8) samples.push(rgb);
    }
  }
  if (samples.length < 4) throw new Error('Insufficient clean backdrop samples beside the illustrated line');
  return [0, 1, 2].map((channel) => median(samples.map((pixel) => pixel[channel])));
}

for (const [name, resolutions] of Object.entries(ART_THREADS)) {
  artworks[name] = {};
  for (const [variant, edges] of Object.entries(resolutions)) {
    const filename = `${name}${variant === 'small' ? '-640' : ''}.webp`;
    const sourcePath = path.join(target, filename);
    const source = await readFile(sourcePath);
    sourceHashes.set(sourcePath, hash(source));
    const { data: pixels, info: size } = await sharp(source).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
    const result = {};
    for (const [edgeName, edge] of Object.entries(edges)) {
      if (!edge) { result[edgeName] = null; continue; }
      const coreWidth = edge.width / 1000 * size.width;
      const y = edgeName === 'top' ? 0 : size.height - 1;
      const center = edge.x / 1000 * size.width;
      const row = [];
      for (let index = 0; index < profileWidth; index++) {
        const x = center + ((index + .5) / profileWidth - .5) * coreWidth * span - .5;
        const a = Math.max(0, Math.min(size.width - 1, Math.floor(x)));
        const b = Math.min(size.width - 1, a + 1);
        const blend = Math.max(0, Math.min(1, x - a));
        for (let channel = 0; channel < 3; channel++) row.push(Math.round(pixels[(y * size.width + a) * 4 + channel] * (1 - blend) + pixels[(y * size.width + b) * 4 + channel] * blend));
        row.push(255);
      }
      result[edgeName] = { rows: [row], matte: backgroundMatte(pixels, size.width, y, center, coreWidth) };
    }
    artworks[name][variant] = result;
  }
}
for (const [sourcePath, expectedHash] of sourceHashes) {
  if (hash(await readFile(sourcePath)) !== expectedHash) throw new Error(`Source artwork changed during preparation: ${sourcePath}`);
}
await writeFile(path.join(target, 'thread-profiles.json'), JSON.stringify({ version: 2, profileWidth, span, artworks }) + '\n');
console.log(JSON.stringify({ profiles: 'public/art/thread-profiles.json', artworks: Object.keys(artworks).length, sourceFilesUnchanged: sourceHashes.size, profileWidth, span }));
