import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";
import sharp from "sharp";
import { createThreadGeometry, getArtThread } from "../src/lib/art-thread.ts";
import {
  calibrateThreadPixel, prepareThreadMaterial, prepareThreadProfile, rasterizeThread,
  reflectedTextureRow, threadAlpha, threadScanlines,
} from "../src/lib/thread-material.ts";

const profiles = JSON.parse(fs.readFileSync(new URL("../public/art/thread-profiles.json", import.meta.url), "utf8"));
const source = await sharp(new URL("../public/art/thread-material.webp", import.meta.url).pathname)
  .ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const material = prepareThreadMaterial({ ...source.info, data: source.data });

test("soft red-chroma key removes the matte without a hard mask at fibre edges", () => {
  assert.equal(threadAlpha(15, 33, 34), 0);
  assert.equal(threadAlpha(110, 110, 110), 0);
  assert.equal(threadAlpha(210, 51, 44), 1);
  assert.equal(threadAlpha(52, 14, 14), 1, "the dark red side of the cord remains visible");
  assert.ok(threadAlpha(43, 30, 30) > 0 && threadAlpha(43, 30, 30) < 1);
});

test("generated material has a keyed cord on every row, with real transverse variation", () => {
  assert.equal(material.width, 96);
  assert.ok(material.height > 1000);
  assert.ok(material.widths.every((width) => width > 0 && width < material.width));
  assert.ok(material.centers.every((center) => center > 0 && center < material.width));
  assert.equal(material.data[3], 0, "the corner background must become transparent");
  const centerRow = Math.floor(material.height / 2);
  const reds = [];
  for (let x = 0; x < material.width; x++) {
    const offset = (centerRow * material.width + x) * 4;
    if (material.data[offset + 3] > 200) reds.push(Math.round(material.data[offset]));
  }
  assert.ok(new Set(reds).size > 12, "the generated shadow/fibre/highlight detail must survive keying");
});

test("colour matching does not amplify fibre highlights into ivory or green stripes", () => {
  const sourceMean = [173, 31, 30, 255];
  const targetMean = [210, 76, 65, 255];
  assert.deepEqual(calibrateThreadPixel(sourceMean, sourceMean, targetMean), targetMean);
  const highlight = calibrateThreadPixel([240, 100, 92, 200], sourceMean, targetMean);
  assert.equal(highlight[3], 200);
  assert.ok(highlight[1] < 145 && highlight[2] < 125, "pale source channels must not be independently multiplied by 2–3");
  assert.ok(highlight[0] > highlight[1] * 1.7, "the lit fibre remains unmistakably red");
  const a = calibrateThreadPixel([180, 40, 40, 255], sourceMean, targetMean);
  const b = calibrateThreadPixel([190, 50, 50, 255], sourceMean, targetMean);
  assert.ok(Math.abs((b[0] - a[0]) - (b[1] - a[1])) < 1e-9, "all channels share one contrast gain");
});

test("all real edge profiles key safely, including darker responsive WebP edges", () => {
  for (const [name, variants] of Object.entries(profiles.artworks)) {
    for (const [size, edges] of Object.entries(variants)) {
      for (const [edge, profile] of Object.entries(edges)) {
        if (!profile) continue;
        const prepared = prepareThreadProfile(profile, profiles);
        assert.equal(prepared.width, 32);
        assert.equal(prepared.height, 8);
        assert.ok([...prepared.data].every(Number.isFinite), `${name}/${size}/${edge}`);
        assert.ok(prepared.data.some((value, index) => index % 4 === 3 && value > 40), `${name}/${size}/${edge} is visible`);
      }
    }
  }
});

test("scanlines preserve endpoints, measured widths and arc-length texture density", () => {
  const from = getArtThread("traveller").bottom;
  const to = getArtThread("driver").top;
  const geometry = createThreadGeometry(from, to, { width: 1200, height: 110, minimumWidth: 0 });
  const rows = threadScanlines(geometry, 400);
  assert.deepEqual({ x: rows[0].x, y: rows[0].y }, geometry.start);
  assert.deepEqual({ x: rows.at(-1).x, y: rows.at(-1).y }, geometry.end);
  assert.equal(rows[0].width, geometry.startWidth);
  assert.equal(rows.at(-1).width, geometry.endWidth);
  for (let index = 1; index < rows.length; index++) {
    assert.ok(rows[index].y > rows[index - 1].y);
    assert.ok(rows[index].arc > rows[index - 1].arc);
    assert.ok(rows[index].textureDistance > rows[index - 1].textureDistance);
  }
  assert.ok(rows.at(-1).arc >= 110);
});

test("long continuations repeat material without a discontinuous end-to-start texture seam", () => {
  assert.equal(reflectedTextureRow(0, 100), 0);
  assert.equal(reflectedTextureRow(99, 100), 99);
  assert.equal(reflectedTextureRow(100, 100), 98);
  assert.equal(reflectedTextureRow(198, 100), 0);
  assert.equal(reflectedTextureRow(199, 100), 1);
  assert.equal(reflectedTextureRow(-1, 100), 1);
});

test("real joins render into narrow transparent canvases instead of filled ribbons", () => {
  for (const small of [false, true]) {
    const variant = small ? "small" : "large";
    const width = small ? 340 : 1200;
    const geometry = createThreadGeometry(getArtThread("traveller", small).bottom, getArtThread("driver", small).top, {
      width, height: 110, minimumWidth: 0,
    });
    const raster = rasterizeThread(material, geometry, {
      from: prepareThreadProfile(profiles.artworks.traveller[variant].bottom, profiles),
      to: prepareThreadProfile(profiles.artworks.driver[variant].top, profiles),
      scale: 3,
    });
    assert.ok(raster.cssWidth < width / 10);
    assert.equal(raster.data.length, raster.width * raster.height * 4);
    assert.ok(raster.data.some((value, index) => index % 4 === 3 && value > 200));
    assert.ok(raster.data.some((value, index) => index % 4 === 3 && value > 0 && value < 255), "soft fibre coverage survives");
    for (let row = 0; row < raster.height; row++) {
      assert.equal(raster.data[(row * raster.width) * 4 + 3], 0);
      assert.equal(raster.data[(row * raster.width + raster.width - 1) * 4 + 3], 0);
    }
  }
});

test("the exact edge profiles, not a mean RGB, supply both seam rows", () => {
  const profile = (rgb) => ({ width: 8, height: 1, span: 1.8, mean: [...rgb, 255], data: new Uint8Array(Array(8).fill([...rgb, 255]).flat()) });
  const from = profile([211, 61, 43]);
  const to = profile([109, 28, 23]);
  const raster = rasterizeThread(material, { centerline: [{ x: 10, y: 0 }, { x: 10, y: 100 }], startWidth: 4, endWidth: 4 }, { from, to });
  for (const [row, rgb] of [[0, [211, 61, 43]], [raster.height - 1, [109, 28, 23]]]) {
    const offset = (row * raster.width + Math.floor(raster.width / 2)) * 4;
    assert.deepEqual([...raster.data.slice(offset, offset + 4)], [...rgb, 255]);
  }
});

test("malformed dimensions are rejected before allocating a canvas", () => {
  assert.throws(() => prepareThreadMaterial({ width: 4, height: 4, data: [] }));
  assert.throws(() => prepareThreadProfile({ rows: [[1, 2, 3]] }, profiles));
  assert.throws(() => threadScanlines({ centerline: [{ x: 0, y: 0 }, { x: 0, y: -1 }], startWidth: 1, endWidth: 1 }, 5));
});
