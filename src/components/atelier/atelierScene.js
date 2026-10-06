// The Waarfe atelier: three phones showing real delivered stores (live-scrolling screens),
// choreographed by page scroll, with gold & green leaves drifting through a cream studio.
import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'

const lerp = (a, b, t) => a + (b - a) * t
const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)
/** Sample a keyframed track [v0, v1, v2, v3] at stops [0, .35, .7, 1]. */
const STOPS = [0, 0.35, 0.7, 1]
function track(vals, p) {
  for (let i = 0; i < STOPS.length - 1; i++) {
    if (p <= STOPS[i + 1]) return lerp(vals[i], vals[i + 1], ease((p - STOPS[i]) / (STOPS[i + 1] - STOPS[i])))
  }
  return vals[vals.length - 1]
}

function roundedRect(w, h, r) {
  const s = new THREE.Shape(), x = -w / 2, y = -h / 2
  s.moveTo(x + r, y); s.lineTo(x + w - r, y); s.quadraticCurveTo(x + w, y, x + w, y + r)
  s.lineTo(x + w, y + h - r); s.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
  s.lineTo(x + r, y + h); s.quadraticCurveTo(x, y + h, x, y + h - r)
  s.lineTo(x, y + r); s.quadraticCurveTo(x, y, x + r, y)
  const g = new THREE.ShapeGeometry(s, 12)
  const pos = g.attributes.position, uv = []
  for (let i = 0; i < pos.count; i++) uv.push((pos.getX(i) - x) / w, (pos.getY(i) - y) / h)
  g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2))
  return g
}

function leafGeometry(size = 1) {
  const s = new THREE.Shape()
  s.moveTo(0, 0)
  s.bezierCurveTo(0.32 * size, 0.18 * size, 0.34 * size, 0.62 * size, 0, size)
  s.bezierCurveTo(-0.34 * size, 0.62 * size, -0.32 * size, 0.18 * size, 0, 0)
  const g = new THREE.ExtrudeGeometry(s, { depth: 0.01 * size, bevelEnabled: true, bevelThickness: 0.008 * size, bevelSize: 0.01 * size, bevelSegments: 2, curveSegments: 16 })
  g.translate(0, -0.5 * size, 0)
  return g
}

/** Load a tall store page into a scrollable canvas texture (skips the blank top margin). */
function storeTexture(url, onLoad) {
  const tex = new THREE.CanvasTexture(document.createElement('canvas'))
  tex.colorSpace = THREE.SRGBColorSpace
  const img = new Image()
  img.crossOrigin = 'anonymous'
  img.onload = () => {
    const W = 360, skip = 0.026, keep = 0.95
    const fullH = Math.round((img.naturalHeight / img.naturalWidth) * W)
    const H = Math.min(4000, Math.round(fullH * keep))
    const c = document.createElement('canvas'); c.width = W; c.height = H
    const ctx = c.getContext('2d')
    ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, W, H)
    const sy = img.naturalHeight * skip, sh = (H / fullH) * img.naturalHeight
    ctx.drawImage(img, 0, sy, img.naturalWidth, sh, 0, 0, W, H)
    tex.image = c
    tex.anisotropy = 4
    tex.needsUpdate = true
    onLoad?.(W / H)
  }
  img.src = url
  return tex
}

export function createAtelier(canvas, { stores, onReady }) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75))
  renderer.outputColorSpace = THREE.SRGBColorSpace
  renderer.toneMapping = THREE.ACESFilmicToneMapping

  const scene = new THREE.Scene()
  const pmrem = new THREE.PMREMGenerator(renderer)
  const env = pmrem.fromScene(new RoomEnvironment(), 0.04).texture
  scene.environment = env
  scene.add(new THREE.HemisphereLight(0xfffaf0, 0xe6dcb8, 0.6))
  const key = new THREE.DirectionalLight(0xfff1d6, 1.4); key.position.set(-3, 4, 5); scene.add(key)
  const rim = new THREE.DirectionalLight(0xd7c676, 1.2); rim.position.set(4, 1, -3); scene.add(rim)

  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 60)
  const rig = new THREE.Group(); scene.add(rig)

  const gold = new THREE.MeshStandardMaterial({ color: 0xe2cf7c, metalness: 1, roughness: 0.25, envMapIntensity: 1.2 })
  const shell = new THREE.MeshPhysicalMaterial({ color: 0x09382e, roughness: 0.35, metalness: 0.2, clearcoat: 1, clearcoatRoughness: 0.15, envMapIntensity: 0.6 })
  const glassBlack = new THREE.MeshBasicMaterial({ color: 0x061a15 })

  const PW = 1, PH = 2.12, PD = 0.1
  const phones = stores.map((url, i) => {
    const g = new THREE.Group()
    const body = new THREE.Mesh(new RoundedBoxGeometry(PW, PH, PD, 6, 0.13), shell); g.add(body)
    const band = new THREE.Mesh(new RoundedBoxGeometry(PW + 0.012, PH + 0.012, PD * 0.55, 6, 0.135), gold); g.add(band)
    const bezel = new THREE.Mesh(roundedRect(PW - 0.05, PH - 0.05, 0.11), glassBlack); bezel.position.z = PD / 2 + 0.001; g.add(bezel)
    const scr = new THREE.MeshBasicMaterial({ color: 0xffffff, toneMapped: false })
    const sw = PW - 0.1, sh = PH - 0.1
    const screen = new THREE.Mesh(roundedRect(sw, sh, 0.085), scr); screen.position.z = PD / 2 + 0.002; g.add(screen)
    const island = new THREE.Mesh(roundedRect(0.28, 0.075, 0.037), glassBlack); island.position.set(0, sh / 2 - 0.09, PD / 2 + 0.003); g.add(island)
    // back: gold ring camera
    const cam = new THREE.Mesh(new THREE.TorusGeometry(0.09, 0.018, 12, 32), gold); cam.position.set(-0.27, 0.78, -PD / 2 - 0.005); g.add(cam)
    const state = { tex: null, frac: 1, t: Math.random() * 10 }
    state.tex = storeTexture(url, (aspect) => {
      // fraction of texture height visible on the screen
      state.frac = Math.min(1, (sh / sw) * aspect)
      state.tex.repeat.set(1, state.frac)
      state.tex.offset.set(0, 1 - state.frac)
      scr.map = state.tex; scr.needsUpdate = true
      if (i === 0) onReady?.()
    })
    g.userData = state
    rig.add(g)
    return g
  })

  // leaves
  const leafG = leafGeometry(0.4)
  const leafMats = [gold,
    new THREE.MeshPhysicalMaterial({ color: 0x3f8a6c, roughness: 0.4, clearcoat: 0.8, side: THREE.DoubleSide }),
    new THREE.MeshPhysicalMaterial({ color: 0xa8c9ae, roughness: 0.45, clearcoat: 0.6, side: THREE.DoubleSide }),
    new THREE.MeshPhysicalMaterial({ color: 0xeadfae, roughness: 0.35, clearcoat: 0.8, side: THREE.DoubleSide })]
  const leaves = Array.from({ length: 22 }, (_, i) => {
    const m = new THREE.Mesh(leafG, leafMats[i % leafMats.length])
    m.scale.setScalar(0.5 + ((i * 13) % 9) / 10)
    m.userData = { x: ((i * 53) % 100) / 100 * 9 - 4.5, y: ((i * 31) % 100) / 100 * 5 - 2.5, z: -1.5 + ((i * 17) % 10) / 10 * 3, s: 0.15 + (i % 5) * 0.05, ph: i * 1.3 }
    scene.add(m)
    return m
  })

  // choreography (x, y, z, rotY, rotX) per phone at scroll stops 0/.35/.7/1
  const K = [
    { x: [0, 0.75, 0, 0], y: [-0.05, 0, 0.05, 0.05], z: [0.3, 0.2, 0.45, 0.45], ry: [-0.85, -0.3, 0, 0], rx: [0.12, 0.02, 0, 0] },
    { x: [-5, -0.85, -1.4, -1.4], y: [-0.3, -0.1, -0.05, -0.05], z: [-0.6, -0.2, -0.15, -0.15], ry: [0.9, 0.35, 0.38, 0.38], rx: [0, 0, 0, 0] },
    { x: [5, 5, 1.4, 1.4], y: [-0.3, -0.3, -0.05, -0.05], z: [-0.6, -0.6, -0.15, -0.15], ry: [-0.9, -0.9, -0.38, -0.38], rx: [0, 0, 0, 0] },
  ]
  let target = 0, prog = 0, px = 0, py = 0, cx = 0, cy = 0, narrow = false, raf = 0, running = false
  const clock = new THREE.Clock()
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches

  const resize = () => {
    const w = canvas.clientWidth, h = canvas.clientHeight
    if (!w || !h) return
    renderer.setSize(w, h, false)
    camera.aspect = w / h
    narrow = w / h < 0.9
    camera.updateProjectionMatrix()
  }
  const frame = () => {
    const dt = Math.min(clock.getDelta(), 0.05), t = clock.elapsedTime
    prog += (target - prog) * (reduce ? 1 : 0.08)
    cx += (px - cx) * 0.05; cy += (py - cy) * 0.05
    const spread = narrow ? 0.62 : 1
    // desktop: stage sits left of the text; mobile: centred, lower
    rig.position.set(narrow ? 0 : -1.6, narrow ? -0.75 : -0.05, 0)
    camera.position.set(cx * 0.25, 0.15 + cy * -0.15, (narrow ? 8.2 : 7) + track([0, 0.2, 1.1, 1.1], prog))
    camera.lookAt(rig.position.x * 0.2, rig.position.y * 0.5, 0)
    phones.forEach((g, i) => {
      const k = K[i]
      g.position.set(track(k.x, prog) * spread, track(k.y, prog) + Math.sin(t * 0.8 + i) * 0.03, track(k.z, prog))
      g.rotation.set(track(k.rx, prog) + cy * 0.05, track(k.ry, prog) + cx * 0.12 + Math.sin(t * 0.5 + i * 2) * 0.03, 0)
      const st = g.userData
      if (st.frac < 1 && !reduce) {
        st.t += dt
        const cyc = (Math.sin(st.t * 0.12 - Math.PI / 2) + 1) / 2 // 0→1→0 slowly
        st.tex.offset.y = (1 - st.frac) * (1 - cyc)
      }
    })
    for (const l of leaves) {
      const u = l.userData
      l.position.set(u.x + Math.sin(t * u.s + u.ph) * 0.4, u.y + Math.sin(t * u.s * 1.3 + u.ph) * 0.3 - prog * 0.8, u.z)
      l.rotation.set(t * u.s * 0.8 + u.ph, t * u.s + u.ph, Math.sin(t * 0.4 + u.ph) * 0.6)
    }
    renderer.render(scene, camera)
  }
  const loop = () => { frame(); raf = running ? requestAnimationFrame(loop) : 0 }
  const start = () => { if (!running) { running = true; raf = requestAnimationFrame(loop) } }
  const stop = () => { running = false; cancelAnimationFrame(raf); raf = 0 }
  const onPointer = (e) => { px = (e.clientX / innerWidth) * 2 - 1; py = (e.clientY / innerHeight) * 2 - 1 }
  window.addEventListener('pointermove', onPointer, { passive: true })
  const ro = new ResizeObserver(resize); ro.observe(canvas)
  const io = new IntersectionObserver(([e]) => (e.isIntersecting ? start() : stop())); io.observe(canvas)
  resize(); frame()

  return {
    setProgress: (p) => { target = Math.max(0, Math.min(1, p)) },
    dispose: () => {
      stop(); ro.disconnect(); io.disconnect(); window.removeEventListener('pointermove', onPointer)
      scene.traverse((o) => { o.geometry?.dispose?.(); const m = o.material; (Array.isArray(m) ? m : [m]).forEach((x) => { x?.map?.dispose?.(); x?.dispose?.() }) })
      env.dispose(); pmrem.dispose(); renderer.dispose()
    },
  }
}
