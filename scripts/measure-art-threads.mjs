#!/usr/bin/env node
// Read-only raster measurements. No resize, crop, image generation, or file writes.
import path from 'node:path';
import sharp from 'sharp';

const usage = `Usage: node scripts/measure-art-threads.mjs [--rows=12] [--edges=top,bottom] image.png [image.webp ...]
Measures actual raster-edge red threads; emits JSON. Missing requested edges exit 1.
The bottom of files named about (including about-640) is optional.
Coordinates use pixel centers and a 0–1000 image box; slope dx/dy uses downward y.
Thickness is the visible red threshold span, not an inferred original brush size.`;
const args = process.argv.slice(2);
if (args.includes('--help')) {
  console.log(usage);
  process.exit(0);
}
let rowCount = 12;
let edges = ['top', 'bottom'];
const files = [];
for (const arg of args) {
  if (arg.startsWith('--rows=')) rowCount = Number(arg.slice(7));
  else if (arg.startsWith('--edges=')) edges = [...new Set(arg.slice(8).split(','))];
  else if (arg.startsWith('--')) throw new Error(`Unknown option: ${arg}\n${usage}`);
  else files.push(arg);
}
if (!files.length || !Number.isInteger(rowCount) || rowCount < 3 || rowCount > 100
  || edges.some((edge) => !['top', 'bottom'].includes(edge))) {
  throw new Error(usage);
}

const round = (value, places = 4) => Number(value.toFixed(places));
const median = (values) => {
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2;
};

function fitLine(samples) {
  const meanY = samples.reduce((sum, sample) => sum + sample.y, 0) / samples.length;
  const meanX = samples.reduce((sum, sample) => sum + sample.x, 0) / samples.length;
  const variance = samples.reduce((sum, sample) => sum + (sample.y - meanY) ** 2, 0);
  const slope = variance ? samples.reduce((sum, sample) => sum
    + (sample.y - meanY) * (sample.x - meanX), 0) / variance : 0;
  const intercept = meanX - slope * meanY;
  const rms = Math.sqrt(samples.reduce((sum, sample) => sum
    + (sample.x - (intercept + slope * sample.y)) ** 2, 0) / samples.length);
  return { slope, intercept, rms };
}

// Each run is contiguous red ink; isolated distant texture cannot skew its centroid.
function redRuns(data, width, y) {
  const runs = [];
  let pixels = [];
  const finish = () => {
    if (!pixels.length) return;
    const weight = pixels.reduce((sum, pixel) => sum + pixel.weight, 0);
    const x = pixels.reduce((sum, pixel) => sum + (pixel.x + 0.5) * pixel.weight, 0) / weight;
    const maxWeight = Math.max(...pixels.map((pixel) => pixel.weight));
    const core = pixels.filter((pixel) => pixel.weight >= maxWeight * 0.75);
    const rgb = [0, 1, 2].map((channel) => Math.round(median(core.map((pixel) => pixel.rgb[channel]))));
    runs.push({ x, y: y + 0.5, minX: pixels[0].x, maxX: pixels.at(-1).x,
      thickness: pixels.at(-1).x - pixels[0].x + 1, rgb, weight,
      redExcess: weight / pixels.length });
    pixels = [];
  };
  for (let x = 0; x < width; x++) {
    const offset = (y * width + x) * 4;
    const r = data[offset];
    const g = data[offset + 1];
    const b = data[offset + 2];
    const alpha = data[offset + 3] / 255;
    if (alpha >= 0.5 && r > 60 && r >= g * 1.4 && r >= b * 1.4) {
      pixels.push({ x, rgb: [r, g, b], weight: (r - Math.max(g, b)) * alpha });
    } else finish();
  }
  finish();
  return runs;
}

function measureEdge(data, width, height, edge) {
  const totalRows = Math.min(height, rowCount);
  const rows = Array.from({ length: totalRows }, (_, depth) => redRuns(data, width,
    edge === 'top' ? depth : height - depth - 1));
  if (!rows[0].length) return null;
  // Start at the exact edge. Follow each candidate inward and rank persistence first.
  const tracks = rows[0].map((first) => {
    const samples = [first];
    for (let depth = 1; depth < totalRows; depth++) {
      const previous = samples.at(-1);
      const previousFit = fitLine(samples);
      const predicted = previous.x + Math.max(-2, Math.min(2, previousFit.slope))
        * (edge === 'top' ? 1 : -1);
      const gate = Math.max(5, Math.min(width * 0.025, previous.thickness * 1.5));
      const candidates = rows[depth].filter((run) => Math.abs(run.x - predicted) <= gate
        && run.thickness <= Math.max(width * 0.1, first.thickness * 4));
      candidates.sort((a, b) => Math.abs(a.x - predicted) - Math.abs(b.x - predicted));
      if (!candidates.length) break;
      samples.push(candidates[0]);
    }
    return { samples, score: samples.length * 1000 + Math.min(999,
      samples.reduce((sum, sample) => sum + sample.redExcess, 0) / samples.length) };
  }).sort((a, b) => b.score - a.score);
  const samples = tracks[0].samples;
  // A single border speck is not a credible outgoing thread.
  if (samples.length < Math.min(3, totalRows)) return null;
  const firstFit = fitLine(samples);
  const residuals = samples.map((sample) => sample.x - firstFit.intercept - firstFit.slope * sample.y);
  const residualMedian = median(residuals);
  const mad = median(residuals.map((residual) => Math.abs(residual - residualMedian)));
  const inliers = samples.filter((_, index) => Math.abs(residuals[index] - residualMedian)
    <= Math.max(0.75, mad * 4.45));
  const fit = fitLine(inliers.length >= 3 ? inliers : samples);
  const border = samples[0];
  const widths = samples.map((sample) => sample.thickness);
  const medianWidth = median(widths);
  const coverage = samples.length / totalRows;
  const competingTrack = tracks[1]?.samples.length >= samples.length * 0.75;
  const confidence = Math.max(0, Math.min(1, coverage * (1 / (1 + fit.rms / 2))
    * (competingTrack ? 0.65 : 1)));
  const warnings = [];
  if (coverage < 1) warnings.push(`Thread followed for ${samples.length}/${totalRows} rows.`);
  if (competingTrack) warnings.push('Multiple persistent red components touch this edge; inspect candidates.');
  if (Math.max(...widths) > border.thickness * 2.5) {
    warnings.push('Thread widens substantially inward; use border thickness at the join.');
  }
  if (fit.rms > 1) warnings.push('Centroid is not well approximated by a straight tangent over the sampled rows.');
  return {
    x: round(border.x / width * 1000),
    y: edge === 'top' ? 0 : 1000,
    xPx: round(border.x),
    thicknessPx: border.thickness,
    thickness: round(border.thickness / width * 1000),
    perpendicularThicknessPx: round(border.thickness / Math.sqrt(1 + fit.slope ** 2)),
    rgb: border.rgb,
    color: `#${border.rgb.map((value) => value.toString(16).padStart(2, '0')).join('')}`,
    slopeDxDy: round(fit.slope),
    normalizedSlopeDxDy: round(fit.slope * height / width),
    fitRmsPx: round(fit.rms),
    medianInteriorThicknessPx: medianWidth,
    confidence: round(confidence),
    warnings,
    samples: samples.map((sample) => ({
      xPx: round(sample.x), yPx: sample.y, minX: sample.minX, maxX: sample.maxX,
      thicknessPx: sample.thickness, rgb: sample.rgb,
    })),
    ...(competingTrack ? { alternatives: tracks.slice(1).map((track) => ({
      x: round(track.samples[0].x / width * 1000), followedRows: track.samples.length,
    })) } : {}),
  };
}

const measurements = [];
const errors = [];
for (const file of files) {
  try {
    const { data, info } = await sharp(file, { limitInputPixels: 64_000_000 })
      .toColourspace('srgb').ensureAlpha().raw().toBuffer({ resolveWithObject: true });
    const result = { file, width: info.width, height: info.height };
    for (const edge of edges) {
      result[edge] = measureEdge(data, info.width, info.height, edge);
      const optional = edge === 'bottom' && /^about(?:[-_.]|$)/i.test(path.parse(file).name);
      if (!result[edge] && !optional) errors.push(`${file}: no persistent red thread touches the ${edge} raster edge.`);
    }
    measurements.push(result);
  } catch (error) {
    errors.push(`${file}: ${error.message}`);
  }
}
console.log(JSON.stringify({ units: { position: '0–1000 image box', thickness: '0–1000 image width',
  slopeDxDy: 'pixel dx / pixel dy, positive y down', color: 'sRGB of strongest edge pixels' },
  threshold: { minimumRed: 60, redToGreenAndBlueRatio: 1.4, minimumAlpha: 0.5 },
  sampledRows: rowCount, measurements, errors }, null, 2));
if (errors.length) {
  console.error(errors.join('\n'));
  process.exitCode = 1;
}
