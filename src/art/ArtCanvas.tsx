import { useEffect, useRef } from 'react'
import type { ArtVariant } from '../content/types'
import { prefersReducedMotion } from '../lib/router'
import { SCENES, STILL_T, hexToRgb } from './scenes'

type Props = {
  variant: ArtVariant
  hue: string
  hue2?: string
  // Draw one frame and stop: thumbnails, and anyone who prefers reduced motion.
  still?: boolean
  // Height of the focal point, as a fraction (see Scene in scenes.ts).
  focus?: number
  className?: string
}

export function ArtCanvas({ variant, hue, hue2, still, focus = 0.5, className }: Props) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return
    const scene = SCENES[variant]
    const c1 = hexToRgb(hue)
    const c2 = hexToRgb(hue2 ?? hue)
    const isStill = still || prefersReducedMotion()
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    let w = 0
    let h = 0
    let raf = 0

    const draw = (t: number) => {
      ctx.globalCompositeOperation = 'source-over'
      ctx.clearRect(0, 0, w, h)
      ctx.globalCompositeOperation = 'lighter'
      scene(ctx, w, h, t, c1, c2, focus)
    }

    const resize = () => {
      const r = canvas.getBoundingClientRect()
      w = r.width
      h = r.height
      canvas.width = Math.max(1, Math.round(w * dpr))
      canvas.height = Math.max(1, Math.round(h * dpr))
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      if (isStill) draw(STILL_T)
    }

    const ro = new ResizeObserver(resize)
    ro.observe(canvas)
    resize()

    if (!isStill) {
      const start = performance.now()
      const loop = (now: number) => {
        draw(STILL_T + (now - start) / 1000)
        raf = requestAnimationFrame(loop)
      }
      raf = requestAnimationFrame(loop)
    }

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
    }
  }, [variant, hue, hue2, still, focus])

  return <canvas ref={ref} className={className} aria-hidden="true" />
}
