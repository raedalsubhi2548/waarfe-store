import { useApp } from '../state.jsx'
import Icon from './Icon.jsx'
export default function Toast() {
  const { toast } = useApp()
  return (
    <div className="toast-zone" role="status" aria-live="polite">
      {toast && <div key={toast.id} className={'toast ' + toast.kind}><Icon name={toast.kind === 'err' ? 'close' : 'check'} size={18} />{toast.text}</div>}
    </div>
  )
}
