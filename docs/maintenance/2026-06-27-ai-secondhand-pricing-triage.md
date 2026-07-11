# AI Secondhand Pricing Triage - 2026-06-27

## Repository

- GitHub: `ai-ideas-lab/ai-secondhand-pricing`
- Category: Vite/React web app
- Production domain: not confirmed in current inventory

## Actions Taken

- Added `AGENTS.md` as the root maintenance guide.
- Added `.env.example` with non-secret Vite/API placeholders.
- Added `DEPLOYMENT.md` for Vercel/Vite release checks.
- Added `test` script as a TypeScript build-mode smoke check.
- Tuned ESLint rules for the current component-library export pattern.
- Used simulated image/category inputs in pricing helpers so lint stays meaningful.

## Validation

- `npm run test`: passed
- `npm run lint`: passed with 3 existing React Hook dependency warnings
- `npm run build`: passed with Browserslist data freshness warning

## Follow-Up

- Replace the default Vite README with product-specific operating notes.
- Confirm production domain and API contract before public launch.
- Review the remaining Hook dependency warnings before feature work in `App.tsx` or `CopyGenerator.tsx`.
