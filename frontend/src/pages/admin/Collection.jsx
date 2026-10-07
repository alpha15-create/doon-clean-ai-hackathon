import { useState, useEffect } from 'react'
import { collectionAPI, reportsAPI } from '../../services/api'
import { useToast } from '../../context/ToastContext'
import { MOCK_TEAMS } from '../../data/mockData'
import StatusBadge from '../../components/StatusBadge'
import PriorityBadge from '../../components/PriorityBadge'
import Modal from '../../components/Modal'
import Loading from '../../components/Loading'
import Sidebar from '../../components/Sidebar'
import MobileSidebar from '../../components/MobileSidebar'
import {
  Truck,
  Users,
  CheckCircle,
  Clock,
  Navigation,
  Compass,
  Sparkles,
  Zap,
  Leaf,
  Layers,
  ArrowRight,
} from 'lucide-react'

export default function Collection() {
  const toast = useToast()
  const [teams, setTeams] = useState(MOCK_TEAMS)
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [generatingRoute, setGeneratingRoute] = useState(false)
  const [routeResult, setRouteResult] = useState(null)

  // Assignment Modal
  const [assignModalOpen, setAssignModalOpen] = useState(false)
  const [selectedReportId, setSelectedReportId] = useState('')
  const [targetTeamId, setTargetTeamId] = useState(MOCK_TEAMS[0].id)
  const [actionLoading, setActionLoading] = useState(false)

  const fetchData = async () => {
    setLoading(true)
    const [tRes, rRes] = await Promise.all([
      collectionAPI.getTeams(),
      reportsAPI.getAll(),
    ])
    if (tRes.success) setTeams(tRes.data || MOCK_TEAMS)
    if (rRes.success) setReports(rRes.data || [])
    setLoading(false)
  }

  useEffect(() => {
    fetchData()
  }, [])

  const pendingReports = reports.filter((r) =>
    ['reported', 'ai_analyzed', 'verified'].includes(r.status.toLowerCase())
  )
  const assignedReports = reports.filter((r) =>
    ['assigned', 'in_progress'].includes(r.status.toLowerCase())
  )
  const completedReports = reports.filter((r) =>
    r.status.toLowerCase() === 'resolved'
  )

  const handleGenerateOptimalRoute = async () => {
    setGeneratingRoute(true)
    const res = await collectionAPI.generateRoute(assignedReports.map((r) => r.id))
    if (res.success && res.data) {
      setRouteResult(res.data)
      toast.success('Generated optimal shortest sanitation route for active teams.', 'Route Generated')
    }
    setGeneratingRoute(false)
  }

  const handleAssignSubmit = async (e) => {
    e.preventDefault()
    if (!selectedReportId) return
    setActionLoading(true)
    const res = await reportsAPI.assignTeam(selectedReportId, targetTeamId)
    if (res.success) {
      toast.success(`Complaint assigned to collection team.`)
      setAssignModalOpen(false)
      fetchData()
    } else {
      toast.error('Failed to assign team')
    }
    setActionLoading(false)
  }

  if (loading) {
    return (
      <div className="flex bg-slate-50 min-h-[calc(100vh-4rem)]">
        <Sidebar role="admin" />
        <main className="flex-1 p-8"><Loading message="Loading fleet operational telemetry..." /></main>
      </div>
    )
  }

  return (
    <div className="flex bg-slate-50 min-h-[calc(100vh-4rem)]">
      <Sidebar role="admin" />

      <main className="flex-1 p-4 sm:p-6 lg:p-8 pb-20 md:pb-8 max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-slate-200/80 gap-3">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 uppercase tracking-wider">
              <Truck className="w-3.5 h-3.5" />
              <span>Municipal Sanitation Fleet Control</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-0.5">
              Collection & Dispatch Operations
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Manage field personnel, truck capacities, and AI-optimized collection routing.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            {pendingReports.length > 0 && (
              <button
                onClick={() => {
                  setSelectedReportId(pendingReports[0].id)
                  setAssignModalOpen(true)
                }}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
              >
                + Assign Unassigned Task
              </button>
            )}

            <button
              onClick={handleGenerateOptimalRoute}
              disabled={generatingRoute}
              className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-800 text-xs font-bold rounded-xl shadow-2xs flex items-center gap-1.5"
            >
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              {generatingRoute ? 'Calculating Paths...' : 'Generate Smart Routes'}
            </button>
          </div>
        </div>

        {/* AI Route Optimizer Banner if triggered */}
        {routeResult && (
          <div className="bg-gradient-to-r from-emerald-900 to-teal-900 text-white p-6 rounded-3xl shadow-lg border border-emerald-700 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 animate-in slide-in-from-top-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs text-emerald-300 font-bold uppercase tracking-wider">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span>AI TSP Shortest Path Pathfinding Complete</span>
              </div>
              <h3 className="text-lg font-bold">Route ID: {routeResult.routeId}</h3>
              <p className="text-xs text-emerald-100">
                Optimized route sequenced across {routeResult.waypointsCount} stops in Clock Tower & Paltan corridors.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4 bg-emerald-950/60 p-3 rounded-2xl border border-emerald-700/60 text-xs font-mono">
              <div>
                <span className="text-emerald-400 block text-[10px] font-sans">Total Distance</span>
                <span className="text-sm font-bold text-white">{routeResult.totalDistanceKm} km</span>
              </div>
              <div className="border-l border-emerald-700/60 pl-3">
                <span className="text-emerald-400 block text-[10px] font-sans">Est. Driving Time</span>
                <span className="text-sm font-bold text-white">{routeResult.estimatedTimeMinutes} min</span>
              </div>
              <div className="border-l border-emerald-700/60 pl-3">
                <span className="text-emerald-400 block text-[10px] font-sans">Fuel & CO₂ Savings</span>
                <span className="text-sm font-bold text-emerald-300">-{routeResult.co2SavedKg} kg</span>
              </div>
            </div>
          </div>
        )}

        {/* Fleet Teams Grid */}
        <div>
          <h2 className="text-base font-bold text-slate-900 mb-3">Sanitation Fleet Teams</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {teams.map((team) => (
              <div
                key={team.id}
                className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-3 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl">{team.avatar || '🚚'}</span>
                    <span
                      className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase ${
                        team.status === 'Available'
                          ? 'bg-emerald-100 text-emerald-800'
                          : team.status === 'In Transit'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {team.status}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900">{team.name}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">{team.zone}</p>
                </div>

                <div className="pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
                  <div className="flex justify-between">
                    <span>Supervisor:</span>
                    <strong className="text-slate-800">{team.leader}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Vehicle:</span>
                    <span className="font-mono text-slate-700 truncate">{team.vehicle.split(' ')[0]}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Current Load:</span>
                    <strong className="text-emerald-600">{team.capacity}</strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Assigned and Pending Tasks Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Active Assigned Tasks */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-600" />
                Active Field Tasks ({assignedReports.length})
              </h3>
              <span className="text-xs text-slate-500">Currently in progress</span>
            </div>

            <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
              {assignedReports.length === 0 ? (
                <p className="text-xs text-slate-500 text-center py-6">No tasks currently assigned to fleet.</p>
              ) : (
                assignedReports.map((report) => (
                  <div
                    key={report.id}
                    className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-slate-800">{report.id}</span>
                      <StatusBadge status={report.status} size="sm" />
                    </div>
                    <p className="font-bold text-slate-900">{report.title}</p>
                    <div className="flex items-center justify-between text-slate-500 text-[11px]">
                      <span>Loc: {report.location?.landmark}</span>
                      <span className="text-teal-700 font-semibold">{report.assignedTeam?.name}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Pending Dispatch Queue */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Navigation className="w-4 h-4 text-amber-500" />
                Pending Dispatch Queue ({pendingReports.length})
              </h3>
              <span className="text-xs text-slate-500">Requires vehicle assignment</span>
            </div>

            <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
              {pendingReports.length === 0 ? (
                <p className="text-xs text-slate-500 text-center py-6">All verified complaints have been assigned!</p>
              ) : (
                pendingReports.map((report) => (
                  <div
                    key={report.id}
                    className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-xs flex items-center justify-between"
                  >
                    <div className="min-w-0 pr-2">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono font-bold text-slate-800">{report.id}</span>
                        <PriorityBadge priority={report.severity} score={report.priorityScore} />
                      </div>
                      <p className="font-bold text-slate-900 truncate">{report.wasteType}</p>
                      <p className="text-[11px] text-slate-500 truncate">{report.location?.landmark}</p>
                    </div>

                    <button
                      onClick={() => {
                        setSelectedReportId(report.id)
                        setAssignModalOpen(true)
                      }}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shrink-0 shadow-2xs"
                    >
                      Dispatch
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Modal for Quick Assignment */}
        <Modal
          isOpen={assignModalOpen}
          onClose={() => setAssignModalOpen(false)}
          title="Dispatch Sanitation Fleet"
          subtitle={`Assign complaint ${selectedReportId} to zone team`}
        >
          <form onSubmit={handleAssignSubmit} className="space-y-4">
            <div className="space-y-2">
              {teams.map((t) => (
                <label
                  key={t.id}
                  className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer ${
                    targetTeamId === t.id ? 'border-emerald-500 bg-emerald-50/60' : 'border-slate-200'
                  }`}
                >
                  <input
                    type="radio"
                    name="modalTeam"
                    value={t.id}
                    checked={targetTeamId === t.id}
                    onChange={() => setTargetTeamId(t.id)}
                    className="mt-1"
                  />
                  <div className="text-xs">
                    <p className="font-bold text-slate-900">{t.name}</p>
                    <p className="text-slate-500">{t.zone} • {t.vehicle}</p>
                  </div>
                </label>
              ))}
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setAssignModalOpen(false)}
                className="px-4 py-2 bg-slate-100 rounded-xl text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={actionLoading}
                className="px-5 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold"
              >
                {actionLoading ? 'Assigning...' : 'Assign'}
              </button>
            </div>
          </form>
        </Modal>
      </main>

      <MobileSidebar role="admin" />
    </div>
  )
}
