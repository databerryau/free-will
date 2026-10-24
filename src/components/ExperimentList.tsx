import type { CSSProperties } from 'react'
import { ArtCanvas } from '../art/ArtCanvas'
import { ARG_STEPS, EXPERIMENTS } from '../content/experiments'
import type { ArgStep, Experiment } from '../content/types'
import { useStore } from '../lib/store'

export function ExperimentCard({ exp, href, number }: { exp: Experiment; href: string; number?: number }) {
  const { done } = useStore()
  return (
    <a className="card" href={href} style={{ '--hue': exp.hue } as CSSProperties}>
      <ArtCanvas still variant={exp.art} hue={exp.hue} hue2={exp.hue2} className="card-art" />
      <span className="card-text">
        <span className="card-title">
          {number !== undefined && <span className="card-number">{number}</span>}
          {exp.title}
        </span>
        <span className="card-hook">{exp.hook}</span>
        <span className="card-meta">
          {exp.minutes} min
          {done.includes(exp.id) && <span className="done-mark"> · done</span>}
        </span>
      </span>
    </a>
  )
}

// All experiments, grouped under the question each one explores.
export function GroupedList({ base }: { base: string }) {
  return (
    <>
      {(Object.keys(ARG_STEPS) as ArgStep[]).map((arg) => (
        <section key={arg} className="group">
          <h2 className="group-heading">{ARG_STEPS[arg].question}</h2>
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
