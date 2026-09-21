# Verification — 21 September 2026

## Local first version

- Production build, TypeScript check, ESLint and `git diff --check` passed.
- Dependency audit reported no vulnerabilities.
- The static production export was tested at `http://127.0.0.1:3100`.
- Responsive checks covered widths of 320, 390, 760, 800, 900, 1024, 1440 and 1920 pixels. No horizontal overflow or out-of-bounds cards was found.
- Checked the mobile menu, art-only toggle, project dialogs, Escape dismissal, focus return and contact link destinations.
- Full-width art preserves its square aspect ratio. On mobile, text cards flow below the art.

## Source-illustration continuation (approved style)

- The user rejected the generated cord because its physical braided texture did not match the illustrated red stroke. Removed that material from runtime; the bridge now interpolates the complete source-line cross-sections, not a flat average color. No synthetic grain, fibres or extra highlights are added.
- Regenerated 38 exact-border profiles at both artwork resolutions with wider padding and independent background samples. All 20 artwork WebPs verified unchanged. The source-only preparation is deterministic and needs no generated-cord input.
- The user approved the education → IN5320 proof and requested the same quality for every transition, followed by push. Visually inspected all nine joins using the large sources and again using the mobile sources in the local-only contact sheet. Original artwork is shown above and below every join for direct comparison; no proof page is part of the deployment.
- Removed disconnected warm-background specks from Chess and AIpodcast profiles without trimming the stroke's connected soft fringe. Regression tests preserve every alpha sample of the approved education → IN5320 profiles.
- Corrected mobile continuations to retain the artwork's outgoing tangent, then finish vertically behind the card. The following gap starts vertically; art-only mode uses both original artwork tangents. Tests cover all nine joins, both resolutions and both modes.
- Browser checks at 320, 390, 640, 641, 760, 761, 1280 and 1920 CSS pixels: all ten artwork images loaded, all nine bridges ready, no horizontal overflow, no out-of-bounds cards, and zero measured seam/canvas gaps. All nine mobile continuations meet the actual image bottom and section bottom, including the opening intro.
- Art-only checks at 320, 390, 640, 641, 760, 761 and 1280 CSS pixels retain all artworks and bridges while hiding all continuations. Browser console has no errors or warnings. Inspected the actual page on desktop and mobile as well as the isolated proof.
- Build, TypeScript, ESLint, 42 tests and whitespace checks pass. Independent numeric audit also covers 567 renderer configurations across responsive widths, pixel densities, both modes and mobile continuations, without empty scanlines or clipped canvas edges.
- Removed the rejected generated cord asset from published files; it remains recoverable in Git history. The historical prompt is explicitly marked as retired. No artwork, portfolio content, store link or contact link changed.

## Generated cord transitions (previous version, rejected style)

- Replaced all nine flat SVG gradient ribbons and nine solid mobile continuation bars with the same generated raster cord material. The ten chapter artworks, content, cards and store URLs are unchanged.
- Generated a real fiber/twist/shading asset through the built-in image tool. An initial fake-checkerboard output was rejected and corrected with another image-generation edit. The selected opaque dark-matte asset is softly keyed in the renderer; no checkerboard or rectangular matte is shown.
- Each bridge follows the measured geometry but samples actual pixels from the generated material. Tiny border profiles from both responsive versions of the artworks blend into the material at the seams. Premultiplied sampling avoids dark fringes; one shared RGB contrast gain avoids pale or greenish fibers.
- Compared the old and new Traveller-to-Driver seam side by side at 3× magnification using `scripts/preview-thread-material.mjs`. Also visually inspected NIMMO-to-Traveller, Driver-to-Education and Chess-to-About at magnification. The local-only proof uses the production renderer and original art pixels; its generated files stay under ignored `out/` and are not part of the site deployment.
- Browser checks at 320, 390, 640, 641, 760, 761 and 1280 CSS pixels showed all nine raster connectors ready, no horizontal overflow and no out-of-bounds cards. At mobile sizes all nine continuations rendered, with zero gaps from actual image bottoms to section bottoms (including the opening intro). Continuations hide on desktop and in art-only mode.
- Art-only mobile check preserves all ten artworks and all nine connectors. Browser console returned no errors or warnings.
- Production build, TypeScript, ESLint and all 38 unit tests passed. Nine material tests cover soft alpha, actual edge profiles, arc-length sampling, seam colors, bounded transparent canvases and red-highlight calibration.

## Four illustrated chapters (previous transition material)

- Replaced the paper-only inserts with four newly generated, square artworks: Traveller, Driver, IN5320 and the hobby-project introduction. All six original artwork files are unchanged.
- Order: work experience, Traveller, Driver, education, IN5320, hobby introduction, Open BFME, AIpodcast, Chess, About. Desktop uses overlay cards; mobile moves the same cards below the art. All ten artworks remain in art-only mode.
- Read the official Nimmo product description and the IN5320 project source before developing the motifs. Exact generation and correction prompts, sources and backend-model caveat are linked from `artwork-prompts.md`.
- Each new asset has 1254 px and 640 px WebP versions. The four pairs total approximately 2.18 MiB; they are lazy-loaded after the original hero.
- Measured both resolutions of all ten artworks at their actual canvas edges. Responsive SVG ribbons join positions, tangents, widths and colors; mobile continuations behind the cards share the same measurements.
- Browser checks at widths 320, 390, 640, 641, 760, 761, 1024 and 1280 found no horizontal overflow or out-of-bounds cards. All ten images loaded and switched to the small variants at 640 px.
- Visually inspected each new desktop card and the mobile Traveller-to-Driver transition. All nine art-only joins have zero layout gap on both sides. Art-only checks at 390, 761 and 1280 show ten artworks, nine joins and no visible notes.
- Tested the original NIMMO and education detail buttons and the new IN5320 detail button. The four verified app-store URLs are preserved, alongside the portrait, automatic age and GitHub calendar. Browser console reported no warnings or errors during these checks.
- Production build, TypeScript, ESLint, all 29 unit tests and `git diff --check` passed. Eleven new tests cover thread geometry, tapering, responsive measurements and mobile continuations.

## Additional project cards and automatic age (earlier iteration)

The paper-only presentation below was superseded by the four illustrated chapters above; its age and app-store work remains.

- Added individual Nimmo (Traveller) and Nimmo Driver cards after work experience, a separate IN5320 card after education, and a hobby-project introduction before Open BFME.
- Verified all four store destinations against official Nimmo and app-store pages: Apple IDs `1672565306` and `6748903380`, Android packages `no.nimmo.app` and `no.nimmo.driver`.
- Preserved and tested the original NIMMO and IN5320 detail buttons, plus the new IN5320 button. Dialog close restores focus to each trigger.
- Tested desktop and mobile layouts, including widths 320, 390, 760, 761 and 1024. No horizontal overflow or out-of-bounds new cards; the about card still fits its section.
- Checked the mobile Projects menu destination and art-only mode. The six illustrations remain unchanged; the inserted cards hide and original connecting paths are restored.
- Age derives from 7 November 2001 using the `Europe/Oslo` calendar date. Static HTML omits age to avoid frozen build-time data; the browser refreshes on hour boundaries, focus and visibility changes.
- All 18 unit tests, ESLint, TypeScript/build and `git diff --check` passed. Birthday, Oslo midnight, later years and time-zone boundaries have explicit tests.

## Original publication status

The `jacobstarheim` project has been created in `jacobs-projects-deb8c182` and linked to this directory, using the Next.js preset and Node.js 24. The portfolio was developed on `codex/art-portfolio` and merged into `main` after explicit user approval on 21 September 2026.

Vercel login is verified after reauthentication. The initial portfolio commit was `e3f567a`; the branch through `f700a53` was fast-forward merged from the original `main` commit `e31556b`. Typecheck and lint passed immediately before the merge.

The first CLI deployment completed as `READY`, but unexpectedly targeted production despite the explicit `--target preview` flag. Vercel CLI 59.23.2 removes that target before submission, allowing first-deployment promotion. The live alias is https://jacobstarheim.vercel.app and the initial deployment ID was `dpl_46jLt1ejkU6ALn9mumd1KR3GU4oR`. The user was informed and subsequently approved merging into `main` to publish the update.

After the user updated GitHub access, the Vercel project API confirmed the connection: provider `github`, owner `JacobStarheim`, repository `Portfolio`, production branch `main`. The workflow uses `codex/art-portfolio` for automatic previews. Do not push `main` merely to test the integration; check the branch deployment's target and status in Vercel instead.

Automatic Git deployment was verified with commit `f081bf6`: deployment `dpl_C2UyCyVuGfBo4HM5B1mv9VibNDYg` reported target `preview`, status `Ready`, and a successful Vercel commit status on GitHub. Production publication now follows approved pushes to `main`; check the deployment status for the current commit in Vercel.

For a Vercel source build, social metadata uses `VERCEL_URL`. The current local export has a localhost metadata origin and should not be uploaded as a prebuilt production artifact without rebuilding for the verified public origin.
