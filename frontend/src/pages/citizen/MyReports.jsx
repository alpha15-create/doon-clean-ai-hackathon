import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useReports } from '../../hooks/useReports'
import ComplaintCard from '../../components/ComplaintCard'
import SearchBar from '../../components/SearchBar'
import FilterBar from '../../components/FilterBar'
import Pagination from '../../components/Pagination'
import Loading from '../../components/Loading'
import EmptyState from '../../components/EmptyState'
import Sidebar from '../../components/Sidebar'
import MobileSidebar from '../../components/MobileSidebar'
import { PlusCircle, FileText } from 'lucide-react'

export default function MyReports() {
  const { currentUser } = useAuth()
  const [page, setPage] = useState(1)
  const pageSize = 6

  const { reports, loading, filters, updateFilters } = useReports(
    { status: 'all', priority: 'all', wasteType: 'all', search: '' },
    true,
    currentUser?.id
  )

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

  const paginatedReports = reports.slice((page - 1) * pageSize, page * pageSize)

  return (
    <div className="flex bg-slate-50 min-h-[calc(100vh-4rem)]">
      <Sidebar role="citizen" />

      <main className="flex-1 p-4 sm:p-6 lg:p-8 pb-20 md:pb-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              My Waste Reports
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Track resolution progress, AI vision metrics, and municipal status updates.
            </p>
          </div>

          <Link
            to="/citizen/report"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold shadow-xs self-start sm:self-auto transition-transform active:scale-95"
          >
            <PlusCircle className="w-4 h-4" />
            Report New Waste
          </Link>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs mb-6 space-y-3">
          <div className="flex flex-col md:flex-row gap-3">
            <SearchBar
              value={filters.search}
              onChange={handleSearch}
              placeholder="Search by ID, landmark, or waste type..."
            />
            <FilterBar
              filters={filters}
              onChange={handleFilterChange}
              onReset={handleReset}
            />
          </div>
        </div>

        {/* Content list */}
        {loading ? (
          <Loading message="Loading your submitted reports..." />
        ) : reports.length === 0 ? (
          <EmptyState
            title="No reports found"
            description="You don't have any complaints matching the active search or filters."
            actionLabel="File a Waste Report"
            onAction={() => handleReset()}
          />
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {paginatedReports.map((report) => (
                <ComplaintCard
                  key={report.id}
                  report={report}
                  linkPrefix="/citizen/reports"
                />
              ))}
            </div>

            <Pagination
              currentPage={page}
              totalItems={reports.length}
              pageSize={pageSize}
              onPageChange={setPage}
            />
          </div>
        )}
      </main>

      <MobileSidebar role="citizen" />
    </div>
  )
}
