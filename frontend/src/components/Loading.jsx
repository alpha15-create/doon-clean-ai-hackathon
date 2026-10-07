import { Loader2 } from 'lucide-react'

export default function Loading({ message = 'Loading data...', fullScreen = false }) {
  if (fullScreen) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shadow-sm animate-pulse mb-4">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
        <h3 className="text-lg font-bold text-slate-800">DoonClean AI</h3>
        <p className="text-sm text-slate-500 mt-1">{message}</p>
      </div>
    )
  }

  return (
    <div className="py-12 flex flex-col items-center justify-center text-center p-4">
      <Loader2 className="w-8 h-8 text-emerald-600 animate-spin mb-3" />
      <p className="text-sm font-medium text-slate-600">{message}</p>
    </div>
  )
}
