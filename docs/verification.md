# Verification — 21 September 2026

## Local first version

- Production build, TypeScript check, ESLint and `git diff --check` passed.
- Dependency audit reported no vulnerabilities.
- The static production export was tested at `http://127.0.0.1:3100`.
- Responsive checks covered widths of 320, 390, 760, 800, 900, 1024, 1440 and 1920 pixels. No horizontal overflow or out-of-bounds cards was found.
- Checked the mobile menu, art-only toggle, project dialogs, Escape dismissal, focus return and contact link destinations.
- Full-width art preserves its square aspect ratio. On mobile, text cards flow below the art.

## Additional project cards and automatic age

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
