import path from 'node:path';
import { mkdir } from 'node:fs/promises';
import sharp from 'sharp';

const source = process.argv[2];
if (!source) throw new Error('Usage: node scripts/prepare-art.mjs /absolute/path/to/source-art');
const target = path.resolve('public/art');
await mkdir(target, { recursive: true });
for (const name of ['nimmo', 'education', 'bfme', 'podcast', 'chess', 'about']) {
  for (const width of [1254, 640]) {
    const filename = `${name}${width === 640 ? '-640' : ''}.webp`;
    const result = await sharp(path.join(source, `${name}.png`))
      .resize({ width, withoutEnlargement: true })
      .webp({ quality: 88, effort: 6 })
      .toFile(path.join(target, filename));
    console.log(`${filename}: ${result.width} × ${result.height}, ${Math.round(result.size / 1024)} KB`);
  }
}
