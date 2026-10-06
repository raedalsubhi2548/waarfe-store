import { Link } from 'react-router-dom'
import { MessageCircle, ArrowLeft } from 'lucide-react'
import Icon from '@/components/Icon.jsx'
import Social from '@/components/Social.jsx'
import PayIcons from '@/components/brand/PayIcons.jsx'
import { Medallion, ArchPattern, Sprig } from '@/components/brand/Ornaments.jsx'
import { useApp } from '@/state.jsx'
import { WHATSAPP, waLink } from '@/lib/format.js'

export default function SiteFooter() {
  const { categories } = useApp()
  const col = 'mb-4 flex items-center gap-2 text-[13px] font-semibold tracking-wide text-accent'
  const item = 'group flex min-h-9 items-center gap-2 text-[14px] text-on-inverse/75 transition-colors hover:text-accent'
  return (
    <footer className="relative mt-32 text-on-inverse">
      {/* arched top edge */}
      <svg viewBox="0 0 1440 120" preserveAspectRatio="none" className="absolute inset-x-0 -top-[119px] h-[120px] w-full" aria-hidden="true">
        <path d="M0 120 V60 Q720 -40 1440 60 V120 Z" fill="#09382e" />
        <path d="M0 62 Q720 -36 1440 62" fill="none" stroke="#d7c676" strokeOpacity=".55" strokeWidth="1.2" />
      </svg>
      <div className="relative overflow-hidden bg-[radial-gradient(80%_60%_at_50%_0%,#0f4a3d,#09382e_60%,#062a22)]">
        <ArchPattern className="opacity-70" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2"><Medallion size="lg" /></div>

        <div className="container-w relative pt-24 pb-10">
          <div className="mx-auto max-w-xl text-center">
            <p className="text-balance text-[17px] leading-8 text-on-inverse/85">نبني متجرك ونسوّقه ونجهّز أوراقه الرسمية، من جهة وحدة.</p>
            <a href={waLink('السلام عليكم، أبي أستفسر عن خدمات وارف')} target="_blank" rel="noreferrer"
              className="group relative mt-6 inline-flex items-center gap-3 overflow-hidden rounded-full bg-[linear-gradient(135deg,#f3e3a1,#d7c676_45%,#b99a3e)] py-2.5 ps-3 pe-6 text-primary shadow-[0_14px_30px_-12px_rgb(215_198_118/0.7)]">
              <span className="grid size-10 place-items-center rounded-full bg-primary text-accent"><MessageCircle className="size-5" /></span>
              <span className="text-start leading-tight"><span className="block text-[11px] font-medium">كلّمنا على واتساب</span><b dir="ltr" className="tabular text-lg">0{WHATSAPP.slice(3)}</b></span>
              <span className="pointer-events-none absolute inset-y-0 left-[-60%] w-1/3 skew-x-[-20deg] bg-white/40 transition-[left] duration-700 group-hover:left-[130%]" aria-hidden="true" />
            </a>
          </div>

          <div className="mt-14 grid grid-cols-2 gap-x-6 gap-y-10 border-t border-accent/20 pt-10 sm:grid-cols-4">
            <nav aria-label="الأقسام">
              <h2 className={col}><span className="h-px w-4 bg-accent" />الأقسام</h2>
              <ul>{categories.map((c) => <li key={c.id}><Link to={`/c/${c.id}`} className={item}><Icon name={c.icon} size={15} />{c.name.replace(/^(ال)?خدمات\s/, '')}</Link></li>)}</ul>
            </nav>
            <nav aria-label="وارف">
              <h2 className={col}><span className="h-px w-4 bg-accent" />وارف</h2>
              <ul>
                <li><Link to="/work" className={item}>أعمالنا</Link></li>
                <li><Link to="/reviews" className={item}>آراء العملاء</Link></li>
                <li><Link to="/contact" className={item}>تواصل معنا</Link></li>
                <li><Link to="/policies" className={item}>السياسات والشروط</Link></li>
              </ul>
            </nav>
            <nav aria-label="حسابك">
              <h2 className={col}><span className="h-px w-4 bg-accent" />حسابك</h2>
              <ul>
                <li><Link to="/account" className={item}>تتبّع طلباتك</Link></li>
                <li><Link to="/account/wishlist" className={item}>أمنياتي</Link></li>
                <li><Link to="/cart" className={item}>السلة</Link></li>
                <li><Link to="/shop" className={item}>كل الخدمات<ArrowLeft className="size-3.5 opacity-0 transition-opacity group-hover:opacity-100" /></Link></li>
              </ul>
            </nav>
            <div className="col-span-2 sm:col-span-1">
              <h2 className={col}><span className="h-px w-4 bg-accent" />طرق الدفع</h2>
              <PayIcons size="sm" />
            </div>
          </div>

          <div className="mt-12 flex flex-col items-center gap-5">
            <Sprig className="text-accent" />
            <Social className="foot-social" />
            <p className="text-xs text-on-inverse/55">© {new Date().getFullYear()} وارف · وثيقة العمل الحر FL-164935115</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
