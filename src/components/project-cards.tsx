type StoreLink = { label: string; href: string };

type MobileApp = {
  id: string;
  number: string;
  audience: string;
  name: string;
  description: string;
  contribution: string;
  features: string[];
  stores: StoreLink[];
};

function ExternalArrow() { return <span aria-hidden="true">↗</span>; }

export function NimmoApps({ apps }: { apps: MobileApp[] }) {
  return <section className="project-insert" id="nimmo-apper" aria-labelledby="apps-heading">
    <div className="insert-heading">
      <p className="eyebrow"><span className="red-dot" aria-hidden="true" /> NIMMO · PRODUKTENE</p>
      <h2 id="apps-heading">Appene jeg jobber med.</h2>
      <p>To Flutter-apper for ulike deler av samme reise. Jeg bidrar til begge som en del av NIMMO-teamet.</p>
    </div>
    <div className="mobile-app-grid">
      {apps.map((app) => <article className="project-sheet mobile-app-card" key={app.id} id={app.id} aria-labelledby={`${app.id}-title`}>
        <div className="sheet-meta"><span>{app.audience}</span><span>{app.number}</span></div>
        <h3 id={`${app.id}-title`}>{app.name}</h3>
        <p className="app-purpose">{app.description}</p>
        <ul className="app-features" aria-label="Funksjoner">{app.features.map((feature) => <li key={feature}>{feature}</li>)}</ul>
        <div className="app-contribution"><h4>Mitt arbeid</h4><p>{app.contribution}</p></div>
        <div className="app-store-links">{app.stores.map((store) => <a key={store.href} href={store.href} target="_blank" rel="noopener noreferrer" aria-label={`${app.name} i ${store.label}`}><span>{store.label}</span><ExternalArrow /></a>)}</div>
        <p className="sheet-stack">Flutter / Dart / Android / iOS</p>
      </article>)}
    </div>
    <p className="insert-source"><a href="https://www.nimmo.app/no" target="_blank" rel="noopener noreferrer">Mer om produktene hos Nimmo <ExternalArrow /></a></p>
  </section>;
}

export function EducationProject({ onOpen }: { onOpen: () => void }) {
  return <section className="project-insert" id="in5320" aria-labelledby="in5320-heading">
    <article className="project-sheet course-project">
      <div className="course-overview">
        <div className="sheet-meta"><span>UIO · GRUPPEPROSJEKT</span><span>02.A</span></div>
        <h2 id="in5320-heading">IN5320</h2>
        <p className="course-subtitle">Fra skoledata til innsikt.</p>
        <p>Et skoleinspeksjonsverktøy bygget med React og DHIS2. Mitt hovedbidrag var analysemodulen: å hente, bearbeide og presentere data slik at skoler kunne sammenlignes og utvikling følges over tid.</p>
        <div className="course-result"><span className="course-grade" aria-hidden="true">A</span><p><strong>Karakter A i emnet</strong><span>Høsten 2025 · del av 30 studiepoeng på masternivå</span></p></div>
      </div>
      <div className="course-contributions">
        <p className="eyebrow">MINE BIDRAG I GRUPPEPROSJEKTET</p>
        <ol className="course-work">
          <li><span>01</span><div><h3>Fra API til analyse</h3><p>DHIS2 Tracker-data, parsing og beregninger som grunnlag for dashbordet.</p></div></li>
          <li><span>02</span><div><h3>Visualisering som forklarer</h3><p>Egne SVG-diagrammer for tidsserier og sammenligning av skoler.</p></div></li>
          <li><span>03</span><div><h3>Gjenbrukbare byggesteiner</h3><p>Delte React-komponenter og mellomlagring av skoledata.</p></div></li>
        </ol>
        <p className="sheet-stack">React / JavaScript / DHIS2 / SVG</p>
        <div className="course-actions">
          <button className="text-link" onClick={onOpen}>Les om IN5320 <ExternalArrow /></button>
          <a className="text-link" href="https://github.com/JacobStarheim/IN5320" target="_blank" rel="noopener noreferrer">Se koden på GitHub <ExternalArrow /></a>
        </div>
      </div>
    </article>
  </section>;
}

export function HobbyIntro() {
  return <section className="project-insert" id="hobbyprosjekter" aria-labelledby="hobby-heading">
    <div className="hobby-intro">
      <p className="eyebrow"><span className="red-dot" aria-hidden="true" /> HOBBYPROSJEKTER & OPEN SOURCE</p>
      <h2 id="hobby-heading">Det jeg bygger på fritiden.</h2>
      <p>Spill jeg vil forstå, ideer jeg vil prøve og interesser jeg vil utforske videre. Her er noen av prosjektene jeg bruker fritiden på.</p>
      <nav className="hobby-links" aria-label="Hobbyprosjekter">
        <a href="#open-bfme"><span>01</span> Open BFME <span aria-hidden="true">↓</span></a>
        <a href="#aipodcast"><span>02</span> AIpodcast <span aria-hidden="true">↓</span></a>
        <a href="#sjakk"><span>03</span> Chess <span aria-hidden="true">↓</span></a>
      </nav>
    </div>
  </section>;
}
