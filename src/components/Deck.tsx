import {
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent,
  type TouchEvent,
  type WheelEvent,
} from 'react'
import { ArtCanvas } from '../art/ArtCanvas'
import { OBJECTIONS } from '../content/objections'
import { resolve, type AllAnswers, type Answers, type ArtVariant, type ObjectionId, type ReadingItem, type Screen } from '../content/types'
import { useStore } from '../lib/store'
import { Arrow, Close, Rich } from './Rich'

type Props = {
  screens: Screen[]
  // Where answers are stored. Intro, summary and close decks have none.
  expId?: string
  art: ArtVariant
  hue: string
  hue2?: string
  // Default heading for "What this shows" screens.
  claim?: string
  eyebrow?: string
  // Not needed when the last screen is a `links` screen, which has its own way out.
  finishLabel?: string
  onFinish?: () => void
  // Back from the first screen.
  onBack?: () => void
  exitHref?: string
  startAtEnd?: boolean
  onComplete?: () => void
}

const INTERACTIVE = 'button, a, input, label, textarea, .sheet'

// The art's focal point sits below the words.
const ART_FOCUS = 0.68

// A full-screen deck of short screens. Tap, swipe or use the arrow keys to move on.
export function Deck(props: Props) {
  const { screens, expId, art, hue, hue2, claim, eyebrow, finishLabel, onFinish, onBack, exitHref, startAtEnd, onComplete } =
    props
  const { answers, setAnswer } = useStore()
  const a: Answers = (expId && answers[expId]) || {}
  const visible = screens.filter((s) => !s.when || s.when(a, answers))
  const last = visible.length - 1
  const [index, setIndex] = useState(() => (startAtEnd ? last : 0))
  const [dir, setDir] = useState<'next' | 'back'>('next')
  const [sheet, setSheet] = useState<ObjectionId | null>(null)
  const drag = useRef<{ x: number; y: number; horizontal: boolean } | null>(null)
  const swipe = useRef<HTMLDivElement>(null)
  const wheel = useRef({ total: 0, last: 0, quietUntil: 0 })

  const i = Math.min(index, last)
  const screen = visible[i]
  const isLast = i === last

  useEffect(() => {
    if (isLast) onComplete?.()
    // Fires on arrival at the last screen, not whenever the parent re-renders.
  }, [isLast])

  const next = () => {
    if (i < last) {
      setDir('next')
      setIndex(i + 1)
    } else onFinish?.()
  }
  const back = () => {
    if (i > 0) {
      setDir('back')
      setIndex(i - 1)
    } else onBack?.()
  }
  const answer = (key: string, value: string) => {
    if (expId) setAnswer(expId, key, value)
    setDir('next')
    setIndex(i + 1)
  }

  const answered = 'key' in screen && Boolean(a[screen.key])
  const canAdvance =
    screen.kind === 'say' ||
    screen.kind === 'name' ||
    screen.kind === 'reading' ||
    (screen.kind === 'think' && !screen.seconds) ||
    ((screen.kind === 'input' || screen.kind === 'choice') && answered)
  const tapAdvances = screen.kind === 'say' || (screen.kind === 'think' && !screen.seconds)
  const canBack = i > 0 || Boolean(onBack)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (sheet) {
        if (e.key === 'Escape') setSheet(null)
        return
      }
      if ((e.target as Element).closest('input, textarea, button, a')) return
      if (e.key === 'ArrowRight' || e.key === 'Enter' || e.key === ' ') {
        if (canAdvance) {
          e.preventDefault()
          next()
        }
      } else if (e.key === 'ArrowLeft') back()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  // The words follow the finger, so a swipe visibly works before it lands.
  const follow = (dx: number, settle = false) => {
    const el = swipe.current
    if (!el) return
    el.style.transition = settle ? 'transform 0.25s ease, opacity 0.25s ease' : 'none'
    el.style.transform = dx ? `translateX(${dx}px)` : ''
    el.style.opacity = dx ? String(Math.max(0.35, 1 - Math.abs(dx) / 320)) : ''
  }

  // Gestures. Touch uses touch events: phone browsers cancel pointer events
  // part-way through a swipe when they think they might scroll. Mouse and pen
  // use pointer events.
  const dragStart = (x: number, y: number, target: EventTarget) => {
    drag.current = sheet || (target as Element).closest(INTERACTIVE) ? null : { x, y, horizontal: false }
    return drag.current !== null
  }
  const dragMove = (x: number, y: number) => {
    const d = drag.current
    if (!d) return
    const dx = x - d.x
    if (!d.horizontal && Math.abs(dx) > 8 && Math.abs(dx) > Math.abs(y - d.y)) d.horizontal = true
    if (d.horizontal) follow(dx * ((dx < 0 ? canAdvance : canBack) ? 0.6 : 0.15))
  }
  // Returns true when the gesture moved the deck.
  const dragEnd = (x: number, y: number) => {
    const d = drag.current
    drag.current = null
    if (!d) return false
    const dx = x - d.x
    const dy = y - d.y
    if (d.horizontal && Math.abs(dx) > 50 && (dx < 0 ? canAdvance : canBack)) {
      follow(0)
      if (dx < 0) next()
      else back()
      return true
    }
    follow(0, true)
    if (Math.abs(dx) < 10 && Math.abs(dy) < 10 && tapAdvances) {
      next()
      return true
    }
    return false
  }
  const dragCancel = () => {
    drag.current = null
    follow(0, true)
  }

  const onTouchStart = (e: TouchEvent) => {
    if (e.touches.length !== 1) return dragCancel()
    dragStart(e.touches[0].clientX, e.touches[0].clientY, e.target)
  }
  const onTouchMove = (e: TouchEvent) => dragMove(e.touches[0].clientX, e.touches[0].clientY)
  const onTouchEnd = (e: TouchEvent) => {
    // Stop the browser's follow-up click landing on the next screen's buttons.
    if (dragEnd(e.changedTouches[0].clientX, e.changedTouches[0].clientY)) e.preventDefault()
  }

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === 'touch' || e.button !== 0) return
    if (dragStart(e.clientX, e.clientY, e.target)) e.currentTarget.setPointerCapture?.(e.pointerId)
  }
  const onPointerMove = (e: PointerEvent) => {
    if (e.pointerType !== 'touch') dragMove(e.clientX, e.clientY)
  }
  const onPointerUp = (e: PointerEvent) => {
    if (e.pointerType !== 'touch') dragEnd(e.clientX, e.clientY)
  }

  // Trackpad swipes arrive as horizontal wheel events. One gesture moves one
  // screen: momentum events are ignored until the trackpad goes quiet.
  const onWheel = (e: WheelEvent) => {
    if (sheet || Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return
    const w = wheel.current
    const now = performance.now()
    if (now < w.quietUntil) {
      w.quietUntil = now + 250
      return
    }
    if (now - w.last > 300) w.total = 0
    w.last = now
    w.total += e.deltaX
    if (Math.abs(w.total) < 60) return
    const forward = w.total > 0
    w.total = 0
    w.quietUntil = now + 250
    if (forward ? canAdvance : canBack) {
      if (forward) next()
      else back()
    }
  }

  const thinking = screen.kind === 'think'

  return (
    <div
      className={`stage kind-${screen.kind}`}
      style={{ '--hue': hue } as CSSProperties}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={(e) => e.pointerType !== 'touch' && dragCancel()}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      onTouchCancel={dragCancel}
      onWheel={onWheel}
    >
      <ArtCanvas variant={art} hue={hue} hue2={hue2} focus={ART_FOCUS} className={`stage-art${thinking ? ' dim' : ''}`} />
      {thinking && <ArtCanvas variant="think" hue={hue} focus={ART_FOCUS} className="stage-art think-art" />}
      <div className="stage-scrim" />

      <header className="stage-top">
        {exitHref && (
          <a className="round small" href={exitHref} aria-label="Close">
            <Close />
          </a>
        )}
        <div className="stage-meta">
          <div className="progress" aria-hidden="true">
            {visible.map((_, j) => (
              <span key={j} className={j <= i ? 'on' : undefined} />
            ))}
          </div>
          {eyebrow && <p className="stage-eyebrow">{eyebrow}</p>}
        </div>
      </header>

      <div className="stage-body" aria-live="polite">
        <div ref={swipe} className="swipe">
          <div key={`${i}-${screen.kind}`} className={`screen enter-${dir}`}>
            <ScreenView
              screen={screen}
              a={a}
              all={answers}
              claim={claim}
              onNext={next}
              onAnswer={answer}
              onObjection={setSheet}
            />
          </div>
        </div>
      </div>

      <footer className="stage-bottom">
        {canBack ? (
          <button className="round" onClick={back} aria-label="Back">
            <Arrow back />
          </button>
        ) : (
          <span />
        )}
        {i === 0 && tapAdvances && <span className="hint">Tap or swipe</span>}
        {isLast && finishLabel && screen.kind !== 'links' ? (
          <button className="pill" onClick={onFinish}>
            {finishLabel}
          </button>
        ) : !isLast && canAdvance && !thinking ? (
          <button className="round next" onClick={next} aria-label="Next">
            <Arrow />
          </button>
        ) : (
          <span />
        )}
      </footer>

      {sheet && <ObjectionSheet id={sheet} onClose={() => setSheet(null)} />}
    </div>
  )
}

type ViewProps = {
  screen: Screen
  a: Answers
  all: AllAnswers
  claim?: string
  onNext: () => void
  onAnswer: (key: string, value: string) => void
  onObjection: (id: ObjectionId) => void
}

function ScreenView({ screen, a, all, claim, onNext, onAnswer, onObjection }: ViewProps) {
  const r = (t: Parameters<typeof resolve>[0]) => resolve(t, a, all)
  switch (screen.kind) {
    case 'say':
      return <Say text={r(screen.text)} />
    case 'think':
      return <Think text={r(screen.text)} seconds={screen.seconds} done={screen.done} onNext={onNext} />
    case 'input':
      return (
        <Ask
          prompt={r(screen.prompt)}
          placeholder={screen.placeholder}
          initial={a[screen.key]}
          onSubmit={(v) => onAnswer(screen.key, v)}
        />
      )
    case 'choice':
      return (
        <div className="ask">
          <p className="say">
            <Rich text={r(screen.prompt)} />
          </p>
          <div className="options">
            {screen.options.map((o) => (
              <button
                key={o.value}
                className={a[screen.key] === o.value ? 'option chosen' : 'option'}
                onClick={() => onAnswer(screen.key, o.value)}
              >
                {o.label}
              </button>
            ))}
          </div>
        </div>
      )
    case 'urge':
      return <Urge text={r(screen.text)} seconds={screen.seconds} onDone={(v) => onAnswer(screen.key, v)} />
    case 'name':
      return (
        <div className="name">
          <p className="label">What this shows</p>
          <h2 className="claim">{screen.claim ?? claim}</h2>
          <p className="name-text">
            <Rich text={r(screen.text)} />
          </p>
          {screen.objections && (
            <div className="chips">
              <p className="label">Not convinced?</p>
              {screen.objections.map((id) => (
                <button key={id} className="chip" onClick={() => onObjection(id)}>
                  {OBJECTIONS[id].label}
                </button>
              ))}
            </div>
          )}
        </div>
      )
    case 'links':
      return (
        <div className="ask">
          <Say text={r(screen.text)} />
          <div className="options">
            {screen.links.map((l) => (
              <a key={l.href} className="option" href={l.href}>
                {l.label}
              </a>
            ))}
          </div>
        </div>
      )
    case 'reading':
      return (
        <div className="reading-screen">
          <h2 className="claim">{screen.heading}</h2>
          <ReadingList items={screen.items} />
          {screen.note && <p className="fine">{screen.note}</p>}
        </div>
      )
  }
}

function Say({ text }: { text: string }) {
  return (
    <p className={text.length > 115 ? 'say long' : 'say'}>
      <Rich text={text} />
    </p>
  )
}

// Thinking screens play the breathing-orb animation behind the words.
function Think({ text, seconds, done, onNext }: { text: string; seconds?: number; done?: string; onNext: () => void }) {
  useEffect(() => {
    if (!seconds) return
    const t = setTimeout(onNext, seconds * 1000)
    return () => clearTimeout(t)
    // onNext belongs to this screen, which is keyed, so a stale copy is fine.
  }, [seconds])

  return (
    <>
      <Say text={text} />
      {seconds ? (
        <>
          <div className="timer" aria-hidden="true">
            <i style={{ animationDuration: `${seconds}s` }} />
          </div>
          <button className="text-button" onClick={onNext}>
            I’m done
          </button>
        </>
      ) : (
        <button className="pill" onClick={onNext}>
          {done ?? 'Ready'}
        </button>
      )}
    </>
  )
}

function Ask({
  prompt,
  placeholder,
  initial,
  onSubmit,
}: {
  prompt: string
  placeholder?: string
  initial?: string
  onSubmit: (v: string) => void
}) {
  const [value, setValue] = useState(initial ?? '')
  const ref = useRef<HTMLInputElement>(null)
  const id = useId()

  useEffect(() => {
    ref.current?.focus({ preventScroll: true })
  }, [])

  return (
    <form
      className="ask"
      onSubmit={(e) => {
        e.preventDefault()
        const v = value.trim()
        if (v) onSubmit(v)
      }}
    >
      <label htmlFor={id} className="say">
        <Rich text={prompt} />
      </label>
      <div className="answer-row">
        <input
          id={id}
          ref={ref}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          maxLength={60}
          autoComplete="off"
          enterKeyHint="next"
        />
        <button type="submit" className="round next" aria-label="Continue" disabled={!value.trim()}>
          <Arrow />
        </button>
      </div>
    </form>
  )
}

function Urge({ text, seconds, onDone }: { text: string; seconds: number; onDone: (v: string) => void }) {
  const [startedAt, setStartedAt] = useState<number | null>(null)

  useEffect(() => {
    if (startedAt === null) return
    const t = setTimeout(() => onDone('none'), seconds * 1000)
    return () => clearTimeout(t)
    // A press unmounts this screen, which clears the timeout.
  }, [startedAt])

  if (startedAt === null) {
    return (
      <>
        <Say text={text} />
        <button className="pill" onClick={() => setStartedAt(performance.now())}>
          Start
        </button>
      </>
    )
  }
  return (
    <div className="urge">
      <button className="press" onClick={() => onDone(((performance.now() - startedAt) / 1000).toFixed(1))}>
        Press
      </button>
      <div className="timer" aria-hidden="true">
        <i style={{ animationDuration: `${seconds}s` }} />
      </div>
    </div>
  )
}

export function ReadingList({ items }: { items: ReadingItem[] }) {
  return (
    <ul className="reading">
      {items.map((r) => (
        <li key={r.title}>
          <cite>{r.title}</cite>
          <span>{r.note}</span>
        </li>
      ))}
    </ul>
  )
}

function ObjectionSheet({ id, onClose }: { id: ObjectionId; onClose: () => void }) {
  const o = OBJECTIONS[id]
  const ref = useRef<HTMLDivElement>(null)
  const titleId = useId()

  useEffect(() => {
    ref.current?.focus()
  }, [])

  return (
    <div className="sheet-backdrop" onClick={onClose}>
      <div
        ref={ref}
        className="sheet"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
      >
        <p className="label">Not convinced?</p>
        <h2 id={titleId} className="sheet-title">
          {o.label}
        </h2>
        {o.reply.map((p) => (
          <p key={p}>{p}</p>
        ))}
        {o.reading && <ReadingList items={o.reading} />}
        <button className="pill" onClick={onClose}>
          Back
        </button>
      </div>
    </div>
  )
}
