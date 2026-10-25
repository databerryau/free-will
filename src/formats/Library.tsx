import { useEffect } from 'react'
import { ARG_STEPS, EXPERIMENT_BY_ID } from '../content/experiments'
import { Deck } from '../components/Deck'
import { GroupedList } from '../components/ExperimentList'
import { Page } from '../components/Page'
import { go } from '../lib/router'
import { useStore } from '../lib/store'
import { VERDICT_STEPS, Verdict } from './Verdict'

const HOME = '#/library'

export function Library({ id, flag }: { id?: string; flag?: string }) {
  const { markDone, forget } = useStore()
  const exp = id ? EXPERIMENT_BY_ID[id] : undefined

  // Each experiment is its own playthrough: leaving it, finished or not,
  // wipes its answers so the next person doesn't see them.
  useEffect(() => {
    if (exp) return () => forget(exp.id)
  }, [exp, forget])

  if (id && VERDICT_STEPS.includes(id)) {
    return <Verdict base={HOME} step={id} argId={flag} backHref={HOME} />
  }

  if (exp) {
    return (
      <Deck
        key={exp.id}
        screens={exp.screens}
        expId={exp.id}
        art={exp.art}
        hue={exp.hue}
        hue2={exp.hue2}
        claim={ARG_STEPS[exp.arg].claim}
        eyebrow={exp.title}
        exitHref={HOME}
        finishLabel="Back to experiments"
        onFinish={() => go(HOME)}
        onBack={() => go(HOME)}
        onComplete={() => markDone(exp.id)}
      />
    )
  }

  return (
    <Page home={HOME} art="think" title="Seven experiments" lede="Short experiments on your own mind. Each takes a minute or two. Start anywhere.">
      <GroupedList base={HOME} />
      <section className="convinced-yet">
        <h2 className="group-heading">Convinced yet?</h2>
        <a className="pill" href={`${HOME}/verdict`}>
          Answer one last question
        </a>
      </section>
    </Page>
  )
}
