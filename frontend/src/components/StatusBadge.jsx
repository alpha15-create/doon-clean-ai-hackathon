import { getStatusConfig } from '../utils/helpers'
import {
  Clock,
  Sparkles,
  CheckCircle,
  Truck,
  RotateCw,
  CheckCheck,
  XCircle,
} from 'lucide-react'

export default function StatusBadge({ status, size = 'md' }) {
  const config = getStatusConfig(status)

  const getIcon = () => {
    const s = (status || '').toLowerCase()
    if (s.includes('reported')) return <Clock className="w-3.5 h-3.5" />
    if (s.includes('ai') || s.includes('analyzed')) return <Sparkles className="w-3.5 h-3.5" />
    if (s.includes('verified')) return <CheckCircle className="w-3.5 h-3.5" />
    if (s.includes('assigned')) return <Truck className="w-3.5 h-3.5" />
    if (s.includes('progress')) return <RotateCw className="w-3.5 h-3.5 animate-spin" />
    if (s.includes('resolved')) return <CheckCheck className="w-3.5 h-3.5" />
    if (s.includes('reject')) return <XCircle className="w-3.5 h-3.5" />
    return <Clock className="w-3.5 h-3.5" />
  }

  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs font-medium'

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border ${config.bg} ${config.text} ${config.border} ${sizeClasses} shadow-xs font-semibold`}
    >
      {getIcon()}
      {config.label}
    </span>
  )
}
