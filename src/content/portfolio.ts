import type { Locale } from "@/lib/language";
import { getProjectDetails, type Project } from "./project-details";

// Loaded by the page on the server. Only the selected language is passed to the
// interactive gallery, rather than bundling both dictionaries in the client.
const norwegian = {
  ui: {
    skip: "Hopp til innhold", home: "Jacob Starheim, til toppen", navigation: "Hovedmeny",
    work: "Arbeid", education: "Utdanning", projects: "Prosjekter", about: "Om meg",
    showText: "Vis teksten", artOnly: "Bare kunsten", closeMenu: "Lukk meny", openMenu: "Åpne meny",
    followThread: "FØLG TRÅDEN", readProject: "Les om prosjektet", closeProject: "Lukk prosjektdetaljer",
    contribution: "Mitt bidrag", back: "Tilbake til historien", storePreposition: "i",
  },
  hero: {
    label: "Introduksjon og NIMMO", eyebrow: "PROGRAMVAREUTVIKLER",
    leadStart: "Jeg bygger ting som knytter", leadEnd: "mennesker, ideer og teknologi sammen.",
    scroll: "EN RØD TRÅD GJENNOM DET JEG GJØR", vertical: "MOBIL / MENNESKER / MULIGHETER",
    alt: "En gravert kystby med broer og en telefonformet portal. En rød tråd forbinder byen fra topp til bunn.",
    category: "ARBEIDSERFARING", title: "Mobilutvikling hos NIMMO", action: "Arbeidet mitt hos NIMMO",
    subtitle: "NIMMO · JUNIORUTVIKLER · DELTID",
    description: "Hos NIMMO utvikler jeg mobilapper i Flutter for reisende og sjåfører. Jeg bidrar med nye funksjoner, bedre tilgjengelighet, testing og publisering til App Store og Google Play. Sammen med teamet undersøker og løser jeg også feil på tvers av appene og backend.",
    date: "Juni 2025 — nå", caption: "01 / FORBINDELSER", note: "ET UTVALG AV DET JEG BYGGER OG BRYR MEG OM",
  },
  apps: {
    traveller: {
      audience: "TRAVELLER · FOR REISENDE", title: "En enklere vei dit du skal.", chapter: "Å KOMME FREM",
      alt: "En gravert fjordby med en minibuss, en foresatt og et barn ved holdeplassen. En rød tråd forbinder hjemmene med reisen og aktivitetene i bygda.",
      description: "Appen for reisende og foresatte: finn og bestill delt transport, se billettene dine og følg turen på kartet.",
      contribution: "Mitt arbeid spenner fra reisesøk og booking til innlogging, barneflyter og tilgjengelighet — og videre til testdistribusjon og publisering.",
      caption: "FRA HJEM TIL HVERDAGENS AKTIVITETER",
    },
    driver: {
      audience: "DRIVER · FOR SJÅFØRER", title: "Oversikt hele veien.", chapter: "Å VISE VEI",
      alt: "Utsikt fra førerplassen i en minibuss, med ratt, fjordvei og passasjerer ved to holdeplasser. Den røde tråden følger turen fra stopp til stopp.",
      description: "Sjåførens verktøy for gjennomføring av turen, med oversikt over kjørerute, passasjerer og hvor de skal hentes og leveres.",
      contribution: "Jeg jobber med videreutvikling, feilretting og tilgjengelighet, samspillet med backend, testdistribusjon og publisering til begge appbutikkene.",
      caption: "MENNESKENE BAK HVERT STOPP",
    },
    team: "EN DEL AV NIMMO-TEAMET",
  },
  education: {
    label: "Utdanning og IN5320", chapter: "Å FORSTÅ",
    alt: "Et åpent bibliotek med varme lesesaler, bøker og diagrammer. Den røde tråden følger en vei gjennom etasjene.",
    category: "UTDANNING", title: "Utdanning", action: "IN5320 — prosjektet bak en A",
    items: [
      { date: "2026 — 2028 · PÅGÅENDE", title: "Master i Computer Science", institution: "Universitetet i Sørøst-Norge", detail: "Forventet fullført juni 2028." },
      { date: "2022 — 2025", title: "Informatikk: design, bruk og interaksjon", institution: "Bachelor · Universitetet i Oslo", detail: "" },
      { date: "30 STUDIEPOENG · UIO", title: "Enkeltemner på masternivå", institution: "Blant annet IN5320: React, DHIS2 og datavisualisering. Karakter A i emnet.", detail: "" },
    ],
    caption: "KUNNSKAP SOM BYGGESTEINER",
  },
  in5320: {
    label: "IN5320 skoleinspeksjonsverktøy", chapter: "Å SE SAMMENHENGER",
    alt: "Tre små skoler i et gravert landskap. En rød tråd fører fra klasserommene til en åpen protokoll og diagrammer for sammenligning, utvikling og fordeling.",
    category: "UIO · GRUPPEPROSJEKT", title: "Fra skoledata til innsikt.", action: "Les om IN5320", subtitle: "IN5320 · HØSTEN 2025 · A I EMNET",
    description: "Et skoleinspeksjonsverktøy bygget med React og DHIS2. Mitt hovedbidrag var analysemodulen: å hente, bearbeide og visualisere data om skolenes ressurser.",
    detail: "Egne SVG-diagrammer gjør det lettere å sammenligne skoler og følge utvikling over tid.",
    stack: "React · DHIS2 · SVG · Datavisualisering", code: "Se koden på GitHub", caption: "FRA OBSERVASJON TIL FORSTÅELSE", note: "30 STUDIEPOENG PÅ MASTERNIVÅ VED UIO",
  },
  hobbies: {
    label: "Hobbyprosjekter og open source", chapter: "Å PRØVE SEG FREM",
    alt: "Et gravert verksted med en halvferdig steinby, en sjakkspringer og et lydapparat på en bok. En rød tråd forbinder prosjektene over arbeidsbenken.",
    category: "HOBBYPROSJEKTER & OPEN SOURCE", title: "Det jeg bygger på fritiden.",
    description: "Spill jeg vil forstå, ideer jeg vil prøve og interesser jeg vil utforske videre. Noe bygger jeg selv, annet bidrar jeg til sammen med andre.",
    detail: "Herfra følger tråden tre av prosjektene jeg bruker fritiden på.", navigation: "Hobbyprosjekter", caption: "ET VERKSTED FOR EGNE IDEER", note: "NYSGJERRIGHET UTEN PENSUM",
  },
  bfme: {
    chapter: "Å GJENSKAPE",
    alt: "Minas Tirith i gravyrstil: en enorm klippe deler den hvite byen, med buede murringer på begge sider og et slankt hvitt tårn over citadellet. En rød tråd følger portene gjennom byen.",
    title: "Open source-bidrag til BFME", action: "Utforsk bidragene",
    description: "Jeg bidrar til Open BFME, som rekonstruerer spillkoden til Ringenes herre-spillene Battle for Middle-earth 1 og 2. Gjennom reverse engineering analyserer jeg hvordan spillene fungerer og gjenskaper deler av funksjonaliteten i C++. Bidragene mine er tatt inn i begge prosjektene, og jeg ble invitert inn som collaborator.",
    caption: "BAK FASADEN FINNES ET SYSTEM", note: "BIDRAG TIL ET FELLES PROSJEKT",
  },
  podcast: {
    chapter: "Å LYTTE",
    alt: "Et fantasifullt lydbibliotek med konkylier, bøker, lydbånd og en tom lyttestol. Den røde tråden leder tilbake til lydkilden.",
    category: "PERSONLIG PROSJEKT", title: "Et spørsmål. En kilde. En ny tanke.",
    description: "Hva om du kunne snakke med en podkast? En AI-prototype som lar deg stille spørsmål og høre akkurat hvor i opptaket svaret kommer fra.",
    caption: "FØLG SVARET TILBAKE TIL KILDEN", note: "PROTOTYPE / UTFORSKNING",
  },
  chess: {
    label: "Sjakkprosjekt", chapter: "Å TENKE FREMOVER",
    alt: "En elfenbensfarget springer i et sjakklandskap av terrasser, broer og fjell. Den røde tråden følger mulige trekk gjennom landskapet.",
    category: "KODE & INTERESSE", title: "Alltid et trekk til.",
    description: "Et lokalt desktop-verktøy for sjakkanalyse med Stockfish, Leela Chess Zero (Lc0) og støtte for andre UCI-motorer. MultiPV viser flere trekkvarianter samtidig. Lokale Syzygy-sluttspillbaser gir oppslag på utfall og beste trekk for støttede sluttspill. Bildegjenkjenning lar deg importere brettstillinger fra bilder eller kamera og kontrollere dem før analyse.",
    caption: "ET LITE BRETT. STORE MULIGHETER.", note: "PERSONLIG PROSJEKT",
  },
  about: {
    label: "Om meg og kontakt", chapter: "DET SOM BETYR NOE",
    alt: "To tomme trestoler under et gammelt tre, vendt mot en solfylt fjord. Den røde tråden ender stille mellom stolene.",
    portrait: "Portrett av Jacob Vindal Starheim", category: "OM MEG", title: "Det er mer enn kode.",
    introduction: "Jeg er Jacob Vindal Starheim, ",
    description: "utvikler og masterstudent med stor interesse for AI. Jeg følger utviklingen tett og liker å utforske hvordan nye modeller og verktøy kan brukes i praksis.",
    personal: "Jeg er gift og liker å tilbringe tid med kona mi, venner og familie. Jeg er også glad i å reise, spille sjakk og videospill.",
    contact: "La oss snakke sammen", caption: "TRÅDEN ENDER IKKE HER.", hello: "SI HEI",
  },
  footer: {
    signature: "Vi snakkes.", top: "TILBAKE TIL TOPPEN", credit: "BYGGET MED NYSGJERRIGHET · KUNST LAGET MED OPENAI", projects: "FLERE PROSJEKTER",
  },
};

const english: typeof norwegian = {
  ui: {
    skip: "Skip to content", home: "Jacob Starheim, back to top", navigation: "Main navigation",
    work: "Work", education: "Education", projects: "Projects", about: "About me",
    showText: "Show the text", artOnly: "Just the art", closeMenu: "Close menu", openMenu: "Open menu",
    followThread: "FOLLOW THE THREAD", readProject: "About the project", closeProject: "Close project details",
    contribution: "My contribution", back: "Back to the story", storePreposition: "on",
  },
  hero: {
    label: "Introduction and NIMMO", eyebrow: "SOFTWARE DEVELOPER",
    leadStart: "I build things that bring", leadEnd: "people, ideas and technology together.",
    scroll: "A COMMON THREAD THROUGH WHAT I DO", vertical: "MOBILE / PEOPLE / POSSIBILITIES",
    alt: "An engraved coastal town with bridges and a phone-shaped portal. A red thread connects the town from top to bottom.",
    category: "WORK EXPERIENCE", title: "Mobile development at NIMMO", action: "My work at NIMMO",
    subtitle: "NIMMO · JUNIOR DEVELOPER · PART-TIME",
    description: "At NIMMO, I develop mobile apps in Flutter for passengers and drivers. My contributions include new features, improved accessibility, testing and releases to the App Store and Google Play. Together with the team, I also investigate and fix issues across the apps and backend.",
    date: "June 2025 — present", caption: "01 / CONNECTIONS", note: "A SELECTION OF WHAT I BUILD AND CARE ABOUT",
  },
  apps: {
    traveller: {
      audience: "TRAVELLER · FOR PASSENGERS", title: "An easier way to get there.", chapter: "GETTING THERE",
      alt: "An engraved fjord town with a minibus, a parent and a child at a stop. A red thread connects homes with journeys and activities in the village.",
      description: "The app for passengers and parents: find and book shared transport, view your tickets and follow your journey on the map.",
      contribution: "My work ranges from journey search and booking to sign-in, child-related flows and accessibility — as well as test distribution and releases.",
      caption: "FROM HOME TO EVERYDAY ACTIVITIES",
    },
    driver: {
      audience: "DRIVER · FOR DRIVERS", title: "A clear view, all the way.", chapter: "GUIDING THE WAY",
      alt: "The view from a minibus driver’s seat, with a steering wheel, a fjord road and passengers at two stops. The red thread follows the journey from stop to stop.",
      description: "A driver’s tool for running a trip, with an overview of the route, passengers and where to pick them up and drop them off.",
      contribution: "I work on ongoing development, bug fixes, accessibility, backend integration, test distribution and releases to both app stores.",
      caption: "THE PEOPLE BEHIND EVERY STOP",
    },
    team: "PART OF THE NIMMO TEAM",
  },
  education: {
    label: "Education and IN5320", chapter: "UNDERSTANDING",
    alt: "An open library with warmly lit reading rooms, books and diagrams. The red thread follows a path through the floors.",
    category: "EDUCATION", title: "Education", action: "IN5320 — the project behind an A",
    items: [
      { date: "2026 — 2028 · IN PROGRESS", title: "MSc in Computer Science", institution: "University of South-Eastern Norway", detail: "Expected graduation: June 2028." },
      { date: "2022 — 2025", title: "Informatics: Design, Use and Interaction", institution: "Bachelor’s degree · University of Oslo", detail: "" },
      { date: "30 ECTS CREDITS · UIO", title: "Individual master’s-level courses", institution: "Including IN5320: React, DHIS2 and data visualisation. Grade A in the course.", detail: "" },
    ],
    caption: "KNOWLEDGE AS BUILDING BLOCKS",
  },
  in5320: {
    label: "IN5320 school inspection tool", chapter: "SEEING CONNECTIONS",
    alt: "Three small schools in an engraved landscape. A red thread leads from the classrooms to an open ledger and charts for comparisons, trends and distributions.",
    category: "UIO · GROUP PROJECT", title: "From school data to insight.", action: "About IN5320", subtitle: "IN5320 · AUTUMN 2025 · GRADE A IN THE COURSE",
    description: "A school inspection tool built with React and DHIS2. My main contribution was the analytics module: fetching, processing and visualising data on school resources.",
    detail: "Custom SVG charts make it easier to compare schools and track changes over time.",
    stack: "React · DHIS2 · SVG · Data visualisation", code: "View the code on GitHub", caption: "FROM OBSERVATION TO UNDERSTANDING", note: "30 MASTER’S-LEVEL ECTS CREDITS AT UIO",
  },
  hobbies: {
    label: "Personal projects and open source", chapter: "EXPERIMENTING",
    alt: "An engraved workshop with an unfinished stone city, a chess knight and an audio device on a book. A red thread connects the projects across the workbench.",
    category: "PERSONAL PROJECTS & OPEN SOURCE", title: "What I build in my spare time.",
    description: "Games I want to understand, ideas I want to try and interests I want to explore further. Some things I build myself; others I contribute to with others.",
    detail: "From here, the thread follows three projects I spend my free time on.", navigation: "Personal projects", caption: "A WORKSHOP FOR MY OWN IDEAS", note: "CURIOSITY BEYOND THE CURRICULUM",
  },
  bfme: {
    chapter: "RECONSTRUCTING",
    alt: "Minas Tirith in an engraving style: an enormous rock divides the white city, with curved rings of walls on both sides and a slender white tower above the citadel. A red thread follows the gates through the city.",
    title: "Open-source contributions to BFME", action: "Explore my contributions",
    description: "I contribute to Open BFME, which reconstructs the game code of the Lord of the Rings games Battle for Middle-earth 1 and 2. Through reverse engineering, I analyse how the games work and recreate parts of their functionality in C++. My contributions have been merged into both projects, and I was invited to become a collaborator.",
    caption: "BEHIND THE FACADE IS A SYSTEM", note: "CONTRIBUTING TO A SHARED PROJECT",
  },
  podcast: {
    chapter: "LISTENING",
    alt: "An imaginative audio library with seashells, books, recording tapes and an empty listening chair. The red thread leads back to the audio source.",
    category: "PERSONAL PROJECT", title: "A question. A source. A new thought.",
    description: "What if you could talk to a podcast? An AI prototype that lets you ask questions and hear exactly where in the recording the answer comes from.",
    caption: "FOLLOW THE ANSWER BACK TO ITS SOURCE", note: "PROTOTYPE / EXPLORATION",
  },
  chess: {
    label: "Chess project", chapter: "THINKING AHEAD",
    alt: "An ivory-coloured knight in a chess landscape of terraces, bridges and mountains. The red thread traces possible moves through the landscape.",
    category: "CODE & CURIOSITY", title: "Always another move.",
    description: "A local desktop chess analysis tool with Stockfish, Leela Chess Zero (Lc0) and support for other UCI engines. MultiPV displays several move variations at once. Local Syzygy tablebases provide outcomes and best moves for covered endgame positions. Image recognition lets you import board positions from images or a camera and review them before analysis.",
    caption: "A SMALL BOARD. BIG POSSIBILITIES.", note: "PERSONAL PROJECT",
  },
  about: {
    label: "About me and contact", chapter: "WHAT MATTERS",
    alt: "Two empty wooden chairs under an old tree, facing a sunlit fjord. The red thread comes to a quiet end between the chairs.",
    portrait: "Portrait of Jacob Vindal Starheim", category: "ABOUT ME", title: "There’s more than code.",
    introduction: "I’m Jacob Vindal Starheim, ",
    description: "a developer and master’s student with a keen interest in AI. I follow developments closely and enjoy exploring how new models and tools can be used in practice.",
    personal: "I’m married and enjoy spending time with my wife, friends and family. I also love travelling, playing chess and video games.",
    contact: "Let’s talk", caption: "THE THREAD DOESN’T END HERE.", hello: "SAY HELLO",
  },
  footer: {
    signature: "Talk soon.", top: "BACK TO THE TOP", credit: "BUILT WITH CURIOSITY · ART CREATED WITH OPENAI", projects: "MORE PROJECTS",
  },
};

export type PortfolioContent = typeof norwegian & { projects: Record<string, Project> };

export function getPortfolioContent(locale: Locale): PortfolioContent {
  return { ...(locale === "en" ? english : norwegian), projects: getProjectDetails(locale) };
}
