import { Link } from 'react-router-dom'
import { ExternalLink } from 'lucide-react'
import { WorkGallery, StoreCases } from '@/components/home/WorkGallery.jsx'
import { WORK, WORK_FOLDER, STORES_FOLDER } from '@/data/work.js'
import { Button } from '@/components/ui/button'
import { waLink } from '@/lib/format.js'

export default function Work() {
  return (
    <div className="container-w py-10 sm:py-14">
      <nav className="mb-4 text-sm text-muted-foreground" aria-label="المسار"><Link to="/" className="hover:underline">الرئيسية</Link> / <span>أعمالنا</span></nav>
      <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
        <div className="max-w-2xl">
          <h1 className="font-display text-display-sm font-bold text-primary sm:text-display-md">أعمالنا</h1>
          <p className="mt-2 text-[17px] leading-8 text-muted-foreground">{WORK.length} تصميم من بنرات وصور متاجر عملائنا، ومتاجر سلّمناها كاملة.</p>
        </div>
        <Button asChild size="lg"><a href={waLink('السلام عليكم، شفت أعمالكم وأبي تصميم لمتجري')} target="_blank" rel="noreferrer">أبي تصميم مثلها</a></Button>
      </div>

      <h2 className="mb-4 font-display text-xl font-bold text-primary">متاجر سلّمناها كاملة</h2>
      <StoreCases />
      <p className="mt-3 text-sm"><a href={STORES_FOLDER} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 font-semibold text-primary underline underline-offset-4">كل ملفات المتاجر<ExternalLink className="size-3.5" /></a></p>

      <h2 className="mt-14 mb-4 font-display text-xl font-bold text-primary">بنرات وتصاميم</h2>
      <WorkGallery items={WORK} />
      <p className="mt-6 text-center text-sm"><a href={WORK_FOLDER} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 font-semibold text-primary underline underline-offset-4">المعرض كامل على Google Drive<ExternalLink className="size-3.5" /></a></p>
    </div>
  )
}
