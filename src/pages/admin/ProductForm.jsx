import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { api } from '../../lib/api.js'
import { useApp } from '../../state.jsx'
import Icon from '../../components/Icon.jsx'
import { parseDescription } from '../../lib/format.js'

const EMPTY = { name: '', price: '', salePrice: '', categoryId: '', image: '', badge: '', summary: '', description: '', featured: false, active: true, digital: false, perUnit: '', fileUrl: '', sort: 0 }
const slugify = (s) => s.trim().toLowerCase().replace(/[^\w؀-ۿ]+/g, '-').replace(/^-|-$/g, '').slice(0, 60) || 'product'

export default function ProductForm() {
  const { id } = useParams()
  const isNew = id === 'new'
  const nav = useNavigate()
  const { categories, refreshCatalog, notify } = useApp()
  const [p, setP] = useState(isNew ? EMPTY : null)
  const [busy, setBusy] = useState(false)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    if (!isNew) api.getProduct(id).then((x) => setP(x ? { ...EMPTY, ...x, salePrice: x.salePrice ?? '' } : EMPTY))
    else if (categories[0]) setP((x) => ({ ...x, categoryId: x.categoryId || categories[0].id }))
  }, [id, isNew, categories])
  if (!p) return <div className="skeleton tall" />

  const set = (k) => (e) => setP({ ...p, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value })
  const upload = async (e) => {
    const file = e.target.files?.[0]; if (!file) return
    setUploading(true)
    try { setP({ ...p, image: await api.uploadImage(file) }) } catch (er) { notify(er.message, 'err') } finally { setUploading(false) }
  }
  const save = async (e) => {
    e.preventDefault(); setBusy(true)
    try {
      const out = { ...p, price: Number(p.price), salePrice: p.salePrice === '' ? null : Number(p.salePrice), sort: Number(p.sort) || 0 }
      if (out.salePrice && out.salePrice >= out.price) throw new Error('سعر التخفيض لازم يكون أقل من السعر الأصلي')
      if (isNew) out.id = slugify(p.name) + '-' + Date.now().toString(36).slice(-4)
      await api.saveProduct(out); await refreshCatalog()
      notify(isNew ? 'أُضيف المنتج للمتجر' : 'تم حفظ المنتج'); nav('/admin/products')
    } catch (er) { notify(er.message, 'err') } finally { setBusy(false) }
  }
  const preview = parseDescription(p.description)

  return (
    <form onSubmit={save}>
      <header className="admin-head">
        <div><Link to="/admin/products" className="link-u small">المنتجات</Link><h1>{isNew ? 'منتج جديد' : p.name}</h1></div>
        <div className="row-gap">
          {!isNew && <Link to={`/p/${p.id}`} target="_blank" className="btn btn-ghost"><Icon name="eye" size={18} />معاينة</Link>}
          <button className="btn btn-primary" disabled={busy}>{busy ? 'جاري الحفظ…' : isNew ? 'أضف المنتج' : 'حفظ التغييرات'}</button>
        </div>
      </header>
      <div className="form-grid">
        <div className="stack">
          <section className="panel stack">
            <label className="field"><span>اسم المنتج</span><input required value={p.name} onChange={set('name')} /></label>
            <label className="field"><span>وصف قصير (يظهر تحت الاسم)</span><textarea rows={2} value={p.summary} onChange={set('summary')} /></label>
            <label className="field">
              <span>الوصف الكامل</span>
              <textarea rows={14} value={p.description} onChange={set('description')} className="mono-ish" />
              <small className="muted">الفقرة الأولى مقدمة. اكتب «## عنوان» لقسم جديد، و«- » قبل كل نقطة.</small>
            </label>
          </section>
          <section className="panel">
            <h2 className="panel-h">معاينة الأقسام</h2>
            <p className="muted small">{preview.intro || 'تظهر المقدمة هنا.'}</p>
            {preview.sections.map((s) => <div key={s.title} className="pd-sec mini"><h3>{s.title}</h3><ul>{s.items.map((i) => <li key={i}>{i}</li>)}</ul></div>)}
          </section>
        </div>
        <div className="stack">
          <section className="panel stack">
            <h2 className="panel-h">الصورة</h2>
            <div className="img-drop">
              {p.image ? <img src={p.image} alt="" /> : <span className="muted">ما فيه صورة</span>}
            </div>
            <label className="btn btn-ghost btn-block file-btn"><Icon name="upload" size={18} />{uploading ? 'جاري الرفع…' : 'ارفع صورة'}<input type="file" accept="image/*" onChange={upload} hidden /></label>
            <label className="field"><span>أو رابط الصورة</span><input value={p.image} onChange={set('image')} dir="ltr" /></label>
          </section>
          <section className="panel stack">
            <h2 className="panel-h">السعر والتصنيف</h2>
            <div className="fields-2">
              <label className="field"><span>السعر (ر.س)</span><input required type="number" min="0" step="0.01" value={p.price} onChange={set('price')} dir="ltr" /></label>
              <label className="field"><span>سعر التخفيض</span><input type="number" min="0" step="0.01" value={p.salePrice} onChange={set('salePrice')} dir="ltr" placeholder="اختياري" /></label>
            </div>
            <label className="field"><span>التصنيف</span>
              <select required value={p.categoryId} onChange={set('categoryId')}>{categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select>
            </label>
            <div className="fields-2">
              <label className="field"><span>شارة (اختياري)</span><input value={p.badge || ''} onChange={set('badge')} placeholder="جديدنا" /></label>
              <label className="field"><span>وحدة السعر</span><input value={p.perUnit || ''} onChange={set('perUnit')} placeholder="للمنتج" /></label>
            </div>
            <label className="field"><span>الترتيب داخل التصنيف</span><input type="number" value={p.sort} onChange={set('sort')} dir="ltr" /></label>
          </section>
          <section className="panel stack">
            <label className="check"><input type="checkbox" checked={p.active} onChange={set('active')} />ظاهر في المتجر</label>
            <label className="check"><input type="checkbox" checked={p.featured} onChange={set('featured')} />مميّز (يظهر أولاً)</label>
            <label className="check"><input type="checkbox" checked={p.digital} onChange={set('digital')} />منتج رقمي (ملف يحمّله العميل)</label>
            {p.digital && <label className="field"><span>رابط الملف (يظهر للعميل بعد الدفع فقط)</span><input value={p.fileUrl || ''} onChange={set('fileUrl')} dir="ltr" placeholder="مسار الملف في مخزن downloads" /></label>}
          </section>
        </div>
      </div>
    </form>
  )
}
