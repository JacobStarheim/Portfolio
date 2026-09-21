"use client";

import { useEffect, useRef, useState } from "react";
import GitHubCalendar from "./github-calendar";
import Age from "./age";
import { EducationProject, HobbyIntro, NimmoApps } from "./project-cards";

const github = "https://github.com/JacobStarheim";
const linkedin = "https://www.linkedin.com/in/jacob-vindal-starheim-9aa946325/";
const email = "jacobvinstar@gmail.com";

const nimmoApps = [
  {
    id: "nimmo-traveller", number: "01.A", audience: "TRAVELLER · FOR REISENDE", name: "Nimmo",
    description: "Appen for reisende og foresatte: finn og bestill delt transport, se billettene dine og følg turen på kartet.",
    contribution: "Jeg har jobbet med blant annet reisesøk, booking, billetter, innlogging og foresatt-/barneflyter, samt tilgjengelighet og feilretting. Jeg har også distribuert testversjoner og publisert appen til begge appbutikkene.",
    features: ["Reisesøk", "Booking", "Billetter", "Kart"],
    stores: [{ label: "App Store", href: "https://apps.apple.com/no/app/nimmo/id1672565306" }, { label: "Google Play", href: "https://play.google.com/store/apps/details?id=no.nimmo.app" }],
  },
  {
    id: "nimmo-driver", number: "01.B", audience: "DRIVER · FOR SJÅFØRER", name: "Nimmo Driver",
    description: "Sjåførens verktøy for gjennomføring av turen, med oversikt over kjørerute, passasjerer og hvor de skal hentes og leveres.",
    contribution: "Jeg bidrar til videreutvikling og feilretting, med vekt på stabile brukerflyter, tilgjengelighet og samspillet med resten av systemet. Jeg har også distribuert testversjoner og publisert appen til begge appbutikkene.",
    features: ["Kjøreruter", "Passasjerer", "Kart", "Henting og levering"],
    stores: [{ label: "App Store", href: "https://apps.apple.com/no/app/nimmo-driver/id6748903380" }, { label: "Google Play", href: "https://play.google.com/store/apps/details?id=no.nimmo.driver" }],
  },
];

type Project = {
  title: string; eyebrow: string; lead: string; body: string[];
  contributions: (string | { title: string; description: string })[]; stack: string[];
  links?: { label: string; href: string }[];
};

const projects: Record<string, Project> = {
  nimmo: {
    title: "Mobil, med mennesket i sentrum.", eyebrow: "NIMMO · ARBEIDSERFARING",
    lead: "Junior programvareutvikler, deltid · juni 2025–nå",
    body: ["Hos NIMMO jobber jeg med Traveller og Driver: to Flutter-apper for reisende og sjåfører. Jeg har bidratt med nye funksjoner, videreutvikling og feilretting i begge appene.", "Arbeidet spenner fra brukerflyt og tilgjengelighet til testing, publisering og feilsøking på tvers av apper, data og backend. Jeg liker å følge et problem fra det brukeren opplever, helt inn til årsaken — og videre til en løsning sammen med teamet."],
    contributions: [
      {
        title: "Mobilutvikling i Traveller og Driver",
        description: "Utviklet og forbedret funksjoner i Flutter/Dart for reisesøk, booking av faste og dynamiske ruter, billetter, kart, kjøretøyposisjon og forventet ankomsttid (ETA). Jeg har også jobbet med innlogging, profiler og flyter for foresatte og barn.",
      },
      {
        title: "Brukeropplevelse og tilgjengelighet",
        description: "Tilpasset appene for større tekst og små skjermer, implementert Android SMS-autofill og jobbet med språk, oversettelser, caching, datohåndtering og kvitteringer. Jeg har vært opptatt av at funksjonene fungerer godt i praksis på både Android og iOS.",
      },
      {
        title: "Feilsøking på tvers av systemet",
        description: "Brukt Firebase/Firestore, SQL og backend-koden i monorepoet til å undersøke bookingfeil, tilgang til private ruter, synkroniseringsavvik og feil i ETA-data. I samarbeid med backendutviklerne har jeg bidratt med konkrete reproduksjoner, identifisert rotårsaker og testet rettelser. I flere saker har jeg også foreslått konkrete løsninger og nødvendige kodeendringer i backend.",
      },
      {
        title: "Kvalitet og initiativ",
        description: "Funnet og meldt inn bugs, foreslått forbedringer og fulgt opp saker med utviklere og QA. Jeg har jobbet med valideringstester, Firebase-emulator og refaktorering for bedre testbarhet, og tatt initiativ til diskusjoner om teststrategi og hvordan produktet skal oppføre seg.",
      },
      {
        title: "Testdistribusjon og publisering",
        description: "Bygd og distribuert testversjoner av både Traveller og Driver gjennom Firebase App Distribution. Jeg har også publisert appene til Google Play og Apple App Store.",
      },
      {
        title: "AI-assistert utvikling og sikkerhetsanalyse",
        description: "Brukt AI aktivt til implementering, kodeanalyse, feilsøking og gjennomgang av endringer, kombinert med testing og oppfølging av konkrete funn. Jeg har også bidratt til sikkerhetsanalyse med Codex Security.",
      },
      {
        title: "Ansvar når det haster",
        description: "Tatt initiativ og stilt opp når kritiske feil måtte løses, også utenfor vanlig arbeidstid. Jeg har vært opptatt av å avklare årsaken og følge problemene frem til en løsning når de har hatt betydning for brukerne og driften.",
      },
    ],
    stack: ["Flutter", "Dart", "Android / iOS", "Firebase", "Firestore", "SQL", "Firebase Emulator", "Firebase App Distribution", "Jira", "Codex Security"],
  },
  education: {
    title: "Fra data til forståelse.", eyebrow: "UIO · IN5320",
    lead: "Gruppeprosjekt i IN5320 · høsten 2025 · A i emnet",
    body: ["Et skoleinspeksjonsverktøy bygget med React og DHIS2. Mitt bidrag var særlig analysemodulen: fra innhenting og bearbeiding av data til visninger som gjør det lettere å sammenligne skoler og følge utvikling over tid.", "IN5320 inngikk i 30 studiepoeng enkeltemner på masternivå ved UiO, etter bacheloren min. Dette var et gruppeprosjekt; beskrivelsen her gjelder mine egne bidrag."],
    contributions: ["Koblet DHIS2 Tracker-data til parsing, beregninger og dashbord.", "Bygget egne SVG-diagrammer for tidsserier og sammenligning av skoler.", "Arbeidet med ressursforhold, standardoppnåelse og kjønnsparitet.", "Laget delte React-komponenter og mellomlagring av skoledata."],
    stack: ["React", "JavaScript", "DHIS2", "SVG", "Datavisualisering"],
    links: [{ label: "Se prosjektet på GitHub", href: `${github}/IN5320` }],
  },
  bfme: {
    title: "Å forstå en verden innenfra.", eyebrow: "OPEN BFME · OPEN SOURCE",
    lead: "Bidrag til Open BFME 1 og 2 · C++ / reverse engineering",
    body: ["Det er noe spesielt med å åpne et gammelt spill og prøve å forstå hvordan verdenen faktisk henger sammen. I Open BFME bidrar jeg til å rekonstruere eksisterende spillkode med riktig struktur og binær oppførsel.", "Bidragene mine er tatt inn i begge prosjektene, og vedlikeholderen inviterte meg til å bli collaborator. Arbeidet omfatter både ferdige bidrag og videre undersøkelser, med AI-assistanse som en del av verktøykassen."],
    contributions: ["Bidratt til STLport, minnelayout og ABI-kompatibilitet.", "Arbeidet med grafikkdata, matriser og materialkopiering.", "Undersøkt og rekonstruert deler av nettverks- og kartfunksjonaliteten.", "Dokumentert hva som er verifisert, og hva som fortsatt er uavklart."],
    stack: ["C++", "Reverse engineering", "ABI", "Spillteknologi"],
    links: [{ label: "Bidrag til BFME 1", href: "https://github.com/Open-BFME/Open-BFME-1/pulls?q=is%3Apr+author%3AJacobStarheim+is%3Amerged" }, { label: "Bidrag til BFME 2", href: "https://github.com/Open-BFME/Open-BFME-2/pulls?q=is%3Apr+author%3AJacobStarheim+is%3Amerged" }],
  },
  podcast: {
    title: "Gode svar har en kilde.", eyebrow: "AIPODCAST · PERSONLIG PROSJEKT",
    lead: "En stemmestyrt AI-prototype for å utforske podkaster",
    body: ["Ideen er enkel: still et spørsmål til en podkast, få et svar, og gå rett til øyeblikket i lydopptaket som svaret bygger på. For meg er veien tilbake til kilden like viktig som selve svaret.", "Prototypen kobler en Flutter-klient til et TypeScript-API, en bakgrunnsprosess for RSS og transkripsjon, og PostgreSQL med pgvector. Den integrerer eksisterende AI-modeller og er et utforskende prosjekt, ikke et ferdig lansert produkt."],
    contributions: ["Koblet taleopptak, transkripsjon, spørsmål og opplesning i én brukerflyt.", "Bevart tidsstempler gjennom segmentering, søk og svar.", "Laget kildeutdrag som peker tilbake til originallyden.", "Arbeidet med håndtering av svake treff og manglende kilder."],
    stack: ["Flutter", "TypeScript", "PostgreSQL", "pgvector", "RAG"],
    links: [{ label: "Utforsk AIpodcast på GitHub", href: `${github}/AIpodcast` }],
  },
  chess: {
    title: "Alltid et trekk til.", eyebrow: "CHESS · PERSONLIG PROSJEKT",
    lead: "Et analyseverktøy for en interesse jeg stadig kommer tilbake til",
    body: ["Sjakk gir meg den samme gleden som programmering: å lete etter mønstre, prøve en idé og oppdage noe jeg ikke så først. Chess er et desktop-prosjekt for å utforske stillinger og analysere partier.", "Appen integrerer eksisterende sjakkmotorer; jeg har ikke laget Stockfish eller Lc0. Mitt arbeid ligger i grensesnittet og samspillet mellom motorer, sjakkdata og bildeimport."],
    contributions: ["Integrert Stockfish og Lc0 gjennom UCI-protokollen.", "Jobbet med FEN/PGN og lokale Syzygy-sluttspillbaser.", "Bygget bildeimport av sjakkstillinger med en Python-/OpenCV-prosess.", "Koblet dette sammen i en Electron-app med React og TypeScript."],
    stack: ["Electron", "React", "TypeScript", "Python", "OpenCV", "UCI"],
    links: [{ label: "Se Chess på GitHub", href: `${github}/chess` }],
  },
};

function Arrow() { return <span aria-hidden="true" className="arrow">↗</span>; }

function Art({ name, alt, eager = false }: { name: string; alt: string; eager?: boolean }) {
  return <picture className="artwork">
    <source media="(max-width: 640px)" srcSet={`/art/${name}-640.webp`} />
    {/* Native picture serves optimized files without a runtime image service. */}
    <img src={`/art/${name}.webp`} alt={alt} width={1254} height={1254} loading={eager ? "eager" : "lazy"} fetchPriority={eager ? "high" : "auto"} decoding="async" />
  </picture>;
}

function Thread({ start, end, label }: { start: number; end: number; label: string }) {
  return <div className="interlude" aria-hidden="true">
    <span className="interlude-label">{label}</span>
    <svg viewBox="0 0 1000 110" preserveAspectRatio="none"><path d={`M ${start} 0 C ${start + 18} 40, ${end - 18} 70, ${end} 110`} /></svg>
    <span className="interlude-note">FØLG TRÅDEN</span>
  </div>;
}

function Chapter({ number, title }: { number: string; title: string }) {
  return <div className="chapter-label annotation"><span>{number}</span><span>{title}</span></div>;
}

function Card({ number, category, title, children, side = "left", onOpen, action = "Les om prosjektet" }: {
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

export default function Portfolio() {
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
    <a className="skip-link" href="#arbeid">Hopp til innhold</a>
    <header className="site-header">
      <a className="wordmark" href="#top" aria-label="Jacob Starheim, til toppen"><span className="thread-mark" aria-hidden="true">j<span>s</span></span><span>JACOB STARHEIM</span></a>
      <nav ref={navigation} id="primary-navigation" aria-label="Hovedmeny" className={menuOpen ? "navigation navigation--open" : "navigation"} onKeyDown={(event) => { if (event.key === "Escape") { setMenuOpen(false); menuButton.current?.focus(); } }}>
        <a href="#arbeid" onClick={() => setMenuOpen(false)}>Arbeid</a>
        <a href="#utdanning" onClick={() => setMenuOpen(false)}>Utdanning</a>
        <a href={artOnly ? "#open-bfme" : "#hobbyprosjekter"} onClick={() => setMenuOpen(false)}>Prosjekter</a>
        <a href="#om-meg" onClick={() => setMenuOpen(false)}>Om meg <Arrow /></a>
      </nav>
      <div className="header-tools">
        <button className="art-toggle" aria-pressed={artOnly} onClick={() => setArtOnly(!artOnly)}>
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z" /><circle cx="12" cy="12" r="2.5" /></svg>
          <span>{artOnly ? "Vis teksten" : "Bare kunsten"}</span>
        </button>
        <button ref={menuButton} className="menu-toggle" aria-controls="primary-navigation" aria-expanded={menuOpen} aria-label={menuOpen ? "Lukk meny" : "Åpne meny"} onClick={() => setMenuOpen(!menuOpen)}><span /><span /></button>
      </div>
    </header>

    <main id="top" className={artOnly ? "gallery art-only" : "gallery"}>
      <section className="plate opening" id="arbeid" aria-label="Introduksjon og NIMMO">
        <div className="hero-intro annotation">
          <p className="eyebrow"><span className="red-dot" /> PROGRAMVAREUTVIKLER & NYSGJERRIGPER</p>
          <h1>Jacob<br /><em>Starheim.</em></h1>
          <p className="hero-description">Jeg bygger ting som knytter<br className="desktop-break" /> mennesker, ideer og teknologi sammen.</p>
          <a className="hero-scroll" href="#nimmo-kort"><span className="scroll-circle" aria-hidden="true">↓</span><span>EN RØD TRÅD GJENNOM DET JEG GJØR</span></a>
        </div>
        <Art name="nimmo" eager alt="En gravert kystby med broer og en telefonformet portal. En rød tråd forbinder byen fra topp til bunn." />
        <div className="hero-vertical annotation" aria-hidden="true">MOBIL / MENNESKER / MULIGHETER</div>
        <div id="nimmo-kort" className="hero-work annotation">
          <Card number="01" category="ARBEIDSERFARING" title="Små detaljer. Bedre hverdag." onOpen={() => openProject("nimmo")} action="Arbeidet mitt hos NIMMO">
            <p className="note-subtitle">NIMMO · JUNIORUTVIKLER · DELTID</p>
            <p>Fra enklere innlogging til tilgjengelige grensesnitt. Jeg utvikler mobilapper for reisende og sjåfører — og følger feil helt ned til årsaken.</p>
            <p className="note-stack">Flutter · iOS & Android · Firebase</p>
            <p className="note-date">Juni 2025 — nå</p>
          </Card>
        </div>
        <div className="plate-caption annotation"><span>01 / FORBINDELSER</span><span>ET UTVALG AV DET JEG BYGGER OG BRYR MEG OM</span></div>
      </section>

      <div className="story-insert annotation">
        <Thread start={526.7} end={500} label="01 / APPENE" />
        <NimmoApps apps={nimmoApps} />
        <Thread start={500} end={489.6} label="01 — 02" />
      </div>
      <div className="art-only-bridge"><Thread start={526.7} end={489.6} label="01 — 02" /></div>

      <section className="plate" id="utdanning" aria-label="Utdanning og IN5320">
        <Chapter number="02" title="Å FORSTÅ" />
        <Art name="education" alt="Et åpent bibliotek med varme lesesaler, bøker og diagrammer. Den røde tråden følger en vei gjennom etasjene." />
        <Card number="02" category="UTDANNING" title="Nysgjerrighet, satt i system." side="right" onOpen={() => openProject("education")} action="IN5320 — prosjektet bak en A">
          <div className="education-list">
            <div><span className="note-date">2026 — 2028 · PÅGÅENDE</span><h3>Master i Computer Science</h3><p>Universitetet i Sørøst-Norge<br />Forventet fullført juni 2028.</p></div>
            <div><span className="note-date">2022 — 2025</span><h3>Informatikk: design, bruk og interaksjon</h3><p>Bachelor · Universitetet i Oslo</p></div>
            <div><span className="note-date">30 STUDIEPOENG · UIO</span><h3>Enkeltemner på masternivå</h3><p>Blant annet IN5320: React, DHIS2 og datavisualisering. Karakter A i emnet.</p></div>
          </div>
        </Card>
        <div className="plate-caption annotation"><span>KUNNSKAP SOM BYGGESTEINER</span><span>UIO / USN</span></div>
      </section>

      <div className="story-insert annotation">
        <Thread start={472.9} end={500} label="02 / I PRAKSIS" />
        <EducationProject onOpen={() => openProject("education")} />
        <Thread start={500} end={500} label="VIDERE PÅ EGEN HÅND" />
        <HobbyIntro />
        <Thread start={500} end={502.4} label="02 — 03" />
      </div>
      <div className="art-only-bridge"><Thread start={472.9} end={502.4} label="02 — 03" /></div>

      <section className="plate" id="open-bfme" aria-label="Open BFME">
        <Chapter number="03" title="Å GJENSKAPE" />
        <Art name="bfme" alt="Minas Tirith i gravyrstil: en enorm klippe deler den hvite byen, med buede murringer på begge sider og et slankt hvitt tårn over citadellet. En rød tråd følger portene gjennom byen." />
        <Card number="03" category="OPEN SOURCE" title="Gamle verdener. Nye oppdagelser." side="lower-left" onOpen={() => openProject("bfme")} action="Utforsk bidragene">
          <p className="note-subtitle">OPEN BFME 1 & 2</p>
          <p>Å forstå et system ved å bygge det opp igjen. Jeg bidrar til rekonstruksjon av spillkode i C++ og ble invitert inn som collaborator i begge prosjektene.</p>
          <p className="note-stack">C++ · Reverse engineering · ABI</p>
        </Card>
        <div className="plate-caption annotation"><span>BAK FASADEN FINNES ET SYSTEM</span><span>BIDRAG TIL ET FELLES PROSJEKT</span></div>
      </section>

      <Thread start={523.1} end={501.6} label="03 — 04" />

      <section className="plate" id="aipodcast" aria-label="AIpodcast">
        <Chapter number="04" title="Å LYTTE" />
        <Art name="podcast" alt="Et fantasifullt lydbibliotek med konkylier, bøker, lydbånd og en tom lyttestol. Den røde tråden leder tilbake til lydkilden." />
        <Card number="04" category="PERSONLIG PROSJEKT" title="Et spørsmål. En kilde. En ny tanke." side="right" onOpen={() => openProject("podcast")}>
          <p className="note-subtitle">AIPODCAST</p>
          <p>Hva om du kunne snakke med en podkast? En AI-prototype som lar deg stille spørsmål — og høre akkurat hvor i opptaket svaret kommer fra.</p>
          <p className="note-stack">Flutter · TypeScript · pgvector · RAG</p>
        </Card>
        <div className="plate-caption annotation"><span>FØLG SVARET TILBAKE TIL KILDEN</span><span>PROTOTYPE / UTFORSKNING</span></div>
      </section>

      <Thread start={505.6} end={501.2} label="04 — 05" />

      <section className="plate" id="sjakk" aria-label="Sjakkprosjekt">
        <Chapter number="05" title="Å TENKE FREMOVER" />
        <Art name="chess" alt="En elfenbensfarget springer i et sjakklandskap av terrasser, broer og fjell. Den røde tråden følger mulige trekk gjennom landskapet." />
        <Card number="05" category="KODE & INTERESSE" title="Alltid et trekk til." side="right" onOpen={() => openProject("chess")}>
          <p className="note-subtitle">CHESS</p>
          <p>Jeg liker å se etter mønstre. På brettet, i koden og i forbindelsen mellom dem. Et desktop-verktøy for sjakkanalyse, motorintegrasjon og import av stillinger fra bilder.</p>
          <p className="note-stack">Electron · React · Python · Stockfish</p>
        </Card>
        <div className="plate-caption annotation"><span>ET LITE BRETT. STORE MULIGHETER.</span><span>PERSONLIG PROSJEKT</span></div>
      </section>

      <Thread start={522.7} end={546.3} label="05 — 06" />

      <section className="plate about-plate" id="om-meg" aria-label="Om meg og kontakt">
        <Chapter number="06" title="DET SOM BETYR NOE" />
        <Art name="about" alt="To tomme trestoler under et gammelt tre, vendt mot en solfylt fjord. Den røde tråden ender stille mellom stolene." />
        <figure className="about-portrait annotation">
          <picture><img src="/jacob-starheim.jpeg" alt="Portrett av Jacob Vindal Starheim" width={800} height={600} loading="lazy" decoding="async" /></picture>
          <figcaption>Jacob Vindal Starheim</figcaption>
        </figure>
        <Card number="06" category="OM MEG" title="Det er mer enn kode.">
          <p>Jeg er Jacob Vindal Starheim, <Age />utvikler og masterstudent med stor interesse for AI. Jeg følger utviklingen tett og liker å utforske hvordan nye modeller og verktøy kan brukes i praksis.</p>
          <p>Jeg er gift og liker å tilbringe tid med kona mi, venner og familie. Jeg er også glad i å reise, spille sjakk og videospill.</p>
          <div className="contact-links">
            <a href={`mailto:${email}`}>La oss snakke sammen <Arrow /></a>
            <a href={linkedin} target="_blank" rel="noopener noreferrer">LinkedIn <Arrow /></a>
            <a href={github} target="_blank" rel="noopener noreferrer">GitHub <Arrow /></a>
          </div>
          <a className="email-address" href={`mailto:${email}`}>{email}</a>
        </Card>
        <div className="plate-caption annotation"><span>TRÅDEN ENDER IKKE HER.</span><a href={`mailto:${email}`}>SI HEI <Arrow /></a></div>
      </section>

      <GitHubCalendar />
    </main>

    <footer className="site-footer">
      <div className="footer-top"><span className="footer-signature">Vi snakkes.</span><a href="#top">TILBAKE TIL TOPPEN <span aria-hidden="true">↑</span></a></div>
      <div className="footer-bottom"><span>© 2026 JACOB VINDAL STARHEIM</span><span>BYGGET MED NYSGJERRIGHET · KUNST LAGET MED OPENAI</span><a href={github} target="_blank" rel="noopener noreferrer">FLERE PROSJEKTER <Arrow /></a></div>
    </footer>

    <dialog ref={dialog} className="project-dialog" aria-labelledby="project-title" onCancel={closeProject} onClick={(event) => { if (event.target === event.currentTarget) closeProject(); }}>
      {selected && <div className="dialog-inner">
        <div className="dialog-top"><p className="eyebrow">{selected.eyebrow}</p><button className="close-button" onClick={closeProject} aria-label="Lukk prosjektdetaljer">×</button></div>
        <h2 id="project-title">{selected.title}</h2>
        <p className="dialog-lead">{selected.lead}</p>
        {selected.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        <h3>Mitt bidrag</h3>
        <ul className="contributions">{selected.contributions.map((contribution) => typeof contribution === "string"
          ? <li key={contribution}>{contribution}</li>
          : <li key={contribution.title} className="contribution-detail"><h4>{contribution.title}</h4><p>{contribution.description}</p></li>
        )}</ul>
        <p className="dialog-stack">{selected.stack.join(" / ")}</p>
        {selected.links && <div className="dialog-links">{selected.links.map((link) => <a key={link.href} className="text-link" href={link.href} target="_blank" rel="noopener noreferrer">{link.label}<Arrow /></a>)}</div>}
        <button className="dialog-back text-link" onClick={closeProject}>Tilbake til historien <span aria-hidden="true">↩</span></button>
      </div>}
    </dialog>
  </>;
}
