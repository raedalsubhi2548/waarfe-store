// Procedural Three.js scene: a Waarfe shopping bag with gold handles, the real logo
// on its front label, and leaves drifting around it («وارف» = lush shade).
import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'

const GREEN = 0x09382e, GREEN_2 = 0x0f4a3d, GOLD = 0xd7c676, CREAM = 0xfefbf2

function leafGeometry(size = 1) {
  const s = new THREE.Shape()
  s.moveTo(0, 0)
  s.bezierCurveTo(0.32 * size, 0.18 * size, 0.34 * size, 0.62 * size, 0, 1 * size)
  s.bezierCurveTo(-0.34 * size, 0.62 * size, -0.32 * size, 0.18 * size, 0, 0)
  const g = new THREE.ExtrudeGeometry(s, { depth: 0.012 * size, bevelEnabled: true, bevelThickness: 0.01 * size, bevelSize: 0.012 * size, bevelSegments: 2, curveSegments: 18 })
  g.translate(0, -0.5 * size, 0)
  return g
}

export function createBagScene(canvas, { onReady } = {}) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'low-power' })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75))
  renderer.outputColorSpace = THREE.SRGBColorSpace
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.05

  const scene = new THREE.Scene()
  const pmrem = new THREE.PMREMGenerator(renderer)
  const envTex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture
  scene.environment = envTex
  const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 50)
  camera.position.set(0, 0.35, 8.1)

  // light: warm key, cream fill, gold rim
  scene.add(new THREE.HemisphereLight(0xfffaf0, 0xd8cfae, 0.5))
  const key = new THREE.DirectionalLight(0xfff3dc, 1.3)
  key.position.set(-3, 5, 4)
  scene.add(key)
  const rim = new THREE.DirectionalLight(GOLD, 0.9)
  rim.position.set(4, 2, -3)
  scene.add(rim)

  const world = new THREE.Group()
  scene.add(world)

  // --- the bag
  const bag = new THREE.Group()
  world.add(bag)
  const paper = new THREE.MeshPhysicalMaterial({ color: GREEN, roughness: 0.62, clearcoat: 0.18, clearcoatRoughness: 0.5, sheen: 0.25, sheenColor: new THREE.Color(0x2f6b55), envMapIntensity: 0.2 })
  const body = new THREE.Mesh(new RoundedBoxGeometry(1.7, 2.0, 0.78, 6, 0.07), paper)
  bag.add(body)
  const cuff = new THREE.Mesh(new RoundedBoxGeometry(1.74, 0.22, 0.82, 4, 0.05), new THREE.MeshPhysicalMaterial({ color: GREEN_2, roughness: 0.55, clearcoat: 0.2, envMapIntensity: 0.2 }))
  cuff.position.y = 0.92
  bag.add(cuff)

  const goldMat = new THREE.MeshStandardMaterial({ color: 0xe2cf7c, metalness: 1, roughness: 0.22, envMapIntensity: 1.3 })
  for (const z of [0.3, -0.3]) {
    const h = new THREE.Mesh(new THREE.TorusGeometry(0.42, 0.045, 16, 48, Math.PI), goldMat)
    h.position.set(0, 1.02, z)
    bag.add(h)
  }
  // gold piping at the cuff
  const pipe = new THREE.Mesh(new THREE.BoxGeometry(1.72, 0.018, 0.02), goldMat)
  pipe.position.set(0, 0.8, 0.401)
  bag.add(pipe)

  // front label with the real logo (image file, not redrawn)
  const label = new THREE.Group()
  label.position.set(0, -0.08, 0.392)
  bag.add(label)
  const plate = new THREE.Mesh(new THREE.CircleGeometry(0.56, 64), new THREE.MeshBasicMaterial({ color: CREAM, toneMapped: false }))
  label.add(plate)
  const ring = new THREE.Mesh(new THREE.RingGeometry(0.56, 0.585, 64), goldMat)
  ring.position.z = 0.002
  label.add(ring)
  new THREE.TextureLoader().load('/logo.png', (tex) => {
    tex.colorSpace = THREE.SRGBColorSpace
    tex.anisotropy = 4
    const logo = new THREE.Mesh(new THREE.PlaneGeometry(0.78, 0.754), new THREE.MeshBasicMaterial({ map: tex, transparent: true, toneMapped: false }))
    logo.position.z = 0.004
    label.add(logo)
    onReady?.()
  }, undefined, () => onReady?.())

  // --- leaves
  const leafG = leafGeometry(0.52)
  const mats = [
    goldMat,
    new THREE.MeshPhysicalMaterial({ color: 0x3f8a6c, roughness: 0.4, clearcoat: 0.8, side: THREE.DoubleSide }),
    new THREE.MeshPhysicalMaterial({ color: 0x9fc4a8, roughness: 0.45, clearcoat: 0.6, side: THREE.DoubleSide }),
    new THREE.MeshPhysicalMaterial({ color: 0xeadfae, roughness: 0.35, clearcoat: 0.8, side: THREE.DoubleSide }),
  ]
  const leaves = []
  const N = 16
  for (let i = 0; i < N; i++) {
    const m = new THREE.Mesh(leafG, mats[i % mats.length])
    const r = 1.75 + (i % 4) * 0.28
    const a = (i / N) * Math.PI * 2
    const y = -0.9 + ((i * 37) % 19) / 19 * 2.3
    const s = 0.55 + ((i * 13) % 7) / 10
    m.scale.setScalar(s)
    m.userData = { r, a, y, speed: 0.06 + (i % 5) * 0.012, spin: 0.3 + (i % 3) * 0.25, phase: i * 1.7 }
    world.add(m)
    leaves.push(m)
  }

  // soft round contact shadow (radial gradient texture)
  const sc = document.createElement('canvas'); sc.width = sc.height = 128
  const sg = sc.getContext('2d'); const grd = sg.createRadialGradient(64, 64, 4, 64, 64, 64)
  grd.addColorStop(0, 'rgba(9,56,46,0.35)'); grd.addColorStop(1, 'rgba(9,56,46,0)')
  sg.fillStyle = grd; sg.fillRect(0, 0, 128, 128)
  const shadow = new THREE.Mesh(new THREE.PlaneGeometry(3.2, 1.1), new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(sc), transparent: true, depthWrite: false }))
  shadow.rotation.x = -Math.PI / 2
  shadow.position.y = -1.32
  scene.add(shadow)

  // --- interaction + loop
  let tx = 0, ty = 0, cx = 0, cy = 0, raf = 0, running = false
  const clock = new THREE.Clock()
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches

  const resize = () => {
    const w = canvas.clientWidth, h = canvas.clientHeight
    if (!w || !h) return
    renderer.setSize(w, h, false)
    camera.aspect = w / h
    camera.position.z = w < 420 ? 9 : 8.1
    camera.updateProjectionMatrix()
  }
  const frame = () => {
    const t = clock.getElapsedTime()
    cx += (tx - cx) * 0.05; cy += (ty - cy) * 0.05
    bag.rotation.y = Math.sin(t * 0.45) * 0.32 + cx * 0.35 - 0.25
    bag.rotation.x = cy * 0.12
    bag.position.y = Math.sin(t * 0.9) * 0.06
    shadow.scale.setScalar(1 - Math.sin(t * 0.9) * 0.04)
    world.rotation.y = cx * 0.15
    for (const l of leaves) {
      const u = l.userData
      const a = u.a + t * u.speed
      l.position.set(Math.cos(a) * u.r, u.y + Math.sin(t * 0.7 + u.phase) * 0.18, Math.sin(a) * u.r * 0.75)
      l.rotation.set(Math.sin(t * u.spin + u.phase) * 0.6, a * 1.5 + u.phase, Math.cos(t * u.spin * 0.8 + u.phase) * 0.5)
    }
    renderer.render(scene, camera)
  }
  const loop = () => { frame(); raf = running ? requestAnimationFrame(loop) : 0 }
  const start = () => { if (reduce) { frame(); return } if (!running) { running = true; clock.start(); raf = requestAnimationFrame(loop) } }
  const stop = () => { running = false; cancelAnimationFrame(raf); raf = 0 }

  const onPointer = (e) => {
    const r = canvas.getBoundingClientRect()
    tx = Math.max(-1, Math.min(1, ((e.clientX - r.left) / r.width) * 2 - 1))
    ty = Math.max(-1, Math.min(1, ((e.clientY - r.top) / r.height) * 2 - 1))
  }
  const onTilt = (e) => { if (e.gamma != null) { tx = Math.max(-1, Math.min(1, e.gamma / 35)); ty = Math.max(-1, Math.min(1, (e.beta - 45) / 35)) } }
  window.addEventListener('pointermove', onPointer, { passive: true })
  window.addEventListener('deviceorientation', onTilt, { passive: true })
  const ro = new ResizeObserver(resize); ro.observe(canvas)
  const io = new IntersectionObserver(([e]) => (e.isIntersecting ? start() : stop()))
  io.observe(canvas)
  resize(); frame()

  return () => {
    stop(); ro.disconnect(); io.disconnect()
    window.removeEventListener('pointermove', onPointer); window.removeEventListener('deviceorientation', onTilt)
    scene.traverse((o) => { o.geometry?.dispose?.(); const m = o.material; (Array.isArray(m) ? m : [m]).forEach((x) => { x?.map?.dispose?.(); x?.dispose?.() }) })
    envTex.dispose(); pmrem.dispose(); renderer.dispose()
  }
}
