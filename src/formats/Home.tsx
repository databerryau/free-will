import { APP_TITLE, FORMATS } from '../content/copy'
import { Page } from '../components/Page'

// Owner's index. Testers are sent a format's own link instead.
export function Home() {
  return (
    <Page home="#/" title={APP_TITLE} lede="Three ways into the same seven experiments. Send each tester a single link." art="dawn">
      <ul className="cards">
        {FORMATS.map((f) => (
          <li key={f.route}>
            <a className="card plain" href={f.route}>
              <span className="card-text">
                <span className="card-title">{f.title}</span>
                <span className="card-hook">{f.description}</span>
                <span className="card-meta">Tests: {f.tests}</span>
              </span>
            </a>
          </li>
        ))}
      </ul>
    </Page>
  )
}
