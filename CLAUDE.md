# Kramp E2E — Claude Code

This repository contains Playwright E2E tests for the Kramp demo shop.

Before making changes, follow the shared project rules in **AGENTS.md** and the
domain skills in **`.skills/`** listed below. Prefer skills over improvising
conventions.

## Shared project rules

@AGENTS.md

## Project skills

Read the skill that matches your task before editing code or docs in that area.

| Task | Skill |
|------|--------|
| New or updated Playwright specs, tags, URLs, waits | `.skills/ui-e2e-playwright/SKILL.md` |
| Page objects (`tests/e2e/pages/`) | `.skills/page-object-model/SKILL.md` |
| Test data (`tests/e2e/test-data/`) | `.skills/test-data/SKILL.md` |
| Gherkin documentation (`test-cases/e2e/`) | `.skills/gherkin-test-cases/SKILL.md` |
| README E2E section | `.skills/e2e-readme-docs/SKILL.md` |

@.skills/ui-e2e-playwright/SKILL.md

@.skills/page-object-model/SKILL.md

@.skills/test-data/SKILL.md

@.skills/gherkin-test-cases/SKILL.md

@.skills/e2e-readme-docs/SKILL.md

## Claude-specific notes

- Do not commit `.env`, explore scripts, or screenshots used for debugging.
- Run `npm run lint`, `npm run typecheck`, and `npm run test:e2e` before finishing E2E changes.
- Specs live in `tests/e2e/specs/`; Gherkin files in `test-cases/e2e/` are documentation only.
