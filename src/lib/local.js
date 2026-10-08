// Demo backend: everything lives in this browser's localStorage.
// Same interface as supa.js so the UI never knows which one is running.
import { seedCategories, seedProducts } from '../data/seed.js'

const K = (k) => `raed:${k}`
const SEED_VERSION = '2026-10-05'

function read(key, fallback) {
  try {
    const v = localStorage.getItem(K(key))
    return v ? JSON.parse(v) : fallback
  } catch { return fallback }
}
function write(key, value) {
  try { localStorage.setItem(K(key), JSON.stringify(value)) } catch { /* storage full or blocked */ }
}

async function hash(text) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode('raed::' + text))
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('')
}

// demo-only login, compiled out of the production bundle
export const DEMO_ADMIN = import.meta.env.DEV ? { email: 'admin@rraed.com', password: 'raed2026' } : null

async function ensureSeed() {
  if (read('seed') === SEED_VERSION) return
  const now = new Date().toISOString()
  write('categories', seedCategories)
  write('products', seedProducts.map((p) => ({ active: true, createdAt: now, ...p })))
  write('orders', read('orders', []))
  write('coupons', read('coupons', []))
  const users = read('users', [])
  if (DEMO_ADMIN && !users.some((u) => u.email === DEMO_ADMIN.email)) {
    users.push({
      id: 'u_admin', name: 'رائد', email: DEMO_ADMIN.email, phone: '', role: 'admin',
      pass: await hash(DEMO_ADMIN.password), createdAt: now,
    })
  }
  write('users', users)
  write('seed', SEED_VERSION)
}

const listeners = new Set()
const publicUser = (u) => u && { id: u.id, name: u.name, email: u.email, phone: u.phone, role: u.role, createdAt: u.createdAt }
function emit() { const u = sessionUser(); listeners.forEach((fn) => fn(u)) }
function sessionUser() {
  const id = read('session')
  return publicUser(read('users', []).find((u) => u.id === id))
}
const uid = (p) => p + Math.random().toString(36).slice(2, 10)
function requireUser() { const u = sessionUser(); if (!u) throw new Error('سجّل دخولك أولاً'); return u }
function requireAdmin() { const u = requireUser(); if (u.role !== 'admin') throw new Error('هذه الصفحة للإدارة فقط'); return u }

export const local = {
  mode: 'demo',
  ready: ensureSeed(),

  // ---------- auth ----------
  async currentUser() { await this.ready; return sessionUser() },
  onAuth(fn) { listeners.add(fn); return () => listeners.delete(fn) },
  async signIn(email, password) {
    await this.ready
    const u = read('users', []).find((x) => x.email.toLowerCase() === email.trim().toLowerCase())
    if (!u || u.pass !== (await hash(password))) throw new Error('البريد أو كلمة المرور غير صحيحة')
    write('session', u.id); emit(); return publicUser(u)
  },
  async signUp({ name, email, phone, password }) {
    await this.ready
    const users = read('users', [])
    if (users.some((x) => x.email.toLowerCase() === email.trim().toLowerCase())) throw new Error('هذا البريد مسجّل مسبقاً، سجّل دخولك بدلاً من ذلك')
    const u = { id: uid('u_'), name, email: email.trim(), phone, role: 'customer', pass: await hash(password), createdAt: new Date().toISOString() }
    users.push(u); write('users', users); write('session', u.id); emit(); return publicUser(u)
  },
  async signOut() { localStorage.removeItem(K('session')); emit() },
  async updateProfile(patch) {
    const me = requireUser()
    const users = read('users', []).map((u) => (u.id === me.id ? { ...u, name: patch.name ?? u.name, phone: patch.phone ?? u.phone } : u))
    write('users', users); emit(); return sessionUser()
  },

  // ---------- catalog ----------
  async getCategories() { await this.ready; return read('categories', []).sort((a, b) => a.sort - b.sort) },
  async getProducts({ includeHidden = false } = {}) {
    await this.ready
    return read('products', []).filter((p) => includeHidden || p.active)
  },
  async getProduct(id) { await this.ready; return read('products', []).find((p) => p.id === id) || null },
  async saveProduct(p) {
    requireAdmin()
    const list = read('products', [])
    const i = list.findIndex((x) => x.id === p.id)
    if (i >= 0) list[i] = { ...list[i], ...p }
    else list.push({ createdAt: new Date().toISOString(), active: true, ...p, id: p.id || uid('p_') })
    write('products', list); return p
  },
  async deleteProduct(id) { requireAdmin(); write('products', read('products', []).filter((p) => p.id !== id)) },
  async saveCategory(c) {
    requireAdmin()
    const list = read('categories', [])
    const i = list.findIndex((x) => x.id === c.id)
    if (i >= 0) list[i] = { ...list[i], ...c }; else list.push({ sort: list.length + 1, icon: 'spark', ...c, id: c.id || uid('c_') })
    write('categories', list)
  },
  async deleteCategory(id) {
    requireAdmin()
    if (read('products', []).some((p) => p.categoryId === id)) throw new Error('انقل منتجات هذا التصنيف أولاً ثم احذفه')
    write('categories', read('categories', []).filter((c) => c.id !== id))
  },
  async getSettings() { return read('settings', null) },
  async saveSettings(settings) { requireAdmin(); write('settings', settings) },
  async rebuildSite() { return { ok: false, reason: 'demo' } },
  async uploadImage(file) {
    return new Promise((res, rej) => {
      const r = new FileReader(); r.onload = () => res(r.result); r.onerror = rej; r.readAsDataURL(file)
    })
  },

  // ---------- orders ----------
  async createOrder(order) {
    await this.ready
    const me = sessionUser()
    const orders = read('orders', [])
    const now = new Date().toISOString()
    const o = {
      ...order, id: uid('o_'), number: 10000 + orders.length + 1, userId: me?.id || null,
      status: order.paymentMethod === 'card' ? 'paid' : 'pending', createdAt: now,
      history: order.paymentMethod === 'card'
        ? [{ status: 'pending', at: now }, { status: 'paid', at: now, note: 'دفع تجريبي في وضع العرض' }]
        : [{ status: 'pending', at: now, note: 'بانتظار التحويل البنكي' }],
    }
    orders.unshift(o); write('orders', orders); return o
  },
  async myOrders() { const me = requireUser(); return read('orders', []).filter((o) => o.userId === me.id) },
  async getOrder(id) {
    const me = requireUser()
    const o = read('orders', []).find((x) => x.id === id)
    if (!o || (o.userId !== me.id && me.role !== 'admin')) return null
    return o
  },
  async allOrders() { requireAdmin(); return read('orders', []) },
  async updateOrderStatus(id, status, note) {
    requireAdmin()
    const orders = read('orders', []).map((o) => (o.id === id
      ? { ...o, status, history: [...(o.history || []), { status, at: new Date().toISOString(), note: note || '' }] }
      : o))
    write('orders', orders)
  },

  // ---------- wishlist ----------
  async getWishlist() { const me = sessionUser(); return me ? read('wish:' + me.id, []) : read('wish:guest', []) },
  async setWishlist(ids) { const me = sessionUser(); write('wish:' + (me ? me.id : 'guest'), ids) },

  // ---------- customers & coupons ----------
  async listCustomers() {
    requireAdmin()
    const orders = read('orders', [])
    return read('users', []).filter((u) => u.role !== 'admin').map((u) => {
      const mine = orders.filter((o) => o.userId === u.id)
      return { ...publicUser(u), orders: mine.length, spent: mine.filter((o) => o.status !== 'cancelled').reduce((s, o) => s + o.total, 0) }
    })
  },
  async listCoupons() { requireAdmin(); return read('coupons', []) },
  async saveCoupon(c) {
    requireAdmin()
    const list = read('coupons', []).filter((x) => x.code !== c.code)
    list.push({ ...c, code: c.code.toUpperCase() }); write('coupons', list)
  },
  async deleteCoupon(code) { requireAdmin(); write('coupons', read('coupons', []).filter((c) => c.code !== code)) },
  async validateCoupon(code) {
    await this.ready
    const c = read('coupons', []).find((x) => x.code === code.trim().toUpperCase() && x.active)
    if (!c) throw new Error('الكود غير صالح أو منتهي')
    if (c.expiresAt && new Date(c.expiresAt) < new Date()) throw new Error('انتهت صلاحية هذا الكود')
    return c
  },

  // ---------- payments ----------
  async startPayment(order) { return { redirect: null, order } },
  async notifyOrder() {},
  async downloadInvoice() { throw new Error('الفاتورة متاحة في المتجر الحقيقي فقط') },
  async verifySignup() { throw new Error('غير متاح في وضع العرض') },
  async resendSignup() {},
  async sendResetCode() { throw new Error('غير متاح في وضع العرض') },
  async resetWithCode() { throw new Error('غير متاح في وضع العرض') },
  async downloadUrl(orderId, productId) {
    const o = await this.getOrder(orderId)
    if (!o || ['pending', 'cancelled'].includes(o.status)) throw new Error('يتاح التحميل بعد تأكيد الدفع')
    const p = read('products', []).find((x) => x.id === productId)
    if (!p?.fileUrl) throw new Error('الملف لم يُرفع بعد. أضف رابطه من لوحة التحكم.')
    return p.fileUrl
  },
}
