# AI Secondhand Pricing Deployment Notes

## Current Status

- Repository: `ai-ideas-lab/ai-secondhand-pricing`
- Framework: Vite + React + TypeScript
- Vercel project: `kevintens-projects/ai-secondhand-pricing`
- Production domain: `https://ai-secondhand-pricing.vercel.app`
- GitHub integration: pending Vercel GitHub App access to the `ai-ideas-lab` organization; use the authenticated Vercel CLI until that access is granted.

## Local Validation

```bash
npm install
npm run test
npm run lint
npm run build
```

## Deployment Checklist

- Set `VITE_SITE_URL` and `VITE_API_BASE_URL` only when a real backend is introduced.
- Keep provider API keys in platform secrets or backend-only services.
- Verify pricing input, result, and error states before publishing.
- Deploy production from the linked directory with `vercel deploy --prod --scope kevintens-projects`.
