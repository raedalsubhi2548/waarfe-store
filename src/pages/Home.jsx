import { useLayoutEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useApp } from '../state.jsx'
import ServiceRow from '../components/ServiceRow.jsx'
import Icon from '../components/Icon.jsx'
import { BANNERS, REVIEWS, FAQ } from '../data/content.js'
import { money, effectivePrice, parseDescription } from '../lib/format.js'

const STOPS = [
  { title: 'وثّق', text: 'سجل تجاري أو وثيقة عمل حر، ثم توثيق المتجر.', ids: ['issue-commercial-registration-saudi', 'freelance-certificate-family-platform', 'business-verification'] },
  { title: 'جهّز', text: 'اشتراك سلة، دومين، ثيم، وتصميم متجر كامل.', ids: ['salla-subscription', 'buy-domain', 'salla-theme', 'salla-store-design'] },
  { title: 'فعّل', text: 'تقسيط تابي وتمارا، البكسل، وأدوات قوقل.', ids: ['tabby-registration', 'tmara-registration', 'pixel-integration', 'google-tools-integration'] },
  { title: 'سوّق', text: 'حملات سناب وتيك توك وإنستغرام، وربط الذكاء الاصطناعي.', ids: ['snapchat-ads-creation', 'tiktok-ads-creation', 'instagram-ads-creation', 'ai-integration-chatgpt-claude-salla'] },
]
const ROAD = 'M985 70 C 880 70, 840 128, 740 128 S 600 40, 500 40 S 360 128, 260 128 S 110 70, 15 70'
const AT = [0.1, 0.37, 0.63, 0.9]

// The journey drawn as one road: four stops, tap a stop to see its services.
function Road() {
  const { byId } = useApp()
  const path = useRef()
  const [pts, setPts] = useState([])
  const [active, setActive] = useState(1)
  useLayoutEffect(() => {
    const el = path.current; if (!el) return
    const L = el.getTotalLength()
    setPts(AT.map((t) => { const p = el.getPointAtLength(L * t); return { x: p.x, y: p.y } }))
  }, [])
  const stop = STOPS[active]
  return (
    <div className="road">
      <div className="road-map">
        <svg viewBox="0 0 1000 170" className="road-svg" aria-hidden="true">
          <path ref={path} d={ROAD} className="road-asphalt" />
          <path d={ROAD} className="road-line" />
          {pts.map((p, i) => (
            <g key={i} className={'road-pin' + (i === active ? ' on' : '')} transform={`translate(${p.x} ${p.y})`}>
              <circle r="21" /><text dy="7" textAnchor="middle">{i + 1}</text>
            </g>
          ))}
        </svg>
        <div className="road-stops" role="tablist" aria-label="مراحل متجرك">
          {pts.map((p, i) => (
            <button
              key={i} role="tab" aria-selected={i === active} onClick={() => setActive(i)}
              style={{ insetInlineStart: `${100 - (p.x / 1000) * 100}%`, top: `${(p.y / 170) * 100}%` }}
            >
              <span className="sr">المرحلة {i + 1}: </span>{STOPS[i].title}
            </button>
          ))}
        </div>
      </div>
      <div className="road-detail" role="tabpanel">
        <p><b>{stop.title}</b> {stop.text}</p>
        <ul className="chips">
          {stop.ids.map((id) => byId[id] && <li key={id}><Link to={`/p/${id}`}>{byId[id].name}</Link></li>)}
        </ul>
      </div>
    </div>
  )
}

function Faq() {
  const [open, setOpen] = useState(0)
  return (
    <ul className="faq">
      {FAQ.map((f, i) => (
        <li key={f.q} className={open === i ? 'open' : ''}>
          <button aria-expanded={open === i} onClick={() => setOpen(open === i ? -1 : i)}>
            {f.q}<Icon name="plus" size={18} />
          </button>
          {open === i && <p>{f.a} {f.link && <Link className="link-u" to={f.link}>السياسات والشروط</Link>}</p>}
        </li>
      ))}
    </ul>
  )
}

function Banner({ b, className = '' }) {
  const img = <img src={b.src} alt={b.alt} width={b.w} height={b.h} loading={className.includes('hero') ? 'eager' : 'lazy'} />
  return b.to ? <Link to={b.to} className={'banner ' + className}>{img}</Link> : <div className={'banner ' + className}>{img}</div>
}

export default function Home() {
  const { categories, products, byId, addToCart, catalogReady } = useApp()
  const [tab, setTab] = useState('featured')
  const shown = useMemo(() => {
    if (tab === 'featured') return [...products].sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0)).slice(0, 6)
    return products.filter((p) => p.categoryId === tab)
  }, [tab, products])
  const flagship = byId['salla-store-design']
  const guide = byId['waarfe-ai-ad-campaigns-guide']
  const details = flagship ? parseDescription(flagship.description).sections.find((s) => s.title.startsWith('تفاصيل'))?.items || [] : []

  return (
    <>
      <h1 className="sr">وارف — تصميم متاجر سلة، صفحات هبوط، حملات إعلانية، وخدمات حكومية للمتاجر</h1>

      <section className="wrap hero-zone">
        <Banner b={BANNERS.hero} className="hero-banner" />
        <nav className="cat-doors" aria-label="أقسام المتجر">
          {categories.map((c) => (
            <Link key={c.id} to={`/c/${c.id}`} className="door">
              <span className="door-ic"><Icon name={c.icon} size={22} /></span>
              <span className="door-name">{c.name}</span>
              <span className="door-n">{products.filter((p) => p.categoryId === c.id).length} خدمة</span>
            </Link>
          ))}
        </nav>
      </section>

      <section className="wrap sec">
        <header className="sec-head">
          <h2>طريق متجرك</h2>
          <p>أربع محطات من الورق الرسمي لأول طلب. اختر محطتك.</p>
        </header>
        <Road />
      </section>

      <section className="wrap sec" id="services">
        <header className="sec-head row-between">
          <h2>الخدمات والأسعار</h2>
          <Link to="/shop" className="link-u">كل الخدمات ({products.length})</Link>
        </header>
        <div className="tabs" role="tablist" aria-label="تصفية حسب القسم">
          <button role="tab" aria-selected={tab === 'featured'} onClick={() => setTab('featured')}>الأكثر طلباً</button>
          {categories.map((c) => <button key={c.id} role="tab" aria-selected={tab === c.id} onClick={() => setTab(c.id)}>{c.name}</button>)}
        </div>
        {!catalogReady ? <div className="skeleton tall" /> : <ul className="slist">{shown.map((p) => <ServiceRow key={p.id} p={p} showCategory={tab === 'featured'} />)}</ul>}
      </section>

      <section className="wrap sec-tight"><Banner b={BANNERS.landing} className="promo-banner" /></section>

      {flagship && (
        <section className="sec flagship">
          <div className="wrap flagship-grid">
            <img className="flagship-img" src={flagship.image} alt={flagship.name} loading="lazy" />
            <div>
              <span className="tag-gold">{flagship.badge}</span>
              <h2>{flagship.name}</h2>
              <p className="lead-dark">{flagship.summary}</p>
              <ul className="ticks">{details.map((t) => <li key={t}><Icon name="check" size={16} />{t}</li>)}</ul>
              <div className="row-gap">
                <strong className="big-price">{money(effectivePrice(flagship))}</strong>
                <button className="btn btn-primary btn-lg" onClick={() => addToCart(flagship.id)}>أضف للسلة</button>
                <Link to={`/p/${flagship.id}`} className="link-u">التفاصيل</Link>
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="sec">
        <div className="wrap">
          <header className="sec-head"><h2>وش قالوا عن وارف</h2><p>تقييمات منشورة من عملاء متجرنا.</p></header>
        </div>
        <ul className="reviews">
          {REVIEWS.map((r) => (
            <li key={r.name}>
              <span className="stars" aria-label="5 من 5">★★★★★</span>
              <p>{r.text}</p>
              <footer><b>{r.name}</b>{r.city && <span>{r.city}</span>}</footer>
            </li>
          ))}
        </ul>
      </section>

      {guide && (
        <section className="wrap sec-tight">
          <div className="guide">
            <img src={guide.image} alt="" className="guide-book" loading="lazy" />
            <div className="guide-copy">
              <h2>{guide.name}</h2>
              <p>{guide.summary}</p>
              <div className="row-gap">
                <strong className="big-price">{money(effectivePrice(guide))}</strong>
                {guide.salePrice && <s>{money(guide.price)}</s>}
                <button className="btn btn-gold" onClick={() => addToCart(guide.id)}>احصل على الدليل</button>
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="wrap sec faq-sec">
        <header className="sec-head"><h2>أسئلة تتكرر</h2></header>
        <Faq />
      </section>

      <section className="wrap sec-tight"><Banner b={BANNERS.payments} className="pay-banner" /></section>
    </>
  )
}
