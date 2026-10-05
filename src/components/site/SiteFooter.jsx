import { Link } from 'react-router-dom'
import { MessageCircle } from 'lucide-react'
import Icon from '@/components/Icon.jsx'
import Social from '@/components/Social.jsx'
import { useApp } from '@/state.jsx'
import { WHATSAPP, waLink } from '@/lib/format.js'

export default function SiteFooter() {
  const { categories } = useApp()
  const col = 'font-display text-sm font-semibold text-accent mb-3'
  const item = 'flex min-h-9 items-center gap-2 text-[14px] text-on-inverse/80 hover:text-on-inverse'
  return (
    <footer className="mt-24 bg-inverse text-on-inverse">
      <div className="container-w py-10">
        <div className="flex flex-wrap items-center justify-between gap-5 border-b border-accent/20 pb-8">
          <div className="flex items-center gap-4">
            <span className="rounded-lg bg-background p-2"><img src="/logo.png" alt="وارف" width="600" height="580" className="h-14 w-auto" /></span>
            <p className="max-w-[30ch] text-[15px] text-on-inverse/80">نبني متجرك ونسوّقه ونجهّز أوراقه الرسمية، من جهة وحدة.</p>
          </div>
          <a href={waLink('السلام عليكم، أبي أستفسر عن خدمات وارف')} target="_blank" rel="noreferrer" className="flex w-full items-center justify-center gap-3 rounded-lg bg-accent px-5 py-3 text-accent-foreground sm:w-auto">
            <MessageCircle className="size-6" />
            <span className="leading-tight"><span className="block text-xs">كلّمنا على واتساب</span><b dir="ltr" className="tabular text-lg">0{WHATSAPP.slice(3)}</b></span>
          </a>
        </div>

        <div className="grid grid-cols-2 gap-x-6 gap-y-8 py-8 sm:grid-cols-3">
          <nav aria-label="الأقسام">
            <h2 className={col}>الأقسام</h2>
            <ul>{categories.map((c) => <li key={c.id}><Link to={`/c/${c.id}`} className={item}><Icon name={c.icon} size={15} />{c.name.replace(/^(ال)?خدمات\s/, '')}</Link></li>)}</ul>
          </nav>
          <nav aria-label="حسابك">
            <h2 className={col}>حسابك</h2>
            <ul>
              <li><Link to="/account" className={item}><Icon name="receipt" size={15} />تتبّع طلباتك</Link></li>
              <li><Link to="/account/wishlist" className={item}><Icon name="heart" size={15} />أمنياتي</Link></li>
              <li><Link to="/cart" className={item}><Icon name="bag" size={15} />السلة</Link></li>
              <li><Link to="/policies" className={item}><Icon name="shield" size={15} />السياسات والشروط</Link></li>
            </ul>
          </nav>
          <div className="col-span-2 sm:col-span-1">
            <h2 className={col}>طرق الدفع</h2>
            <ul className="flex flex-wrap gap-2">
              {['مدى', 'Apple Pay', 'Visa', 'Mastercard', 'تحويل بنكي'].map((m) => <li key={m} className="rounded-xs border border-accent/30 px-2.5 py-1 text-xs">{m}</li>)}
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-center gap-4 border-t border-accent/20 pt-6 sm:flex-row sm:justify-between">
          <Social className="foot-social" />
          <p className="text-xs text-on-inverse/60">© {new Date().getFullYear()} وارف · وثيقة العمل الحر FL-164935115</p>
        </div>
      </div>
    </footer>
  )
}
