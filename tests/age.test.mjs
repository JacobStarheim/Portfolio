import assert from "node:assert/strict";
import test from "node:test";
import { getAge } from "../src/lib/age.ts";

test("increments on November 7, not the day before or after", () => {
  assert.equal(getAge(new Date("2026-11-06T12:00:00+01:00")), 24);
  assert.equal(getAge(new Date("2026-11-07T00:00:00+01:00")), 25);
  assert.equal(getAge(new Date("2026-11-08T12:00:00+01:00")), 25);
});

test("uses Oslo midnight while the UTC date is still November 6", () => {
  assert.equal(getAge(new Date("2026-11-06T22:59:59.999Z")), 24);
  assert.equal(getAge(new Date("2026-11-06T23:00:00.000Z")), 25);
  assert.equal(getAge(new Date("2026-11-07T00:00:00.000Z")), 25);
});

test("keeps the age across New Year and advances in later years", () => {
  assert.equal(getAge(new Date("2026-12-31T22:59:59.999Z")), 25);
  assert.equal(getAge(new Date("2026-12-31T23:00:00.000Z")), 25);
  assert.equal(getAge(new Date("2027-11-06T22:59:59.999Z")), 25);
  assert.equal(getAge(new Date("2027-11-06T23:00:00.000Z")), 26);
  assert.equal(getAge(new Date("2030-11-07T12:00:00+01:00")), 29);
});

test("handles leap years and Oslo daylight saving time without gaining a year", () => {
  assert.equal(getAge(new Date("2024-02-29T12:00:00Z")), 22);
  assert.equal(getAge(new Date("2026-07-01T00:00:00+02:00")), 24);
  assert.equal(getAge(new Date("2026-03-29T00:59:59Z")), 24);
  assert.equal(getAge(new Date("2026-03-29T01:00:00Z")), 24);
});

test("does not depend on the visitor's time zone", () => {
  const previous = process.env.TZ;
  try {
    for (const timeZone of ["America/Los_Angeles", "Pacific/Auckland", "UTC"]) {
      process.env.TZ = timeZone;
      assert.equal(getAge(new Date("2026-11-06T22:59:59.999Z")), 24);
      assert.equal(getAge(new Date("2026-11-06T23:00:00.000Z")), 25);
    }
  } finally {
    if (previous === undefined) delete process.env.TZ;
    else process.env.TZ = previous;
  }
});
