import { Link, useSearchParams } from 'react-router-dom'
import { ExternalLink, Store, Images } from 'lucide-react'
import { WorkGallery } from '@/components/home/WorkGallery.jsx'
import Phone from '@/components/home/Phone.jsx'
import Divider from '@/components/home/Divider.jsx'
import { WORK, WORK_FOLDER, STORES_FOLDER, STORE_PDFS, pdfView } from '@/data/work.js'
import { Button } from '@/components/ui/button'
import { waLink } from '@/lib/format.js'
import { cn } from '@/lib/utils'

const TABS = [
  { id: 'stores', label: 'المتاجر', icon: Store, count: STORE_PDFS.length },
  { id: 'banners', label: 'بنرات وسوشال ميديا', icon: Images, count: WORK.length },
]

export default function Work() {
  const [params, setParams] = useSearchParams()
  const tab = params.get('tab') === 'banners' ? 'banners' : 'stores'
  return (
    <>
      <section className="relative overflow-hidden bg-inverse text-on-inverse">
        <span className="pointer-events-none absolute inset-0 bg-[radial-gradient(50%_80%_at_50%_120%,rgb(195_206_221/0.22),transparent)]" aria-hidden="true" />
        <div className="container-w relative py-10 text-center sm:py-14">
          <nav className="mb-4 text-sm text-on-inverse/60" aria-label="المسار"><Link to="/" className="hover:underline">الرئيسية</Link> / <span>أعمالنا</span></nav>
          <h1 className="font-display text-display-sm font-semibold sm:text-display-md">أعمالنا</h1>
          <p className="mx-auto mt-2 max-w-md text-on-inverse/75">متاجر سلّمناها كاملة، وتصاميم بنرات وسوشال ميديا لعملائنا.</p>
          <div className="mx-auto mt-8 inline-grid grid-cols-2 rounded-full bg-white/10 p-1 ring-1 ring-white/10" role="tablist" aria-label="نوع العمل">
            {TABS.map(({ id, label, icon: I, count }) => (
              <button key={id} role="tab" aria-selected={tab === id} aria-controls={`panel-${id}`} onClick={() => setParams(id === 'stores' ? {} : { tab: id })}
                className={cn('flex h-11 items-center justify-center gap-2 rounded-full px-4 text-sm font-bold transition-colors sm:px-6', tab === id ? 'bg-accent text-accent-foreground' : 'text-on-inverse/80 hover:text-on-inverse')}>
                <I className="size-4" /><span className="whitespace-nowrap">{label}</span><span className="tabular text-xs opacity-70">{count}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      <div className="container-w py-10 sm:py-14">
        {tab === 'stores' ? (
          <section id="panel-stores" role="tabpanel" aria-label="المتاجر">
            <p className="mb-8 text-center text-muted-foreground">مرّر على أي متجر ويتمرّر لك كامل، أو افتح الملف.</p>
            <ul className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 sm:gap-x-10 lg:px-20">
              {STORE_PDFS.map((s) => (
                <li key={s.id}>
                  <a href={pdfView(s.id)} target="_blank" rel="noreferrer" className="group block" aria-label={`افتح ملف متجر ${s.name}`}>
                    <Phone pdfId={s.id} scrollOnHover size={500} className="transition-transform duration-500 ease-emphasized group-hover:-translate-y-2" />
                    <span className="mt-4 flex items-center justify-center gap-1.5 font-display font-semibold text-primary">{s.name}<ExternalLink className="size-3.5 text-muted-foreground" /></span>
                  </a>
                </li>
              ))}
            </ul>
            <p className="mt-10 text-center text-sm"><a href={STORES_FOLDER} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 font-semibold text-primary underline underline-offset-4">كل ملفات المتاجر<ExternalLink className="size-3.5" /></a></p>
          </section>
        ) : (
          <section id="panel-banners" role="tabpanel" aria-label="بنرات وسوشال ميديا">
            <p className="mb-8 text-center text-muted-foreground">اضغط أي تصميم وشوفه بحجمه الكامل.</p>
            <WorkGallery items={WORK} className="columns-2 sm:columns-3 lg:columns-4" />
            <p className="mt-8 text-center text-sm"><a href={WORK_FOLDER} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 font-semibold text-primary underline underline-offset-4">المعرض كامل على Google Drive<ExternalLink className="size-3.5" /></a></p>
          </section>
        )}
      </div>

      <Divider />
      <div className="container-w py-12 text-center">
        <h2 className="font-display text-2xl font-semibold text-primary">عجبك شغلنا؟</h2>
        <div className="mt-5 flex justify-center gap-3">
          <Button asChild size="lg"><Link to="/p/salla-store-design">ابدأ متجرك</Link></Button>
          <Button asChild size="lg" variant="outline"><a href={waLink('السلام عليكم، شفت أعمالكم وأبي تصميم لمتجري')} target="_blank" rel="noreferrer">واتساب</a></Button>
        </div>
      </div>
    </>
  )
}
