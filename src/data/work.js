// Raed portfolio — banners and visuals designed for client stores.
// Source: Raed's Google Drive folders (shared "anyone with the link"). Served through Google's image CDN.
export const WORK_FOLDER = 'https://drive.google.com/drive/folders/1TLzd77t6_kMkhSH13eitJ6zsOH07Qzei'
export const STORES_FOLDER = 'https://drive.google.com/drive/folders/1dP6LwYY1vzIKG0Cordp-KgIhIsrczU5m'

export const img = (id, w = 900) => `https://lh3.googleusercontent.com/d/${id}=w${w}`

// Order as in the Drive folder (1.png … 45.png)
export const WORK = [
  '1eUijFltTTvjl3cNpxVlcDv0ZK6pT-wPc',
  '1iT00D5xq1ZUVPY7CS_1zL9DC4i6vrLbT',
  '1BlqKQPRry6PzuD7db-JIorgGlptvOT4f',
  '1_NYsKOlZVD1FMVXQXZC9tAjRGlC3jeQy',
  '1sKWXIGztFYhEojz3Mr2omq3pwLLsbdNe',
  '1weVczUv7PbPmZtXFAmCZ_ZVe7Gtv_RD4',
  '1RlkByWOknK6C_OsUpLLi1m-x-P_iuo6L',
  '1RBv8u5nr7NH1oPfGdlmZPl6Xi3uIxv9I',
  '1V_d716t-EpalPELjkg3Iet4J-U6aX0nD',
  '19yLbm-qKh4DhVSXLLr-Liz5bF-T_LcoJ',
  '1w8XVUmxG1Ky8P5b8ZbrGmeeFMas9HGpC',
  '1WcF4h_4GNalsdYGCphTUOLbWaERxPLEu',
  '1ZxiJ374IW4NS2FDWESFLTt9M1sM97JV7',
  '1J6tpkgq1OzQ-KW5Bx9BwwgwokukH7yrB',
  '1-QSaMXH_w3W2PR5TEehG1sjaS_ZeDTbq',
  '11Sxe4amQ46kyrm8ovlYDXIT4d9atkv1O',
  '1miVsOqRulEQyJZX3PvZT32PdPrfBgaNL',
  '1s5AhdT4Ef6RaWsDI9uvws8ggemOsF89C',
  '1xgYF48sdS1WRT5MC-1U5axv-4K9iNBO0',
  '1EZmo38UDylqaDas1tasH_WobyvW8xvU_',
  '1vqfnjAMW5J5yHBTu3ozk6M9QGh64uwoq',
  '15bOd6gpKMQVSqIYptvEoIpW6EI0FRM8u',
  '1MmPNrF0ijQTLu9KkoEWoZ4vdo5R8CF_B',
  '1QppRtFPh2hz65wLYDmC4nvBXzwpyNEn3',
  '1sgiBmj0nI-luZJ6KlgaBXc_0klfT1gu-',
  '1g6DrlnvzvoXdrvmh9v0qHyd52ocgSbl5',
  '1gu5nhQnnexmx-_BHDiN5k0vcDDeKigaC',
  '1N6rjBUUNhhFCg_tZxR6EvVSUyuUCvhbu',
  '1Z1x2pwG9qt96yb2KOqqYuSJ43ld3QE0v',
  '11k5ESFb8aqIUqt35TRJPqa1upx_-iwqy',
  '1cH1Ri3--W82UPC1LRJ5fr3Df4D6f3rtQ',
  '1OxnG1VwqN8iyeLp7rsXqEiLJzq5xiMyY',
  '1Tw0vUUoxZM639lkzgMovG7uPX7ju8Alt',
  '1RWefcTHOrHCFkQP4R69wsGqfERXoJQuG',
  '1mujJFd4MctslDkGjV1og4BEDx0nVb1-Q',
  '1nH1rHOrZ5Qo-f761p9xtsN5Nx29fRK4S',
  '1UK55r7yR6vu3ceAQ2TYM9H95fR4ZPWOP',
  '1_qcQK9NLpH0sF2e83OXWtTgOe6-og1w5',
  '1Js7FRE-qHTpnpQ3mqfTF8eeAKuajwJMB',
  '1ydPv9CICdyDRZmcxKFlJGB0uIxX0srI9',
  '1DFL0_w5rnLh0fw1XNEfE_cssIjw9WYYq',
  '1yC4KrZ9YJGhQqx6roHfkc0GkBRZe2a-9',
  '1Je2ioYcgAcR0Glw2K-iWVgyT4mKadWtb',
  '1Yh9YATY4bVjiYxp4hZ8vfww-Nw7fR7su',
  '1V2zmzHFabchr0UJW9we5RSAUIEZnN1Aq',
]

// A curated first look for the homepage (indexes into WORK, 1-based like the file names)
export const FEATURED = [8, 2, 20, 36, 32, 16, 23, 40, 1, 17, 34, 22].map((n) => WORK[n - 1])

// Full store designs delivered, as PDF case files
export const STORE_PDFS = [
  { name: 'Velvet', id: '1qLce40-i8rLBo7Af7iFJvgN-BU4tI6RF' },
  { name: 'Glisten', id: '1nXfSIksTDs8b5YN3tqIBcdI_0-sZGccj' },
  { name: 'مروج اليسر', id: '1Bngc74ohxG9t9nMvfJyWh0ElIfkBnkKR' },
]
export const pdfThumb = (id, w = 900) => `https://drive.google.com/thumbnail?id=${id}&sz=w${w}`
export const pdfView = (id) => `https://drive.google.com/file/d/${id}/view`

// Verified against the Salla store (orders_list total, 2026-10-06). Reviews total pending Raed's confirmation.
export const PROOF = [
  { value: '+200', label: 'طلب نفّذناه في متجرنا على سلة' },
  { value: '5.0', label: 'تقييم عملائنا المنشور في سلة' },
  { value: '2–6', label: 'أيام لتسليم متجر سلة', ltr: true },
]

// Homepage preview of banners & social posts (mixed ratios for a calm masonry).
export const PREVIEW = [1, 8, 15, 21, 32, 25, 37, 9].map((i) => WORK[i])
