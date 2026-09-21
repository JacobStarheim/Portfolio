# Open BFME — recognizable Minas Tirith, revision 2

Created with the built-in OpenAI image tool. The exact backend model variant is not exposed by this interface.

The user requested a closer resemblance to Minas Tirith after the first Middle-earth revision.

## Inputs

- Image 1 / edit target and style reference: `public/art/bfme.webp` at commit `02a963e`.
- Image 2 / architecture only: [Wētā Workshop's Minas Tirith model](https://www.wetanz.com/us/minas-tirith), [original gallery image](https://www.wetanz.com/media/catalog/product/_/l/_lotr_minastirith2022_003_1.jpg).
- The downloaded reference stays outside the website repository; it is not served by the site.

## Exact prompt

Use case: precise-object-edit.
Asset type: square fine-art chapter illustration for a software developer portfolio.

Image 1 is the EDIT TARGET and definitive STYLE reference. Image 2 is an official Weta Minas Tirith miniature: use it ONLY as the ARCHITECTURAL reference, not its photographic medium, pedestal or black studio background.

Change the city in Image 1 to look unmistakably like the actual Minas Tirith from The Lord of the Rings films, closely following the city's architectural silhouette and topology in Image 2. The previous city is too much like a generic narrow stack of medieval castles.

Essential geometry: the enormous bare stone rock-prow must dominate the middle of the city, its sheer vertical cliff cutting through and dividing the curved city levels. It extends forward from the mountain, like a ship's bow, with a long flat summit terrace and pointed overlook. This is one continuous natural rock connected to the mountain behind, not a separate column, bridge, waterfall or stone tower. Seven broad concentric semicircular wall rings wrap around BOTH sides of this rock, spreading to a wide inhabited base. The layers contain dense small pale stone houses, arched gateways, crenellations and occasional slender turrets; follow the reference's proportions and fine architecture. The very slender, tall, multi-tiered White Tower of Ecthelion rises above the citadel, with a tiny White Tree in its courtyard. A huge dark White Mountains slope rises directly behind the city, physically connected to it. Make the rock-prow, curved walls and White Tower readable together at a glance. Remove the previous architectural cutaway.

Preserve Image 1's exquisite antique copperplate engraving, fine ivory crosshatching, warm pale masonry, deep midnight blue and forest-green inks, subtle aged paper grain, moonlit contemplative mood and narrow inset ivory frame. Not photorealistic. Compose the complete city at upper-center/right in a slightly elevated three-quarter view with the projecting rock and both sides of its terraced districts visible. Leave shadowed engraved foothills and vegetation in the lower-left quadrant, where a real webpage card overlays the image. Do not draw the card. Keep the city in its landscape, not on a miniature display base.

Preserve the single slender vermilion-red physical thread: enter the TOP edge at 50.21% width, wind elegantly through the city and its gates, and exit the BOTTOM edge at 52.36% width. Keep it delicate, not a glowing laser. Complete square image with all four frame edges visible. No text, logos, watermark, people, battle, extra fantasy landmarks, modern objects, glossy 3D or studio backdrop. The only major change is the city's accuracy and necessary mountain connection; retain the existing artwork's style and series identity.

## Saved artwork

- `public/art/bfme.webp`: 1254 × 1254, desktop version.
- `public/art/bfme-640.webp`: 640 × 640, mobile version.
- The generated PNG is preserved in the external source-art collection. The preceding PNG is retained as `bfme-middle-earth-v1.png`.
- Measured thread endpoints: 50.24% at the top edge, 52.31% at the bottom edge. The adjacent SVG connectors and mobile extension match those positions.
