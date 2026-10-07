-- Catalog imported from waarfe.com (Salla). Safe to re-run.
insert into public.categories (id, name, blurb, icon, sort) values ('design-services', 'خدمات التصميم', 'تصميم متاجر سلة، صفحات هبوط ببرمجة مخصصة، بنرات ولوجو.', 'pen', 1) on conflict (id) do update set name = excluded.name, blurb = excluded.blurb, icon = excluded.icon, sort = excluded.sort;
insert into public.categories (id, name, blurb, icon, sort) values ('marketing-services', 'خدمات التسويق', 'حملات سناب وتيك توك وإنستغرام، ربط البكسل وأدوات قوقل والذكاء الاصطناعي.', 'megaphone', 2) on conflict (id) do update set name = excluded.name, blurb = excluded.blurb, icon = excluded.icon, sort = excluded.sort;
insert into public.categories (id, name, blurb, icon, sort) values ('subscriptions', 'الاشتراكات', 'اشتراك سلة، الثيمات الاحترافية، وحجز الدومين الرسمي.', 'key', 3) on conflict (id) do update set name = excluded.name, blurb = excluded.blurb, icon = excluded.icon, sort = excluded.sort;
insert into public.categories (id, name, blurb, icon, sort) values ('government-services', 'الخدمات الحكومية', 'سجل تجاري، وثيقة عمل حر، توثيق المتجر، والتسجيل في تابي وتمارا.', 'seal', 4) on conflict (id) do update set name = excluded.name, blurb = excluded.blurb, icon = excluded.icon, sort = excluded.sort;
insert into public.categories (id, name, blurb, icon, sort) values ('digital-products', 'منتجات رقمية', 'أدلة عملية تحمّلها فوراً بعد الشراء.', 'book', 5) on conflict (id) do update set name = excluded.name, blurb = excluded.blurb, icon = excluded.icon, sort = excluded.sort;
insert into public.products (id, name, price, sale_price, category_id, image, badge, featured, sort, summary, description, active, digital, per_unit) values ('salla-store-design', 'تصميم متجر في سلة', 300, null, 'design-services', 'https://cdn.salla.sa/zvxNvp/445a5540-372a-49e7-a850-a20c1188e655-500x500-2iDddQUZOFOchpjOctqwg85nRjBF0sWQZKdTeSRS.jpg', 'الخدمة الأكثر طلباً', true, 1, 'متجر سلة متكامل جاهز للبيع من أول يوم: بنرات، أقسام، منتجات، شحن ودفع.', 'تصميم متجر سلة احترافي جاهز للبيع وزيادة المبيعات. نقدم لك خدمة تصميم متجر في سلة بشكل متكامل تساعدك على بدء البيع بسرعة مع تجربة مستخدم ممتازة وتنظيم احترافي يزيد من ثقة العميل ويرفع معدل التحويل. يتم تصميم المتجر حسب نشاطك التجاري مع تجهيز كامل للإعدادات والمنتجات ليكون جاهز للبيع من أول يوم.
## مميزات الخدمة
- تصميم مخصص حسب نشاطك التجاري
- متجر جاهز للبيع مع إعدادات كاملة
- سرعة تحميل عالية وتجربة مستخدم احترافية
- دعم فني بعد التسليم
## تفاصيل التصميم
- تصميم 3 بانرات رئيسية احترافية تعكس هوية العلامة التجارية
- إضافة حتى 10 منتجات مع وصف منسق وأسعار واضحة
- تصميم وإضافة 5 صور أقسام تنظّم المتجر
- إعداد الشحن والمدفوعات وربطها بشكل صحيح
- ربط حسابات التواصل الاجتماعي
## قبل طلب الخدمة
- التصميم على الثيم المجاني في سلة، والثيم المدفوع برسوم إضافية
- السعر لا يشمل اشتراك سلة أو شراء الثيمات المدفوعة
- الخدمة لا تشمل تصميم الشعار
## متطلبات البدء
- وثيقة العمل الحر
- شهادة الآيبان البنكي
- صورة الهوية الوطنية
## مدة التنفيذ
- من يومين إلى 6 أيام كحد أقصى
## سياسة التعديلات
- تعديلان فقط بعد مرور يوم من التسليم، وأي تعديل إضافي برسوم منفصلة', true, false, null) on conflict (id) do nothing;
insert into public.products (id, name, price, sale_price, category_id, image, badge, featured, sort, summary, description, active, digital, per_unit) values ('landing-page-design', 'تصميم صفحة هبوط (برمجة مخصصة)', 399, null, 'design-services', 'https://cdn.salla.sa/zvxNvp/3f17aace-af9c-4009-a569-106e3c331ea1-500x500-8jLI2QhaiNa8vi2E1dwVwVpfQEvn826CX7S6a8BN.jpg', 'جديدنا', true, 2, 'صفحة هبوط مستقلة مبرمجة بـ HTML وCSS وJavaScript، بدون اشتراكات، مع دومين واستضافة سنة هدية.', 'صفحة الهبوط هي العامل الأساسي في تحويل الزائر إلى عميل لأنها توجهه لقرار واحد واضح وهو الشراء. نصممها لك مخصصة بالكامل ببرمجة خاصة باستخدام HTML وCSS وJavaScript لضمان سرعة عالية وأداء قوي وتجربة مستخدم احترافية، حسب نشاطك وهدفك ومع مراعاة سلوك العميل.
## مميزات الخدمة
- تصميم مخصص حسب نشاطك وهدفك
- تجربة مستخدم مدروسة ترفع نسبة التحويل
- سرعة تحميل عالية
- صفحة مستقلة بدون اشتراكات
- تسليم كامل لجميع الملفات
## مميزات إضافية
- إمكانية ربط Google Analytics وGoogle Search Console
- إمكانية ربط البكسلات الإعلانية
- مناسبة للحملات التسويقية والمنتجات الفردية
- هدية دومين واستضافة لمدة سنة كاملة مجاناً
## تفاصيل الخدمة
- تصميم صفحة واحدة
- تعديلان فقط
- تسليم كامل للملفات بعد الانتهاء', true, false, null) on conflict (id) do nothing;
insert into public.products (id, name, price, sale_price, category_id, image, badge, featured, sort, summary, description, active, digital, per_unit) values ('banner-design', 'تصميم بنر إعلاني', 50, null, 'design-services', 'https://cdn.salla.sa/zvxNvp/5ff3feac-a1ac-4913-ac3f-52feba5e6970-500x500-QNO4DgjZwroJmnuRkn4fvgHk7dEBPWTBxozLbsYH.jpg', null, false, 3, 'بنر بجودة عالية بمقاسات سلة أو السوشيال، بنص تسويقي واضح داخل التصميم.', 'نصمم لك بنراً إعلانياً يعرض منتجاتك وعروضك بأسلوب بصري قوي يلفت نظر العميل ويرفع التفاعل والشراء، بمقاسات مناسبة لسلة أو منصات التواصل، مع مراعاة هويتك وتناسق الألوان والخطوط.
## مميزات الخدمة
- بنر بجودة عالية ومقاسات مناسبة للمتجر أو السوشيال ميديا
- ألوان وخطوط متوافقة مع هوية المتجر
- نص تسويقي واضح وجذاب داخل التصميم
- تصميم يبرز العرض أو المنتج مباشرة
## ملاحظات الخدمة
- لا تشمل تصوير المنتجات
- تزوّدنا بالصور أو المحتوى جاهزاً
- يحق لك طلب تعديل واحد بعد التسليم
## آلية التنفيذ
- بعد تأكيد الطلب نتواصل معك لتحديد نوع البنر والمقاسات والأفكار', true, false, null) on conflict (id) do nothing;
insert into public.products (id, name, price, sale_price, category_id, image, badge, featured, sort, summary, description, active, digital, per_unit) values ('logo-design', 'تصميم لوجو احترافي', 50, null, 'design-services', 'https://cdn.salla.sa/zvxNvp/f11cc346-3f40-4016-934c-3eb3b6a9ce5c-500x500-8h3o96mNzUp4kYAvJozyXIcT4zADVf3hom6jhsLq.jpg', null, false, 4, 'شعار مبتكر يعبّر عن نشاطك، يسلَّم بجودة عالية وبصيغ متعددة.', 'الشعار أول ما يراه العميل. نصمم لك لوجو يبني هوية بصرية قوية لمشروعك، بألوان وخطوط مدروسة تعطي انطباعاً احترافياً وتزيد ثقة العميل.
## مميزات الخدمة
- لوجو مبتكر يعبر عن نشاطك التجاري
- ألوان وخطوط متناسقة مع هوية المشروع
- تصميم واضح وسهل التذكر
- تسليم بجودة عالية وصيغ متعددة
## ملاحظات الخدمة
- لا تشمل تقليد أو إعادة تصميم شعارات جاهزة
- يحق لك طلب تعديل واحد بعد التسليم
## آلية التنفيذ
- بعد الطلب نتواصل معك لمعرفة نشاطك والألوان المفضلة والأفكار المطلوبة', true, false, null) on conflict (id) do nothing;
insert into public.products (id, name, price, sale_price, category_id, image, badge, featured, sort, summary, description, active, digital, per_unit) values ('add-product-options', 'إضافة منتج مع الخيارات والكميات', 6, null, 'design-services', 'https://cdn.salla.sa/zvxNvp/062a16d7-f24f-4347-9976-81af0790bb2a-500x500-rukrq8BJMDoiMW0rAeXvYIT3VOoxXiOg6R71CAV1.jpg', null, false, 5, 'إضافة منتج بكل خياراته (مقاسات، ألوان، روائح) مع أسعار كل خيار وصوره.', 'نضيف منتجك في سلة مع تجهيز كامل للبيانات والخيارات بطريقة تساعد العميل يفهم المنتج ويقرر بسرعة. الخدمة مخصصة للمنتجات اللي فيها مقاسات أو ألوان أو أي متغيرات.
## تشمل الخدمة
- إدخال اسم المنتج بشكل واضح وجذاب
- كتابة وصف منسق
- إعداد خيارات المنتج مثل المقاسات أو الألوان أو الروائح
- تحديد الأسعار لكل خيار عند الحاجة
- رفع صور المنتج والخيارات
## ملاحظات الخدمة
- لا تشمل تصميم أو تعديل الصور
- تزوّدنا بالصور والخيارات جاهزة', true, false, 'للمنتج') on conflict (id) do nothing;
insert into public.products (id, name, price, sale_price, category_id, image, badge, featured, sort, summary, description, active, digital, per_unit) values ('add-products', 'إضافة منتج جاهز', 3, null, 'design-services', 'https://cdn.salla.sa/zvxNvp/8096e339-8c47-4586-b5b8-11416a9180d2-500x500-hGUXZfIiOptGvN3tbLcPMXFAn5jZLNJTNxNhFEox.jpg', null, false, 6, 'إدخال المنتجات الجاهزة (بدون خيارات) بالاسم والوصف والسعر والصور.', 'نُدخل منتجاتك الجاهزة في متجر سلة ونرتبها بشكل يسهّل على العميل التصفح ويزيد فرص الشراء.
## تشمل الخدمة
- إدخال اسم المنتج بصياغة واضحة وجذابة
- كتابة وصف منسق
- إضافة السعر بدقة
- رفع الصور التي تزوّدنا بها وفق متطلبات سلة
## مهم
- الخدمة للمنتجات الجاهزة فقط بدون خيارات
- لا تشمل تصميم أو تعديل الصور', true, false, 'للمنتج') on conflict (id) do nothing;
insert into public.products (id, name, price, sale_price, category_id, image, badge, featured, sort, summary, description, active, digital, per_unit) values ('ai-integration-chatgpt-claude-salla', 'ربط متجرك بالذكاء الاصطناعي ChatGPT و Claude', 50, null, 'marketing-services', 'https://cdn.salla.sa/zvxNvp/d056639d-6f09-4d54-86e4-c3a9a8cdc856-500x500-QRCXJs2okSSSRhNDoeYO8VivUQjoatEI2oWFtdqT.webp', 'عرض محدود', true, 1, 'أدر طلباتك ومنتجاتك ومخزونك وتقاريرك بأوامر نصية، عبر تقنية MCP الرسمية من سلة.', 'تخيّل إنك تكلّم متجرك مثل ما تكلّم مساعد شخصي، ويسوّي لك كل شي في ثواني. نربط متجرك في سلة بـ ChatGPT وClaude عبر تقنية MCP الرسمية من سلة، وبعدها تطلب أي شي بصيغة طبيعية ويتنفّذ فوراً.
## وش تقدر تسوي بعد الربط
- إدارة الطلبات: اعرض طلباتك وتابع حالتها وحدّثها، واسأل «كم طلب جديد عندي اليوم؟»
- إدارة المنتجات والأسعار: أضف وعدّل وارفع الصور، وقل «غيّر سعر المنتج الفلاني إلى 100 ريال»
- متابعة المخزون وتحديثه لحظياً
- تقارير المبيعات والتحليلات الفورية وأكثر المنتجات مبيعاً
- الاطلاع على السلات المتروكة وفرص البيع الضائعة
- تحسين أوصاف المنتجات وعناوينها للسيو تلقائياً
## تفاصيل الخدمة
- ربط آمن عبر تقنية MCP الرسمية من سلة
- دعم كامل للإعداد وشرح طريقة الاستخدام
- يعمل مع ChatGPT وClaude
- تسليم سريع', true, false, null) on conflict (id) do nothing;
insert into public.products (id, name, price, sale_price, category_id, image, badge, featured, sort, summary, description, active, digital, per_unit) values ('snapchat-ads-creation', 'إنشاء حملة إعلانية على سناب شات', 100, null, 'marketing-services', 'https://cdn.salla.sa/zvxNvp/0f0db848-dc1e-4271-abde-6bf3f8b231d6-500x500-PIqTSuZRonHNiGXPDmKl8LZWMfH2ssiqH605496P.jpg', null, false, 2, 'إعداد حملة سناب كاملة: الهدف، الاستهداف حسب المدينة والعمر والاهتمامات، وهيكل الحملة.', 'سناب شات من أقوى المنصات في الوصول للعملاء المحليين. نجهّز حملتك بالكامل من اختيار الهدف الإعلاني إلى تحديد الفئة المستهدفة.
## مميزات الخدمة
- إنشاء وإعداد حملة ممولة على سناب شات
- تحديد الهدف الإعلاني المناسب لنشاطك
- الاستهداف حسب المدينة والفئة العمرية والاهتمامات
- تجهيز هيكل الحملة وضبط إعداداتها
## ملاحظات مهمة
- الخدمة تشمل إعداد الحملة فقط ولا تشمل تكلفة الإعلان
- لا تشمل إدارة أو متابعة الحملة بعد التشغيل
- الميزانية اليومية تحددها أنت
## المتطلبات
- حساب سناب شات مفعّل
- محتوى الإعلان: فيديو أو صورة مع النص', true, false, null) on conflict (id) do nothing;
insert into public.products (id, name, price, sale_price, category_id, image, badge, featured, sort, summary, description, active, digital, per_unit) values ('tiktok-ads-creation', 'إنشاء حملة إعلانية على تيك توك', 100, null, 'marketing-services', 'https://cdn.salla.sa/zvxNvp/d0c8e61e-fc0c-4a89-9ae7-3201f50fa49d-500x500-r0taBZ5qdkVGNhjQoPQ1kjyfD5gOt9px3mkwVJa8.jpg', null, false, 3, 'حملة تيك توك جاهزة للانطلاق بهدف واضح واستهداف دقيق للفئة المهتمة.', 'تيك توك من أسرع المنصات في الوصول للعملاء. نجهّز حملتك بالكامل من اختيار الهدف الإعلاني إلى تحديد الفئة المستهدفة لضمان وصول إعلانك للمهتمين بنشاطك.
## مميزات الخدمة
- إنشاء وإعداد حملة ممولة على تيك توك
- تحديد الهدف الإعلاني المناسب لنشاطك
- الاستهداف حسب المدينة والفئة العمرية والاهتمامات
- تجهيز هيكل الحملة وضبط إعداداتها
## ملاحظات مهمة
- الخدمة تشمل إعداد الحملة فقط ولا تشمل تكلفة الإعلان
- لا تشمل إدارة أو متابعة الحملة بعد التشغيل
- الميزانية اليومية تحددها أنت
## المتطلبات
- حساب تيك توك مفعّل
- محتوى الإعلان: فيديو أو صورة مع النص', true, false, null) on conflict (id) do nothing;
insert into public.products (id, name, price, sale_price, category_id, image, badge, featured, sort, summary, description, active, digital, per_unit) values ('instagram-ads-creation', 'إنشاء حملة إعلانية على إنستغرام', 100, null, 'marketing-services', 'https://cdn.salla.sa/zvxNvp/627cbdf0-4dee-4de1-9f10-9842a7d9d4d8-500x500-XqhGmj2epkKdPU4MJMQkbduW5eaQ1hYaM25LLiBl.jpg', null, false, 4, 'حملة إنستغرام ممولة تصل للعملاء المستهدفين مع ضبط كامل للإعدادات.', 'نجهّز حملتك على إنستغرام بطريقة احترافية تساعدك على استهداف العملاء المناسبين ورفع الظهور، من اختيار الهدف الإعلاني إلى تحديد الاستهداف.
## مميزات الخدمة
- إنشاء وإعداد حملة ممولة على إنستغرام
- تحديد الهدف الإعلاني المناسب لنشاطك
- الاستهداف حسب المدينة والفئة العمرية والاهتمامات
- تجهيز هيكل الحملة وضبط إعداداتها
## ملاحظات مهمة
- الخدمة تشمل إعداد الحملة فقط ولا تشمل تكلفة الإعلان
- لا تشمل إدارة أو متابعة الحملة بعد التشغيل
- الميزانية اليومية تحددها أنت
## المتطلبات
- حساب إنستغرام مفعّل
- محتوى الإعلان: صورة أو فيديو مع النص', true, false, null) on conflict (id) do nothing;
insert into public.products (id, name, price, sale_price, category_id, image, badge, featured, sort, summary, description, active, digital, per_unit) values ('pixel-integration', 'ربط البكسل لمنصات التواصل الاجتماعي', 50, null, 'marketing-services', 'https://cdn.salla.sa/zvxNvp/40d8116e-02ec-44c0-a5f9-39f9ff77a71d-500x500-lvXiVh7UHuOGU1b7XI99ubwClJFfzAC7byTPs8z5.jpg', null, false, 5, 'ربط البكسل وضبط أحداث التتبع: زيارة الصفحات، مشاهدة المنتج، الإضافة للسلة، وإتمام الشراء.', 'بدون تتبع ما تعرف نتائج حملاتك. نربط البكسل بمتجرك ونضبط الأحداث الأساسية، ونتأكد إن البيانات تظهر صح داخل مدير الإعلانات.
## مميزات الخدمة
- ربط بكسل سناب شات بالمتجر باحترافية
- تفعيل أحداث التتبع: زيارة الصفحات، مشاهدة المنتجات، الإضافة للسلة، إتمام الشراء
- التأكد من ظهور البيانات في مدير الإعلانات
- دقة بيانات أعلى ترفع كفاءة الحملات وتقلل التكلفة
## خيارات إضافية
- ربط بكسل تيك توك
- ربط Meta Pixel لعملاء فيسبوك وإنستغرام
## المتطلبات
- حساب إعلاني مفعّل على المنصة المطلوبة', true, false, null) on conflict (id) do nothing;
insert into public.products (id, name, price, sale_price, category_id, image, badge, featured, sort, summary, description, active, digital, per_unit) values ('google-tools-integration', 'خدمة ربط أدوات قوقل', 50, null, 'marketing-services', 'https://cdn.salla.sa/zvxNvp/e24d0865-1861-4327-be05-c8b73c0a8aad-500x500-s2GKyYt8KR4VOpf8SUnfiipwZhfcWmB6eG7T4r7Q.jpg', null, false, 6, 'ربط Google Analytics بمتجرك، مع خيار Tag Manager وSearch Console وMerchant Center.', 'الربط الصحيح يعطيك رؤية واضحة عن نشاط العملاء داخل المتجر: سلوك الزوار، أداء الصفحات، ومصادر الزيارات.
## تشمل الخدمة الأساسية
- ربط Google Analytics بمتجرك مع تقارير تفصيلية عن الزوار وسلوكهم
## خيارات إضافية أثناء الطلب
- Google Tag Manager لإدارة الأكواد وتتبع أحداث المتجر
- Google Search Console لتحسين الظهور في نتائج البحث ومتابعة الفهرسة
- Google Merchant Center لعرض منتجاتك في Google Shopping
## المتطلبات
- دومين مستقل للمتجر
- حساب Google مفعّل', true, false, null) on conflict (id) do nothing;
insert into public.products (id, name, price, sale_price, category_id, image, badge, featured, sort, summary, description, active, digital, per_unit) values ('salla-subscription', 'اشتراك سلة', 99, null, 'subscriptions', 'https://cdn.salla.sa/zvxNvp/2c8c08c1-c201-4433-a386-64d095145354-500x500-Z6ok9nfRZ2P00pDKmacdN6b0gkAILyYCdKUdT1er.jpg', null, false, 1, 'تفعيل اشتراك متجرك في سلة على الباقة الأنسب، مع خيار الترقية لسلة برو.', 'عشان تبيع بشكل رسمي واحترافي على سلة تحتاج اشتراكاً فعّالاً في الباقة المناسبة لنشاطك. نفعّل لك الاشتراك ونجهّز متجرك عشان تبدأ استقبال الطلبات بدون تعقيد.
## وش تشمل الخدمة
- تفعيل اشتراك متجرك في سلة
- ضبط الإعدادات الأساسية للباقة
- توجيهك للباقة الأنسب لنشاطك
## ترقية سلة برو
- إمكانيات أوسع في التخصيص والتحكم وأدوات النمو', true, false, null) on conflict (id) do nothing;
insert into public.products (id, name, price, sale_price, category_id, image, badge, featured, sort, summary, description, active, digital, per_unit) values ('salla-theme', 'شراء ثيمات سلة «ثيم عالي»', 299, null, 'subscriptions', 'https://cdn.salla.sa/zvxNvp/68a73e5d-4e34-4769-b9bd-1e21bc0ebc9d-500x500-ptnVQRA542VufLXNUSsZuyST4fMJcN5fHiaoLb3c.jpg', null, false, 2, 'ثيم أصلي مرخّص يركَّب ويُفعَّل على متجرك، مع ضبط الإعدادات ودعم بعد التركيب.', 'الثيم هو أول انطباع بصري، وهو اللي يقرر يكمل الزائر ويشتري ولا يطلع. ثيم عالي من أقوى ثيمات سلة وأكثرها مرونة وأناقة، وتقدر تختار غيره مثل ثيم ملاك وثيم سيليا.
## مميزات ثيم عالي
- تصميم عصري وهوية قوية تبني الثقة من أول نظرة
- سرعة تحميل عالية تقلل هروب الزوار
- متجاوب بالكامل مع الجوال
- تحكم واسع في الألوان والأقسام والبنرات وترتيب الرئيسية
## وش تشمل الخدمة
- توفير الثيم الأصلي المرخّص
- تركيب الثيم وتفعيله على متجرك في سلة
- ضبط الإعدادات الأساسية
- دعم وتوجيه بعد التركيب
## تبغى ثيم غير الموجود؟
- تواصل معنا ونوفّره لك ونركّبه باحترافية', true, false, null) on conflict (id) do nothing;
insert into public.products (id, name, price, sale_price, category_id, image, badge, featured, sort, summary, description, active, digital, per_unit) values ('buy-domain', 'شراء نطاق رسمي «دومين»', 60, null, 'subscriptions', 'https://cdn.salla.sa/zvxNvp/3887b7c9-277c-4b06-9a09-16517c61acf8-500x500-mF7ABf4RN08McssPtrh1LmMKGeg0BaIK4myVp53P.jpg', null, false, 3, 'حجز دومين باسم متجرك وربطه بسلة والتأكد من تفعيله.', 'الدومين عنوان متجرك على الإنترنت وأول شي يتذكره العميل. اسم نطاق رسمي يرفع الثقة، وهو شرط لخطوات مهمة مثل توثيق المتجر وتحسين الظهور في البحث.
## وش تشمل الخدمة
- حجز دومين رسمي باسم متجرك حسب توفّر الاسم
- ربط الدومين بمتجرك في سلة بشكل صحيح
- التأكد من عمل الرابط وتفعيله', true, false, null) on conflict (id) do nothing;
insert into public.products (id, name, price, sale_price, category_id, image, badge, featured, sort, summary, description, active, digital, per_unit) values ('issue-commercial-registration-saudi', 'إصدار سجل تجاري', 100, null, 'government-services', 'https://cdn.salla.sa/zvxNvp/58090d27-76b4-437c-b4c6-1d3d1fde5e38-500x500-8U1qwPAcMZniZhLrK5FwGSuWXcqfhlcUoXvVa8Z3.jpg', null, false, 1, 'سجل تجاري إلكتروني عبر وزارة التجارة، مع اختيار النشاط ومتابعة الطلب حتى الإصدار.', 'نصدر لك سجلاً تجارياً إلكترونياً معتمداً عبر وزارة التجارة، ونجهّز الطلب ونختار النشاط المناسب ونتابع حتى الإصدار.
## مميزات الخدمة
- سجل تجاري جديد متوافق مع لوائح وزارة التجارة
- اختيار وصياغة النشاط المناسب لمجال عملك
- تجهيز الطلب ورفعه ومتابعته حتى الإصدار
- توجيهك للأنشطة التي تتطلب تراخيص إضافية
## الشروط والملاحظات
- عمر المتقدم 18 سنة فأكثر
- حساب مفعّل في منصة وزارة التجارة
- عنوان وطني مفعّل
- الخدمة لا تشمل رسوم الإصدار الحكومية', true, false, null) on conflict (id) do nothing;
insert into public.products (id, name, price, sale_price, category_id, image, badge, featured, sort, summary, description, active, digital, per_unit) values ('freelance-certificate-family-platform', 'إصدار وثيقة العمل الحر', 100, null, 'government-services', 'https://cdn.salla.sa/zvxNvp/8aada159-a24a-47c0-ac7b-250de9c5561f-500x500-TXw8JFDjz7sGfXt99bkqKUeKEtfda0pCSlhvWWJ3.jpg', null, false, 2, 'وثيقة عمل حر رسمية عبر منصة الأسر المنتجة، مع اختيار المهنة المناسبة لنشاطك.', 'وثّق نشاطك المنزلي أو الحرفي بطريقة نظامية. نجهّز البيانات ونتابع الإجراءات حتى إصدار الوثيقة، مع اختيار المهنة المناسبة.
## مميزات الخدمة
- وثيقة عمل حر معتمدة للأنشطة المنزلية والصغيرة
- تجهيز الطلب ومتابعة الإجراءات حتى الإصدار
- اختيار المهنة المناسبة حسب نشاطك
## ملاحظات
- بعض الأنشطة تتطلب إثبات مزاولة مثل صور الأعمال أو الخبرات
- الخدمة لا تشمل الرسوم الحكومية الخاصة بالمنصة', true, false, null) on conflict (id) do nothing;
insert into public.products (id, name, price, sale_price, category_id, image, badge, featured, sort, summary, description, active, digital, per_unit) values ('business-verification', 'توثيق المتجر في منصة الأعمال', 100, null, 'government-services', 'https://cdn.salla.sa/zvxNvp/6effe700-f66a-4816-b986-980f732503ae-500x500-tjEGR6IubvFGUrCKrqZbXLAHFiERGpyr3MZgjxLE.jpg', null, false, 3, 'علامة التوثيق الرسمية لمتجرك، مع تجهيز الطلب ومتابعته حتى القبول.', 'علامة التوثيق تعزز مصداقية متجرك وتمنح عملاءك ثقة أكبر عند الشراء. نجهّز طلب التوثيق ونتابع الإجراءات داخل منصة الأعمال حتى الاعتماد.
## مميزات الخدمة
- تجهيز طلب التوثيق ومتابعة الإجراءات حتى القبول
- ربط بيانات السجل التجاري أو وثيقة العمل الحر بشكل صحيح
- رفع مصداقية المتجر أمام العملاء
## متطلبات الخدمة
- دومين مدفوع مرتبط بالمتجر
- حساب بنكي تجاري مرتبط بالسجل أو وثيقة العمل الحر
- المستندات الرسمية المطلوبة', true, false, null) on conflict (id) do nothing;
insert into public.products (id, name, price, sale_price, category_id, image, badge, featured, sort, summary, description, active, digital, per_unit) values ('tabby-registration', 'التسجيل في تابي', 100, null, 'government-services', 'https://cdn.salla.sa/zvxNvp/06aa6da6-4122-4b1a-a35a-a779cc38a85d-500x500-UPEq2FUZ9l7YuKQTTehjySpDFvCUbUzxiaqLLs2a.jpg', null, false, 4, 'تفعيل الدفع بالتقسيط عبر تابي في متجرك، مع تجهيز الطلب لنسبة قبول أعلى.', 'وفّر لعملائك خيار التقسيط. نسجّل متجرك في تابي ونجهّز الطلب بشكل صحيح ونتابعه حتى التفعيل.
## تشمل الخدمة
- تسجيل متجرك في تابي وتعبئة الطلب
- رفع المستندات وضبط البيانات
- متابعة حالة الطلب حتى التفعيل
## متطلبات التسجيل
- وثيقة عمل حر أو سجل تجاري مطابق لنشاط المتجر
- شهادة آيبان بنكي
- الهوية الوطنية والعنوان الوطني
## شروط تابي المهمة
- يطابق نشاط المتجر نشاط السجل أو الوثيقة
- صور المنتجات واضحة ووصفها مكتمل', true, false, null) on conflict (id) do nothing;
insert into public.products (id, name, price, sale_price, category_id, image, badge, featured, sort, summary, description, active, digital, per_unit) values ('tmara-registration', 'التسجيل في تمارا', 100, null, 'government-services', 'https://cdn.salla.sa/zvxNvp/53e50bde-0edb-4062-bdcc-43202907aa1b-500x500-He3aZqkDy3zuPLZ4hW0pykCURzDd3ElgRiSE92ZJ.jpg', null, false, 5, 'تفعيل الدفع بالتقسيط عبر تمارا في متجرك، مع متابعة الطلب حتى التفعيل.', 'وفّر لعملائك التقسيط عبر تمارا وزد فرص الشراء. نسجّل متجرك ونجهّز الطلب بشكل صحيح ونتابعه حتى التفعيل.
## تشمل الخدمة
- تسجيل متجرك في تمارا وتعبئة الطلب
- رفع المستندات وضبط البيانات
- متابعة حالة الطلب حتى التفعيل
## متطلبات التسجيل
- وثيقة عمل حر أو سجل تجاري مطابق لنشاط المتجر
- شهادة آيبان بنكي
- الهوية الوطنية والعنوان الوطني
## شروط تمارا المهمة
- يطابق نشاط المتجر نشاط السجل أو الوثيقة
- صور المنتجات واضحة ووصفها مكتمل', true, false, null) on conflict (id) do nothing;
insert into public.products (id, name, price, sale_price, category_id, image, badge, featured, sort, summary, description, active, digital, per_unit) values ('waarfe-ai-ad-campaigns-guide', 'دليل وارف لإطلاق حملاتك الإعلانية بالذكاء الاصطناعي', 150, 129, 'digital-products', 'https://cdn.salla.sa/zvxNvp/883ce4d7-4671-4a64-ba9b-ffa7b4822beb-357.03125x500-mMnLhMKIvGwbdwu0unQtSOsz7m4KGk18iWcoigTW.jpg', null, true, 1, 'أطلق وأدر حملاتك على تيك توك وسناب وميتا بمحادثة بالعربي مع الذكاء الاصطناعي — خطوة بخطوة بالصور.', 'دليل وارف الرسمي يمشّيك من الصفر لين ما تربط حسابك الإعلاني بالذكاء الاصطناعي (Claude)، وبعدها تطلق وتدير حملاتك بمجرد إنك تكلّمه بالعربي. مكتوب بأبسط طريقة، وكل خطوة معها صورة.
## وش راح تتعلم
- ربط حسابك الإعلاني بالذكاء الاصطناعي بالصور خطوة بخطوة
- إطلاق حملة كاملة (الهدف، الاستهداف، الميزانية، الكريتيف) بمحادثة بالعربي
- كتابة البرومبت الصح لحملة أدق، مع مثال طلب متكامل جاهز
- طلب تقارير فورية بالعربي: الصرف، المشاهدات، النقرات، والنتائج
- نفس الطريقة لتيك توك وسناب وميتا (فيسبوك وإنستقرام)
## آمن ومطمئن
- كل حملة تتجهّز متوقفة (Paused)، وأنت اللي تراجعها وتفعّلها بنفسك
## الدليل لك إذا كنت
- صاحب متجر تبي تدير إعلاناتك بنفسك بدون وكالة
- مبتدئ بدون خبرة تقنية أو إعلانية
- مسوّق تبي تسرّع شغلك وتدير حملاتك بالمحادثة
## صيغة المنتج
- ملف PDF عملي بالصور، تحمّله فوراً بعد الشراء', true, true, null) on conflict (id) do nothing;
