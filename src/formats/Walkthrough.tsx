import { INTRO, NOTICED } from '../content/copy'
import { ARG_STEPS, EXPERIMENT_BY_ID, HUES, PATH } from '../content/experiments'
import { Deck } from '../components/Deck'
import { go } from '../lib/router'
import { useStore } from '../lib/store'
import { VERDICT_STEPS, Verdict } from './Verdict'

const HOME = '#/walkthrough'
const to = (n: number) => `${HOME}/${n}`

// Chapters: 0 intro · 1–4 experiments · 5 what you noticed, then the verdict
// ("Has this convinced you?") under #/walkthrough/verdict.
// Backing out of a chapter lands on the previous chapter's last screen.
// Answers are wiped on Begin and once "What you noticed" has used them.
export function Walkthrough({ sub, flag }: { sub?: string; flag?: string }) {
  const { markDone, clearAll } = useStore()
  const noticed = PATH.length + 1

  if (sub && VERDICT_STEPS.includes(sub)) {
    return <Verdict base={HOME} step={sub} argId={flag} backHref={`${to(noticed)}/end`} />
  }

  const chapter = Number(sub ?? 0)
  const n = Number.isInteger(chapter) ? Math.min(Math.max(chapter, 0), noticed) : 0
  const atEnd = flag === 'end'
  const backTo = () => go(`${to(n - 1)}/end`)

  if (n === 0) {
    return (
      <Deck
        key="intro"
        screens={INTRO}
        art="dawn"
        hue={HUES.gold}
        finishLabel="Begin"
        onFinish={() => {
          clearAll()
          go(to(1))
        }}
        startAtEnd={atEnd}
      />
    )
  }

  if (n <= PATH.length) {
    const exp = EXPERIMENT_BY_ID[PATH[n - 1]]
    return (
      <Deck
        key={exp.id}
        screens={exp.screens}
        expId={exp.id}
        art={exp.art}
        hue={exp.hue}
        hue2={exp.hue2}
        claim={ARG_STEPS[exp.arg].claim}
        eyebrow={`${n} of ${PATH.length} · ${exp.title}`}
        finishLabel={n < PATH.length ? 'Next experiment' : 'Put it together'}
        onFinish={() => go(to(n + 1))}
        onBack={backTo}
        startAtEnd={atEnd}
        onComplete={() => markDone(exp.id)}
      />
    )
  }

  return (
    <Deck
      key="noticed"
      screens={NOTICED}
      art="field"
      hue={HUES.gold}
      eyebrow="What you noticed"
      finishLabel="Continue"
      onFinish={() => {
        clearAll()
        go(`${HOME}/verdict`)
      }}
      onBack={backTo}
      startAtEnd={atEnd}
    />
  )
}
