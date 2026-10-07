import { useState, useEffect } from 'react'
import { dashboardAPI } from '../../services/api'
import Loading from '../../components/Loading'
import Sidebar from '../../components/Sidebar'
import MobileSidebar from '../../components/MobileSidebar'
import {
  BarChart3,
  Calendar,
  Clock,
  TrendingUp,
  ShieldCheck,
  CheckCheck,
  Percent,
  MapPin,
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
  LineChart,
  Line,
} from 'recharts'

export default function Analytics() {
  const [timeRange, setTimeRange] = useState('7d')
  const [analytics, setAnalytics] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true)
      const res = await dashboardAPI.getAnalytics(timeRange)
      if (res.success) {
        setAnalytics(res.data)
      }
      setLoading(false)
    }
    fetchAnalytics()
  }, [timeRange])

  if (loading) {
    return (
      <div className="flex bg-slate-50 min-h-[calc(100vh-4rem)]">
        <Sidebar role="admin" />
        <main className="flex-1 p-8"><Loading message="Computing city analytics models..." /></main>
      </div>
    )
  }

  const {
    summary = {},
    reportsOverTime = [],
    wasteDistribution = [],
    statusDistribution = [],
    priorityDistribution = [],
    zoneBreakdown = [],
  } = analytics || {}

  return (
    <div className="flex bg-slate-50 min-h-[calc(100vh-4rem)]">
      <Sidebar role="admin" />

      <main className="flex-1 p-4 sm:p-6 lg:p-8 pb-20 md:pb-8 max-w-7xl mx-auto space-y-8">
        {/* Header & Filter Range */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-200/80 gap-3">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 uppercase tracking-wider">
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Municipal Sanitation Intelligence</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-0.5">
              Civic Waste Analytics
            </h1>
          </div>

          {/* Time range pills */}
          <div className="flex items-center gap-1.5 bg-white p-1 rounded-2xl border border-slate-200/90 shadow-2xs self-start sm:self-auto text-xs font-semibold">
            {[
              { id: 'today', label: 'Today' },
              { id: '7d', label: 'Last 7 Days' },
              { id: '30d', label: 'Last 30 Days' },
              { id: '3m', label: 'Last 3 Months' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setTimeRange(tab.id)}
                className={`px-3 py-1.5 rounded-xl transition-all ${
                  timeRange === tab.id
                    ? 'bg-emerald-600 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Demo data alert */}
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl flex items-center justify-between text-xs text-amber-800">
          <span className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Prototype Demonstration: All charts visualize real-time sample telemetry across Dehradun.</span>
          </span>
          <span className="font-semibold text-amber-900 font-mono hidden sm:inline">Dehradun NN AI Grid</span>
        </div>

        {/* Top Summary Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
              <span>Overall Resolution Rate</span>
              <Percent className="w-4 h-4 text-emerald-600" />
            </div>
            <span className="text-3xl font-extrabold text-slate-900">{summary.resolutionRate || '80.3%'}</span>
            <p className="text-[11px] text-emerald-600 font-semibold mt-1">↑ 4.2% from prior period</p>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
              <span>Avg Resolution Time</span>
              <Clock className="w-4 h-4 text-blue-600" />
            </div>
            <span className="text-3xl font-extrabold text-slate-900">{summary.avgResolutionHours || 4.8} hrs</span>
            <p className="text-[11px] text-blue-600 font-semibold mt-1">Target: &lt; 6.0 hrs citywide</p>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
              <span>Active Hotspots</span>
              <TrendingUp className="w-4 h-4 text-amber-600" />
            </div>
            <span className="text-3xl font-extrabold text-slate-900">{summary.activeHotspots || 5}</span>
            <p className="text-[11px] text-amber-600 font-semibold mt-1">Paltan Bazaar & Rispana flagged</p>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
              <span>Collection Efficiency</span>
              <CheckCheck className="w-4 h-4 text-teal-600" />
            </div>
            <span className="text-3xl font-extrabold text-slate-900">{summary.collectionEfficiency || '92.4%'}</span>
            <p className="text-[11px] text-teal-600 font-semibold mt-1">Assigned fleet on target</p>
          </div>
        </div>

        {/* Charts Row 1: Intake Trends & Waste Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Trend Chart */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 mb-1">Incoming Reports vs Cleared Pickups</h3>
            <p className="text-xs text-slate-500 mb-4">Daily volume processed across municipal gates</p>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={reportsOverTime}>
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="reports" fill="#3b82f6" name="Reported" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="resolved" fill="#10b981" name="Resolved" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Waste Composition */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 mb-1">Waste Stream Composition</h3>
            <p className="text-xs text-slate-500 mb-4">YOLO neural network item categorization</p>

            <div className="h-64 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={wasteDistribution}
                    dataKey="count"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    innerRadius={45}
                    paddingAngle={3}
                  >
                    {wasteDistribution.map((entry, index) => (
                      <Cell key={`w-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="flex flex-wrap justify-center gap-3 text-xs text-slate-600">
              {wasteDistribution.map((w, idx) => (
                <span key={idx} className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: w.fill }} />
                  {w.name} ({w.percentage}%)
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Charts Row 2: Status Lifecycle & Zone Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Status Lifecycle */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 mb-1">Pipeline Distribution</h3>
            <p className="text-xs text-slate-500 mb-4">Volume at each municipal verification stage</p>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={statusDistribution} layout="vertical">
                  <XAxis type="number" tick={{ fontSize: 11 }} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={90} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#10b981" radius={[0, 4, 4, 0]}>
                    {statusDistribution.map((entry, index) => (
                      <Cell key={`st-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Area / Zone Table Breakdown */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 mb-1">Dehradun Zonal Performance</h3>
            <p className="text-xs text-slate-500 mb-4">Reports and resolution efficiency by region</p>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 font-semibold uppercase">
                    <th className="pb-2">Zone</th>
                    <th className="pb-2">Total Reports</th>
                    <th className="pb-2">Resolved</th>
                    <th className="pb-2 text-right">Clearance Rate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {zoneBreakdown.map((z, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="py-2.5 font-bold text-slate-800 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                        {z.zone}
                      </td>
                      <td className="py-2.5 font-mono text-slate-600">{z.reports}</td>
                      <td className="py-2.5 font-mono text-slate-600">{z.resolved}</td>
                      <td className="py-2.5 text-right font-bold text-emerald-600">{z.rate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      <MobileSidebar role="admin" />
    </div>
  )
}
