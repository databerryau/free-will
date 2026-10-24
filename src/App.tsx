import { useEffect } from 'react'
import { Home } from './formats/Home'
import { Library } from './formats/Library'
import { Path } from './formats/Path'
import { Walkthrough } from './formats/Walkthrough'
import { useRoute } from './lib/router'

export function App() {
  const route = useRoute()
  const [section, sub] = route
  const key = route.join('/')

  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [key])

  switch (section) {
    case 'walkthrough':
      return <Walkthrough screen={Number(sub ?? 0)} />
    case 'library':
      return <Library id={sub} />
    case 'path':
      return <Path sub={sub} />
    default:
      return <Home />
  }
}
