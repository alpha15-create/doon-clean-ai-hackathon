import { Filter, RotateCcw } from 'lucide-react'
import { WASTE_CATEGORIES } from '../utils/helpers'

export default function FilterBar({
  filters,
  onChange,
  onReset,
  showWasteType = true,
  showPriority = true,
  showStatus = true,
}) {
  return (
    <div className="flex flex-wrap items-center gap-2.5">
      <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wider mr-1">
        <Filter className="w-3.5 h-3.5" />
        Filters:
      </div>

      {showStatus && (
        <select
          value={filters.status || 'all'}
          onChange={(e) => onChange({ status: e.target.value })}
          className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-700 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 cursor-pointer shadow-2xs"
        >
          <option value="all">All Statuses</option>
          <option value="reported">Reported</option>
          <option value="ai_analyzed">AI Analyzed</option>
          <option value="verified">Verified</option>
          <option value="assigned">Assigned</option>
          <option value="in_progress">In Progress</option>
          <option value="resolved">Resolved</option>
        </select>
      )}

      {showPriority && (
        <select
          value={filters.priority || 'all'}
          onChange={(e) => onChange({ priority: e.target.value })}
          className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-700 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 cursor-pointer shadow-2xs"
        >
          <option value="all">All Priorities</option>
          <option value="high">High Priority</option>
          <option value="medium">Medium Priority</option>
          <option value="low">Low Priority</option>
        </select>
      )}

      {showWasteType && (
        <select
          value={filters.wasteType || 'all'}
          onChange={(e) => onChange({ wasteType: e.target.value })}
          className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-700 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 cursor-pointer shadow-2xs"
        >
          <option value="all">All Waste Types</option>
          {WASTE_CATEGORIES.map((cat) => (
            <option key={cat.id} value={cat.label}>
              {cat.label}
            </option>
          ))}
        </select>
      )}

      {onReset && (
        <button
          onClick={onReset}
          title="Reset filters"
          className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors border border-transparent hover:border-slate-200"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  )
}
