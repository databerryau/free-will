import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { Answers } from '../content/types'

// Answers live only in this browser tab (sessionStorage), so closing the tab
// erases them. Each format also wipes them when a playthrough ends, so the
// next person on the same device starts clean.
type State = { answers: Record<string, Answers>; done: string[] }

const KEY = 'who-chose-that:session'
// Earlier versions kept answers in localStorage, on the device itself.
const LEGACY_KEY = 'who-chose-that:v1'
const EMPTY: State = { answers: {}, done: [] }

function load(): State {
  try {
    localStorage.removeItem(LEGACY_KEY)
    const raw = sessionStorage.getItem(KEY)
    if (raw) {
      const s = JSON.parse(raw)
      return { answers: s.answers ?? {}, done: s.done ?? [] }
    }
  } catch {
    // Storage unavailable (private mode, blocked): run without persistence.
  }
  return EMPTY
}

function save(s: State) {
  try {
    sessionStorage.setItem(KEY, JSON.stringify(s))
  } catch {
    // Ignore: the app works without persistence.
  }
}

type Actions = {
  setAnswer: (exp: string, key: string, value: string) => void
  markDone: (exp: string) => void
  // Drop one experiment's answers.
  forget: (exp: string) => void
  // Drop everything: the end of a playthrough.
  clearAll: () => void
}

type Store = State & Actions

const StoreContext = createContext<Store | null>(null)

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<State>(load)

  useEffect(() => save(state), [state])

  // Actions keep the same identity for the app's lifetime, so effects can
  // depend on them without re-running on every answer.
  const actions = useMemo<Actions>(
    () => ({
      // Asterisks are stripped because copy uses *text* for emphasis.
      setAnswer: (exp, key, value) =>
        setState((s) => ({
          ...s,
          answers: { ...s.answers, [exp]: { ...s.answers[exp], [key]: value.replace(/\*/g, '') } },
        })),
      markDone: (exp) => setState((s) => (s.done.includes(exp) ? s : { ...s, done: [...s.done, exp] })),
      forget: (exp) =>
        setState((s) => {
          if (!s.answers[exp]) return s
          const answers = { ...s.answers }
          delete answers[exp]
          return { ...s, answers }
        }),
      clearAll: () => setState(EMPTY),
    }),
    [],
  )

  const store = useMemo<Store>(() => ({ ...state, ...actions }), [state, actions])

  return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
}

export function useStore(): Store {
  const store = useContext(StoreContext)
  if (!store) throw new Error('useStore must be used inside StoreProvider')
  return store
}
