import { useEffect } from 'react'
import { useApp } from '@/state.jsx'
import Layout from '@/components/Layout.jsx'

/** The store's home page inside the designer's preview frame: shows the unsaved draft it receives from the designer. */
export default function DesignPreview() {
  const { setPreview } = useApp()
  useEffect(() => {
    const on = (e) => { if (e.origin === location.origin && e.data?.type === 'raed:design') setPreview(e.data.settings || null) }
    addEventListener('message', on)
    parent.postMessage({ type: 'raed:preview-ready' }, location.origin)
    return () => { removeEventListener('message', on); setPreview(null) }
  }, [setPreview])
  // a picture of the store, not a way out of the dashboard: links and buttons do nothing here
  const stop = (e) => { if (e.target.closest('a,button')) { e.preventDefault(); e.stopPropagation() } }
  return <div onClickCapture={stop}><style>{'html{scrollbar-width:none}html::-webkit-scrollbar{display:none}'}</style><Layout /></div>
}
