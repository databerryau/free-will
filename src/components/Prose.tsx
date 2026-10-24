// Paragraphs with one bit of markup: *text* renders as emphasis.
export function Prose({ paras }: { paras: string[] }) {
  return (
    <>
      {paras.map((p, i) => (
        <p key={i}>
          {p.split(/\*(.+?)\*/g).map((part, j) => (j % 2 ? <em key={j}>{part}</em> : part))}
        </p>
      ))}
    </>
  )
}
