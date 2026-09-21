# Kunstprompter

Illustrasjonene er laget med innebygd OpenAI-bildegenerering. Sjakkbildet ble godkjent av Jacob og brukt som stilreferanse for den opprinnelige serien. Fire nye bilder viderefører samme graverte stil; de seks eksisterende bildene er uendret. Tekst og interaksjon er separat HTML. Verktøyet eksponerer verken modellvalg eller verifiserbar modellidentitet, så en bestemt modellvariant eller et bestemt snapshot kan ikke bekreftes.

## Serien i visningsrekkefølge

NIMMO arbeid → Traveller → Driver → Utdanning → IN5320 → Hobbyprosjekter → Open BFME → AIpodcast → Sjakk → Om meg.

De fire nye kapitlene har separate prompt- og kildenotater:

- [Traveller](art-traveller-prompt.md): delt reise fra hjem til aktivitet, med hentested, passasjerer og et nordisk lokalsamfunn.
- [Driver](art-driver-prompt.md): sjåførens perspektiv, rute og hentestopp gjennom et gravert førerhus.
- [IN5320](art-in5320-prompt.md): skoleobservasjoner og ressursdata som blir til sammenlignbar innsikt, basert på analysemodulen i prosjektet.
- [Hobbyintroduksjon](art-hobbies-prompt.md): et sammenhengende verksted med arkitekturmodell, sjakkbrikke og lydapparat som innleder de personlige prosjektene.

Nimmo-kildene brukes for produktforståelse, ikke som designreferanse. IN5320-motivet bruker oppdiktede, umerkede diagrammer; ingen faktiske inspeksjonsdata eller innloggingsopplysninger ble sendt til bildegenereringen. Alle ti kunstbilder er synlige i «Bare kunsten». Overgangene i nettsiden følger de målte røde trådendene i rasterbildene, også når mobilkortene ligger under bildene.

Nettoptimaliserte filer ligger i `public/art/`. De fire nye motivene heter `traveller.webp`, `driver.webp`, `in5320.webp` og `hobbies.webp`, med tilsvarende `-640.webp`-varianter. De fullstendige promptene for den opprinnelige serien følger nedenfor.

# Chess — stilprøve 1

Generert 21. september 2026 med det innebygde bildeverktøyet. Modellvariant/snapshot er ikke eksponert av verktøyet.

Status: opprinnelig stilprøve, senere godkjent som produksjonsbilde og stilreferanse.

Bilde brukt i nettstedet: `public/art/chess.webp`.

## Prompt brukt

Use case: illustration-story.
Asset type: a single standalone artwork, style proof for a developer's personal portfolio gallery; not a website screenshot.
Primary request: an original, exquisite hand-drawn surreal chess landscape. A chessboard unfolds and rises into stepped terraces, with one clearly recognizable ivory knight chess piece as the focal subject. A fine vermilion-red thread passes through the scene and suggests a knight's two-then-one-square move. The thread enters near the top center and continues toward the bottom center, intended to connect with adjoining artworks in a long scrolling gallery.
Style/medium: poetic ink engraving and colored-pencil drawing with restrained gouache washes on tactile dark paper. Delicate imperfect cream linework, crosshatching, fine architectural detail, subtle paper grain. An intimate illustrated folio or imaginary scientific atlas, sophisticated and contemplative, with a touch of storybook wonder. Entirely hand-drawn appearance rather than glossy 3D rendering or vector icons.
Color palette: deep ink-blue and forest-green grounds, muted sage, warm parchment ivory, and only a thin rust-red thread as a strong saturated accent.
Composition: square artwork. A coherent perspective and clean readable silhouette for the knight amid terraced checkerboard geometry, with generous breathing room. Vary the density: intricate engraved details in the central and lower landscape, quiet dark negative space in an upper corner where a small HTML project label could later sit. Do not draw that label, a box, or any user interface. A very fine understated hand-drawn perimeter rule can frame the illustration.
Mood: thoughtful, quiet, curious, adult and artful. Rich craftsmanship with discoverable details, not clutter.
Constraints: no text, no letters, no numbers, no logos, no watermark, no people, no glowing electronics, no neon, no code, no futuristic grids, no photographic rendering. Generate one cohesive finished artwork, not a collage or multiple variations.


## nimmo

# NIMMO artwork

Built-in image generation; approved chess artwork used only as a style reference.

Use case: stylized-concept.
Asset type: one square fine-art illustration for the NIMMO mobile-development chapter of a personal portfolio website.
Input image: Image 1 is STYLE REFERENCE ONLY, not an edit target. Create an entirely NEW subject and composition, matching the reference's exquisite old copperplate engraving, tiny crosshatched ivory lines, textured dark paper, rich depth, and restrained nocturnal palette. Do not recreate its chess scene.
Scene and subject: a poetic Nordic coastal city connected across rocky islands by gracefully arched stone bridges and winding routes. Intricately engraved harbor buildings with steep roofs, a few tiny anonymous walkers, calm fjord water and distant mountain silhouettes. A tall, elegant, subtly phone-shaped architectural portal stands in the middle-right: a narrow rounded rectangular stone opening, like the silhouette of an upright smartphone, framing a vista of the city beyond. It is architecture, not a realistic device or interface. The city is the world accessible through mobile technology.
Composition: square, richly detailed lower two thirds and middle/right. Keep the upper-left quadrant calm, dark and mostly open sky for a separate HTML information card. No in-image card or text. A fine warm-ivory perimeter rule sits just inside the edge, matching the reference.
Central recurring motif: a single vivid vermilion-red thread enters at the top edge near the exact horizontal center, descends in graceful curves through the portal and along the city's bridges/routes, and exits at the bottom edge near the exact horizontal center. It connects places as a travel route. The thread must be clearly visible, slender, tactile, and uninterrupted, with occasional tiny knotted connection points like the reference.
Style and color: antique copperplate/ink engraving, extremely fine crosshatching and cream lines on deep ink-blue and forest-green textured paper. Restrained old gold and ivory highlights, dusty foliage, subdued moonlit atmosphere; red thread is the only saturated accent. Sophisticated, handmade, poetic, mysterious and warm. No glossy 3D, no neon, no flat vector cartoon, no photographic render.
Constraints: no words, letters, labels, logos, typography, watermarks, interface boxes, exact phone UI, chess pieces, checkerboards, or recognizable real people. One complete standalone square artwork.


## education

# Education artwork

Mode: Built-in image generation. The provided image is a style reference, not an edit target.

Style reference: `/Users/jacob/.codex/generated_images/01a0c45f-5c62-7a60-a014-8d521860af66/exec-40c86b01-22cc-4231-ab81-81c698755fff.png`

## Exact prompt

Use case: illustration-story
Asset type: one square fine-art illustration for the education chapter of a personal developer portfolio; artwork only, not a website mockup.
Input images: Image 1 is ONLY a style reference for rendering, ink texture, restrained palette, handcrafted crosshatching, quiet nocturnal storybook sophistication, and fine perimeter rule. It is NOT an edit target. Generate a completely new composition and subject; do not retain chess subject matter.
Primary request: an opened architectural knowledge-house / fantastic university library seen as a beautiful cutaway. Book-lined rooms, elegant arches, small internal stairs and warm softly lit reading spaces form a cohesive building. Some windows and arrangements of books subtly become elegant geometric diagrams and connected observations, without any numbers or writing. The scene evokes learning, careful analysis, and discovering connections.
Composition: square 1:1. Building and richly detailed architecture concentrated in the center and left and lower portions. Preserve a substantial quiet deep dark upper-right region for a future HTML information card; do not draw the card. A single very thin vermilion red thread enters at the TOP CENTER edge, gracefully connects a few rooms and observations, and exits at the BOTTOM CENTER edge. The red thread is the only saturated accent.
Style/medium: exquisite antique copperplate / pen-and-ink engraving with fine cream crosshatching, tactile dark paper, subtle aged print texture, precisely observed architectural detail and atmospheric depth, matching the supplied reference. Not glossy 3D and not flat vector art.
Palette: deep forest green and ink blue shadows, warm ivory and softly gold library illumination, subtle muted olive; vermilion thread.
Lighting/mood: warm softly glowing library interiors within a quiet nocturnal world, intellectual, inviting, slightly mysterious, sophisticated.
Constraints: fine single cream perimeter rule like the reference. No lettering, no text, no numerals, no labels, no signage, no logos, no UI, no watermark, no people, no chess pieces or checkerboard. Keep all key architecture visible and do not crop the library awkwardly.


## bfme

Current artwork: [Minas Tirith revision 2](bfme-minas-tirith-v2-prompt.md), using Wētā's model as an architectural reference for a closer resemblance. The [first Middle-earth revision](bfme-middle-earth-prompt.md) and the original prompt below are retained as history and no longer describe the active artwork.

# Open BFME artwork prompt

Generation mode: built-in image generation. Reference used for style only.

Style reference: `/Users/jacob/.codex/generated_images/01a0c45f-5c62-7a60-a014-8d521860af66/exec-40c86b01-22cc-4231-ab81-81c698755fff.png`

## Exact prompt

Use case: illustration-story.
Asset type: one square fine-art illustration for an artistic software developer portfolio, Open BFME reverse-engineering chapter. Output artwork only, not a website mockup.
Input image 1 is STYLE REFERENCE ONLY: match the approved artwork's extraordinary intricate antique copperplate engraving and aged gouache quality, fine ivory linework, deep midnight navy and forest green textured paper, muted moss and warm cream, luminous red thread and very fine rectangular ivory perimeter border. Do not copy its chess subject or layout.
Primary scene: an original fantasy citadel being painstakingly reconstructed and understood. The citadel is a beautiful coherent architectural organism built of pale old stone, elegant arches, buttresses and towers. Lower architecture is complete and solid. Upper wall sections are suspended just millimeters or a few centimeters from their precise proper positions, revealing their construction. Part of the structure transitions into delicate axonometric engineering cutaway linework showing hidden arches, joints and interior rooms. This is an evocative visual metaphor for reverse engineering: understanding the invisible structure and reassembling it accurately. Not destruction, ruins, battle or an explosion.
Composition: square, clear silhouette, strong luminous structure occupying the upper center and middle-right, occupying about two thirds of the composition. Give the lower-left quadrant darker quieter navy/forest breathing room with subtle landscape texture where a separate HTML project card can later overlap. No card or text in the artwork itself. Dense exquisite craft but a readable overall composition; atmosphere and depth, restrained surrounding landscape.
A single thin rust-red thread enters at exact top center, curves gently through and around the exposed internal structure, and exits at exact bottom center. It should be a physical slender thread, contrasting warm red against the old cream ink. It is the recurring visual motif, not a cable, neon light or laser.
Lighting and mood: moonlit, contemplative, learned, magical, dignified; luminous cream masonry against deep blue-green darkness. Tactile hand-printed paper grain and exquisite hand-drawn crosshatching, not glossy digital 3D.
Constraints: original architecture rather than any exact recognizable copyrighted fortress. No lettering, no labels, no logos, no watermark, no UI, no code, no humans, no characters, no chess pieces, no chessboard. Keep thin ivory perimeter, square canvas, and complete artwork unclipped.


## podcast

# AIpodcast artwork

Generated with the built-in image tool. Reference image used for style only. Exact backend model selection is not exposed by this interface.

## Final prompt

Use case: illustration-story.
Asset type: One final square artwork for the AIpodcast chapter of a personal portfolio website.
Input image 1: STYLE REFERENCE ONLY. Preserve the exquisite hand-engraved linework, dark ink-blue aged paper, ivory highlights, muted forest-green washes, red thread, and thin warm-ivory border of the supplied chess landscape. Create a wholly new scene, not an edit of the chess scene.
Scene: A surreal, quiet library of sound at night. A small, empty, exquisitely carved wooden listening chair sits center-left on a stone reading platform. Around it sit sculptural ivory seashells, modest reels of audio ribbon and open books, arranged like a naturalist's collection, with tall bookcases receding into darkness at left. One large shell is the clearly identifiable sound source; fine ivory engraved soundwave arcs radiate from that shell toward the listening chair, suggestive of tracing an answer back to its source. The books contain only fine nonverbal engraving texture, no readable writing.
Composition: Square, artfully deep architectural space. Main sculptural group center-left and lower half. Keep upper-right third quiet, dark and generously uncluttered, for a project card that will later be rendered in HTML. No card or UI in this image. Fine ivory inset border around all four edges.
Through-line: A single thin vermilion-red thread enters exactly at top center, makes an elegant winding path around the source shell, through an open book, down to the empty listening chair, then exits exactly at bottom center. Restrained coherent thread, not a glowing cable.
Style: Exquisite handcrafted copperplate engraving with dense fine crosshatching and tiny etched botanical and architectural details. Cream and ivory etched strokes with muted green washes on deep ink-blue paper. Printed-art texture and subtle imperfections, not a glossy render. Match the style reference closely.
Lighting and mood: Contemplative, curious, quietly magical. Restrained warm local light touches shell, book edges and chair; gentle muted golden highlights, deep inky shadows.
Avoid: Text, letters, captions, logos, watermark, UI, card, 3D gloss, photorealism, neon, glowing technology, robots, brain icons, people, chess pieces, chessboards. Produce one finished square artwork.

## Inspection

- Square hand-engraved night library with ivory crosshatching, muted greens and a fine border.
- Empty listening chair, shell sound source, reels and open books present.
- Red thread enters near top center and exits bottom center.
- Upper-right negative space retained for the HTML project card.
- No text, logos, people, chess pieces, neon, robots or brain icons.
- Final PNG: `podcast.png`.


## about

# About artwork

Generation: built-in image tool, reference image used for style only. Exact model is not selectable or verified through this tool.

Style reference: `/Users/jacob/.codex/generated_images/01a0c45f-5c62-7a60-a014-8d521860af66/exec-40c86b01-22cc-4231-ab81-81c698755fff.png`

## Exact prompt

Use case: illustration-story.
Asset type: square final chapter artwork for a deeply personal developer portfolio, with HTML about-card placed separately afterward.
Input image 1: STYLE REFERENCE ONLY. Create a completely new scene, not a variation on the chess scene. Match the same extraordinary antique cream ink engraving, tiny crosshatched marks, muted gouache washes, textured deep blue-green paper, and fine single cream border. Same artist, materials, era, attention to detail, and vermilion red narrative thread as the reference.
Scene and subject: exactly two empty elegantly carved wooden chairs sitting side by side on an old stone garden terrace under an ancient branching tree, both chairs facing the same peaceful fjord and distant Nordic mountain horizon. We see the chairs from behind at a gentle three-quarter angle, inviting and intimately close. A mature garden surrounds the terrace: intricately engraved moss, ferns, climbing foliage, and roots. Still water and layered mountains, with a warm late-afternoon amber sky reflecting softly over the water.
Composition: square image, fine inset cream border. Chairs are in the middle-right and lower-middle region, fjord opens behind them on the right. Upper-left approximately 35 percent is quiet dark blue-green foliage and subtle paper texture with low contrast and no major subjects, reserved for a readable HTML about-card. No literal box or card drawn into the artwork.
Narrative thread: a single very thin vermilion red thread enters at the exact top center edge, descends naturally along a tree branch and trunk, makes a gentle understated connection around the two chair arms, and ends softly between the two chairs. Not a heart, not rings, not a rope; a delicate red thread as in the reference. Final chapter, so no exit through the bottom.
Style and mood: warm, quiet companionship, a little magical but restrained. The copper-amber horizon brings warmth into the same dark, antique engraved world as the reference. Exquisite visibly hand-drawn etched detail, cream highlights and olive/teal shadows, tactile old print surface. Not photorealistic and not smooth digital concept art.
Constraints: no people, faces, identifiable personal details, text, captions, UI, logos, watermark, chessboard, chess pieces, hearts or rings. No extra chairs. This is a standalone art asset, not a screenshot or website mockup.
