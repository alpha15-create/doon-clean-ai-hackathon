import { AlertOctagon, RotateCw } from 'lucide-react'

export default function ErrorState({
  title = 'Unable to load data',
  message = 'There was an issue communicating with the service. Please try again.',
  onRetry,
}) {
  return (
    <div className="bg-rose-50/50 rounded-2xl border border-rose-200 p-8 text-center flex flex-col items-center justify-center max-w-md mx-auto my-6">
      <div className="w-12 h-12 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center mb-3">
        <AlertOctagon className="w-6 h-6" />
      </div>
      <h3 className="text-base font-bold text-slate-800">{title}</h3>
      <p className="text-sm text-slate-600 mt-1 max-w-xs">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-white border border-rose-300 text-rose-700 hover:bg-rose-50 rounded-xl text-sm font-semibold shadow-xs transition-colors"
        >
          <RotateCw className="w-4 h-4" />
          Retry
        </button>
      )}
    </div>
  )
}
