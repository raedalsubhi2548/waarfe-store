import { Link } from 'react-router-dom'
import { MessageCircle, ArrowLeft } from 'lucide-react'
import Icon from '@/components/Icon.jsx'
import Social from '@/components/Social.jsx'
import PayIcons from '@/components/brand/PayIcons.jsx'
import { useApp } from '@/state.jsx'
import { WHATSAPP, waLink } from '@/lib/format.js'

/** The page settles into deep green: no hard edge, the logo sits clearly on cream. */
export default function SiteFooter() {
  const { categories } = useApp()
  const col = 'mb-4 text-[13px] font-semibold text-on-inverse/55'
  const item = 'group flex min-h-9 items-center gap-2 text-[14px] text-on-inverse/80 transition-colors hover:text-white'
  return (
    <footer className="relative mt-10 text-on-inverse">
      {/* cream melts into green */}
      <div className="h-40 bg-[linear-gradient(180deg,var(--background),#0d4436_85%,#09382e)] sm:h-56" aria-hidden="true" />
      <div className="relative overflow-hidden bg-[linear-gradient(180deg,#09382e,#062a22)]">
        <span className="pointer-events-none absolute -top-40 left-1/2 size-[700px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(255_255_255/0.06),transparent)]" aria-hidden="true" />

        <div className="container-w relative pb-10">
          {/* closing invitation */}
          <div className="mx-auto max-w-xl text-center">
            <h2 className="font-script text-[2rem] font-bold leading-[1.5] sm:text-[2.6rem]">محتار من وين تبدأ؟</h2>
            <p className="mt-2 text-[15.5px] leading-8 text-on-inverse/75">قل لنا وش نشاطك، ونرتّب لك اللي تحتاجه فعلاً.</p>
            <a href={waLink('السلام عليكم، أبي استشارة: من وين أبدأ متجري؟')} target="_blank" rel="noreferrer"
              className="mt-6 inline-flex items-center gap-3 rounded-full bg-background py-2 ps-2 pe-6 text-primary shadow-[0_18px_36px_-16px_rgb(0_0_0/0.6)] transition-transform hover:-translate-y-0.5">
              <span className="grid size-10 place-items-center rounded-full bg-primary text-on-inverse"><MessageCircle className="size-5" /></span>
              <span className="text-start leading-tight"><span className="block text-[11.5px] text-primary/70">استشرنا على واتساب</span><b dir="ltr" className="tabular text-[17px]">0{WHATSAPP.slice(3)}</b></span>
            </a>
          </div>

          <div className="mt-16 grid gap-10 border-t border-white/10 pt-12 lg:grid-cols-[1.1fr_2fr]">
            {/* brand */}
            <div className="flex flex-col items-center gap-4 text-center lg:items-start lg:text-start">
              <Link to="/" className="grid size-28 place-items-center rounded-[28px] bg-background p-4 shadow-[0_20px_40px_-20px_rgb(0_0_0/0.6)]" aria-label="وارف — الرئيسية">
                <img src="/logo.png" alt="وارف WAARFE" width="600" height="580" className="w-full" />
              </Link>
              <p className="max-w-xs text-[14.5px] leading-7 text-on-inverse/70">نصمم متجرك ونسوّقه ونجهّز أوراقه الرسمية، من جهة وحدة.</p>
              <Social className="foot-social" />
            </div>

            <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-4">
              <nav aria-label="الأقسام">
                <h2 className={col}>الأقسام</h2>
                <ul>{categories.map((c) => <li key={c.id}><Link to={`/c/${c.id}`} className={item}><Icon name={c.icon} size={15} className="opacity-60" />{c.name.replace(/^(ال)?خدمات\s/, '')}</Link></li>)}</ul>
              </nav>
              <nav aria-label="وارف">
                <h2 className={col}>وارف</h2>
                <ul>
                  <li><Link to="/work" className={item}>أعمالنا</Link></li>
                  <li><Link to="/reviews" className={item}>آراء العملاء</Link></li>
                  <li><Link to="/contact" className={item}>تواصل معنا</Link></li>
                  <li><Link to="/policies" className={item}>السياسات والشروط</Link></li>
                </ul>
              </nav>
              <nav aria-label="حسابك">
                <h2 className={col}>حسابك</h2>
                <ul>
                  <li><Link to="/account" className={item}>تتبّع طلباتك</Link></li>
                  <li><Link to="/account/wishlist" className={item}>أمنياتي</Link></li>
                  <li><Link to="/cart" className={item}>السلة</Link></li>
                  <li><Link to="/shop" className={item}>كل الخدمات<ArrowLeft className="size-3.5 opacity-0 transition-opacity group-hover:opacity-100" /></Link></li>
                </ul>
              </nav>
              <div className="col-span-2 sm:col-span-1">
                <h2 className={col}>طرق الدفع</h2>
                <PayIcons size="sm" />
              </div>
            </div>
          </div>

          <p className="mt-12 border-t border-white/10 pt-6 text-center text-xs text-on-inverse/50">© {new Date().getFullYear()} وارف · وثيقة العمل الحر FL-164935115</p>
        </div>
      </div>
    </footer>
  )
}
