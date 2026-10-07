import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useReports } from '../../hooks/useReports'
import { reportsAPI, collectionAPI } from '../../services/api'
import { useToast } from '../../context/ToastContext'
import { formatDate, formatRelativeTime } from '../../utils/helpers'
import { MOCK_TEAMS } from '../../data/mockData'
import StatusBadge from '../../components/StatusBadge'
import PriorityBadge from '../../components/PriorityBadge'
import SearchBar from '../../components/SearchBar'
import FilterBar from '../../components/FilterBar'
import Pagination from '../../components/Pagination'
import Modal from '../../components/Modal'
import Loading from '../../components/Loading'
import EmptyState from '../../components/EmptyState'
import Sidebar from '../../components/Sidebar'
import MobileSidebar from '../../components/MobileSidebar'
import {
  FileText,
  Eye,
  CheckCircle,
  Truck,
  RotateCw,
  ArrowUpDown,
  Filter,
  CheckCheck,
} from 'lucide-react'

export default function Complaints() {
  const toast = useToast()
  const [page, setPage] = useState(1)
  const pageSize = 8
  const [sortBy, setSortBy] = useState('newest') // newest | priority | oldest

  // Modals state
  const [statusModalReport, setStatusModalReport] = useState(null)
  const [selectedStatus, setSelectedStatus] = useState('In Progress')
  const [statusNote, setStatusNote] = useState('')

  const [assignModalReport, setAssignModalReport] = useState(null)
  const [selectedTeamId, setSelectedTeamId] = useState(MOCK_TEAMS[0].id)
  const [actionLoading, setActionLoading] = useState(false)

  const { reports, loading, filters, updateFilters, refetch } = useReports({
    status: 'all',
    priority: 'all',
    wasteType: 'all',
    search: '',
  })

  const handleSearch = (search) => {
    updateFilters({ search })
    setPage(1)
  }

  const handleFilterChange = (newFilters) => {
    updateFilters(newFilters)
    setPage(1)
  }

  const handleReset = () => {
    updateFilters({ status: 'all', priority: 'all', wasteType: 'all', search: '' })
    setPage(1)
  }

  // Quick verify action
  const handleQuickVerify = async (report) => {
    setActionLoading(true)
    const res = await reportsAPI.updateStatus(report.id, 'Verified', 'Verified by Municipal Officer')
    if (res.success) {
      toast.success(`Complaint ${report.id} marked as Verified.`)
      refetch()
    } else {
      toast.error('Failed to update status.')
    }
    setActionLoading(false)
  }

  // Change Status submit
  const handleStatusSubmit = async (e) => {
    e.preventDefault()
    if (!statusModalReport) return
    setActionLoading(true)
    const res = await reportsAPI.updateStatus(statusModalReport.id, selectedStatus, statusNote)
    if (res.success) {
      toast.success(`Status updated to ${selectedStatus} for ${statusModalReport.id}`)
      setStatusModalReport(null)
      setStatusNote('')
      refetch()
    } else {
      toast.error('Could not update status')
    }
    setActionLoading(false)
  }

  // Assign Team submit
  const handleAssignSubmit = async (e) => {
    e.preventDefault()
    if (!assignModalReport) return
    setActionLoading(true)
    const res = await reportsAPI.assignTeam(assignModalReport.id, selectedTeamId)
    if (res.success) {
      toast.success(`Dispatched ${assignModalReport.id} to sanitation team.`)
      setAssignModalReport(null)
      refetch()
    } else {
      toast.error('Failed to assign team')
    }
    setActionLoading(false)
  }

  // Sort logic
  const sortedReports = [...reports].sort((a, b) => {
    if (sortBy === 'priority') {
      return (b.priorityScore || 0) - (a.priorityScore || 0)
    }
    if (sortBy === 'oldest') {
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    }
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  })

  const paginatedReports = sortedReports.slice((page - 1) * pageSize, page * pageSize)

  return (
    <div className="flex bg-slate-50 min-h-[calc(100vh-4rem)]">
      <Sidebar role="admin" />

      <main className="flex-1 p-4 sm:p-6 lg:p-8 pb-20 md:pb-8 max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Grievance & Complaint Management
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Verify AI classification, change priority ratings, and assign collection fleet.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto text-xs">
            <span className="font-semibold text-slate-500 flex items-center gap-1">
              <ArrowUpDown className="w-3.5 h-3.5" /> Sort:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white border border-slate-200 rounded-xl px-3 py-2 font-medium text-slate-700 shadow-2xs focus:outline-none"
            >
              <option value="newest">Newest First</option>
              <option value="priority">Highest Priority First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs space-y-3">
          <div className="flex flex-col md:flex-row gap-3">
            <SearchBar
              value={filters.search}
              onChange={handleSearch}
              placeholder="Search by ID, citizen, landmark, or waste category..."
            />
            <FilterBar
              filters={filters}
              onChange={handleFilterChange}
              onReset={handleReset}
            />
          </div>
        </div>

        {/* Main Complaints Table / Responsive Cards */}
        {loading ? (
          <Loading message="Fetching complaints database..." />
        ) : sortedReports.length === 0 ? (
          <EmptyState
            title="No complaints match filters"
            description="Try loosening your filters or resetting the search query."
            actionLabel="Reset All Filters"
            onAction={handleReset}
          />
        ) : (
          <div className="space-y-4">
            {/* Desktop Table View */}
            <div className="hidden lg:block bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
                      <th className="py-3.5 px-4">Complaint ID</th>
                      <th className="py-3.5 px-4">Preview</th>
                      <th className="py-3.5 px-4">Waste Category</th>
                      <th className="py-3.5 px-4">Location</th>
                      <th className="py-3.5 px-4">Priority / AI</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4">Assigned Team</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {paginatedReports.map((report) => (
                      <tr key={report.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-4 font-mono font-bold text-slate-800">
                          {report.id}
                        </td>
                        <td className="py-3 px-4">
                          <img
                            src={report.imageUrl}
                            alt=""
                            className="w-12 h-10 rounded-lg object-cover border border-slate-200 shadow-2xs"
                          />
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-semibold text-slate-800">{report.wasteType}</span>
                          <span className="text-[10px] text-slate-400 block font-mono">
                            Conf: {report.aiConfidence}%
                          </span>
                        </td>
                        <td className="py-3 px-4 max-w-[200px]">
                          <p className="font-medium text-slate-800 truncate">
                            {report.location?.landmark || report.location?.address}
                          </p>
                          <span className="text-[10px] text-slate-400">
                            {formatRelativeTime(report.createdAt)}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <PriorityBadge priority={report.severity} score={report.priorityScore} showScore />
                        </td>
                        <td className="py-3 px-4">
                          <StatusBadge status={report.status} size="sm" />
                        </td>
                        <td className="py-3 px-4 max-w-[160px]">
                          {report.assignedTeam ? (
                            <span className="text-[11px] font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md truncate block">
                              {report.assignedTeam.name}
                            </span>
                          ) : (
                            <span className="text-[11px] text-slate-400 italic">Unassigned</span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-right space-x-1 whitespace-nowrap">
                          {report.status === 'Reported' && (
                            <button
                              onClick={() => handleQuickVerify(report)}
                              title="Verify Report"
                              className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => {
                              setStatusModalReport(report)
                              setSelectedStatus(report.status)
                            }}
                            title="Change Status"
                            className="p-1.5 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                          >
                            <RotateCw className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              setAssignModalReport(report)
                              setSelectedTeamId(report.assignedTeam?.id || MOCK_TEAMS[0].id)
                            }}
                            title="Assign Collection Fleet"
                            className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                          >
                            <Truck className="w-4 h-4" />
                          </button>
                          <Link
                            to={`/admin/complaints/${report.id}`}
                            title="View Full Inspection"
                            className="p-1.5 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors inline-block"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mobile / Tablet Card View */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:hidden gap-4">
              {paginatedReports.map((report) => (
                <div key={report.id} className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-3 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-slate-800">{report.id}</span>
                    <StatusBadge status={report.status} size="sm" />
                  </div>

                  <div className="flex gap-3">
                    <img
                      src={report.imageUrl}
                      alt=""
                      className="w-20 h-16 rounded-xl object-cover border border-slate-200 shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-slate-900 truncate">{report.wasteType}</p>
                      <p className="text-slate-500 text-[11px] truncate mt-0.5">{report.location?.landmark}</p>
                      <div className="mt-2">
                        <PriorityBadge priority={report.severity} score={report.priorityScore} showScore />
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400">{formatRelativeTime(report.createdAt)}</span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          setStatusModalReport(report)
                          setSelectedStatus(report.status)
                        }}
                        className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 rounded-lg font-semibold text-slate-700"
                      >
                        Status
                      </button>
                      <button
                        onClick={() => {
                          setAssignModalReport(report)
                          setSelectedTeamId(report.assignedTeam?.id || MOCK_TEAMS[0].id)
                        }}
                        className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 rounded-lg font-semibold text-emerald-700"
                      >
                        Assign
                      </button>
                      <Link
                        to={`/admin/complaints/${report.id}`}
                        className="p-1 bg-slate-50 rounded-lg text-slate-600"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <Pagination
              currentPage={page}
              totalItems={sortedReports.length}
              pageSize={pageSize}
              onPageChange={setPage}
            />
          </div>
        )}

        {/* Change Status Modal */}
        <Modal
          isOpen={!!statusModalReport}
          onClose={() => setStatusModalReport(null)}
          title={`Update Status: ${statusModalReport?.id}`}
          subtitle="Modify report lifecycle progression"
        >
          <form onSubmit={handleStatusSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Target Status
              </label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
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
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Officer Notes / Remarks
              </label>
              <textarea
                rows={3}
                value={statusNote}
                onChange={(e) => setStatusNote(e.target.value)}
                placeholder="e.g. Ground team verified heavy debris. Priority escalated."
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setStatusModalReport(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-xs font-semibold text-slate-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={actionLoading}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs disabled:opacity-50"
              >
                {actionLoading ? 'Updating...' : 'Save Status'}
              </button>
            </div>
          </form>
        </Modal>

        {/* Assign Team Modal */}
        <Modal
          isOpen={!!assignModalReport}
          onClose={() => setAssignModalReport(null)}
          title={`Assign Fleet: ${assignModalReport?.id}`}
          subtitle="Dispatch sanitation vehicle & field personnel"
        >
          <form onSubmit={handleAssignSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Select Sanitation Fleet Team
              </label>
              <div className="space-y-2">
                {MOCK_TEAMS.map((team) => (
                  <label
                    key={team.id}
                    className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${
                      selectedTeamId === team.id
                        ? 'border-emerald-500 bg-emerald-50/60'
                        : 'border-slate-200 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="team"
                      value={team.id}
                      checked={selectedTeamId === team.id}
                      onChange={() => setSelectedTeamId(team.id)}
                      className="mt-1 text-emerald-600"
                    />
                    <div className="min-w-0 flex-1 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900">{team.name}</span>
                        <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded-full font-medium">
                          {team.status}
                        </span>
                      </div>
                      <p className="text-slate-500 text-[11px] mt-0.5">{team.zone}</p>
                      <p className="text-slate-400 text-[10px] mt-1">Vehicle: {team.vehicle}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setAssignModalReport(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-xs font-semibold text-slate-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={actionLoading}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs disabled:opacity-50"
              >
                {actionLoading ? 'Dispatching...' : 'Confirm Dispatch'}
              </button>
            </div>
          </form>
        </Modal>
      </main>

      <MobileSidebar role="admin" />
    </div>
  )
}
