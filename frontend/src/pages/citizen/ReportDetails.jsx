import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { reportsAPI } from '../../services/api'
import { formatDate, STATUS_STEPS } from '../../utils/helpers'
import StatusBadge from '../../components/StatusBadge'
import PriorityBadge from '../../components/PriorityBadge'
import AIResultCard from '../../components/AIResultCard'
import MapView from '../../components/MapView'
import Loading from '../../components/Loading'
import ErrorState from '../../components/ErrorState'
import Sidebar from '../../components/Sidebar'
import MobileSidebar from '../../components/MobileSidebar'
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Clock,
  Sparkles,
  Truck,
  CheckCircle2,
  Share2,
} from 'lucide-react'

export default function ReportDetails() {
  const { id } = useParams()
  const [report, setReport] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchDetail = async () => {
      setLoading(true)
      const res = await reportsAPI.getById(id)
      if (res.success && res.data) {
        setReport(res.data)
      } else {
        setError(res.error?.message || 'Report could not be found.')
      }
      setLoading(false)
    }
    fetchDetail()
  }, [id])

  if (loading) {
    return (
      <div className="flex bg-slate-50 min-h-[calc(100vh-4rem)]">
        <Sidebar role="citizen" />
        <main className="flex-1 p-8"><Loading message={`Loading report ${id}...`} /></main>
      </div>
    )
  }

  if (error || !report) {
    return (
      <div className="flex bg-slate-50 min-h-[calc(100vh-4rem)]">
        <Sidebar role="citizen" />
        <main className="flex-1 p-8">
          <ErrorState
            title="Report Not Found"
            message={`We couldn't retrieve the details for complaint ${id}.`}
          />
          <div className="text-center mt-4">
            <Link to="/citizen/reports" className="text-sm font-semibold text-emerald-600 hover:underline">
              ← Back to My Reports
            </Link>
          </div>
        </main>
      </div>
    )
  }

  // Calculate current active step index in timeline
  const currentStatusNorm = (report.status || '').toLowerCase().replace(/[\s-]/g, '_')
  const activeStepIndex = STATUS_STEPS.findIndex((s) => s.key === currentStatusNorm)

  return (
    <div className="flex bg-slate-50 min-h-[calc(100vh-4rem)]">
      <Sidebar role="citizen" />

      <main className="flex-1 p-4 sm:p-6 lg:p-8 pb-20 md:pb-8 max-w-6xl mx-auto space-y-6">
        {/* Top Back & Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200/80 gap-3">
          <div className="flex items-center gap-3">
            <Link
              to="/citizen/reports"
              className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-md">
                  {report.id}
                </span>
                <StatusBadge status={report.status} />
                <PriorityBadge priority={report.severity} score={report.priorityScore} showScore />
              </div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1">
                {report.title}
              </h1>
            </div>
          </div>

          <div className="text-right sm:text-right text-xs text-slate-500 self-start sm:self-auto">
            <div>Reported: <strong>{formatDate(report.createdAt)}</strong></div>
            <div>Updated: <strong>{formatDate(report.updatedAt)}</strong></div>
          </div>
        </div>

        {/* VISUAL STATUS TIMELINE */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-6">
            Civic Resolution Progress Timeline
          </h3>

          <div className="relative">
            {/* Connecting line */}
            <div className="hidden md:block absolute top-1/2 left-0 right-0 h-1 bg-slate-200 -translate-y-1/2 z-0" />

            <div className="grid grid-cols-2 md:grid-cols-6 gap-4 relative z-10">
              {STATUS_STEPS.map((step, idx) => {
                const isPassed = activeStepIndex >= idx
                const isCurrent = activeStepIndex === idx

                return (
                  <div
                    key={step.key}
                    className={`flex flex-col items-center text-center p-3 rounded-2xl transition-all ${
                      isCurrent
                        ? 'bg-emerald-50 border-2 border-emerald-500 shadow-xs scale-105'
                        : isPassed
                        ? 'bg-slate-50 border border-slate-200'
                        : 'bg-white opacity-50 border border-slate-100'
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold mb-2 ${
                        isCurrent
                          ? 'bg-emerald-600 text-white animate-pulse'
                          : isPassed
                          ? 'bg-emerald-500 text-white'
                          : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {isPassed ? '✓' : idx + 1}
                    </div>
                    <span className="text-xs font-bold text-slate-800">{step.label}</span>
                    {isCurrent && (
                      <span className="text-[10px] font-semibold text-emerald-600 mt-1">
                        Current Status
                      </span>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Timeline details log */}
          {report.timeline && report.timeline.length > 0 && (
            <div className="mt-6 pt-4 border-t border-slate-100 space-y-2">
              <h4 className="text-xs font-bold text-slate-700">Official Municipal Log:</h4>
              <div className="space-y-1.5 text-xs">
                {report.timeline.map((entry, i) => (
                  <div key={i} className="flex items-start gap-2 text-slate-600">
                    <span className="text-slate-400 font-mono text-[11px] shrink-0">
                      {formatDate(entry.time)}:
                    </span>
                    <span className="text-slate-800 font-medium">{entry.note}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 2-Column Content: Photo & Details + AI & Map */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column: Image & Details */}
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs overflow-hidden">
              <h3 className="text-sm font-bold text-slate-900 mb-3">Incident Photograph</h3>
              <div className="rounded-2xl overflow-hidden bg-slate-900 h-72 sm:h-80">
                <img
                  src={report.imageUrl}
                  alt={report.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="mt-4 space-y-3">
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                    Citizen Description
                  </label>
                  <p className="text-sm text-slate-700 mt-1 leading-relaxed">
                    {report.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-emerald-600" />
                    <span>{report.location?.address || report.location?.landmark}</span>
                  </div>
                  <span className="font-mono text-slate-400">
                    {report.location?.lat?.toFixed(4)}, {report.location?.lng?.toFixed(4)}
                  </span>
                </div>
              </div>
            </div>

            {/* Assigned Team card */}
            {report.assignedTeam && (
              <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
                  <Truck className="w-6 h-6" />
                </div>
                <div className="min-w-0">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Dispatched Fleet Unit
                  </span>
                  <h4 className="text-sm font-bold text-slate-900 truncate">
                    {report.assignedTeam.name}
                  </h4>
                  <p className="text-xs text-slate-500">
                    Field Team Leader: {report.assignedTeam.leader}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: AI Analysis & Location Map */}
          <div className="space-y-6">
            <AIResultCard
              analysis={{
                wasteType: report.wasteType,
                confidence: report.aiConfidence,
                severity: report.severity,
                estimatedQuantity: report.estimatedQuantity,
                priorityScore: report.priorityScore,
                hazardLevel: report.severity === 'High' ? 'High' : 'Low-Medium',
                detectedItems: [report.wasteType, 'Surface litter', 'Urban debris'],
                recommendation: `Recommended immediate dispatch to ${report.location?.zone || 'Central'} zone sanitation squad.`,
              }}
            />

            {/* Map Location */}
            <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs">
              <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-emerald-600" />
                Incident Location Pin
              </h3>
              <MapView
                reports={[report]}
                center={[report.location.lat, report.location.lng]}
                zoom={15}
                height="280px"
                showHotspots={false}
              />
            </div>
          </div>
        </div>
      </main>

      <MobileSidebar role="citizen" />
    </div>
  )
}
