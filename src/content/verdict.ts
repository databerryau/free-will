import { CREDIT } from './copy'
import { HUES } from './experiments'
import { READING } from './objections'
import type { Argument, Screen } from './types'

// The end of a playthrough: "Has this convinced you?", then either an
// affirming close (yes) or the strongest objections, each answered (no).

export function verdictScreens(base: string): Screen[] {
  return [
    { kind: 'say', text: 'One last question, and there’s no wrong answer.' },
    {
      kind: 'links',
      text: 'Has this convinced you that free will is an illusion?',
      links: [
        { label: 'Yes', href: `${base}/yes` },
        { label: 'No', href: `${base}/arguments` },
      ],
    },
  ]
}

export const YES: Screen[] = [
  { kind: 'say', text: 'Then you’ve seen something most people never stop to look at.' },
  {
    kind: 'say',
    text: 'Your thoughts and choices arise out of a world far larger than you. Your genes, your history, every person you’ve met, the light in the room right now.',
  },
  {
    kind: 'say',
    text: 'That doesn’t make you smaller. It means there is no line where the world stops and you begin. In this moment, the universe is happening as you.',
  },
  {
    kind: 'say',
    text: 'And there is real freedom in seeing this. The burden of being a separate self, pulling levers from behind your eyes, can be put down.',
  },
  {
    kind: 'say',
    text: 'Hatred gets harder to sustain, toward others and toward yourself. Regret softens into understanding. Pride gives way to gratitude.',
  },
  {
    kind: 'say',
    text: 'Your choices still matter. They are how the future gets made. You get to watch it unfold with more curiosity and less fear.',
  },
  { kind: 'say', text: 'So pay attention. Your next thought is about to arrive, and you have no idea what it will be.' },
  { kind: 'reading', heading: 'To go further', items: READING, note: CREDIT },
]

export const UNCONVINCED: Screen[] = [
  {
    kind: 'say',
    text: 'That’s fair. The feeling of free will is one of the most stubborn there is, and arguments rarely dislodge it.',
  },
  {
    kind: 'say',
    text: 'Harris would say the evidence was never in the arguments anyway. It’s in your own experience, available whenever you look.',
  },
  { kind: 'say', text: 'So the next time you make a choice, try noticing the moment it arrives. Then ask where it came from.' },
  {
    kind: 'reading',
    heading: 'The best case on the other side',
    items: [
      { title: 'Daniel Dennett & Gregg Caruso, Just Deserts (2021)', note: 'A defender of free will and a sceptic, argued face to face.' },
      { title: 'Daniel Dennett, Freedom Evolves (2003)', note: 'The most influential case that free will survives science.' },
      { title: 'Sam Harris, Free Will (2012)', note: 'The short book this is based on.' },
    ],
    note: CREDIT,
  },
]

export const ARGUMENTS: Argument[] = [
  {
    id: 'feel',
    label: '“I can feel myself choosing.”',
    hook: 'The sense of being the author is right there.',
    art: 'field',
    hue: HUES.violet,
    screens: [
      { kind: 'say', text: 'That feeling is real. The question is what it’s a feeling of.' },
      { kind: 'think', text: 'Choose a hand, left or right, and raise it. Take your time.', done: 'Done' },
      { kind: 'say', text: 'Now look back at that moment. Why that hand? Why then?' },
      {
        kind: 'say',
        text: 'Notice what you actually saw. An impulse appeared, and then a hand moved. Did you witness yourself creating the impulse?',
      },
      { kind: 'say', text: 'There may have been a sense of *I’m choosing*. But that sense simply arrived too, along with everything else.' },
      {
        kind: 'say',
        text: 'Look closely for the chooser, the one who stands behind the choice and makes it. Most people find no one there.',
      },
    ],
    closing: 'Look for the one who chose. What do you find?',
  },
  {
    id: 'otherwise',
    label: '“I could have done otherwise.”',
    hook: 'Surely nothing forced my hand.',
    art: 'spiral',
    hue: HUES.blue,
    screens: [
      { kind: 'say', text: 'This is the heart of the matter, so it deserves a careful look.' },
      { kind: 'say', text: 'Think of a recent moment when you hesitated between two options, then picked one.' },
      { kind: 'say', text: 'Could you have picked the other? Yes, if you had wanted to. But could you have wanted to?' },
      {
        kind: 'say',
        text: 'To want differently, something in you would have had to be different. A different mood. A different thought, surfacing at a different moment.',
      },
      {
        kind: 'say',
        text: 'You didn’t choose your mood. You didn’t choose which thought surfaced. Had they been different, so would your choice.',
      },
      {
        kind: 'say',
        text: '*I could have done otherwise* turns out to mean *I would have, had I been different*. And you never chose how you were.',
      },
    ],
    closing: 'Could you have been different, in that moment, by choice?',
  },
  {
    id: 'random',
    label: '“The universe isn’t fully determined.”',
    hook: 'Quantum randomness leaves room for freedom.',
    art: 'ripple',
    hue: HUES.coral,
    screens: [
      { kind: 'say', text: 'Perhaps it does. Physics may well be random at some level.' },
      {
        kind: 'say',
        text: 'So imagine your brain contains a tiny dice roll. At the moment of decision, it tips you one way or the other.',
      },
      { kind: 'think', text: 'Picture the next big decision of your life being settled by that roll.', done: 'OK' },
      { kind: 'say', text: 'Does that make you feel more free?' },
      {
        kind: 'say',
        text: 'A choice that happens by chance is no more yours than one that was caused. You would control the dice no better than you control the laws of physics.',
      },
      {
        kind: 'say',
        text: 'Causes leave no room for you. Chance leaves none either. Mixing the two doesn’t conjure up a third thing.',
      },
    ],
    closing: 'Between causes and chance, where would you fit?',
  },
  {
    id: 'brain',
    label: '“I am my brain, so I chose.”',
    hook: 'My brain’s decisions are my decisions.',
    art: 'roots',
    hue: HUES.teal,
    screens: [
      { kind: 'say', text: 'In one sense, yes. Nobody else made your choice. It happened in your head.' },
      { kind: 'say', text: 'But notice what that concedes. Your brain decides, and you, the conscious you, find out.' },
      { kind: 'think', text: 'Try to notice your brain recognising these words, or keeping you breathing.', done: 'I can’t' },
      { kind: 'say', text: 'Nobody can. Most of what your brain does, deciding included, is invisible to you.' },
      { kind: 'say', text: 'If that counts as you choosing, then you also choose your heartbeat, and tonight’s dreams.' },
      {
        kind: 'say',
        text: 'That isn’t the freedom people mean. They mean the conscious self as the author of its thoughts. And that self is always the last to know.',
      },
    ],
    closing: 'Is the part of you reading this the part making your choices?',
  },
  {
    id: 'compatible',
    label: '“Free will just means not being forced.”',
    hook: 'If no one is coercing me, I’m free.',
    art: 'mirror',
    hue: HUES.gold,
    hue2: HUES.violet,
    screens: [
      {
        kind: 'say',
        text: 'This is the most popular view among philosophers. You’re free when you act on your own desires, with no gun to your head.',
      },
      { kind: 'say', text: 'There’s something to it. It matters a great deal whether a person is coerced, addicted or deceived.' },
      { kind: 'say', text: 'But where do your desires come from? You didn’t author them. You found them already in place.' },
      {
        kind: 'say',
        text: 'Now suppose a neuroscientist had secretly installed those same desires last night. You would feel exactly as you do now.',
      },
      {
        kind: 'say',
        text: 'Most people say that wouldn’t be free will. Yet your genes and upbringing did the same thing, only more slowly.',
      },
      {
        kind: 'say',
        text: 'Calling this free will keeps the name and changes the subject. It’s not the freedom most people believe they have.',
      },
    ],
    closing: 'If the scientist’s implant wouldn’t make you free, why would your genes?',
  },
  {
    id: 'veto',
    label: '“I can veto my impulses.”',
    hook: 'Free won’t, if not free will.',
    art: 'flame',
    hue: HUES.rose,
    screens: [
      { kind: 'say', text: 'It’s true. You can feel the urge to check your phone and decide not to.' },
      { kind: 'think', text: 'Try it now. Wait for the next urge to move or shift, and don’t act on it.', done: 'Done' },
      { kind: 'say', text: 'Where did the veto come from? It was another thought, arising just as the urge did.' },
      {
        kind: 'say',
        text: 'Sometimes the veto appears and sometimes it doesn’t. You can’t summon it in advance any more than you could the urge.',
      },
      {
        kind: 'say',
        text: 'If you could, you would never break a resolution. Anyone who has tried to give something up knows how that goes.',
      },
    ],
    closing: 'Did you choose the thought that stopped you?',
  },
  {
    id: 'meaning',
    label: '“Then nothing matters.”',
    hook: 'Why bother doing anything?',
    art: 'dawn',
    hue: HUES.gold,
    screens: [
      { kind: 'say', text: 'This is the most common worry, and it’s understandable. But it confuses two very different ideas.' },
      {
        kind: 'say',
        text: 'Fatalism says your choices make no difference, because the outcome is fixed whatever you do. Nobody here is claiming that.',
      },
      { kind: 'say', text: 'Your choices make all the difference. They are part of the chain of causes that shapes the future.' },
      {
        kind: 'say',
        text: 'Decide to stay in bed for a year and your life will go differently. The decision matters, even though you didn’t conjure it from nothing.',
      },
      {
        kind: 'say',
        text: 'And notice that the question *why bother?* arises on its own. So does the answer, which is usually some wish to do something.',
      },
    ],
    closing: 'Does a choice need an uncaused author to change the world?',
  },
  {
    id: 'responsible',
    label: '“Then no one is responsible.”',
    hook: 'Without free will, morality collapses.',
    art: 'city',
    hue: HUES.gold,
    screens: [
      { kind: 'say', text: 'This is the gravest worry. If no one could have done otherwise, how can we hold anyone to account?' },
      {
        kind: 'say',
        text: 'Imagine a man commits a terrible crime. Then a scan reveals a tumour pressing on the part of his brain that restrains impulses.',
      },
      {
        kind: 'say',
        text: 'Most people’s anger changes. He’s still dangerous, and we still need protecting. But hatred no longer seems to fit.',
      },
      {
        kind: 'say',
        text: 'Now consider that every criminal’s brain was shaped by causes he didn’t choose. The tumour is simply a cause we can see.',
      },
      {
        kind: 'say',
        text: 'We can still restrain people, deter them and help them change. What falls away is the appetite for revenge.',
      },
      { kind: 'say', text: 'Seen this way, morality survives the loss of free will. It may even become kinder.' },
    ],
    closing: 'If the tumour changes how you see him, what about the causes no scan can show?',
  },
]

export const ARGUMENT_BY_ID: Record<string, Argument> = Object.fromEntries(ARGUMENTS.map((a) => [a.id, a]))
