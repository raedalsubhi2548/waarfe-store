import { Link } from 'react-router-dom'
import { useApp } from '../../state.jsx'
import ServiceRow from '../../components/ServiceRow.jsx'

export default function Wishlist() {
  const { wishlist, byId, user } = useApp()
  const items = wishlist.map((id) => byId[id]).filter(Boolean)
  if (!items.length) return (
    <div className="empty big"><p>ما أضفت شي لأمنياتك. اضغط القلب على أي خدمة تبي ترجع لها.</p><Link className="btn btn-primary" to="/shop">تصفّح الخدمات</Link></div>
  )
  return (
    <>
      {!user && <p className="note-demo"><Link to="/login?next=/account/wishlist" className="link-u">سجّل دخولك</Link> عشان تحفظ أمنياتك في حسابك وتشوفها من أي جهاز.</p>}
      <ul className="slist">{items.map((p) => <ServiceRow key={p.id} p={p} showCategory />)}</ul>
    </>
  )
}
