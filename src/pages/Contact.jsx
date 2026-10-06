import { ArrowUpLeft, Clock } from 'lucide-react'
import { SOCIAL, BrandIcon } from '@/components/Social.jsx'
import { WHATSAPP, waLink } from '@/lib/format.js'
import { PageHead } from '@/components/ui/kit.jsx'

export default function Contact() {
  const wa = SOCIAL.find((s) => s.name === 'واتساب')
  return (
    <div className="container-w py-10 sm:py-14">
      <PageHead title="تواصل معنا" lead="أسرع طريقة نوصل لك فيها: واتساب. نرد عليك بنفس اليوم." />
      <div className="grid gap-4 lg:grid-cols-[1.2fr_1fr]">
        <a href={waLink('السلام عليكم')} target="_blank" rel="noreferrer" className="group relative flex min-h-64 flex-col justify-between overflow-hidden rounded-xl bg-inverse p-8 text-on-inverse shadow-card">
          <span className="grid size-16 place-items-center rounded-full bg-accent text-accent-foreground"><BrandIcon icon={wa.icon} size={30} /></span>
          <div>
            <p className="font-display text-display-sm font-semibold">راسلنا على واتساب</p>
            <p className="tabular mt-1 text-lg opacity-85" dir="ltr">+{WHATSAPP}</p>
            <p className="mt-4 flex items-center gap-2 text-sm opacity-75"><Clock className="size-4" />نرد عادة خلال ساعات العمل بنفس اليوم</p>
          </div>
          <ArrowUpLeft className="absolute top-8 end-8 size-7 text-accent transition-transform duration-300 group-hover:-translate-x-1 group-hover:-translate-y-1" />
        </a>
        <ul className="grid grid-cols-2 gap-3">
          {SOCIAL.filter((s) => s !== wa).map((s) => (
            <li key={s.href}>
              <a href={s.href} target="_blank" rel="noreferrer" className="flex h-full flex-col gap-3 rounded-lg bg-surface p-5 shadow-hairline ring-1 ring-border transition-shadow hover:shadow-card">
                <span className="grid size-11 place-items-center rounded-full bg-sunken text-primary"><BrandIcon icon={s.icon} size={20} /></span>
                <strong className="font-display text-primary">{s.name}</strong>
                <span className="truncate text-sm text-muted-foreground" dir="ltr">{s.href.replace(/^https:\/\/(www\.)?/, '')}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
