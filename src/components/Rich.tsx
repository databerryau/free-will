// One bit of markup: *text* renders as emphasis (answers, quotations).
export function Rich({ text }: { text: string }) {
  return <>{text.split(/\*(.+?)\*/g).map((part, i) => (i % 2 ? <em key={i}>{part}</em> : part))}</>
}

export function Arrow({ back }: { back?: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true" style={back ? { transform: 'scaleX(-1)' } : undefined}>
      <path d="M4 10h11M11 5l5 5-5 5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function Close() {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" aria-hidden="true">
      <path d="M5 5l10 10M15 5L5 15" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}
