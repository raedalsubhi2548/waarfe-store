import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useApp } from '../state.jsx'
import ProductCard from '../components/ProductCard.jsx'
import Icon from '../components/Icon.jsx'
import { money, effectivePrice, parseDescription, waLink } from '../lib/format.js'

// The canopy: each branch of the tree ends in a service category.
const LEAVES = [
  { x: 92, y: 118, id: 'government-services' },
  { x: 170, y: 52, id: 'subscriptions' },
  { x: 300, y: 30, id: 'design-services' },
  { x: 430, y: 52, id: 'marketing-services' },
  { x: 508, y: 118, id: 'digital-products' },
]

function Canopy({ categories }) {
  const byId = Object.fromEntries(categories.map((c) => [c.id, c]))
  return (
    <div className="canopy" aria-label="أقسام وارف">
      <svg viewBox="0 0 600 420" className="canopy-svg" aria-hidden="true">
        <path className="draw d1" d="M300 420V250" />
        <path className="draw d2" d="M300 300C300 230 240 190 170 175 120 165 98 140 92 118" />
        <path className="draw d3" d="M300 280C300 190 230 120 170 52" />
        <path className="draw d2" d="M300 250V30" />
        <path className="draw d3" d="M300 280C300 190 370 120 430 52" />
        <path className="draw d2" d="M300 300C300 230 360 190 430 175 480 165 502 140 508 118" />
        {LEAVES.map((l, i) => <circle key={l.id} className="node" style={{ animationDelay: `${1.1 + i * 0.12}s` }} cx={l.x} cy={l.y} r="7" />)}
      </svg>
      {LEAVES.map((l, i) => byId[l.id] && (
        <Link key={l.id} to={`/c/${l.id}`} className="leaf" style={{ insetInlineStart: `${100 - (l.x / 600) * 100}%`, top: `${(l.y / 420) * 100}%`, animationDelay: `${1.2 + i * 0.12}s` }}>
          <Icon name={byId[l.id].icon} size={16} /><span className="leaf-full">{byId[l.id].name}</span><span className="leaf-short">{byId[l.id].name.replace(/^(ال)?خدمات\s/, '')}</span>
        </Link>
      ))}
    </div>
  )
}

const JOURNEY = [
  { title: 'وثّق نشاطك', text: 'سجل تجاري أو وثيقة عمل حر، ثم توثيق المتجر في منصة الأعمال.', ids: ['issue-commercial-registration-saudi', 'freelance-certificate-family-platform', 'business-verification'] },
  { title: 'جهّز متجرك', text: 'اشتراك سلة، دومين باسمك، ثيم احترافي، وتصميم كامل جاهز للبيع.', ids: ['salla-subscription', 'buy-domain', 'salla-theme', 'salla-store-design'] },
  { title: 'فعّل الدفع والتتبع', text: 'تقسيط تابي وتمارا، البكسل، وأدوات قوقل لتعرف وش يصير في متجرك.', ids: ['tabby-registration', 'tmara-registration', 'pixel-integration', 'google-tools-integration'] },
  { title: 'سوّق وأدر بذكاء', text: 'حملات سناب وتيك توك وإنستغرام، وربط متجرك بـ ChatGPT وClaude.', ids: ['snapchat-ads-creation', 'tiktok-ads-creation', 'instagram-ads-creation', 'ai-integration-chatgpt-claude-salla'] },
]

export default function Home() {
  const { categories, products, byId, addToCart, catalogReady } = useApp()
  const [tab, setTab] = useState('all')
  const shown = useMemo(() => (tab === 'all' ? [...products].sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0)).slice(0, 8) : products.filter((p) => p.categoryId === tab)), [tab, products])
  const flagship = byId['salla-store-design']
  const guide = byId['waarfe-ai-ad-campaigns-guide']
  const flagshipDesc = flagship ? parseDescription(flagship.description) : null

  return (
    <>
      <section className="hero">
        <div className="wrap hero-grid">
          <div className="hero-copy">
            <h1>من أول ورقة رسمية،<br />لأول طلب في متجرك.</h1>
            <p className="lead">وارف يصمم متجرك في سلة، يطلق حملاتك، ويجهّز سجلك ووثيقتك وتوثيقك. كل خدمة بسعر واضح، تطلبها وتتابعها من حسابك.</p>
            <div className="hero-cta">
              <Link to="/shop" className="btn btn-gold btn-lg">تصفّح الخدمات</Link>
              <Link to="/p/salla-store-design" className="btn btn-line-light btn-lg">اطلب تصميم متجرك</Link>
            </div>
            <dl className="hero-facts">
              <div><dt>{products.length || '—'}</dt><dd>خدمة بسعر ثابت</dd></div>
              <div><dt dir="ltr">2–6</dt><dd>أيام لتسليم المتجر</dd></div>
              <div><dt>سلة</dt><dd>نشتغل عليها يومياً</dd></div>
            </dl>
          </div>
          <Canopy categories={categories} />
        </div>
      </section>

      <section className="section journey">
        <div className="wrap">
          <header className="sec-head">
            <h2>مسار متجرك معنا</h2>
            <p>اختر من أي مرحلة تبدأ. كل مرحلة فيها الخدمات اللي تحتاجها بالترتيب.</p>
          </header>
          <ol className="journey-list">
            {JOURNEY.map((s, i) => (
              <li key={s.title}>
                <span className="step-n" aria-hidden="true">{i + 1}</span>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
                <ul className="chips">
                  {s.ids.map((id) => byId[id] && <li key={id}><Link to={`/p/${id}`}>{byId[id].name.replace(/^(إصدار|إنشاء حملة إعلانية على|شراء|خدمة)\s/, '')}</Link></li>)}
                </ul>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {flagship && (
        <section className="section flagship">
          <div className="wrap flagship-grid">
            <div className="flagship-media"><img src={flagship.image} alt={flagship.name} /></div>
            <div className="flagship-copy">
              <span className="tag-gold">{flagship.badge}</span>
              <h2>{flagship.name}</h2>
              <p className="lead-dark">{flagship.summary}</p>
              <ul className="ticks">
                {(flagshipDesc.sections.find((s) => s.title.startsWith('تفاصيل'))?.items || []).map((t) => <li key={t}><Icon name="check" size={18} />{t}</li>)}
              </ul>
              <div className="flagship-buy">
                <strong className="big-price">{money(effectivePrice(flagship))}</strong>
                <button className="btn btn-primary btn-lg" onClick={() => addToCart(flagship.id)}>أضف للسلة</button>
                <Link to={`/p/${flagship.id}`} className="link-u">كل التفاصيل</Link>
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="section catalog" id="catalog">
        <div className="wrap">
          <header className="sec-head row-between">
            <h2>كل الخدمات</h2>
            <Link to="/shop" className="link-u">عرض بالفلاتر</Link>
          </header>
          <div className="tabs" role="tablist" aria-label="تصفية حسب القسم">
            <button role="tab" aria-selected={tab === 'all'} onClick={() => setTab('all')}>الكل <i>{products.length}</i></button>
            {categories.map((c) => (
              <button key={c.id} role="tab" aria-selected={tab === c.id} onClick={() => setTab(c.id)}>
                {c.name} <i>{products.filter((p) => p.categoryId === c.id).length}</i>
              </button>
            ))}
          </div>
          <div className="grid">
            {!catalogReady && Array.from({ length: 8 }, (_, i) => <div key={i} className="pcard skeleton" />)}
            {shown.map((p) => <ProductCard key={p.id} p={p} />)}
          </div>
          {tab === 'all' && products.length > 8 && (
            <div className="center more"><Link to="/shop" className="btn btn-ghost btn-lg">عرض كل الخدمات ({products.length})</Link></div>
          )}
        </div>
      </section>

      {guide && (
        <section className="section guide">
          <div className="wrap guide-grid">
            <div className="guide-copy">
              <h2>{guide.name}</h2>
              <p>{guide.summary}</p>
              <div className="guide-buy">
                <strong className="big-price">{money(effectivePrice(guide))}</strong>
                {guide.salePrice && <s>{money(guide.price)}</s>}
              </div>
              <div className="row-gap">
                <button className="btn btn-gold btn-lg" onClick={() => addToCart(guide.id)}>احصل على الدليل</button>
                <Link to={`/p/${guide.id}`} className="btn btn-line-light btn-lg">وش بداخله</Link>
              </div>
            </div>
            <div className="guide-book"><img src={guide.image} alt={guide.name} /></div>
          </div>
        </section>
      )}

      <section className="section talk">
        <div className="wrap talk-row">
          <div>
            <h2>محتار من وين تبدأ؟</h2>
            <p>قل لنا وش نشاطك ووين وصلت، ونرتّب لك الخدمات اللي تحتاجها فعلاً.</p>
          </div>
          <a className="btn btn-primary btn-lg" href={waLink('السلام عليكم، أبي استشارة: من وين أبدأ متجري؟')} target="_blank" rel="noreferrer">
            <Icon name="whatsapp" size={20} /> استشرنا على واتساب
          </a>
        </div>
      </section>
    </>
  )
}
