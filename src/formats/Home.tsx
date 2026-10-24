import { APP_TITLE, FORMATS } from '../content/copy'
import { Page } from '../components/Page'

// Owner's index. Testers are sent a format's own link instead.
export function Home() {
  return (
    <Page home="#/">
      <h1>{APP_TITLE}</h1>
      <p className="lede">
        Three prototype formats for the same seven experiments, based on Sam Harris’s argument in <cite>Free Will</cite>.
        Each link works on its own, so a tester only sees the format you send them.
      </p>
      <ul className="cards">
        {FORMATS.map((f) => (
          <li key={f.route}>
            <a className="card" href={f.route}>
              <span className="card-title">{f.title}</span>
              <span className="card-hook">{f.description}</span>
              <span className="card-meta">Tests: {f.tests}</span>
            </a>
          </li>
        ))}
      </ul>
    </Page>
  )
}
