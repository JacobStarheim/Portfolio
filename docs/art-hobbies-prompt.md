# Hobby-project introduction artwork

## Research and intended meaning

- Read the portfolio's Open BFME, AIpodcast and Chess project descriptions and the existing hobby introduction before composing this image.
- Open BFME is C++ reverse engineering and reconstruction of existing game behavior, including ABI/memory layout and graphics/network/map systems. The unfinished architectural model expresses understanding a world by rebuilding its parts.
- Read AIpodcast's README, retrieval grounding helper and answer-route checks. It combines voice input/output with transcript retrieval and timestamped citations, and refuses answers with insufficient evidence. The sound apparatus and source notebook represent curiosity that keeps a route back to its source.
- Read Chess's README, desktop application and engine-panel source. It integrates Stockfish/Lc0, MultiPV, FEN/PGN, photo import and local Syzygy analysis; the modest knight represents patiently exploring positions rather than inventing the engines.
- The combined scene is an introduction to hobbies and open source: a shared place for exploration, not an additional project or a three-panel collage.
- Inspected `public/art/chess.webp` and `public/art/podcast.webp` as style references only. They establish the etched ivory linework, dark blue-green textured paper, small warm accents, fine border and red thread.

## Generation method

Built-in image generation was used. This tool does not expose a selectable model name in this session, so no exact underlying image-model version is claimed. No image API or CLI fallback was used.

## Exact generation prompt

```text
Use case: stylized-concept
Asset type: one finished square 1:1 raster chapter artwork for the hobby-project introduction in a personal portfolio.
Input images: Image 1 (chess.webp) and Image 2 (podcast.webp) are STYLE REFERENCES ONLY. Create an entirely new composition. Match their antique copperplate engraving, tiny ivory crosshatched marks, textured midnight navy and forest-black paper, subdued moss green, old gold and warm cream, and very fine cream inset perimeter rule. Do not copy their landscapes, oversized chessboard, library, or composition.
Primary request: a quiet artisan's workshop of curiosity — the welcoming place where someone takes things apart to understand them, tests an idea, and returns to an interest. The image introduces several personal projects, not a single finished product. No people.
Scene and subjects: one coherent, tangible workbench in a modest dark stone-and-timber workshop. On the RIGHT HALF of the SAME workbench, place a small unfinished fantasy stone architectural model: miniature arches and a slender tower, some fitted blocks and one carefully detached section exposing how the model is assembled. Beside it, slightly lower and nearer the viewer, a modest ivory knight chess piece suggests patient analysis. On the far right, a small exquisitely engraved shell-shaped phonograph horn connects physically to a compact reel mechanism resting on a closed source notebook, suggesting spoken questions and the path back to the original recording. These objects must share real scale, perspective, lighting and workbench surfaces. They are objects being explored, not three isolated icons or equal-size panels. Two restrained hand tools and a few offcuts may support the act of making; no generic technology props.
Composition: square canvas, intimate three-quarter view. The principal illuminated details are concentrated in the center-right and lower half. Preserve the upper LEFT 35 percent as calm, dark, subtly crosshatched wall and shadow with very low detail and contrast, suitable for a separate HTML text overlay; do not draw a panel or card there. A few restrained architectural shadows give the room depth. The bench edge, tactile carved timber, tiny metal and stone details carry the lower foreground. The overall mood is thoughtful, inviting, private, handcrafted and exploratory.
Narrative thread: exactly ONE slender physical vermilion-red thread, fully continuous with no branches, breaks, duplicate red lines or red objects. It enters through the ACTUAL TOP IMAGE EDGE at exactly x=50% of the canvas width, runs vertically down the first 4% of image height, then curves gently into the workshop. It follows one easy-to-trace flowing route across the architectural model's base, by the knight and sound apparatus, then drapes off the bench toward the foreground. It finally exits through the ACTUAL BOTTOM IMAGE EDGE at exactly x=50%, running vertically through the last 4% of image height. The thread crosses the thin inset border at top and bottom and visibly continues to the outermost image edges; it must not stop at the border. Keep the upper-left text area calm. The thread is red cotton, not a glowing magical beam.
Materials and finish: exquisite fine ivory linework, dense hand-etched crosshatching in the subjects, mineral gouache washes and tactile aged paper. Restrained candlewarm highlights without a visible candle; dark navy-green shadows. Match the reference's quiet visual richness and fine single cream border.
Constraints: one complete standalone square artwork, no words, letters, numerals, labels, logos, watermarks, signatures, code, UI, boxes, cards, people, robots, neon, glossy 3D, photography, collage or divided panels. Do not make the chess piece monumental. Do not fill the quiet upper-left space with decoration.
```

## Targeted correction prompt

The first generation established the intended composition but split the red thread at the tabletop knot and added isolated red wraps to the phonograph. The following edit corrects only the thread.

```text
Edit target: the supplied square workshop artwork. Make ONE precise correction: repair ONLY the vermilion thread so it is one unbranched physical strand from the actual top edge to the actual bottom edge. Preserve every object, texture, color, the fine border, the square crop, the beautiful engraved style and all upper-left dark negative space exactly as they are.

The present image has a three-way branch at the tabletop knot near x61%, y72%, and disconnected red wraps on the phonograph neck. Remove those thread errors. The final image must contain exactly one continuous thread, no branch, no loose disconnected red wraps and no red accents other than this strand. Remove the isolated red wraps from the phonograph neck entirely.

Keep the route from top-center through the architectural model and past the knight. From the knight, the strand curves rightward across the tabletop and reaches the reel base at approximately x83%, y65%. It then continues from the reel base over the FRONT-RIGHT edge of the book, turns down around the book's lower edge, and curves back LEFT through the foreground to x50%, y84%. From there it drops down the front of the bench and exits the ACTUAL bottom edge at x50%. Do not take a shortcut down from the tabletop knot: the only route to the bottom must first pass the reel and front edge of the book, then return left. This removes the three-way junction. The thread may pass behind an object where physically appropriate, but must read as one strand throughout. Keep it thin red cotton, no glow. No other image change.

At the actual top and bottom edges the thread must be centered at x50%, visible across the cream border, and nearly vertical for the first and last 4% of the canvas height. No text, letters, numerals, logos, people or UI.
```

## Selected output

- Selected original: `/Users/jacob/github-prosjektoversikt/portfolio-art-new-chapters/hobbies.png`.
- Built-in source: `/Users/jacob/.codex/generated_images/01a0c551-9cdd-7bc0-8426-727d045d91c9/exec-ca0bdbd5-02fc-4427-aae7-75ac04ae7a99.png`.
- Dimensions: 1254 × 1254 pixels. Original PNG size: 2,970,893 bytes.
- Visual inspection: one coherent carved workbench; miniature unfinished architecture, a small ivory knight and a phonograph/reel on a source notebook share the scene. Dark upper-left negative space accommodates the introduction. Intricate ivory engraving, muted gold/moss accents, dark paper and cream perimeter match the approved reference family. No text, numerals, UI, logos or people are visible.
- The correction removed the visible branch and disconnected horn wraps. The final strand is one readable route; small sections are naturally occluded by the model and book.
- Pixel inspection of red at actual outer edges: top center x=624.5/1254 (49.80%); bottom center x=626.5/1254 (49.96%). The thread crosses the inset border and reaches both outer edges. In the first/last 4% of height it remains nearly vertical, within roughly 4 pixels of these centers.
- No source-code, styling, deployment or Git changes were made by this artwork task. Optimized site assets are produced separately during integration.
