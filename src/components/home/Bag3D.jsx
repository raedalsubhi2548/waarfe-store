import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

/** Lazy-loads Three.js and mounts the bag scene; shows a soft static fallback until ready. */
export default function Bag3D({ className }) {
  const canvas = useRef(null)
  const [ready, setReady] = useState(false)
  const [failed, setFailed] = useState(false)
  useEffect(() => {
    let dispose, alive = true
    const go = () => import('./bagScene.js').then(({ createBagScene }) => {
      if (!alive || !canvas.current) return
      try { dispose = createBagScene(canvas.current, { onReady: () => alive && setReady(true) }) } catch { setFailed(true) }
    }).catch(() => setFailed(true))
    const id = 'requestIdleCallback' in window ? requestIdleCallback(go, { timeout: 1200 }) : setTimeout(go, 300)
    return () => { alive = false; dispose?.(); 'cancelIdleCallback' in window ? cancelIdleCallback(id) : clearTimeout(id) }
  }, [])
  return (
    <div className={cn('relative', className)} role="img" aria-label="حقيبة تسوّق منصة رائد ثلاثية الأبعاد تحيط بها أوراق ذهبية وخضراء">
      <div className={cn('absolute inset-0 grid place-items-center transition-opacity duration-700', ready && !failed ? 'opacity-0' : 'opacity-100')} aria-hidden="true">
        <span className="grid size-44 place-items-center rounded-full bg-background shadow-[0_30px_80px_-30px_color-mix(in_srgb,var(--p-green-900)_45%,transparent)] ring-1 ring-accent/50 sm:size-56">
          <img src="/logo.png" alt="" className="w-1/2" />
        </span>
      </div>
      {!failed && <canvas ref={canvas} className={cn('absolute inset-0 size-full transition-opacity duration-1000', ready ? 'opacity-100' : 'opacity-0')} />}
    </div>
  )
}
