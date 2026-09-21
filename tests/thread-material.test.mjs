import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";
import { createThreadGeometry, getArtThread } from "../src/lib/art-thread.ts";
import { prepareThreadProfile, rasterizeThread, threadAlpha, threadScanlines } from "../src/lib/thread-material.ts";

const profiles = JSON.parse(fs.readFileSync(new URL("../public/art/thread-profiles.json", import.meta.url), "utf8"));

test("soft red key retains the source stroke and removes neutral paper", () => {
  assert.equal(threadAlpha(15, 33, 34), 0);
  assert.equal(threadAlpha(110, 110, 110), 0);
  assert.equal(threadAlpha(210, 51, 44), 1);
  assert.equal(threadAlpha(52, 14, 14), 1);
  assert.ok(threadAlpha(43, 30, 30) > 0 && threadAlpha(43, 30, 30) < 1);
});

test("all source border profiles are finite and retain the red stroke", () => {
  for (const [name, variants] of Object.entries(profiles.artworks)) {
    for (const [size, edges] of Object.entries(variants)) {
      for (const [edge, profile] of Object.entries(edges)) {
        if (!profile) continue;
        const prepared = prepareThreadProfile(profile, profiles);
        assert.equal(prepared.width, profiles.profileWidth);
        assert.equal(prepared.height, profile.rows.length);
        assert.ok([...prepared.data].every(Number.isFinite), name + "/" + size + "/" + edge);
        assert.ok(prepared.data.some((value, index) => index % 4 === 3 && value > 40));
      }
    }
  }
});

test("every prepared source profile contains one connected stroke, not isolated paper flecks", () => {
  for (const [name, variants] of Object.entries(profiles.artworks)) {
    for (const [size, edges] of Object.entries(variants)) {
      for (const [edge, profile] of Object.entries(edges)) {
        if (!profile) continue;
        const prepared = prepareThreadProfile(profile, profiles);
        for (let row = 0; row < prepared.height; row++) {
          let runs = 0, previous = false;
          for (let column = 0; column < prepared.width; column++) {
            const visible = prepared.data[(row * prepared.width + column) * 4 + 3] > 0;
            if (visible && !previous) runs++;
            previous = visible;
          }
          assert.equal(runs, 1, `${name}/${size}/${edge}/${row}`);
        }
      }
    }
  }
});

test("disconnected chess and podcast background samples cannot become parallel stripes", () => {
  for (const [name, removed, retained] of [
    ["chess", [35, 40, 44], [50, 64, 77]],
    ["podcast", [120, 125, 127], [43, 64, 104]],
  ]) {
    const source = profiles.artworks[name].large.bottom;
    const prepared = prepareThreadProfile(source, profiles);
    for (const column of removed) assert.equal(prepared.data[column * 4 + 3], 0, `${name}/${column}`);
    for (const column of retained) {
      const raw = source.rows[0].slice(column * 4, column * 4 + 3);
      assert.ok(Math.abs(prepared.data[column * 4 + 3] - threadAlpha(...raw) * 255) < 0.0001,
        `${name}/${column}: preserve even the dim connected fringe`);
    }
  }
});

test("the approved education-to-IN5320 profiles retain every source alpha sample", () => {
  for (const source of [profiles.artworks.education.large.bottom, profiles.artworks.in5320.large.top]) {
    const prepared = prepareThreadProfile(source, profiles);
    for (let column = 0; column < prepared.width; column++) {
      const raw = source.rows[0].slice(column * 4, column * 4 + 3);
      const originalAlpha = threadAlpha(...raw);
      // The existing key already drops alpha below .001 during unmatting.
      const expected = originalAlpha < 0.001 ? 0 : originalAlpha * 255;
      assert.ok(Math.abs(prepared.data[column * 4 + 3] - expected) < 0.0001);
    }
  }
});

test("scanlines preserve endpoints and measured widths", () => {
  const geometry = createThreadGeometry(getArtThread("traveller").bottom, getArtThread("driver").top, { width: 1200, height: 110, minimumWidth: 0 });
  const rows = threadScanlines(geometry, 400);
  assert.deepEqual({ x: rows[0].x, y: rows[0].y }, geometry.start);
  assert.deepEqual({ x: rows.at(-1).x, y: rows.at(-1).y }, geometry.end);
  assert.equal(rows[0].width, geometry.startWidth);
  assert.equal(rows.at(-1).width, geometry.endWidth);
  for (let index = 1; index < rows.length; index++) assert.ok(rows[index].y > rows[index - 1].y);
});

test("every real transition renders a bounded transparent canvas at both resolutions", () => {
  const names = Object.keys(profiles.artworks);
  for (const small of [false, true]) for (let index = 0; index < names.length - 1; index++) {
    const a = names[index], b = names[index + 1], variant = small ? "small" : "large", width = small ? 340 : 1200;
    const geometry = createThreadGeometry(getArtThread(a, small).bottom, getArtThread(b, small).top, { width, height: 110, minimumWidth: 0 });
    const raster = rasterizeThread(geometry, {
      from: prepareThreadProfile(profiles.artworks[a][variant].bottom, profiles),
      to: prepareThreadProfile(profiles.artworks[b][variant].top, profiles), scale: 3,
    });
    assert.ok(raster.cssWidth < width / 4);
    assert.equal(raster.data.length, raster.width * raster.height * 4);
    assert.ok(raster.data.some((value, offset) => offset % 4 === 3 && value > 40));
    assert.ok(raster.data.some((value, offset) => offset % 4 === 3 && value > 0 && value < 255));
    for (let row = 0; row < raster.height; row++) {
      assert.equal(raster.data[row * raster.width * 4 + 3], 0);
      assert.equal(raster.data[(row * raster.width + raster.width - 1) * 4 + 3], 0);
    }
  }
});

const profile = (rgb) => ({ width: 8, height: 1, span: 1.8, mean: [...rgb, 255], data: new Uint8Array(Array(8).fill([...rgb, 255]).flat()) });
const straight = { centerline: [{ x: 10, y: 0 }, { x: 10, y: 100 }], startWidth: 4, endWidth: 4 };

test("the exact source cross-sections supply both seams, not an average color", () => {
  const from = profile([211, 61, 43]), to = profile([109, 28, 23]);
  const raster = rasterizeThread(straight, { from, to });
  for (const [row, rgb] of [[0, [211, 61, 43]], [raster.height - 1, [109, 28, 23]]]) {
    const offset = (row * raster.width + Math.floor(raster.width / 2)) * 4;
    assert.deepEqual([...raster.data.slice(offset, offset + 4)], [...rgb, 255]);
  }
});

test("matching source profiles continue identically without invented grain or braiding", () => {
  const from = prepareThreadProfile(profiles.artworks.education.large.bottom, profiles);
  const raster = rasterizeThread(straight, { from, to: from, scale: 3 });
  const first = raster.data.slice(0, raster.width * 4);
  for (let row = 1; row < raster.height; row++) {
    assert.deepEqual(raster.data.slice(row * raster.width * 4, (row + 1) * raster.width * 4), first);
  }
  const reds = new Set();
  for (let x = 0; x < raster.width; x++) if (first[x * 4 + 3] > 100) reds.add(first[x * 4]);
  assert.ok(reds.size > 3, "actual source shading is retained across the stroke instead of a flat fill");
});

test("inner rows cannot add frame colors or repeated texture to the continuation", () => {
  const from = profile([180, 45, 40]);
  const withFrame = { ...from, height: 2, data: [...from.data, ...profile([255, 240, 190]).data] };
  assert.deepEqual(rasterizeThread(straight, { from, to: from }).data, rasterizeThread(straight, { from: withFrame, to: withFrame }).data);
});

test("invalid profile dimensions, geometry and scale are rejected", () => {
  assert.throws(() => prepareThreadProfile({ rows: [[1, 2, 3]] }, profiles));
  assert.throws(() => threadScanlines({ centerline: [{ x: 0, y: 0 }, { x: 0, y: -1 }], startWidth: 1, endWidth: 1 }, 5));
  assert.throws(() => rasterizeThread(straight, { from: profile([180, 45, 40]), to: profile([180, 45, 40]), scale: 0 }));
});
