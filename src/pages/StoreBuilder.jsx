import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowLeft, ArrowRight, Check, Coffee, Droplet, Gem, Gift, Flower2, Smartphone, Shirt, Cake,
  Sparkles, Search, ShoppingBag, Menu, Heart, Star, Truck, ShieldCheck, Headphones, Upload, Monitor, Smartphone as Phone,
  RotateCcw, MessageCircle, Wand2, Palette, Type, LayoutTemplate, Store, Layers, X,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { waLink } from '@/lib/format.js'

/* ------------------------------------------------------------------ data ------------------------------------------------------------------ */

// What the customer sells decides the sample categories and products (sample prices, clearly labelled as a preview).
const ACTIVITIES = [
  { id: 'perfume', label: 'عطور وبخور', icon: Droplet, hero: 'عطرك يحكي عنك', sub: 'تشكيلة فاخرة من العطور والبخور', cats: ['عطور رجالية', 'عطور نسائية', 'بخور', 'هدايا'], items: [['عطر عود ملكي', 289], ['مسك الطهارة', 89], ['بخور كمبودي', 149], ['طقم هدية فاخر', 399]] },
  { id: 'coffee', label: 'قهوة مختصة', icon: Coffee, hero: 'قهوتك بمزاجك', sub: 'محاصيل مختصة محمّصة بعناية', cats: ['محاصيل', 'قهوة سعودية', 'أدوات', 'كبسولات'], items: [['محصول إثيوبي', 75], ['قهوة سعودية شقراء', 55], ['دلة تقطير', 129], ['بكج المبتدئ', 199]] },
  { id: 'fashion', label: 'عبايات وأزياء', icon: Shirt, hero: 'أناقتك تبدأ من هنا', sub: 'تصاميم عصرية بلمسة محتشمة', cats: ['عبايات', 'جلابيات', 'طرح', 'جديدنا'], items: [['عباية كريب', 349], ['عباية مطرزة', 459], ['طرحة شيفون', 69], ['جلابية ناعمة', 259]] },
  { id: 'gifts', label: 'ورد وهدايا', icon: Flower2, hero: 'خلّ هديتك تتكلم', sub: 'تنسيقات ورد وهدايا لكل مناسبة', cats: ['باقات', 'بوكسات', 'شوكولاتة', 'مناسبات'], items: [['باقة جوري', 189], ['بوكس تخرج', 249], ['شوكولاتة فاخرة', 119], ['باقة مواليد', 219]] },
  { id: 'beauty', label: 'تجميل وعناية', icon: Sparkles, hero: 'جمالك يستاهل', sub: 'منتجات عناية أصلية ومختارة', cats: ['بشرة', 'شعر', 'مكياج', 'عروض'], items: [['سيروم فيتامين C', 129], ['ماسك ترطيب', 79], ['زيت شعر', 95], ['بكج عناية', 299]] },
  { id: 'tech', label: 'إلكترونيات', icon: Smartphone, hero: 'تقنية تسهّل يومك', sub: 'إكسسوارات وأجهزة بضمان', cats: ['جوالات', 'سماعات', 'شواحن', 'ساعات'], items: [['سماعة لاسلكية', 249], ['شاحن سريع', 89], ['ساعة ذكية', 399], ['باور بانك', 129]] },
  { id: 'sweets', label: 'حلويات ومخبوزات', icon: Cake, hero: 'حلا يفرّح القلب', sub: 'حلويات طازجة كل يوم', cats: ['كيك', 'حلا شرقي', 'كوكيز', 'طلبات خاصة'], items: [['كيكة شوكولاتة', 159], ['بوكس كوكيز', 69], ['كنافة', 89], ['صينية مشكلة', 199]] },
  { id: 'jewelry', label: 'مجوهرات وإكسسوار', icon: Gem, hero: 'لمعة تليق فيك', sub: 'قطع مختارة لكل إطلالة', cats: ['خواتم', 'عقود', 'أساور', 'أطقم'], items: [['خاتم فضة', 149], ['عقد ناعم', 199], ['سوار مطلي', 119], ['طقم كامل', 449]] },
]

const PALETTES = [
  { id: 'navy', name: 'كحلي ملكي', p: '#1b2b44', a: '#c3cedd', bg: '#f7f9fc' },
  { id: 'gold', name: 'أسود وذهبي', p: '#141414', a: '#c8a96a', bg: '#faf8f3' },
  { id: 'wine', name: 'عنابي', p: '#6b1d2a', a: '#e8c9b0', bg: '#fdf8f5' },
  { id: 'olive', name: 'زيتي', p: '#3d4a2a', a: '#d9c99a', bg: '#f8f7f1' },
  { id: 'rose', name: 'وردي ناعم', p: '#a24f70', a: '#f3d3df', bg: '#fff8fa' },
  { id: 'sea', name: 'بحري', p: '#0f5e6e', a: '#a8dadc', bg: '#f4fbfb' },
  { id: 'violet', name: 'بنفسجي', p: '#4b2a7a', a: '#d9c8f0', bg: '#faf8fd' },
  { id: 'coffee', name: 'بني قهوة', p: '#5a3a22', a: '#e6cfb3', bg: '#fbf7f2' },
]

// Two Salla theme looks (an approximate preview of each theme's character, not the theme itself).
const THEMES = [
  { id: 'raed', name: 'ثيم رايد', note: 'شعار بالنص، بنر عريض، أقسام دائرية', icon: LayoutTemplate },
  { id: 'aali', name: 'ثيم عالي', note: 'هيدر مرتب، بنر مقسوم، بطاقات راقية', icon: Layers },
]

const FONTS = [
  { id: 'plex', name: 'عصري', family: "'IBM Plex Sans Arabic', sans-serif" },
  { id: 'marhey', name: 'يدوي', family: "'Marhey', sans-serif" },
  { id: 'cairo', name: 'جريء', family: "'Cairo', sans-serif" },
  { id: 'tajawal', name: 'ناعم', family: "'Tajawal', sans-serif" },
  { id: 'amiri', name: 'كلاسيكي', family: "'Amiri', serif" },
]

const SECTIONS = [
  { id: 'bar', label: 'شريط إعلان علوي' },
  { id: 'cats', label: 'الأقسام' },
  { id: 'products', label: 'المنتجات' },
  { id: 'features', label: 'مميزات المتجر' },
  { id: 'reviews', label: 'آراء العملاء' },
]

const STEPS = [
  { id: 'name', title: 'سمّ متجرك', hint: 'الاسم اللي بيعرفك فيه عملاؤك', icon: Store },
  { id: 'activity', title: 'وش تبيع؟', hint: 'نجهّز لك الأقسام والمنتجات على نشاطك', icon: ShoppingBag },
  { id: 'colors', title: 'ألوان هويتك', hint: 'اختر لوحة ألوان أو لونك الخاص', icon: Palette },
  { id: 'theme', title: 'اختر الثيم', hint: 'شكل الواجهة على ثيمات سلة', icon: LayoutTemplate },
  { id: 'brand', title: 'الخط والشعار', hint: 'ارفع شعارك أو خلّ اسمك هو الشعار', icon: Type },
  { id: 'sections', title: 'رتّب واجهتك', hint: 'شغّل الأقسام اللي تبيها', icon: Layers },
]

const DEFAULT = { name: '', activity: 'perfume', palette: 'navy', custom: '', theme: 'raed', font: 'plex', logo: '', bar: 'شحن مجاني للطلبات فوق 200 ريال', sections: { bar: true, cats: true, products: true, features: true, reviews: true } }
const KEY = 'raed:builder'
const load = () => { try { return { ...DEFAULT, ...JSON.parse(localStorage.getItem(KEY) || '{}'), logo: '' } } catch { return DEFAULT } }

const STARS = Array.from({ length: 70 }, (_, i) => ({ l: (i * 37.7) % 100, t: (i * 53.3) % 100, s: 1 + (i % 3), d: 2 + (i % 5), w: (i % 7) * 0.6 }))

/* ------------------------------------------------------------------ preview ------------------------------------------------------------------ */

const tint = (hex, a) => { const n = parseInt(hex.slice(1), 16); return `rgb(${(n >> 16) & 255} ${(n >> 8) & 255} ${n & 255} / ${a})` }

/** The customer's store, drawn live: the basic blocks every Salla store has. */
function StorePreview({ cfg, wide, cart, onAdd }) {
  const act = ACTIVITIES.find((x) => x.id === cfg.activity) || ACTIVITIES[0]
  const pal = PALETTES.find((x) => x.id === cfg.palette) || PALETTES[0]
  const P = cfg.custom || pal.p, A = cfg.custom ? tint(cfg.custom, 0.22) : pal.a, BG = pal.bg
  const font = (FONTS.find((f) => f.id === cfg.font) || FONTS[0]).family
  const name = cfg.name.trim() || 'متجرك'
  const Icon = act.icon
  const aali = cfg.theme === 'aali'
  const s = cfg.sections

  const Logo = ({ light }) => cfg.logo
    ? <img src={cfg.logo} alt="" className={cn('w-auto object-contain', wide ? 'h-9' : 'h-7')} />
    : <span className={cn('font-bold leading-none', wide ? 'text-[22px]' : 'text-[17px]')} style={{ color: light ? '#fff' : P }}>{name}</span>

  return (
    <div dir="rtl" className="min-h-full text-[#222]" style={{ background: BG, fontFamily: font }}>
      {s.bar && cfg.bar && <div key={'bar' + cfg.bar} className="sb-pop py-1.5 text-center text-[10.5px] font-medium text-white" style={{ background: P }}>{cfg.bar}</div>}

      {/* header */}
      <div key={'h' + cfg.theme + cfg.logo + name} className="sb-pop sticky top-0 z-10 border-b bg-white/95 backdrop-blur" style={{ borderColor: tint(P, 0.08) }}>
        {aali ? (
          <div className={cn('flex items-center gap-3', wide ? 'px-6 py-3' : 'px-3 py-2.5')}>
            <Logo />
            {wide && <nav className="ms-6 flex gap-5 text-[12px] text-[#555]">{['الرئيسية', ...act.cats.slice(0, 3)].map((c) => <span key={c}>{c}</span>)}</nav>}
            <span className="ms-auto flex items-center gap-3" style={{ color: P }}><Search className="size-4" /><Heart className="size-4" />
              <span className="relative"><ShoppingBag className="size-4" /><b key={cart} className="sb-bump absolute -top-2 -end-2 grid size-4 place-items-center rounded-full text-[9px] text-white" style={{ background: P }}>{cart}</b></span>
              {!wide && <Menu className="size-4" />}</span>
          </div>
        ) : (
          <div className={cn('grid grid-cols-[1fr_auto_1fr] items-center', wide ? 'px-6 py-3' : 'px-3 py-2.5')}>
            <span style={{ color: P }}><Menu className="size-4" /></span>
            <Logo />
            <span className="flex items-center justify-end gap-3" style={{ color: P }}><Search className="size-4" />
              <span className="relative"><ShoppingBag className="size-4" /><b key={cart} className="sb-bump absolute -top-2 -end-2 grid size-4 place-items-center rounded-full text-[9px] text-white" style={{ background: P }}>{cart}</b></span></span>
          </div>
        )}
      </div>

      {/* hero banner */}
      <div key={'hero' + cfg.theme + act.id + P} className={cn('sb-pop', wide ? 'p-5' : 'p-3')}>
        {aali ? (
          <div className={cn('grid items-center overflow-hidden rounded-2xl', wide ? 'grid-cols-2' : 'grid-cols-1')} style={{ background: tint(P, 0.06) }}>
            <div className={cn(wide ? 'p-8' : 'p-5')}>
              <span className="text-[10px] font-semibold" style={{ color: P }}>جديد {name}</span>
              <h3 className={cn('mt-1 font-bold leading-snug', wide ? 'text-[28px]' : 'text-[20px]')} style={{ color: P }}>{act.hero}</h3>
              <p className="mt-1 text-[11px] text-[#666]">{act.sub}</p>
              <span className="mt-4 inline-block rounded-full px-4 py-1.5 text-[11px] font-semibold text-white" style={{ background: P }}>تسوّق الآن</span>
            </div>
            <div className={cn('grid place-items-center', wide ? 'h-56' : 'h-36')} style={{ background: `linear-gradient(135deg, ${P}, ${tint(P, 0.7)})` }}>
              <Icon className={cn('text-white/90', wide ? 'size-24' : 'size-16')} strokeWidth={1.2} />
            </div>
          </div>
        ) : (
          <div className={cn('relative grid place-items-center overflow-hidden rounded-2xl text-center text-white', wide ? 'h-60' : 'h-44')} style={{ background: `radial-gradient(120% 90% at 50% 0%, ${tint(P, 0.75)}, ${P})` }}>
            <Icon className="absolute -start-6 -bottom-6 size-40 text-white/10" strokeWidth={1} />
            <Icon className="absolute -end-4 top-3 size-20 text-white/10" strokeWidth={1} />
            <div className="relative px-4">
              <h3 className={cn('font-bold', wide ? 'text-[30px]' : 'text-[21px]')}>{act.hero}</h3>
              <p className="mt-1 text-[11px] text-white/80">{act.sub}</p>
              <span className="mt-4 inline-block rounded-full bg-white px-4 py-1.5 text-[11px] font-semibold" style={{ color: P }}>تسوّق الآن</span>
            </div>
          </div>
        )}
      </div>

      {/* categories */}
      {s.cats && (
        <div key={'cats' + cfg.theme + act.id + P} className={cn('sb-pop', wide ? 'px-5 pb-4' : 'px-3 pb-3')}>
          <h4 className="mb-3 text-[13px] font-bold" style={{ color: P }}>الأقسام</h4>
          <div className={cn('grid gap-3', wide ? 'grid-cols-4' : 'grid-cols-4')}>
            {act.cats.map((c) => (
              <div key={c} className="text-center">
                <span className={cn('mx-auto grid place-items-center', aali ? (wide ? 'aspect-[5/3] w-full rounded-xl' : 'aspect-square w-full rounded-xl') : (wide ? 'aspect-square w-[62%] rounded-full' : 'aspect-square w-[88%] rounded-full'))} style={{ background: tint(P, aali ? 0.07 : 0.1), color: P }}>
                  <Icon className={cn(wide ? 'size-7' : 'size-5')} strokeWidth={1.5} />
                </span>
                <span className="mt-1.5 block text-[10px] text-[#444]">{c}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* products */}
      {s.products && (
        <div key={'pr' + cfg.theme + act.id + P} className={cn('sb-pop', wide ? 'px-5 pb-5' : 'px-3 pb-4')}>
          <div className="mb-3 flex items-center justify-between"><h4 className="text-[13px] font-bold" style={{ color: P }}>الأكثر مبيعاً</h4><span className="text-[10px] text-[#888]">عرض الكل</span></div>
          <div className={cn('grid gap-3', wide ? 'grid-cols-4' : 'grid-cols-2')}>
            {act.items.map(([n, price], i) => (
              <div key={n} className={cn('overflow-hidden bg-white', aali ? 'rounded-xl ring-1' : 'rounded-2xl shadow-[0_8px_20px_-14px_rgb(0_0_0/0.35)]')} style={{ '--tw-ring-color': tint(P, 0.1) }}>
                <div className="relative grid aspect-square place-items-center" style={{ background: `linear-gradient(160deg, ${tint(P, 0.05)}, ${tint(P, 0.16)})` }}>
                  <Icon className="size-10" style={{ color: P }} strokeWidth={1.2} />
                  {i === 0 && <span className="absolute top-2 start-2 rounded-full px-2 py-0.5 text-[8.5px] font-semibold text-white" style={{ background: P }}>الأكثر طلباً</span>}
                  <Heart className="absolute top-2 end-2 size-3.5 text-[#999]" />
                </div>
                <div className="p-2.5">
                  <p className="truncate text-[11px] font-semibold text-[#333]">{n}</p>
                  <p className="mt-0.5 flex gap-px" style={{ color: '#f2b01e' }}>{[0, 1, 2, 3, 4].map((k) => <Star key={k} className="size-2.5" fill="currentColor" strokeWidth={0} />)}</p>
                  <div className="mt-1.5 flex items-center justify-between gap-1">
                    <b className="text-[11.5px]" style={{ color: P }}>{price} ر.س</b>
                    <button type="button" onClick={onAdd} className="rounded-full px-2 py-1 text-[9px] font-semibold text-white transition-transform active:scale-90" style={{ background: P }}>أضف للسلة</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* features */}
      {s.features && (
        <div key={'f' + P} className={cn('sb-pop grid grid-cols-3 gap-2', wide ? 'px-5 pb-5' : 'px-3 pb-4')}>
          {[[Truck, 'شحن سريع'], [ShieldCheck, 'دفع آمن'], [Headphones, 'دعم متواصل']].map(([I, t]) => (
            <div key={t} className="flex flex-col items-center gap-1 rounded-xl py-3 text-center" style={{ background: tint(P, 0.05) }}>
              <I className="size-4" style={{ color: P }} /><span className="text-[9.5px] font-medium text-[#444]">{t}</span>
            </div>
          ))}
        </div>
      )}

      {/* reviews */}
      {s.reviews && (
        <div key={'r' + P} className={cn('sb-pop', wide ? 'px-5 pb-5' : 'px-3 pb-4')}>
          <h4 className="mb-3 text-[13px] font-bold" style={{ color: P }}>آراء العملاء</h4>
          <div className={cn('grid gap-2', wide ? 'grid-cols-3' : 'grid-cols-1')}>
            {['تجربة رائعة وتوصيل سريع', 'جودة ممتازة وتغليف فخم', 'أكيد بطلب مرة ثانية'].slice(0, wide ? 3 : 2).map((t) => (
              <div key={t} className="rounded-xl bg-white p-3 ring-1" style={{ '--tw-ring-color': tint(P, 0.08) }}>
                <p className="flex gap-px" style={{ color: '#f2b01e' }}>{[0, 1, 2, 3, 4].map((k) => <Star key={k} className="size-2.5" fill="currentColor" strokeWidth={0} />)}</p>
                <p className="mt-1 text-[10.5px] text-[#444]">«{t}»</p>
                <p className="mt-1 text-[9px] text-[#999]">عميل {name}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* footer */}
      <div key={'ft' + P + name} className={cn('sb-pop text-white', wide ? 'px-6 py-6' : 'px-4 py-5')} style={{ background: P }}>
        <div className={cn('flex gap-4', wide ? 'items-start justify-between' : 'flex-col items-center text-center')}>
          <div><Logo light /><p className="mt-2 max-w-[26ch] text-[10px] text-white/70">{act.sub}</p></div>
          <div className="flex flex-wrap justify-center gap-1.5">{['مدى', 'Apple Pay', 'Visa', 'تمارا', 'تابي'].map((m) => <span key={m} className="rounded-md bg-white/95 px-1.5 py-0.5 text-[8.5px] font-semibold" style={{ color: P }}>{m}</span>)}</div>
        </div>
        <p className="mt-4 border-t border-white/15 pt-3 text-center text-[9px] text-white/60">جميع الحقوق محفوظة لـ{name}</p>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ page ------------------------------------------------------------------ */

function Confetti({ run }) {
  const bits = useMemo(() => Array.from({ length: 60 }, (_, i) => ({ l: (i * 17.3) % 100, d: 1.6 + (i % 7) * 0.25, w: (i % 10) * 0.08, c: ['#ffffff', '#c3cedd', '#e9d8a6', '#9fb0c8'][i % 4], r: (i * 47) % 360 })), [])
  if (!run) return null
  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden" aria-hidden="true">
      {bits.map((b, i) => <span key={i} className="sb-confetti absolute -top-4 h-3 w-1.5 rounded-sm" style={{ left: `${b.l}%`, background: b.c, animationDuration: `${b.d}s`, animationDelay: `${b.w}s`, rotate: `${b.r}deg` }} />)}
    </div>
  )
}

export default function StoreBuilder() {
  const [stage, setStage] = useState('intro') // intro → portal → build → done
  const [step, setStep] = useState(0)
  const [cfg, setCfg] = useState(load)
  const [device, setDevice] = useState('mobile')
  const [cart, setCart] = useState(0)
  const [burst, setBurst] = useState(false)
  const panel = useRef(null)

  useEffect(() => { try { const { logo, ...rest } = cfg; localStorage.setItem(KEY, JSON.stringify(rest)) } catch { /* private mode */ } }, [cfg])
  // extra Arabic fonts just for this page
  useEffect(() => {
    const id = 'sb-fonts'
    if (document.getElementById(id)) return
    const l = document.createElement('link'); l.id = id; l.rel = 'stylesheet'
    l.href = 'https://fonts.googleapis.com/css2?family=Cairo:wght@500;700&family=Tajawal:wght@500;700&family=Amiri:wght@400;700&display=swap'
    document.head.appendChild(l)
  }, [])

  const set = (k, v) => setCfg((c) => ({ ...c, [k]: v }))
  const enter = () => { setStage('portal'); setTimeout(() => setStage('build'), 900) }
  const go = (d) => {
    const n = step + d
    if (n >= STEPS.length) { setStage('done'); setBurst(true); setTimeout(() => setBurst(false), 3600); return }
    setStep(Math.max(0, n))
    panel.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }
  const onLogo = (e) => {
    const f = e.target.files?.[0]
    if (!f || !/^image\/(png|jpe?g|webp|svg\+xml)$/.test(f.type) || f.size > 3e6) return
    if (cfg.logo) URL.revokeObjectURL(cfg.logo)
    set('logo', URL.createObjectURL(f)) // stays in the visitor's browser, nothing is uploaded
  }
  const restart = () => { setCfg({ ...DEFAULT }); setStep(0); setStage('build'); setCart(0) }

  const act = ACTIVITIES.find((x) => x.id === cfg.activity)
  const pal = PALETTES.find((x) => x.id === cfg.palette)
  const summary = `السلام عليكم، صممت متجري في صفحة «صمم متجرك» وأبي أنفّذه:
• اسم المتجر: ${cfg.name || '—'}
• النشاط: ${act?.label}
• الألوان: ${cfg.custom ? `لون خاص ${cfg.custom}` : pal?.name}
• الثيم: ${THEMES.find((t) => t.id === cfg.theme)?.name}
• الخط: ${FONTS.find((f) => f.id === cfg.font)?.name}
• الأقسام: ${SECTIONS.filter((x) => cfg.sections[x.id]).map((x) => x.label).join('، ')}`

  const preview = (
    <div className="relative mx-auto w-full">
      {/* device switch */}
      <div className="mb-3 flex justify-center sm:mb-4">
        <div className="inline-flex rounded-full bg-white/10 p-1 ring-1 ring-white/15 backdrop-blur" role="tablist" aria-label="نوع الجهاز">
          {[['mobile', 'جوال', Phone], ['desktop', 'كمبيوتر', Monitor]].map(([id, l, I]) => (
            <button key={id} type="button" role="tab" aria-selected={device === id} onClick={() => setDevice(id)}
              className={cn('flex h-9 items-center gap-1.5 rounded-full px-4 text-[13px] font-semibold transition-colors', device === id ? 'bg-white text-[#0f1a2c]' : 'text-white/75 hover:text-white')}><I className="size-4" />{l}</button>
          ))}
        </div>
      </div>
      {device === 'mobile' ? (
        <div className="sb-float mx-auto w-[min(62vw,300px)] rounded-[38px] lg:rounded-[44px] bg-[#0b1220] p-[10px] shadow-[0_40px_80px_-30px_rgb(0_0_0/0.9),0_0_0_1px_rgb(255_255_255/0.08),0_0_60px_-10px_rgb(159_176_200/0.35)]">
          <div className="relative h-[calc(52svh-170px)] min-h-[240px] overflow-hidden rounded-[30px] bg-white lg:h-[600px] lg:rounded-[36px]">
            <span className="absolute top-2 left-1/2 z-20 h-6 w-24 -translate-x-1/2 rounded-full bg-[#0b1220]" />
            <div className="h-full overflow-y-auto pt-8 [scrollbar-width:none]"><StorePreview cfg={cfg} cart={cart} onAdd={() => setCart((c) => c + 1)} /></div>
          </div>
        </div>
      ) : (
        <div className="sb-float mx-auto w-full max-w-[760px] overflow-hidden rounded-2xl bg-[#0b1220] shadow-[0_40px_80px_-30px_rgb(0_0_0/0.9),0_0_0_1px_rgb(255_255_255/0.08),0_0_60px_-10px_rgb(159_176_200/0.35)]">
          <div className="flex items-center gap-1.5 px-3 py-2"><span className="size-2.5 rounded-full bg-white/20" /><span className="size-2.5 rounded-full bg-white/20" /><span className="size-2.5 rounded-full bg-white/20" />
            <span className="mx-auto w-1/2 truncate rounded-md bg-white/10 px-3 py-0.5 text-center text-[10.5px] text-white/60" dir="ltr">{(cfg.name || 'store').trim().replace(/\s+/g, '-').toLowerCase()}.com</span></div>
          <div className="h-[calc(52svh-190px)] min-h-[220px] overflow-y-auto bg-white [scrollbar-width:thin] lg:h-[480px]"><StorePreview cfg={cfg} wide cart={cart} onAdd={() => setCart((c) => c + 1)} /></div>
        </div>
      )}
      <p className={cn('mt-3 text-center text-[11.5px] text-white/50 sm:mt-4 sm:text-[12px]', stage === 'build' && 'max-lg:hidden')}>معاينة تقريبية · جرّب «أضف للسلة» وشوف السلة تتحرك</p>
    </div>
  )

  return (
    <div className="relative isolate -mt-[var(--header-height)] overflow-hidden bg-[#070d18] text-white">
      {/* the world: stars, nebula glow, a perspective floor */}
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
        <span className="absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_10%,rgb(52_80_127/0.55),transparent),radial-gradient(40%_40%_at_10%_60%,rgb(91_70_150/0.25),transparent),radial-gradient(45%_40%_at_95%_70%,rgb(40_110_140/0.22),transparent)]" />
        {STARS.map((s, i) => <span key={i} className="sb-twinkle absolute rounded-full bg-white" style={{ left: `${s.l}%`, top: `${s.t}%`, width: s.s, height: s.s, animationDuration: `${s.d}s`, animationDelay: `${s.w}s` }} />)}
        <span className="absolute inset-x-0 bottom-0 h-[45%] [mask-image:linear-gradient(transparent,black_40%,transparent)] [transform:perspective(600px)_rotateX(60deg)] [transform-origin:bottom] bg-[linear-gradient(rgb(159_176_200/0.18)_1px,transparent_1px),linear-gradient(90deg,rgb(159_176_200/0.18)_1px,transparent_1px)] bg-[size:48px_48px]" />
      </div>

      {stage === 'intro' || stage === 'portal' ? (
        <section className="container-w flex min-h-[100svh] flex-col items-center justify-center pt-[var(--header-height)] pb-16 text-center">
          {/* the portal */}
          <div className={cn('relative grid size-[260px] place-items-center transition-[scale,opacity] duration-[900ms] ease-[cubic-bezier(.7,0,.3,1)] sm:size-[320px]', stage === 'portal' && 'scale-[9] opacity-0')}>
            <span className="sb-spin absolute inset-0 rounded-full border border-white/20 [border-top-color:rgb(255_255_255/0.8)]" />
            <span className="sb-spin-rev absolute inset-5 rounded-full border border-white/15 [border-bottom-color:rgb(195_206_221/0.9)]" />
            <span className="absolute inset-10 rounded-full bg-[radial-gradient(circle,rgb(195_206_221/0.55),rgb(52_80_127/0.35)_45%,transparent_70%)] blur-md" />
            <span className="sb-float relative grid size-28 place-items-center rounded-[28px] bg-white/10 ring-1 ring-white/25 backdrop-blur-md sm:size-32">
              <Store className="size-12 text-white sm:size-14" strokeWidth={1.2} />
            </span>
            {[ShoppingBag, Palette, Sparkles, Gift].map((I, i) => (
              <span key={i} className="sb-orbit absolute top-1/2 left-1/2 max-sm:hidden" style={{ animationDelay: `${-i * 3}s` }}><span className="grid size-10 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white/10 ring-1 ring-white/20 backdrop-blur"><I className="size-4" /></span></span>
            ))}
          </div>
          <p className="mt-10 text-[14px] font-medium text-white/60">صمم متجرك بنفسك</p>
          <h1 className="mt-2 font-display text-[2.4rem] font-bold leading-[1.35] sm:text-[3.4rem]">ادخل عالم متجرك<span className="block font-normal text-[#c3cedd]">وشوفه قبل لا ينبني</span></h1>
          <p className="mx-auto mt-4 max-w-[38ch] text-[16px] leading-8 text-white/75">ست خطوات ممتعة: الاسم، النشاط، الألوان، الثيم، الشعار والأقسام، ومتجرك يتشكّل قدامك على الجوال والكمبيوتر.</p>
          <button type="button" onClick={enter} className="group mt-9 inline-flex h-14 items-center gap-3 rounded-full bg-white px-9 text-[17px] font-bold text-[#0f1a2c] shadow-[0_0_0_6px_rgb(255_255_255/0.08),0_20px_50px_-15px_rgb(195_206_221/0.8)] transition-transform hover:scale-[1.03] active:scale-95">
            <Wand2 className="size-5" />ابدأ الرحلة<ArrowLeft className="size-5 transition-transform group-hover:-translate-x-1" />
          </button>
          <p className="mt-4 text-[12.5px] text-white/45">مجاني، وما يحتاج تسجيل</p>
        </section>
      ) : (
        <section className="container-w pt-[calc(var(--header-height)+28px)] pb-24 sb-enter">
          {stage === 'build' && (
            <>
              {/* journey path */}
              <ol className="mx-auto mb-8 hidden max-w-3xl items-center justify-between lg:flex" aria-label="الخطوات">
                {STEPS.map((s, i) => (
                  <li key={s.id} className="flex flex-1 items-center last:flex-none">
                    <button type="button" onClick={() => setStep(i)} aria-current={i === step ? 'step' : undefined} aria-label={s.title}
                      className={cn('relative grid size-9 shrink-0 place-items-center rounded-full ring-1 transition-all duration-500 sm:size-11',
                        i < step ? 'bg-white text-[#0f1a2c] ring-white' : i === step ? 'bg-white/15 text-white ring-white shadow-[0_0_24px_rgb(195_206_221/0.7)]' : 'bg-white/5 text-white/45 ring-white/15')}>
                      {i < step ? <Check className="size-4" /> : <s.icon className="size-4" />}
                    </button>
                    {i < STEPS.length - 1 && <span className="mx-1 h-px flex-1 bg-white/15"><span className="block h-full bg-white transition-[width] duration-700" style={{ width: i < step ? '100%' : '0%' }} /></span>}
                  </li>
                ))}
              </ol>

              <div className="grid items-start gap-8 pb-[50svh] max-lg:-mt-4 lg:grid-cols-[400px_1fr] lg:gap-12 lg:pb-0">
                {/* controls: an app-like bottom sheet on phones, so the store stays in view while choosing */}
                <div ref={panel} className="fixed inset-x-0 bottom-0 z-30 max-h-[48svh] overflow-y-auto rounded-t-[28px] bg-[#0b1426]/92 p-5 pt-3 shadow-[0_-20px_60px_-10px_rgb(0_0_0/0.7)] ring-1 ring-white/12 backdrop-blur-xl lg:sticky lg:top-[calc(var(--header-height)+20px)] lg:max-h-none lg:overflow-visible lg:rounded-[26px] lg:bg-white/[0.06] lg:p-7 lg:shadow-none">
                  <span className="mx-auto mb-3 block h-1 w-10 rounded-full bg-white/25 lg:hidden" aria-hidden="true" />
                  <div className="mb-2 flex items-center gap-1.5 lg:hidden" aria-hidden="true">{STEPS.map((x, i) => <span key={x.id} className={cn('h-1 flex-1 rounded-full transition-colors duration-500', i <= step ? 'bg-white' : 'bg-white/15')} />)}</div>
                  <p className="text-[12px] font-semibold text-white/50">الخطوة {step + 1} من {STEPS.length}</p>
                  <h2 key={'t' + step} className="sb-pop mt-1 font-display text-[1.6rem] font-bold leading-snug lg:text-[1.9rem]">{STEPS[step].title}</h2>
                  <p className="text-[14px] text-white/60">{STEPS[step].hint}</p>

                  <div key={'s' + step} className="sb-pop mt-4 lg:mt-6">
                    {step === 0 && (
                      <div>
                        <input value={cfg.name} maxLength={24} onChange={(e) => set('name', e.target.value)} placeholder="مثلاً: لمسة عطر"
                          className="h-14 w-full rounded-2xl bg-white px-5 text-[18px] font-semibold text-[#0f1a2c] outline-none ring-4 ring-transparent transition focus:ring-white/25" />
                        <p className="mt-3 text-[12.5px] text-white/50">ما عندك اسم؟ جرّب واحد:</p>
                        <div className="mt-2 flex flex-wrap gap-2">{['دار الفخامة', 'لمسة', 'بن وهيل', 'أناقة', 'ركن الهدايا'].map((n) => <button key={n} type="button" onClick={() => set('name', n)} className="rounded-full bg-white/10 px-3.5 py-1.5 text-[13px] ring-1 ring-white/15 transition-colors hover:bg-white/20">{n}</button>)}</div>
                      </div>
                    )}
                    {step === 1 && (
                      <div className="grid grid-cols-2 gap-2.5">
                        {ACTIVITIES.map((a) => (
                          <button key={a.id} type="button" onClick={() => set('activity', a.id)} aria-pressed={cfg.activity === a.id}
                            className={cn('flex items-center gap-2.5 rounded-2xl p-3 text-start text-[13.5px] font-semibold ring-1 transition-all', cfg.activity === a.id ? 'bg-white text-[#0f1a2c] ring-white' : 'bg-white/5 ring-white/12 hover:bg-white/10')}>
                            <a.icon className="size-5 shrink-0" strokeWidth={1.6} />{a.label}
                          </button>
                        ))}
                      </div>
                    )}
                    {step === 2 && (
                      <div>
                        <div className="grid grid-cols-4 gap-3">
                          {PALETTES.map((p) => (
                            <button key={p.id} type="button" onClick={() => setCfg((c) => ({ ...c, palette: p.id, custom: '' }))} aria-pressed={!cfg.custom && cfg.palette === p.id} title={p.name}
                              className={cn('group flex flex-col items-center gap-1.5 rounded-2xl p-2 ring-1 transition-all', !cfg.custom && cfg.palette === p.id ? 'bg-white/15 ring-white' : 'ring-transparent hover:bg-white/5')}>
                              <span className="relative size-11 overflow-hidden rounded-full ring-2 ring-white/30"><span className="absolute inset-0" style={{ background: p.p }} /><span className="absolute inset-y-0 end-0 w-1/2" style={{ background: p.a }} /></span>
                              <span className="text-[10.5px] text-white/75">{p.name}</span>
                            </button>
                          ))}
                        </div>
                        <label className="mt-5 flex cursor-pointer items-center gap-3 rounded-2xl bg-white/5 p-3 ring-1 ring-white/12">
                          <input type="color" value={cfg.custom || '#1b2b44'} onChange={(e) => set('custom', e.target.value)} className="size-10 cursor-pointer rounded-lg border-0 bg-transparent p-0" />
                          <span className="text-[13.5px] font-semibold">لون علامتك الخاص</span>
                          {cfg.custom && <button type="button" onClick={(e) => { e.preventDefault(); set('custom', '') }} className="ms-auto text-white/60 hover:text-white" aria-label="إلغاء اللون الخاص"><X className="size-4" /></button>}
                        </label>
                      </div>
                    )}
                    {step === 3 && (
                      <div className="grid gap-3">
                        {THEMES.map((t) => (
                          <button key={t.id} type="button" onClick={() => set('theme', t.id)} aria-pressed={cfg.theme === t.id}
                            className={cn('flex items-center gap-4 rounded-2xl p-4 text-start ring-1 transition-all', cfg.theme === t.id ? 'bg-white text-[#0f1a2c] ring-white' : 'bg-white/5 ring-white/12 hover:bg-white/10')}>
                            <span className={cn('grid size-12 shrink-0 place-items-center rounded-xl', cfg.theme === t.id ? 'bg-[#0f1a2c] text-white' : 'bg-white/10')}><t.icon className="size-6" strokeWidth={1.5} /></span>
                            <span><b className="block text-[16px]">{t.name}</b><span className={cn('text-[12.5px]', cfg.theme === t.id ? 'text-[#0f1a2c]/65' : 'text-white/55')}>{t.note}</span></span>
                          </button>
                        ))}
                        <p className="text-[11.5px] leading-6 text-white/45">المعاينة تقريبية لطابع الثيم، والتصميم النهائي ننفّذه على الثيم الأصلي في سلة.</p>
                      </div>
                    )}
                    {step === 4 && (
                      <div>
                        <p className="mb-2 text-[13px] font-semibold text-white/70">الخط</p>
                        <div className="grid grid-cols-5 gap-2">
                          {FONTS.map((f) => (
                            <button key={f.id} type="button" onClick={() => set('font', f.id)} aria-pressed={cfg.font === f.id}
                              className={cn('rounded-xl py-2.5 text-center ring-1 transition-all', cfg.font === f.id ? 'bg-white text-[#0f1a2c] ring-white' : 'bg-white/5 ring-white/12 hover:bg-white/10')}>
                              <span className="block text-[20px] leading-tight" style={{ fontFamily: f.family }}>أب</span><span className="text-[10.5px] opacity-70">{f.name}</span>
                            </button>
                          ))}
                        </div>
                        <p className="mt-5 mb-2 text-[13px] font-semibold text-white/70">الشعار</p>
                        <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-dashed border-white/25 p-4 transition-colors hover:bg-white/5">
                          <span className="grid size-12 shrink-0 place-items-center overflow-hidden rounded-xl bg-white">{cfg.logo ? <img src={cfg.logo} alt="شعارك" className="max-h-10 max-w-10 object-contain" /> : <Upload className="size-5 text-[#0f1a2c]" />}</span>
                          <span><b className="block text-[14px]">{cfg.logo ? 'غيّر الشعار' : 'ارفع شعارك'}</b><span className="text-[12px] text-white/55">PNG أو JPG، يبقى في جهازك فقط</span></span>
                          <input type="file" accept="image/png,image/jpeg,image/webp,image/svg+xml" onChange={onLogo} className="sr-only" />
                        </label>
                        {cfg.logo && <button type="button" onClick={() => { URL.revokeObjectURL(cfg.logo); set('logo', '') }} className="mt-2 text-[12.5px] text-white/60 underline underline-offset-4">استخدم اسم المتجر كشعار</button>}
                      </div>
                    )}
                    {step === 5 && (
                      <div className="grid gap-2.5">
                        {SECTIONS.map((x) => (
                          <label key={x.id} className="flex cursor-pointer items-center justify-between rounded-2xl bg-white/5 px-4 py-3 ring-1 ring-white/12">
                            <span className="text-[14px] font-semibold">{x.label}</span>
                            <input type="checkbox" checked={cfg.sections[x.id]} onChange={(e) => set('sections', { ...cfg.sections, [x.id]: e.target.checked })} className="peer sr-only" />
                            <span className="relative h-6 w-11 rounded-full bg-white/20 transition-colors after:absolute after:top-0.5 after:start-0.5 after:size-5 after:rounded-full after:bg-white after:transition-transform peer-checked:bg-[#9fb0c8] peer-checked:after:-translate-x-5 peer-focus-visible:ring-2 peer-focus-visible:ring-white" />
                          </label>
                        ))}
                        {cfg.sections.bar && <input value={cfg.bar} maxLength={60} onChange={(e) => set('bar', e.target.value)} className="mt-1 h-11 rounded-xl bg-white px-4 text-[14px] text-[#0f1a2c] outline-none" aria-label="نص شريط الإعلان" />}
                      </div>
                    )}
                  </div>

                  <div className="sticky bottom-0 -mx-5 mt-5 flex items-center gap-3 bg-[#0b1426]/95 px-5 pt-3 pb-1 lg:static lg:mx-0 lg:mt-8 lg:bg-transparent lg:p-0">
                    {step > 0 && <button type="button" onClick={() => go(-1)} className="grid size-12 shrink-0 place-items-center rounded-full bg-white/10 ring-1 ring-white/15 hover:bg-white/15" aria-label="السابق"><ArrowRight className="size-5" /></button>}
                    <button type="button" onClick={() => go(1)} className="flex h-12 flex-1 items-center justify-center gap-2 rounded-full bg-white text-[15.5px] font-bold text-[#0f1a2c] shadow-[0_14px_34px_-14px_rgb(195_206_221/0.9)] transition-transform hover:scale-[1.02] active:scale-95">
                      {step === STEPS.length - 1 ? <>شوف متجرك جاهز<Sparkles className="size-5" /></> : <>التالي<ArrowLeft className="size-5" /></>}
                    </button>
                  </div>
                </div>

                {preview}
              </div>
            </>
          )}

          {stage === 'done' && (
            <div className="grid items-center gap-10 lg:grid-cols-[1fr_1.1fr]">
              <div className="text-center lg:text-start">
                <span className="sb-pop inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-[13px] font-semibold ring-1 ring-white/20"><Sparkles className="size-4" />تم بناء متجرك</span>
                <h2 className="sb-pop mt-4 font-display text-[2.3rem] font-bold leading-[1.35] sm:text-[3rem]">مبروك، هذا <span className="text-[#c3cedd]">{cfg.name || 'متجرك'}</span></h2>
                <p className="mx-auto mt-3 max-w-[40ch] text-[16px] leading-8 text-white/75 lg:mx-0">هذي فكرة متجرك. نحوّلها لمتجر حقيقي على سلة، بتصميم كامل وتفاصيل تشبه علامتك، خلال يومين إلى ستة أيام.</p>
                <ul className="mx-auto mt-6 grid max-w-md gap-2 text-start text-[14px] lg:mx-0">
                  {[['النشاط', act?.label], ['الألوان', cfg.custom ? 'لون خاص' : pal?.name], ['الثيم', THEMES.find((t) => t.id === cfg.theme)?.name], ['الخط', FONTS.find((f) => f.id === cfg.font)?.name]].map(([k, v]) => (
                    <li key={k} className="flex items-center justify-between rounded-xl bg-white/[0.06] px-4 py-2.5 ring-1 ring-white/10"><span className="text-white/55">{k}</span><b>{v}</b></li>
                  ))}
                </ul>
                <div className="mt-8 flex flex-wrap justify-center gap-3 lg:justify-start">
                  <a href={waLink(summary)} target="_blank" rel="noreferrer" className="inline-flex h-13 items-center gap-2 rounded-full bg-white px-7 py-3.5 text-[16px] font-bold text-[#0f1a2c] shadow-[0_18px_40px_-14px_rgb(195_206_221/0.9)] transition-transform hover:scale-[1.03]"><MessageCircle className="size-5" />أرسل تصميمي على واتساب</a>
                  <Link to="/p/salla-store-design" className="inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-[15px] font-semibold ring-1 ring-white/30 transition-colors hover:bg-white/10">اطلب تصميم متجرك<ArrowLeft className="size-4" /></Link>
                </div>
                <div className="mt-5 flex flex-wrap justify-center gap-4 text-[13px] text-white/60 lg:justify-start">
                  <button type="button" onClick={() => { setStage('build'); setStep(0) }} className="inline-flex items-center gap-1.5 hover:text-white"><Wand2 className="size-4" />عدّل التصميم</button>
                  <button type="button" onClick={restart} className="inline-flex items-center gap-1.5 hover:text-white"><RotateCcw className="size-4" />ابدأ من جديد</button>
                </div>
              </div>
              {preview}
            </div>
          )}
        </section>
      )}

      <Confetti run={burst} />
    </div>
  )
}
