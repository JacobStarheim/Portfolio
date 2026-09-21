# Verification — 21 September 2026

## Local first version

- Production build, TypeScript check, ESLint and `git diff --check` passed.
- Dependency audit reported no vulnerabilities.
- The static production export was tested at `http://127.0.0.1:3100`.
- Responsive checks covered widths of 320, 390, 760, 800, 900, 1024, 1440 and 1920 pixels. No horizontal overflow or out-of-bounds cards was found.
- Checked the mobile menu, art-only toggle, project dialogs, Escape dismissal, focus return and contact link destinations.
- Full-width art preserves its square aspect ratio. On mobile, text cards flow below the art.

## Publication status

The `jacobstarheim` project has been created in `jacobs-projects-deb8c182` and linked to this directory, using the Next.js preset and Node.js 24. The new portfolio is on `codex/art-portfolio`; `main` is unchanged.

Vercel login is verified after reauthentication. The first GitHub connection attempt was rejected; repository access in the Vercel GitHub integration still needs verification. Local GitHub CLI access works.

Preview publication and the GitHub connection are being set up. No production deployment has been requested. Check Vercel's reported deployment status before sharing a preview URL.

For a Vercel source build, social metadata uses `VERCEL_URL`. The current local export has a localhost metadata origin and should not be uploaded as a prebuilt production artifact without rebuilding for the verified public origin.
