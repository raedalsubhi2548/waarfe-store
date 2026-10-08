-- Raed store — product options (run once in Supabase → SQL Editor). Safe to run again.
-- Adds the options column, fills it with the same options as the Salla store, and teaches place_order
-- to price them. Prices are still computed here in the database, never in the browser.

-- The AI ads guide and its section are taken off the store (old orders keep their own copy of the item).
delete from public.products where id = 'waarfe-ai-ad-campaigns-guide';
delete from public.categories where id = 'digital-products' and not exists (select 1 from public.products where category_id = 'digital-products');

alter table public.products add column if not exists options jsonb not null default '[]'::jsonb;

update public.products set options = '[{"id":"theme","name":"اختار نوع الثيم ( مدفوع أو مجاني )","type":"radio","required":true,"values":[{"id":"free","name":"الثيم المجاني بسلة","price":0},{"id":"paid","name":"التصميم على ثيم مدفوع","price":50}]},{"id":"banners","name":"تصميم بانرات اضافية","type":"radio","required":false,"values":[{"id":"b1","name":"بانر واحد","price":30},{"id":"b3","name":"عدد 3 بانرات","price":90}]},{"id":"product-images","name":"تصميم صور المنتجات","type":"radio","required":false,"values":[{"id":"p1","name":"منتج واحد","price":15},{"id":"p3","name":"3 منتجات","price":45},{"id":"p6","name":"6 منتجات","price":90}]},{"id":"category-images","name":"تصميم صور أقسام اضافية","type":"radio","required":false,"values":[{"id":"c1","name":"صورة وحدة","price":15},{"id":"c3","name":"عدد 3 صور","price":45},{"id":"c6","name":"عدد 6 صور اقسام","price":90}]}]'::jsonb where id = 'salla-store-design';
update public.products set options = '[{"id":"extras","name":"الاضافات","type":"checkbox","required":false,"values":[{"id":"page1","name":"صفحة اضافية","price":100},{"id":"pages3","name":"3 صفحات","price":300},{"id":"pages5","name":"5 صفحات","price":500},{"id":"payment","name":"ربط بوابة الدفع ( يشمل التسجيل بالبوابة والمراسلات والربط البرمجي )","price":300}]}]'::jsonb where id = 'landing-page-design';
update public.products set options = '[{"id":"extras","name":"الاضافات","type":"checkbox","required":false,"values":[{"id":"b1","name":"اضافة بانر","price":50},{"id":"b5","name":"اضافة 5 بانرات","price":200}]}]'::jsonb where id = 'banner-design';
update public.products set options = '[{"id":"platform","name":"المنصة اللي حاب تربطها","type":"radio","required":true,"values":[{"id":"chatgpt","name":"ChatGPT","price":0},{"id":"claude","name":"Claude","price":0},{"id":"both","name":"جميعهم","price":50}]}]'::jsonb where id = 'ai-integration-chatgpt-claude-salla';
update public.products set options = '[{"id":"services","name":"الخدمات ..","type":"checkbox","required":false,"values":[{"id":"tiktok","name":"TikTok Pixel","price":50},{"id":"meta","name":"Meta Pixel (Facebook & Instagram)","price":50}]}]'::jsonb where id = 'pixel-integration';
update public.products set options = '[{"id":"services","name":"الخدمات ..","type":"checkbox","required":false,"values":[{"id":"gtm","name":"Google Tag Manager","price":50},{"id":"gsc","name":"Google Search Console","price":50},{"id":"gmc","name":"Google Merchant Center","price":50}]}]'::jsonb where id = 'google-tools-integration';
update public.products set options = '[{"id":"extras","name":"الاضافات","type":"radio","required":false,"values":[{"id":"pro","name":"سلة برو","price":200}]}]'::jsonb where id = 'salla-subscription';
update public.products set options = '[{"id":"other-themes","name":"ثيمات أخرى","type":"radio","required":false,"values":[{"id":"malak","name":"ثيم ملاك","price":11},{"id":"celia","name":"ثيم سيليا","price":100}]}]'::jsonb where id = 'salla-theme';

-- p_items: [{ product_id, qty, note, options: ["optionId:valueId", ...] }]
create or replace function public.place_order(
  p_items jsonb, p_customer jsonb, p_notes text, p_coupon text, p_payment_method text
) returns uuid
language plpgsql security definer set search_path = public as $$
declare
  v_items jsonb := '[]';
  v_sub numeric := 0;
  v_disc numeric := 0;
  v_c public.coupons;
  v_line jsonb;
  v_p public.products;
  v_qty int;
  v_price numeric;
  v_id uuid;
  v_sel text[];
  v_o jsonb;
  v_v jsonb;
  v_n int;
  v_add numeric;
  v_chosen jsonb;
begin
  if auth.uid() is null then raise exception 'سجّل دخولك أولاً'; end if;
  if jsonb_array_length(p_items) = 0 then raise exception 'السلة فاضية'; end if;

  for v_line in select * from jsonb_array_elements(p_items) loop
    select * into v_p from public.products where id = v_line->>'product_id' and active;
    if not found then raise exception 'منتج غير متوفر: %', v_line->>'product_id'; end if;
    v_qty := greatest(1, least(999, coalesce((v_line->>'qty')::int, 1)));
    v_price := case when v_p.sale_price is not null and v_p.sale_price < v_p.price then v_p.sale_price else v_p.price end;

    -- options: only choices that exist on the product count; required ones must be chosen; "pick one" means one
    v_sel := array(select jsonb_array_elements_text(case when jsonb_typeof(v_line->'options') = 'array' then v_line->'options' else '[]'::jsonb end) limit 50);
    v_add := 0;
    v_chosen := '[]';
    for v_o in select * from jsonb_array_elements(coalesce(v_p.options, '[]'::jsonb)) loop
      v_n := 0;
      for v_v in select * from jsonb_array_elements(coalesce(v_o->'values', '[]'::jsonb)) loop
        if ((v_o->>'id') || ':' || (v_v->>'id')) = any(v_sel) then
          v_n := v_n + 1;
          v_add := v_add + greatest(0, coalesce((v_v->>'price')::numeric, 0));
          v_chosen := v_chosen || jsonb_build_object('option', v_o->>'name', 'value', v_v->>'name', 'price', greatest(0, coalesce((v_v->>'price')::numeric, 0)));
        end if;
      end loop;
      if coalesce((v_o->>'required')::boolean, false) and v_n = 0 then raise exception 'اختر «%» في %', v_o->>'name', v_p.name; end if;
      if v_o->>'type' = 'radio' and v_n > 1 then raise exception 'اختيار واحد بس في «%»', v_o->>'name'; end if;
    end loop;
    v_price := v_price + v_add;

    v_sub := v_sub + v_price * v_qty;
    v_items := v_items || jsonb_build_object(
      'productId', v_p.id, 'name', v_p.name, 'price', v_price, 'qty', v_qty,
      'image', v_p.image, 'digital', v_p.digital, 'note', coalesce(v_line->>'note', ''), 'options', v_chosen);
  end loop;

  if p_coupon is not null and p_coupon <> '' then
    v_c := public.check_coupon(p_coupon);
    if v_c.code is null then raise exception 'الكود غير صالح أو منتهي'; end if;
    v_disc := least(v_sub, case when v_c.type = 'percent' then round(v_sub * v_c.value / 100, 2) else v_c.value end);
  end if;

  insert into public.orders (user_id, customer, items, subtotal, discount, coupon, total, notes, payment_method, history)
  values (auth.uid(), p_customer, v_items, v_sub, v_disc, nullif(upper(p_coupon), ''), v_sub - v_disc,
          coalesce(p_notes, ''), coalesce(p_payment_method, 'card'),
          jsonb_build_array(jsonb_build_object('status', 'pending', 'at', now())))
  returning id into v_id;
  return v_id;
end $$;
