import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { reportsAPI } from '../../services/api'
import { useToast } from '../../context/ToastContext'
import { formatDate, STATUS_STEPS } from '../../utils/helpers'
import { MOCK_TEAMS } from '../../data/mockData'
import StatusBadge from '../../components/StatusBadge'
import PriorityBadge from '../../components/PriorityBadge'
import AIResultCard from '../../components/AIResultCard'
import MapView from '../../components/MapView'
import Modal from '../../components/Modal'
import ConfirmDialog from '../../components/ConfirmDialog'
import Loading from '../../components/Loading'
import ErrorState from '../../components/ErrorState'
import Sidebar from '../../components/Sidebar'
import MobileSidebar from '../../components/MobileSidebar'
import {
  ArrowLeft,
  CheckCircle,
  Truck,
  RotateCw,
  AlertTriangle,
  User,
  MapPin,
  Calendar,
  Layers,
  Shield,
  Clock,
  Sparkles,
} from 'lucide-react'

export default function ComplaintDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const toast = useToast()

  const [report, setReport] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [actionLoading, setActionLoading] = useState(false)

  // Dialog & Modal state
  const [confirmVerifyOpen, setConfirmVerifyOpen] = useState(false)
  const [statusModalOpen, setStatusModalOpen] = useState(false)
  const [selectedStatus, setSelectedStatus] = useState('')
  const [statusNote, setStatusNote] = useState('')

  const [priorityModalOpen, setPriorityModalOpen] = useState(false)
  const [selectedPriority, setSelectedPriority] = useState('High')
  const [selectedScore, setSelectedScore] = useState(85)

  const [assignModalOpen, setAssignModalOpen] = useState(false)
  const [selectedTeamId, setSelectedTeamId] = useState(MOCK_TEAMS[0].id)

  const fetchDetail = async () => {
    setLoading(true)
    const res = await reportsAPI.getById(id)
    if (res.success && res.data) {
      setReport(res.data)
      setSelectedStatus(res.data.status)
      setSelectedPriority(res.data.severity)
      setSelectedScore(res.data.priorityScore)
    } else {
      setError(res.error?.message || 'Report not found')
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchDetail()
  }, [id])

  if (loading) {
    return (
      <div className="flex bg-slate-50 min-h-[calc(100vh-4rem)]">
        <Sidebar role="admin" />
        <main className="flex-1 p-8"><Loading message={`Loading complaint details for ${id}...`} /></main>
      </div>
    )
  }

  if (error || !report) {
    return (
      <div className="flex bg-slate-50 min-h-[calc(100vh-4rem)]">
        <Sidebar role="admin" />
        <main className="flex-1 p-8">
          <ErrorState title="Complaint Not Found" message={error} />
        </main>
      </div>
    )
  }

  // Verify action
  const handleConfirmVerify = async () => {
    setActionLoading(true)
    const res = await reportsAPI.updateStatus(report.id, 'Verified', 'Verified by Municipal Officer')
    if (res.success) {
      toast.success(`Complaint ${report.id} marked as Verified.`)
      setConfirmVerifyOpen(false)
      fetchDetail()
    } else {
      toast.error('Failed to verify complaint')
    }
    setActionLoading(false)
  }

  // Status update
  const handleStatusSubmit = async (e) => {
    e.preventDefault()
    setActionLoading(true)
    const res = await reportsAPI.updateStatus(report.id, selectedStatus, statusNote)
    if (res.success) {
      toast.success(`Status updated to ${selectedStatus}`)
      setStatusModalOpen(false)
      setStatusNote('')
      fetchDetail()
    } else {
      toast.error('Could not update status')
    }
    setActionLoading(false)
  }

  // Priority update
  const handlePrioritySubmit = async (e) => {
    e.preventDefault()
    setActionLoading(true)
    const res = await reportsAPI.updatePriority(report.id, selectedPriority, parseInt(selectedScore))
    if (res.success) {
      toast.success('Priority and severity score adjusted successfully.')
      setPriorityModalOpen(false)
      fetchDetail()
    } else {
      toast.error('Could not update priority')
    }
    setActionLoading(false)
  }

  // Assign Team
  const handleAssignSubmit = async (e) => {
    e.preventDefault()
    setActionLoading(true)
    const res = await reportsAPI.assignTeam(report.id, selectedTeamId)
    if (res.success) {
      toast.success(`Report dispatched to team.`)
      setAssignModalOpen(false)
      fetchDetail()
    } else {
      toast.error('Could not assign team')
    }
    setActionLoading(false)
  }

  return (
    <div className="flex bg-slate-50 min-h-[calc(100vh-4rem)]">
      <Sidebar role="admin" />

      <main className="flex-1 p-4 sm:p-6 lg:p-8 pb-20 md:pb-8 max-w-6xl mx-auto space-y-6">
        {/* Top bar with back button & quick actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200/80 gap-3">
          <div className="flex items-center gap-3">
            <Link
              to="/admin/complaints"
              className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
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

          {/* Admin Operations Toolbar */}
          <div className="flex flex-wrap items-center gap-2">
            {report.status !== 'Verified' && report.status !== 'Resolved' && (
              <button
                onClick={() => setConfirmVerifyOpen(true)}
                className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5"
              >
                <CheckCircle className="w-4 h-4" /> Verify
              </button>
            )}
            <button
              onClick={() => setStatusModalOpen(true)}
              className="px-3.5 py-2 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-bold shadow-2xs transition-colors flex items-center gap-1.5"
            >
              <RotateCw className="w-4 h-4" /> Change Status
            </button>
            <button
              onClick={() => setPriorityModalOpen(true)}
              className="px-3.5 py-2 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-bold shadow-2xs transition-colors flex items-center gap-1.5"
            >
              <AlertTriangle className="w-4 h-4 text-amber-500" /> Override Priority
            </button>
            <button
              onClick={() => setAssignModalOpen(true)}
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5"
            >
              <Truck className="w-4 h-4" /> Dispatch Fleet
            </button>
          </div>
        </div>

        {/* Duplicate Warning if flagged */}
        {report.isDuplicate && (
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-3 text-xs text-amber-800">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-amber-900">Spatial Proximity Duplicate Warning</h4>
              <p className="mt-0.5">
                Our spatial clustering algorithm detected {report.duplicateCount || 2} other active complaints within 50 meters of this location in the last 24 hours. Consider bundling them into a single collection mission.
              </p>
            </div>
          </div>
        )}

        {/* 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: Photograph, Citizen Info, Description */}
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                Reported Incident Photograph
              </h3>
              <div className="rounded-2xl overflow-hidden bg-slate-900 h-72 sm:h-80">
                <img src={report.imageUrl} alt="" className="w-full h-full object-cover" />
              </div>

              <div className="mt-4 space-y-3 text-xs">
                <div>
                  <span className="font-bold text-slate-400 uppercase tracking-wider block">Description</span>
                  <p className="text-sm text-slate-800 mt-1 leading-relaxed">{report.description}</p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-slate-500">
                  <span>Logged by Citizen:</span>
                  <strong className="text-slate-800">{report.citizen?.name} ({report.citizen?.phone})</strong>
                </div>
                <div className="flex items-center justify-between text-slate-500">
                  <span>Created Timestamp:</span>
                  <span className="font-mono text-slate-700">{formatDate(report.createdAt)}</span>
                </div>
              </div>
            </div>

            {/* Assigned Fleet Details */}
            <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                Assigned Sanitation Team
              </h3>
              {report.assignedTeam ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center">
                      <Truck className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{report.assignedTeam.name}</h4>
                      <p className="text-xs text-slate-500">Team Leader: {report.assignedTeam.leader}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setAssignModalOpen(true)}
                    className="text-xs font-bold text-emerald-600 hover:underline"
                  >
                    Reassign
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-between py-2 text-xs">
                  <span className="text-slate-500 italic">No team currently dispatched.</span>
                  <button
                    onClick={() => setAssignModalOpen(true)}
                    className="px-3 py-1.5 bg-emerald-600 text-white rounded-xl font-bold shadow-xs"
                  >
                    Dispatch Now
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right: AI Vision Breakdown & Map */}
          <div className="space-y-6">
            <AIResultCard
              analysis={{
                wasteType: report.wasteType,
                confidence: report.aiConfidence,
                severity: report.severity,
                estimatedQuantity: report.estimatedQuantity,
                priorityScore: report.priorityScore,
                hazardLevel: report.severity === 'High' ? 'Critical' : 'Moderate',
                detectedItems: [report.wasteType, 'Contaminants', 'Organic mass'],
                recommendation: 'Immediate rapid pickup indicated due to street pedestrian traffic.',
              }}
            />

            {/* Map Location */}
            <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-emerald-600" />
                Precise Location Coordinates
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

        {/* Confirm Verify Dialog */}
        <ConfirmDialog
          isOpen={confirmVerifyOpen}
          onClose={() => setConfirmVerifyOpen(false)}
          onConfirm={handleConfirmVerify}
          title="Verify Waste Report"
          message={`Are you sure you want to officially verify report ${report.id}? This will confirm authenticity and flag for immediate dispatch.`}
          confirmText="Yes, Verify Report"
          confirmVariant="emerald"
          loading={actionLoading}
        />

        {/* Change Status Modal */}
        <Modal
          isOpen={statusModalOpen}
          onClose={() => setStatusModalOpen(false)}
          title={`Update Status: ${report.id}`}
        >
          <form onSubmit={handleStatusSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Status</label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
              >
                <option value="Reported">Reported</option>
                <option value="AI Analyzed">AI Analyzed</option>
                <option value="Verified">Verified</option>
                <option value="Assigned">Assigned</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Notes</label>
              <textarea
                rows={3}
                value={statusNote}
                onChange={(e) => setStatusNote(e.target.value)}
                placeholder="Log reason for status change..."
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
              />
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setStatusModalOpen(false)}
                className="px-4 py-2 bg-slate-100 rounded-xl text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={actionLoading}
                className="px-5 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold"
              >
                Save
              </button>
            </div>
          </form>
        </Modal>

        {/* Override Priority Modal */}
        <Modal
          isOpen={priorityModalOpen}
          onClose={() => setPriorityModalOpen(false)}
          title={`Override Priority: ${report.id}`}
        >
          <form onSubmit={handlePrioritySubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Severity Rating</label>
              <select
                value={selectedPriority}
                onChange={(e) => setSelectedPriority(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
              >
                <option value="High">High Severity</option>
                <option value="Medium">Medium Severity</option>
                <option value="Low">Low Severity</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Priority Score (0 - 100)</label>
              <input
                type="number"
                min="0"
                max="100"
                value={selectedScore}
                onChange={(e) => setSelectedScore(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono"
              />
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setPriorityModalOpen(false)}
                className="px-4 py-2 bg-slate-100 rounded-xl text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={actionLoading}
                className="px-5 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold"
              >
                Apply Override
              </button>
            </div>
          </form>
        </Modal>

        {/* Assign Team Modal */}
        <Modal
          isOpen={assignModalOpen}
          onClose={() => setAssignModalOpen(false)}
          title={`Dispatch Sanitation Team: ${report.id}`}
        >
          <form onSubmit={handleAssignSubmit} className="space-y-4">
            <div className="space-y-2">
              {MOCK_TEAMS.map((team) => (
                <label
                  key={team.id}
                  className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer ${
                    selectedTeamId === team.id ? 'border-emerald-500 bg-emerald-50/50' : 'border-slate-200'
                  }`}
                >
                  <input
                    type="radio"
                    name="team"
                    value={team.id}
                    checked={selectedTeamId === team.id}
                    onChange={() => setSelectedTeamId(team.id)}
                    className="mt-1"
                  />
                  <div className="text-xs">
                    <p className="font-bold text-slate-900">{team.name}</p>
                    <p className="text-slate-500">{team.zone} • {team.vehicle}</p>
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
                Confirm Dispatch
              </button>
            </div>
          </form>
        </Modal>
      </main>

      <MobileSidebar role="admin" />
    </div>
  )
}
