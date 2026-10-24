// Answers typed or chosen within one experiment, keyed by step key.
export type Answers = Record<string, string>

// Copy can be fixed or depend on the user's earlier answers.
export type Text = string | ((a: Answers) => string)
export type Paras = string[] | ((a: Answers) => string[])

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

export type Step =
  | { kind: 'text'; body: Paras }
  | { kind: 'input'; key: string; prompt: Text; placeholder?: string }
  | { kind: 'choice'; key: string; prompt: Text; options: { value: string; label: string }[] }
  | { kind: 'timer'; seconds: number; cue: string }
  | { kind: 'urge'; key: string; seconds: number }
  | { kind: 'reflect'; body: Paras; aside?: { label: string; body: Paras } }
  | { kind: 'name'; body: Paras; objections?: ObjectionId[] }

export type Experiment = {
  id: string
  title: string
  hook: string
  minutes: number
  arg: ArgStep
  steps: Step[]
}

export function text(t: Text, a: Answers): string {
  return typeof t === 'function' ? t(a) : t
}

export function paras(p: Paras, a: Answers): string[] {
  return typeof p === 'function' ? p(a) : p
}
