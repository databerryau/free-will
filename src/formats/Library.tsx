import { LIBRARY_INTRO } from '../content/copy'
import { EXPERIMENT_BY_ID } from '../content/experiments'
import { GroupedList } from '../components/ExperimentList'
import { Page } from '../components/Page'
import { Prose } from '../components/Prose'
import { Runner } from '../components/Runner'

const HOME = '#/library'

export function Library({ id }: { id?: string }) {
  const exp = id ? EXPERIMENT_BY_ID[id] : undefined

  if (exp) {
    return (
      <Page home={HOME}>
        <a className="back" href={HOME}>
          ← All experiments
        </a>
        <Runner key={exp.id} experiment={exp}>
          <a className="button" href={HOME}>
            Back to all experiments
          </a>
        </Runner>
      </Page>
    )
  }

  return (
    <Page home={HOME}>
      <h1>Seven experiments on your own mind</h1>
      <div className="lede">
        <Prose paras={LIBRARY_INTRO} />
      </div>
      <GroupedList base={HOME} />
    </Page>
  )
}
