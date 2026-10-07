import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { reportsAPI } from '../../services/api'
import { useToast } from '../../context/ToastContext'
import { formatDate } from '../../utils/helpers'
import StatusBadge from '../../components/StatusBadge'
import PriorityBadge from '../../components/PriorityBadge'
import MapView from '../../components/MapView'
import Loading from '../../components/Loading'
import ErrorState from '../../components/ErrorState'
import Sidebar from '../../components/Sidebar'
import MobileSidebar from '../../components/MobileSidebar'
import {
  ArrowLeft,
  MapPin,
  Truck,
  CheckCircle2,
  RotateCw,
  Navigation,
  Camera,
  CheckCheck,
  AlertTriangle,
  ExternalLink,
} from 'lucide-react'

export default function TaskDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const toast = useToast()

  const [task, setTask] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [actionLoading, setActionLoading] = useState(false)
  const [resolvedPhotoUploaded, setResolvedPhotoUploaded] = useState(false)

  const fetchTask = async () => {
    setLoading(true)
    const res = await reportsAPI.getById(id)
    if (res.success && res.data) {
      setTask(res.data)
    } else {
      setError(res.error?.message || 'Task not found')
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchTask()
  }, [id])

  const handleUpdateStatus = async (newStatus, note) => {
    setActionLoading(true)
    const res = await reportsAPI.updateStatus(task.id, newStatus, note)
    if (res.success) {
      toast.success(`Task status updated to ${newStatus}`)
      fetchTask()
    } else {
      toast.error('Failed to update status')
    }
    setActionLoading(false)
  }

  if (loading) {
    return (
      <div className="flex bg-slate-50 min-h-[calc(100vh-4rem)]">
        <Sidebar role="collector" />
        <main className="flex-1 p-8"><Loading message={`Loading task ${id}...`} /></main>
      </div>
    )
  }

  if (error || !task) {
    return (
      <div className="flex bg-slate-50 min-h-[calc(100vh-4rem)]">
        <Sidebar role="collector" />
        <main className="flex-1 p-8">
          <ErrorState title="Task Not Found" message={error} />
        </main>
      </div>
    )
  }

  // Google Maps navigation link
  const navUrl = `https://www.google.com/maps/dir/?api=1&destination=${task.location?.lat},${task.location?.lng}`

  return (
    <div className="flex bg-slate-50 min-h-[calc(100vh-4rem)]">
      <Sidebar role="collector" />

      <main className="flex-1 p-4 sm:p-6 pb-20 md:pb-8 max-w-4xl mx-auto space-y-6">
        {/* Top Back & Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200/80">
          <div className="flex items-center gap-3">
            <Link
              to="/collector/tasks"
              className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-slate-800">{task.id}</span>
                <StatusBadge status={task.status} />
                <PriorityBadge priority={task.severity} score={task.priorityScore} showScore />
              </div>
              <h1 className="text-xl font-extrabold text-slate-900 mt-0.5">
                {task.title}
              </h1>
            </div>
          </div>
        </div>

        {/* Quick Driver Action Banner */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              Driver Clearance Workflow
            </span>
            <p className="text-sm font-semibold text-slate-800 mt-0.5">
              Current State: <span className="text-emerald-600">{task.status}</span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            {task.status === 'Assigned' && (
              <button
                type="button"
                disabled={actionLoading}
                onClick={() => handleUpdateStatus('In Progress', 'Driver accepted and departed')}
                className="flex-1 sm:flex-none px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <RotateCw className="w-4 h-4" /> Start Transit / Collection
              </button>
            )}

            {task.status === 'In Progress' && (
              <button
                type="button"
                disabled={actionLoading}
                onClick={() => handleUpdateStatus('Resolved', 'Garbage successfully picked up and site restored clean by driver')}
                className="flex-1 sm:flex-none px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <CheckCheck className="w-4 h-4" /> Mark Collected & Resolved
              </button>
            )}

            <a
              href={navUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-none px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <Navigation className="w-4 h-4 text-emerald-600" /> Open Turn-by-Turn GPS
            </a>
          </div>
        </div>

        {/* Task Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: Image & Description */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Accumulation Photo & Field Instructions
            </h3>
            <div className="rounded-2xl overflow-hidden bg-slate-900 h-64">
              <img src={task.imageUrl} alt="" className="w-full h-full object-cover" />
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="font-bold text-slate-500 block">Description:</span>
                <p className="text-slate-800 text-sm mt-0.5 leading-relaxed">{task.description}</p>
              </div>

              <div className="pt-2 border-t border-slate-100 grid grid-cols-2 gap-2 text-slate-600">
                <div>
                  <span className="block text-[11px] text-slate-400">Waste Category:</span>
                  <strong className="text-slate-800">{task.wasteType}</strong>
                </div>
                <div>
                  <span className="block text-[11px] text-slate-400">Est. Weight:</span>
                  <strong className="text-slate-800">{task.estimatedQuantity || 'Medium (~80 kg)'}</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Map Location & Directions */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-emerald-600" />
                Target Map Pin
              </h3>
              <span className="font-mono text-xs text-slate-600">
                {task.location?.lat?.toFixed(4)}, {task.location?.lng?.toFixed(4)}
              </span>
            </div>

            <MapView
              reports={[task]}
              center={[task.location.lat, task.location.lng]}
              zoom={15}
              height="260px"
              showHotspots={false}
            />

            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-1">
              <span className="font-bold text-slate-700">Locality:</span>
              <p className="text-slate-600">{task.location?.address || task.location?.landmark}</p>
              <p className="text-[11px] text-emerald-700 font-semibold mt-1">
                Zone: {task.location?.zone || 'Central Dehradun'}
              </p>
            </div>
          </div>
        </div>
      </main>

      <MobileSidebar role="collector" />
    </div>
  )
}
