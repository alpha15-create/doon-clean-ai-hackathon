import { createContext, useContext, useState, useEffect } from 'react'
import { authAPI } from '../services/api'
import { MOCK_USERS } from '../data/mockData'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const stored = localStorage.getItem('doonclean_user')
      return stored ? JSON.parse(stored) : MOCK_USERS.citizen
    } catch {
      return MOCK_USERS.citizen
    }
  })
  const [token, setToken] = useState(() => localStorage.getItem('doonclean_token') || 'demo_mock_token')
  const [loading, setLoading] = useState(false)

  // Sync token in localStorage
  useEffect(() => {
    if (token) {
      localStorage.setItem('doonclean_token', token)
    } else {
      localStorage.removeItem('doonclean_token')
    }
  }, [token])

  // Sync user in localStorage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('doonclean_user', JSON.stringify(currentUser))
    } else {
      localStorage.removeItem('doonclean_user')
    }
  }, [currentUser])

  const login = async (email, password, roleHint) => {
    setLoading(true)
    try {
      const res = await authAPI.login(email, password, roleHint)
      if (res.success && res.data) {
        setCurrentUser(res.data.user)
        setToken(res.data.token)
        return { success: true, user: res.data.user }
      }
      return { success: false, error: res.error?.message || 'Login failed' }
    } catch (err) {
      return { success: false, error: err.message || 'Login error' }
    } finally {
      setLoading(false)
    }
  }

  const register = async (userData) => {
    setLoading(true)
    try {
      const res = await authAPI.register(userData)
      if (res.success && res.data) {
        setCurrentUser(res.data.user)
        setToken(res.data.token)
        return { success: true, user: res.data.user }
      }
      return { success: false, error: res.error?.message || 'Registration failed' }
    } catch (err) {
      return { success: false, error: err.message || 'Registration error' }
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    setCurrentUser(null)
    setToken(null)
    localStorage.removeItem('doonclean_token')
    localStorage.removeItem('doonclean_user')
  }

  // Quick switch role utility (super useful for hackathon presentations)
  const switchRole = (role) => {
    if (role === 'admin') {
      setCurrentUser(MOCK_USERS.admin)
      setToken('mock_jwt_admin')
    } else if (role === 'collector') {
      setCurrentUser(MOCK_USERS.collector)
      setToken('mock_jwt_collector')
    } else {
      setCurrentUser(MOCK_USERS.citizen)
      setToken('mock_jwt_citizen')
    }
  }

  const value = {
    currentUser,
    role: currentUser?.role || 'citizen',
    token,
    isAuthenticated: !!currentUser,
    loading,
    login,
    register,
    logout,
    switchRole,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
