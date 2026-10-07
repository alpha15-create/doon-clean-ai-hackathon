import { Link } from 'react-router-dom'
import StatusBadge from './StatusBadge'
import PriorityBadge from './PriorityBadge'
import { formatRelativeTime } from '../utils/helpers'
import { MapPin, Calendar, Sparkles, ChevronRight, User } from 'lucide-react'

export default function ComplaintCard({ report, linkPrefix = '/citizen/reports' }) {
  if (!report) return null

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col group">
      {/* Image with badges overlay */}
      <div className="relative h-44 sm:h-48 w-full bg-slate-900 overflow-hidden">
        <img
          src={report.imageUrl}
          alt={report.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
          <span className="px-2 py-0.5 bg-black/75 backdrop-blur-md text-white font-mono text-xs font-semibold rounded-lg border border-white/10 shadow-xs">
            {report.id}
          </span>
          <StatusBadge status={report.status} size="sm" />
        </div>

        {/* Bottom overlay: AI confidence & Priority */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
          <div className="flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-2 py-1 rounded-lg text-xs font-medium">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>AI: {report.aiConfidence || 90}%</span>
          </div>
          <PriorityBadge priority={report.severity} score={report.priorityScore} showScore />
        </div>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
              {report.wasteType}
            </span>
            <span className="text-[11px] text-slate-400 flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {formatRelativeTime(report.createdAt)}
            </span>
          </div>

          <h4 className="text-sm sm:text-base font-bold text-slate-900 line-clamp-1 group-hover:text-emerald-700 transition-colors">
            {report.title || report.description}
          </h4>

          <p className="text-xs text-slate-500 line-clamp-2 mt-1">
            {report.description}
          </p>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-slate-600 truncate max-w-[200px]">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{report.location?.landmark || report.location?.address}</span>
          </div>

          <Link
            to={`${linkPrefix}/${report.id}`}
            className="inline-flex items-center gap-1 font-semibold text-emerald-600 hover:text-emerald-700 group-hover:translate-x-0.5 transition-transform"
          >
            <span>Details</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  )
}
