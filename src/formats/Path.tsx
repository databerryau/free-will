import { BRIDGES, CLOSE, NOTICED } from '../content/copy'
import { ARG_STEPS, EXPERIMENT_BY_ID, HUES, PATH } from '../content/experiments'
import { Deck } from '../components/Deck'
import { ExperimentCard, GroupedList } from '../components/ExperimentList'
import { Page } from '../components/Page'
import { go } from '../lib/router'
import { useStore } from '../lib/store'

const HOME = '#/path'

export function Path({ sub }: { sub?: string }) {
  const { done, markDone } = useStore()

  if (sub === 'noticed') {
    return (
      <Deck
        key="noticed"
        screens={NOTICED}
        art="field"
        hue={HUES.gold}
        eyebrow="What you noticed"
        exitHref={HOME}
        finishLabel="Continue"
        onFinish={() => go(`${HOME}/close`)}
        onBack={() => go(`${HOME}/${PATH[PATH.length - 1]}`)}
      />
    )
  }

  if (sub === 'close') {
    return (
      <Deck
        key="close"
        screens={CLOSE}
        art="dawn"
        hue={HUES.gold}
        exitHref={HOME}
        finishLabel="Back to experiments"
        onFinish={() => go(HOME)}
        onBack={() => go(`${HOME}/noticed`)}
      />
    )
  }

  const exp = sub ? EXPERIMENT_BY_ID[sub] : undefined
  if (exp) {
    const i = PATH.indexOf(exp.id)
    const onPath = i >= 0
    const lastOnPath = i === PATH.length - 1
    return (
      <Deck
        key={exp.id}
        screens={onPath ? [...exp.screens, { kind: 'say', text: BRIDGES[exp.id] }] : exp.screens}
        expId={exp.id}
        art={exp.art}
        hue={exp.hue}
        hue2={exp.hue2}
        claim={ARG_STEPS[exp.arg].claim}
        eyebrow={onPath ? `Path ${i + 1} of ${PATH.length} · ${exp.title}` : exp.title}
        exitHref={HOME}
        finishLabel={!onPath ? 'Back to experiments' : lastOnPath ? 'Put it together' : 'Continue the path'}
        onFinish={() => go(!onPath ? HOME : lastOnPath ? `${HOME}/noticed` : `${HOME}/${PATH[i + 1]}`)}
        onBack={() => go(HOME)}
        onComplete={() => markDone(exp.id)}
      />
    )
  }

  const nextOnPath = PATH.find((id) => !done.includes(id))
  const started = PATH.some((id) => done.includes(id))

  return (
    <Page home={HOME} art="think" title="Seven experiments" lede="Short experiments on your own mind. If you’re not sure where to start, follow the path.">
      <section className="suggested">
        <h2 className="group-heading">The path</h2>
        <ol className="cards">
          {PATH.map((id, n) => (
            <li key={id}>
              <ExperimentCard exp={EXPERIMENT_BY_ID[id]} href={`${HOME}/${id}`} number={n + 1} />
            </li>
          ))}
        </ol>
        <a className="pill" href={nextOnPath ? `${HOME}/${nextOnPath}` : `${HOME}/noticed`}>
          {!started ? 'Start the path' : nextOnPath ? 'Continue the path' : 'Put it together'}
        </a>
      </section>
      <h2 className="all-heading">Or start anywhere</h2>
      <GroupedList base={HOME} />
    </Page>
  )
}
