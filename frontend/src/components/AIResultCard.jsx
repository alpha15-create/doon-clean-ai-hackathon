import {
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Scale,
  RefreshCw,
  Cpu,
  ShieldAlert,
} from 'lucide-react'
import PriorityBadge from './PriorityBadge'

export default function AIResultCard({ analysis, onRecalculate }) {
  if (!analysis) return null

  const {
    wasteType = 'Plastic Waste',
    confidence = 92,
    severity = 'High',
    estimatedQuantity = 'Medium (~65 kg)',
    priorityScore = 84,
    hazardLevel = 'Medium',
    recyclable = true,
    detectedItems = ['PET Bottles', 'Polythene Wrappers'],
    recommendation = 'Dispatched for mechanical sorting and segregation.',
  } = analysis

  return (
    <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl p-6 shadow-xl border border-slate-700/60 relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-700/80 relative z-10">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400 shadow-inner">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-base font-bold text-white flex items-center gap-2">
              YOLOv8 AI Inference Breakdown
              <span className="text-[10px] tracking-wider uppercase bg-emerald-500/20 text-emerald-300 font-semibold px-2 py-0.5 rounded-full border border-emerald-500/30">
                Verified
              </span>
            </h4>
            <p className="text-xs text-slate-400">Automated computer vision & severity calculation</p>
          </div>
        </div>

        {onRecalculate && (
          <button
            onClick={onRecalculate}
            className="text-xs text-slate-300 hover:text-white flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-600 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Re-analyze
          </button>
        )}
      </div>

      {/* Core AI Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 my-5 relative z-10">
        {/* Waste Type */}
        <div className="bg-slate-800/80 rounded-xl p-3.5 border border-slate-700/50">
          <span className="text-xs text-slate-400 block mb-1">Identified Waste</span>
          <span className="text-sm font-bold text-emerald-300">{wasteType}</span>
        </div>

        {/* AI Confidence */}
        <div className="bg-slate-800/80 rounded-xl p-3.5 border border-slate-700/50">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-slate-400">Confidence</span>
            <span className="text-xs font-mono font-bold text-emerald-400">{confidence}%</span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden mt-1.5">
            <div
              className="bg-emerald-500 h-2 rounded-full transition-all duration-700 ease-out"
              style={{ width: `${confidence}%` }}
            />
          </div>
        </div>

        {/* Severity */}
        <div className="bg-slate-800/80 rounded-xl p-3.5 border border-slate-700/50">
          <span className="text-xs text-slate-400 block mb-1">Severity Rating</span>
          <div className="flex items-center gap-2">
            <PriorityBadge priority={severity} />
          </div>
        </div>

        {/* Priority Score */}
        <div className="bg-slate-800/80 rounded-xl p-3.5 border border-slate-700/50">
          <span className="text-xs text-slate-400 block mb-1">Smart Priority</span>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-extrabold text-amber-400">{priorityScore}</span>
            <span className="text-xs text-slate-400">/ 100</span>
          </div>
        </div>
      </div>

      {/* Secondary details */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1 border-t border-slate-700/80 relative z-10">
        <div className="flex items-center gap-2 text-slate-300">
          <Scale className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>
            Estimated Quantity:{' '}
            <strong className="text-white font-semibold">{estimatedQuantity}</strong>
          </span>
        </div>

        <div className="flex items-center gap-2 text-slate-300">
          <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
          <span>
            Hazard Risk:{' '}
            <strong className="text-white font-semibold">{hazardLevel}</strong>
          </span>
        </div>
      </div>

      {/* Detected tags */}
      {detectedItems && detectedItems.length > 0 && (
        <div className="mt-4 pt-3 border-t border-slate-700/60 relative z-10">
          <span className="text-[11px] text-slate-400 uppercase tracking-wider block mb-2 font-medium">
            Detected Objects
          </span>
          <div className="flex flex-wrap gap-1.5">
            {detectedItems.map((item, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 rounded-lg bg-slate-800/90 border border-slate-700 text-slate-300 text-xs flex items-center gap-1.5"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                {item}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* AI Recommendation */}
      {recommendation && (
        <div className="mt-4 p-3 bg-emerald-950/40 border border-emerald-800/40 rounded-xl text-xs text-emerald-200/90 flex items-start gap-2 relative z-10">
          <Sparkles className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong className="text-emerald-300">AI Dispatch Recommendation: </strong>
            {recommendation}
          </p>
        </div>
      )}
    </div>
  )
}
