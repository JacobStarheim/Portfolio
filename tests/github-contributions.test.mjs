import assert from "node:assert/strict";
import test from "node:test";
import { buildCalendarLayout, formatContributionCount, formatContributionDate, formatContributionNumber, loadContributions, parseContributions } from "../src/lib/github-contributions.ts";

const day = (date, count = 0, level = 0) => ({ date, count, level });
const parse = (contributions, total = {}) => parseContributions({ contributions, total });
const range = (start, length) => Array.from({ length }, (_, index) =>
  day(new Date(Date.parse(`${start}T00:00:00Z`) + index * 86_400_000).toISOString().slice(0, 10)),
);

test("sorts without mutating input and computes the displayed total", () => {
  const input = [day("2026-01-02", 3, 2), day("2026-01-01", 2, 1)];
  const result = parse(input, { lastYear: 9999 });
  assert.deepEqual(result.days.map(({ date }) => date), ["2026-01-01", "2026-01-02"]);
  assert.equal(result.total, 5);
  assert.equal(input[0].date, "2026-01-02");
  assert.notEqual(result.days[0], input[1]);
});

test("zero contributions are valid and provider totals are unnecessary", () => {
  assert.deepEqual(parseContributions({ contributions: [day("2026-09-21")] }), {
    days: [day("2026-09-21")], total: 0,
  });
});

test("accepts leap days and consecutive dates across year boundaries", () => {
  assert.equal(parse(range("2024-02-28", 3)).days[1].date, "2024-02-29");
  assert.equal(parse([day("2026-01-01"), day("2025-12-31")]).days[0].date, "2025-12-31");
});

test("rejects malformed or impossible calendar dates", () => {
  for (const date of ["2026-02-29", "2026-04-31", "2026-00-10", "2026-13-01", "2026-01-00", "2026-1-01", "2026-01-01T00:00:00Z", "", null]) {
    assert.throws(() => parse([day(date)]), /Invalid contribution date/);
  }
});

test("rejects duplicate dates, gaps, invalid shape and empty or oversized data", () => {
  for (const value of [null, [], {}, { contributions: null }, { contributions: [] }, { contributions: [null] }, { contributions: range("2025-01-01", 401) }]) {
    assert.throws(() => parseContributions(value));
  }
  assert.throws(() => parse([day("2026-01-01"), day("2026-01-01")]), /unique and consecutive/);
  assert.throws(() => parse([day("2026-01-01"), day("2026-01-03")]), /unique and consecutive/);
  assert.equal(parse(range("2025-01-01", 400)).days.length, 400);
});

test("rejects invalid counts, levels and unsafe totals", () => {
  for (const count of [-1, 0.5, NaN, Infinity, "1", Number.MAX_SAFE_INTEGER + 1]) {
    assert.throws(() => parse([day("2026-01-01", count)]), /Invalid contribution count/);
  }
  for (const level of [-1, 5, 0.5, NaN, "1", null]) {
    assert.throws(() => parse([day("2026-01-01", 1, level)]), /Invalid contribution level/);
  }
  assert.throws(() => parse([day("2026-01-01", Number.MAX_SAFE_INTEGER), day("2026-01-02", 1)]), /Invalid contribution total/);
  assert.deepEqual(parse(range("2026-01-01", 5).map((entry, level) => ({ ...entry, level }))).days.map(({ level }) => level), [0, 1, 2, 3, 4]);
});

test("places Sunday and Saturday boundaries without phantom days", () => {
  const layout = buildCalendarLayout(range("2026-09-19", 3));
  assert.equal(layout.columns, 2);
  assert.deepEqual(layout.cells.map(({ index, column, row }) => ({ index, column, row })), [
    { index: 0, column: 0, row: 6 },
    { index: 1, column: 1, row: 0 },
    { index: 2, column: 1, row: 1 },
  ]);
  assert.equal(buildCalendarLayout(range("2026-09-20", 7)).columns, 1);
  assert.equal(buildCalendarLayout([day("2026-09-20")]).cells[0].row, 0);
  assert.throws(() => buildCalendarLayout([]));
});

test("calendar layout remains UTC-based across DST and year rollover", () => {
  const previous = process.env.TZ;
  try {
    process.env.TZ = "America/Los_Angeles";
    const pacific = buildCalendarLayout(range("2026-03-07", 4));
    process.env.TZ = "Pacific/Auckland";
    assert.deepEqual(buildCalendarLayout(range("2026-03-07", 4)), pacific);
    assert.deepEqual(pacific.cells.map(({ row }) => row), [6, 0, 1, 2]);
    assert.deepEqual(buildCalendarLayout(range("2025-12-31", 3)).cells.map(({ row }) => row), [3, 4, 5]);
  } finally {
    if (previous === undefined) delete process.env.TZ;
    else process.env.TZ = previous;
  }
});

test("Norwegian month labels fit and omit cramped partial months", () => {
  assert.deepEqual(buildCalendarLayout(range("2026-01-25", 45)).months, [{ label: "feb", column: 1 }]);
  const layout = buildCalendarLayout(range("2026-01-10", 75));
  assert.equal(layout.months[0].label, "jan");
  assert.deepEqual(layout.months.map(({ label }) => label), ["jan", "feb", "mar"]);
  for (let index = 0; index < layout.months.length; index += 1) {
    const month = layout.months[index];
    assert.ok(layout.columns - month.column >= 3);
    if (index > 0) assert.ok(month.column - layout.months[index - 1].column >= 3);
  }
  assert.deepEqual(buildCalendarLayout([day("2026-01-01")]).months, []);
});

test("localises month labels without changing the UTC calendar layout", () => {
  const days = range("2026-04-01", 275);
  const norwegian = buildCalendarLayout(days, "no");
  const english = buildCalendarLayout(days, "en");
  assert.deepEqual(norwegian.months.map(({ label }) => label), ["apr", "mai", "jun", "jul", "aug", "sep", "okt", "nov", "des"]);
  assert.deepEqual(english.months.map(({ label }) => label), ["Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"]);
  assert.deepEqual(english.cells, norwegian.cells);
  assert.equal(english.columns, norwegian.columns);
  assert.deepEqual(english.months.map(({ column }) => column), norwegian.months.map(({ column }) => column));
});

test("formats Norwegian and English contribution counts and singulars", () => {
  assert.equal(formatContributionCount(0, "en"), "0 contributions");
  assert.equal(formatContributionCount(1, "en"), "1 contribution");
  assert.equal(formatContributionCount(2, "en"), "2 contributions");
  assert.equal(formatContributionCount(1234, "en"), "1,234 contributions");
  assert.equal(formatContributionNumber(1234, "en"), "1,234");
  assert.equal(formatContributionCount(1, "no"), "1 bidrag");
  assert.equal(formatContributionCount(2), "2 bidrag");
  assert.equal(formatContributionNumber(1234, "no"), "1\u00a0234");
});

test("formats date-only values in the requested language while retaining UTC", () => {
  const previous = process.env.TZ;
  try {
    for (const timeZone of ["America/Los_Angeles", "Pacific/Auckland", "UTC"]) {
      process.env.TZ = timeZone;
      assert.equal(formatContributionDate("2026-09-21", "no"), "21. september 2026");
      assert.equal(formatContributionDate("2026-09-21", "en"), "21 September 2026");
      assert.equal(formatContributionDate("2026-09-21", "no", "short"), "21. sep. 2026");
      assert.equal(formatContributionDate("2026-09-21", "en", "short"), "21 Sept 2026");
    }
  } finally {
    if (previous === undefined) delete process.env.TZ;
    else process.env.TZ = previous;
  }
  assert.throws(() => formatContributionDate("2026-02-30", "en"), /Invalid contribution date/);
});

test("loads and validates public counts with private-safe request options", async () => {
  const controller = new AbortController();
  let requests = 0;
  const request = async (url, options) => {
    requests += 1;
    assert.equal(url, "https://github-contributions-api.jogruber.de/v4/JacobStarheim?y=last");
    assert.deepEqual(options, {
      signal: controller.signal,
      credentials: "omit",
      referrerPolicy: "no-referrer",
    });
    return Response.json({
      contributions: [day("2026-09-21", 8, 2), day("2026-09-20", 0, 0)],
      total: { lastYear: 999 },
    });
  };
  assert.deepEqual(await loadContributions(controller.signal, request), {
    days: [day("2026-09-20", 0, 0), day("2026-09-21", 8, 2)], total: 8,
  });
  assert.equal(requests, 1);
});

test("rejects unsuccessful HTTP responses before parsing their body", async () => {
  for (const status of [404, 429, 500]) {
    await assert.rejects(
      loadContributions(new AbortController().signal, async () => new Response("not JSON", { status })),
      /Could not load GitHub contributions/,
    );
  }
});

test("rejects malformed JSON and invalid data from successful HTTP responses", async () => {
  const signal = new AbortController().signal;
  await assert.rejects(loadContributions(signal, async () => new Response("not JSON")), SyntaxError);
  await assert.rejects(loadContributions(signal, async () => Response.json({ contributions: [] })), /Invalid contribution calendar/);
  await assert.rejects(loadContributions(signal, async () => Response.json({ contributions: [day("2026-02-30")] })), /Invalid contribution date/);
});

test("propagates network and abort failures without fabricating data", async () => {
  for (const failure of [new TypeError("Failed to fetch"), new DOMException("Aborted", "AbortError")]) {
    await assert.rejects(
      loadContributions(new AbortController().signal, async () => { throw failure; }),
      (error) => error === failure,
    );
  }
});
