// Product options copied from the Salla store (Oct 2026): same names, same add-on prices.
// radio = pick one, checkbox = pick any. The live store reads these from products.options
// (supabase/options.sql); this file feeds the demo mode and the SQL generator.
const o = (id, name, type, required, values) => ({ id, name, type, required, values: values.map(([vid, vname, price]) => ({ id: vid, name: vname, price })) })

export const PRODUCT_OPTIONS = {
  'salla-store-design': [
    o('theme', 'اختار نوع الثيم ( مدفوع أو مجاني )', 'radio', true, [['free', 'الثيم المجاني بسلة', 0], ['paid', 'التصميم على ثيم مدفوع', 50]]),
    o('banners', 'تصميم بانرات اضافية', 'radio', false, [['b1', 'بانر واحد', 30], ['b3', 'عدد 3 بانرات', 90]]),
    o('product-images', 'تصميم صور المنتجات', 'radio', false, [['p1', 'منتج واحد', 15], ['p3', '3 منتجات', 45], ['p6', '6 منتجات', 90]]),
    o('category-images', 'تصميم صور أقسام اضافية', 'radio', false, [['c1', 'صورة وحدة', 15], ['c3', 'عدد 3 صور', 45], ['c6', 'عدد 6 صور اقسام', 90]]),
  ],
  'landing-page-design': [
    o('extras', 'الاضافات', 'checkbox', false, [['page1', 'صفحة اضافية', 100], ['pages3', '3 صفحات', 300], ['pages5', '5 صفحات', 500], ['payment', 'ربط بوابة الدفع ( يشمل التسجيل بالبوابة والمراسلات والربط البرمجي )', 300]]),
  ],
  'banner-design': [
    o('extras', 'الاضافات', 'checkbox', false, [['b1', 'اضافة بانر', 50], ['b5', 'اضافة 5 بانرات', 200]]),
  ],
  'ai-integration-chatgpt-claude-salla': [
    o('platform', 'المنصة اللي حاب تربطها', 'radio', true, [['chatgpt', 'ChatGPT', 0], ['claude', 'Claude', 0], ['both', 'جميعهم', 50]]),
  ],
  'pixel-integration': [
    o('services', 'الخدمات ..', 'checkbox', false, [['tiktok', 'TikTok Pixel', 50], ['meta', 'Meta Pixel (Facebook & Instagram)', 50]]),
  ],
  'google-tools-integration': [
    o('services', 'الخدمات ..', 'checkbox', false, [['gtm', 'Google Tag Manager', 50], ['gsc', 'Google Search Console', 50], ['gmc', 'Google Merchant Center', 50]]),
  ],
  'salla-subscription': [
    o('extras', 'الاضافات', 'radio', false, [['pro', 'سلة برو', 200]]),
  ],
  'salla-theme': [
    o('other-themes', 'ثيمات أخرى', 'radio', false, [['malak', 'ثيم ملاك', 11], ['celia', 'ثيم سيليا', 100]]),
  ],
}
