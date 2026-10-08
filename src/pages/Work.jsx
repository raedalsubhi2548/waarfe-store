import { Link } from 'react-router-dom'
import { ExternalLink, Images, FileText, Eye, Download } from 'lucide-react'
import { WorkGallery } from '@/components/home/WorkGallery.jsx'
import PageIntro from '@/components/site/PageIntro.jsx'
import { WORK, WORK_FOLDER, STORES_FOLDER, STORE_PDFS, pdfView, pdfThumb, pdfDownload } from '@/data/work.js'
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
          <a href="#stores" className={jump}><FileText className="size-4" />ملفات المتاجر <span className="tabular opacity-80">{STORE_PDFS.length}</span></a>
          <a href="#banners" className={jump}><Images className="size-4" />صور التصاميم <span className="tabular opacity-80">{WORK.length}</span></a>
        </div>
      </PageIntro>

      <section id="stores" className="scroll-mt-28 py-8 sm:py-12" aria-label="ملفات المتاجر">
        <SubHead icon={FileText} title="ملفات المتاجر" count={STORE_PDFS.length} note="ملف كل متجر سلّمناه كامل، مرّر على الغلاف يتصفّح لك، أو افتح الملف." />
        <ul className="mx-auto grid max-w-[1100px] grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3 lg:gap-6">
          {STORE_PDFS.map((s, i) => (
            <li key={s.id} className="group flex flex-col overflow-hidden rounded-[18px] bg-white shadow-[0_1px_2px_rgb(27_43_68/0.08),0_24px_44px_-28px_rgb(27_43_68/0.6)] ring-1 ring-primary/[0.07] transition-[translate,box-shadow] duration-500 ease-[cubic-bezier(.16,1,.3,1)] hover:-translate-y-1">
              {/* the file's own pages, gliding by on hover */}
              <a href={pdfView(s.id)} target="_blank" rel="noreferrer" className="relative m-2 mb-0 block aspect-[4/5] overflow-hidden rounded-[13px] bg-[linear-gradient(165deg,#fbfcfe,#e6ecf4)] [container-type:size] sm:m-2.5 sm:mb-0 sm:aspect-[4/3]">
                <FileText className="absolute top-1/2 left-1/2 size-10 -translate-x-1/2 -translate-y-1/2 animate-pulse text-primary/15" strokeWidth={1.2} aria-hidden="true" />
                <img src={pdfThumb(s.id, 700)} alt={`أول صفحة من ملف متجر ${s.name}`} loading={i < 6 ? 'eager' : 'lazy'} decoding="async"
                  className="relative w-full select-none transition-[translate] duration-[9s] ease-in-out [translate:0_0] group-hover:[translate:0_calc(-100%+100cqh)]" />
                <span className="absolute top-2 start-2 z-10 rounded-full bg-primary/90 px-2 py-1 text-[10px] font-semibold leading-none text-on-inverse backdrop-blur sm:top-3 sm:start-3 sm:text-[11px]">PDF</span>
              </a>
              <div className="flex flex-1 flex-col gap-3 p-3 sm:p-4">
                <b className="block truncate text-[14px] font-semibold text-primary sm:text-[16px]">متجر {s.name}</b>
                <div className="mt-auto flex gap-2">
                  <a href={pdfView(s.id)} target="_blank" rel="noreferrer" className="inline-flex h-9 flex-1 items-center justify-center gap-1.5 rounded-full bg-primary text-[12.5px] font-semibold text-on-inverse transition-colors hover:bg-primary-hover sm:h-10 sm:text-[13.5px]"><Eye className="size-4" />عرض الملف</a>
                  <a href={pdfDownload(s.id)} target="_blank" rel="noreferrer" aria-label={`تحميل ملف متجر ${s.name}`} title="تحميل" className="grid size-9 shrink-0 place-items-center rounded-full text-primary ring-1 ring-primary/20 transition-colors hover:bg-primary/[0.05] sm:size-10"><Download className="size-4" /></a>
                </div>
              </div>
            </li>
          ))}
        </ul>
        <p className="mt-8 text-center text-sm"><a href={STORES_FOLDER} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 font-semibold text-primary underline underline-offset-4">مجلد ملفات المتاجر على Google Drive<ExternalLink className="size-3.5" /></a></p>
      </section>

      <span className="mx-auto my-4 block h-px w-full max-w-[1040px] bg-[linear-gradient(90deg,transparent,rgb(27_43_68/0.15),transparent)]" aria-hidden="true" />

      <section id="banners" className="scroll-mt-28 py-8 sm:py-12" aria-label="بنرات وسوشال ميديا">
        <SubHead icon={Images} title="صور التصاميم" count={WORK.length} note="بنرات وسوشال ميديا لعملائنا، اضغط أي تصميم وشوفه بحجمه الكامل." />
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
