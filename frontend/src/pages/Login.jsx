import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import {
  Recycle,
  Eye,
  EyeOff,
  Lock,
  Mail,
  ArrowRight,
  Sparkles,
  Shield,
  Truck,
  User,
  AlertCircle,
} from 'lucide-react'

export default function Login() {
  const [email, setEmail] = useState('citizen@doonclean.ai')
  const [password, setPassword] = useState('password123')
  const [showPassword, setShowPassword] = useState(false)
  const [selectedRole, setSelectedRole] = useState('citizen')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const { login } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()
  const location = useLocation()

  const from = location.state?.from?.pathname || (selectedRole === 'admin' ? '/admin' : selectedRole === 'collector' ? '/collector' : '/citizen')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const res = await login(email, password, selectedRole)
      if (res.success) {
        toast.success(`Welcome back, ${res.user.name}!`, 'Logged In')
        const targetPath = res.user.role === 'admin' ? '/admin' : res.user.role === 'collector' ? '/collector' : '/citizen'
        navigate(from.includes('/citizen') || from.includes('/admin') || from.includes('/collector') ? from : targetPath, { replace: true })
      } else {
        setError(res.error || 'Invalid email or password.')
      }
    } catch (err) {
      setError(err.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  const fillDemoAccount = (role) => {
    setSelectedRole(role)
    setError(null)
    if (role === 'admin') {
      setEmail('admin@doonclean.ai')
      setPassword('password123')
    } else if (role === 'collector') {
      setEmail('collector@doonclean.ai')
      setPassword('password123')
    } else {
      setEmail('citizen@doonclean.ai')
      setPassword('password123')
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 sm:p-6 bg-slate-50">
      <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-lg">
        {/* Logo & Heading */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white mx-auto shadow-md shadow-emerald-500/20 mb-3">
            <Recycle className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Log in to DoonClean AI
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Access citizen reporting, admin operations, or fleet tasks
          </p>
        </div>

        {/* Demo Fast Fill Buttons for Hackathon Judges */}
        <div className="mb-6 p-3 bg-emerald-50/60 border border-emerald-200/80 rounded-2xl">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-800 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Hackathon 1-Click Fast Autofill:</span>
          </div>
          <div className="grid grid-cols-3 gap-1.5">
            <button
              type="button"
              onClick={() => fillDemoAccount('citizen')}
              className={`px-2 py-1.5 text-xs font-semibold rounded-xl border transition-colors flex items-center justify-center gap-1 ${
                selectedRole === 'citizen'
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <User className="w-3 h-3" /> Citizen
            </button>
            <button
              type="button"
              onClick={() => fillDemoAccount('admin')}
              className={`px-2 py-1.5 text-xs font-semibold rounded-xl border transition-colors flex items-center justify-center gap-1 ${
                selectedRole === 'admin'
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Shield className="w-3 h-3" /> Admin
            </button>
            <button
              type="button"
              onClick={() => fillDemoAccount('collector')}
              className={`px-2 py-1.5 text-xs font-semibold rounded-xl border transition-colors flex items-center justify-center gap-1 ${
                selectedRole === 'collector'
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Truck className="w-3 h-3" /> Collector
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-4 flex items-center gap-2 p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@doonclean.ai"
                className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {loading ? (
              <span>Signing in...</span>
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-slate-500">
          Don't have an account yet?{' '}
          <Link to="/register" className="font-semibold text-emerald-600 hover:underline">
            Register as Citizen
          </Link>
        </div>
      </div>
    </div>
  )
}
