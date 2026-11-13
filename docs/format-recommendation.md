# Which format? A recommendation

Written 13 Nov 2026 for SPEC §8. The pick is yours. This is judged from the live build at phone
width (390 × 844, one headless pass on 13 Nov), not from friends' tests, so treat it as a strong
hypothesis until a friend has tried it.

## Recommendation

**Go with the guided walkthrough.** It is the only format where a friend who opens the link cold
is certain to reach all three steps and then see the argument rebuilt from their own answers in
"What you noticed". That playback is the best moment in the app, and the other two formats either
skip it or put a menu and a scroll in front of it.

Keep the library, but move it behind the walkthrough as the place you go for more. Drop the path
as a separate format.

## How the three compare

| | Walkthrough | Library | Library with a path |
|---|---|---|---|
| **Lands the core insight** | Best. City and Next thought (A), Rewind (B), Choose what you want (C), then your own answers played back, then the verdict. Nothing is optional. | Weakest. Each experiment lands its own point, but there is no "What you noticed" and no bridges, so the three steps never join up. A friend who does City and Urge never meets the dilemma. | Same as the walkthrough if the friend follows the path. Nothing stops them wandering into "Or start anywhere" instead. |
| **Drop-off risk** | Length. 44 screens from the first line to "Convinced yet?", plus a 30-second and a 10-second timer (both skippable). Roughly 6–8 minutes. The bar resets per experiment and the eyebrow says "2 of 4", which helps. | Low per experiment (1–2 minutes each), but the likely exit is after one experiment, satisfied and unconvinced. Nothing went wrong on screen, and the goal still wasn't met. | The landing page is 3.2 phone screens tall. "Start the path" sits below the first screen, under four cards, and the same four cards appear again in the full list below. |
| **Phone feel** | Strongest. The first thing on screen is a sentence and a tap. Every screen is one thought, full-bleed art, thumb-height buttons. | Good cards, but about two and a half screens of scrolling before the "Convinced yet?" link. | Same as the library, with more scroll. |
| **Sharing with a friend** | One link, one route, no decisions. You know exactly what they saw when you talk about it afterwards. | Easy to send, but "start anywhere" hands the friend the job of designing their own session. | Two invitations on one page ("follow the path" and "start anywhere") blur the ask. |
| **Room to grow** | The weak spot. A fixed spine of four. The verdict branch already shows how it grows, by adding depth after the spine. | Best. Add an experiment and it slots into a group. | Good, but it inherits the library's page weight. |

## What I'd cut or change

1. **Make the walkthrough the front door.** Point the bare URL (`/#/`) at the walkthrough intro.
   The three-format home page can stay at a hidden route for you.
2. **Fold the library in after the ending.** On both the "yes" close and the "still not
   convinced" close, offer the three experiments the walkthrough skips (The urge, Ask why, Swap
   places) as "Three more experiments". That keeps the library's room to grow without making a
   friend choose before they've seen anything.
3. **Bring the path's bridge lines into the walkthrough.** "That city came to mind on its own.
   Does every thought?" is good connective tissue, and the walkthrough currently jumps between
   experiments without it.
4. **Merge the two objection systems.** There are 8 "But…" chip replies and 8 verdict
   objections, and five topics appear in both with different answers (could have done otherwise,
   randomness, I am my brain, why bother, responsibility). Keep the chips that only make sense
   inside one experiment (I deliberated, That was trivial, I can change what I want). Point the
   others at the longer verdict reply. Drop the two chips on "What you noticed", since the
   verdict comes one screen later and covers both.
5. **Fix the jumping progress bar in Rewind the tape.** Before the yes/no question the bar has
   6 segments; after "yes" it has 9, so it visibly slides backwards. Count the longer branch from
   the start.
6. **Consider swapping Choose what you want for Swap places** as the walkthrough's step C. See
   the sceptic's critique (`docs/sceptic-critique.md`): Choose what you want argues against a
   view few people hold, while Swap places goes straight at the compatibilist.

## Cheapest way to check this

Send two friends `#/walkthrough` and one friend `#/library`, with no explanation. Ask each
afterwards to say in one sentence why the app thinks free will is an illusion. If the library
friend can't name the causes-or-chance dilemma and the walkthrough friends can, the call holds.
