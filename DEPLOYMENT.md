# AI Secondhand Pricing Deployment Notes

## Current Status

- Repository: `ai-ideas-lab/ai-secondhand-pricing`
- Framework: Vite + React + TypeScript
- Hosting signal: Vercel metadata present locally
- Production domain: not confirmed in current inventory

## Local Validation

```bash
npm install
npm run test
npm run lint
npm run build
```

## Deployment Checklist

- Set `VITE_SITE_URL` and `VITE_API_BASE_URL` for the target environment.
- Keep provider API keys in platform secrets or backend-only services.
- Verify pricing input, result, and error states before publishing.
- Confirm Vercel project mapping and production domain before updating README links.
