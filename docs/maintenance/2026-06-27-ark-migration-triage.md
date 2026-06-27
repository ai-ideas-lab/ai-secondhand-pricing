# 2026-06-27 Ark Migration Triage

## Scope

- Repository: `ai-ideas-lab/ai-secondhand-pricing`
- Branch checked: `origin/main`
- Deployment type: Vercel static frontend
- Public URL recorded by the parent project tracker: `https://ai-secondhand-pricing.vercel.app`
- Runtime LLM entrypoint: none found

This repository is the deployed app generated under the local `kimi/` idea
workspace. The remote app is a React/Vite frontend that uses deterministic local
pricing simulation in `src/hooks/usePricing.ts`. It does not contain an API
route, serverless function, CloudBase function, Supabase function, or LLM
provider client.

## Scan Result

Targeted scans on `origin/main` found no production runtime dependency on:

- `open.bigmodel.cn`
- `GLM_API_KEY`
- `ZHIPU_API_KEY`
- `ZHIPUAI_API_KEY`
- `response_format`
- `json_object`

The local parent files `kimi/CLAUDE.md` and `kimi/prompts.md` previously
mentioned GLM as the planned provider for future Kimi-generated projects. Those
workspace-level notes are outside this Git repository and have been updated
locally to prefer Volcengine Ark CodingPlan for any future real model
integration.

## Decision

No Ark runtime migration is required for the deployed app today. If this app
later replaces the local pricing simulation with real model calls, add a server
endpoint and use `ARK_API_KEY`, `ARK_BASE_URL`, and `ARK_CHAT_MODEL`; do not
expose model credentials to the browser.

No Ark deployment secrets are required for the current static frontend. Browser
LLM recovery verification is not applicable because there is no LLM generation
flow.

## Verification

Use these checks when revisiting the repository:

```bash
/Users/zhengmin/.codex/skills/volcengine-ark-migration/scripts/scan_project.sh .
git grep -I -n -E 'GLM|glm|Zhipu|zhipu|智谱|BigModel|bigmodel|open\.bigmodel|GLM_API_KEY|ZHIPU_API_KEY|ZHIPUAI_API_KEY|response_format|json_object' HEAD -- ':!node_modules/**' ':!dist/**' ':!build/**'
npm run lint
npm run test
npm run build
git diff --check
```
