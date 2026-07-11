# AI Secondhand Pricing Maintenance Guide

## Project State

- Repository: `ai-ideas-lab/ai-secondhand-pricing`
- Product: secondhand item intelligent pricing web app
- Stack: React, TypeScript, Vite, Tailwind, Radix UI components
- Hosting signal: Vercel metadata is present locally.

## Before Editing

- Keep generated Vite output and local Vercel metadata out of commits.
- Do not commit real model provider keys, analytics tokens, or scraping credentials.
- Replace the template README content when product positioning changes are made.

## Useful Commands

- Install: `npm install`
- Develop: `npm run dev`
- Type-check/test smoke: `npm run test`
- Lint: `npm run lint`
- Build: `npm run build`
- Preview: `npm run preview`

## Environment

- Copy `.env.example` for public API URL and optional AI provider placeholders.
- Only variables prefixed with `VITE_` are exposed to browser code.

## Deployment Notes

- See `DEPLOYMENT.md` for Vercel and Vite release checks.
- Confirm production API endpoints before publishing pricing workflows.
