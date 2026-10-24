import type { Answers, ArgStep, ObjectionId } from './types'

export const APP_TITLE = 'Who chose that?'

export const CREDIT = 'Based on Sam Harris, Free Will (2012). Not affiliated with or endorsed by Sam Harris.'

export const FORMATS = [
  {
    route: '#/walkthrough',
    title: 'Guided walkthrough',
    description: 'Four experiments in a fixed order, one screen at a time, ending with what you noticed.',
    tests: 'Does a fixed, linear sequence persuade a sceptic better than free exploration?',
  },
  {
    route: '#/library',
    title: 'Experiment library',
    description: 'All seven experiments, grouped by question. Do any, in any order.',
    tests: 'Do standalone, self-chosen experiments engage people and still add up to understanding?',
  },
  {
    route: '#/path',
    title: 'Library with a suggested path',
    description: 'The same library, with a recommended route through four of the experiments.',
    tests: 'Does a suggested route give the walkthrough’s coherence with the library’s freedom?',
  },
]

export const WALKTHROUGH_INTRO = [
  'You probably feel that you’re the author of your choices: that you consider the options, and then you, the conscious you, pick one. Most people do. It’s one of the most convincing feelings there is.',
  'This won’t try to argue you out of it. Instead you’ll run four small experiments on your own mind and look closely at what happens. After each one, we’ll name what you noticed.',
  'It takes about ten minutes. You’ll be asked to type a few short answers. They stay on this device.',
]

export const LIBRARY_INTRO = [
  'Do them in any order. Each takes a minute or two and ends with a short note on what it shows.',
  'You’ll be asked to type a few short answers. They stay on this device.',
]

export const PATH_INTRO = [
  'Each takes a minute or two and ends with a short note on what it shows.',
  'Not sure where to start? Follow the suggested path: four experiments that build on each other, about ten minutes in all. Or pick any experiment below.',
]

// Shown on the suggested path after finishing each experiment.
export const BRIDGES: Record<string, string> = {
  city: 'The city came to mind on its own. Next: does the same hold for every thought?',
  'next-thought': 'If thoughts arrive unbidden, what about decisions? Next: replay one.',
  rewind: 'Causes or chance. But surely you at least choose what you want? Next: test that.',
  want: 'That’s the path. Next: what you noticed, put together.',
}

// "What you noticed": the argument rebuilt from the user's own answers on the
// four path experiments, with a generic line wherever an answer is missing.
export function noticedLines(all: Record<string, Answers>): Record<ArgStep, string[]> {
  const city = all.city ?? {}
  const nt = all['next-thought'] ?? {}
  const rw = all.rewind ?? {}
  const want = all.want ?? {}
  return {
    A: [
      city.pick
        ? `When you chose a city, ${city.pick} came to mind and thousands of others didn’t. You didn’t decide which would.`
        : 'Options come to mind before you decide anything about them. You don’t pick which ones turn up.',
      nt.thought
        ? `When you waited for your next thought, “${nt.thought}” arrived without notice.`
        : 'Each thought arrives before you know it’s coming.',
    ],
    B: [
      rw.decision && rw.could
        ? rw.could === 'yes'
          ? `When you replayed “${rw.decision}”, you said you could have chosen differently. Then only chance could have made the difference, and chance isn’t you.`
          : `When you replayed “${rw.decision}”, you said it would go the same way. Then it was caused by things you didn’t choose.`
        : 'Replay any decision with everything the same, and either it comes out the same, because it was caused, or differently, by chance.',
    ],
    C: [
      want.food && want.result
        ? want.result === 'shifted'
          ? `When you tried to stop wanting ${want.food}, something shifted, but only because the right thought turned up to shift it.`
          : `When you tried to stop wanting ${want.food}, you couldn’t. You can refuse it, but you can’t simply choose not to want it.`
        : 'You can act against a want, but you can’t choose what you want.',
    ],
  }
}

export const NOTICED_SUMMARY = [
  'Put together: your choices are real, and they’re yours in the sense that they happen in you. But they’re built from thoughts you didn’t author, shaped by wants you didn’t choose, and produced by causes you didn’t pick, or by chance.',
  'Nowhere in that is the thing free will is supposed to be: a self standing apart from all of it, deciding.',
]

export const NOTICED_OBJECTIONS: ObjectionId[] = ['why-bother', 'responsible']

export const CLOSE = {
  heading: 'Where this leaves you',
  body: [
    'If you’ve followed along, you’ve watched choices arrive rather than seen yourself create them. Harris argues that this, once it sinks in, is far less bleak than it sounds.',
    'Your choices still matter. They still change what happens. What falls away is the picture of a separate you behind the scenes, pulling levers, and some of the weight that comes with it. It gets harder to hate yourself for being who you are, or anyone else for being who they are. What’s left is curiosity about why people, you included, do what they do.',
    'None of this asks you to believe anything. It only asks you to keep looking.',
  ],
  reading: [
    { title: 'Sam Harris, Free Will (2012)', note: 'short, and the source of this argument' },
    { title: 'Daniel Dennett & Gregg Caruso, Just Deserts (2021)', note: 'if you’re still unconvinced: the strongest case on both sides' },
    { title: 'Robert Sapolsky, Determined (2023)', note: 'the same conclusion, from a neuroscientist' },
  ],
}
