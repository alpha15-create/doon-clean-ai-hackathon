import Modal from './Modal'
import { AlertTriangle } from 'lucide-react'

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title = 'Are you sure?',
  message = 'This action will update the report records.',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmVariant = 'emerald', // emerald | rose | amber
  loading = false,
}) {
  const getButtonClass = () => {
    if (confirmVariant === 'rose') {
      return 'bg-rose-600 hover:bg-rose-700 text-white focus:ring-rose-500'
    }
    if (confirmVariant === 'amber') {
      return 'bg-amber-600 hover:bg-amber-700 text-white focus:ring-amber-500'
    }
    return 'bg-emerald-600 hover:bg-emerald-700 text-white focus:ring-emerald-500'
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="max-w-md">
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-xl bg-amber-50 text-amber-600 border border-amber-200 shrink-0">
          <AlertTriangle className="w-5 h-5" />
        </div>
        <p className="text-sm text-slate-600 pt-0.5">{message}</p>
      </div>

      <div className="mt-6 flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
        <button
          type="button"
          onClick={onClose}
          disabled={loading}
          className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors disabled:opacity-50"
        >
          {cancelText}
        </button>
        <button
          type="button"
          onClick={onConfirm}
          disabled={loading}
          className={`px-4 py-2 rounded-xl text-sm font-semibold shadow-xs transition-colors disabled:opacity-50 ${getButtonClass()}`}
        >
          {loading ? 'Processing...' : confirmText}
        </button>
      </div>
    </Modal>
  )
}
