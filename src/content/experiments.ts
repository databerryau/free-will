import type { Answers, ArgStep, Experiment } from './types'

export const ARG_STEPS: Record<ArgStep, { question: string; claim: string }> = {
  A: { question: 'Where do your thoughts come from?', claim: 'Thoughts arise on their own' },
  B: { question: 'Could you have done otherwise?', claim: 'Causes or chance' },
  C: { question: 'Can you choose what you want?', claim: 'You can’t choose what you want' },
}

export const HUES = {
  gold: '#f4b860',
  violet: '#a895ff',
  coral: '#ff8a6b',
  teal: '#5fd6c0',
  blue: '#74a9ff',
  rose: '#ff8fb3',
}

const CITIES = [
  'Lisbon', 'Nairobi', 'Osaka', 'Montreal', 'Buenos Aires', 'Istanbul', 'Hanoi',
  'Reykjavik', 'Cape Town', 'Lima', 'Seoul', 'Marrakesh', 'Vienna', 'Mumbai',
  'Havana', 'Prague', 'Auckland', 'Cairo', 'Oslo', 'Bogotá', 'Kyoto', 'Edinburgh',
  'Jakarta', 'Santiago', 'Chicago', 'Manila', 'Athens', 'Lagos', 'Vancouver', 'Perth',
]

// Three well-known cities the user didn't pick, stable for a given answer.
export function otherCities(pick: string): string[] {
  const p = pick.trim().toLowerCase()
  let seed = 0
  for (const ch of p) seed = (seed * 31 + ch.charCodeAt(0)) >>> 0
  const pool = CITIES.filter((c) => c.toLowerCase() !== p)
  const out: string[] = []
  while (out.length < 3) {
    seed = (seed * 1103515245 + 12345) >>> 0
    const c = pool[seed % pool.length]
    if (!out.includes(c)) out.push(c)
  }
  return out
}

// Trim an answer for quoting: "Because I like it." -> "I like it"
export function clean(s: string | undefined): string {
  return (s ?? '').trim().replace(/^because\s*/i, '').replace(/[.!?\s]+$/, '')
}

// "because I sleep badly" -> “I sleep badly.”
function quoted(s: string | undefined): string {
  const r = clean(s)
  return `“${r.charAt(0).toUpperCase()}${r.slice(1)}.”`
}

const tapped = (a: Answers) => a.tapAt !== 'none'

export const EXPERIMENTS: Experiment[] = [
  {
    id: 'city',
    title: 'Pick a city',
    hook: 'Choose any city. Then look at how you chose.',
    minutes: 1,
    arg: 'A',
    art: 'city',
    hue: HUES.gold,
    screens: [
      { kind: 'think', text: 'Think of a city. Any city at all.', done: 'Got one' },
      { kind: 'input', key: 'pick', prompt: 'Which city came to mind?', placeholder: 'A city' },
      {
        kind: 'say',
        text: (a) => {
          const [c1, c2, c3] = otherCities(a.pick ?? '')
          return `Did *${c1}* occur to you? What about *${c2}*, or *${c3}*?`
        },
      },
      {
        kind: 'say',
        text: 'You know these cities. But if they didn’t occur to you, they were never really options. You can’t choose what doesn’t come to mind.',
      },
      { kind: 'say', text: (a) => `And why *${clean(a.pick)}*, rather than some other city that did occur to you?` },
      {
        kind: 'say',
        text: (a) => `You may have a reason now. But look closely. Did the reason come first? Or did *${clean(a.pick)}* appear, and the reason follow?`,
      },
      {
        kind: 'name',
        text: 'Your choice came last. Everything it depended on appeared in your mind unbidden.',
        objections: ['deliberated', 'could-otherwise'],
      },
    ],
  },
  {
    id: 'next-thought',
    title: 'The next thought',
    hook: 'Try to see a thought coming.',
    minutes: 1,
    arg: 'A',
    art: 'field',
    hue: HUES.violet,
    screens: [
      { kind: 'say', text: 'Here is a simple experiment. Try to notice your next thought before it arises.' },
      {
        kind: 'say',
        text: 'Don’t think one on purpose. The intention to do that would itself be a thought. Just wait, and watch.',
      },
      { kind: 'think', text: 'Watch for the next thought.', seconds: 30 },
      { kind: 'input', key: 'thought', prompt: 'What appeared?', placeholder: 'A few words' },
      { kind: 'say', text: (a) => `*“${clean(a.thought)}.”* Did you see it coming?` },
      {
        kind: 'say',
        text: 'Thoughts simply arise in consciousness. You don’t know what you will think next until you think it.',
      },
      {
        kind: 'name',
        text: 'You are not the author of your next thought. And every decision you make is built out of thoughts like these.',
        objections: ['my-brain'],
      },
    ],
  },
  {
    id: 'urge',
    title: 'The urge',
    hook: 'Act whenever you like. Watch the urge arrive.',
    minutes: 1,
    arg: 'A',
    art: 'ripple',
    hue: HUES.coral,
    screens: [
      {
        kind: 'say',
        text: 'In a moment, a button will appear. Press it whenever you feel like it, within twenty seconds.',
      },
      {
        kind: 'say',
        text: 'Or don’t press it at all. Your only task is to notice the moment the urge to press arises.',
      },
      { kind: 'urge', key: 'tapAt', seconds: 20, text: 'Press whenever you feel like it.' },
      {
        kind: 'input',
        key: 'why',
        when: tapped,
        prompt: (a) => `You pressed at ${a.tapAt} seconds. Why then, and not a moment sooner?`,
        placeholder: 'Whatever comes to mind',
      },
      {
        kind: 'say',
        when: tapped,
        text: 'Look at that reason. Was it there before you pressed? Or did it arrive afterward, to explain what you did?',
      },
      {
        kind: 'say',
        when: tapped,
        text: 'The urge just appeared. You couldn’t have summoned it, because that would have taken an earlier urge to do the summoning.',
      },
      {
        kind: 'input',
        key: 'why',
        when: (a) => !tapped(a),
        prompt: 'You didn’t press. What happened instead?',
        placeholder: 'Whatever comes to mind',
      },
      {
        kind: 'say',
        when: (a) => !tapped(a),
        text: 'Perhaps the urge never came. Or perhaps it came, and some other impulse arose to stop it.',
      },
      {
        kind: 'say',
        when: (a) => !tapped(a),
        text: 'Either way, you didn’t choose which impulse would appear, or which one would prevail.',
      },
      {
        kind: 'name',
        text: 'Even a choice this unconstrained begins with an impulse you didn’t create. You notice it, and then you act.',
        objections: ['trivial'],
      },
    ],
  },
  {
    id: 'ask-why',
    title: 'Ask why',
    hook: 'Follow a preference back to its source.',
    minutes: 2,
    arg: 'B',
    art: 'roots',
    hue: HUES.teal,
    screens: [
      {
        kind: 'choice',
        key: 'drink',
        prompt: 'Tea or coffee? If you drink neither, pick one anyway.',
        options: [
          { value: 'tea', label: 'Tea' },
          { value: 'coffee', label: 'Coffee' },
        ],
      },
      { kind: 'input', key: 'why1', prompt: (a) => `Why ${a.drink}?`, placeholder: 'Because…' },
      { kind: 'input', key: 'why2', prompt: (a) => `${quoted(a.why1)} Why is that?`, placeholder: 'Because…' },
      { kind: 'input', key: 'why3', prompt: (a) => `${quoted(a.why2)} And why is that?`, placeholder: 'Because…' },
      {
        kind: 'say',
        text: (a) =>
          `${a.drink === 'tea' ? 'Tea' : 'Coffee'}, because *${clean(a.why1)}*. Because *${clean(a.why2)}*. Because *${clean(a.why3)}*.`,
      },
      {
        kind: 'say',
        text: 'Chains like this tend to end somewhere familiar. “I just like it.” “That’s how I was raised.” “I don’t know.”',
      },
      {
        kind: 'say',
        text: 'At some point the reasons run out. You arrive at a preference you never chose, and couldn’t have chosen.',
      },
      {
        kind: 'name',
        text: 'Your reasons were real, and they did real work. But follow any reason back far enough and you reach causes you didn’t create.',
        objections: ['deliberated', 'shape-desires'],
      },
    ],
  },
  {
    id: 'rewind',
    title: 'Rewind the tape',
    hook: 'Replay a decision with everything the same.',
    minutes: 2,
    arg: 'B',
    art: 'spiral',
    hue: HUES.blue,
    screens: [
      {
        kind: 'input',
        key: 'decision',
        prompt: 'Recall a decision you made recently. A small one is fine.',
        placeholder: 'e.g. skipped the gym',
      },
      {
        kind: 'say',
        text: (a) => `*“${clean(a.decision)}.”* Now rewind the universe to the moment just before you decided.`,
      },
      {
        kind: 'say',
        text: 'Every atom is back where it was. Your brain is in exactly the same state, down to your mood and your passing thoughts.',
      },
      { kind: 'say', text: 'Now press play.' },
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
        kind: 'say',
        when: (a) => a.could === 'yes',
        text: 'Then something changed on the second run. But what? Your reasons, your character and your desires were identical.',
      },
      {
        kind: 'say',
        when: (a) => a.could === 'yes',
        text: 'Whatever tipped the balance wasn’t you. It was chance.',
      },
      {
        kind: 'say',
        when: (a) => a.could === 'yes',
        text: 'And a coin toss in your brain isn’t freedom. If your choices sometimes went the other way for no reason, you would have less control over them.',
      },
      {
        kind: 'say',
        when: (a) => a.could === 'no',
        text: 'Then your decision followed from the state of the world, and of your brain, a moment before. Replay it a thousand times and you get the same result.',
      },
      {
        kind: 'say',
        when: (a) => a.could === 'no',
        text: 'That is what it means for a choice to be caused. And you didn’t choose the causes.',
      },
      {
        kind: 'name',
        text: 'Either our choices are caused by prior events, or they are partly random. In neither case are we their authors.',
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
    art: 'flame',
    hue: HUES.rose,
    screens: [
      { kind: 'input', key: 'food', prompt: 'Name a food you love.', placeholder: 'e.g. dark chocolate' },
      { kind: 'say', text: (a) => `For the next ten seconds, try to stop liking *${clean(a.food)}*.` },
      {
        kind: 'say',
        text: 'Don’t simply resolve never to eat it again. Try to actually stop wanting it, by an act of will.',
      },
      { kind: 'think', text: 'Try to stop wanting it.', seconds: 10 },
      {
        kind: 'choice',
        key: 'result',
        prompt: 'How did it go?',
        options: [
          { value: 'still', label: 'I still want it' },
          { value: 'shifted', label: 'Something shifted' },
        ],
      },
      {
        kind: 'say',
        when: (a) => a.result !== 'shifted',
        text: (a) => `You could refuse *${clean(a.food)}* for the rest of your life. But you can’t decide not to want it.`,
      },
      {
        kind: 'say',
        when: (a) => a.result === 'shifted',
        text: 'If something shifted, how? Probably a thought arose. A memory, an image, a reason. Did you choose that thought?',
      },
      {
        kind: 'say',
        text: 'Schopenhauer saw this almost two centuries ago. *A man can do what he wills, but he cannot will what he wills.*',
      },
      {
        kind: 'name',
        text: 'We are told we’re free whenever we do what we want. But you didn’t choose what you want. You found yourself wanting it.',
        objections: ['shape-desires', 'my-brain'],
      },
    ],
  },
  {
    id: 'swap',
    title: 'Swap places',
    hook: 'Trade lives with someone who baffles you.',
    minutes: 2,
    arg: 'C',
    art: 'mirror',
    hue: HUES.gold,
    hue2: HUES.violet,
    screens: [
      {
        kind: 'input',
        key: 'person',
        prompt: 'Think of someone whose choices baffle you. Who is it?',
        placeholder: 'A name or a description',
      },
      { kind: 'say', text: (a) => `Now imagine trading places with *${clean(a.person)}*. Completely.` },
      {
        kind: 'say',
        text: 'Their genes. Their parents. Every experience they’ve had. Their brain, atom for atom, as it was this morning.',
      },
      {
        kind: 'choice',
        key: 'would',
        prompt: 'In their place, would you choose any differently?',
        options: [
          { value: 'yes', label: 'Yes, I would' },
          { value: 'no', label: 'No, I’d do the same' },
        ],
      },
      {
        kind: 'say',
        when: (a) => a.would === 'yes',
        text: 'What would make the difference? Every part of them is in place. There is nothing of you left over to choose otherwise.',
      },
      {
        kind: 'say',
        when: (a) => a.would !== 'yes',
        text: 'Of course not. You wouldn’t be you in their shoes. You would be them, and their reasons would feel like yours.',
      },
      {
        kind: 'say',
        text: 'Now turn it around. You didn’t choose your genes, your parents or your experiences either.',
      },
      {
        kind: 'name',
        claim: 'You didn’t choose who you are',
        text: 'Some say you’re free when your choices express your character. But your character is precisely what you were given.',
        objections: ['my-brain', 'responsible'],
      },
    ],
  },
]

export const EXPERIMENT_BY_ID: Record<string, Experiment> = Object.fromEntries(
  EXPERIMENTS.map((e) => [e.id, e]),
)

// The walkthrough and the suggested path use the same four, in this order.
export const PATH = ['city', 'next-thought', 'rewind', 'want']
