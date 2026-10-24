import { ARG_STEPS, EXPERIMENT_BY_ID } from '../content/experiments'
import { Deck } from '../components/Deck'
import { GroupedList } from '../components/ExperimentList'
import { Page } from '../components/Page'
import { go } from '../lib/router'
import { useStore } from '../lib/store'

const HOME = '#/library'

export function Library({ id }: { id?: string }) {
  const { markDone } = useStore()
  const exp = id ? EXPERIMENT_BY_ID[id] : undefined

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
    </Page>
  )
}
