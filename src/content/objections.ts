import type { ObjectionId, ReadingItem } from './types'

export type Objection = {
  label: string
  reply: string[]
  reading?: ReadingItem[]
}

export const READING: ReadingItem[] = [
  { title: 'Sam Harris, Free Will (2012)', note: 'The short book this is based on.' },
  { title: 'Daniel Dennett & Gregg Caruso, Just Deserts (2021)', note: 'The best case on both sides, argued face to face.' },
  { title: 'Robert Sapolsky, Determined (2023)', note: 'The same conclusion, reached through biology.' },
]

export const OBJECTIONS: Record<ObjectionId, Objection> = {
  deliberated: {
    label: 'But I deliberated.',
    reply: [
      'Of course you did, and deliberation matters. But watch it closely.',
      'Considerations arise, and one of them comes to feel decisive. You don’t choose which ones arise, or which one wins.',
    ],
  },
  'could-otherwise': {
    label: 'But I could have done otherwise.',
    reply: [
      'Only if something had been different. And you didn’t choose that difference either.',
      'Rewind the universe exactly, and the only thing that could change the outcome is chance.',
    ],
  },
  randomness: {
    label: 'But the universe isn’t fully determined.',
    reply: [
      'Perhaps it isn’t. But indeterminism doesn’t help.',
      'A choice that happens by chance is no more yours than one that was caused.',
    ],
  },
  'my-brain': {
    label: 'But I am my brain. So I chose.',
    reply: [
      'In a sense, yes. But that isn’t what free will feels like.',
      'It feels as if the conscious you is the source of your choices. In fact they emerge from processes you neither see nor control.',
    ],
  },
  trivial: {
    label: 'But that was trivial.',
    reply: [
      'Big decisions take longer and involve more thoughts.',
      'But every one of those thoughts arrives the way this urge did. More steps don’t add an author.',
    ],
  },
  'shape-desires': {
    label: 'But I can change what I want.',
    reply: [
      'You can. But where did the wish to change come from? And the discipline to follow through?',
      'Those arose too. Self-improvement is real. It’s simply part of the same causal story.',
    ],
  },
  'why-bother': {
    label: 'Then why bother doing anything?',
    reply: [
      'That’s fatalism, and it doesn’t follow.',
      'Your choices still matter, because they still cause things. If you stop trying, things turn out differently.',
    ],
  },
  responsible: {
    label: 'Then is no one responsible?',
    reply: [
      'That question deserves more than a few lines.',
      'In brief, we can still hold people accountable for the good it does. What disappears is the idea that anyone deserves to suffer for being who they are.',
    ],
    reading: READING,
  },
}
