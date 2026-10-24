import type { Answers, ArgStep, Experiment } from './types'

export const ARG_STEPS: Record<ArgStep, { question: string; claim: string }> = {
  A: { question: 'Where do your thoughts come from?', claim: 'Thoughts arrive on their own' },
  B: { question: 'Could you have chosen otherwise?', claim: 'Causes or chance' },
  C: { question: 'Can you choose what you want?', claim: 'You don’t choose what you want' },
}

const CITIES = [
  'Lisbon', 'Nairobi', 'Osaka', 'Montreal', 'Buenos Aires', 'Istanbul', 'Hanoi',
  'Reykjavik', 'Cape Town', 'Lima', 'Seoul', 'Marrakesh', 'Vienna', 'Mumbai',
  'Havana', 'Prague', 'Auckland', 'Cairo', 'Oslo', 'Bogotá', 'Kyoto', 'Edinburgh',
  'Jakarta', 'Santiago', 'Chicago', 'Manila', 'Athens', 'Lagos', 'Vancouver', 'Perth',
]

// Four well-known cities the user didn't pick, stable for a given answer.
function otherCities(pick: string): string[] {
  const p = pick.trim().toLowerCase()
  let seed = 0
  for (const ch of p) seed = (seed * 31 + ch.charCodeAt(0)) >>> 0
  const pool = CITIES.filter((c) => c.toLowerCase() !== p)
  const out: string[] = []
  while (out.length < 4) {
    seed = (seed * 1103515245 + 12345) >>> 0
    const c = pool[seed % pool.length]
    if (!out.includes(c)) out.push(c)
  }
  return out
}

// "Because I like it" -> "I like it", so answers can be chained.
function reason(s: string | undefined): string {
  return (s ?? '').trim().replace(/^because\s*/i, '').replace(/[.\s]+$/, '')
}

// "because I sleep badly" -> "I sleep badly." for quoting back as a sentence.
function quoted(s: string | undefined): string {
  const r = reason(s)
  return `“${r.charAt(0).toUpperCase()}${r.slice(1)}.”`
}

export const EXPERIMENTS: Experiment[] = [
  {
    id: 'city',
    title: 'Pick a city',
    hook: 'Choose any city in the world, then look at how the choice was made.',
    minutes: 1,
    arg: 'A',
    steps: [
      {
        kind: 'text',
        body: [
          'Think of a city. Any city in the world. There are thousands to choose from, so take your time if you like.',
        ],
      },
      { kind: 'input', key: 'pick', prompt: 'Which city did you choose?', placeholder: 'Type a city' },
      {
        kind: 'reflect',
        body: (a: Answers) => {
          const [c1, c2, c3, c4] = otherCities(a.pick ?? '')
          return [
            `Did ${c1} occur to you? ${c2}? ${c3}? ${c4}?`,
            'You’ve heard of most of these, so in one sense they were available. But if they didn’t come to mind in the moment, they were never really options. You couldn’t have chosen them.',
            `And among the cities that did occur to you, why ${a.pick}? You can probably give a reason now. But notice the order: did the reason come first, or did ${a.pick} appear and the reason follow?`,
          ]
        },
      },
      {
        kind: 'name',
        body: (a: Answers) => [
          `You did choose ${a.pick}. But the shortlist was handed to you by memory, mood and whatever you’ve read or heard lately, and you didn’t decide what would be on it. The choosing happened at the very end of a process you never saw.`,
        ],
        objections: ['deliberated', 'could-otherwise'],
      },
    ],
  },
  {
    id: 'next-thought',
    title: 'The next thought',
    hook: 'Try to know your next thought before you think it.',
    minutes: 1,
    arg: 'A',
    steps: [
      {
        kind: 'text',
        body: [
          'For the next thirty seconds, try something simple: know what your next thought will be before you think it.',
          'Don’t plan a thought. That doesn’t count, because the plan is itself a thought that just appeared. Simply watch, and try to catch the next one on its way in.',
        ],
      },
      { kind: 'timer', seconds: 30, cue: 'Watch for the next thought.' },
      { kind: 'input', key: 'thought', prompt: 'What came up? A few words is enough.', placeholder: 'e.g. what’s for dinner' },
      {
        kind: 'reflect',
        body: (a: Answers) => [
          `“${a.thought}”. Did you know it was coming before it came?`,
          'Most people find that each thought simply appears. Even the thought “nothing’s coming” shows up unannounced. You can notice a thought, follow it or let it go, but each of those responses also arrives as another thought.',
        ],
      },
      {
        kind: 'name',
        body: [
          'You don’t write your thoughts before you think them. In a real sense you’re closer to their audience than their author. And every choice you make is built out of thoughts like these.',
        ],
        objections: ['my-brain'],
      },
    ],
  },
  {
    id: 'urge',
    title: 'The urge',
    hook: 'Tap a button whenever you feel like it, and watch for the moment the urge appears.',
    minutes: 1,
    arg: 'A',
    steps: [
      {
        kind: 'text',
        body: [
          'When you start, a button will appear. Tap it whenever you feel like it: any time in the next twenty seconds, or not at all. There’s no right moment.',
          'Your only job is to watch, as closely as you can, for the instant the urge to tap shows up.',
        ],
      },
      { kind: 'urge', key: 'tapAt', seconds: 20 },
      {
        kind: 'input',
        key: 'why',
        prompt: (a: Answers) =>
          a.tapAt === 'none'
            ? 'You didn’t tap. What happened instead?'
            : `You tapped after ${a.tapAt} seconds. Why then, and not two seconds earlier?`,
        placeholder: 'Whatever comes to mind',
      },
      {
        kind: 'reflect',
        body: (a: Answers) =>
          a.tapAt === 'none'
            ? [
                'Maybe the urge never came. Or maybe it came and something else arrived to veto it: curiosity about what would happen if you didn’t, or a wish to outsmart the experiment.',
                'Either way, notice that you didn’t choose whether the urge would appear, and you didn’t choose whether the veto would. Both just showed up.',
              ]
            : [
                'Look at the reason you just gave. Was it there before the tap, or did it arrive afterwards to explain it?',
                'At some moment the urge was simply there. You didn’t summon it. If you had, you’d have needed an earlier urge to summon it with. You could only notice it, and then act on it or not.',
              ],
      },
      {
        kind: 'name',
        body: [
          'Even a decision as open as “tap whenever you like” starts with an impulse that arrives on its own schedule. You can watch for it. You can’t author it in advance.',
        ],
        objections: ['trivial'],
      },
    ],
  },
  {
    id: 'ask-why',
    title: 'Ask why',
    hook: 'Make a small choice, then ask yourself why three times.',
    minutes: 2,
    arg: 'B',
    steps: [
      {
        kind: 'choice',
        key: 'drink',
        prompt: 'A quick one: tea or coffee? If you’d honestly pick neither, choose the one you’d have if you had to.',
        options: [
          { value: 'tea', label: 'Tea' },
          { value: 'coffee', label: 'Coffee' },
        ],
      },
      { kind: 'input', key: 'why1', prompt: (a) => `Why ${a.drink}?`, placeholder: 'Because…' },
      { kind: 'input', key: 'why2', prompt: (a) => `${quoted(a.why1)} Why is that?`, placeholder: 'Because…' },
      { kind: 'input', key: 'why3', prompt: (a) => `${quoted(a.why2)} And why is that?`, placeholder: 'Because…' },
      {
        kind: 'reflect',
        body: (a: Answers) => [
          `${a.drink === 'tea' ? 'Tea' : 'Coffee'}, because ${reason(a.why1)}. Because ${reason(a.why2)}. Because ${reason(a.why3)}.`,
          'Look at where the chain ends. Usually it’s somewhere like “I just like it”, “that’s how I was raised” or “I don’t know”. That’s bedrock: a preference or a fact about you that you didn’t pick, and couldn’t have picked, because picking it would have needed some earlier preference to pick with.',
        ],
      },
      {
        kind: 'name',
        body: [
          'Your reasons were real, and they did the work. That’s what deliberating is. But follow any reason back far enough and you reach something that was given to you: genes, upbringing, a thousand experiences you didn’t arrange. Causes, all the way down.',
          'The only alternative to causes is chance, and a choice that happens by chance isn’t authored by you either.',
        ],
        objections: ['deliberated', 'shape-desires'],
      },
    ],
  },
  {
    id: 'rewind',
    title: 'Rewind the tape',
    hook: 'Replay a recent decision with everything exactly the same.',
    minutes: 2,
    arg: 'B',
    steps: [
      {
        kind: 'input',
        key: 'decision',
        prompt: 'Think of a decision you made recently. A small one is fine. What was it?',
        placeholder: 'e.g. skipped the gym yesterday',
      },
      {
        kind: 'text',
        body: (a: Answers) => [
          `Now imagine rewinding the universe to the moment just before you decided: “${a.decision}”.`,
          'Every atom is back where it was. Your brain is in exactly the same state: the same memories, the same mood, the same half-formed thoughts. Nothing at all is different. Then press play.',
        ],
      },
      {
        kind: 'choice',
        key: 'could',
        prompt: 'Could you have chosen differently?',
        options: [
          { value: 'yes', label: 'Yes, I could have' },
          { value: 'no', label: 'No, it would go the same way' },
        ],
      },
      {
        kind: 'reflect',
        body: (a: Answers) => (a.could === 'yes' ? REWIND_YES : REWIND_NO),
        aside: {
          label: 'What if I’d answered the other way?',
          body: (a: Answers) => (a.could === 'yes' ? REWIND_NO : REWIND_YES),
        },
      },
      {
        kind: 'name',
        body: [
          'This is the dilemma. Either your choice was caused by things you didn’t choose, or it was partly random. Most likely it was some mix of both.',
          'Neither gives you what free will is supposed to be: you, the conscious one, as the true source of the choice, able to have done otherwise.',
        ],
        objections: ['could-otherwise', 'randomness'],
      },
    ],
  },
  {
    id: 'want',
    title: 'Choose what you want',
    hook: 'Try to stop wanting something you love.',
    minutes: 1,
    arg: 'C',
    steps: [
      { kind: 'input', key: 'food', prompt: 'Name a food you really love.', placeholder: 'e.g. dark chocolate' },
      {
        kind: 'text',
        body: (a: Answers) => [
          `For the next ten seconds, try to genuinely stop liking ${a.food}.`,
          'Not to act as if you dislike it: actually stop wanting it. Make it unappealing to yourself, by choice.',
        ],
      },
      { kind: 'timer', seconds: 10, cue: 'Try to stop wanting it.' },
      {
        kind: 'choice',
        key: 'result',
        prompt: 'How did it go?',
        options: [
          { value: 'still', label: 'I still like it' },
          { value: 'shifted', label: 'Something shifted a little' },
        ],
      },
      {
        kind: 'reflect',
        body: (a: Answers) => [
          a.result === 'shifted'
            ? 'If something shifted, look at how. Probably by thinking of something: a bad memory, an image, a reason. But you didn’t choose which thought would arrive and do the shifting, or whether it would work. You could only try, and see.'
            : `You could decide not to eat ${a.food}. You could refuse it for years. But you couldn’t decide not to want it. The wanting isn’t under your control the way the action is.`,
          'The philosopher Arthur Schopenhauer put it in one line: *“Man can do what he wills, but he cannot will what he wills.”*',
        ],
      },
      {
        kind: 'name',
        body: [
          'This is where the most common defence of free will runs into trouble. Many philosophers say you’re free whenever you act on your own desires without being forced. But you didn’t choose those desires.',
          'Being free to do what you want isn’t the freedom it sounds like if you can’t choose what you want.',
        ],
        objections: ['shape-desires', 'my-brain'],
      },
    ],
  },
  {
    id: 'swap',
    title: 'Swap places',
    hook: 'Imagine trading your whole history with someone who baffles you.',
    minutes: 2,
    arg: 'C',
    steps: [
      {
        kind: 'input',
        key: 'person',
        prompt: 'Think of someone whose choices you find baffling: someone you know, or a public figure. A name or a description is enough.',
        placeholder: 'e.g. my neighbour',
      },
      {
        kind: 'text',
        body: (a: Answers) => [
          `Keep “${a.person}” in mind. Now imagine you were given their genes. Their childhood. Every experience they’ve had, every book they read or didn’t, every conversation.`,
          'And this morning, their exact brain, with every atom in the same place.',
        ],
      },
      {
        kind: 'choice',
        key: 'would',
        prompt: 'In their place, would you choose differently from how they do?',
        options: [
          { value: 'yes', label: 'Yes, I’d choose differently' },
          { value: 'no', label: 'No, I’d do the same' },
        ],
      },
      {
        kind: 'reflect',
        body: (a: Answers) => [
          a.would === 'yes'
            ? 'What would make the difference? Every part of them is in place: their memories, values, fears and reasoning. There’s nothing of yours left over to do the choosing differently. If “you” did choose otherwise, it would have to be an extra self, standing outside everything that makes a person who they are.'
            : 'Right. In their place you wouldn’t be you, looking at their life. You’d be them. Their reasons would feel convincing, because they’d be your reasons.',
          'Now turn it around. You didn’t pick your genes or your childhood either. The person making your choices was put together by things you never chose.',
        ],
      },
      {
        kind: 'name',
        body: [
          'A common reply is that you’re free when your choices flow from you: your character, your values. But “you” is exactly the part that was handed to you. There’s no further self behind your character who got to choose it.',
        ],
        objections: ['my-brain', 'responsible'],
      },
    ],
  },
]

const REWIND_NO = [
  'Then the decision followed from how things were at that moment: your brain, your history, your situation. Rewind it a thousand times and you get the same choice a thousand times.',
  'That’s what it means for a choice to be caused. And you didn’t choose the causes. You didn’t choose your brain’s state at that moment, or the history that produced it.',
]

const REWIND_YES = [
  'Then something made the difference on the second run. But what? Not your reasons, character or preferences, because those were identical. Whatever tipped it was, by definition, nothing about you.',
  'That’s chance. And a coin flip happening inside your head isn’t freedom. If your choices sometimes came out differently for no reason at all, you’d be less in control of them, not more.',
]

export const EXPERIMENT_BY_ID: Record<string, Experiment> = Object.fromEntries(
  EXPERIMENTS.map((e) => [e.id, e]),
)

// The walkthrough and the suggested path use the same four, in this order.
export const PATH = ['city', 'next-thought', 'rewind', 'want']
