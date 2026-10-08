import { useEffect, useMemo, useRef, useState } from 'react'
import { Smartphone, Monitor, Upload, RotateCcw, Check, Loader2, ImageIcon, Undo2 } from 'lucide-react'
import { api } from '@/lib/api.js'
import { useApp } from '@/state.jsx'
import { cn } from '@/lib/utils'
import { DEFAULT_SETTINGS, PRESETS, mergeSettings } from '@/lib/theme.js'
import { Button } from '@/components/ui/button'
import { Field, Input, Textarea, Panel, Switch } from '@/components/ui/kit.jsx'
import { AdminHead, useConfirm } from '@/components/admin/ui.jsx'

const MAX_IMAGE = 4 * 1024 * 1024

/** One image slot: upload, preview on the background it will sit on, back to the original. */
function ImageSlot({ label, hint, value, fallback, dark, onChange, tall }) {
  const { notify } = useApp()
  const input = useRef()
  const [busy, setBusy] = useState(false)
  const pick = async (e) => {
    const file = e.target.files?.[0]; e.target.value = ''
    if (!file) return
    if (!/^image\/(png|jpe?g|webp|svg\+xml)$/.test(file.type)) return notify('الصورة لازم تكون PNG أو JPG أو WEBP أو SVG', 'err')
    if (file.size > MAX_IMAGE) return notify('حجم الصورة أكبر من 4 ميجا، صغّرها وارفعها', 'err')
    setBusy(true)
    try { onChange(await api.uploadImage(file)); notify('رُفعت الصورة') } catch (er) { notify(er.message, 'err') } finally { setBusy(false) }
  }
  const shown = value || fallback
  return (
    <div className="grid gap-2">
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-sm font-semibold text-primary">{label}</span>
        {value && value !== fallback && <button type="button" onClick={() => onChange('')} className="text-xs font-semibold text-muted-foreground hover:text-primary">رجوع للأصلي</button>}
      </div>
      <button type="button" onClick={() => input.current.click()} disabled={busy}
        className={cn('group relative grid place-items-center overflow-hidden rounded-md ring-1 ring-border transition-shadow hover:ring-2 hover:ring-accent', tall ? 'h-36' : 'h-24', dark ? 'bg-[#0f1a2c]' : 'bg-[#f3f6fa]')}>
        {shown ? <img src={shown} alt="" className={cn(tall ? 'size-full object-cover' : 'max-h-16 max-w-[80%] object-contain')} /> : <ImageIcon className="size-7 text-muted-foreground" />}
        <span className="absolute inset-0 grid place-items-center bg-black/45 text-sm font-semibold text-white opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
          {busy ? <Loader2 className="size-5 animate-spin" /> : <span className="flex items-center gap-2"><Upload className="size-4" />تغيير الصورة</span>}
        </span>
      </button>
      {hint && <p className="text-xs leading-5 text-muted-foreground">{hint}</p>}
      <input ref={input} type="file" accept="image/png,image/jpeg,image/webp,image/svg+xml" hidden onChange={pick} />
    </div>
  )
}

function ColorField({ label, value, onChange }) {
  const [txt, setTxt] = useState(value)
  useEffect(() => setTxt(value), [value])
  return (
    <label className="grid gap-1.5">
      <span className="text-sm font-semibold text-primary">{label}</span>
      <span className="flex h-12 items-center gap-2 rounded-full bg-surface px-2 ring-1 ring-border focus-within:ring-2 focus-within:ring-ring">
        <input type="color" value={value} onChange={(e) => onChange(e.target.value)} className="size-8 shrink-0 cursor-pointer rounded-full border-0 bg-transparent p-0 [&::-webkit-color-swatch]:rounded-full [&::-webkit-color-swatch]:border-0 [&::-webkit-color-swatch-wrapper]:p-0" aria-label={label} />
        <input value={txt} dir="ltr" maxLength={7} onChange={(e) => { setTxt(e.target.value); if (/^#[0-9a-f]{6}$/i.test(e.target.value)) onChange(e.target.value.toLowerCase()) }}
          className="min-w-0 flex-1 bg-transparent font-mono text-sm uppercase text-foreground outline-none" />
      </span>
    </label>
  )
}

/** The live store inside the designer, as a phone or a desktop screen. */
function Preview({ draft }) {
  const frame = useRef()
  const box = useRef()
  const [device, setDevice] = useState('mobile')
  const [width, setWidth] = useState(800)
  useEffect(() => {
    const send = () => frame.current?.contentWindow?.postMessage({ type: 'raed:design', settings: draft }, location.origin)
    send()
    const on = (e) => { if (e.origin === location.origin && e.data?.type === 'raed:preview-ready') send() }
    addEventListener('message', on)
    return () => removeEventListener('message', on)
  }, [draft])
  useEffect(() => {
    const ro = new ResizeObserver(([e]) => setWidth(e.contentRect.width))
    ro.observe(box.current)
    return () => ro.disconnect()
  }, [])
  const desk = device === 'desktop'
  const scale = desk ? Math.min(1, width / 1280) : 1
  return (
    <div className="grid gap-3">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-semibold text-primary">معاينة مباشرة <span className="font-normal text-muted-foreground">· الروابط معطلة هنا</span></p>
        <div className="flex rounded-full bg-sunken p-1 ring-1 ring-border">
          {[['mobile', Smartphone, 'جوال'], ['desktop', Monitor, 'كمبيوتر']].map(([id, I, t]) => (
            <button key={id} type="button" onClick={() => setDevice(id)} className={cn('flex h-9 items-center gap-1.5 rounded-full px-3.5 text-sm font-semibold transition-colors', device === id ? 'bg-primary text-on-inverse' : 'text-muted-foreground hover:text-primary')}>
              <I className="size-4" />{t}
            </button>
          ))}
        </div>
      </div>
      <div ref={box} className="grid justify-items-center overflow-hidden rounded-xl bg-[#e9eef5] p-3 ring-1 ring-border sm:p-5">
        <div className={cn('overflow-hidden bg-white shadow-[0_30px_60px_-30px_rgb(15_26_44/0.6)]', desk ? 'rounded-lg' : 'rounded-[34px] ring-[10px] ring-[#0f1a2c]')}
          style={desk ? { width: 1280 * scale, height: 820 * scale } : { width: 375, height: 740 }}>
          <iframe ref={frame} src="/admin/preview" title="معاينة المتجر"
            style={desk ? { width: 1280, height: 820, transform: `scale(${scale})`, transformOrigin: 'top right' } : { width: 375, height: 740 }}
            className="block border-0" />
        </div>
      </div>
    </div>
  )
}

export default function Designer() {
  const { savedSettings, refreshSettings, notify } = useApp()
  const confirm = useConfirm()
  const saved = useMemo(() => mergeSettings(savedSettings), [savedSettings])
  const [draft, setDraft] = useState(saved)
  const [busy, setBusy] = useState(false)
  const touched = useRef(false)
  // the saved settings can arrive after the page opens: take them as long as nothing was edited yet
  useEffect(() => { if (!touched.current) setDraft(saved) }, [saved])
  const dirty = JSON.stringify(draft) !== JSON.stringify(saved)
  const set = (path, value) => {
    touched.current = true
    setDraft((d) => {
      const n = structuredClone(d); const keys = path.split('.'); let o = n
      keys.slice(0, -1).forEach((k) => { o = o[k] }); o[keys.at(-1)] = value
      return n
    })
  }
  const h = draft.hero, a = draft.announcement, c = draft.colors

  const publish = async () => {
    setBusy(true)
    try {
      await api.saveSettings(mergeSettings(draft))
      await refreshSettings()
      touched.current = false
      const r = await api.rebuildSite()
      notify(r?.ok ? 'نُشر التصميم ✓ ويتحدّث لمحركات البحث خلال دقيقتين' : 'نُشر التصميم ✓ وظاهر للزوار الحين')
    } catch (er) { notify(er.message, 'err') } finally { setBusy(false) }
  }
  const resetAll = async () => {
    if (!(await confirm({ title: 'ترجع التصميم الأصلي؟', body: 'يرجع الشعار والألوان والواجهة لتصميم المنصة الأصلي. ما يتغير شي عند الزوار إلا لما تضغط «نشر».', ok: 'رجّع الأصلي' }))) return
    touched.current = true
    setDraft(structuredClone(DEFAULT_SETTINGS))
  }

  return (
    <>
      <AdminHead title="مصمم المتجر" lead="غيّر شعارك وألوانك وواجهة متجرك، وشوف النتيجة مباشرة قبل النشر." />

      <div className="grid gap-6 pb-28 xl:grid-cols-[minmax(380px,460px)_1fr] xl:items-start">
        <div className="grid gap-5">
          <Panel title="الشعار">
            <div className="grid gap-4 sm:grid-cols-2">
              <ImageSlot label="على الخلفية الفاتحة" value={draft.logo} fallback={DEFAULT_SETTINGS.logo} onChange={(v) => set('logo', v || DEFAULT_SETTINGS.logo)} hint="يظهر في الهيدر بعد التمرير والقوائم." />
              <ImageSlot dark label="على الخلفية الغامقة" value={draft.logoLight} fallback={DEFAULT_SETTINGS.logoLight} onChange={(v) => set('logoLight', v || DEFAULT_SETTINGS.logoLight)} hint="فوق صورة الواجهة وفي الفوتر. الأفضل نسخة بيضاء." />
            </div>
            <label className="mt-5 grid gap-2">
              <span className="flex items-center justify-between text-sm font-semibold text-primary">حجم الشعار <span className="tabular text-muted-foreground">{draft.logoScale}%</span></span>
              <input type="range" min="60" max="160" step="5" value={draft.logoScale} onChange={(e) => set('logoScale', Number(e.target.value))} className="w-full accent-[var(--primary)]" />
            </label>
            <p className="mt-3 text-xs leading-5 text-muted-foreground">الأفضل صورة PNG بخلفية شفافة، بعرض 600 بكسل أو أكثر.</p>
          </Panel>

          <Panel title="الألوان">
            <p className="mb-2 text-sm font-semibold text-primary">ثيمات جاهزة</p>
            <div className="mb-5 grid grid-cols-2 gap-2 sm:grid-cols-3">
              {PRESETS.map((p) => {
                const on = p.primary === c.primary && p.accent === c.accent && p.background === c.background
                return (
                  <button key={p.name} type="button" onClick={() => { set('colors', { primary: p.primary, accent: p.accent, background: p.background }) }}
                    className={cn('flex items-center gap-2 rounded-md p-2 text-start text-xs font-semibold ring-1 transition-shadow', on ? 'ring-2 ring-primary' : 'ring-border hover:ring-border-strong')}>
                    <span className="flex shrink-0 overflow-hidden rounded-full ring-1 ring-black/10">
                      {[p.primary, p.accent, p.background].map((x) => <span key={x} className="h-6 w-3" style={{ background: x }} />)}
                    </span>
                    <span className="min-w-0 flex-1 truncate">{p.name}</span>
                    {on && <Check className="size-3.5 shrink-0 text-primary" />}
                  </button>
                )
              })}
            </div>
            <div className="grid gap-3 sm:grid-cols-3 xl:grid-cols-1 2xl:grid-cols-3">
              <ColorField label="اللون الأساسي" value={c.primary} onChange={(v) => set('colors.primary', v)} />
              <ColorField label="اللون المميّز" value={c.accent} onChange={(v) => set('colors.accent', v)} />
              <ColorField label="لون الخلفية" value={c.background} onChange={(v) => set('colors.background', v)} />
            </div>
            <p className="mt-3 text-xs leading-5 text-muted-foreground">الأساسي للأزرار والعناوين والواجهة الغامقة، والمميّز للمسات الصغيرة. درجات الألوان الباقية تتولّد منها تلقائيًا وبقراءة واضحة.</p>
          </Panel>

          <Panel title="شريط الإعلان" action={<Switch checked={a.on} onChange={(v) => set('announcement.on', v)} label={a.on ? 'ظاهر' : 'مخفي'} />}>
            <div className="grid gap-3">
              <Field label="نص الإعلان"><Input value={a.text} maxLength={140} onChange={(e) => set('announcement.text', e.target.value)} placeholder="مثال: خصم 20% على تصميم المتاجر لفترة محدودة" /></Field>
              <Field label="رابط (اختياري)" hint="صفحة داخل المتجر مثل /salla-store-design أو رابط يبدأ بـ https://"><Input value={a.link} dir="ltr" onChange={(e) => set('announcement.link', e.target.value.trim())} placeholder="/shop" /></Field>
            </div>
          </Panel>

          <Panel title="الواجهة الرئيسية">
            <div className="grid gap-3">
              <Field label="سطر صغير فوق العنوان"><Input value={h.eyebrow} maxLength={60} onChange={(e) => set('hero.eyebrow', e.target.value)} /></Field>
              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="العنوان (السطر الأول)"><Input value={h.title1} maxLength={60} onChange={(e) => set('hero.title1', e.target.value)} /></Field>
                <Field label="العنوان (السطر الثاني)"><Input value={h.title2} maxLength={60} onChange={(e) => set('hero.title2', e.target.value)} /></Field>
              </div>
              <Field label="الوصف"><Textarea value={h.text} maxLength={220} onChange={(e) => set('hero.text', e.target.value)} /></Field>
              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="نص الزر"><Input value={h.cta} maxLength={30} onChange={(e) => set('hero.cta', e.target.value)} /></Field>
                <Field label="رابط الزر"><Input value={h.ctaLink} dir="ltr" onChange={(e) => set('hero.ctaLink', e.target.value.trim())} /></Field>
              </div>
              <div className="mt-2 grid gap-4 sm:grid-cols-2">
                <ImageSlot tall label="صورة الخلفية (كمبيوتر)" value={h.image} fallback="/brand/ai/raed-hero-v3.webp" onChange={(v) => set('hero.image', v)} hint="عرضية، 2400×1000 تقريبًا. النص يكون على اليمين." />
                <ImageSlot tall label="صورة الخلفية (جوال)" value={h.imageMobile} fallback="/brand/ai/raed-hero-mobile-v3.webp" onChange={(v) => set('hero.imageMobile', v)} hint="طولية، 1080×1600 تقريبًا. النص يكون فوق." />
              </div>
            </div>
          </Panel>
        </div>

        <div className="xl:sticky xl:top-6"><Preview draft={draft} /></div>
      </div>

      {/* publish bar */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-surface/95 backdrop-blur lg:start-[264px]">
        <div className="mx-auto flex max-w-[1400px] flex-wrap items-center gap-3 px-4 py-3 sm:px-8">
          <p className={cn('flex-1 text-sm font-semibold', dirty ? 'text-warning' : 'text-muted-foreground')}>{dirty ? 'عندك تعديلات ما نُشرت' : 'كل التعديلات منشورة'}</p>
          <Button type="button" variant="ghost" onClick={resetAll} className="font-semibold"><RotateCcw className="size-4" />التصميم الأصلي</Button>
          <Button type="button" variant="outline" disabled={!dirty || busy} onClick={() => { touched.current = false; setDraft(saved) }}><Undo2 className="size-4" />تراجع</Button>
          <Button type="button" disabled={!dirty || busy} onClick={publish} className="min-w-32">{busy ? <Loader2 className="size-4 animate-spin" /> : <Check className="size-4" />}نشر التغييرات</Button>
        </div>
      </div>
    </>
  )
}
