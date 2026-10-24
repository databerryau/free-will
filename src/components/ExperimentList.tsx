import { ARG_STEPS, EXPERIMENTS } from '../content/experiments'
import type { ArgStep, Experiment } from '../content/types'
import { useStore } from '../lib/store'

export function ExperimentCard({ exp, href }: { exp: Experiment; href: string }) {
  const { done } = useStore()
  return (
    <a className="card" href={href}>
      <span className="card-title">{exp.title}</span>
      <span className="card-hook">{exp.hook}</span>
      <span className="card-meta">
        {exp.minutes} min
        {done.includes(exp.id) && <span className="done-mark"> · done</span>}
      </span>
    </a>
  )
}

// All experiments, grouped under the question each one explores.
export function GroupedList({ base, headingLevel = 2 }: { base: string; headingLevel?: 2 | 3 }) {
  const H = headingLevel === 2 ? 'h2' : 'h3'
  return (
    <>
      {(Object.keys(ARG_STEPS) as ArgStep[]).map((arg) => (
        <section key={arg} className="group">
          <H className="group-heading">{ARG_STEPS[arg].question}</H>
          <ul className="cards">
            {EXPERIMENTS.filter((e) => e.arg === arg).map((e) => (
              <li key={e.id}>
                <ExperimentCard exp={e} href={`${base}/${e.id}`} />
              </li>
            ))}
          </ul>
        </section>
      ))}
    </>
  )
}
