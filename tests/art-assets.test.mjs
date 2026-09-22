import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, renameSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { createArtRevision } from "../src/build/art-revision.ts";
import { artAssetUrl } from "../src/lib/art-assets.ts";

const fixtureAssets = [
  ["driver.webp", Buffer.from([0, 1, 2, 3])],
  ["driver-640.webp", Buffer.from([4, 5, 6, 7])],
  ["traveller.webp", Buffer.from([8, 9, 10, 11])],
  ["traveller-640.webp", Buffer.from([12, 13, 14, 15])],
  ["thread-profiles.json", '{"version":2,"profiles":{"driver":[]}}'],
];

function fixture(t, assets = fixtureAssets) {
  const directory = mkdtempSync(join(tmpdir(), "portfolio-art-revision-test-"));
  t.after(() => rmSync(directory, { recursive: true, force: true }));
  for (const [filename, bytes] of assets) writeFileSync(join(directory, filename), bytes);
  return directory;
}

test("art revisions are deterministic across directory locations and file creation order", t => {
  const first = fixture(t);
  const reversed = fixture(t, [...fixtureAssets].reverse());
  const revision = createArtRevision(first);
  assert.match(revision, /^(?:[a-f0-9]{32}|[a-f0-9]{64})$/);
  assert.equal(createArtRevision(first), revision);
  assert.equal(createArtRevision(reversed), revision);
});

test("changing either image resolution or the thread profiles invalidates the shared art revision", async t => {
  for (const filename of ["driver.webp", "driver-640.webp", "thread-profiles.json"]) {
    await t.test(filename, t => {
      const directory = fixture(t);
      const previous = createArtRevision(directory);
      writeFileSync(join(directory, filename), `new contents for ${filename}`);
      assert.notEqual(createArtRevision(directory), previous);
    });
  }
});

test("art revisions include filenames as well as their bytes", t => {
  const directory = fixture(t);
  const previous = createArtRevision(directory);
  renameSync(join(directory, "traveller.webp"), join(directory, "education.webp"));
  assert.notEqual(createArtRevision(directory), previous);
});

test("adding or removing an artwork changes the art revision", t => {
  const directory = fixture(t);
  const previous = createArtRevision(directory);
  writeFileSync(join(directory, "education.webp"), Buffer.from([16, 17, 18, 19]));
  const expanded = createArtRevision(directory);
  assert.notEqual(expanded, previous);
  rmSync(join(directory, "education.webp"));
  assert.equal(createArtRevision(directory), previous);
  rmSync(join(directory, "driver-640.webp"));
  assert.notEqual(createArtRevision(directory), previous);
});

test("unrelated documentation, JSON, and directories do not invalidate artwork", t => {
  const directory = fixture(t);
  const previous = createArtRevision(directory);
  writeFileSync(join(directory, "README.md"), "Updated image-generation notes");
  writeFileSync(join(directory, "notes.json"), '{"notes":"not served by the gallery"}');
  mkdirSync(join(directory, "drafts"));
  writeFileSync(join(directory, "drafts", "unused.webp"), Buffer.from([255]));
  assert.equal(createArtRevision(directory), previous);
});

test("missing thread profiles cannot silently produce a usable art revision", t => {
  const directory = fixture(t, fixtureAssets.filter(([filename]) => filename !== "thread-profiles.json"));
  assert.throws(() => createArtRevision(directory));
});

test("an asset directory without any WebP artwork is rejected", t => {
  const directory = fixture(t, fixtureAssets.filter(([filename]) => filename === "thread-profiles.json"));
  assert.throws(() => createArtRevision(directory));
});

test("large images, small images, and profiles use exactly the same revision query", t => {
  const revision = createArtRevision(fixture(t));
  for (const filename of ["driver.webp", "driver-640.webp", "thread-profiles.json"]) {
    assert.equal(artAssetUrl(filename, revision), `/art/${filename}?v=${revision}`);
  }
});

test("an empty revision cannot silently restore unversioned asset requests", () => {
  for (const filename of ["driver.webp", "driver-640.webp", "thread-profiles.json"]) {
    assert.throws(() => artAssetUrl(filename, ""), /revision/i);
  }
});

test("an artwork edit changes every paired request URL, including the profiles", t => {
  const directory = fixture(t);
  const previous = createArtRevision(directory);
  writeFileSync(join(directory, "driver.webp"), "corrected illustrated entry strand");
  const updated = createArtRevision(directory);
  for (const filename of ["driver.webp", "driver-640.webp", "traveller.webp", "thread-profiles.json"]) {
    const previousUrl = artAssetUrl(filename, previous);
    const updatedUrl = artAssetUrl(filename, updated);
    assert.notEqual(updatedUrl, previousUrl);
    const parsed = new URL(updatedUrl, "https://portfolio.example");
    assert.equal(parsed.pathname, `/art/${filename}`);
    assert.deepEqual([...parsed.searchParams], [["v", updated]]);
  }
});
