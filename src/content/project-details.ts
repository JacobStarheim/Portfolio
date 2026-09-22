const github = "https://github.com/JacobStarheim";

export type Project = {
  title: string; eyebrow: string; lead: string; body: string[];
  contributions: (string | { title: string; description: string })[]; stack: string[];
  links?: { label: string; href: string }[];
};

const norwegian: Record<string, Project> = {
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
    lead: "Sjakkanalyse med flere motorer og AI-basert bildeimport",
    body: ["Chess er et lokalt desktop-verktøy for å utforske stillinger og analysere partier med Stockfish, Leela Chess Zero (Lc0) og andre UCI-motorer.", "AI-basert bildegjenkjenning gjør det mulig å importere brettstillinger fra bilder eller kamera. En lokal Python-prosess bruker OpenCV til å rotere, beskjære og rette opp perspektivet, før en forhåndstrent modell fra chessimg2pos tolker brikkeplasseringen. Resultatet kan kontrolleres og korrigeres i bretteditoren før analyse.", "Appen integrerer eksisterende sjakkmotorer og en forhåndstrent bildegjenkjenningsmodell. Mitt arbeid er brukergrensesnittet og integrasjonen mellom motorer, sjakkdata, bildebehandling og manuell kontroll av importerte stillinger."],
    contributions: ["Integrert Stockfish og Lc0 gjennom UCI-protokollen, med MultiPV for visning av flere trekkvarianter.", "Jobbet med FEN/PGN og lokale Syzygy-sluttspillbaser.", "Integrert en forhåndstrent AI-modell fra chessimg2pos for gjenkjenning av brikkeplassering fra bilder og kamera.", "Bygget bildebehandling med Python og OpenCV, med kontroll og korrigering av resultatet i bretteditoren.", "Koblet dette sammen i en Electron-app med React og TypeScript."],
    stack: ["Electron", "React", "TypeScript", "Python", "OpenCV", "chessimg2pos", "UCI"],
    links: [{ label: "Se Chess på GitHub", href: `${github}/chess` }],
  },
};

const english: Record<string, Project> = {
  nimmo: {
    title: "Mobile development, with people at its heart.", eyebrow: "NIMMO · WORK EXPERIENCE",
    lead: "Junior software developer, part-time · June 2025–present",
    body: ["At NIMMO, I work on Traveller and Driver: two Flutter apps for passengers and drivers. I have contributed new features, improvements and bug fixes to both apps.", "My work spans user flows and accessibility, testing and releases, and troubleshooting across apps, data and the backend. I like to trace a problem from what the user experiences to its root cause — and work with the team to find a solution."],
    contributions: [
      {
        title: "Mobile development in Traveller and Driver",
        description: "Built and improved Flutter/Dart features for journey search, booking fixed and dynamic routes, tickets, maps, vehicle positions and estimated arrival times (ETA). I have also worked on sign-in, profiles, and flows for parents, guardians and children.",
      },
      {
        title: "User experience and accessibility",
        description: "Adapted the apps for larger text and small screens, implemented Android SMS autofill, and worked on languages, translations, caching, date handling and receipts. Making features work well in practice on both Android and iOS has been important to me.",
      },
      {
        title: "Troubleshooting across the system",
        description: "Used Firebase/Firestore, SQL and the backend code in the monorepo to investigate booking failures, access to private routes, synchronisation issues and incorrect ETA data. Working with backend developers, I have provided concrete reproductions, identified root causes and tested fixes. In several cases, I have also proposed specific solutions and the backend code changes needed.",
      },
      {
        title: "Quality and initiative",
        description: "Found and reported bugs, suggested improvements, and followed up on issues with developers and QA. I have worked on validation tests, the Firebase Emulator and refactoring for better testability, and initiated discussions about test strategy and how the product should behave.",
      },
      {
        title: "Test distribution and releases",
        description: "Built and distributed test versions of both Traveller and Driver through Firebase App Distribution. I have also published the apps to Google Play and the Apple App Store.",
      },
      {
        title: "AI-assisted development and security analysis",
        description: "Used AI actively for implementation, code analysis, debugging and reviewing changes, combined with testing and follow-up on concrete findings. I have also contributed to security analysis with Codex Security.",
      },
      {
        title: "Taking responsibility when it matters",
        description: "Taken initiative and helped resolve critical bugs, including outside regular working hours. When issues have affected users and operations, I have focused on understanding the cause and following them through to a solution.",
      },
    ],
    stack: ["Flutter", "Dart", "Android / iOS", "Firebase", "Firestore", "SQL", "Firebase Emulator", "Firebase App Distribution", "Jira", "Codex Security"],
  },
  education: {
    title: "From data to understanding.", eyebrow: "UIO · IN5320",
    lead: "Group project in IN5320 · autumn 2025 · grade A in the course",
    body: ["A school inspection tool built with React and DHIS2. My contribution focused on the analytics module: from retrieving and processing data to views that make it easier to compare schools and track change over time.", "IN5320 was part of 30 ECTS credits of individual master's-level courses I took at the University of Oslo after my bachelor's degree. This was a group project; the description here covers my own contributions."],
    contributions: ["Connected DHIS2 Tracker data to parsing, calculations and dashboards.", "Built custom SVG charts for time series and school comparisons.", "Worked on resource ratios, compliance with standards and gender parity.", "Created shared React components and caching for school data."],
    stack: ["React", "JavaScript", "DHIS2", "SVG", "Data visualisation"],
    links: [{ label: "View the project on GitHub", href: `${github}/IN5320` }],
  },
  bfme: {
    title: "Understanding a world from within.", eyebrow: "OPEN BFME · OPEN SOURCE",
    lead: "Contributions to Open BFME 1 and 2 · C++ / reverse engineering",
    body: ["There is something special about opening up an old game and trying to understand how its world actually works. In Open BFME, I help reconstruct existing game code with the correct structure and binary behaviour.", "My contributions have been merged into both projects, and the maintainer invited me to become a collaborator. The work includes both completed contributions and ongoing investigation, with AI assistance as part of my toolkit."],
    contributions: ["Contributed to STLport, memory layout and ABI compatibility.", "Worked on graphics data, matrices and material copying.", "Investigated and reconstructed parts of the networking and map functionality.", "Documented what has been verified and what remains unresolved."],
    stack: ["C++", "Reverse engineering", "ABI", "Game technology"],
    links: [{ label: "Contributions to BFME 1", href: "https://github.com/Open-BFME/Open-BFME-1/pulls?q=is%3Apr+author%3AJacobStarheim+is%3Amerged" }, { label: "Contributions to BFME 2", href: "https://github.com/Open-BFME/Open-BFME-2/pulls?q=is%3Apr+author%3AJacobStarheim+is%3Amerged" }],
  },
  podcast: {
    title: "Good answers have a source.", eyebrow: "AIPODCAST · PERSONAL PROJECT",
    lead: "A voice-controlled AI prototype for exploring podcasts",
    body: ["The idea is simple: ask a podcast a question, get an answer, and go straight to the moment in the recording that supports it. To me, finding the way back to the source is just as important as the answer itself.", "The prototype connects a Flutter client to a TypeScript API, a background process for RSS and transcription, and PostgreSQL with pgvector. It integrates existing AI models and is an exploratory project, not a finished, launched product."],
    contributions: ["Connected voice recording, transcription, questions and spoken answers in a single user flow.", "Preserved timestamps through segmentation, search and answers.", "Created source excerpts that link back to the original audio.", "Worked on handling weak search matches and missing sources."],
    stack: ["Flutter", "TypeScript", "PostgreSQL", "pgvector", "RAG"],
    links: [{ label: "Explore AIpodcast on GitHub", href: `${github}/AIpodcast` }],
  },
  chess: {
    title: "Always one more move.", eyebrow: "CHESS · PERSONAL PROJECT",
    lead: "Multi-engine chess analysis with AI-based image import",
    body: ["Chess is a local desktop tool for exploring positions and analysing games with Stockfish, Leela Chess Zero (Lc0) and other UCI engines.", "AI-based image recognition makes it possible to import board positions from images or a camera. A local Python process uses OpenCV to rotate, crop and correct the perspective before a pretrained model from chessimg2pos recognises the piece placement. The result can be reviewed and corrected in the board editor before analysis.", "The app integrates existing chess engines and a pretrained image recognition model. My work is the user interface and the integration between engines, chess data, image processing and manual review of imported positions."],
    contributions: ["Integrated Stockfish and Lc0 through the UCI protocol, with MultiPV to display multiple move variations.", "Worked with FEN/PGN and local Syzygy endgame tablebases.", "Integrated a pretrained AI model from chessimg2pos to recognise piece placement from images and camera captures.", "Built image processing with Python and OpenCV, with review and correction of the result in the board editor.", "Connected these pieces in an Electron app with React and TypeScript."],
    stack: ["Electron", "React", "TypeScript", "Python", "OpenCV", "chessimg2pos", "UCI"],
    links: [{ label: "View Chess on GitHub", href: `${github}/chess` }],
  },
};

export function getProjectDetails(locale: "no" | "en"): Record<string, Project> {
  return locale === "no" ? norwegian : english;
}
