import { Landmark } from 'lucide-react'
import { cn } from '@/lib/utils'

// Official badges served by each provider / Salla's CDN (not redrawn).
export const PAY_METHODS = [
  { name: 'مدى', src: 'https://cdn.salla.network/images/payment/mada.png' },
  { name: 'Apple Pay', src: 'https://cdn.salla.network/images/payment/applepay.png' },
  { name: 'Visa', src: 'https://cdn.salla.network/images/payment/visa.png' },
  { name: 'Mastercard', src: 'https://cdn.salla.network/images/payment/mastercard.png' },
  { name: 'تمارا', src: 'https://cdn.tamara.co/assets/svg/tamara-logo-badge-ar.svg' },
  { name: 'تابي', src: 'https://cdn.tabby.ai/assets/logo.svg' },
]

export default function PayIcons({ className, bank = true, size = 'md' }) {
  const h = size === 'sm' ? 'h-8 w-12' : 'h-10 w-[60px]'
  return (
    <ul className={cn('flex flex-wrap gap-2', className)} aria-label="طرق الدفع">
      {PAY_METHODS.map((m) => (
        <li key={m.name} className={cn('grid place-items-center rounded-md bg-white px-1.5 shadow-hairline ring-1 ring-black/5', h)} title={m.name}>
          <img src={m.src} alt={m.name} loading="lazy" className="max-h-[60%] max-w-full object-contain" />
        </li>
      ))}
      {bank && (
        <li className={cn('grid place-items-center rounded-md bg-white px-1.5 text-primary shadow-hairline ring-1 ring-black/5', h)} title="تحويل بنكي">
          <span className="flex flex-col items-center leading-none"><Landmark className="size-4" /><span className="mt-0.5 text-[9px] font-bold">تحويل</span></span>
        </li>
      )}
    </ul>
  )
}
