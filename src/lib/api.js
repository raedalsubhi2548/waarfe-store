import { local } from './local.js'
import { supa, sb } from './supa.js'

// Supabase when configured, otherwise the in-browser demo store.
export const api = sb ? supa : local
export const isDemo = !sb
