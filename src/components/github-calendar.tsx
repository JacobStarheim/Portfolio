"use client";

import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import { buildCalendarLayout, formatContributionCount, formatContributionDate, formatContributionNumber, loadContributions, type ContributionCalendar } from "@/lib/github-contributions";
import type { Locale } from "@/lib/language";

const profileUrl = "https://github.com/JacobStarheim";
const calendarCopy = {
  no: {
    title: "Kode over tid.",
    intro: "Et lite innblikk i det jeg bygger og utforsker, dag for dag.",
    profile: "Se GitHub-profilen",
    profileLabel: "Se GitHub-profilen (åpnes i en ny fane)",
    loading: "Henter GitHub-aktivitet …",
    error: "Kalenderen kunne ikke lastes akkurat nå. Aktiviteten er fortsatt tilgjengelig på GitHub.",
    retry: "Prøv igjen",
    summary: () => "bidrag siste året",
    weekdays: ["Man", "Ons", "Fre"],
    group: "GitHub-bidrag per dag",
    on: "den",
    detail: "Hver rute er en dag. Velg en for å se mer.",
    legend: "Fargeskala fra færre til flere bidrag",
    less: "Færre",
    more: "Flere",
    help: "Velg en rute med pekeren eller bruk piltastene.",
    scrollHelp: "Bla sidelengs for å se hele året på små skjermer.",
    footnote: "Bidrag som er synlige på GitHub-profilen — blant annet commits, pull requests og issues. Ikke en full oversikt over alt arbeidet mitt.",
    data: "Data via GitHub Contributions API",
    dataLabel: "Data via GitHub Contributions API (åpnes i en ny fane)",
  },
  en: {
    title: "Code over time.",
    intro: "A glimpse of what I build and explore, day by day.",
    profile: "View GitHub profile",
    profileLabel: "View GitHub profile (opens in a new tab)",
    loading: "Loading GitHub activity …",
    error: "The calendar couldn’t load right now. You can still view my activity on GitHub.",
    retry: "Try again",
    summary: (count: number) => `${count === 1 ? "contribution" : "contributions"} in the past year`,
    weekdays: ["Mon", "Wed", "Fri"],
    group: "GitHub contributions by day",
    on: "on",
    detail: "Each square is a day. Select one to see more.",
    legend: "Colour scale from fewer to more contributions",
    less: "Fewer",
    more: "More",
    help: "Select a square with the pointer or use the arrow keys.",
    scrollHelp: "Scroll sideways to see the full year on small screens.",
    footnote: "Contributions visible on my GitHub profile — including commits, pull requests and issues. Not a complete record of all my work.",
    data: "Data via GitHub Contributions API",
    dataLabel: "Data via GitHub Contributions API (opens in a new tab)",
  },
};

type ActivityState =
  | { status: "loading" }
  | { status: "ready"; calendar: ContributionCalendar }
  | { status: "error" };

function CalendarGrid({ calendar, locale }: { calendar: ContributionCalendar; locale: Locale }) {
  const { days, total } = calendar;
  const layout = buildCalendarLayout(days, locale);
  const copy = calendarCopy[locale];
  const scroll = useRef<HTMLDivElement>(null);
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  const [focusIndex, setFocusIndex] = useState(days.length - 1);
  const [detailIndex, setDetailIndex] = useState<number | null>(null);
  const selectedDay = detailIndex === null ? null : days[detailIndex];
  const dateLabel = (date: string) => formatContributionDate(date, locale);

  useEffect(() => {
    // On narrow screens show the most recent weeks first, without moving the page.
    if (scroll.current) scroll.current.scrollLeft = scroll.current.scrollWidth;
  }, []);

  function navigateDay(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const offsets: Record<string, number> = { ArrowLeft: -7, ArrowRight: 7, ArrowUp: -1, ArrowDown: 1 };
    let next = index;
    if (event.key === "Home") next = 0;
    else if (event.key === "End") next = days.length - 1;
    else if (event.key in offsets) next += offsets[event.key];
    else return;
    event.preventDefault();
    next = Math.max(0, Math.min(days.length - 1, next));
    setFocusIndex(next);
    buttons.current[next]?.focus({ preventScroll: true });
    buttons.current[next]?.scrollIntoView({ block: "nearest", inline: "nearest" });
  }

  return <>
    <div className="activity-summary">
      <p className="activity-total"><strong>{formatContributionNumber(total, locale)}</strong> {copy.summary(total)}</p>
      <p className="activity-range">{formatContributionDate(days[0].date, locale, "short")} — {formatContributionDate(days.at(-1)!.date, locale, "short")}</p>
    </div>
    <div ref={scroll} className="activity-scroll">
      <div className="activity-chart" style={{ "--activity-columns": layout.columns } as CSSProperties}>
        <div className="activity-months" aria-hidden="true">{layout.months.map((month) => <span key={month.column} style={{ gridColumn: `${month.column + 1} / span 3` }}>{month.label}</span>)}</div>
        <div className="activity-weekdays" aria-hidden="true">{copy.weekdays.map((weekday, index) => <span key={weekday} style={{ gridRow: index * 2 + 2 }}>{weekday}</span>)}</div>
        <div className="activity-days" role="group" aria-label={copy.group} aria-describedby="activity-help">
          {layout.cells.map(({ day, index, column, row }) => <button
            key={day.date}
            ref={(element) => { buttons.current[index] = element; }}
            type="button"
            className={`activity-day activity-level-${day.level}${detailIndex === index ? " activity-day--selected" : ""}`}
            style={{ gridColumn: column + 1, gridRow: row + 1 }}
            tabIndex={focusIndex === index ? 0 : -1}
            aria-label={`${formatContributionCount(day.count, locale)} ${copy.on} ${dateLabel(day.date)}`}
            title={`${formatContributionCount(day.count, locale)} · ${dateLabel(day.date)}`}
            onFocus={() => { setFocusIndex(index); setDetailIndex(index); }}
            onClick={() => { setFocusIndex(index); setDetailIndex(index); }}
            onPointerEnter={() => setDetailIndex(index)}
            onKeyDown={(event) => navigateDay(event, index)}
          />)}
        </div>
      </div>
    </div>
    <div className="activity-chart-footer">
      <p className="activity-detail">{selectedDay ? `${formatContributionCount(selectedDay.count, locale)} · ${dateLabel(selectedDay.date)}` : copy.detail}</p>
      <div className="activity-legend" aria-label={copy.legend}><span>{copy.less}</span>{[0, 1, 2, 3, 4].map((level) => <span key={level} className={`activity-swatch activity-level-${level}`} aria-hidden="true" />)}<span>{copy.more}</span></div>
    </div>
    <p className="activity-help" id="activity-help">{copy.help} <span>{copy.scrollHelp}</span></p>
  </>;
}

export default function GitHubCalendar({ locale = "no" }: { locale?: Locale }) {
  const copy = calendarCopy[locale];
  const [state, setState] = useState<ActivityState>({ status: "loading" });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    let cancelled = false;
    const timeout = window.setTimeout(() => controller.abort(), 12_000);

    async function load() {
      try {
        const calendar = await loadContributions(controller.signal);
        if (!cancelled) setState({ status: "ready", calendar });
      } catch {
        if (!cancelled) setState({ status: "error" });
      } finally {
        window.clearTimeout(timeout);
      }
    }

    void load();
    return () => { cancelled = true; controller.abort(); window.clearTimeout(timeout); };
  }, [attempt]);

  return <section className="github-section annotation" id="github-aktivitet" aria-labelledby="github-heading">
    <div className="activity-heading">
      <div>
        <p className="eyebrow"><span className="red-dot" aria-hidden="true" /> GITHUB · JACOBSTARHEIM</p>
        <h2 id="github-heading">{copy.title}</h2>
        <p className="activity-intro">{copy.intro}</p>
      </div>
      <a className="text-link activity-profile" href={profileUrl} target="_blank" rel="noopener noreferrer" aria-label={copy.profileLabel}>{copy.profile} <span aria-hidden="true">↗</span></a>
    </div>

    <div className="activity-content" aria-busy={state.status === "loading"}>
      {state.status === "ready" ? <CalendarGrid calendar={state.calendar} locale={locale} /> : <div className="activity-message">
        <span className="activity-message-line" aria-hidden="true" />
        <p role="status">{state.status === "loading" ? copy.loading : copy.error}</p>
        {state.status === "error" && <button type="button" className="text-link" onClick={() => { setState({ status: "loading" }); setAttempt((value) => value + 1); }}>{copy.retry} <span aria-hidden="true">↻</span></button>}
      </div>}
    </div>

    <div className="activity-footnote">
      <p>{copy.footnote}</p>
      <a href="https://github.com/grubersjoe/github-contributions-api" target="_blank" rel="noopener noreferrer" aria-label={copy.dataLabel}>{copy.data} <span aria-hidden="true">↗</span></a>
    </div>
  </section>;
}
