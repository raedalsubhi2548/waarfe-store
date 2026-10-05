import { useState } from 'react'
import { cn } from '@/lib/utils'
import { pdfThumb } from '@/data/work.js'

/**
 * A phone mockup showing a slice of a delivered store (tall PDF page).
 * `at` = where the screen starts, as % of the page height (skips blank margins).
 * `drift` = slow scroll inside a safe window so the screen never runs out.
 * `scrollOnHover` = scroll the whole store when hovered (work page).
 */
export default function Phone({ pdfId, at = 3, drift = 5, size = 420, scrollOnHover = false, eager = false, className, glare = true }) {
  const [ready, setReady] = useState(false)
  return (
    <div className={cn('rounded-[clamp(18px,13%,30px)] bg-[#0a241e] p-[4.5%] shadow-[0_30px_60px_-24px_rgb(5_30_25/0.8)] ring-1 ring-black/30', className)}>
      <div className="relative aspect-[9/19.5] overflow-hidden rounded-[clamp(13px,10%,24px)] bg-gradient-to-b from-[#e9e3cf] to-[#d8cfae] [container-type:size]">
        {!ready && <span className="absolute inset-0 animate-pulse bg-gradient-to-b from-transparent via-white/30 to-transparent" />}
        <img
          src={pdfThumb(pdfId, size)} alt="" decoding="async" loading={eager ? 'eager' : 'lazy'} draggable="false"
          onLoad={() => setReady(true)}
          className={cn('w-full select-none transition-opacity duration-700',
            ready ? 'opacity-100' : 'opacity-0',
            scrollOnHover ? 'transition-[translate,opacity] duration-[10s,700ms] ease-in-out [translate:0_-2.6%] group-hover:[translate:0_calc(-97.5%+100cqh)] group-focus-visible:[translate:0_calc(-97.5%+100cqh)]'
              : drift ? 'motion-safe:animate-[drift_var(--dd)_ease-in-out_infinite_alternate]' : '')}
          style={scrollOnHover ? undefined : { translate: `0 -${at}%`, '--from': `-${at}%`, '--to': `-${at + drift}%`, '--dd': `${14 + drift * 2}s` }}
        />
        <span className="absolute top-[2.2%] left-1/2 h-[3%] w-[32%] -translate-x-1/2 rounded-full bg-[#0a241e]" />
        {glare && <span className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,rgb(255_255_255/0.22),transparent_35%)]" />}
      </div>
    </div>
  )
}
