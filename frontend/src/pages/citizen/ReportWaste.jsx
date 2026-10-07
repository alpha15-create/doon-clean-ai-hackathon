import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'
import { reportsAPI, aiAPI } from '../../services/api'
import { DEHRADUN_CENTER, DEHRADUN_LANDMARKS } from '../../utils/helpers'
import WasteImageUpload from '../../components/WasteImageUpload'
import LocationPicker from '../../components/LocationPicker'
import AIResultCard from '../../components/AIResultCard'
import Sidebar from '../../components/Sidebar'
import MobileSidebar from '../../components/MobileSidebar'
import {
  Camera,
  MapPin,
  FileText,
  Cpu,
  Send,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Loader2,
  AlertTriangle,
} from 'lucide-react'

export default function ReportWaste() {
  const { currentUser } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()

  // Stepper state: 1: Image, 2: Location, 3: Description, 4: AI Preview, 5: Submitted
  const [currentStep, setCurrentStep] = useState(1)

  // Form states
  const [image, setImage] = useState(null)
  const [imageFile, setImageFile] = useState(null)
  const [location, setLocation] = useState({
    lat: DEHRADUN_CENTER[0],
    lng: DEHRADUN_CENTER[1],
    address: 'Near Clock Tower, Rajpur Road, Dehradun',
    landmark: 'Clock Tower',
    zone: 'Central',
  })
  const [description, setDescription] = useState('')
  const [additionalNotes, setAdditionalNotes] = useState('')

  // AI analysis state
  const [analyzingAI, setAnalyzingAI] = useState(false)
  const [aiAnalysis, setAiAnalysis] = useState(null)

  // Submit states
  const [submitting, setSubmitting] = useState(false)
  const [submittedReport, setSubmittedReport] = useState(null)
  const [error, setError] = useState(null)

  // Handle image selection & trigger AI inference preview
  const handleImageChange = async (imgData, file) => {
    setImage(imgData)
    setImageFile(file)
    setError(null)
    triggerAIAnalysis(imgData)
  }

  const handlePresetSelect = (presetUrl, presetType) => {
    setImage(presetUrl)
    setImageFile(null)
    setError(null)
    triggerAIAnalysis(presetUrl, presetType)
  }

  const handleImageRemove = () => {
    setImage(null)
    setImageFile(null)
    setAiAnalysis(null)
  }

  const triggerAIAnalysis = async (img, hintedType) => {
    setAnalyzingAI(true)
    try {
      const res = await aiAPI.analyzeImage(img)
      if (res.success && res.data) {
        if (hintedType) {
          setAiAnalysis({ ...res.data, wasteType: hintedType })
        } else {
          setAiAnalysis(res.data)
        }
      }
    } catch (e) {
      console.warn('AI analysis failed:', e)
    } finally {
      setAnalyzingAI(false)
    }
  }

  // Validate and advance step
  const goToNextStep = () => {
    setError(null)
    if (currentStep === 1) {
      if (!image) {
        setError('Please upload or capture a waste photograph to proceed.')
        return
      }
      if (!aiAnalysis && !analyzingAI) {
        triggerAIAnalysis(image)
      }
      setCurrentStep(2)
      return
    }

    if (currentStep === 2) {
      if (!location.lat || !location.lng) {
        setError('Please select a valid location on the map.')
        return
      }
      setCurrentStep(3)
      return
    }

    if (currentStep === 3) {
      if (!description.trim()) {
        setError('Please provide a brief description of the waste accumulation.')
        return
      }
      setCurrentStep(4)
      return
    }
  }

  const goToPrevStep = () => {
    setError(null)
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  // Final submission
  const handleSubmitReport = async () => {
    setSubmitting(true)
    setError(null)

    try {
      const payload = {
        title: `${aiAnalysis?.wasteType || 'Waste'} near ${location.landmark || 'Dehradun'}`,
        description: description + (additionalNotes ? ` (${additionalNotes})` : ''),
        imageUrl: image,
        wasteType: aiAnalysis?.wasteType || 'Plastic Waste',
        aiConfidence: aiAnalysis?.confidence || 91,
        severity: aiAnalysis?.severity || 'High',
        estimatedQuantity: aiAnalysis?.estimatedQuantity || 'Medium (~75 kg)',
        priorityScore: aiAnalysis?.priorityScore || 82,
        location: {
          address: location.address || `${location.landmark || 'Dehradun'}, Uttarakhand`,
          landmark: location.landmark || 'Dehradun',
          lat: location.lat,
          lng: location.lng,
          zone: location.zone || 'Central',
        },
        citizen: currentUser,
      }

      const res = await reportsAPI.create(payload)
      if (res.success && res.data) {
        setSubmittedReport(res.data)
        setCurrentStep(5)
        toast.success(`Complaint ${res.data.id} has been registered!`, 'Report Submitted')
      } else {
        setError(res.error?.message || 'Failed to submit report. Please try again.')
      }
    } catch (err) {
      setError(err.message || 'An unexpected error occurred during submission.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex bg-slate-50 min-h-[calc(100vh-4rem)]">
      <Sidebar role="citizen" />

      <main className="flex-1 p-4 sm:p-6 lg:p-8 pb-20 md:pb-8 max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI-Assisted Citizen Reporting</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Report Waste Incident
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Capture photograph, pin location, and let our neural vision pipeline fast-track municipal action.
          </p>
        </div>

        {/* Step Progress Tracker */}
        {currentStep < 5 && (
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs mb-6">
            <div className="grid grid-cols-4 gap-2">
              {[
                { step: 1, label: 'Photo', icon: Camera },
                { step: 2, label: 'Location', icon: MapPin },
                { step: 3, label: 'Details', icon: FileText },
                { step: 4, label: 'AI Review', icon: Cpu },
              ].map((s) => {
                const Icon = s.icon
                const isCurrent = currentStep === s.step
                const isPassed = currentStep > s.step

                return (
                  <div
                    key={s.step}
                    className={`flex items-center gap-2 p-2 rounded-xl transition-colors ${
                      isCurrent
                        ? 'bg-emerald-50 text-emerald-700 font-bold border border-emerald-200'
                        : isPassed
                        ? 'text-emerald-600 font-medium'
                        : 'text-slate-400'
                    }`}
                  >
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs shrink-0 ${
                        isCurrent
                          ? 'bg-emerald-600 text-white font-bold'
                          : isPassed
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-slate-100 text-slate-400'
                      }`}
                    >
                      {isPassed ? '✓' : s.step}
                    </div>
                    <span className="text-xs truncate hidden sm:inline">{s.label}</span>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="mb-6 flex items-center gap-2 p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl text-xs sm:text-sm">
            <AlertTriangle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* STEP 1: UPLOAD PHOTO */}
        {currentStep === 1 && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Step 1: Upload Waste Photograph</h3>
              <p className="text-xs text-slate-500 mt-1">
                Our YOLO computer vision engine will detect waste categories, estimated mass, and biological hazard level.
              </p>
            </div>

            <WasteImageUpload
              image={image}
              onImageChange={handleImageChange}
              onImageRemove={handleImageRemove}
              onPresetSelect={handlePresetSelect}
            />

            {analyzingAI && (
              <div className="flex items-center gap-2.5 p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800">
                <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />
                <span>Running deep learning inference on image pixels...</span>
              </div>
            )}

            <div className="flex items-center justify-end pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={goToNextStep}
                disabled={!image || analyzingAI}
                className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-bold shadow-xs transition-colors disabled:opacity-50"
              >
                <span>Continue to Location</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: LOCATION */}
        {currentStep === 2 && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Step 2: Pin Exact Location in Dehradun</h3>
              <p className="text-xs text-slate-500 mt-1">
                Accurate coordinates enable our sanitation trucks to navigate directly to the accumulation.
              </p>
            </div>

            <LocationPicker value={location} onChange={setLocation} />

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={goToPrevStep}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-semibold transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>

              <button
                type="button"
                onClick={goToNextStep}
                className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-bold shadow-xs transition-colors"
              >
                <span>Continue to Details</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: DESCRIPTION */}
        {currentStep === 3 && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Step 3: Add Context & Description</h3>
              <p className="text-xs text-slate-500 mt-1">
                Help sanitation supervisors understand accessibility or special hazards.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Waste Description <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={4}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Large amount of plastic waste near the roadside corner. Dogs and cattle are tearing through it..."
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Additional Information (Optional)
                </label>
                <input
                  type="text"
                  value={additionalNotes}
                  onChange={(e) => setAdditionalNotes(e.target.value)}
                  placeholder="e.g. Near storm drain inlet, narrow alleyway, requires smaller tipper"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={goToPrevStep}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-semibold transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>

              <button
                type="button"
                onClick={goToNextStep}
                disabled={!description.trim()}
                className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-bold shadow-xs transition-colors disabled:opacity-50"
              >
                <span>Preview AI Assessment</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: AI ANALYSIS PREVIEW & CONFIRMATION */}
        {currentStep === 4 && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Step 4: AI Analysis & Priority Assessment</h3>
              <p className="text-xs text-slate-500 mt-1">
                Review the automated detection before broadcasting the complaint to Nagar Nigam Dehradun.
              </p>
            </div>

            {/* AI Result Card */}
            {aiAnalysis ? (
              <AIResultCard
                analysis={aiAnalysis}
                onRecalculate={() => triggerAIAnalysis(image)}
              />
            ) : (
              <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 text-center">
                <Loader2 className="w-6 h-6 text-emerald-600 animate-spin mx-auto mb-2" />
                <p className="text-xs font-semibold text-slate-700">Synthesizing AI Inference...</p>
              </div>
            )}

            {/* Incident Summary Card */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Location:</span>
                <strong className="text-slate-800">{location.landmark || location.address}</strong>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Coordinates:</span>
                <span className="font-mono text-slate-700">{location.lat.toFixed(4)}, {location.lng.toFixed(4)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Reporter:</span>
                <strong className="text-slate-800">{currentUser?.name} ({currentUser?.phone || '+91 98765 43210'})</strong>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={goToPrevStep}
                disabled={submitting}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-semibold transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>

              <button
                type="button"
                onClick={handleSubmitReport}
                disabled={submitting}
                className="inline-flex items-center gap-2 px-7 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-bold shadow-md hover:shadow-lg transition-all active:scale-95 disabled:opacity-60"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Transmitting Report...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Submit Report</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* STEP 5: SUCCESS CONFIRMATION */}
        {currentStep === 5 && submittedReport && (
          <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/80 shadow-md text-center max-w-lg mx-auto space-y-6 animate-in zoom-in-95">
            <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-12 h-12" />
            </div>

            <div>
              <span className="inline-block px-3 py-1 bg-emerald-50 text-emerald-800 rounded-full font-mono text-xs font-bold border border-emerald-200 mb-2">
                Report ID: {submittedReport.id}
              </span>
              <h2 className="text-2xl font-extrabold text-slate-900">
                Your report has been submitted successfully!
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-2">
                Our AI priority engine logged this with a score of{' '}
                <strong className="text-slate-800">{submittedReport.priorityScore}/100</strong>.
                Dehradun Municipal Sanitation will dispatch the nearest zone vehicle.
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-left space-y-1.5">
              <div className="flex justify-between text-slate-600">
                <span>Waste Type:</span>
                <strong className="text-slate-900">{submittedReport.wasteType}</strong>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Area:</span>
                <strong className="text-slate-900">{submittedReport.location?.landmark}</strong>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Severity:</span>
                <strong className="text-rose-600">{submittedReport.severity}</strong>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <Link
                to={`/citizen/reports/${submittedReport.id}`}
                className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-bold shadow-xs transition-colors"
              >
                Track Report
              </Link>
              <Link
                to="/citizen"
                className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-semibold transition-colors"
              >
                Go to Dashboard
              </Link>
            </div>
          </div>
        )}
      </main>

      <MobileSidebar role="citizen" />
    </div>
  )
}
