# Who chose that? (free-will app)

Phone-first web app that walks a sceptic through Sam Harris's *Free Will* (2012) with small
experiments on their own mind. Vite + React + TypeScript, no backend. See README.md for the
file map and SPEC.md for the brief.

## Copy rules (all app text in `src/content/`)
- Sam Harris's voice: plain, direct, second person, calm certainty, rhetorical questions
  ("Did you choose that?"), thoughts that "arise". Paraphrase him; never quote him at length.
  The only quotation is Schopenhauer's.
- About 25 words at most per screen. Split longer text into more screens.
- No Claudisms: colon reveals ("X: Y"), stacked "not X, but Y" contrasts, tidy triplets,
  "Here's the thing", "Put together:", parallel punchlines. Reread every new line for them.
- No exclamation marks, no gamification, no neuroscience studies (no Libet). Australian spelling.

## Working rules
- SPEC.md is a loose guide. Make the better call, then log the change in SPEC §9. Ask the
  owner before big direction changes (dropping a format, changing the audience).
- Answers live in `sessionStorage` only (`src/lib/store.tsx`). Never write to localStorage;
  the code only deletes the legacy `who-chose-that:v1` key. Each playthrough wipes its answers
  when it ends, and the app must still work with storage blocked.

## Commands
- `npm run dev`: dev server on http://localhost:5173 (`.claude/launch.json` entry "free-will").
- `npm run build`: type-checks with `tsc`, then builds to `dist/`. There is no test suite, so
  this is the check to run before committing.
- Pause OneDrive sync while `npm install` runs, or it hits file locks in `node_modules`.

## Deploying
- Pushing `main` deploys live to https://databerryau.github.io/free-will/ via
  `.github/workflows/deploy.yml`. Work on a branch and open a PR; merging is deploying.
- Phones cache `index.html` (Pages sends `max-age=600`). To see a fresh deploy, add a new
  `?v=N` before the hash, e.g. `https://databerryau.github.io/free-will/?v=8#/walkthrough`.
