import { useState, type ReactNode } from 'react'
import { APP_TITLE, CREDIT } from '../content/copy'
import { go } from '../lib/router'
import { useStore } from '../lib/store'

// Shared frame. `home` is the format's own root, so a tester sent one
// format never gets a link to the others.
export function Page({ home, children }: { home: string; children: ReactNode }) {
  const { clearAll } = useStore()
  const [cleared, setCleared] = useState(false)

  return (
    <div className="page">
      <header className="site-header">
        <a href={home} className="wordmark">
          {APP_TITLE}
        </a>
      </header>
      <main>{children}</main>
      <footer className="site-footer">
        <p>{CREDIT}</p>
        <button
          className="link quiet"
          onClick={() => {
            clearAll()
            setCleared(true)
            go(home)
          }}
        >
          {cleared ? 'Your answers have been cleared' : 'Clear my answers'}
        </button>
      </footer>
    </div>
  )
}

export function Nav({ back, next, nextLabel }: { back: string; next: string; nextLabel: string }) {
  return (
    <nav className="nav">
      <a href={back} className="link quiet">
        Back
      </a>
      <a href={next} className="button">
        {nextLabel}
      </a>
    </nav>
  )
}
