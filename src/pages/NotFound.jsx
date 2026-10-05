import { Link } from 'react-router-dom'
export default function NotFound() {
  return (
    <div className="page wrap center-page">
      <h1>الصفحة غير موجودة</h1>
      <p className="muted">الرابط قديم أو فيه خطأ. ارجع للخدمات وكمّل من هناك.</p>
      <Link to="/shop" className="btn btn-primary">تصفّح الخدمات</Link>
    </div>
  )
}
