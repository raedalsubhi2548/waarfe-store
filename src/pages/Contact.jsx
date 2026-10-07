import { ArrowUpLeft, Clock } from 'lucide-react'
import { SOCIAL, BrandIcon } from '@/components/Social.jsx'
import { WHATSAPP, EMAIL, waLink } from '@/lib/format.js'
import { PageHead } from '@/components/ui/kit.jsx'

export default function Contact() {
  const wa = SOCIAL.find((s) => s.name === 'واتساب')
  return (
    <div className="container-w py-10 sm:py-14">
      <PageHead title="تواصل معنا" lead="راسلنا على واتساب أو على بريد خدمة العملاء، ونرد عليك بنفس اليوم." />
      <div className="grid gap-4 lg:grid-cols-[1.2fr_1fr]">
        <a href={waLink('السلام عليكم')} target="_blank" rel="noreferrer" className="group relative flex min-h-64 flex-col justify-between overflow-hidden rounded-xl bg-inverse p-8 text-on-inverse shadow-card">
          <span className="grid size-16 place-items-center rounded-full bg-accent text-accent-foreground"><BrandIcon icon={wa.icon} size={30} /></span>
          <div>
            <p className="font-display text-display-sm font-semibold">راسلنا على واتساب</p>
            <p className="tabular mt-1 text-lg opacity-85" dir="ltr">0{WHATSAPP.slice(3)}</p>
            <p className="mt-4 flex items-center gap-2 text-sm opacity-75"><Clock className="size-4" />نرد عادة خلال ساعات العمل بنفس اليوم</p>
          </div>
          <ArrowUpLeft className="absolute top-8 end-8 size-7 text-accent transition-transform duration-300 group-hover:-translate-x-1 group-hover:-translate-y-1" />
        </a>
        <a href={`mailto:${EMAIL}`} className="group flex min-h-64 flex-col justify-between rounded-xl bg-surface p-8 shadow-hairline ring-1 ring-border transition-shadow hover:shadow-card">
          <span className="grid size-16 place-items-center rounded-full bg-sunken text-primary"><BrandIcon icon={SOCIAL.find((x) => x.name === 'البريد').icon} size={28} /></span>
          <div>
            <p className="font-display text-display-sm font-semibold text-primary">بريد خدمة العملاء</p>
            <p className="mt-1 text-lg text-muted-foreground" dir="ltr">{EMAIL}</p>
            <p className="mt-4 text-sm text-muted-foreground">للاستفسارات والفواتير والطلبات الرسمية.</p>
          </div>
        </a>
      </div>
    </div>
  )
}
