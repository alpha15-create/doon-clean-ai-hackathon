import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { collectionAPI, reportsAPI } from '../../services/api'
import { useToast } from '../../context/ToastContext'
import StatusBadge from '../../components/StatusBadge'
import PriorityBadge from '../../components/PriorityBadge'
import Loading from '../../components/Loading'
import Sidebar from '../../components/Sidebar'
import MobileSidebar from '../../components/MobileSidebar'
import {
  Truck,
  MapPin,
  CheckCircle,
  RotateCw,
  Eye,
  CheckCheck,
  AlertTriangle,
} from 'lucide-react'

export default function Tasks() {
  const { currentUser } = useAuth()
  const toast = useToast()
  const [tasks, setTasks] = useState([])
  const [filter, setFilter] = useState('all') // all | pending | in_progress | resolved
  const [loading, setLoading] = useState(true)
  const [updatingId, setUpdatingId] = useState(null)

  const fetchTasks = async () => {
    setLoading(true)
    const res = await collectionAPI.getCollectorTasks(currentUser?.email)
    if (res.success) {
      setTasks(res.data || [])
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchTasks()
  }, [currentUser])

  // Quick driver action buttons
  const handleQuickStatusChange = async (taskId, newStatus, note) => {
    setUpdatingId(taskId)
    const res = await reportsAPI.updateStatus(taskId, newStatus, note)
    if (res.success) {
      toast.success(`Task ${taskId} updated to ${newStatus}`)
      fetchTasks()
    } else {
      toast.error('Could not update status')
    }
    setUpdatingId(null)
  }

  const filteredTasks = tasks.filter((t) => {
    if (filter === 'pending') return t.status === 'Assigned'
    if (filter === 'in_progress') return t.status === 'In Progress'
    if (filter === 'resolved') return t.status === 'Resolved'
    return true
  })

  return (
    <div className="flex bg-slate-50 min-h-[calc(100vh-4rem)]">
      <Sidebar role="collector" />

      <main className="flex-1 p-4 sm:p-6 pb-20 md:pb-8 max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-slate-200/80 gap-3">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Assigned Field Collection Tasks
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Rapid on-site clearance pipeline for {currentUser?.teamName || 'Zone 1 Fleet'}
            </p>
          </div>

          {/* Quick tab filter */}
          <div className="flex items-center gap-1 bg-white p-1 rounded-2xl border border-slate-200 text-xs font-semibold self-start sm:self-auto">
            {['all', 'pending', 'in_progress', 'resolved'].map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-3 py-1.5 rounded-xl capitalize transition-colors ${
                  filter === tab
                    ? 'bg-emerald-600 text-white shadow-2xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Tasks List */}
        {loading ? (
          <Loading message="Loading assigned route tasks..." />
        ) : filteredTasks.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 border border-slate-200 text-center text-xs text-slate-500">
            No tasks found matching filter: {filter}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredTasks.map((task) => {
              const isUpdating = updatingId === task.id

              return (
                <div
                  key={task.id}
                  className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-4 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-slate-800 text-sm">{task.id}</span>
                      <StatusBadge status={task.status} size="sm" />
                      <PriorityBadge priority={task.severity} score={task.priorityScore} showScore />
                    </div>
                    <span className="text-[11px] text-slate-400 font-mono">
                      {task.location?.lat?.toFixed(3)}, {task.location?.lng?.toFixed(3)}
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <img
                      src={task.imageUrl}
                      alt=""
                      className="w-full sm:w-32 h-28 rounded-2xl object-cover border border-slate-200 shrink-0"
                    />
                    <div className="flex-1 space-y-2">
                      <h3 className="font-bold text-slate-900 text-sm leading-snug">{task.title}</h3>
                      <p className="text-slate-600 leading-relaxed line-clamp-2">{task.description}</p>
                      <div className="flex items-center gap-1.5 text-slate-700 font-medium">
                        <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>{task.location?.address || task.location?.landmark}</span>
                      </div>
                    </div>
                  </div>

                  {/* Driver workflow action bar */}
                  <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                    <span className="text-[11px] text-slate-500">
                      Waste Type: <strong className="text-slate-800">{task.wasteType}</strong>
                    </span>

                    <div className="flex flex-wrap items-center gap-2">
                      {task.status === 'Assigned' && (
                        <button
                          type="button"
                          disabled={isUpdating}
                          onClick={() => handleQuickStatusChange(task.id, 'In Progress', 'Driver en route to pickup site')}
                          className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-2xs transition-colors flex items-center gap-1"
                        >
                          <RotateCw className="w-3.5 h-3.5" />
                          Start Collection
                        </button>
                      )}

                      {task.status === 'In Progress' && (
                        <button
                          type="button"
                          disabled={isUpdating}
                          onClick={() => handleQuickStatusChange(task.id, 'Resolved', 'Waste collected and area cleared by driver')}
                          className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-2xs transition-colors flex items-center gap-1"
                        >
                          <CheckCheck className="w-3.5 h-3.5" />
                          Mark Collected & Resolved
                        </button>
                      )}

                      <Link
                        to={`/collector/tasks/${task.id}`}
                        className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold flex items-center gap-1 transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        Full Navigation
                      </Link>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>

      <MobileSidebar role="collector" />
    </div>
  )
}
