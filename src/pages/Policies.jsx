import { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Check } from 'lucide-react'
import { PageHead } from '@/components/ui/kit.jsx'
import { Button } from '@/components/ui/button'
import { waLink } from '@/lib/format.js'
import { POLICY_SECTIONS } from '@/data/terms.js'

const SECTIONS = POLICY_SECTIONS

export default function Policies() {
  const { hash } = useLocation()
  // links like /policies#refund land on that section
  useEffect(() => { if (hash) document.getElementById(hash.slice(1))?.scrollIntoView({ block: 'start' }) }, [hash])
  return (
    <div className="container-w py-10 sm:py-14">
      <PageHead title="السياسات والشروط" lead="راجعها قبل الطلب. إذا عندك سؤال، كلّمنا على واتساب." />
      <div className="grid items-start gap-8 lg:grid-cols-[240px_1fr]">
        <nav className="flex gap-2 overflow-x-auto [scrollbar-width:none] lg:sticky lg:top-[calc(var(--header-height)+24px)] lg:grid" aria-label="الأقسام">
          {SECTIONS.map((s, i) => (
            <a key={s.id} href={`#${s.id}`} className="flex shrink-0 items-center gap-3 rounded-full px-4 py-2.5 text-sm font-semibold text-primary ring-1 ring-border hover:bg-sunken lg:rounded-md lg:ring-0">
              <span className="tabular text-xs text-accent-text">{String(i + 1).padStart(2, '0')}</span>{s.h}
            </a>
          ))}
        </nav>
        <div className="grid gap-4">
          {SECTIONS.map((s, i) => (
            <section key={s.id} id={s.id} className="scroll-mt-28 rounded-lg bg-surface p-6 shadow-hairline ring-1 ring-border sm:p-8">
              <h2 className="flex items-baseline gap-3 font-display text-xl font-semibold text-primary"><span className="tabular text-sm text-accent-text">{String(i + 1).padStart(2, '0')}</span>{s.h}</h2>
              <ul className="mt-4 grid gap-3">
                {s.p.map((x) => <li key={x} className="flex gap-3 leading-8"><Check className="mt-2 size-4 shrink-0 text-primary" />{x}</li>)}
              </ul>
            </section>
          ))}
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-lg bg-sunken p-6">
            <p className="font-semibold text-primary">عندك سؤال عن الشروط؟</p>
            <div className="flex gap-2">
              <Button asChild variant="outline"><Link to="/contact">تواصل معنا</Link></Button>
              <Button asChild><a href={waLink('عندي سؤال عن السياسات')} target="_blank" rel="noreferrer">واتساب</a></Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
