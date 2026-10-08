// admin.rraed.com opens the dashboard straight away; rraed.com is the store.
export const ADMIN_HOST = typeof location !== 'undefined' && /^admin\./.test(location.hostname)
export const STORE_ORIGIN = 'https://rraed.com'
/** A store page address that also works from the admin subdomain (opens on the store). */
export const storeUrl = (path) => (ADMIN_HOST ? STORE_ORIGIN + path : path)
