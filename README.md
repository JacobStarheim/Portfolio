# Jacob Starheim — En rød tråd

En kunstnerisk, norskspråklig portefølje for Jacob Vindal Starheim. Seks AI-genererte, gravyrpregede kunstmotiver knyttes sammen av en rød tråd: NIMMO, utdanning, Open BFME, AIpodcast, sjakk og livet utenfor koden.

Bygget med Next.js, React og TypeScript. Statisk eksport: ingen database, API-nøkler, chat eller kontaktskjema. Kontakt skjer via e-post, LinkedIn og GitHub.

## Kjør lokalt

```sh
npm ci
npm run dev
```

## Kontroller og produksjonsbygg

```sh
npm run typecheck
npm run lint
npm run build
npm start
```

`npm run build` eksporterer til `out/`. `npm start` serverer denne mappen på port 3000. Ikke bruk `next start` for statisk eksport.

## Innhold og design

- `src/components/portfolio.tsx`: innhold, prosjektvisninger, kontaktlenker og tilgjengelig meny/dialog.
- `src/styles/portfolio.css`: gallerilayout, kort, mobilvisning og reduserte animasjoner.
- `src/app/layout.tsx`: metadata og lokale fonter.
- `public/art/`: ferdige WebP-bilder, 1254 px og 640 px, uten tekst.
- `docs/artwork-prompts.md`: eksakte genereringsprompter.

Desktop viser hele bildene i sidebredden med tekstkort oppå. På mobil vises hele bildet og deretter kortet, uten å skjule motivet. «Bare kunsten» skjuler tekstlagene. Prosjektdetaljer vises i en tastaturtilgjengelig, innebygd dialog.

## Generering av kunst

Bildene ble laget med det innebygde OpenAI-bildeverktøyet. Den godkjente sjakkillustrasjonen ble brukt som stilreferanse for de fem øvrige motivene. Verktøyet eksponerte ikke eksakt modellvariant eller snapshot; ikke anta at en bestemt API-variant ble valgt.

Originale PNG-filer oppbevares separat fra nettsiderepoet. For å lage nye nettversjoner fra en mappe med `nimmo.png`, `education.png`, `bfme.png`, `podcast.png`, `chess.png` og `about.png`:

```sh
node scripts/prepare-art.mjs /absolutt/sti/til/originaler
```

Skriptet endrer bare størrelse og komprimeringsformat, ikke motivet.

## Publisering

Vercel-prosjekt: `jacobstarheim`, under `jacobs-projects-deb8c182`. Bruk en forhåndsvisning før produksjon:

```sh
npx vercel deploy -y
```

Arbeidsgrenen for den nye porteføljen er `codex/art-portfolio`. GitHub-koblingen til `JacobStarheim/Portfolio` må være aktiv i Vercel før pushes kan bygge automatisk. Med koblingen aktiv gir arbeidsgrener forhåndsvisninger; en push eller merge til produksjonsgrenen `main` kan publisere produksjon. Ikke merge før versjonen er godkjent.

Vercel-forhåndsvisninger er merket `noindex`; produksjonsbygg kan indekseres. `VERCEL_URL` brukes som basis for delingsmetadata ved bygg på Vercel. Bygg fra kildekoden på Vercel, ikke last opp en lokal `out/` med localhost-metadata. `.env*` og lokal Vercel-autentisering skal verken pushes eller lastes opp.

## Vedlikehold av faktainnhold

- NIMMO-stillingen er deltid, startet 10. juni 2025. Teksten står som pågående per september 2026. Oppdater til avsluttet periode etter planlagt siste arbeidsdag 18. oktober 2026.
- UiO-bachelor: august 2022–juni 2025.
- 30 studiepoeng enkeltemner på masternivå ved UiO, inkludert IN5320 med A. Dette omtales ikke som en fullført mastergrad.
- USN-master: pågående fra august 2026, forventet fullføring juni 2028.
- Gruppeprosjekter, upstream-bidrag og personlige prototyper er skilt fra hverandre. Ingen påstander om arbeidseffekt basert på kodevolum.
- Intern NIMMO-dokumentasjon, private repoer, innloggingsopplysninger og personlige medier er ikke publisert.

Visuell inspirasjon: [kind av Kengo Works](https://www.kengoworks.com/kind). Illustrasjonene er originale og ikke kopiert fra referansen.
