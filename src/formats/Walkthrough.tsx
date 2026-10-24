import { APP_TITLE, WALKTHROUGH_INTRO } from '../content/copy'
import { EXPERIMENT_BY_ID, PATH } from '../content/experiments'
import { Nav, Page } from '../components/Page'
import { Prose } from '../components/Prose'
import { Runner } from '../components/Runner'
import { Close, Noticed } from './Shared'

const HOME = '#/walkthrough'
const to = (n: number) => `${HOME}/${n}`

// Screens: 0 intro · 1–4 experiments · 5 what you noticed · 6 close.
export function Walkthrough({ screen }: { screen: number }) {
  const n = Number.isInteger(screen) ? Math.min(Math.max(screen, 0), PATH.length + 2) : 0

  if (n === 0) {
    return (
      <Page home={HOME}>
        <div className="intro">
          <h1>{APP_TITLE}</h1>
          <Prose paras={WALKTHROUGH_INTRO} />
          <a className="button" href={to(1)}>
            Begin
          </a>
        </div>
      </Page>
    )
  }

  if (n <= PATH.length) {
    const exp = EXPERIMENT_BY_ID[PATH[n - 1]]
    return (
      <Page home={HOME}>
        <Runner key={exp.id} experiment={exp} eyebrow={`Experiment ${n} of ${PATH.length}`}>
          <Nav back={to(n - 1)} next={to(n + 1)} nextLabel={n < PATH.length ? 'Next experiment' : 'Put it together'} />
        </Runner>
      </Page>
    )
  }

  if (n === PATH.length + 1) {
    return (
      <Page home={HOME}>
        <Noticed />
        <Nav back={to(n - 1)} next={to(n + 1)} nextLabel="Continue" />
      </Page>
    )
  }

  return (
    <Page home={HOME}>
      <Close again={HOME} />
    </Page>
  )
}
