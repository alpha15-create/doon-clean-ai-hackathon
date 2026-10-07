import { getPriorityConfig } from '../utils/helpers'
import { AlertTriangle, AlertCircle, Check } from 'lucide-react'

export default function PriorityBadge({ priority, score, showScore = false }) {
  const config = getPriorityConfig(priority)

  const getIcon = () => {
    const p = (priority || '').toLowerCase()
    if (p === 'high' || p === 'critical') return <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
    if (p === 'medium') return <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
    return <Check className="w-3.5 h-3.5 text-emerald-600" />
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${config.bg} ${config.text} ${config.border} shadow-xs`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot} animate-pulse`} />
      {config.label}
      {showScore && score !== undefined && (
        <span className="ml-1 px-1.5 py-0.2 bg-white/70 rounded text-[11px] font-bold border border-current">
          {score}/100
        </span>
      )}
    </span>
  )
}
