"use client";

import { useEffect, useRef, useState } from "react";
import GitHubCalendar from "./github-calendar";
import Age from "./age";
import LanguageSwitcher from "./language-switcher";
import { ArtThread, artThreadStyle, ThreadContinuation } from "./art-thread";
import { artAssetUrl } from "@/lib/art-assets";
import type { Locale } from "@/lib/language";
import type { PortfolioContent } from "@/content/portfolio";
import type { Project } from "@/content/project-details";

const github = "https://github.com/JacobStarheim";
const linkedin = "https://www.linkedin.com/in/jacob-vindal-starheim-9aa946325/";
const email = "jacobvinstar@gmail.com";

const nimmoApps = [
  {
    id: "nimmo-traveller", art: "traveller", number: "02", name: "Nimmo", side: "right",
    stores: [{ label: "App Store", href: "https://apps.apple.com/no/app/nimmo/id1672565306" }, { label: "Google Play", href: "https://play.google.com/store/apps/details?id=no.nimmo.app" }],
  },
  {
    id: "nimmo-driver", art: "driver", number: "03", name: "Nimmo Driver", side: "left",
    stores: [{ label: "App Store", href: "https://apps.apple.com/no/app/nimmo-driver/id6748903380" }, { label: "Google Play", href: "https://play.google.com/store/apps/details?id=no.nimmo.driver" }],
  },
] as const;

function Arrow() { return <span aria-hidden="true" className="arrow">↗</span>; }

function Art({ name, alt, eager = false }: { name: string; alt: string; eager?: boolean }) {
  return <><picture className="artwork">
    <source media="(max-width: 640px)" srcSet={artAssetUrl(`${name}-640.webp`)} />
    {/* Native picture serves optimized files without a runtime image service. */}
    <img src={artAssetUrl(`${name}.webp`)} alt={alt} width={1254} height={1254} loading={eager ? "eager" : "lazy"} fetchPriority={eager ? "high" : "auto"} decoding="async" />
  </picture>{name !== "about" && <ThreadContinuation name={name} />}</>;
}

function Chapter({ number, title }: { number: string; title: string }) {
  return <div className="chapter-label annotation"><span>{number}</span><span>{title}</span></div>;
}

function Card({ number, category, title, children, side = "left", onOpen, action }: {
  number: string; category: string; title: string; children: React.ReactNode; side?: "left" | "right" | "lower-left";
  onOpen?: () => void; action?: string;
}) {
  return <article className={`note note--${side} annotation`}>
    <div className="note-meta"><span>{category}</span><span className="note-number">{number}</span></div>
    <h2>{title}</h2>
    {children}
    {onOpen && <button className="text-link" onClick={onOpen}>{action}<Arrow /></button>}
    <span className="paper-corner" aria-hidden="true" />
  </article>;
}

export default function Portfolio({ locale, content }: { locale: Locale; content: PortfolioContent }) {
  const { ui, hero, apps, education, in5320, hobbies, bfme, podcast, chess, about, footer, projects } = content;
  const [artOnly, setArtOnly] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [selected, setSelected] = useState<Project | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const lastTrigger = useRef<HTMLElement | null>(null);
  const navigation = useRef<HTMLElement>(null);
  const menuButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (menuOpen) navigation.current?.querySelector("a")?.focus();
  }, [menuOpen]);

  useEffect(() => {
    if (!selected || !dialog.current) return;
    const element = dialog.current;
    element.showModal();
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = original; if (element.open) element.close(); };
  }, [selected]);

  function openProject(id: string) {
    lastTrigger.current = document.activeElement as HTMLElement;
    setSelected(projects[id]);
  }
  function closeProject() {
    dialog.current?.close();
    setSelected(null);
    lastTrigger.current?.focus();
  }

  return <>
    <a className="skip-link" href="#arbeid">{ui.skip}</a>
    <header className="site-header">
      <a className="wordmark" href="#top" aria-label={ui.home}><span className="thread-mark" aria-hidden="true">j<span>s</span></span><span>JACOB STARHEIM</span></a>
      <nav ref={navigation} id="primary-navigation" aria-label={ui.navigation} className={menuOpen ? "navigation navigation--open" : "navigation"} onKeyDown={(event) => { if (event.key === "Escape") { setMenuOpen(false); menuButton.current?.focus(); } }}>
        <a href="#arbeid" onClick={() => setMenuOpen(false)}>{ui.work}</a>
        <a href="#utdanning" onClick={() => setMenuOpen(false)}>{ui.education}</a>
        <a href="#hobbyprosjekter" onClick={() => setMenuOpen(false)}>{ui.projects}</a>
        <a href="#om-meg" onClick={() => setMenuOpen(false)}>{ui.about} <Arrow /></a>
      </nav>
      <div className="header-tools">
        <LanguageSwitcher locale={locale} />
        <button className="art-toggle" aria-pressed={artOnly} onClick={() => setArtOnly(!artOnly)}>
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z" /><circle cx="12" cy="12" r="2.5" /></svg>
          <span>{artOnly ? ui.showText : ui.artOnly}</span>
        </button>
        <button ref={menuButton} className="menu-toggle" aria-controls="primary-navigation" aria-expanded={menuOpen} aria-label={menuOpen ? ui.closeMenu : ui.openMenu} onClick={() => setMenuOpen(!menuOpen)}><span /><span /></button>
      </div>
    </header>

    <main id="top" className={artOnly ? "gallery art-only" : "gallery"}>
      <section className="plate opening" id="arbeid" style={artThreadStyle("nimmo")} aria-label={hero.label}>
        <div className="hero-intro annotation">
          <p className="eyebrow"><span className="red-dot" /> {hero.eyebrow}</p>
          <h1>Jacob<br /><em>Starheim.</em></h1>
          <p className="hero-description">{hero.leadStart}<br className="desktop-break" /> {hero.leadEnd}</p>
          <a className="hero-scroll" href="#nimmo-kort"><span className="scroll-circle" aria-hidden="true">↓</span><span>{hero.scroll}</span></a>
        </div>
        <Art name="nimmo" eager alt={hero.alt} />
        <div className="hero-vertical annotation" aria-hidden="true">{hero.vertical}</div>
        <div id="nimmo-kort" className="hero-work annotation">
          <Card number="01" category={hero.category} title={hero.title} onOpen={() => openProject("nimmo")} action={hero.action}>
            <p className="note-subtitle">{hero.subtitle}</p>
            <p>{hero.description}</p>
            <p className="note-stack">Flutter · iOS & Android · Firebase</p>
            <p className="note-date">{hero.date}</p>
          </Card>
        </div>
        <div className="plate-caption annotation"><span>{hero.caption}</span><span>{hero.note}</span></div>
      </section>

      <ArtThread from="nimmo" to="traveller" label="01 — 02" artOnly={artOnly} note={ui.followThread} />

      {nimmoApps.map((app, index) => {
        const copy = apps[app.art];
        return <div key={app.id}>
          <section className="plate app-plate" id={app.id} style={artThreadStyle(app.art)} aria-label={app.name === "Nimmo" ? "Nimmo Traveller" : app.name}>
            <Chapter number={app.number} title={copy.chapter} />
            <Art name={app.art} alt={copy.alt} />
            <Card number={app.number} category={copy.audience} title={copy.title} side={app.side}>
              <p className="note-subtitle">{app.name.toUpperCase()}</p>
              <p>{copy.description}</p>
              <p>{copy.contribution}</p>
              <p className="note-stack">Flutter · Dart · Android & iOS</p>
              <div className="app-store-links">{app.stores.map((store) => <a key={store.href} href={store.href} target="_blank" rel="noopener noreferrer" aria-label={`${app.name} ${ui.storePreposition} ${store.label}`}>{store.label}<Arrow /></a>)}</div>
            </Card>
            <div className="plate-caption annotation"><span>{copy.caption}</span><span>{apps.team}</span></div>
          </section>
          <ArtThread from={app.art} to={index === 0 ? "driver" : "education"} label={index === 0 ? "02 — 03" : "03 — 04"} artOnly={artOnly} note={ui.followThread} />
        </div>;
      })}

      <section className="plate" id="utdanning" style={artThreadStyle("education")} aria-label={education.label}>
        <Chapter number="04" title={education.chapter} />
        <Art name="education" alt={education.alt} />
        <Card number="04" category={education.category} title={education.title} side="right" onOpen={() => openProject("education")} action={education.action}>
          <div className="education-list">
            {education.items.map((item) => <div key={item.title}><span className="note-date">{item.date}</span><h3>{item.title}</h3><p>{item.institution}{item.detail && <><br />{item.detail}</>}</p></div>)}
          </div>
        </Card>
        <div className="plate-caption annotation"><span>{education.caption}</span><span>UIO / USN</span></div>
      </section>

      <ArtThread from="education" to="in5320" label="04 — 05" artOnly={artOnly} note={ui.followThread} />

      <section className="plate" id="in5320" style={artThreadStyle("in5320")} aria-label={in5320.label}>
        <Chapter number="05" title={in5320.chapter} />
        <Art name="in5320" alt={in5320.alt} />
        <Card number="05" category={in5320.category} title={in5320.title} side="right" onOpen={() => openProject("education")} action={in5320.action}>
          <p className="note-subtitle">{in5320.subtitle}</p>
          <p>{in5320.description}</p>
          <p>{in5320.detail}</p>
          <p className="note-stack">{in5320.stack}</p>
          <a className="text-link" href={`${github}/IN5320`} target="_blank" rel="noopener noreferrer">{in5320.code}<Arrow /></a>
        </Card>
        <div className="plate-caption annotation"><span>{in5320.caption}</span><span>{in5320.note}</span></div>
      </section>

      <ArtThread from="in5320" to="hobbies" label="05 — 06" artOnly={artOnly} note={ui.followThread} />

      <section className="plate" id="hobbyprosjekter" style={artThreadStyle("hobbies")} aria-label={hobbies.label}>
        <Chapter number="06" title={hobbies.chapter} />
        <Art name="hobbies" alt={hobbies.alt} />
        <Card number="06" category={hobbies.category} title={hobbies.title}>
          <p>{hobbies.description}</p>
          <p>{hobbies.detail}</p>
          <nav className="hobby-links" aria-label={hobbies.navigation}>
            <a href="#open-bfme"><span>07</span>Open BFME<span aria-hidden="true">↓</span></a>
            <a href="#aipodcast"><span>08</span>AIpodcast<span aria-hidden="true">↓</span></a>
            <a href="#sjakk"><span>09</span>Chess<span aria-hidden="true">↓</span></a>
          </nav>
        </Card>
        <div className="plate-caption annotation"><span>{hobbies.caption}</span><span>{hobbies.note}</span></div>
      </section>

      <ArtThread from="hobbies" to="bfme" label="06 — 07" artOnly={artOnly} note={ui.followThread} />

      <section className="plate" id="open-bfme" style={artThreadStyle("bfme")} aria-label="Open BFME">
        <Chapter number="07" title={bfme.chapter} />
        <Art name="bfme" alt={bfme.alt} />
        <Card number="07" category="OPEN SOURCE" title={bfme.title} side="lower-left" onOpen={() => openProject("bfme")} action={bfme.action}>
          <p className="note-subtitle">OPEN BFME 1 & 2</p>
          <p>{bfme.description}</p>
          <p className="note-stack">C++ · Reverse engineering · ABI</p>
        </Card>
        <div className="plate-caption annotation"><span>{bfme.caption}</span><span>{bfme.note}</span></div>
      </section>

      <ArtThread from="bfme" to="podcast" label="07 — 08" artOnly={artOnly} note={ui.followThread} />

      <section className="plate" id="aipodcast" style={artThreadStyle("podcast")} aria-label="AIpodcast">
        <Chapter number="08" title={podcast.chapter} />
        <Art name="podcast" alt={podcast.alt} />
        <Card number="08" category={podcast.category} title={podcast.title} side="right" onOpen={() => openProject("podcast")} action={ui.readProject}>
          <p className="note-subtitle">AIPODCAST</p>
          <p>{podcast.description}</p>
          <p className="note-stack">Flutter · TypeScript · pgvector · RAG</p>
        </Card>
        <div className="plate-caption annotation"><span>{podcast.caption}</span><span>{podcast.note}</span></div>
      </section>

      <ArtThread from="podcast" to="chess" label="08 — 09" artOnly={artOnly} note={ui.followThread} />

      <section className="plate" id="sjakk" style={artThreadStyle("chess")} aria-label={chess.label}>
        <Chapter number="09" title={chess.chapter} />
        <Art name="chess" alt={chess.alt} />
        <Card number="09" category={chess.category} title={chess.title} side="right" onOpen={() => openProject("chess")} action={ui.readProject}>
          <p className="note-subtitle">CHESS</p>
          <p>{chess.description}</p>
          <p className="note-stack">Electron · React · Python · Stockfish</p>
        </Card>
        <div className="plate-caption annotation"><span>{chess.caption}</span><span>{chess.note}</span></div>
      </section>

      <ArtThread from="chess" to="about" label="09 — 10" artOnly={artOnly} note={ui.followThread} />

      <section className="plate about-plate" id="om-meg" aria-label={about.label}>
        <Chapter number="10" title={about.chapter} />
        <Art name="about" alt={about.alt} />
        <figure className="about-portrait annotation">
          <picture><img src="/jacob-starheim.jpeg" alt={about.portrait} width={800} height={600} loading="lazy" decoding="async" /></picture>
          <figcaption>Jacob Vindal Starheim</figcaption>
        </figure>
        <Card number="10" category={about.category} title={about.title}>
          <p>{about.introduction}<Age locale={locale} />{about.description}</p>
          <p>{about.personal}</p>
          <div className="contact-links">
            <a href={`mailto:${email}`}>{about.contact} <Arrow /></a>
            <a href={linkedin} target="_blank" rel="noopener noreferrer">LinkedIn <Arrow /></a>
            <a href={github} target="_blank" rel="noopener noreferrer">GitHub <Arrow /></a>
          </div>
          <a className="email-address" href={`mailto:${email}`}>{email}</a>
        </Card>
        <div className="plate-caption annotation"><span>{about.caption}</span><a href={`mailto:${email}`}>{about.hello} <Arrow /></a></div>
      </section>

      <GitHubCalendar locale={locale} />
    </main>

    <footer className="site-footer">
      <div className="footer-top"><span className="footer-signature">{footer.signature}</span><a href="#top">{footer.top} <span aria-hidden="true">↑</span></a></div>
      <div className="footer-bottom"><span>© 2026 JACOB VINDAL STARHEIM</span><span>{footer.credit}</span><a href={github} target="_blank" rel="noopener noreferrer">{footer.projects} <Arrow /></a></div>
    </footer>

    <dialog ref={dialog} className="project-dialog" aria-labelledby="project-title" onCancel={closeProject} onClick={(event) => { if (event.target === event.currentTarget) closeProject(); }}>
      {selected && <div className="dialog-inner">
        <div className="dialog-top"><p className="eyebrow">{selected.eyebrow}</p><button className="close-button" onClick={closeProject} aria-label={ui.closeProject}>×</button></div>
        <h2 id="project-title">{selected.title}</h2>
        <p className="dialog-lead">{selected.lead}</p>
        {selected.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        <h3>{ui.contribution}</h3>
        <ul className="contributions">{selected.contributions.map((contribution) => typeof contribution === "string"
          ? <li key={contribution}>{contribution}</li>
          : <li key={contribution.title} className="contribution-detail"><h4>{contribution.title}</h4><p>{contribution.description}</p></li>
        )}</ul>
        <p className="dialog-stack">{selected.stack.join(" / ")}</p>
        {selected.links && <div className="dialog-links">{selected.links.map((link) => <a key={link.href} className="text-link" href={link.href} target="_blank" rel="noopener noreferrer">{link.label}<Arrow /></a>)}</div>}
        <button className="dialog-back text-link" onClick={closeProject}>{ui.back} <span aria-hidden="true">↩</span></button>
      </div>}
    </dialog>
  </>;
}
