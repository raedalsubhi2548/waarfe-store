// admin.rraed.com opens the dashboard straight away; rraed.com is the store.
export const ADMIN_HOST = typeof location !== 'undefined' && /^admin\./.test(location.hostname)
export const STORE_ORIGIN = 'https://rraed.com'
export const ADMIN_ORIGIN = 'https://admin.rraed.com'
// the live store (not previews or local): the dashboard lives only on admin.rraed.com there
export const LIVE_STORE = typeof location !== 'undefined' && /^(www\.)?rraed\.com$/.test(location.hostname)
/** A store page address that also works from the admin subdomain (opens on the store). */
export const storeUrl = (path) => (ADMIN_HOST ? STORE_ORIGIN + path : path)
