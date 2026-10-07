import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { dashboardAPI, reportsAPI, hotspotsAPI } from '../../services/api'
import StatCard from '../../components/StatCard'
import StatusBadge from '../../components/StatusBadge'
import PriorityBadge from '../../components/PriorityBadge'
import MapView from '../../components/MapView'
import Loading from '../../components/Loading'
import Sidebar from '../../components/Sidebar'
import MobileSidebar from '../../components/MobileSidebar'
import {
  FileText,
  Clock,
  AlertTriangle,
  CheckCheck,
  TrendingUp,
  Flame,
  Truck,
  ArrowRight,
  ShieldCheck,
  Eye,
  PlusCircle,
} from 'lucide-react'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from 'recharts'

export default function AdminDashboard() {
  const [metrics, setMetrics] = useState(null)
  const [analytics, setAnalytics] = useState(null)
  const [recentReports, setRecentReports] = useState([])
  const [hotspots, setHotspots] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      const [overviewRes, analyticsRes, reportsRes, hotspotsRes] = await Promise.all([
        dashboardAPI.getOverview(),
        dashboardAPI.getAnalytics('7d'),
        reportsAPI.getAll(),
        hotspotsAPI.getAll(),
      ])

      if (overviewRes.success) setMetrics(overviewRes.data)
      if (analyticsRes.success) setAnalytics(analyticsRes.data)
      if (reportsRes.success) setRecentReports(reportsRes.data || [])
      if (hotspotsRes.success) setHotspots(hotspotsRes.data || [])
      setLoading(false)
    }
    loadData()
  }, [])

  if (loading) {
    return (
      <div className="flex bg-slate-50 min-h-[calc(100vh-4rem)]">
        <Sidebar role="admin" />
        <main className="flex-1 p-8"><Loading message="Loading Municipal Command Overview..." /></main>
      </div>
    )
  }

  const highPriorityReports = recentReports.filter(
    (r) => r.severity?.toLowerCase() === 'high' || r.priorityScore >= 80
  )

  return (
    <div className="flex bg-slate-50 min-h-[calc(100vh-4rem)]">
      <Sidebar role="admin" />

      <main className="flex-1 p-4 sm:p-6 lg:p-8 pb-20 md:pb-8 max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-slate-200/80 gap-3">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Dehradun Municipal Corporation (NN Doon)</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-0.5">
              Sanitation Command Center
            </h1>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <Link
              to="/admin/complaints"
              className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl shadow-2xs"
            >
              All Complaints
            </Link>
            <Link
              to="/admin/hotspots"
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5"
            >
              <Flame className="w-3.5 h-3.5" />
              Hotspot Intelligence
            </Link>
          </div>
        </div>

        {/* Top 5 Key Stat Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <StatCard
            title="Total Complaints"
            value={metrics?.totalReports || 0}
            trend="+12% this week"
            trendType="up"
            icon={FileText}
            color="slate"
          />
          <StatCard
            title="Pending Actions"
            value={metrics?.pendingReports || 0}
            trend="Needs dispatch"
            trendType="down"
            icon={Clock}
            color="amber"
          />
          <StatCard
            title="High Priority"
            value={metrics?.highPriority || 0}
            trend="Urgent"
            trendType="down"
            icon={AlertTriangle}
            color="rose"
          />
          <StatCard
            title="Resolved Reports"
            value={metrics?.resolved || 0}
            trend="+24 resolved"
            trendType="up"
            icon={CheckCheck}
            color="emerald"
          />
          <StatCard
            title="Resolution Rate"
            value={metrics?.resolutionRate || '80%'}
            subtitle="Avg 4.8 hrs"
            icon={TrendingUp}
            color="blue"
          />
        </div>

        {/* Charts Grid: 4 Core Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Chart 1: Reports Over Time */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Weekly Complaints vs Resolutions</h3>
                <p className="text-xs text-slate-500">Intake velocity over the last 7 days</p>
              </div>
              <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                Dehradun Grid
              </span>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics?.reportsOverTime || []}>
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="reports" fill="#3b82f6" name="Reported" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="resolved" fill="#10b981" name="Resolved" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 2: Waste Category Distribution */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Waste Classification Breakdown</h3>
                <p className="text-xs text-slate-500">Classified by YOLO deep learning vision</p>
              </div>
              <span className="text-xs font-semibold text-slate-500">By Mass Share</span>
            </div>

            <div className="h-64 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={analytics?.wasteDistribution || []}
                    dataKey="count"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    innerRadius={45}
                    paddingAngle={3}
                  >
                    {(analytics?.wasteDistribution || []).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2 text-[11px] text-slate-600">
              {(analytics?.wasteDistribution || []).map((item, idx) => (
                <div key={idx} className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.fill }} />
                  <span>{item.name}: <strong>{item.percentage}%</strong></span>
                </div>
              ))}
            </div>
          </div>

          {/* Chart 3: Status Distribution */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Lifecycle Status Breakdown</h3>
                <p className="text-xs text-slate-500">Active distribution in municipal workflow</p>
              </div>
            </div>

            <div className="h-60 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics?.statusDistribution || []} layout="vertical">
                  <XAxis type="number" tick={{ fontSize: 11 }} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={90} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#10b981" radius={[0, 4, 4, 0]}>
                    {(analytics?.statusDistribution || []).map((entry, index) => (
                      <Cell key={`cell-status-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 4: Priority Distribution */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Urgency & Severity Tiers</h3>
                <p className="text-xs text-slate-500">Calculated by biological and drain hazards</p>
              </div>
            </div>

            <div className="h-60 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={analytics?.priorityDistribution || []}
                    dataKey="count"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                  >
                    {(analytics?.priorityDistribution || []).map((entry, index) => (
                      <Cell key={`cell-p-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="flex justify-center gap-4 text-xs font-semibold text-slate-700">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-rose-500 rounded-full" /> High</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-amber-500 rounded-full" /> Medium</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-emerald-500 rounded-full" /> Low</span>
            </div>
          </div>
        </div>

        {/* Map Preview & High Priority Alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Map Preview */}
          <div className="lg:col-span-2 bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Geospatial Incident & Hotspot Grid</h3>
                <p className="text-xs text-slate-500">Pins colored by urgency. Hotspot circles marked.</p>
              </div>
              <Link to="/admin/hotspots" className="text-xs font-semibold text-emerald-600 hover:underline">
                Expand Hotspots →
              </Link>
            </div>
            <MapView reports={recentReports} hotspots={hotspots} height="360px" showHotspots={true} />
          </div>

          {/* High Priority Alerts List */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                Urgent Action Queue
              </h3>
              <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md">
                {highPriorityReports.length} Critical
              </span>
            </div>

            <div className="space-y-3 max-h-[340px] overflow-y-auto pr-1">
              {highPriorityReports.slice(0, 4).map((report) => (
                <div
                  key={report.id}
                  className="p-3 rounded-2xl bg-slate-50 border border-slate-200 hover:border-slate-300 transition-colors space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-slate-800">{report.id}</span>
                    <PriorityBadge priority={report.severity} score={report.priorityScore} showScore />
                  </div>
                  <p className="font-semibold text-slate-900 line-clamp-1">{report.title}</p>
                  <p className="text-slate-500 text-[11px] truncate">{report.location?.landmark}</p>
                  <div className="flex items-center justify-between pt-1 border-t border-slate-200/60">
                    <StatusBadge status={report.status} size="sm" />
                    <Link
                      to={`/admin/complaints/${report.id}`}
                      className="text-emerald-600 font-bold hover:underline"
                    >
                      Inspect →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <MobileSidebar role="admin" />
    </div>
  )
}
