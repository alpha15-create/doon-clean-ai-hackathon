// Dehradun geographic center coordinates
export const DEHRADUN_CENTER = [30.3165, 78.0322]
export const DEHRADUN_DEFAULT_ZOOM = 13

// Common Dehradun landmark coordinates for quick selection / testing
export const DEHRADUN_LANDMARKS = [
  { name: 'Clock Tower (Ghanta Ghar)', lat: 30.3244, lng: 78.0418, zone: 'Central' },
  { name: 'Paltan Bazaar', lat: 30.3201, lng: 78.0392, zone: 'Central' },
  { name: 'Rajpur Road', lat: 30.3582, lng: 78.0667, zone: 'North' },
  { name: 'Sahastradhara Crossing', lat: 30.3421, lng: 78.0772, zone: 'East' },
  { name: 'ISBT Dehradun', lat: 30.2709, lng: 77.9998, zone: 'South' },
  { name: 'Rispana Bridge / Nagar', lat: 30.2982, lng: 78.0531, zone: 'South-East' },
  { name: 'Clement Town', lat: 30.2644, lng: 78.0125, zone: 'South' },
  { name: 'Prem Nagar', lat: 30.3341, lng: 77.9575, zone: 'West' },
  { name: 'Dalanwala', lat: 30.3188, lng: 78.0556, zone: 'Central' },
  { name: 'Jakhan', lat: 30.3695, lng: 78.0744, zone: 'North' },
]

// Waste categories supported by YOLO detection
export const WASTE_CATEGORIES = [
  { id: 'plastic', label: 'Plastic Waste', color: 'blue' },
  { id: 'organic', label: 'Organic / Food Waste', color: 'amber' },
  { id: 'electronic', label: 'E-Waste', color: 'purple' },
  { id: 'hazardous', label: 'Hazardous / Medical', color: 'rose' },
  { id: 'construction', label: 'Construction Debris (C&D)', color: 'stone' },
  { id: 'mixed', label: 'Mixed Municipal Solid Waste', color: 'emerald' },
]

// Status flow configuration
export const STATUS_STEPS = [
  { key: 'reported', label: 'Reported', color: 'text-slate-500 bg-slate-100' },
  { key: 'ai_analyzed', label: 'AI Analyzed', color: 'text-indigo-700 bg-indigo-50' },
  { key: 'verified', label: 'Verified', color: 'text-blue-700 bg-blue-50' },
  { key: 'assigned', label: 'Assigned', color: 'text-amber-700 bg-amber-50' },
  { key: 'in_progress', label: 'In Progress', color: 'text-cyan-700 bg-cyan-50' },
  { key: 'resolved', label: 'Resolved', color: 'text-emerald-700 bg-emerald-50' },
]

export const getStatusConfig = (status) => {
  const norm = (status || '').toLowerCase().replace(/[\s-]/g, '_')
  switch (norm) {
    case 'reported':
      return { label: 'Reported', bg: 'bg-slate-100', text: 'text-slate-700', border: 'border-slate-200', step: 1 }
    case 'ai_analyzed':
      return { label: 'AI Analyzed', bg: 'bg-indigo-100', text: 'text-indigo-800', border: 'border-indigo-200', step: 2 }
    case 'verified':
      return { label: 'Verified', bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-200', step: 3 }
    case 'assigned':
      return { label: 'Assigned', bg: 'bg-amber-100', text: 'text-amber-800', border: 'border-amber-200', step: 4 }
    case 'in_progress':
      return { label: 'In Progress', bg: 'bg-cyan-100', text: 'text-cyan-800', border: 'border-cyan-200', step: 5 }
    case 'resolved':
      return { label: 'Resolved', bg: 'bg-emerald-100', text: 'text-emerald-800', border: 'border-emerald-200', step: 6 }
    case 'rejected':
      return { label: 'Rejected', bg: 'bg-rose-100', text: 'text-rose-800', border: 'border-rose-200', step: 0 }
    default:
      return { label: status || 'Pending', bg: 'bg-gray-100', text: 'text-gray-700', border: 'border-gray-200', step: 1 }
  }
}

export const getPriorityConfig = (priority) => {
  const norm = (priority || '').toLowerCase()
  if (norm === 'high' || norm === 'critical') {
    return { label: 'High Priority', bg: 'bg-rose-100', text: 'text-rose-800', border: 'border-rose-300', dot: 'bg-rose-500' }
  }
  if (norm === 'medium') {
    return { label: 'Medium Priority', bg: 'bg-amber-100', text: 'text-amber-800', border: 'border-amber-300', dot: 'bg-amber-500' }
  }
  return { label: 'Low Priority', bg: 'bg-emerald-100', text: 'text-emerald-800', border: 'border-emerald-300', dot: 'bg-emerald-500' }
}

export const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  if (isNaN(date.getTime())) return dateString
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

export const formatRelativeTime = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  const now = new Date()
  const diffMinutes = Math.floor((now - date) / (1000 * 60))
  if (diffMinutes < 1) return 'Just now'
  if (diffMinutes < 60) return `${diffMinutes}m ago`
  const diffHours = Math.floor(diffMinutes / 60)
  if (diffHours < 24) return `${diffHours}h ago`
  const diffDays = Math.floor(diffHours / 24)
  if (diffDays < 7) return `${diffDays}d ago`
  return formatDate(dateString)
}

export const generateReportId = () => {
  const num = Math.floor(1000 + Math.random() * 9000)
  return `DWN-${num}`
}
