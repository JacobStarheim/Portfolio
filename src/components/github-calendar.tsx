"use client";

import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import { buildCalendarLayout, loadContributions, type ContributionCalendar } from "@/lib/github-contributions";

const profileUrl = "https://github.com/JacobStarheim";
const numberFormat = new Intl.NumberFormat("nb-NO");
const shortDate = new Intl.DateTimeFormat("nb-NO", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });
const fullDate = new Intl.DateTimeFormat("nb-NO", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });

type ActivityState =
  | { status: "loading" }
  | { status: "ready"; calendar: ContributionCalendar }
  | { status: "error" };

function CalendarGrid({ calendar }: { calendar: ContributionCalendar }) {
  const { days, total } = calendar;
  const layout = buildCalendarLayout(days);
  const scroll = useRef<HTMLDivElement>(null);
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  const [focusIndex, setFocusIndex] = useState(days.length - 1);
  const [detailIndex, setDetailIndex] = useState<number | null>(null);
  const selectedDay = detailIndex === null ? null : days[detailIndex];
  const dateLabel = (date: string) => fullDate.format(new Date(`${date}T00:00:00Z`));

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
      <p className="activity-total"><strong>{numberFormat.format(total)}</strong> bidrag siste året</p>
      <p className="activity-range">{shortDate.format(new Date(`${days[0].date}T00:00:00Z`))} — {shortDate.format(new Date(`${days.at(-1)!.date}T00:00:00Z`))}</p>
    </div>
    <div ref={scroll} className="activity-scroll">
      <div className="activity-chart" style={{ "--activity-columns": layout.columns } as CSSProperties}>
        <div className="activity-months" aria-hidden="true">{layout.months.map((month) => <span key={month.column} style={{ gridColumn: `${month.column + 1} / span 3` }}>{month.label}</span>)}</div>
        <div className="activity-weekdays" aria-hidden="true"><span style={{ gridRow: 2 }}>Man</span><span style={{ gridRow: 4 }}>Ons</span><span style={{ gridRow: 6 }}>Fre</span></div>
        <div className="activity-days" role="group" aria-label="GitHub-bidrag per dag" aria-describedby="activity-help">
          {layout.cells.map(({ day, index, column, row }) => <button
            key={day.date}
            ref={(element) => { buttons.current[index] = element; }}
            type="button"
            className={`activity-day activity-level-${day.level}${detailIndex === index ? " activity-day--selected" : ""}`}
            style={{ gridColumn: column + 1, gridRow: row + 1 }}
            tabIndex={focusIndex === index ? 0 : -1}
            aria-label={`${numberFormat.format(day.count)} bidrag den ${dateLabel(day.date)}`}
            title={`${numberFormat.format(day.count)} bidrag · ${dateLabel(day.date)}`}
            onFocus={() => { setFocusIndex(index); setDetailIndex(index); }}
            onClick={() => { setFocusIndex(index); setDetailIndex(index); }}
            onPointerEnter={() => setDetailIndex(index)}
            onKeyDown={(event) => navigateDay(event, index)}
          />)}
        </div>
      </div>
    </div>
    <div className="activity-chart-footer">
      <p className="activity-detail">{selectedDay ? `${numberFormat.format(selectedDay.count)} bidrag · ${dateLabel(selectedDay.date)}` : "Hver rute er en dag. Velg en for å se mer."}</p>
      <div className="activity-legend" aria-label="Fargeskala fra færre til flere bidrag"><span>Færre</span>{[0, 1, 2, 3, 4].map((level) => <span key={level} className={`activity-swatch activity-level-${level}`} aria-hidden="true" />)}<span>Flere</span></div>
    </div>
    <p className="activity-help" id="activity-help">Velg en rute med pekeren eller bruk piltastene. <span>Bla sidelengs for å se hele året på små skjermer.</span></p>
  </>;
}

export default function GitHubCalendar() {
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
        <h2 id="github-heading">Kode over tid.</h2>
        <p className="activity-intro">Et lite innblikk i det jeg bygger og utforsker, dag for dag.</p>
      </div>
      <a className="text-link activity-profile" href={profileUrl} target="_blank" rel="noopener noreferrer">Se GitHub-profilen <span aria-hidden="true">↗</span></a>
    </div>

    <div className="activity-content" aria-busy={state.status === "loading"}>
      {state.status === "ready" ? <CalendarGrid calendar={state.calendar} /> : <div className="activity-message">
        <span className="activity-message-line" aria-hidden="true" />
        <p role="status">{state.status === "loading" ? "Henter GitHub-aktivitet …" : "Kalenderen kunne ikke lastes akkurat nå. Aktiviteten er fortsatt tilgjengelig på GitHub."}</p>
        {state.status === "error" && <button type="button" className="text-link" onClick={() => { setState({ status: "loading" }); setAttempt((value) => value + 1); }}>Prøv igjen <span aria-hidden="true">↻</span></button>}
      </div>}
    </div>

    <div className="activity-footnote">
      <p>Bidrag som er synlige på GitHub-profilen — blant annet commits, pull requests og issues. Ikke en full oversikt over alt arbeidet mitt.</p>
      <a href="https://github.com/grubersjoe/github-contributions-api" target="_blank" rel="noopener noreferrer">Data via GitHub Contributions API <span aria-hidden="true">↗</span></a>
    </div>
  </section>;
}
