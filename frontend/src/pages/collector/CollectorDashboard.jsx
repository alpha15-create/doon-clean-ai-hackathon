import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { collectionAPI } from '../../services/api'
import StatCard from '../../components/StatCard'
import StatusBadge from '../../components/StatusBadge'
import PriorityBadge from '../../components/PriorityBadge'
import MapView from '../../components/MapView'
import Loading from '../../components/Loading'
import Sidebar from '../../components/Sidebar'
import MobileSidebar from '../../components/MobileSidebar'
import {
  Truck,
  CheckSquare,
  Clock,
  MapPin,
  ArrowRight,
  ShieldCheck,
  CheckCheck,
  Navigation,
} from 'lucide-react'

export default function CollectorDashboard() {
  const { currentUser } = useAuth()
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true)
      const res = await collectionAPI.getCollectorTasks(currentUser?.email)
      if (res.success) {
        setTasks(res.data || [])
      }
      setLoading(false)
    }
    fetchTasks()
  }, [currentUser])

  if (loading) {
    return (
      <div className="flex bg-slate-50 min-h-[calc(100vh-4rem)]">
        <Sidebar role="collector" />
        <main className="flex-1 p-8"><Loading message="Loading driver tasks & route waypoints..." /></main>
      </div>
    )
  }

  const activeTasks = tasks.filter((t) => t.status !== 'Resolved')
  const completedTasks = tasks.filter((t) => t.status === 'Resolved')

  return (
    <div className="flex bg-slate-50 min-h-[calc(100vh-4rem)]">
      <Sidebar role="collector" />

      <main className="flex-1 p-4 sm:p-6 pb-20 md:pb-8 max-w-5xl mx-auto space-y-6">
        {/* Driver Header Card */}
        <div className="bg-gradient-to-r from-teal-800 to-emerald-800 text-white rounded-3xl p-6 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-teal-200 text-xs font-semibold mb-2">
              <Truck className="w-3.5 h-3.5" />
              <span>{currentUser?.teamName || 'Zone 1 - Central Rapid Sanitation'}</span>
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight">
              Driver Duty Console: {currentUser?.name || 'Vikram Singh'}
            </h1>
            <p className="text-xs text-teal-100 mt-1">
              Vehicle: <strong className="font-mono text-white">{currentUser?.vehicleNumber || 'UK-07-TA-4492'}</strong> • Active shift
            </p>
          </div>

          <Link
            to="/collector/tasks"
            className="px-5 py-2.5 bg-white text-teal-900 hover:bg-teal-50 rounded-xl text-xs font-bold shadow-xs self-start sm:self-auto"
          >
            Open Tasks List ({activeTasks.length})
          </Link>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <StatCard
            title="Pending Pickups"
            value={activeTasks.length}
            subtitle="To collect today"
            icon={Clock}
            color="amber"
          />
          <StatCard
            title="Completed"
            value={completedTasks.length}
            subtitle="Restored clean"
            icon={CheckCheck}
            color="emerald"
          />
          <StatCard
            title="Zone Sector"
            value="Central"
            subtitle="Clock Tower / Paltan"
            icon={MapPin}
            color="slate"
          />
        </div>

        {/* Today's Route Map */}
        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Today's Pickup Locations on Map</h2>
              <p className="text-xs text-slate-500">Pins mark assigned accumulation spots in your sector</p>
            </div>
            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
              GPS Navigation Ready
            </span>
          </div>

          <MapView reports={activeTasks} height="320px" showHotspots={false} />
        </div>

        {/* Immediate Next Tasks */}
        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">Immediate Pickup Queue</h3>
            <Link to="/collector/tasks" className="text-xs font-semibold text-emerald-600 hover:underline">
              View All ({activeTasks.length}) →
            </Link>
          </div>

          <div className="space-y-3">
            {activeTasks.length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-6">All tasks completed! Great work.</p>
            ) : (
              activeTasks.slice(0, 3).map((task) => (
                <div
                  key={task.id}
                  className="p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:border-slate-300 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="flex gap-3">
                    <img
                      src={task.imageUrl}
                      alt=""
                      className="w-16 h-16 rounded-xl object-cover shrink-0 border border-slate-200"
                    />
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono font-bold text-slate-800">{task.id}</span>
                        <PriorityBadge priority={task.severity} score={task.priorityScore} />
                        <StatusBadge status={task.status} size="sm" />
                      </div>
                      <h4 className="font-bold text-slate-900">{task.title}</h4>
                      <p className="text-slate-500 text-[11px] flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-emerald-600" />
                        {task.location?.landmark || task.location?.address}
                      </p>
                    </div>
                  </div>

                  <Link
                    to={`/collector/tasks/${task.id}`}
                    className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold self-end sm:self-center shadow-2xs"
                  >
                    <span>Inspect & Update</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              ))
            )}
          </div>
        </div>
      </main>

      <MobileSidebar role="collector" />
    </div>
  )
}
