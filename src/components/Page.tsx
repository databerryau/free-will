import { useState, type CSSProperties, type ReactNode } from 'react'
import { ArtCanvas } from '../art/ArtCanvas'
import { APP_TITLE, CREDIT, PRIVACY } from '../content/copy'
import { HUES } from '../content/experiments'
import type { ArtVariant } from '../content/types'
import { useStore } from '../lib/store'

type Props = {
  // The format's own root, so a tester sent one format never sees the others.
  home: string
  title: string
  lede?: string
  art?: ArtVariant
  hue?: string
  children: ReactNode
}

// Frame for list pages: an animated hero, then content.
export function Page({ home, title, lede, art = 'field', hue = HUES.gold, children }: Props) {
  const { clearAll } = useStore()
  const [cleared, setCleared] = useState(false)

  return (
    <div className="page" style={{ '--hue': hue } as CSSProperties}>
      <header className="hero">
        <ArtCanvas variant={art} hue={hue} focus={0.4} className="hero-art" />
        <div className="hero-scrim" />
        <div className="hero-text">
          {title !== APP_TITLE && (
            <a href={home} className="wordmark">
              {APP_TITLE}
            </a>
          )}
          <h1>{title}</h1>
          {lede && <p className="lede">{lede}</p>}
        </div>
      </header>
      <main className="page-main">{children}</main>
      <footer className="site-footer">
        <p>{PRIVACY}</p>
        <p>{CREDIT}</p>
        <button
          className="text-button"
          onClick={() => {
            clearAll()
            setCleared(true)
          }}
        >
          {cleared ? 'Your answers have been cleared' : 'Clear my answers'}
        </button>
      </footer>
    </div>
  )
}
