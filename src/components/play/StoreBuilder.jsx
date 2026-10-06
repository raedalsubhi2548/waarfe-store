import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, MessageCircle, Search, ShoppingBag, Menu, Sparkles, Shirt, Coffee, Smartphone, Gem, Star } from 'lucide-react'
import { cn } from '@/lib/utils'
import { waLink } from '@/lib/format.js'

const PALETTES = [
  { id: 'waarfe', name: 'أخضر وارف', bg: '#fefbf2', ink: '#09382e', brand: '#09382e', soft: '#e7efe9', pop: '#d7c676' },
  { id: 'night', name: 'ليلي', bg: '#0f1222', ink: '#f2f0ff', brand: '#8b7cf6', soft: '#1c2140', pop: '#f5c2e7' },
  { id: 'rose', name: 'وردي ناعم', bg: '#fff6f6', ink: '#5a2734', brand: '#c7546f', soft: '#fde3e6', pop: '#f2b5c0' },
  { id: 'sand', name: 'رملي', bg: '#f7efe3', ink: '#4a3523', brand: '#a8703c', soft: '#ecdcc4', pop: '#d9a066' },
  { id: 'noir', name: 'أسود فخم', bg: '#111111', ink: '#f5f5f5', brand: '#f5f5f5', soft: '#1f1f1f', pop: '#c8a24a' },
]
const KINDS = [
  { id: 'perfume', name: 'عطور', icon: Sparkles },
  { id: 'fashion', name: 'أزياء', icon: Shirt },
  { id: 'coffee', name: 'قهوة', icon: Coffee },
  { id: 'tech', name: 'إلكترونيات', icon: Smartphone },
  { id: 'jewel', name: 'مجوهرات', icon: Gem },
]
const SHAPES = [
  { id: 'soft', name: 'ناعم', r: 18 },
  { id: 'sharp', name: 'حاد', r: 2 },
  { id: 'round', name: 'دائري', r: 999 },
]

/** The phone that shows the store the visitor is "building". Tilts toward the pointer. */
function Phone({ pal, kind, shape, name }) {
  const ref = useRef(null)
  const Ico = KINDS.find((k) => k.id === kind).icon
  const r = SHAPES.find((s) => s.id === shape).r
  const tile = Math.min(r, 16)
  const onMove = (e) => {
    const el = ref.current; if (!el) return
    const b = el.getBoundingClientRect()
    const x = (e.clientX - b.left) / b.width - 0.5, y = (e.clientY - b.top) / b.height - 0.5
    el.style.setProperty('--ry', `${x * 16}deg`); el.style.setProperty('--rx', `${-y * 12}deg`)
  }
  const onLeave = () => { ref.current?.style.setProperty('--ry', '-8deg'); ref.current?.style.setProperty('--rx', '4deg') }
  return (
    <div className="[perspective:1200px]" onPointerMove={onMove} onPointerLeave={onLeave}>
      <div ref={ref} style={{ '--ry': '-8deg', '--rx': '4deg' }}
        className="relative mx-auto w-[min(58vw,290px)] rounded-[44px] bg-[#0b0f0d] p-[10px] shadow-[0_60px_100px_-40px_rgb(0_0_0/0.8),inset_0_0_0_1.5px_rgb(255_255_255/0.12)] transition-transform duration-500 ease-out [transform:rotateY(var(--ry))_rotateX(var(--rx))] [transform-style:preserve-3d]">
        <div className="relative aspect-[9/19] overflow-hidden rounded-[35px] transition-colors duration-700" style={{ background: pal.bg, color: pal.ink }}>
          <span className="absolute top-2 left-1/2 z-10 h-5 w-20 -translate-x-1/2 rounded-full bg-black" />
          {/* store header */}
          <div className="flex items-center justify-between px-4 pt-10 pb-2">
            <Menu className="size-4 opacity-70" />
            <b className="max-w-[60%] truncate text-[15px] font-bold transition-colors duration-700" style={{ color: pal.brand }}>{name || 'متجرك'}</b>
            <span className="flex gap-2 opacity-70"><Search className="size-4" /><ShoppingBag className="size-4" /></span>
          </div>
          {/* banner */}
          <div className="mx-3 mt-1 flex h-[26%] items-center justify-between overflow-hidden px-4 transition-[background-color,border-radius] duration-700" style={{ background: pal.brand, borderRadius: tile, color: pal.bg }}>
            <span>
              <span className="block text-[10px] opacity-80">وصل حديثاً</span>
              <b className="block text-[15px] leading-tight">تشكيلة {KINDS.find((k) => k.id === kind).name}</b>
              <span className="mt-2 inline-block px-3 py-1 text-[9px] font-semibold transition-[border-radius] duration-700" style={{ background: pal.bg, color: pal.brand, borderRadius: r }}>تسوّق الآن</span>
            </span>
            <Ico key={kind} className="size-14 opacity-90 motion-safe:animate-[pop-in_600ms_cubic-bezier(.34,1.56,.64,1)]" strokeWidth={1.2} />
          </div>
          {/* chips */}
          <div className="mt-3 flex gap-1.5 overflow-hidden px-3">
            {['الكل', 'الأكثر طلباً', 'جديد'].map((c, i) => (
              <span key={c} className="shrink-0 px-2.5 py-1 text-[9px] transition-[border-radius,background-color] duration-700" style={{ borderRadius: r, background: i ? pal.soft : pal.ink, color: i ? pal.ink : pal.bg }}>{c}</span>
            ))}
          </div>
          {/* products */}
          <div className="mt-3 grid grid-cols-2 gap-2 px-3">
            {[0, 1, 2, 3].map((i) => (
              <div key={`${kind}-${i}`} className="motion-safe:animate-[pop-in_500ms_cubic-bezier(.34,1.56,.64,1)_both]" style={{ animationDelay: `${i * 70}ms` }}>
                <div className="grid aspect-square place-items-center transition-[background-color,border-radius] duration-700" style={{ background: pal.soft, borderRadius: tile }}>
                  <Ico className="size-8" strokeWidth={1.2} style={{ color: i % 2 ? pal.pop : pal.brand }} />
                </div>
                <div className="mt-1 h-1.5 w-3/4 rounded-full opacity-25" style={{ background: pal.ink }} />
                <div className="mt-1 flex items-center justify-between">
                  <span className="h-1.5 w-1/3 rounded-full" style={{ background: pal.brand }} />
                  <span className="flex" style={{ color: pal.pop }}>{[0, 1, 2].map((k) => <Star key={k} className="size-2" fill="currentColor" strokeWidth={0} />)}</span>
                </div>
              </div>
            ))}
          </div>
          {/* bottom bar */}
          <div className="absolute inset-x-3 bottom-3 py-2.5 text-center text-[11px] font-semibold transition-[background-color,border-radius] duration-700" style={{ background: pal.brand, color: pal.bg, borderRadius: r }}>إتمام الطلب</div>
          <span className="pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,rgb(255_255_255/0.18),transparent_40%)]" />
        </div>
      </div>
    </div>
  )
}

const Chip = ({ on, onClick, children, className }) => (
  <button type="button" onClick={onClick} aria-pressed={on}
    className={cn('inline-flex h-10 items-center gap-2 rounded-full px-4 text-[14px] font-medium transition-[background-color,color,box-shadow,scale] duration-300 active:scale-95', on ? 'bg-background text-primary shadow-[0_10px_24px_-12px_rgb(0_0_0/0.7)]' : 'bg-white/[0.07] text-on-inverse/85 ring-1 ring-white/15 hover:bg-white/[0.12]', className)}>
    {children}
  </button>
)

/** Hero: the visitor plays with a store before ordering one, then sends their picks to us on WhatsApp. */
export default function StoreBuilder() {
  const [name, setName] = useState('')
  const [palId, setPal] = useState('waarfe')
  const [kind, setKind] = useState('perfume')
  const [shape, setShape] = useState('soft')
  const pal = PALETTES.find((p) => p.id === palId)
  const roll = () => {
    const pick = (a) => a[Math.floor(Math.random() * a.length)].id
    setPal(pick(PALETTES)); setKind(pick(KINDS)); setShape(pick(SHAPES))
  }
  const msg = `السلام عليكم، جرّبت مصمم المتجر في موقع وارف وأبي متجر بهالذوق:
- اسم المتجر: ${name || 'لم أحدده'}
- النشاط: ${KINDS.find((k) => k.id === kind).name}
- الألوان: ${pal.name}
- الشكل: ${SHAPES.find((s) => s.id === shape).name}`

  return (
    <section className="relative -mt-[var(--header-height)] isolate overflow-hidden bg-[#062a22] text-on-inverse">
      {/* living backdrop: colour of the chosen palette glows behind the phone */}
      <span className="absolute -z-10 size-[620px] rounded-full opacity-40 blur-[110px] transition-colors duration-1000 max-lg:top-[48%] max-lg:left-1/2 max-lg:-translate-x-1/2 lg:top-[18%] lg:left-[8%]" style={{ background: pal.brand === '#09382e' ? '#2f8a6d' : pal.brand }} aria-hidden="true" />
      <span className="absolute top-[-20%] right-[-10%] -z-10 size-[520px] rounded-full bg-[#14604c] opacity-50 blur-[120px]" aria-hidden="true" />
      <img src="/brand/ai/waarfe-hero.webp" alt="" className="absolute inset-0 -z-20 size-full object-cover opacity-[0.18] mix-blend-luminosity" aria-hidden="true" />

      <div className="container-w grid items-center gap-x-6 gap-y-8 pt-[calc(var(--header-height)+56px)] pb-16 lg:grid-cols-[1.1fr_1fr] lg:pt-[calc(var(--header-height)+40px)] lg:pb-24">
        <div className="text-center lg:col-start-1 lg:row-start-1 lg:self-end lg:text-start">
          <p className="inline-flex items-center gap-2 rounded-full bg-white/[0.07] px-3.5 py-1.5 text-[13px] text-on-inverse/80 ring-1 ring-white/10"><Sparkles className="size-4" />جرّب بنفسك، قبل لا تطلب</p>
          <h1 className="mt-5 font-display text-[2.3rem] font-bold leading-[1.35] sm:text-[3rem] lg:text-[3.5rem] lg:leading-[1.3]">
            <span className="block">العب بمتجرك</span>
            <span className="block font-light text-[#efe7cf]">قبل لا نبنيه لك</span>
          </h1>
          <p className="mx-auto mt-4 max-w-[38ch] text-[16.5px] leading-[1.9] text-on-inverse/75 lg:mx-0">اكتب اسم متجرك واختر الألوان والشكل، وشوف الجوال يتغيّر قدامك. وبعدها نصممه لك فعلياً في سلة.</p>
        </div>

        <div className="relative lg:col-start-2 lg:row-span-2 lg:row-start-1">
          <Phone pal={pal} kind={kind} shape={shape} name={name} />
          <p className="mt-4 text-center text-[12.5px] text-on-inverse/50">معاينة تقريبية للعب، التصميم الفعلي نسويه لك على مقاسك.</p>
        </div>

        <div className="text-center lg:col-start-1 lg:row-start-2 lg:self-start lg:text-start">

          <div className="mx-auto grid max-w-xl gap-4 text-start lg:mx-0">
            <label className="block">
              <span className="mb-2 block text-[13px] text-on-inverse/60">اسم متجرك</span>
              <input value={name} onChange={(e) => setName(e.target.value.slice(0, 22))} placeholder="اكتب الاسم هنا"
                className="h-12 w-full rounded-2xl bg-white/[0.08] px-4 text-[16px] text-on-inverse ring-1 ring-white/15 outline-none placeholder:text-on-inverse/40 focus:ring-2 focus:ring-[#efe7cf]/70" />
            </label>
            <div>
              <span className="mb-2 block text-[13px] text-on-inverse/60">الألوان</span>
              <div className="flex flex-wrap gap-2">
                {PALETTES.map((p) => (
                  <Chip key={p.id} on={p.id === palId} onClick={() => setPal(p.id)}>
                    <span className="flex -space-x-1.5 rtl:space-x-reverse">{[p.brand, p.bg, p.pop].map((c) => <span key={c} className="size-4 rounded-full ring-2 ring-black/10" style={{ background: c }} />)}</span>{p.name}
                  </Chip>
                ))}
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-[1.4fr_1fr]">
              <div>
                <span className="mb-2 block text-[13px] text-on-inverse/60">نشاطك</span>
                <div className="flex flex-wrap gap-2">{KINDS.map(({ id, name: n, icon: I }) => <Chip key={id} on={id === kind} onClick={() => setKind(id)}><I className="size-4" />{n}</Chip>)}</div>
              </div>
              <div>
                <span className="mb-2 block text-[13px] text-on-inverse/60">الشكل</span>
                <div className="flex flex-wrap gap-2">{SHAPES.map((s) => <Chip key={s.id} on={s.id === shape} onClick={() => setShape(s.id)}>{s.name}</Chip>)}</div>
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-3 lg:justify-start">
            <a href={waLink(msg)} target="_blank" rel="noreferrer" className="inline-flex h-12 items-center gap-2 rounded-full bg-background px-6 text-[15px] font-semibold text-primary shadow-[0_16px_34px_-14px_rgb(0_0_0/0.7)] transition-transform hover:-translate-y-0.5">
              <MessageCircle className="size-[18px]" />أرسل لنا تصميمك
            </a>
            <Link to="/p/salla-store-design" className="inline-flex h-12 items-center gap-2 rounded-full px-6 text-[15px] font-medium text-on-inverse ring-1 ring-white/30 transition-colors hover:bg-white/10">
              اطلب تصميم متجرك<ArrowLeft className="size-4" />
            </Link>
            <button type="button" onClick={roll} className="inline-flex h-12 items-center gap-2 rounded-full px-4 text-[14px] text-on-inverse/70 transition-colors hover:text-on-inverse">
              <Sparkles className="size-4" />فاجئني
            </button>
          </div>
        </div>
      </div>
      <span className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-[linear-gradient(transparent,#062a22)]" aria-hidden="true" />
    </section>
  )
}
