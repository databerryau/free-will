import { useEffect, useId, useRef, useState, type ReactNode } from 'react'
import { ARG_STEPS } from '../content/experiments'
import { paras, text, type Answers, type Experiment, type Step } from '../content/types'
import { prefersReducedMotion } from '../lib/router'
import { useStore } from '../lib/store'
import { Objections } from './Objections'
import { Prose } from './Prose'

type Props = {
  experiment: Experiment
  eyebrow?: string
  // Shown once the experiment is complete: navigation, bridges.
  children?: ReactNode
}

// Runs one experiment as a column of steps revealed one at a time.
// Earlier steps stay on screen, so reflections sit beside what you typed.
export function Runner({ experiment, eyebrow, children }: Props) {
  const { answers, done, setAnswer, markDone, reset } = useStore()
  const a = answers[experiment.id] ?? {}
  const last = experiment.steps.length - 1
  const [initial] = useState(() => (done.includes(experiment.id) ? last : 0))
  const [current, setCurrent] = useState(initial)
  const refs = useRef<(HTMLElement | null)[]>([])
  const complete = current >= last

  useEffect(() => {
    if (complete) markDone(experiment.id)
  }, [complete, experiment.id, markDone])

  // Bring each newly revealed step into view, but only if it's off screen.
  useEffect(() => {
    if (current === initial) return
    const el = refs.current[current]
    if (el && el.getBoundingClientRect().bottom > window.innerHeight - 16) {
      el.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' })
    }
  }, [current, initial])

  const next = () => setCurrent((c) => Math.min(c + 1, last))
  const answer = (key: string, value: string) => {
    setAnswer(experiment.id, key, value)
    next()
  }
  const again = () => {
    reset(experiment.id)
    setCurrent(0)
    window.scrollTo({ top: 0 })
  }

  return (
    <article className="experiment">
      <header>
        <p className="eyebrow">{eyebrow ?? ARG_STEPS[experiment.arg].question}</p>
        <h1>{experiment.title}</h1>
      </header>
      {experiment.steps.slice(0, current + 1).map((step, i) => (
        <section
          key={i}
          ref={(el) => {
            refs.current[i] = el
          }}
          className={`step step-${step.kind}`}
        >
          <StepView
            step={step}
            experiment={experiment}
            a={a}
            active={i === current}
            autoFocus={i > 0}
            onNext={next}
            onAnswer={answer}
          />
        </section>
      ))}
      {complete && (
        <footer className="after">
          {children}
          <button className="link quiet" onClick={again}>
            Do this one again
          </button>
        </footer>
      )}
    </article>
  )
}

type StepProps = {
  step: Step
  experiment: Experiment
  a: Answers
  active: boolean
  autoFocus: boolean
  onNext: () => void
  onAnswer: (key: string, value: string) => void
}

function StepView({ step, experiment, a, active, autoFocus, onNext, onAnswer }: StepProps) {
  switch (step.kind) {
    case 'text':
      return (
        <>
          <Prose paras={paras(step.body, a)} />
          {active && <Continue onClick={onNext} />}
        </>
      )
    case 'input':
      return <InputStep step={step} a={a} active={active} autoFocus={autoFocus} onAnswer={onAnswer} />
    case 'choice': {
      const chosen = active ? undefined : a[step.key]
      return (
        <>
          <p className="prompt">{text(step.prompt, a)}</p>
          <div className="choices">
            {step.options.map((o) => (
              <button
                key={o.value}
                className={chosen === o.value ? 'choice chosen' : 'choice'}
                aria-pressed={chosen === o.value}
                disabled={!active}
                onClick={() => onAnswer(step.key, o.value)}
              >
                {o.label}
              </button>
            ))}
          </div>
        </>
      )
    }
    case 'timer':
      return <TimerStep seconds={step.seconds} cue={step.cue} active={active} onNext={onNext} />
    case 'urge':
      return <UrgeStep stepKey={step.key} seconds={step.seconds} a={a} active={active} onAnswer={onAnswer} />
    case 'reflect':
      return (
        <>
          <Prose paras={paras(step.body, a)} />
          {step.aside && (
            <details className="aside">
              <summary>{step.aside.label}</summary>
              <Prose paras={paras(step.aside.body, a)} />
            </details>
          )}
          {active && <Continue onClick={onNext} />}
        </>
      )
    case 'name':
      return (
        <div className="name-it">
          <p className="label">What this shows</p>
          <h2>{ARG_STEPS[experiment.arg].claim}</h2>
          <Prose paras={paras(step.body, a)} />
          <Objections ids={step.objections ?? []} />
        </div>
      )
  }
}

function Continue({ onClick }: { onClick: () => void }) {
  return (
    <button className="continue" onClick={onClick}>
      Continue
    </button>
  )
}

function InputStep({
  step,
  a,
  active,
  autoFocus,
  onAnswer,
}: {
  step: Extract<Step, { kind: 'input' }>
  a: Answers
  active: boolean
  autoFocus: boolean
  onAnswer: (key: string, value: string) => void
}) {
  const [value, setValue] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const id = useId()
  const prompt = text(step.prompt, a)

  useEffect(() => {
    if (active && autoFocus) inputRef.current?.focus({ preventScroll: true })
  }, [active, autoFocus])

  if (!active) {
    return (
      <>
        <p className="prompt">{prompt}</p>
        <p className="answer">{a[step.key]}</p>
      </>
    )
  }
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        const v = value.trim()
        if (v) onAnswer(step.key, v)
      }}
    >
      <label htmlFor={id} className="prompt">
        {prompt}
      </label>
      <div className="input-row">
        <input
          id={id}
          ref={inputRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={step.placeholder}
          maxLength={80}
          autoComplete="off"
          enterKeyHint="next"
        />
        <button type="submit" disabled={!value.trim()}>
          Continue
        </button>
      </div>
    </form>
  )
}

function TimerStep({ seconds, cue, active, onNext }: { seconds: number; cue: string; active: boolean; onNext: () => void }) {
  const [running, setRunning] = useState(false)

  useEffect(() => {
    if (!running || !active) return
    const t = setTimeout(onNext, seconds * 1000)
    return () => clearTimeout(t)
    // onNext is left out: it only does a functional state update, so a stale copy is fine.
  }, [running, active, seconds])

  if (!active) {
    return (
      <>
        <p className="prompt">{cue}</p>
        <Bar full />
      </>
    )
  }
  return (
    <>
      <p className="prompt">{cue}</p>
      {running ? (
        <>
          <Bar seconds={seconds} />
          <button className="link quiet" onClick={onNext}>
            I’m done
          </button>
        </>
      ) : (
        <button className="continue" onClick={() => setRunning(true)}>
          Start · {seconds} seconds
        </button>
      )}
    </>
  )
}

function UrgeStep({
  stepKey,
  seconds,
  a,
  active,
  onAnswer,
}: {
  stepKey: string
  seconds: number
  a: Answers
  active: boolean
  onAnswer: (key: string, value: string) => void
}) {
  const [startedAt, setStartedAt] = useState<number | null>(null)

  useEffect(() => {
    if (startedAt === null || !active) return
    const t = setTimeout(() => onAnswer(stepKey, 'none'), seconds * 1000)
    return () => clearTimeout(t)
    // Leaving the step (a tap) clears the timeout via `active`.
  }, [startedAt, active, seconds, stepKey])

  if (!active) {
    const v = a[stepKey]
    return <p className="answer">{v === 'none' ? 'You didn’t tap.' : `You tapped after ${v} seconds.`}</p>
  }
  if (startedAt === null) {
    return (
      <button className="continue" onClick={() => setStartedAt(performance.now())}>
        Start
      </button>
    )
  }
  return (
    <div className="urge">
      <button
        className="urge-button"
        onClick={() => onAnswer(stepKey, ((performance.now() - startedAt) / 1000).toFixed(1))}
      >
        Tap
      </button>
      <Bar seconds={seconds} />
    </div>
  )
}

// A slowly filling line. No numbers, no ticking.
function Bar({ seconds, full }: { seconds?: number; full?: boolean }) {
  return (
    <div className="bar" aria-hidden="true">
      <div className={full ? 'bar-fill full' : 'bar-fill'} style={seconds ? { animationDuration: `${seconds}s` } : undefined} />
    </div>
  )
}
