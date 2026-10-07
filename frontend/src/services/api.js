import axios from 'axios'
import {
  MOCK_USERS,
  INITIAL_REPORTS,
  MOCK_HOTSPOTS,
  MOCK_TEAMS,
  MOCK_ANALYTICS,
  MOCK_NOTIFICATIONS
} from '../data/mockData'
import { generateReportId } from '../utils/helpers'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'
const FORCE_MOCK = import.meta.env.VITE_USE_MOCK === 'true' || import.meta.env.VITE_USE_MOCK === true

// Initialize localStorage mock storage if not already present
const getStoredReports = () => {
  try {
    const raw = localStorage.getItem('doonclean_reports')
    if (raw) return JSON.parse(raw)
  } catch (e) {
    console.error('Error reading localStorage reports:', e)
  }
  localStorage.setItem('doonclean_reports', JSON.stringify(INITIAL_REPORTS))
  return INITIAL_REPORTS
}

const saveReports = (reports) => {
  try {
    localStorage.setItem('doonclean_reports', JSON.stringify(reports))
  } catch (e) {
    console.error('Error saving reports to localStorage:', e)
  }
}

// Axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 8000,
})

// Request interceptor for JWT
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('doonclean_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Standard Response wrapper
const wrapSuccess = (data, message = 'Success') => ({
  success: true,
  data,
  message,
})

const wrapError = (message = 'An error occurred', code = 'API_ERROR') => ({
  success: false,
  error: {
    code,
    message,
  },
})

// ==========================================
// API SERVICES
// ==========================================

export const authAPI = {
  login: async (email, password, roleHint = 'citizen') => {
    if (!FORCE_MOCK) {
      try {
        const response = await apiClient.post('/api/auth/login', { email, password })
        if (response.data?.success) return response.data
      } catch (err) {
        console.warn('Backend login unavailable, falling back to mock authentication:', err.message)
      }
    }

    // Mock Login
    await new Promise((resolve) => setTimeout(resolve, 500))
    let user = null
    if (email.includes('admin') || roleHint === 'admin') {
      user = MOCK_USERS.admin
    } else if (email.includes('collector') || roleHint === 'collector') {
      user = MOCK_USERS.collector
    } else {
      user = {
        ...MOCK_USERS.citizen,
        email: email || MOCK_USERS.citizen.email,
      }
    }

    const token = `mock_jwt_token_${user.role}_${Date.now()}`
    localStorage.setItem('doonclean_token', token)
    localStorage.setItem('doonclean_user', JSON.stringify(user))

    return wrapSuccess({ user, token }, 'Logged in successfully')
  },

  register: async (userData) => {
    if (!FORCE_MOCK) {
      try {
        const response = await apiClient.post('/api/auth/register', userData)
        if (response.data?.success) return response.data
      } catch (err) {
        console.warn('Backend register unavailable, falling back to mock registration:', err.message)
      }
    }

    // Mock Register
    await new Promise((resolve) => setTimeout(resolve, 600))
    const newUser = {
      id: `usr_${Date.now()}`,
      name: userData.fullName || userData.name || 'Citizen User',
      email: userData.email,
      phone: userData.phone || '+91 99999 00000',
      role: userData.role || 'citizen',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
      points: 50,
      level: 'Eco Contributor (Level 1)',
    }
    const token = `mock_jwt_token_${newUser.role}_${Date.now()}`
    localStorage.setItem('doonclean_token', token)
    localStorage.setItem('doonclean_user', JSON.stringify(newUser))

    return wrapSuccess({ user: newUser, token }, 'Registration successful')
  },

  getMe: async () => {
    if (!FORCE_MOCK) {
      try {
        const response = await apiClient.get('/api/auth/me')
        if (response.data?.success) return response.data
      } catch (err) {
        console.warn('Backend getMe unavailable, using cached user:', err.message)
      }
    }

    const storedUser = localStorage.getItem('doonclean_user')
    if (storedUser) {
      return wrapSuccess(JSON.parse(storedUser))
    }
    return wrapError('Not authenticated', 'AUTH_REQUIRED')
  },
}

export const reportsAPI = {
  getAll: async (filters = {}) => {
    if (!FORCE_MOCK) {
      try {
        const response = await apiClient.get('/api/reports', { params: filters })
        if (response.data?.success) return response.data
      } catch (err) {
        console.warn('Backend reports unavailable, loading mock reports:', err.message)
      }
    }

    await new Promise((resolve) => setTimeout(resolve, 350))
    let reports = getStoredReports()

    if (filters.status && filters.status !== 'all') {
      reports = reports.filter((r) => r.status.toLowerCase() === filters.status.toLowerCase())
    }
    if (filters.priority && filters.priority !== 'all') {
      reports = reports.filter((r) => r.severity?.toLowerCase() === filters.priority.toLowerCase())
    }
    if (filters.wasteType && filters.wasteType !== 'all') {
      reports = reports.filter((r) => r.wasteType.toLowerCase().includes(filters.wasteType.toLowerCase()))
    }
    if (filters.search) {
      const q = filters.search.toLowerCase()
      reports = reports.filter(
        (r) =>
          r.id.toLowerCase().includes(q) ||
          r.title?.toLowerCase().includes(q) ||
          r.location?.address?.toLowerCase().includes(q) ||
          r.wasteType?.toLowerCase().includes(q)
      )
    }

    return wrapSuccess(reports)
  },

  getMyReports: async (userId) => {
    if (!FORCE_MOCK) {
      try {
        const response = await apiClient.get('/api/reports/my')
        if (response.data?.success) return response.data
      } catch (err) {
        console.warn('Backend my reports unavailable, loading mock:', err.message)
      }
    }

    await new Promise((resolve) => setTimeout(resolve, 300))
    const reports = getStoredReports()
    const my = reports.filter((r) => !r.citizen?.id || r.citizen?.id === userId || r.citizen?.email?.includes('citizen'))
    return wrapSuccess(my)
  },

  getById: async (id) => {
    if (!FORCE_MOCK) {
      try {
        const response = await apiClient.get(`/api/reports/${id}`)
        if (response.data?.success) return response.data
      } catch (err) {
        console.warn(`Backend report ${id} unavailable, loading mock:`, err.message)
      }
    }

    await new Promise((resolve) => setTimeout(resolve, 200))
    const reports = getStoredReports()
    const report = reports.find((r) => r.id === id)
    if (!report) return wrapError(`Report ${id} not found`, 'NOT_FOUND')
    return wrapSuccess(report)
  },

  create: async (reportData) => {
    if (!FORCE_MOCK) {
      try {
        const response = await apiClient.post('/api/reports', reportData)
        if (response.data?.success) return response.data
      } catch (err) {
        console.warn('Backend create report unavailable, storing in mock:', err.message)
      }
    }

    await new Promise((resolve) => setTimeout(resolve, 700))
    const newId = generateReportId()
    const now = new Date().toISOString()
    const stored = getStoredReports()

    const newReport = {
      id: newId,
      title: reportData.title || `${reportData.wasteType || 'Waste'} report at ${reportData.location?.landmark || 'Dehradun'}`,
      description: reportData.description || 'Reported via DoonClean AI citizen portal.',
      imageUrl: reportData.imageUrl || 'https://images.unsplash.com/photo-1605600659873-d808a13e4d2a?auto=format&fit=crop&w=800&q=80',
      wasteType: reportData.wasteType || 'Plastic Waste',
      aiConfidence: reportData.aiConfidence || 92,
      severity: reportData.severity || 'High',
      estimatedQuantity: reportData.estimatedQuantity || 'Medium (~60 kg)',
      priorityScore: reportData.priorityScore || 82,
      status: 'Reported',
      location: reportData.location || {
        address: 'Clock Tower North, Dehradun',
        landmark: 'Clock Tower',
        lat: 30.3244,
        lng: 78.0418,
        zone: 'Central',
      },
      citizen: reportData.citizen || MOCK_USERS.citizen,
      assignedTeam: null,
      isDuplicate: false,
      duplicateCount: 0,
      createdAt: now,
      updatedAt: now,
      timeline: [
        { status: 'reported', time: now, note: 'Complaint submitted with geolocation and photo' },
        { status: 'ai_analyzed', time: now, note: `YOLO inference: ${reportData.wasteType || 'Waste'} (${reportData.aiConfidence || 92}% confidence). Priority: ${reportData.priorityScore || 82}/100.` },
      ],
    }

    const updated = [newReport, ...stored]
    saveReports(updated)
    return wrapSuccess(newReport, 'Report created successfully')
  },

  updateStatus: async (id, status, note = '') => {
    if (!FORCE_MOCK) {
      try {
        const response = await apiClient.put(`/api/reports/${id}/status`, { status, note })
        if (response.data?.success) return response.data
      } catch (err) {
        console.warn(`Backend update status unavailable for ${id}, updating mock:`, err.message)
      }
    }

    await new Promise((resolve) => setTimeout(resolve, 400))
    const reports = getStoredReports()
    const index = reports.findIndex((r) => r.id === id)
    if (index === -1) return wrapError(`Report ${id} not found`, 'NOT_FOUND')

    const now = new Date().toISOString()
    const updatedReport = {
      ...reports[index],
      status,
      updatedAt: now,
      timeline: [
        ...(reports[index].timeline || []),
        { status: status.toLowerCase(), time: now, note: note || `Status updated to ${status}` },
      ],
    }

    reports[index] = updatedReport
    saveReports(reports)
    return wrapSuccess(updatedReport, 'Status updated successfully')
  },

  updatePriority: async (id, severity, priorityScore) => {
    const reports = getStoredReports()
    const index = reports.findIndex((r) => r.id === id)
    if (index === -1) return wrapError(`Report ${id} not found`, 'NOT_FOUND')

    reports[index] = {
      ...reports[index],
      severity,
      priorityScore: priorityScore || reports[index].priorityScore,
      updatedAt: new Date().toISOString(),
    }
    saveReports(reports)
    return wrapSuccess(reports[index], 'Priority updated successfully')
  },

  assignTeam: async (reportId, teamId) => {
    if (!FORCE_MOCK) {
      try {
        const response = await apiClient.post('/api/collection/assign', { reportId, teamId })
        if (response.data?.success) return response.data
      } catch (err) {
        console.warn('Backend assign team unavailable, updating mock:', err.message)
      }
    }

    const team = MOCK_TEAMS.find((t) => t.id === teamId)
    const reports = getStoredReports()
    const index = reports.findIndex((r) => r.id === reportId)
    if (index === -1) return wrapError(`Report ${reportId} not found`, 'NOT_FOUND')

    const now = new Date().toISOString()
    reports[index] = {
      ...reports[index],
      status: 'Assigned',
      assignedTeam: team ? { id: team.id, name: team.name, leader: team.leader } : null,
      updatedAt: now,
      timeline: [
        ...(reports[index].timeline || []),
        { status: 'assigned', time: now, note: `Assigned to ${team ? team.name : 'sanitation team'}` },
      ],
    }
    saveReports(reports)
    return wrapSuccess(reports[index], 'Team assigned successfully')
  },
}

// AI Analysis Service
export const aiAPI = {
  analyzeImage: async (formDataOrBase64) => {
    if (!FORCE_MOCK) {
      try {
        const response = await apiClient.post('/api/analyze', formDataOrBase64)
        if (response.data?.success) return response.data
      } catch (err) {
        console.warn('Backend AI inference unavailable, using intelligent client mock:', err.message)
      }
    }

    // High quality mock AI analysis simulation
    await new Promise((resolve) => setTimeout(resolve, 1400))
    const mockInferences = [
      {
        wasteType: 'Plastic Waste',
        confidence: 94,
        severity: 'High',
        estimatedQuantity: 'Large (~95 kg)',
        priorityScore: 84,
        hazardLevel: 'Medium',
        recyclable: true,
        detectedItems: ['PET Bottles (24)', 'Polyethene Bags (35+)', 'Food Containers (12)'],
        recommendation: 'Requires electric tipper with high-density plastic segregation bins.',
      },
      {
        wasteType: 'Mixed Municipal Solid Waste',
        confidence: 91,
        severity: 'High',
        estimatedQuantity: 'Medium-Large (~150 kg)',
        priorityScore: 79,
        hazardLevel: 'High',
        recyclable: false,
        detectedItems: ['Mixed packaging', 'Organic food scraps', 'Cardboard', 'Discarded textiles'],
        recommendation: 'Immediate municipal compactor truck pickup required to avoid stray animal scattering.',
      },
      {
        wasteType: 'Construction Debris (C&D)',
        confidence: 97,
        severity: 'High',
        estimatedQuantity: 'Heavy (>500 kg)',
        priorityScore: 91,
        hazardLevel: 'Critical',
        recyclable: false,
        detectedItems: ['Concrete rubble', 'Cement plaster chunks', 'Bricks', 'Rebar shards'],
        recommendation: 'Requires hydraulic JCB loader and dedicated C&D dump transport.',
      },
    ]

    const selected = mockInferences[Math.floor(Math.random() * mockInferences.length)]
    return wrapSuccess(selected, 'Image analyzed successfully')
  },
}

// Dashboard & Analytics
export const dashboardAPI = {
  getOverview: async () => {
    if (!FORCE_MOCK) {
      try {
        const response = await apiClient.get('/api/dashboard')
        if (response.data?.success) return response.data
      } catch (err) {
        console.warn('Backend dashboard unavailable, returning mock metrics:', err.message)
      }
    }

    const reports = getStoredReports()
    const total = reports.length
    const pending = reports.filter((r) => ['reported', 'ai_analyzed', 'verified'].includes(r.status.toLowerCase())).length
    const highPriority = reports.filter((r) => r.severity?.toLowerCase() === 'high' || r.priorityScore >= 80).length
    const resolved = reports.filter((r) => r.status.toLowerCase() === 'resolved').length
    const inProgress = reports.filter((r) => r.status.toLowerCase() === 'in_progress' || r.status.toLowerCase() === 'assigned').length

    return wrapSuccess({
      totalReports: total,
      pendingReports: pending,
      highPriority,
      inProgress,
      resolved,
      resolutionRate: total > 0 ? `${Math.round((resolved / total) * 100)}%` : '0%',
      activeHotspots: MOCK_HOTSPOTS.length,
    })
  },

  getAnalytics: async (timeRange = '7d') => {
    if (!FORCE_MOCK) {
      try {
        const response = await apiClient.get('/api/dashboard/analytics', { params: { range: timeRange } })
        if (response.data?.success) return response.data
      } catch (err) {
        console.warn('Backend analytics unavailable, returning mock charts:', err.message)
      }
    }

    return wrapSuccess(MOCK_ANALYTICS)
  },
}

// Hotspots & Map
export const hotspotsAPI = {
  getAll: async () => {
    if (!FORCE_MOCK) {
      try {
        const response = await apiClient.get('/api/hotspots')
        if (response.data?.success) return response.data
      } catch (err) {
        console.warn('Backend hotspots unavailable, returning mock hotspots:', err.message)
      }
    }
    return wrapSuccess(MOCK_HOTSPOTS)
  },
}

// Collection & Fleet Management
export const collectionAPI = {
  getTeams: async () => {
    if (!FORCE_MOCK) {
      try {
        const response = await apiClient.get('/api/collection')
        if (response.data?.success) return response.data
      } catch (err) {
        console.warn('Backend collection unavailable, returning mock teams:', err.message)
      }
    }
    return wrapSuccess(MOCK_TEAMS)
  },

  getCollectorTasks: async (collectorEmail = 'collector@doonclean.ai') => {
    const reports = getStoredReports()
    const tasks = reports.filter((r) => {
      return (
        r.status === 'Assigned' ||
        r.status === 'In Progress' ||
        (r.status === 'Resolved' && r.assignedTeam?.id === 'team_01')
      )
    })
    return wrapSuccess(tasks)
  },

  generateRoute: async (taskIds = []) => {
    if (!FORCE_MOCK) {
      try {
        const response = await apiClient.post('/api/routes/generate', { taskIds })
        if (response.data?.success) return response.data
      } catch (err) {
        console.warn('Backend route generation unavailable, generating mock route:', err.message)
      }
    }

    await new Promise((resolve) => setTimeout(resolve, 800))
    return wrapSuccess({
      routeId: `ROUTE-${Date.now().toString().slice(-4)}`,
      totalDistanceKm: 14.2,
      estimatedTimeMinutes: 48,
      waypointsCount: taskIds.length || 4,
      co2SavedKg: 8.5,
    }, 'Optimized shortest sanitation route generated')
  },
}

// Notifications
export const notificationsAPI = {
  getAll: async () => {
    if (!FORCE_MOCK) {
      try {
        const response = await apiClient.get('/api/notifications')
        if (response.data?.success) return response.data
      } catch (err) {
        console.warn('Backend notifications unavailable:', err.message)
      }
    }
    return wrapSuccess(MOCK_NOTIFICATIONS)
  },
}

export default apiClient
