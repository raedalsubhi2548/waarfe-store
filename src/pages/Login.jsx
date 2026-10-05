import { useState } from 'react'
import { Navigate, useNavigate, useSearchParams } from 'react-router-dom'
import { api, isDemo } from '../lib/api.js'
import { DEMO_ADMIN } from '../lib/local.js'
import { useApp } from '../state.jsx'
import { Mark } from '../components/Logo.jsx'

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

  return (
    <div className="auth-page">
      <div className="auth-art" aria-hidden="true"><Mark size={220} /></div>
      <div className="auth-card">
        <h1>{mode === 'in' ? 'تسجيل الدخول' : 'حساب جديد'}</h1>
        <p className="muted">{mode === 'in' ? 'تابع طلباتك وأمنياتك من مكان واحد.' : 'سجّل مرة وحدة، وتابع كل طلباتك من حسابك.'}</p>
        <div className="seg" role="tablist">
          <button role="tab" aria-selected={mode === 'in'} onClick={() => { setMode('in'); setErr('') }}>دخول</button>
          <button role="tab" aria-selected={mode === 'up'} onClick={() => { setMode('up'); setErr('') }}>حساب جديد</button>
        </div>
        <form onSubmit={submit} className="stack">
          {mode === 'up' && <label className="field"><span>الاسم</span><input required {...f('name')} autoComplete="name" /></label>}
          <label className="field"><span>البريد الإلكتروني</span><input type="email" required {...f('email')} dir="ltr" autoComplete="email" /></label>
          {mode === 'up' && <label className="field"><span>رقم الجوال</span><input required {...f('phone')} dir="ltr" inputMode="tel" placeholder="05xxxxxxxx" autoComplete="tel" /></label>}
          <label className="field"><span>كلمة المرور</span><input type="password" required minLength={6} {...f('password')} dir="ltr" autoComplete={mode === 'in' ? 'current-password' : 'new-password'} /></label>
          {err && <p className="err" role="alert">{err}</p>}
          <button className="btn btn-primary btn-block btn-lg" disabled={busy}>{busy ? 'لحظة…' : mode === 'in' ? 'دخول' : 'أنشئ حسابي'}</button>
        </form>
        {isDemo && (
          <div className="note-demo">
            <strong>وضع العرض</strong> — البيانات محفوظة في متصفحك فقط. دخول الإدارة:
            <button type="button" className="link-u" onClick={() => { setMode('in'); setForm({ ...form, email: DEMO_ADMIN.email, password: DEMO_ADMIN.password }) }}>
              <span dir="ltr">{DEMO_ADMIN.email}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
