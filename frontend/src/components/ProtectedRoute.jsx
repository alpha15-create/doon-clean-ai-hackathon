import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Loading from './Loading'

export default function ProtectedRoute({ children, allowedRoles = [] }) {
  const { currentUser, role, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return <Loading fullScreen message="Authenticating session..." />
  }

  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    // Redirect to their own dashboard
    if (role === 'admin') return <Navigate to="/admin" replace />
    if (role === 'collector') return <Navigate to="/collector" replace />
    return <Navigate to="/citizen" replace />
  }

  return children
}
