import { Link } from 'react-router-dom'
import { AlertCircle, Home, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-6 bg-slate-50 text-center">
      <div className="max-w-md bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-lg space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-2 border border-rose-100">
          <AlertCircle className="w-8 h-8" />
        </div>
        <span className="font-mono text-sm font-bold text-slate-400">404 ERROR</span>
        <h2 className="text-2xl font-extrabold text-slate-900">Page Not Found</h2>
        <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
          The requested page or waste report link does not exist or has been moved.
        </p>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/"
            className="w-full sm:w-auto px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center justify-center gap-1.5"
          >
            <Home className="w-4 h-4" /> Return to Home
          </Link>
          <button
            onClick={() => window.history.back()}
            className="w-full sm:w-auto px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" /> Go Back
          </button>
        </div>
      </div>
    </div>
  )
}
