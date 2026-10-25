import type { CSSProperties } from 'react'
import { ArtCanvas } from '../art/ArtCanvas'
import { HUES } from '../content/experiments'
import type { Argument } from '../content/types'
import { ARGUMENTS, ARGUMENT_BY_ID, UNCONVINCED, YES, verdictScreens } from '../content/verdict'
import { Deck } from '../components/Deck'
import { Page } from '../components/Page'
import { go } from '../lib/router'
import { useStore } from '../lib/store'

export const VERDICT_STEPS = ['verdict', 'yes', 'arguments', 'unconvinced']

type Props = {
  // Each format mounts these screens under its own root, e.g. #/walkthrough/verdict.
  base: string
  step: string
  argId?: string
  // Where "back" from the question goes, and where the endings return to.
  backHref: string
}

// "Has this convinced you?" Yes leads to an affirming close; no leads to the
// strongest objections, each answered by pushing on the intuition behind it.
export function Verdict({ base, step, argId, backHref }: Props) {
  const { done, markDone } = useStore()
  const toArguments = `${base}/arguments`

  if (step === 'yes') {
    return (
      <Deck
        key="yes"
        screens={YES}
        art="dawn"
        hue={HUES.gold}
        finishLabel="Back to the start"
        onFinish={() => go(base)}
        onBack={() => go(`${base}/verdict`)}
      />
    )
  }

  if (step === 'unconvinced') {
    return (
      <Deck
        key="unconvinced"
        screens={UNCONVINCED}
        art="field"
        hue={HUES.violet}
        finishLabel="Back to the start"
        onFinish={() => go(base)}
        onBack={() => go(toArguments)}
      />
    )
  }

  const arg = argId ? ARGUMENT_BY_ID[argId] : undefined
  if (step === 'arguments' && arg) {
    return (
      <Deck
        key={arg.id}
        screens={[
          ...arg.screens,
          {
            kind: 'links',
            text: arg.closing,
            links: [
              { label: 'Back to the arguments', href: toArguments },
              { label: 'Actually, I’m convinced', href: `${base}/yes` },
            ],
          },
        ]}
        art={arg.art}
        hue={arg.hue}
        hue2={arg.hue2}
        eyebrow="Not convinced?"
        exitHref={toArguments}
        onBack={() => go(toArguments)}
        onComplete={() => markDone(`arg:${arg.id}`)}
      />
    )
  }

  if (step === 'arguments') {
    return (
      <Page
        home={base}
        art="spiral"
        hue={HUES.blue}
        title="Not convinced?"
        lede="Good. It’s worth resisting. Pick the objection that feels most true to you."
      >
        <ul className="cards">
          {ARGUMENTS.map((a) => (
            <li key={a.id}>
              <ArgumentCard arg={a} href={`${toArguments}/${a.id}`} read={done.includes(`arg:${a.id}`)} />
            </li>
          ))}
        </ul>
        <section className="verdict-exits">
          <a className="pill" href={`${base}/yes`}>
            Actually, I’m convinced
          </a>
          <a className="text-button" href={`${base}/unconvinced`}>
            Still not convinced
          </a>
        </section>
      </Page>
    )
  }

  return (
    <Deck
      key="verdict"
      screens={verdictScreens(base)}
      art="field"
      hue={HUES.violet}
      onBack={() => go(backHref)}
    />
  )
}

function ArgumentCard({ arg, href, read }: { arg: Argument; href: string; read: boolean }) {
  return (
    <a className="card" href={href} style={{ '--hue': arg.hue } as CSSProperties}>
      <ArtCanvas still variant={arg.art} hue={arg.hue} hue2={arg.hue2} className="card-art" />
      <span className="card-text">
        <span className="card-title">{arg.label}</span>
        <span className="card-hook">{arg.hook}</span>
        {read && <span className="card-meta done-mark">read</span>}
      </span>
    </a>
  )
}
