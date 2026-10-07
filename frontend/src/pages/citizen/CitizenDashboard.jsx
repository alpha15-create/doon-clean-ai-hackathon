import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { reportsAPI } from '../../services/api'
import StatCard from '../../components/StatCard'
import ComplaintCard from '../../components/ComplaintCard'
import MapView from '../../components/MapView'
import Loading from '../../components/Loading'
import Sidebar from '../../components/Sidebar'
import MobileSidebar from '../../components/MobileSidebar'
import {
  FileText,
  Clock,
  RotateCw,
  CheckCheck,
  PlusCircle,
  Award,
  Sparkles,
  ArrowRight,
  TrendingUp,
} from 'lucide-react'

export default function CitizenDashboard() {
  const { currentUser } = useAuth()
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      const res = await reportsAPI.getMyReports(currentUser?.id)
      if (res.success) {
        setReports(res.data || [])
      }
      setLoading(false)
    }
    load()
  }, [currentUser])

  const totalReports = reports.length
  const pendingCount = reports.filter((r) =>
    ['reported', 'ai_analyzed', 'verified'].includes(r.status.toLowerCase())
  ).length
  const inProgressCount = reports.filter((r) =>
    ['assigned', 'in_progress'].includes(r.status.toLowerCase())
  ).length
  const resolvedCount = reports.filter((r) =>
    r.status.toLowerCase() === 'resolved'
  ).length

  return (
    <div className="flex bg-slate-50 min-h-[calc(100vh-4rem)]">
      <Sidebar role="citizen" />

      <main className="flex-1 p-4 sm:p-6 lg:p-8 pb-20 md:pb-8 max-w-7xl">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-emerald-800 to-teal-800 rounded-3xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden mb-8">
          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-emerald-200 text-xs font-semibold mb-3">
              <Award className="w-3.5 h-3.5 text-amber-400" />
              <span>{currentUser?.level || 'Eco Champion (Level 3)'} • {currentUser?.points || 340} Civic Points</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Namaste, {currentUser?.name || 'Aarav'}!
            </h1>
            <p className="mt-2 text-sm text-emerald-100 font-normal leading-relaxed">
              Track your waste grievances, inspect AI YOLO classification data, and help keep Dehradun pristine.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to="/citizen/report"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-emerald-900 hover:bg-emerald-50 rounded-xl text-sm font-bold shadow-xs transition-transform active:scale-95"
              >
                <PlusCircle className="w-4 h-4 text-emerald-700" />
                Report New Waste
              </Link>
              <Link
                to="/citizen/reports"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-700/60 hover:bg-emerald-700 text-white border border-emerald-500/50 rounded-xl text-sm font-semibold transition-colors"
              >
                <FileText className="w-4 h-4" />
                View All My Reports
              </Link>
            </div>
          </div>

          <div className="absolute right-0 bottom-0 top-0 w-80 bg-radial from-emerald-400/20 to-transparent pointer-events-none hidden lg:block" />
        </div>

        {/* Top Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            title="Total Reports"
            value={totalReports}
            subtitle="Submitted by you"
            icon={FileText}
            color="slate"
          />
          <StatCard
            title="Pending Verification"
            value={pendingCount}
            subtitle="Awaiting dispatch"
            icon={Clock}
            color="amber"
          />
          <StatCard
            title="In Progress"
            value={inProgressCount}
            subtitle="Vehicle on way"
            icon={RotateCw}
            color="blue"
          />
          <StatCard
            title="Resolved"
            value={resolvedCount}
            subtitle="Cleaned & restored"
            icon={CheckCheck}
            color="emerald"
          />
        </div>

        {/* Main Content Grid: Mini Map + Recent Reports */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Reports List */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Recent Complaints</h2>
                <p className="text-xs text-slate-500">Your latest logged waste incidents</p>
              </div>
              <Link
                to="/citizen/reports"
                className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
              >
                <span>See all</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {loading ? (
              <Loading message="Loading reports..." />
            ) : reports.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 border border-slate-200 text-center">
                <p className="text-sm text-slate-600">No reports logged yet.</p>
                <Link
                  to="/citizen/report"
                  className="mt-3 inline-block px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-semibold"
                >
                  Report First Incident
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {reports.slice(0, 4).map((report) => (
                  <ComplaintCard key={report.id} report={report} />
                ))}
              </div>
            )}
          </div>

          {/* Mini Waste Map & Activity */}
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-slate-900">Your Reports on Map</h3>
                <span className="text-[11px] font-semibold text-slate-400">Dehradun Grid</span>
              </div>
              <MapView reports={reports} height="260px" showHotspots={false} />
            </div>

            {/* Recent Activity Card */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
              <h3 className="text-sm font-bold text-slate-900 mb-3">Recent Progress Feed</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3 text-xs">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                  <div>
                    <p className="font-semibold text-slate-800">DWN-1004 safely recycled</p>
                    <p className="text-slate-500 text-[11px]">E-Waste collected by North Eco Squad</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 text-xs">
                  <div className="w-2 h-2 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                  <div>
                    <p className="font-semibold text-slate-800">DWN-1001 dispatched</p>
                    <p className="text-slate-500 text-[11px]">Rapid tipper vehicle assigned to Clock Tower</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 text-xs">
                  <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                  <div>
                    <p className="font-semibold text-slate-800">+50 Civic Points Awarded</p>
                    <p className="text-slate-500 text-[11px]">For accurate GPS tagging at Rispana</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <MobileSidebar role="citizen" />
    </div>
  )
}
