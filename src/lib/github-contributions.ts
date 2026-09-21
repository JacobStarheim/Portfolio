export type ContributionDay = {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
};

export type ContributionCalendar = {
  days: ContributionDay[];
  total: number;
};

const DAY_MS = 86_400_000;
const ACTIVITY_URL = "https://github-contributions-api.jogruber.de/v4/JacobStarheim?y=last";
const MONTH_LABELS = [
  "jan", "feb", "mar", "apr", "mai", "jun",
  "jul", "aug", "sep", "okt", "nov", "des",
];

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function dateTimestamp(value: unknown): number {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    throw new Error("Invalid contribution date");
  }

  const timestamp = Date.parse(`${value}T00:00:00.000Z`);
  if (!Number.isFinite(timestamp) || new Date(timestamp).toISOString().slice(0, 10) !== value) {
    throw new Error("Invalid contribution date");
  }

  return timestamp;
}

/** Validate untrusted public API data; totals always reflect the displayed days. */
export function parseContributions(value: unknown): ContributionCalendar {
  if (
    !isRecord(value) ||
    !Array.isArray(value.contributions) ||
    value.contributions.length < 1 ||
    value.contributions.length > 400
  ) {
    throw new Error("Invalid contribution calendar");
  }

  const days = value.contributions.map((entry: unknown): ContributionDay => {
    if (!isRecord(entry)) throw new Error("Invalid contribution day");
    dateTimestamp(entry.date);

    if (typeof entry.count !== "number" || !Number.isSafeInteger(entry.count) || entry.count < 0) {
      throw new Error("Invalid contribution count");
    }
    if (typeof entry.level !== "number" || !Number.isInteger(entry.level) || entry.level < 0 || entry.level > 4) {
      throw new Error("Invalid contribution level");
    }

    return {
      date: entry.date as string,
      count: entry.count,
      level: entry.level as ContributionDay["level"],
    };
  }).sort((a, b) => a.date.localeCompare(b.date));

  let total = 0;
  let previousTimestamp: number | undefined;
  for (const day of days) {
    const timestamp = dateTimestamp(day.date);
    if (previousTimestamp !== undefined && timestamp - previousTimestamp !== DAY_MS) {
      throw new Error("Contribution dates must be unique and consecutive");
    }
    previousTimestamp = timestamp;
    total += day.count;
    if (!Number.isSafeInteger(total)) throw new Error("Invalid contribution total");
  }

  return { days, total };
}

/** Fetch public profile counts without sending credentials or the page referrer. */
export async function loadContributions(
  signal: AbortSignal,
  request: typeof fetch = fetch,
): Promise<ContributionCalendar> {
  const response = await request(ACTIVITY_URL, {
    signal,
    credentials: "omit",
    referrerPolicy: "no-referrer",
  });
  if (!response.ok) throw new Error("Could not load GitHub contributions");
  return parseContributions(await response.json());
}

/** Sunday-first, UTC-only layout. Missing boundary days remain absent, not zero. */
export function buildCalendarLayout(days: ContributionDay[]) {
  const calendar = parseContributions({ contributions: days });
  const offset = new Date(dateTimestamp(calendar.days[0].date)).getUTCDay();
  const columns = Math.ceil((offset + calendar.days.length) / 7);
  const cells = calendar.days.map((day, index) => ({
    day,
    index,
    column: Math.floor((offset + index) / 7),
    row: (offset + index) % 7,
  }));

  const candidates = cells
    .filter(({ day, index }) => index === 0 || day.date.endsWith("-01"))
    .map(({ day, column }) => ({
      label: MONTH_LABELS[new Date(dateTimestamp(day.date)).getUTCMonth()],
      column,
    }));
  const months: Array<{ label: string; column: number }> = [];

  for (let index = 0; index < candidates.length; index += 1) {
    const candidate = candidates[index];
    const nextColumn = candidates[index + 1]?.column ?? columns;
    const previousColumn = months[months.length - 1]?.column;
    // Three short letters need three week columns; prioritize the next full month.
    if (nextColumn - candidate.column < 3 || columns - candidate.column < 3) continue;
    if (previousColumn !== undefined && candidate.column - previousColumn < 3) continue;
    months.push(candidate);
  }

  return { columns, cells, months };
}
