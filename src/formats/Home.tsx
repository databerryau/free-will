import { APP_TITLE, FORMATS } from '../content/copy'
import { Page } from '../components/Page'

// Index of the three formats. Each format's own link also works on its own.
export function Home() {
  return (
    <Page home="#/" title={APP_TITLE} lede="Three ways into the same seven experiments." art="dawn">
      <ul className="cards">
        {FORMATS.map((f) => (
          <li key={f.route}>
            <a className="card plain" href={f.route}>
              <span className="card-text">
                <span className="card-title">{f.title}</span>
                <span className="card-hook">{f.description}</span>
              </span>
            </a>
          </li>
        ))}
      </ul>
    </Page>
  )
}
