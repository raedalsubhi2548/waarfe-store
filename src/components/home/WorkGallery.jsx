import { useCallback, useEffect, useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { ChevronLeft, ChevronRight, X, FileText, ExternalLink } from 'lucide-react'
import { cn } from '@/lib/utils'
import { img, STORE_PDFS, pdfThumb, pdfView } from '@/data/work.js'

/** Masonry of portfolio images (natural ratios) with a keyboard/swipe lightbox. */
export function WorkGallery({ items, className }) {
  const [open, setOpen] = useState(-1)
  const go = useCallback((d) => setOpen((i) => (i + d + items.length) % items.length), [items.length])

  useEffect(() => {
    if (open < 0) return
    // RTL: ArrowLeft moves forward, ArrowRight back
    const onKey = (e) => { if (e.key === 'ArrowLeft') go(1); if (e.key === 'ArrowRight') go(-1) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, go])

  let startX = 0
  return (
    <>
      <ul className={cn('columns-2 gap-3 sm:columns-3 sm:gap-4 lg:columns-4', className)}>
        {items.map((id, i) => (
          <li key={id} className="mb-3 break-inside-avoid sm:mb-4">
            <button
              type="button"
              onClick={() => setOpen(i)}
              className="group block w-full overflow-hidden rounded-lg bg-sunken shadow-hairline ring-1 ring-border transition-shadow duration-300 hover:shadow-card"
              aria-label={`عرض التصميم ${i + 1} بحجم كبير`}
            >
              <img src={img(id, 700)} alt="" loading="lazy" decoding="async" className="w-full transition-transform duration-700 ease-emphasized group-hover:scale-[1.02]" />
            </button>
          </li>
        ))}
      </ul>

      <Dialog.Root open={open >= 0} onOpenChange={(o) => !o && setOpen(-1)}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-[rgb(5_38_32/0.92)] motion-safe:animate-[fade-in_200ms]" />
          <Dialog.Content
            className="fixed inset-0 z-50 grid place-items-center p-4 outline-none sm:p-10"
            onTouchStart={(e) => { startX = e.touches[0].clientX }}
            onTouchEnd={(e) => { const dx = e.changedTouches[0].clientX - startX; if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1) }}
          >
            <Dialog.Title className="sr-only">معرض أعمال وارف</Dialog.Title>
            <Dialog.Description className="sr-only">تصميم {open + 1} من {items.length}. استخدم الأسهم للتنقل.</Dialog.Description>
            {open >= 0 && (
              <img key={items[open]} src={img(items[open], 1800)} alt={`تصميم ${open + 1} من أعمال وارف`} className="max-h-[86vh] max-w-full rounded-md object-contain shadow-overlay motion-safe:animate-[fade-in_240ms]" />
            )}
            <Dialog.Close className="absolute top-4 end-4 grid size-12 place-items-center rounded-full bg-background text-primary" aria-label="إغلاق"><X className="size-6" /></Dialog.Close>
            <button onClick={() => go(-1)} className="absolute start-3 top-1/2 grid size-12 -translate-y-1/2 place-items-center rounded-full bg-background/90 text-primary" aria-label="السابق"><ChevronRight className="size-6" /></button>
            <button onClick={() => go(1)} className="absolute end-3 top-1/2 grid size-12 -translate-y-1/2 place-items-center rounded-full bg-background/90 text-primary" aria-label="التالي"><ChevronLeft className="size-6" /></button>
            <p className="tabular absolute inset-x-0 bottom-4 mx-auto w-fit rounded-full bg-background px-3 py-1 text-sm font-bold text-primary">{open + 1} / {items.length}</p>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  )
}

/** Delivered full-store designs (PDF case files on Drive). */
export function StoreCases() {
  return (
    <ul className="grid gap-4 sm:grid-cols-3">
      {STORE_PDFS.map((s) => (
        <li key={s.id}>
          <a href={pdfView(s.id)} target="_blank" rel="noreferrer" className="group block overflow-hidden rounded-lg bg-surface shadow-hairline ring-1 ring-border transition-shadow hover:shadow-card">
            <div className="aspect-[4/3] overflow-hidden bg-sunken">
              <img src={pdfThumb(s.id, 800)} alt="" loading="lazy" className="size-full object-cover object-top transition-transform duration-700 ease-emphasized group-hover:scale-[1.03]" />
            </div>
            <div className="flex items-center justify-between gap-3 p-4">
              <span className="flex items-center gap-2 font-display font-semibold text-primary"><FileText className="size-4 text-accent-text" />{s.name}</span>
              <span className="flex items-center gap-1 text-sm text-muted-foreground">ملف المتجر<ExternalLink className="size-3.5" /></span>
            </div>
          </a>
        </li>
      ))}
    </ul>
  )
}
