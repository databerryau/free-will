# Free Will App — Spec (Task 1: format prototypes)

Status: agreed · 2026-10-24

> **This spec is a guide, not a contract.** Follow it loosely. If something more
> interesting turns up while building (a better exercise, a different flow, a dropped
> section), go with it and note the change in the decisions log (§9).

## 1. What and why

A web app that walks a **skeptic** through Sam Harris's argument against free will
(*Free Will*, 2012) by having them run small experiments on their own mind, then
naming what they just noticed. The goal of a session is **understanding**: the user
can say, in their own words, why neither determined causes nor chance leaves room for
the free will they feel they have.

Task 1 builds three rough, clickable prototypes of different formats, shows them to a
few people, and picks one. Then stop for the owner's decision.

## 2. Audience

- **Primary: the skeptic.** Believes in free will, may be a compatibilist without the
  label. Will push back, so every claim has to be earned from their own experience,
  and the common objections must be answerable on the spot.
- Must work cold: no prior knowledge of Harris assumed.
- Testers: 2–5 friends opening a link on their phone, without the owner explaining it.

## 3. Content principles

1. **Experience, then name it.** Every argument step starts with an exercise. Only
   after the user has noticed something do one or two plain sentences connect it to
   the argument. The argument is assembled from the user's own observations.
2. **Calm, plain, not lecturing.** Short sentences. No exclamation marks, no "mind-blown"
   framing, no gamification (no points, streaks, badges, scores, confetti).
3. **Faithful to Harris, in our own words.** Paraphrase throughout. At most a handful of
   short quotes, attributed. Credit line on every format: *"Based on Sam Harris,
   Free Will (2012)"* plus a reading link. No implied endorsement.
4. **No neuroscience studies.** No Libet, no Soon et al. Harris says the argument does
   not depend on them, and they are where skeptics push back hardest. Stay introspective.
5. **Ending uses Harris's framing.** The conclusion is presented as freeing rather than
   bleak: less self-blame, more curiosity about why people (including you) do what they
   do. One brief, calm note, not a sermon.

### In scope: three argument steps

| Step | Claim (plain) | Noticed through |
|---|---|---|
| **A. Unbidden** | Thoughts, options and urges appear in consciousness. You don't author them before they arrive. | City, Next thought, The urge |
| **B. The dilemma** | A choice is either the product of prior causes you didn't choose, or partly random. Neither is authorship. | Rewind the tape, Ask why |
| **C. Compatibilism** | "Acting on your own desires" isn't the freedom people feel they have, because you didn't choose your desires. | Choose what you want, Swap places |

**Out of scope:** moral implications (blame, punishment, justice), neuroscience studies,
meditation instruction.

## 4. The experiment set (shared by all three formats)

Seven experiments, written once and reused by every format. Each has: title, one-line
hook, est. time, the exercise, a **reflection** (personalised from typed input where
possible), a **"name it"** line tying it to step A/B/C, and optional **"But…"** objections.

Typed answers are stored **only in the browser** (localStorage) and can be cleared.

1. **Pick a city** (A, ~1 min). Type any city. Reflection: show 4–5 well-known cities
   the user didn't pick ("Did Lisbon occur to you? Nairobi? Osaka?"). You didn't choose
   which cities came to mind, and you can't fully say why this one won over the others
   that did. *Name it:* the options were delivered to you; the choosing came after.
2. **The next thought** (A, ~1 min). 30-second timer: "Try to know what your next thought
   will be before you think it." Then type what came up. Reflection: each thought arrived
   before you knew it was coming. *Name it:* you're closer to the audience than the author.
3. **The urge** (A, ~1 min). "Tap the button whenever you feel like it in the next 20
   seconds. Watch for the moment the urge appears." Then: "Why then and not two seconds
   earlier?" (typed). *Name it:* did you decide to decide? The "now" just showed up.
4. **Ask why** (B/C, ~2 min). Choose tea or coffee (or similar), then answer "why?"
   three times in a row, each about the previous answer. Reflection: plays the chain back;
   it ends in something like "I just like it" or "that's how I am", which you didn't
   choose. *Name it:* deliberation is real and matters, but the reasons and their weight
   arrive too.
5. **Rewind the tape** (B, ~2 min). Type a recent decision. "Rewind the universe to the
   moment before, every atom the same. Could you have chosen differently?" Yes/No.
   - No → then the choice followed from things you didn't pick: determinism.
   - Yes → then what made the difference? Nothing about you, because you were identical.
     That's chance. Is a coin flip in your head freedom?
   *Name it:* the dilemma. Causes or chance; neither is the author you feel you are.
6. **Choose what you want** (C, ~1 min). Type a food you love. "For ten seconds, try to
   genuinely dislike it. Not act as if: actually stop wanting it." Reflection: you can act
   against a desire, but can you choose the desire? Quote (public domain): Schopenhauer,
   *"Man can do what he wills, but he cannot will what he wills."* *Name it:* the
   compatibilist's "free because you did what you wanted" skips who chose the wanting.
7. **Swap places** (C, ~2 min). Think of someone whose choices baffle you. "Imagine you
   got their genes, their upbringing, their experiences, their brain this morning, every
   atom. Would you choose differently from them?" *Name it:* you'd simply be them. There
   is no extra "you" outside the inheritance doing the choosing. (Framed as authorship,
   not blame; moral implications stay out of scope.)

### "But…" objections

At key points, small buttons let the user raise an objection and get a short reply (2–4
sentences, our words). Draft set:

- **"But I deliberated. I weighed the options."** Yes, and deliberation does real causal
  work. But watch it: considerations arrive, and one ends up feeling weightier. You didn't
  choose which would.
- **"I could have chosen otherwise."** In what sense? With everything identical, a
  different outcome could only come from chance (see *Rewind the tape*).
- **"Randomness / quantum physics leaves room for freedom."** Random events in your brain
  aren't something you author; they'd make you less in control, not more.
- **"But I *am* my brain, so I did choose."** Agreed that the choice happened in you. The
  free will people feel is more than that: being the conscious source of your choices,
  able to have done otherwise. "My brain did it" doesn't rescue that.
- **"Then why bother doing anything?"** That's fatalism, a different idea. Your choices
  and efforts still cause things; they're part of the chain, not bypassed by it.
- **"Then is no one responsible?"** A fair and important question, but a bigger one than
  this prototype covers. Briefly: holding people accountable can still make sense for
  its effects; what loses its footing is the idea that anyone *deserves* suffering for
  being who they are. Further reading:
  - Sam Harris, *Free Will* (2012): the short chapter on moral responsibility.
  - Robert Sapolsky, *Determined* (2023): what follows for blame, punishment and praise.
  - Daniel Dennett & Gregg Caruso, *Just Deserts* (2021): a compatibilist and a free-will
    skeptic debating exactly this. The best place to see the strongest case on each side.

## 5. The three formats

Hash routes so each format can be sent as its own link without biasing a tester:
`/#/walkthrough`, `/#/library`, `/#/path`. The home page `/#/` lists all three for the owner.

### 5.1 Guided walkthrough (`/#/walkthrough`)
**Tests:** does a fixed, linear sequence persuade a skeptic better than free exploration?

~7 screens, one at a time, Next/Back:
1. **Intro.** "You probably feel you're the author of your choices. Let's check, rather
   than argue." Sets expectations: ~10 minutes, type when asked, nothing leaves your device.
2. **Pick a city** → reflection → name it (A)
3. **The next thought** → reflection → name it (A)
4. **Rewind the tape** → dilemma → name it (B), with "But…" buttons
5. **Choose what you want** → name it (C), with "But…" buttons
6. **What you noticed.** Plays back the user's own typed answers beside the three
   steps A/B/C: the argument rebuilt from their observations.
7. **Close.** Harris's framing (freeing, not bleak), credit, reading link.

### 5.2 Experiment library (`/#/library`)
**Tests:** do standalone, self-chosen experiments engage people and still add up to
understanding, with no imposed order?

- Single scrollable list of all 7 experiments as cards, grouped under the three steps
  (A/B/C) with a one-line plain heading each. Card: title, hook, est. time.
- Open a card → exercise → reflection → name it → "But…" (where relevant) → back to list.
- Visited cards get a quiet "done" mark only (no counts, no progress bar).
- Footer: credit + reading link + "clear my answers".

### 5.3 Hybrid: library with a suggested path (`/#/path`)
**Tests:** do you need two formats at all, or does a recommended route through the
library give the walkthrough's coherence with the library's freedom?

- Same library as 5.2, plus a **"Suggested path"** section at the top: 4 experiments in
  order (City → Next thought → Rewind → Choose what you want).
- On the path, finishing an experiment shows a one-sentence bridge to the next step and a
  "Continue the path" button, alongside "Back to all experiments".
- Finishing the path shows the same "What you noticed" and Close screens as the walkthrough.

## 6. Design

- **Phone-first.** Single column, max ~38rem text width on desktop, 16px gutters, tap
  targets ≥44px, no horizontal scroll. Must also be comfortable on desktop.
- **Quiet editorial.** Serif body text (e.g. a Google Font like *Source Serif* or
  *Literata*), warm off-white paper tone, dark warm-grey text, one muted accent. Generous
  white space. Minimal motion: gentle fades only. Respect `prefers-reduced-motion`.
  Dark mode via `prefers-color-scheme` (warm, not black).
- Timers are calm (a slowly filling line, no ticking numbers, no sound).
- Accessible: semantic HTML, visible focus, labels on inputs, AA contrast.

## 7. Tech

- **Vite + React + TypeScript.** No backend, no accounts, no analytics.
- **Content as data:** experiments, reflections, objections and bridges live in one
  module (e.g. `src/content/experiments.ts`), consumed by all three formats.
- **Routing:** hash routing (works on GitHub Pages with no server config).
- **State:** localStorage for typed answers and visited marks, behind try/catch; the app
  must work if storage is unavailable. "Clear my answers" on every format.
- **Run locally:** `npm install` once, then `npm run dev`.
- **Code location:** this OneDrive folder, under git, pushed to the owner's GitHub.
  OneDrive note: `node_modules` and `dist` are gitignored; pause OneDrive sync during the
  first `npm install` to avoid file-lock errors. If sync friction persists, revisit.
- **Hosting:** public repo `databerryau/free-will`, the same setup as the account's other
  Pages apps. GitHub Pages via a GitHub Actions workflow on push to `main`; Vite `base` set
  to `/free-will/`. Live at `https://databerryau.github.io/free-will/`.

## 8. Done when

- All three formats run locally with `npm run dev` and are live on GitHub Pages.
- README has one line per format on what it is testing (from §5), plus run/deploy steps.
- All 7 experiments and the "But…" replies are written in full: real content, no placeholders.
- Checked on a phone-sized viewport and desktop, light and dark.
- A short recommendation of which format works best and why, judged on: does it land
  for a skeptic without explanation, does it build understanding of all three steps,
  does it avoid lecturing, and does it have room to grow into a public app. Then stop
  for the owner's pick, ideally after their friend tests.

## 9. Decisions log

- **GitHub:** public repo `databerryau/free-will` on GitHub Pages (§7).
- **Responsibility objection:** included as a "But…" reply that flags it as beyond this
  prototype and points to further reading (§4).
- **Tester feedback card:** skipped. Feedback is gathered by the owner directly.
- **Experiments:** all seven kept for now. The owner will reassess after trying them,
  especially *Swap places*.

Changes made while building (2026-10-24):

- **Working title: "Who chose that?"** A plain question rather than "Free Will App".
- **Experiments reveal step by step on one scrolling page,** rather than one screen per step.
  Earlier steps stay visible, so each reflection sits beside what the user typed.
- **Library groups are headed by questions** ("Could you have chosen otherwise?"), not by
  the claims. The claim is only named after the experiment, keeping experience first.
- **Two more "But…" objections:** "that was trivial, real decisions are different" and
  "I can change what I want over time", making eight in all.
- ***Rewind the tape* has a "What if I'd answered the other way?" aside,** so a sceptic
  sees that both horns of the dilemma lead to the same place.
- **Reading lists are titles only, with no links,** to avoid pointing at shop pages.
- **Vite `base` is `./`, not `/free-will/`.** With hash routing it works at any path.

Redesign after the first review (2026-10-24):

- **Copy rewritten in Harris's voice:** plain, direct and second person, without the
  assistant-style tics. Paraphrase only; the one quotation is Schopenhauer.
- **A few lines per screen.** Every experiment is now a deck of short screens (about 25 words
  at most) that you tap, swipe or arrow-key through, with a progress bar along the top.
  This replaces the single scrolling page from the first build.
- **Night visual design** replaces quiet editorial: deep ink background, Newsreader display
  type and a glowing hue for each experiment. Newsreader replaced Fraunces, whose thin
  display cut and tight spacing made letters look clipped and hard to read. There is one dark theme; the light/dark
  switch has been dropped.
- **Generative artwork drawn in code** (`src/art/`), not Gemini images: city lights, rising
  thoughts, ripples, roots, a backward-turning spiral, a flame and a figure-eight. It
  animates, stays consistent and needs no image files. Still frames are used for thumbnails
  and reduced motion.
- **Thinking animation:** a breathing orb that gives off thoughts. It plays whenever the
  user is asked to think, with a slowly filling line when the step is timed.
- **"But…" replies open in a bottom sheet**, so the main screens stay short.
- **Nothing is kept between people (2026-10-25).** Answers moved from localStorage to
  tab-only sessionStorage, and each playthrough wipes them when it ends. That way several
  testers can share one device.
- **A verdict at the end (2026-10-25):** "Has this convinced you that free will is an
  illusion?" Yes leads to an affirming close, which replaces the old closing screens. No leads
  to 8 common objections, each answered over several short screens that turn it back on the
  reader's experience. Each reply ends with "Back to the arguments" or "Actually, I'm
  convinced". There's also a "Still not convinced" exit with the best opposing reading. The
  verdict appears after "What you noticed" in the walkthrough and path, and from a
  "Convinced yet?" link at the bottom of the library.
- **Rewind's "other answer" aside is gone.** The closing screen and the "could have done
  otherwise" reply now cover both answers.
