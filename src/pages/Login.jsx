import { useState } from 'react'
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom'
import { ShieldCheck, Receipt, Heart } from 'lucide-react'
import { api, isDemo } from '@/lib/api.js'
import { DEMO_ADMIN } from '@/lib/local.js'
import { useApp } from '@/state.jsx'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Field, Input } from '@/components/ui/kit.jsx'

const PERKS = [
  { icon: Receipt, t: 'تتبّع كل طلب لحظة بلحظة' },
  { icon: Heart, t: 'أمنياتك محفوظة على أي جهاز' },
  { icon: ShieldCheck, t: 'دفع آمن عبر Tap' },
]

export default function Login() {
  const { user, authReady, notify } = useApp()
  const [params] = useSearchParams()
  const next = params.get('next') || ''
  const nav = useNavigate()
  const [mode, setMode] = useState('in')
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' })
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(false)

  if (authReady && user) return <Navigate to={next || (user.role === 'admin' ? '/admin' : '/account')} replace />

  const submit = async (e) => {
    e.preventDefault(); setErr(''); setBusy(true)
    try {
      const u = mode === 'in' ? await api.signIn(form.email, form.password) : await api.signUp(form)
      notify(mode === 'in' ? `أهلاً ${u.name || ''}` : 'تم إنشاء حسابك')
      nav(next || (u.role === 'admin' ? '/admin' : '/account'), { replace: true })
    } catch (e2) { setErr(e2.message) } finally { setBusy(false) }
  }
  const f = (k) => ({ value: form[k], onChange: (e) => setForm({ ...form, [k]: e.target.value }) })
  const swap = (m) => { setMode(m); setErr('') }

  return (
    <div className="container-w grid items-stretch gap-8 py-10 sm:py-16 lg:grid-cols-[1fr_480px]">
      <aside className="relative hidden overflow-hidden rounded-xl bg-inverse p-10 text-on-inverse lg:flex lg:flex-col lg:justify-between">
        <div className="grid size-24 place-items-center rounded-lg bg-background p-3"><img src="/logo.png" alt="وارف" className="w-full" /></div>
        <div>
          <h2 className="text-balance font-display text-display-md font-bold leading-tight">حسابك هو لوحة متابعة متجرك.</h2>
          <ul className="mt-8 grid gap-4">
            {PERKS.map(({ icon: I, t }) => (
              <li key={t} className="flex items-center gap-3 text-[17px]"><span className="grid size-10 place-items-center rounded-full bg-accent text-accent-foreground"><I className="size-5" /></span>{t}</li>
            ))}
          </ul>
        </div>
        <span className="pointer-events-none absolute -bottom-24 -start-24 size-72 rounded-full border-[28px] border-accent/15" aria-hidden="true" />
      </aside>

      <div className="rounded-xl bg-surface p-6 shadow-card ring-1 ring-border sm:p-10">
        <h1 className="font-display text-display-sm font-bold text-primary">{mode === 'in' ? 'تسجيل الدخول' : 'حساب جديد'}</h1>
        <p className="mt-1 text-muted-foreground">{mode === 'in' ? 'تابع طلباتك وأمنياتك من مكان واحد.' : 'سجّل مرة وحدة، وتابع كل طلباتك من حسابك.'}</p>

        <div className="mt-6 grid grid-cols-2 rounded-full bg-sunken p-1" role="tablist">
          {[['in', 'دخول'], ['up', 'حساب جديد']].map(([m, l]) => (
            <button key={m} type="button" role="tab" aria-selected={mode === m} onClick={() => swap(m)}
              className={cn('h-11 rounded-full text-sm font-bold transition-colors', mode === m ? 'bg-primary text-accent shadow-hairline' : 'text-muted-foreground hover:text-primary')}>{l}</button>
          ))}
        </div>

        <form onSubmit={submit} className="mt-6 grid gap-4">
          {mode === 'up' && <Field label="الاسم"><Input required {...f('name')} autoComplete="name" /></Field>}
          <Field label="البريد الإلكتروني"><Input type="email" required {...f('email')} dir="ltr" autoComplete="email" /></Field>
          {mode === 'up' && <Field label="رقم الجوال"><Input required {...f('phone')} dir="ltr" inputMode="tel" placeholder="05xxxxxxxx" autoComplete="tel" /></Field>}
          <Field label="كلمة المرور" hint={mode === 'up' ? '6 أحرف على الأقل' : undefined}><Input type="password" required minLength={6} {...f('password')} dir="ltr" autoComplete={mode === 'in' ? 'current-password' : 'new-password'} /></Field>
          {err && <p className="rounded-md bg-danger-soft px-4 py-3 text-sm text-danger" role="alert">{err}</p>}
          <Button size="lg" disabled={busy} className="mt-2 w-full">{busy ? 'لحظة…' : mode === 'in' ? 'دخول' : 'أنشئ حسابي'}</Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          بالمتابعة توافق على <Link to="/policies" className="font-semibold text-primary underline underline-offset-4">السياسات والشروط</Link>
        </p>

        {isDemo && (
          <div className="mt-6 rounded-md border-2 border-dashed border-accent bg-accent/10 p-4 text-sm leading-7">
            <strong>وضع العرض</strong> — البيانات محفوظة في متصفحك فقط. دخول الإدارة:{' '}
            <button type="button" className="font-bold text-primary underline underline-offset-4" onClick={() => { setMode('in'); setForm({ ...form, email: DEMO_ADMIN.email, password: DEMO_ADMIN.password }) }}>
              <span dir="ltr">{DEMO_ADMIN.email}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
