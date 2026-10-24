import type { ObjectionId } from './types'

export type Objection = {
  label: string
  reply: string[]
  reading?: { title: string; note: string }[]
}

export const OBJECTIONS: Record<ObjectionId, Objection> = {
  deliberated: {
    label: 'But I deliberated. I weighed the options.',
    reply: [
      'You did, and deliberation does real work. It’s part of how the choice got made.',
      'But watch it happen. Considerations come to mind, and at some point one of them feels weightier than the rest. You didn’t choose which ones would occur to you, or which would feel decisive. Deliberation is something you can observe, not something you stand outside of.',
    ],
  },
  'could-otherwise': {
    label: 'But I could have chosen otherwise.',
    reply: [
      'In what sense? If everything about you and the world were identical, the only way to get a different outcome is for something that isn’t you to vary. That’s chance.',
      'If something about you had been different, then yes, you might have chosen differently. But you didn’t choose that difference either.',
    ],
  },
  randomness: {
    label: 'But physics isn’t fully determined, so there’s room for freedom.',
    reply: [
      'Perhaps some events in the brain really are random. But randomness isn’t authorship.',
      'If your choices sometimes came out differently for no reason, that would make you less in control of them, not more. Chance adds unpredictability, not freedom.',
    ],
  },
  'my-brain': {
    label: 'But I am my brain, so I did choose.',
    reply: [
      'Agreed: the choice happened in you, and nobody else made it.',
      'But that isn’t what free will feels like from the inside. It feels as though you, the conscious one, are the source of your thoughts and could have done otherwise. “My brain did it” concedes that the choosing was done by processes you don’t witness and didn’t choose.',
    ],
  },
  trivial: {
    label: 'But that was trivial. Real decisions are different.',
    reply: [
      'Big decisions take longer and involve more: more reasons, more feelings, more time to reflect.',
      'But each of those arrives the same way the urge did. More steps don’t add an author. They add more to notice.',
    ],
  },
  'shape-desires': {
    label: 'But I can change what I want over time.',
    reply: [
      'You can. People train themselves out of habits and into new tastes all the time.',
      'But look at where the project came from: a wish to change, the energy to stick with it, the ideas that helped. Those arrived too. Self-improvement is real; it’s just more of the chain, not a way out of it.',
    ],
  },
  'why-bother': {
    label: 'But then why bother doing anything?',
    reply: [
      'That’s fatalism, which is a different idea. Fatalism says your choices don’t matter because the outcome is fixed either way.',
      'But your choices are part of what fixes the outcome. If you stop trying, things go differently. Effort, thought and intention still work; you just didn’t author them from nowhere.',
    ],
  },
  responsible: {
    label: 'But then is no one responsible?',
    reply: [
      'A fair and important question, and a bigger one than these experiments cover.',
      'Briefly: holding people accountable can still make sense because of what it achieves, such as protection, deterrence and repair. What loses its footing is the idea that anyone deserves to suffer simply for being who they are. If you want to go further:',
    ],
    reading: [
      { title: 'Sam Harris, Free Will (2012)', note: 'his short chapter on moral responsibility' },
      { title: 'Robert Sapolsky, Determined (2023)', note: 'what follows for blame, punishment and praise' },
      {
        title: 'Daniel Dennett & Gregg Caruso, Just Deserts (2021)',
        note: 'a defender of free will and a sceptic debating exactly this',
      },
    ],
  },
}
