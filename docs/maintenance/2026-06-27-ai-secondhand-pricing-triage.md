# AI Secondhand Pricing Triage - 2026-06-27

## Repository

- GitHub: `ai-ideas-lab/ai-secondhand-pricing`
- Category: Vite/React web app
- Production domain: `https://ai-secondhand-pricing.vercel.app`

## Actions Taken

- Added `AGENTS.md` as the root maintenance guide.
- Added `.env.example` with non-secret Vite/API placeholders.
- Added `DEPLOYMENT.md` for Vercel/Vite release checks.
- Added `test` script as a TypeScript build-mode smoke check.
- Tuned ESLint rules for the current component-library export pattern.
- Used simulated image/category inputs in pricing helpers so lint stays meaningful.
- Fixed stale React Hook dependencies and duplicate copy-generation effects.
- Replaced the Vite template README with product-specific operating notes.
- Linked and deployed the dedicated Vercel project `ai-secondhand-pricing`.

## Validation

- `npm run test`: passed
- `npm run lint`: passed with no warnings
- `npm run build`: passed with Browserslist data freshness warning

## Follow-Up

- Grant the Vercel GitHub App access to `ai-ideas-lab` if automatic Git-push deployments are required.
- Define and implement the production API contract before replacing the current simulated pricing logic.
