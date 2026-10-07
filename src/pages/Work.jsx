import { Link } from 'react-router-dom'
import { ExternalLink, Store, Images } from 'lucide-react'
import { WorkGallery } from '@/components/home/WorkGallery.jsx'
import Phone from '@/components/home/Phone.jsx'
import PageIntro from '@/components/site/PageIntro.jsx'
import { WORK, WORK_FOLDER, STORES_FOLDER, STORE_PDFS, pdfView } from '@/data/work.js'
import { Button } from '@/components/ui/button'
import { waLink } from '@/lib/format.js'

const jump = 'inline-flex h-11 items-center gap-2 rounded-full bg-white px-5 text-sm font-semibold text-primary shadow-[0_10px_24px_-16px_rgb(27_43_68/0.6)] ring-1 ring-primary/10 transition-colors hover:bg-primary hover:text-on-inverse'

function SubHead({ icon: I, title, count, note }) {
  return (
    <div className="mb-8 flex flex-col items-center gap-1 text-center sm:mb-10">
      <h2 className="flex items-center gap-2.5 font-display text-[1.8rem] font-bold text-primary sm:text-[2.1rem]"><I className="size-6 text-primary/50" strokeWidth={1.5} />{title}<span className="tabular rounded-full bg-primary/[0.07] px-2.5 py-0.5 font-sans text-sm font-semibold text-primary/70">{count}</span></h2>
      {note && <p className="text-sm text-muted-foreground">{note}</p>}
    </div>
  )
}

export default function Work() {
  return (
    <div className="container-w">
      <PageIntro crumb="أعمالنا" title="أعمالنا" lead="كل شغلنا في صفحة وحدة: متاجر سلّمناها كاملة، وتصاميم بنرات وسوشال ميديا لعملائنا.">
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <a href="#stores" className={jump}><Store className="size-4" />المتاجر <span className="tabular opacity-60">{STORE_PDFS.length}</span></a>
          <a href="#banners" className={jump}><Images className="size-4" />بنرات وسوشال ميديا <span className="tabular opacity-60">{WORK.length}</span></a>
        </div>
      </PageIntro>

      <section id="stores" className="scroll-mt-28 py-8 sm:py-12" aria-label="المتاجر">
        <SubHead icon={Store} title="المتاجر" count={STORE_PDFS.length} note="مرّر على أي متجر ويتمرّر لك كامل، أو اضغط وافتح الملف." />
        <ul className="mx-auto grid max-w-[980px] grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 sm:gap-x-10">
          {STORE_PDFS.map((s) => (
            <li key={s.id}>
              <a href={pdfView(s.id)} target="_blank" rel="noreferrer" className="group block" aria-label={`افتح ملف متجر ${s.name}`}>
                <Phone pdfId={s.id} scrollOnHover size={500} className="mx-auto max-w-[260px] transition-transform duration-500 ease-emphasized group-hover:-translate-y-2" />
                <span className="mt-4 flex items-center justify-center gap-1.5 font-semibold text-primary">{s.name}<ExternalLink className="size-3.5 text-muted-foreground" /></span>
              </a>
            </li>
          ))}
        </ul>
        <p className="mt-8 text-center text-sm"><a href={STORES_FOLDER} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 font-semibold text-primary underline underline-offset-4">ملفات المتاجر على Google Drive<ExternalLink className="size-3.5" /></a></p>
      </section>

      <section id="banners" className="scroll-mt-28 py-8 sm:py-12" aria-label="بنرات وسوشال ميديا">
        <SubHead icon={Images} title="بنرات وسوشال ميديا" count={WORK.length} note="اضغط أي تصميم وشوفه بحجمه الكامل." />
        <WorkGallery items={WORK} grid />
        <p className="mt-8 text-center text-sm"><a href={WORK_FOLDER} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 font-semibold text-primary underline underline-offset-4">المعرض كامل على Google Drive<ExternalLink className="size-3.5" /></a></p>
      </section>

      <div className="py-12 text-center sm:py-16">
        <h2 className="font-display text-[1.9rem] font-bold text-primary">عجبك شغلنا؟</h2>
        <div className="mt-5 flex justify-center gap-3">
          <Button asChild size="lg"><Link to="/p/salla-store-design">ابدأ متجرك</Link></Button>
          <Button asChild size="lg" variant="outline"><a href={waLink('السلام عليكم، شفت أعمالكم وأبي تصميم لمتجري')} target="_blank" rel="noreferrer">واتساب</a></Button>
        </div>
      </div>
    </div>
  )
}
