import { OBJECTIONS } from '../content/objections'
import type { ObjectionId } from '../content/types'
import { Prose } from './Prose'

// The "But…" replies: collapsed until the user raises one.
export function Objections({ ids }: { ids: ObjectionId[] }) {
  if (!ids.length) return null
  return (
    <div className="objections">
      <p className="label">Not convinced?</p>
      {ids.map((id) => {
        const o = OBJECTIONS[id]
        return (
          <details key={id} className="objection">
            <summary>{o.label}</summary>
            <div className="objection-reply">
              <Prose paras={o.reply} />
              {o.reading && <Reading items={o.reading} />}
            </div>
          </details>
        )
      })}
    </div>
  )
}

export function Reading({ items }: { items: { title: string; note: string }[] }) {
  return (
    <ul className="reading">
      {items.map((r) => (
        <li key={r.title}>
          <cite>{r.title}</cite>: {r.note}
        </li>
      ))}
    </ul>
  )
}
