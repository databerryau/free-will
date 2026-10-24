import type { ArtVariant } from '../content/types'

// Generative scenes, drawn as pure functions of time so a still frame and an
// animated one look alike. All of them are lights in the dark: thoughts arising.

export type RGB = [number, number, number]
export type Scene = (ctx: CanvasRenderingContext2D, w: number, h: number, t: number, c: RGB, c2: RGB) => void

const TAU = Math.PI * 2
const WHITE: RGB = [255, 247, 235]
const GOLD: RGB = [255, 196, 120]
const CORAL: RGB = [255, 128, 106]

export function hexToRgb(hex: string): RGB {
  const n = parseInt(hex.replace('#', ''), 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}

const rgba = (c: RGB, a: number) =>
  `rgba(${Math.round(c[0])},${Math.round(c[1])},${Math.round(c[2])},${Math.max(0, Math.min(1, a))})`

const mix = (a: RGB, b: RGB, f: number): RGB => [
  a[0] + (b[0] - a[0]) * f,
  a[1] + (b[1] - a[1]) * f,
  a[2] + (b[2] - a[2]) * f,
]

// Stable pseudo-random number in [0, 1) for particle i in life cycle k.
function rand(i: number, k = 0, salt = 0): number {
  const x = Math.sin(i * 127.1 + k * 311.7 + salt * 74.7) * 43758.5453
  return x - Math.floor(x)
}

// Size unit, so scenes read the same on a phone, a desktop and a thumbnail.
const unit = (w: number, h: number) => Math.min(1.6, Math.max(0.35, Math.min(w, h) / 420))

function glow(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, c: RGB, a: number) {
  if (a <= 0.003 || r <= 0) return
  const g = ctx.createRadialGradient(x, y, 0, x, y, r)
  g.addColorStop(0, rgba(c, a))
  g.addColorStop(0.4, rgba(c, a * 0.3))
  g.addColorStop(1, rgba(c, 0))
  ctx.fillStyle = g
  ctx.beginPath()
  ctx.arc(x, y, r, 0, TAU)
  ctx.fill()
}

function dot(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, c: RGB, a: number) {
  ctx.fillStyle = rgba(c, a)
  ctx.beginPath()
  ctx.arc(x, y, r, 0, TAU)
  ctx.fill()
}

// Motes that fade in somewhere, drift upward and fade out.
function motes(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  t: number,
  c: RGB,
  count: number,
  top = 0.1,
  bottom = 0.95,
  strength = 1,
) {
  const u = unit(w, h)
  for (let i = 0; i < count; i++) {
    const period = 6 + rand(i, 0, 1) * 7
    const p = (t + rand(i, 0, 2) * period) / period
    const k = Math.floor(p)
    const f = p - k
    const x = rand(i, k, 3) * w
    const y = (top + rand(i, k, 4) * (bottom - top)) * h - f * 40 * u
    const a = Math.pow(Math.sin(Math.PI * f), 1.6) * (0.25 + rand(i, k, 5) * 0.75) * strength
    const r = (0.8 + rand(i, k, 6) * 2.2) * u
    glow(ctx, x, y, r * 9, c, a * 0.22)
    dot(ctx, x, y, r, mix(c, WHITE, 0.5), a)
  }
}

const field: Scene = (ctx, w, h, t, c) => {
  glow(ctx, w * 0.5, h * 0.35, Math.max(w, h) * 0.6, c, 0.1)
  motes(ctx, w, h, t, c, 70)
}

// The thinking animation: a slowly breathing orb that gives off thoughts.
const think: Scene = (ctx, w, h, t, c) => {
  const u = unit(w, h)
  const cx = w / 2
  const cy = h * 0.34
  const breath = 0.5 - 0.5 * Math.cos((TAU * t) / 8)
  const R = Math.min(w, h) * 0.12 * (0.85 + 0.3 * breath)

  glow(ctx, cx, cy, R * 5, c, 0.16 + 0.12 * breath)
  for (let j = 0; j < 2; j++) {
    const f = (t / 8 + j / 2) % 1
    ctx.strokeStyle = rgba(c, (1 - f) * 0.3)
    ctx.lineWidth = u
    ctx.beginPath()
    ctx.arc(cx, cy, R * (1.1 + f * 3), 0, TAU)
    ctx.stroke()
  }
  const core = ctx.createRadialGradient(cx, cy - R * 0.3, R * 0.05, cx, cy, R)
  core.addColorStop(0, rgba(WHITE, 0.95))
  core.addColorStop(0.45, rgba(mix(c, WHITE, 0.3), 0.85))
  core.addColorStop(1, rgba(c, 0))
  ctx.fillStyle = core
  ctx.beginPath()
  ctx.arc(cx, cy, R, 0, TAU)
  ctx.fill()

  for (let i = 0; i < 48; i++) {
    const period = 4 + rand(i, 0, 1) * 4
    const p = (t + rand(i, 0, 2) * period) / period
    const k = Math.floor(p)
    const f = p - k
    const ang = rand(i, k, 3) * TAU + f * (rand(i, k, 4) - 0.5) * 1.2
    const d = R * (0.9 + f * (2 + rand(i, k, 5) * 3))
    const x = cx + Math.cos(ang) * d
    const y = cy + Math.sin(ang) * d - f * 30 * u
    const a = Math.sin(Math.PI * f) * 0.8
    const r = (0.7 + rand(i, k, 6) * 1.6) * u
    glow(ctx, x, y, r * 7, c, a * 0.25)
    dot(ctx, x, y, r, mix(c, WHITE, 0.6), a)
  }
}

// City lights at night, seen from above. One of them is brighter: the one you picked.
const city: Scene = (ctx, w, h, t, c) => {
  const u = unit(w, h)
  const clusters = 6
  const centre = (j: number) => [0.12 + rand(j, 0, 11) * 0.76, 0.38 + rand(j, 0, 12) * 0.5]
  const pos = (i: number) => {
    const j = i % clusters
    const [mx, my] = centre(j)
    if (rand(i, 0, 13) < 0.25) return [rand(i, 0, 16) * w, (0.25 + rand(i, 0, 17) * 0.75) * h]
    const ang = rand(i, 0, 14) * TAU
    const rad = Math.pow(rand(i, 0, 15), 1.8) * 0.2
    return [(mx + Math.cos(ang) * rad) * w, (my + Math.sin(ang) * rad * 0.6) * h]
  }

  glow(ctx, w * 0.5, h * 0.95, Math.max(w, h) * 0.7, c, 0.12)
  ctx.lineWidth = 0.6 * u
  for (let j = 0; j < clusters; j++) {
    ctx.strokeStyle = rgba(c, 0.1)
    ctx.beginPath()
    for (let n = 0; n < 8; n++) {
      const [x, y] = pos(j + n * clusters)
      if (n === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    }
    ctx.stroke()
  }
  for (let i = 0; i < 240; i++) {
    const [x, y] = pos(i)
    const base = 0.3 + rand(i, 0, 18) * 0.7
    const a = base * (0.65 + 0.35 * Math.sin(t * (0.6 + rand(i, 0, 19) * 1.8) + rand(i, 0, 20) * TAU))
    const r = (0.6 + rand(i, 0, 21) * 1.6) * u
    const col = rand(i, 0, 22) < 0.25 ? WHITE : c
    glow(ctx, x, y, r * 8, col, a * 0.25)
    dot(ctx, x, y, r, mix(col, WHITE, 0.3), a)
  }
  const [px, py] = centre(0).map((v, n) => v * (n ? h : w))
  glow(ctx, px, py, 34 * u, mix(c, WHITE, 0.3), 0.55 + 0.2 * Math.sin(t * 1.4))
}

// Rings spreading from a single point: an impulse arriving.
const ripple: Scene = (ctx, w, h, t, c) => {
  const u = unit(w, h)
  const cx = w / 2
  const cy = h * 0.36
  const maxR = Math.hypot(w, h) * 0.6
  glow(ctx, cx, cy, maxR * 0.5, c, 0.1)
  for (let j = 0; j < 5; j++) {
    const f = (t / 3.5 + j / 5) % 1
    ctx.strokeStyle = rgba(c, Math.pow(1 - f, 2) * 0.55)
    ctx.lineWidth = (1 + (1 - f) * 1.5) * u
    ctx.beginPath()
    ctx.arc(cx, cy, 8 * u + f * maxR, 0, TAU)
    ctx.stroke()
  }
  glow(ctx, cx, cy, 40 * u * (1 + 0.15 * Math.sin(t * 2.2)), c, 0.7)
  dot(ctx, cx, cy, 4 * u, WHITE, 0.95)
  motes(ctx, w, h, t, c, 25, 0.1, 0.95, 0.6)
}

// Roots growing down from a single choice, branching into causes.
type Seg = { x1: number; y1: number; x2: number; y2: number; d: number }
const treeCache = new Map<string, Seg[]>()

function tree(w: number, h: number): Seg[] {
  const key = `${Math.round(w)}x${Math.round(h)}`
  const cached = treeCache.get(key)
  if (cached) return cached
  const segs: Seg[] = []
  let n = 0
  const grow = (x: number, y: number, ang: number, len: number, d: number) => {
    if (d > 7 || len < 3) return
    const x2 = x + Math.cos(ang) * len
    const y2 = y + Math.sin(ang) * len
    segs.push({ x1: x, y1: y, x2, y2, d })
    const kids = rand(n++, 0, 31) < 0.25 ? 3 : 2
    for (let k = 0; k < kids; k++) {
      const spread = (k - (kids - 1) / 2) * (0.35 + rand(n++, 0, 32) * 0.35)
      grow(x2, y2, ang + spread + (rand(n++, 0, 33) - 0.5) * 0.3, len * (0.68 + rand(n++, 0, 34) * 0.14), d + 1)
    }
  }
  grow(w / 2, h * 0.08, Math.PI / 2, Math.min(h * 0.17, w * 0.32), 0)
  treeCache.set(key, segs)
  return segs
}

const roots: Scene = (ctx, w, h, t, c) => {
  const u = unit(w, h)
  const cyc = (t % 18) / 18
  const depth = cyc < 0.6 ? (cyc / 0.6) * 8.5 : 8.5
  const fade = cyc < 0.85 ? 1 : 1 - (cyc - 0.85) / 0.15
  glow(ctx, w / 2, h * 0.08, 120 * u, c, 0.1 + 0.3 * fade)
  ctx.lineCap = 'round'
  for (const s of tree(w, h)) {
    const p = Math.max(0, Math.min(1, depth - s.d))
    if (p <= 0) continue
    const x = s.x1 + (s.x2 - s.x1) * p
    const y = s.y1 + (s.y2 - s.y1) * p
    ctx.strokeStyle = rgba(c, (0.75 - s.d * 0.07) * fade)
    ctx.lineWidth = Math.max(0.5, 3.2 - s.d * 0.38) * u
    ctx.beginPath()
    ctx.moveTo(s.x1, s.y1)
    ctx.lineTo(x, y)
    ctx.stroke()
    if (p < 1) glow(ctx, x, y, 10 * u, mix(c, WHITE, 0.4), 0.7 * fade)
  }
  dot(ctx, w / 2, h * 0.08, 4 * u, WHITE, 0.9)
  motes(ctx, w, h, t, c, 20, 0.2, 1, 0.5)
}

// A galaxy of moments turning slowly backwards.
const spiral: Scene = (ctx, w, h, t, c) => {
  const u = unit(w, h)
  const cx = w / 2
  const cy = h * 0.36
  const maxR = Math.min(w, h) * 0.6
  glow(ctx, cx, cy, maxR * 0.9, c, 0.12)
  const N = 480
  const arms = 3
  for (let i = 0; i < N; i++) {
    const arm = i % arms
    const s = Math.floor(i / arms) / (N / arms)
    const r = Math.pow(s, 0.85) * maxR * (0.95 + rand(i, 0, 41) * 0.1)
    const ang = (arm * TAU) / arms + s * 7 - t * 0.12 + (rand(i, 0, 42) - 0.5) * 0.25
    const x = cx + Math.cos(ang) * r
    const y = cy + Math.sin(ang) * r * 0.92
    const a = (1 - s) * (0.35 + rand(i, 0, 43) * 0.6)
    const rr = (0.5 + (1 - s) * 1.4) * u
    dot(ctx, x, y, rr, mix(c, WHITE, 0.35 * (1 - s)), a)
    if (rand(i, 0, 44) < 0.08) glow(ctx, x, y, rr * 10, c, a * 0.3)
  }
  glow(ctx, cx, cy, 50 * u, mix(c, WHITE, 0.3), 0.7)
}

// A flame of desire, flickering on its own.
const flame: Scene = (ctx, w, h, t, c) => {
  const u = unit(w, h)
  const cx = w / 2
  const cy = h * 0.4
  const R = Math.min(w, h) * 0.17
  glow(ctx, cx, cy, R * 4.5, c, 0.16)
  for (let L = 0; L < 5; L++) {
    const s = 1 - L * 0.17
    ctx.beginPath()
    for (let j = 0; j <= 64; j++) {
      const th = (j / 64) * TAU
      const rr = R * s * (1 + 0.07 * Math.sin(3 * th + t * 1.2 + L) + 0.045 * Math.sin(5 * th - t * 1.9 + L * 2))
      const sn = Math.sin(th)
      const x = cx + Math.cos(th) * rr * (sn < 0 ? 1 + 0.35 * sn : 1)
      const y = cy + sn * rr * (sn < 0 ? 1.7 : 0.9)
      if (j === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    }
    ctx.closePath()
    const col = mix(c, GOLD, L / 5)
    const g = ctx.createRadialGradient(cx, cy + R * 0.2, 0, cx, cy, R * s * 1.6)
    g.addColorStop(0, rgba(mix(col, WHITE, L / 6), 0.3 + L * 0.08))
    g.addColorStop(1, rgba(col, 0.03))
    ctx.fillStyle = g
    ctx.fill()
  }
  for (let i = 0; i < 36; i++) {
    const period = 3 + rand(i, 0, 1) * 3
    const p = (t + rand(i, 0, 2) * period) / period
    const k = Math.floor(p)
    const f = p - k
    const x = cx + (rand(i, k, 51) - 0.5) * R * 1.4 + Math.sin(t * 1.5 + i) * R * 0.1 * f
    const y = cy - R * 0.9 - f * h * 0.3
    const a = Math.sin(Math.PI * f) * 0.8
    const r = (0.6 + rand(i, k, 52) * 1.4) * u
    glow(ctx, x, y, r * 7, c, a * 0.3)
    dot(ctx, x, y, r, mix(GOLD, WHITE, 0.4), a)
  }
}

// Two lives in a figure of eight, each flowing into the other.
const mirror: Scene = (ctx, w, h, t, c, c2) => {
  const u = unit(w, h)
  const cx = w / 2
  const cy = h * 0.36
  const A = Math.min(w * 0.42, h * 0.32)
  glow(ctx, cx - A * 0.7, cy, A * 1.1, c, 0.22)
  glow(ctx, cx + A * 0.7, cy, A * 1.1, c2, 0.22)
  const N = 240
  for (let i = 0; i < N; i++) {
    const s = (i / N) * TAU + t * 0.22 + (rand(i, 0, 61) - 0.5) * 0.08
    const den = 1 + Math.sin(s) ** 2
    const jitter = (rand(i, 0, 62) - 0.5) * 14 * u
    const x = cx + (A * Math.cos(s)) / den + jitter * 0.3
    const y = cy + (A * Math.sin(s) * Math.cos(s)) / den + jitter
    const f = Math.max(0, Math.min(1, (x - (cx - A)) / (2 * A)))
    const col = mix(c, c2, f)
    const a = 0.25 + rand(i, 0, 63) * 0.6
    const r = (0.6 + rand(i, 0, 64) * 1.5) * u
    dot(ctx, x, y, r, mix(col, WHITE, 0.3), a)
    if (rand(i, 0, 65) < 0.1) glow(ctx, x, y, r * 9, col, a * 0.35)
  }
  glow(ctx, cx - A * 0.7, cy, 22 * u, mix(c, WHITE, 0.4), 0.8)
  glow(ctx, cx + A * 0.7, cy, 22 * u, mix(c2, WHITE, 0.4), 0.8)
}

// First light on a horizon, under a sky still full of stars.
const dawn: Scene = (ctx, w, h, t, c) => {
  const u = unit(w, h)
  const g = ctx.createLinearGradient(0, h, 0, h * 0.3)
  g.addColorStop(0, rgba(c, 0.5))
  g.addColorStop(0.35, rgba(CORAL, 0.18))
  g.addColorStop(1, rgba(CORAL, 0))
  ctx.fillStyle = g
  ctx.fillRect(0, 0, w, h)
  glow(ctx, w / 2, h * 1.05, Math.max(w, h) * 0.55, mix(c, WHITE, 0.2), 0.6 + 0.08 * Math.sin(t * 0.5))
  for (let i = 0; i < 90; i++) {
    const x = rand(i, 0, 71) * w
    const y = rand(i, 0, 72) * h * 0.6
    const tw = 0.6 + 0.4 * Math.sin(t * (0.5 + rand(i, 0, 73) * 1.5) + rand(i, 0, 74) * TAU)
    const a = (0.2 + rand(i, 0, 75) * 0.6) * tw * (1 - y / (h * 0.6))
    dot(ctx, x, y, (0.5 + rand(i, 0, 76) * 0.8) * u, WHITE, a)
  }
  motes(ctx, w, h, t, c, 30, 0.55, 1, 0.8)
}

export const SCENES: Record<ArtVariant, Scene> = { field, think, city, ripple, roots, spiral, flame, mirror, dawn }

// The moment drawn for still images (thumbnails, reduced motion): roots fully grown.
export const STILL_T = 11.2
