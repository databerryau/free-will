// Answers typed or chosen within one experiment, keyed by screen key.
export type Answers = Record<string, string>
export type AllAnswers = Record<string, Answers>

// Copy can be fixed or depend on answers. `*text*` renders as emphasis.
export type Text = string | ((a: Answers, all: AllAnswers) => string)

// The three argument steps from SPEC.md §3.
export type ArgStep = 'A' | 'B' | 'C'

export type ObjectionId =
  | 'deliberated'
  | 'could-otherwise'
  | 'randomness'
  | 'my-brain'
  | 'trivial'
  | 'shape-desires'
  | 'why-bother'
  | 'responsible'

export type ArtVariant = 'field' | 'think' | 'city' | 'ripple' | 'roots' | 'spiral' | 'flame' | 'mirror' | 'dawn'

export type ReadingItem = { title: string; note: string }

// One screen holds a few lines at most. `when` hides a screen on branches
// the user didn't take.
export type Screen = { when?: (a: Answers, all: AllAnswers) => boolean } & (
  | { kind: 'say'; text: Text }
  | { kind: 'think'; text: Text; seconds?: number; done?: string }
  | { kind: 'input'; key: string; prompt: Text; placeholder?: string }
  | { kind: 'choice'; key: string; prompt: Text; options: { value: string; label: string }[] }
  | { kind: 'urge'; key: string; seconds: number; text: Text }
  | { kind: 'name'; text: Text; claim?: string; objections?: ObjectionId[] }
  | { kind: 'reading'; heading: string; items: ReadingItem[]; note?: string }
  // A question answered by going somewhere: the verdict, and the end of a counter-argument.
  | { kind: 'links'; text: Text; links: { label: string; href: string }[] }
)

// An objection on the "not convinced" page, answered over several short screens.
export type Argument = {
  id: string
  label: string
  hook: string
  art: ArtVariant
  hue: string
  hue2?: string
  screens: Screen[]
  // The question its last screen leaves the reader with.
  closing: string
}

export type Experiment = {
  id: string
  title: string
  hook: string
  minutes: number
  arg: ArgStep
  art: ArtVariant
  hue: string
  hue2?: string
  screens: Screen[]
}

export function resolve(t: Text, a: Answers, all: AllAnswers): string {
  return typeof t === 'function' ? t(a, all) : t
}
