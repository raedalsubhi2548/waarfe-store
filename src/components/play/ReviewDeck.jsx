import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, ChevronLeft, ChevronRight, Quote, Star, Hand } from 'lucide-react'
import { ALL_REVIEWS } from '@/data/reviews.js'

const DECK = ALL_REVIEWS.filter((r) => r.text.length < 220)
const TILT = [0, -4, 3.5, -2]

/** Real reviews as a deck of cards: drag the top one away (or use the arrows) to see the next. */
export default function ReviewDeck() {
  const [i, setI] = useState(0)
  const [drag, setDrag] = useState(0)
  const [fly, setFly] = useState(0)
  const start = useRef(null)
  const next = (dir = -1) => {
    setFly(dir)
    setTimeout(() => { setFly(0); setDrag(0); setI((x) => (x + 1) % DECK.length) }, 280)
  }
  const prev = () => setI((x) => (x - 1 + DECK.length) % DECK.length)
  const down = (e) => { start.current = e.clientX; e.currentTarget.setPointerCapture(e.pointerId) }
  const move = (e) => { if (start.current != null) setDrag(e.clientX - start.current) }
  const up = () => {
    if (start.current == null) return
    start.current = null
    if (Math.abs(drag) > 90) next(Math.sign(drag)); else setDrag(0)
  }
  const cards = [0, 1, 2, 3].map((k) => DECK[(i + k) % DECK.length])

  return (
    <section className="relative overflow-hidden py-16 sm:py-24" aria-labelledby="deck-title">
      <div className="container-w grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="text-center lg:text-start">
          <p className="text-[13.5px] font-medium text-primary/60">من متجرنا في سلة</p>
          <h2 id="deck-title" className="mt-1 font-display text-[1.75rem] font-bold leading-[1.45] text-primary sm:text-display-md">وش قالوا عن وارف</h2>
          <p className="mx-auto mt-3 max-w-sm text-[15px] leading-7 text-muted-foreground lg:mx-0">{ALL_REVIEWS.length} تقييم حقيقي منشور في متجرنا على سلة. اسحب البطاقة يمين أو يسار وشوف اللي بعدها.</p>
          <div className="mt-6 flex items-center justify-center gap-3 lg:justify-start">
            <button type="button" onClick={prev} aria-label="السابق" className="grid size-12 place-items-center rounded-full bg-[#fffdf7] text-primary shadow-[0_10px_24px_-14px_rgb(9_56_46/0.7)] ring-1 ring-primary/10 transition-transform active:scale-90"><ChevronRight className="size-5" /></button>
            <span className="tabular min-w-16 text-center text-[14px] text-primary/70">{i + 1} / {DECK.length}</span>
            <button type="button" onClick={() => next(-1)} aria-label="التالي" className="grid size-12 place-items-center rounded-full bg-primary text-on-inverse shadow-[0_10px_24px_-14px_rgb(9_56_46/0.9)] transition-transform active:scale-90"><ChevronLeft className="size-5" /></button>
          </div>
          <Link to="/reviews" className="mt-6 inline-flex items-center gap-2 text-[14px] font-medium text-primary underline-offset-4 hover:underline">كل الآراء<ArrowLeft className="size-4" /></Link>
        </div>

        <div className="relative mx-auto h-[330px] w-full max-w-[420px] select-none sm:h-[300px]" aria-live="polite">
          {cards.slice().reverse().map((r, rk) => {
            const k = 3 - rk
            const top = k === 0
            const x = top ? (fly ? fly * 520 : drag) : 0
            return (
              <figure key={`${(i + k) % DECK.length}`}
                onPointerDown={top ? down : undefined} onPointerMove={top ? move : undefined} onPointerUp={top ? up : undefined} onPointerCancel={top ? up : undefined}
                className={`absolute inset-0 flex flex-col rounded-[26px] bg-[#fffdf7] p-6 shadow-[0_1px_2px_rgb(9_56_46/0.06),0_30px_50px_-30px_rgb(9_56_46/0.6)] ring-1 ring-primary/[0.07] ${top ? 'cursor-grab touch-pan-y active:cursor-grabbing' : ''}`}
                style={{
                  transform: `translateX(${x}px) translateY(${k * 10}px) rotate(${top ? TILT[0] + x / 18 : TILT[k]}deg) scale(${1 - k * 0.04})`,
                  transition: start.current != null && top ? 'none' : 'transform 450ms cubic-bezier(.34,1.56,.64,1), opacity 300ms',
                  opacity: top && fly ? 0 : 1, zIndex: 10 - k,
                }}>
                <div className="flex items-center justify-between">
                  <span className="flex gap-0.5 text-[#c9a94a]">{[0, 1, 2, 3, 4].map((s) => <Star key={s} className="size-4" fill="currentColor" strokeWidth={0} />)}</span>
                  <Quote className="size-7 text-primary/15" />
                </div>
                <blockquote className="mt-4 line-clamp-6 flex-1 text-[15.5px] leading-8 text-foreground">{r.text}</blockquote>
                <figcaption className="mt-4 flex items-center gap-3 border-t border-dashed border-primary/15 pt-4">
                  <span className="grid size-10 place-items-center rounded-full bg-primary text-[15px] font-semibold text-on-inverse">{r.name.charAt(0)}</span>
                  <span><b className="block text-[14px] text-primary">{r.name}</b>{r.city && <span className="text-[12.5px] text-muted-foreground">{r.city}</span>}</span>
                  {top && <Hand className="ms-auto size-5 text-primary/25 motion-safe:animate-[nudge_2.4s_ease-in-out_infinite]" aria-hidden="true" />}
                </figcaption>
              </figure>
            )
          })}
        </div>
      </div>
    </section>
  )
}
