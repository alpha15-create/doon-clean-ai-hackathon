import { useState, useEffect, useCallback } from 'react'
import { reportsAPI } from '../services/api'

export const useReports = (initialFilters = {}, isCitizenOnly = false, citizenId = null) => {
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filters, setFilters] = useState(initialFilters)

  const fetchReports = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      let res
      if (isCitizenOnly) {
        res = await reportsAPI.getMyReports(citizenId)
      } else {
        res = await reportsAPI.getAll(filters)
      }

      if (res.success) {
        let data = res.data || []
        // Apply local filter if needed
        if (filters.status && filters.status !== 'all') {
          data = data.filter((r) => r.status.toLowerCase() === filters.status.toLowerCase())
        }
        if (filters.priority && filters.priority !== 'all') {
          data = data.filter((r) => r.severity?.toLowerCase() === filters.priority.toLowerCase())
        }
        if (filters.wasteType && filters.wasteType !== 'all') {
          data = data.filter((r) => r.wasteType.toLowerCase().includes(filters.wasteType.toLowerCase()))
        }
        if (filters.search) {
          const q = filters.search.toLowerCase()
          data = data.filter(
            (r) =>
              r.id.toLowerCase().includes(q) ||
              r.title?.toLowerCase().includes(q) ||
              r.location?.address?.toLowerCase().includes(q) ||
              r.wasteType?.toLowerCase().includes(q)
          )
        }
        setReports(data)
      } else {
        setError(res.error?.message || 'Failed to load waste reports')
      }
    } catch (err) {
      setError(err.message || 'Error fetching reports')
    } finally {
      setLoading(false)
    }
  }, [filters, isCitizenOnly, citizenId])

  useEffect(() => {
    fetchReports()
  }, [fetchReports])

  const updateFilters = (newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }))
  }

  return {
    reports,
    loading,
    error,
    filters,
    updateFilters,
    refetch: fetchReports,
  }
}
