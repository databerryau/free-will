import { clean } from './experiments'
import { READING } from './objections'
import type { AllAnswers, Screen } from './types'

export const APP_TITLE = 'Who chose that?'

export const CREDIT = 'Based on Free Will by Sam Harris (2012). Not affiliated with or endorsed by him.'

export const FORMATS = [
  {
    route: '#/walkthrough',
    title: 'Guided walkthrough',
    description: 'Four experiments in a fixed order, ending with what you noticed.',
    tests: 'Does a fixed, linear sequence persuade a sceptic better than free exploration?',
  },
  {
    route: '#/library',
    title: 'Experiment library',
    description: 'All seven experiments. Start anywhere.',
    tests: 'Do standalone, self-chosen experiments engage people and still add up to understanding?',
  },
  {
    route: '#/path',
    title: 'Library with a path',
    description: 'The same seven, with a suggested route through four of them.',
    tests: 'Does a suggested route give the walkthrough’s coherence with the library’s freedom?',
  },
]

export const INTRO: Screen[] = [
  { kind: 'say', text: 'Most of us feel that we are the authors of our own thoughts and actions.' },
  {
    kind: 'say',
    text: 'The feeling is so compelling that doubting it can seem absurd. But it doesn’t survive close inspection.',
  },
  { kind: 'say', text: 'You don’t need to take anyone’s word for this. You can look for yourself.' },
  { kind: 'say', text: 'Four short experiments. About ten minutes. Your answers never leave this device.' },
]

const line = (all: AllAnswers) => ({
  city: all.city ?? {},
  thought: all['next-thought'] ?? {},
  rewind: all.rewind ?? {},
  want: all.want ?? {},
})

// The argument rebuilt from the user's own answers on the four path experiments.
export const NOTICED: Screen[] = [
  { kind: 'say', text: 'Let’s look at what you noticed.' },
  {
    kind: 'say',
    text: (_, all) => {
      const { city } = line(all)
      return city.pick
        ? `When you picked a city, *${clean(city.pick)}* came to mind. Thousands of others didn’t, and you didn’t choose which.`
        : 'When you pick a city, one comes to mind and thousands don’t. You don’t choose which.'
    },
  },
  {
    kind: 'say',
    text: (_, all) => {
      const { thought } = line(all)
      return thought.thought
        ? `When you waited for your next thought, *“${clean(thought.thought)}”* appeared without warning.`
        : 'When you wait for your next thought, it appears without warning.'
    },
  },
  {
    kind: 'say',
    text: (_, all) => {
      const { rewind } = line(all)
      if (!rewind.decision || !rewind.could) {
        return 'Replay any decision exactly, and it either comes out the same, because it was caused, or differently, by chance.'
      }
      return rewind.could === 'yes'
        ? `You said *“${clean(rewind.decision)}”* could have gone differently. Then the difference was chance, and chance isn’t you.`
        : `You said *“${clean(rewind.decision)}”* would go the same way every time. Then it was caused by things you didn’t choose.`
    },
  },
  {
    kind: 'say',
    text: (_, all) => {
      const { want } = line(all)
      if (!want.food) return 'And you can’t stop wanting what you want simply by deciding to.'
      return want.result === 'shifted'
        ? `And when your appetite for *${clean(want.food)}* shifted, it was because a thought arose that you didn’t choose.`
        : `And you couldn’t stop wanting *${clean(want.food)}*, however hard you tried.`
    },
  },
  {
    kind: 'say',
    text: 'Your choices are real, and they matter. But they arise from thoughts you didn’t author and desires you didn’t choose.',
  },
  {
    kind: 'name',
    claim: 'Look for the chooser',
    text: 'Look for the self that stands apart from all this, making the choices. It isn’t there.',
    objections: ['why-bother', 'responsible'],
  },
]

export const CLOSE: Screen[] = [
  { kind: 'say', text: 'None of this means your choices don’t matter. They still change the world.' },
  {
    kind: 'say',
    text: 'What falls away is the sense of being a separate self, pulling levers from somewhere behind your eyes.',
  },
  {
    kind: 'say',
    text: 'Seeing this clearly can be a relief. It becomes harder to hate other people, or yourself, for being who you are.',
  },
  {
    kind: 'say',
    text: 'In place of judgement, you are left with curiosity about why people do what they do. Including you.',
  },
  { kind: 'reading', heading: 'To go further', items: READING, note: CREDIT },
]

// Final screen of each experiment on the suggested path.
export const BRIDGES: Record<string, string> = {
  city: 'That city came to mind on its own. Does every thought?',
  'next-thought': 'If thoughts arise on their own, what about decisions?',
  rewind: 'Causes or chance. But surely you choose what you want?',
  want: 'That’s the path. Now let’s put it together.',
}
