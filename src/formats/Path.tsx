import { BRIDGES, PATH_INTRO } from '../content/copy'
import { EXPERIMENT_BY_ID, PATH } from '../content/experiments'
import { ExperimentCard, GroupedList } from '../components/ExperimentList'
import { Nav, Page } from '../components/Page'
import { Prose } from '../components/Prose'
import { Runner } from '../components/Runner'
import { useStore } from '../lib/store'
import { Close, Noticed } from './Shared'

const HOME = '#/path'

export function Path({ sub }: { sub?: string }) {
  const { done } = useStore()

  if (sub === 'noticed') {
    return (
      <Page home={HOME}>
        <Noticed />
        <Nav back={`${HOME}/${PATH[PATH.length - 1]}`} next={`${HOME}/close`} nextLabel="Continue" />
      </Page>
    )
  }

  if (sub === 'close') {
    return (
      <Page home={HOME}>
        <Close again={HOME} />
      </Page>
    )
  }

  const exp = sub ? EXPERIMENT_BY_ID[sub] : undefined
  if (exp) {
    const i = PATH.indexOf(exp.id)
    const onPath = i >= 0
    const nextHref = i + 1 < PATH.length ? `${HOME}/${PATH[i + 1]}` : `${HOME}/noticed`
    return (
      <Page home={HOME}>
        <a className="back" href={HOME}>
          ← All experiments
        </a>
        <Runner key={exp.id} experiment={exp} eyebrow={onPath ? `Suggested path · ${i + 1} of ${PATH.length}` : undefined}>
          {onPath ? (
            <div className="bridge">
              <p>{BRIDGES[exp.id]}</p>
              <a className="button" href={nextHref}>
                {i + 1 < PATH.length ? 'Continue the path' : 'See what you noticed'}
              </a>
              <a className="link quiet" href={HOME}>
                All experiments
              </a>
            </div>
          ) : (
            <a className="button" href={HOME}>
              Back to all experiments
            </a>
          )}
        </Runner>
      </Page>
    )
  }

  const nextOnPath = PATH.find((id) => !done.includes(id))
  const started = PATH.some((id) => done.includes(id))

  return (
    <Page home={HOME}>
      <h1>Seven experiments on your own mind</h1>
      <div className="lede">
        <Prose paras={PATH_INTRO} />
      </div>
      <section className="suggested">
        <h2>Suggested path</h2>
        <ol className="cards path-list">
          {PATH.map((id) => (
            <li key={id}>
              <ExperimentCard exp={EXPERIMENT_BY_ID[id]} href={`${HOME}/${id}`} />
            </li>
          ))}
        </ol>
        <a className="button" href={nextOnPath ? `${HOME}/${nextOnPath}` : `${HOME}/noticed`}>
          {!started ? 'Start the path' : nextOnPath ? 'Continue the path' : 'See what you noticed'}
        </a>
      </section>
      <h2 className="all-heading">All experiments</h2>
      <GroupedList base={HOME} headingLevel={3} />
    </Page>
  )
}
