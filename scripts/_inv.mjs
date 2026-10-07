import { invoicePdf } from '../api/_invoice.js'
import fs from 'fs'
const order = { number: 1024, status: 'paid', payment_method: 'card', payment_ref: 'chg_TS0123456789', created_at: new Date().toISOString(), subtotal: 749, discount: 74.9, coupon: 'RAED10', total: 674.1,
  customer: { name: 'عبدالله محمد', email: 'abdullah@example.com', phone: '0551234567' },
  items: [{ name: 'تصميم متجر في سلة', qty: 1, price: 300 }, { name: 'ربط متجرك بالذكاء الاصطناعي ChatGPT و Claude', qty: 1, price: 50 }, { name: 'تصميم صفحة هبوط (برمجة مخصصة)', qty: 2, price: 399 }] }
fs.writeFileSync(process.argv[2], await invoicePdf(order, { name: 'رائد', email: 'info@rraed.com', phone: '0536090915', site: 'rraed.com' }))
