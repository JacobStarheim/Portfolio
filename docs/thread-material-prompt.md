# Thread material

The previous SVG gradient ribbons aligned the positions but flattened the thread's physical material. This revision uses an image-generated cord material for the connecting spans. The ten chapter artworks remain untouched.

Mode: built-in OpenAI image generation, using `public/art/driver.webp` as the red-thread material/extraction reference. The tool does not expose a selectable or verifiable backend model.

## Exact prompt

```text
Use case: background-extraction / precise-object-edit.
Asset type: a reusable raster material strip for the red thread connecting chapters in an illustrated portfolio.
Image 1 is the existing Driver chapter and is the material/style reference and extraction source. Extract the appearance of its RED THREAD ONLY: a slender vermilion and dark-crimson twisted silk/cotton cord with tiny spiral fibers, warm natural highlights, dark edge shading and very subtle handmade engraving grain.
Create a clean isolated, perfectly STRAIGHT VERTICAL length of that same cord. Portrait canvas about 1:3. Cord center must stay exactly at x=50% for the entire height. Constant overall diameter around 10% of canvas width, with tiny natural fiber irregularities only. The thread extends continuously through the actual TOP and BOTTOM canvas edges, with no visible endpoints or caps. Show about thirty gentle twisted-fiber turns along its length; the twist is fine and believable, not a big braided rope. Soft cylindrical volume, restrained warm highlight on the left-center, shadow on right edge, no glow. Detail must hold up in a close-up.
Background must be genuinely TRANSPARENT ALPHA, not a checkerboard or a painted dark background. Keep slight wispy fiber edge antialiasing, but no long loose hairs or cast shadow.
Remove all landscape, vehicle, hands, cream border and other scene elements. No text, labels, letters, knots, branches, loops, curves, decorations, metallic cable, glossy plastic, gradient-only stripe or flat vector shape.
Output only one isolated vertical physical red thread on transparency. This raster will be scaled down and curved by the website, so it must read as real textured thread, not a painted line.
```

## Background correction

The first output baked in a checkerboard rather than supplying alpha. It was rejected for use. A built-in edit replaced that background with the website's dark ground; the renderer extracts soft yarn coverage from red chroma. No checkerboard is used on the site.

```text
Use case: precise-object-edit. Image 1 is the edit target. Preserve the vertical red cord exactly: its position, straightness, width, fine fibers, twists, highlights and shading. Change ONLY the background: remove the entire gray-and-white checkerboard and replace it with a completely flat, uniform dark blue-green color #101e20, with no pattern, gradients, paper grain or shadow. The thin wispy thread edges should blend naturally into this dark ground. Keep the cord touching both actual top and bottom edges, centered. No text, no new objects. Output one portrait image with an opaque solid #101e20 background. The checkerboard is unwanted, do not retain any of it.
```

## Selected asset

- Generated source: `/Users/jacob/.codex/generated_images/01a0c45f-5c62-7a60-a014-8d521860af66/exec-4616340e-d04f-4484-8f44-e1011a1180a1.png`.
- Project asset: `public/art/thread-material.webp`, lossless mechanical crop retaining the generated texture.
- `public/art/thread-profiles.json`: tiny RGB samples from the existing artwork borders, not newly drawn colors. Chapter images are unchanged.
- Preparation: `node --experimental-strip-types scripts/prepare-thread-material.mjs /path/to/generated-cord.png`.
