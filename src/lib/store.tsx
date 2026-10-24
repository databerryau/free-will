import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { Answers } from '../content/types'

// Everything the user types lives only in this browser's localStorage.
type State = { answers: Record<string, Answers>; done: string[] }

const KEY = 'who-chose-that:v1'
const EMPTY: State = { answers: {}, done: [] }

function load(): State {
  try {
    const raw = localStorage.getItem(KEY)
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
    localStorage.setItem(KEY, JSON.stringify(s))
  } catch {
    // Ignore: the app works without persistence.
  }
}

type Store = {
  answers: Record<string, Answers>
  done: string[]
  setAnswer: (exp: string, key: string, value: string) => void
  markDone: (exp: string) => void
  reset: (exp: string) => void
  clearAll: () => void
}

const StoreContext = createContext<Store | null>(null)

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<State>(load)

  useEffect(() => save(state), [state])

  const store = useMemo<Store>(
    () => ({
      ...state,
      setAnswer: (exp, key, value) =>
        setState((s) => ({ ...s, answers: { ...s.answers, [exp]: { ...s.answers[exp], [key]: value } } })),
      markDone: (exp) => setState((s) => (s.done.includes(exp) ? s : { ...s, done: [...s.done, exp] })),
      reset: (exp) =>
        setState((s) => {
          const answers = { ...s.answers }
          delete answers[exp]
          return { answers, done: s.done.filter((d) => d !== exp) }
        }),
      clearAll: () => setState(EMPTY),
    }),
    [state],
  )

  return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
}

export function useStore(): Store {
  const store = useContext(StoreContext)
  if (!store) throw new Error('useStore must be used inside StoreProvider')
  return store
}
