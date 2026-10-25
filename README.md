# Who chose that?

Small experiments on your own mind, based on Sam Harris's argument in *Free Will* (2012).
The goal is for a sceptic to come away *understanding* the argument by noticing it in their
own experience first. See [SPEC.md](SPEC.md) for the full brief.

Live: https://databerryau.github.io/free-will/

## The three prototype formats

All three share the same seven experiments (`src/content/`), so the comparison is about format, not content.

| Format | Link | What it's testing |
|---|---|---|
| Guided walkthrough | [`#/walkthrough`](https://databerryau.github.io/free-will/#/walkthrough) | Does a fixed, linear sequence persuade a sceptic better than free exploration? |
| Experiment library | [`#/library`](https://databerryau.github.io/free-will/#/library) | Do standalone, self-chosen experiments engage people and still add up to understanding? |
| Library with a suggested path | [`#/path`](https://databerryau.github.io/free-will/#/path) | Does a suggested route give the walkthrough's coherence with the library's freedom? |

Send testers a single format's link. Each format only links to itself, so they won't see the others.
The home page (`#/`) lists all three for you.

## Run locally

```bash
npm install
npm run dev
```

Then open http://localhost:5173. `npm run build` type-checks and builds to `dist/`.

## Deploy

Pushing to `main` builds and deploys to GitHub Pages via `.github/workflows/deploy.yml`.

## Where things live

- `src/content/experiments.ts`: the seven experiments, screen by screen
- `src/content/objections.ts`: the "But…" replies and the reading list
- `src/content/copy.ts`: intro, bridges, "What you noticed"
- `src/content/verdict.ts`: "Has this convinced you?", the yes ending, and the 8 objections
  with their counter-arguments (`src/formats/Verdict.tsx` shows them in every format)
- `src/components/Deck.tsx`: full-screen deck of short screens (tap, swipe or arrow keys)
- `src/art/`: the generative artwork and the thinking animation (canvas)
- `src/formats/`: the three formats and the home page

Copy rules: Sam Harris's voice, a few lines per screen. See SPEC.md §9.

Nothing is kept on the device. Answers live in tab-only storage (sessionStorage), so closing the
tab erases them, and each playthrough wipes them when it ends: the walkthrough and path after
"What you noticed", and a library experiment as soon as you leave it. So several testers can
share one phone.

## OneDrive note

The project lives in OneDrive. `node_modules` and `dist` are gitignored, but OneDrive still syncs them.
If `npm install` hits file-lock errors, pause OneDrive sync while it runs.
