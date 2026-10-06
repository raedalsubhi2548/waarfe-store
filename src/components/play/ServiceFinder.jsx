import { useState } from 'react'
import { Store, Wand2, Megaphone, FileCheck2, RotateCcw } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useApp } from '@/state.jsx'
import ServiceTicket from '@/components/home/ServiceTicket.jsx'

const GOALS = [
  { id: 'start', icon: Store, t: 'ما عندي متجر', d: 'أبي أبدأ من الصفر', picks: ['salla-store-design', 'salla-subscription', 'buy-domain', 'logo-design'] },
  { id: 'polish', icon: Wand2, t: 'عندي متجر', d: 'أبيه أجمل ويبيع أكثر', picks: ['landing-page-design', 'banner-design', 'ai-integration-chatgpt-claude-salla', 'add-products'] },
  { id: 'grow', icon: Megaphone, t: 'أبي مبيعات', d: 'أوصل لعملاء أكثر', picks: ['snapchat-ads-creation', 'tiktok-ads-creation', 'google-tools-integration', 'pixel-integration'] },
  { id: 'papers', icon: FileCheck2, t: 'أوراقي الرسمية', d: 'سجل، توثيق، تقسيط', picks: ['issue-commercial-registration-saudi', 'freelance-certificate-family-platform', 'business-verification', 'tabby-registration'] },
]

/** "Which one fits me?" — tap a card, the shelf deals out the services that match. */
export default function ServiceFinder() {
  const { byId } = useApp()
  const [goal, setGoal] = useState(null)
  const g = GOALS.find((x) => x.id === goal)
  const items = g ? g.picks.map((id) => byId[id]).filter(Boolean) : []
  return (
    <section className="relative py-16 sm:py-20" aria-labelledby="finder-title">
      <div className="container-w text-center">
        <p className="text-[13.5px] font-medium text-primary/60">لعبة صغيرة</p>
        <h2 id="finder-title" className="mt-1 font-display text-[1.75rem] font-bold leading-[1.45] text-primary sm:text-display-md">وش يناسب متجرك؟</h2>
        <p className="mx-auto mt-2 max-w-md text-[15px] leading-7 text-muted-foreground">اختر البطاقة اللي تشبهك، ونطلّع لك الخدمات المناسبة.</p>

        <div className="mx-auto mt-8 grid max-w-4xl grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
          {GOALS.map(({ id, icon: I, t, d }, i) => {
            const on = goal === id
            return (
              <button key={id} type="button" onClick={() => setGoal(on ? null : id)} aria-pressed={on}
                className={cn('group relative overflow-hidden rounded-[22px] p-5 text-start transition-[translate,box-shadow,background-color,rotate] duration-500 ease-[cubic-bezier(.34,1.56,.64,1)] hover:-translate-y-1.5 active:scale-[.97]',
                  on ? 'bg-primary text-on-inverse shadow-[0_26px_44px_-20px_rgb(9_56_46/0.8)] [rotate:-1.5deg]' : 'bg-[#fffdf7] text-primary shadow-[0_1px_2px_rgb(9_56_46/0.06),0_18px_34px_-24px_rgb(9_56_46/0.6)] ring-1 ring-primary/[0.07]')}
                style={{ transitionDelay: on ? '0ms' : `${i * 20}ms` }}>
                <span className={cn('grid size-12 place-items-center rounded-2xl transition-[background-color,rotate] duration-500 group-hover:rotate-[-8deg]', on ? 'bg-white/10' : 'bg-primary/[0.06]')}><I className="size-6" strokeWidth={1.6} /></span>
                <b className="mt-4 block text-[16px]">{t}</b>
                <span className={cn('mt-0.5 block text-[13.5px]', on ? 'text-on-inverse/70' : 'text-muted-foreground')}>{d}</span>
                <span className={cn('absolute top-4 end-4 size-3 rounded-full transition-colors', on ? 'bg-[#8fd3b6]' : 'bg-primary/10')} aria-hidden="true" />
              </button>
            )
          })}
        </div>
      </div>

      <div className="container-w" aria-live="polite">
        {g ? (
          <div key={g.id} className="mx-auto mt-10 max-w-[980px]">
            <div className="mb-6 flex items-center justify-center gap-3 text-[14px] text-primary/70">
              <span>هذي الخدمات اللي تناسب «{g.t}»</span>
              <button type="button" onClick={() => setGoal(null)} className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-primary ring-1 ring-primary/15 hover:bg-primary/5"><RotateCcw className="size-3.5" />من جديد</button>
            </div>
            <ul className="grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 lg:grid-cols-4">
              {items.map((p, i) => (
                <li key={p.id} className="motion-safe:animate-[deal-in_700ms_cubic-bezier(.34,1.56,.64,1)_both]" style={{ animationDelay: `${i * 110}ms` }}>
                  <ServiceTicket p={p} className="h-full" />
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="mt-8 text-center text-[13px] text-primary/40">↑ اضغط على أي بطاقة</p>
        )}
      </div>
    </section>
  )
}
