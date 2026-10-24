import { useEffect, useState } from 'react'

// Hash routing, so the static build works on GitHub Pages without server config.
// "#/path/rewind" -> ["path", "rewind"]
export function useRoute(): string[] {
  const [hash, setHash] = useState(() => window.location.hash)

  useEffect(() => {
    const onChange = () => setHash(window.location.hash)
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  }, [])

  return hash.replace(/^#\/?/, '').split('/').filter(Boolean)
}

export function go(route: string) {
  window.location.hash = route
}

export function prefersReducedMotion(): boolean {
  return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false
}
