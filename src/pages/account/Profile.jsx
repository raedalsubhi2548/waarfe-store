import { useState } from 'react'
import { api } from '../../lib/api.js'
import { useApp } from '../../state.jsx'

export default function Profile() {
  const { user, notify } = useApp()
  const [form, setForm] = useState({ name: user?.name || '', phone: user?.phone || '' })
  const [busy, setBusy] = useState(false)
  const save = async (e) => {
    e.preventDefault(); setBusy(true)
    try { await api.updateProfile(form); notify('تم حفظ بياناتك') } catch (e2) { notify(e2.message, 'err') } finally { setBusy(false) }
  }
  return (
    <form className="panel narrow stack" onSubmit={save}>
      <label className="field"><span>الاسم</span><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></label>
      <label className="field"><span>رقم الجوال</span><input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} dir="ltr" /></label>
      <label className="field"><span>البريد الإلكتروني</span><input value={user?.email || ''} readOnly dir="ltr" /></label>
      <button className="btn btn-primary" disabled={busy}>{busy ? 'جاري الحفظ…' : 'حفظ التغييرات'}</button>
    </form>
  )
}
