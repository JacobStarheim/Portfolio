import path from 'node:path';
import { writeFile } from 'node:fs/promises';
import sharp from 'sharp';
import { ART_THREADS } from '../src/lib/art-thread.ts';

// Mechanical asset preparation only: retain the generated cord pixels and sample
// small raster collars for the browser renderer. Never modifies chapter artworks.
const source = process.argv[2];
if (!source) throw new Error('Usage: node --experimental-strip-types scripts/prepare-thread-material.mjs /path/to/generated-cord.png');
const target = path.resolve('public/art');
const material = sharp(source);
const { data, info } = await material.clone().ensureAlpha().raw().toBuffer({ resolveWithObject: true });
let minX = info.width;
let maxX = 0;
for (let y = 0; y < info.height; y++) {
  for (let x = 0; x < info.width; x++) {
    const offset = (y * info.width + x) * 4;
    if (data[offset] - Math.max(data[offset + 1], data[offset + 2]) > 35) {
      minX = Math.min(minX, x);
      maxX = Math.max(maxX, x);
    }
  }
}
if (minX > maxX) throw new Error('No red cord detected in generated material');
const left = Math.max(0, minX - 16);
const cropWidth = Math.min(info.width, maxX + 17) - left;
await material.extract({ left, top: 0, width: cropWidth, height: info.height })
  .webp({ lossless: true }).toFile(path.join(target, 'thread-material.webp'));

const profileWidth = 32;
const span = 1.8;
const artworks = {};
for (const [name, resolutions] of Object.entries(ART_THREADS)) {
  artworks[name] = {};
  for (const [variant, edges] of Object.entries(resolutions)) {
    const filename = `${name}${variant === 'small' ? '-640' : ''}.webp`;
    const { data: pixels, info: size } = await sharp(path.join(target, filename)).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
    const result = {};
    for (const [edgeName, edge] of Object.entries(edges)) {
      if (!edge) { result[edgeName] = null; continue; }
      const coreWidth = edge.width / 1000 * size.width;
      const rows = [];
      for (let depth = 0; depth < 8; depth++) {
        const y = edgeName === 'top' ? depth : size.height - 1 - depth;
        const predicted = edge.x / 1000 * size.width + edge.slope * (edgeName === 'top' ? depth : -depth);
        // Track the fine thread instead of pulling background texture into its lane.
        let total = 0;
        let weightedX = 0;
        for (let x = Math.max(0, Math.floor(predicted - coreWidth)); x <= Math.min(size.width - 1, Math.ceil(predicted + coreWidth)); x++) {
          const offset = (y * size.width + x) * 4;
          const excess = Math.max(0, pixels[offset] - Math.max(pixels[offset + 1], pixels[offset + 2]) - 15);
          total += excess;
          weightedX += (x + .5) * excess;
        }
        // Preserve exact measured endpoint center at depth zero.
        const center = depth === 0 || total === 0 ? predicted : weightedX / total;
        const row = [];
        for (let index = 0; index < profileWidth; index++) {
          const x = center + ((index + .5) / profileWidth - .5) * coreWidth * span - .5;
          const a = Math.max(0, Math.min(size.width - 1, Math.floor(x)));
          const b = Math.min(size.width - 1, a + 1);
          const mix = Math.max(0, Math.min(1, x - a));
          for (let channel = 0; channel < 3; channel++) row.push(Math.round(pixels[(y * size.width + a) * 4 + channel] * (1 - mix) + pixels[(y * size.width + b) * 4 + channel] * mix));
          row.push(255);
        }
        rows.push(row);
      }
      result[edgeName] = { rows };
    }
    artworks[name][variant] = result;
  }
}
await writeFile(path.join(target, 'thread-profiles.json'), JSON.stringify({ version: 1, profileWidth, span, artworks }) + '\n');
console.log(JSON.stringify({ material: `public/art/thread-material.webp`, crop: { left, width: cropWidth, height: info.height }, profiles: 'public/art/thread-profiles.json', artworks: Object.keys(artworks).length }));
