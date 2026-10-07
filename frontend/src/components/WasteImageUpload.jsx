import { useState, useRef } from 'react'
import {
  UploadCloud,
  Image as ImageIcon,
  Camera,
  X,
  AlertCircle,
  Sparkles,
} from 'lucide-react'

const SAMPLE_PRESETS = [
  {
    name: 'Plastic Heap',
    url: 'https://images.unsplash.com/photo-1605600659873-d808a13e4d2a?auto=format&fit=crop&w=800&q=80',
    type: 'Plastic Waste',
  },
  {
    name: 'Overflowing Bin',
    url: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=800&q=80',
    type: 'Mixed Municipal Solid Waste',
  },
  {
    name: 'Construction Debris',
    url: 'https://images.unsplash.com/photo-1590496793929-36417d3117de?auto=format&fit=crop&w=800&q=80',
    type: 'Construction Debris (C&D)',
  },
  {
    name: 'Riverbed Dump',
    url: 'https://images.unsplash.com/photo-1621451537084-482c73073a0f?auto=format&fit=crop&w=800&q=80',
    type: 'Mixed Waste',
  },
]

export default function WasteImageUpload({
  image,
  onImageChange,
  onImageRemove,
  onPresetSelect,
}) {
  const [dragActive, setDragActive] = useState(false)
  const [error, setError] = useState(null)
  const fileInputRef = useRef(null)
  const cameraInputRef = useRef(null)

  const handleFile = (file) => {
    setError(null)
    if (!file) return

    const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp']
    if (!validTypes.includes(file.type)) {
      setError('Invalid file format. Please upload JPG, PNG, or WEBP.')
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('File size exceeds 10MB limit.')
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      onImageChange(e.target.result, file)
    }
    reader.readAsDataURL(file)
  }

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  return (
    <div className="space-y-4">
      {/* Hidden file inputs */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/jpg,image/webp"
        className="hidden"
        onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
      />
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
      />

      {/* Main Upload Box / Preview */}
      {image ? (
        <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-900 shadow-md group">
          <img
            src={image}
            alt="Waste preview"
            className="w-full h-64 sm:h-80 object-cover object-center group-hover:opacity-95 transition-opacity"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent pointer-events-none" />

          {/* Action Overlay */}
          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-semibold tracking-wide drop-shadow-sm">
                Photo Ready for AI Vision
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-1.5 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-xl text-xs font-medium transition-colors"
              >
                Change Photo
              </button>
              <button
                type="button"
                onClick={onImageRemove}
                className="p-1.5 bg-rose-500/80 hover:bg-rose-600 backdrop-blur-md rounded-xl text-white transition-colors"
                title="Remove photo"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`relative border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center transition-all ${
            dragActive
              ? 'border-emerald-500 bg-emerald-50/50 scale-[0.99]'
              : 'border-slate-300 hover:border-emerald-400 bg-slate-50/60'
          }`}
        >
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-emerald-100/70 text-emerald-600 flex items-center justify-center shadow-xs">
            <UploadCloud className="w-8 h-8" />
          </div>

          <h4 className="text-base font-bold text-slate-800">
            Upload waste / garbage photograph
          </h4>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Drag and drop your file here, browse your device, or take a direct photo from your camera.
          </p>

          {/* Buttons */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-xs transition-colors"
            >
              <ImageIcon className="w-4 h-4" />
              Choose from Gallery
            </button>

            <button
              type="button"
              onClick={() => cameraInputRef.current?.click()}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 rounded-xl text-xs sm:text-sm font-semibold shadow-xs transition-colors"
            >
              <Camera className="w-4 h-4 text-emerald-600" />
              Take Live Photo
            </button>
          </div>

          <p className="text-[11px] text-slate-400 mt-4">
            Supports JPG, JPEG, PNG, WEBP (Max 10MB)
          </p>
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="flex items-center gap-2 text-rose-600 text-xs bg-rose-50 p-3 rounded-xl border border-rose-200">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Quick demo presets for judges/testers */}
      <div className="pt-2">
        <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-2">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span className="font-semibold text-slate-700">Hackathon Demo Presets:</span>
          <span>Click to test instantly without uploading</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {SAMPLE_PRESETS.map((preset, i) => (
            <button
              key={i}
              type="button"
              onClick={() => {
                onPresetSelect?.(preset.url, preset.type)
              }}
              className="p-2 bg-white hover:bg-emerald-50/70 border border-slate-200 hover:border-emerald-300 rounded-xl text-left transition-all group flex items-center gap-2.5"
            >
              <img
                src={preset.url}
                alt={preset.name}
                className="w-9 h-9 rounded-lg object-cover group-hover:scale-105 transition-transform shrink-0"
              />
              <div className="min-w-0">
                <p className="text-xs font-semibold text-slate-800 truncate">{preset.name}</p>
                <p className="text-[10px] text-slate-500 truncate">{preset.type}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
