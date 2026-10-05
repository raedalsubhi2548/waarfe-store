# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users
Two audiences of equal weight, both Saudi, Arabic-first, mostly on mobile:
- **Starters:** someone launching a business from zero — no commercial registration, no store yet — who needs the whole path handled.
- **Existing Salla merchants:** already selling on Salla and wanting a more premium store, marketing, tracking, or AI-driven store management.

## Product Purpose
waarfe.com sells Waarfe's fixed-price services for Saudi online stores: Salla store design, custom-coded landing pages, ad campaign setup (Snapchat, TikTok, Instagram), pixel and Google tools setup, government paperwork (commercial registration, freelance certificate, business-platform verification, Tabby/Tamara registration), Salla subscriptions/themes/domains, and a digital guide. Customers buy, pay online, and follow their order status from their account. Success = a visitor picks the right service, pays, and trusts Waarfe to deliver.

## Positioning
- **Everything in one place:** the official paperwork, the store, payments/tracking, and marketing come from one studio — a visitor can go from no license to first order without a second vendor.
- **Speed:** store design delivered in 2–6 days.
- **Daily Salla expertise:** Waarfe works on Salla every day and knows its fields, settings and limits.

## Operating Context
Visitors arrive mainly from social ads and WhatsApp on phones. Many services need follow-up after purchase (Waarfe contacts the customer to collect data/documents). WhatsApp 0545607555 is the primary support channel.

## Capabilities and Constraints
- Stack: React + Vite on Vercel, Supabase (auth, Postgres, storage), Tap Payments (live). Must not break checkout, accounts, admin, or payment flows.
- Customer account: orders with status tracking, wishlist, profile, digital downloads.
- Admin dashboard: products, categories, orders + status updates, customers, coupons, stats.
- Catalog: 21 services in 5 categories, imported from the Salla store; prices are real and owned by Raed.

## Brand Commitments
- Name: وارف / waarfe — never «وارفه».
- Colors: green #09382e (primary), gold #d7c676 (accent), cream #fefbf2 (background), white #ffffff.
- Logo: official file in public/logo.png (Arabic «وارف» green with gold «و», «WAARFE» below). Green only; no dark-mode variant; never redrawn.
- Type: a plain, clean, modern Arabic font; no decorative Kufi lettering.
- Arabic-first, RTL. Saudi dialect is acceptable in marketing copy.

## Evidence on Hand
- Published customer reviews from the Salla store (src/data/content.js).
- Store FAQ and banners from the Salla store (src/data/content.js).
- Portfolio: 13 delivered stores (Private Blend، خزاز، حَلَه، مُتسع البن، رونق للعبايات، Rozona، Glisten، Velvet، كيان بوتيك، ايفا لاين، A/M Elegant، مروج اليسر، إتقان التعليم). Image links: **pending from Raed**.
- Real numbers (stores delivered, customers, etc.): **pending from Raed** — do not display any figure until supplied.
- No other testimonials, press, or client logos — never fabricate.

## Product Principles
1. Show the price and what's included before asking for anything.
2. One path from zero to first order; the store explains the sequence, not just the catalog.
3. Proof over claims: real reviews, real delivered stores, real numbers only.
4. Mobile and WhatsApp are first-class; nothing important hides behind hover.
5. It must feel unmistakably more premium than a stock Salla theme.

## Accessibility & Inclusion
Arabic RTL throughout; WCAG AA contrast; 44px touch targets; respects reduced motion.
