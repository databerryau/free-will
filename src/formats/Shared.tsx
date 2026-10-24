import { CLOSE, CREDIT, NOTICED_OBJECTIONS, NOTICED_SUMMARY, noticedLines } from '../content/copy'
import { ARG_STEPS } from '../content/experiments'
import type { ArgStep } from '../content/types'
import { Objections, Reading } from '../components/Objections'
import { Prose } from '../components/Prose'
import { useStore } from '../lib/store'

// Used by the walkthrough and the suggested path.
export function Noticed() {
  const { answers } = useStore()
  const lines = noticedLines(answers)
  return (
    <article className="noticed">
      <header>
        <p className="eyebrow">Putting it together</p>
        <h1>What you noticed</h1>
      </header>
      {(Object.keys(ARG_STEPS) as ArgStep[]).map((arg) => (
        <section key={arg} className="noticed-step">
          <h2>{ARG_STEPS[arg].claim}</h2>
          <Prose paras={lines[arg]} />
        </section>
      ))}
      <div className="synthesis">
        <Prose paras={NOTICED_SUMMARY} />
      </div>
      <Objections ids={NOTICED_OBJECTIONS} />
    </article>
  )
}

export function Close({ again }: { again: string }) {
  return (
    <article className="close">
      <header>
        <h1>{CLOSE.heading}</h1>
      </header>
      <Prose paras={CLOSE.body} />
      <h2 className="small-heading">Further reading</h2>
      <Reading items={CLOSE.reading} />
      <p className="credit">{CREDIT}</p>
      <a className="button" href={again}>
        Back to the start
      </a>
    </article>
  )
}
