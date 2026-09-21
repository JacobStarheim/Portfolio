import assert from "node:assert/strict";
import test from "node:test";
import { ART_THREADS, artThreadStyle, createThreadGeometry, getArtThread } from "../src/lib/art-thread.ts";

const from = { x: 230, width: 13, color: "#98613a", slope: 0.44 };
const to = { x: 765, width: 41, color: "#bc794a", slope: -0.35 };
const close = (actual, expected, tolerance = 1e-9) => {
  assert.ok(Math.abs(actual - expected) <= tolerance, `${actual} should be within ${tolerance} of ${expected}`);
};

function pathPoints(path) {
  assert.match(path, /^M\s*[-\d.]/);
  assert.match(path, /Z\s*$/i);
  assert.doesNotMatch(path, /NaN|Infinity|undefined/);
  const tokens = path.match(/[MLZ]|[-+]?(?:\d*\.\d+|\d+\.?\d*)(?:e[-+]?\d+)?/gi);
  const points = [];
  for (let index = 0; index < tokens.length;) {
    const command = tokens[index++].toUpperCase();
    if (command === "Z") {
      assert.equal(index, tokens.length);
      break;
    }
    assert.ok(command === "M" || command === "L");
    const x = Number(tokens[index++]);
    const y = Number(tokens[index++]);
    assert.ok(Number.isFinite(x) && Number.isFinite(y));
    points.push({ x, y });
  }
  assert.ok(points.length >= 4);
  return points;
}

function ribbonRows(path) {
  const rows = new Map();
  for (const point of pathPoints(path)) {
    const row = rows.get(point.y) ?? [];
    row.push(point.x);
    rows.set(point.y, row);
  }
  return [...rows].sort(([a], [b]) => a - b).map(([y, xs]) => ({
    y,
    left: Math.min(...xs),
    right: Math.max(...xs),
    width: Math.max(...xs) - Math.min(...xs),
  }));
}

test("anchors both endpoints to measured border positions at the actual rendered width", () => {
  for (const [width, height] of [[320, 120], [768, 240], [1200, 600]]) {
    const geometry = createThreadGeometry(from, to, { width, height });
    assert.deepEqual(geometry.start, { x: 0.23 * width, y: 0 });
    assert.deepEqual(geometry.end, { x: 0.765 * width, y: height });
    assert.deepEqual(geometry.centerline[0], geometry.start);
    assert.deepEqual(geometry.centerline.at(-1), geometry.end);
    close(geometry.startWidth, 0.013 * width);
    close(geometry.endWidth, 0.041 * width);
  }
});

test("joins retain the measured downward-positive pixel tangents", () => {
  for (const [width, height] of [[320, 120], [1200, 600]]) {
    const geometry = createThreadGeometry(from, to, { width, height });
    assert.ok(geometry.control1.y > geometry.start.y);
    assert.ok(geometry.control2.y < geometry.end.y);
    close((geometry.control1.x - geometry.start.x) / (geometry.control1.y - geometry.start.y), from.slope);
    close((geometry.end.x - geometry.control2.x) / (geometry.end.y - geometry.control2.y), to.slope);
  }
});

test("a vertical starting join changes only the starting tangent contract", () => {
  const geometry = createThreadGeometry(from, to, { width: 640, height: 240, startVertical: true });
  close(geometry.control1.x, geometry.start.x);
  assert.ok(geometry.control1.y > geometry.start.y);
  close((geometry.end.x - geometry.control2.x) / (geometry.end.y - geometry.control2.y), to.slope);
  close(geometry.start.x, 147.2);
  close(geometry.end.x, 489.6);
});

test("the filled ribbon has centered horizontal caps with the measured border widths", () => {
  const geometry = createThreadGeometry(from, to, { width: 800, height: 260 });
  const rows = ribbonRows(geometry.path);
  const top = rows[0];
  const bottom = rows.at(-1);
  close(top.y, 0);
  close(bottom.y, 260);
  close(top.width, 10.4, 0.002);
  close(bottom.width, 32.8, 0.002);
  close((top.left + top.right) / 2, 184, 0.002);
  close((bottom.left + bottom.right) / 2, 612, 0.002);
  assert.ok(rows.every(({ width }) => width > 0));
});

test("thickness tapers smoothly without a width step or a sharp change at either join", () => {
  const geometry = createThreadGeometry(
    { ...from, x: 500, width: 10, slope: 0 },
    { ...to, x: 500, width: 90, slope: 0 },
    { width: 1000, height: 600 },
  );
  const rows = ribbonRows(geometry.path);
  assert.ok(rows.length >= 8, "the ribbon needs enough samples to describe its taper");
  const first = rows[0];
  const second = rows[1];
  const penultimate = rows.at(-2);
  const last = rows.at(-1);
  const wholeSlope = (last.width - first.width) / (last.y - first.y);
  const startSlope = (second.width - first.width) / (second.y - first.y);
  const endSlope = (last.width - penultimate.width) / (last.y - penultimate.y);
  assert.ok(Math.abs(startSlope) < wholeSlope / 3, "the taper should flatten toward the top border");
  assert.ok(Math.abs(endSlope) < wholeSlope / 3, "the taper should flatten toward the bottom border");
  for (let index = 1; index < rows.length; index += 1) {
    assert.ok(rows[index].width >= rows[index - 1].width - 0.002);
    close((rows[index].left + rows[index].right) / 2, 500, 0.002);
  }
});

test("minimum thickness prevents subpixel disappearance without moving the endpoints", () => {
  const thin = { ...from, width: 0.5 };
  const geometry = createThreadGeometry(thin, to, { width: 320, height: 160, minimumWidth: 2 });
  close(geometry.startWidth, 2);
  close(geometry.endWidth, 13.12);
  const rows = ribbonRows(geometry.path);
  close(rows[0].width, 2, 0.002);
  close((rows[0].left + rows[0].right) / 2, 73.6, 0.002);
  close(createThreadGeometry(thin, thin, { width: 320, height: 160 }).startWidth, 1);
});

test("centerlines move downward and remain finite across narrow, wide and steep joins", () => {
  for (const [width, height] of [[1, 1], [320, 28], [1600, 800]]) {
    for (const [startSlope, endSlope] of [[0, 0], [-12, 12], [12, -12], [0.44, -0.35]]) {
      const geometry = createThreadGeometry(
        { ...from, slope: startSlope },
        { ...to, slope: endSlope },
        { width, height },
      );
      assert.ok(geometry.centerline.length > 2);
      for (let index = 0; index < geometry.centerline.length; index += 1) {
        const point = geometry.centerline[index];
        assert.ok(Number.isFinite(point.x) && Number.isFinite(point.y));
        assert.ok(point.y >= 0 && point.y <= height);
        if (index > 0) assert.ok(point.y > geometry.centerline[index - 1].y);
      }
      pathPoints(geometry.path);
    }
  }
});

test("invalid rendered dimensions are rejected before generating SVG geometry", () => {
  for (const invalid of [0, -1, NaN, Infinity, -Infinity]) {
    assert.throws(() => createThreadGeometry(from, to, { width: invalid, height: 240 }));
    assert.throws(() => createThreadGeometry(from, to, { width: 640, height: invalid }));
  }
});

test("all artwork has valid large and small measurements and About ends the thread", () => {
  const names = ["nimmo", "traveller", "driver", "education", "in5320", "hobbies", "bfme", "podcast", "chess", "about"];
  assert.deepEqual(Object.keys(ART_THREADS).sort(), [...names].sort());
  for (const name of names) {
    const large = getArtThread(name);
    const small = getArtThread(name, true);
    assert.deepEqual(large, ART_THREADS[name].large);
    assert.deepEqual(small, ART_THREADS[name].small);
    assert.notDeepEqual(small, large, `${name} should use measurements from its own responsive asset`);
    for (const variant of [large, small]) {
      assert.ok(variant.top);
      if (name === "about") assert.equal(variant.bottom, null);
      else assert.ok(variant.bottom);
      for (const edge of [variant.top, variant.bottom].filter(Boolean)) {
        assert.ok(Number.isFinite(edge.x) && edge.x >= 0 && edge.x <= 1000);
        assert.ok(Number.isFinite(edge.width) && edge.width > 0 && edge.width <= 1000);
        assert.ok(Number.isFinite(edge.slope));
        assert.equal(typeof edge.color, "string");
        assert.ok(edge.color.length > 0);
      }
    }
  }
});

test("CSS continuations use each asset's outgoing bottom border and responsive measurements", () => {
  for (const name of Object.keys(ART_THREADS)) {
    const style = artThreadStyle(name);
    if (name === "about") {
      assert.deepEqual(style, {}, "the final artwork has no outgoing continuation");
      continue;
    }
    for (const [small, suffix] of [[false, ""], [true, "-small"]]) {
      const edge = getArtThread(name, small).bottom;
      assert.equal(style[`--thread-end${suffix}`], `${edge.x / 10}%`);
      assert.equal(style[`--thread-width${suffix}`], `${edge.width / 10}%`);
      assert.equal(style[`--thread-color${suffix}`], edge.color);
    }
  }
});

test("unknown artwork names cannot silently fall back to unrelated measurements", () => {
  for (const name of ["missing", "", "constructor", "__proto__"]) {
    assert.throws(() => getArtThread(name));
    assert.throws(() => getArtThread(name, true));
    assert.throws(() => artThreadStyle(name));
  }
});
