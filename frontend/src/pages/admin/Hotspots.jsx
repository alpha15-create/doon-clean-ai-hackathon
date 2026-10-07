import { useState, useEffect } from 'react'
import { hotspotsAPI, reportsAPI } from '../../services/api'
import MapView from '../../components/MapView'
import Loading from '../../components/Loading'
import Sidebar from '../../components/Sidebar'
import MobileSidebar from '../../components/MobileSidebar'
import {
  Flame,
  AlertTriangle,
  MapPin,
  Recycle,
  TrendingUp,
  ShieldCheck,
  Calendar,
  Layers,
} from 'lucide-react'

export default function Hotspots() {
  const [hotspots, setHotspots] = useState([])
  const [reports, setReports] = useState([])
  const [selectedHotspot, setSelectedHotspot] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      const [hRes, rRes] = await Promise.all([
        hotspotsAPI.getAll(),
        reportsAPI.getAll(),
      ])
      if (hRes.success) {
        setHotspots(hRes.data || [])
        if (hRes.data?.length > 0) setSelectedHotspot(hRes.data[0])
      }
      if (rRes.success) setReports(rRes.data || [])
      setLoading(false)
    }
    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="flex bg-slate-50 min-h-[calc(100vh-4rem)]">
        <Sidebar role="admin" />
        <main className="flex-1 p-8"><Loading message="Loading Hotspot Clustering Geo-Models..." /></main>
      </div>
    )
  }

  return (
    <div className="flex bg-slate-50 min-h-[calc(100vh-4rem)]">
      <Sidebar role="admin" />

      <main className="flex-1 p-4 sm:p-6 lg:p-8 pb-20 md:pb-8 max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-slate-200/80 gap-3">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-rose-600 uppercase tracking-wider">
              <Flame className="w-3.5 h-3.5" />
              <span>DBSCAN Spatial Cluster Identification</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-0.5">
              Waste Hotspot Clusters
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Automated high-density geospatial zones prone to recurring garbage tipping in Dehradun.
            </p>
          </div>

          <div className="text-xs font-semibold px-3 py-1.5 bg-amber-50 text-amber-800 border border-amber-200 rounded-xl flex items-center gap-1.5 self-start sm:self-auto">
            <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Prototype Demonstration: Sample Spatial Clusters</span>
          </div>
        </div>

        {/* 2-Column: Interactive Leaflet Map + Hotspot Summary Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Map View (2 columns) */}
          <div className="lg:col-span-2 bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Dehradun Spatial Density Canvas</h3>
                <p className="text-xs text-slate-500">Dotted circles represent 400m - 600m waste catchment clusters</p>
              </div>
              <span className="text-xs font-mono font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg">
                {hotspots.length} Clusters Detected
              </span>
            </div>

            <MapView
              reports={reports}
              hotspots={hotspots}
              center={selectedHotspot ? selectedHotspot.center : undefined}
              zoom={13}
              height="500px"
              showHotspots={true}
            />
          </div>

          {/* Right Column: Selected Hotspot Summary & Clusters List */}
          <div className="space-y-6">
            {/* Selected Hotspot Detailed Card */}
            {selectedHotspot && (
              <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-6 rounded-3xl shadow-xl border border-slate-700 space-y-4 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-48 h-48 bg-rose-500/10 rounded-full blur-2xl pointer-events-none" />

                <div className="flex items-center justify-between pb-3 border-b border-slate-700/80">
                  <span className="text-[11px] font-bold tracking-wider uppercase text-rose-400 flex items-center gap-1.5">
                    <Flame className="w-3.5 h-3.5" />
                    Selected Hotspot
                  </span>
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                    {selectedHotspot.priorityLevel} Priority
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-white leading-snug">
                    {selectedHotspot.name}
                  </h3>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    {selectedHotspot.description}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 py-2 border-y border-slate-700/60 text-xs">
                  <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/50">
                    <span className="text-slate-400 block text-[11px]">Cumulative Reports</span>
                    <span className="text-xl font-black text-white">{selectedHotspot.reportCount}</span>
                  </div>
                  <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/50">
                    <span className="text-slate-400 block text-[11px]">Average Priority</span>
                    <span className="text-xl font-black text-rose-400">{selectedHotspot.averagePriority}/100</span>
                  </div>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between text-slate-300">
                    <span>Dominant Waste Stream:</span>
                    <strong className="text-emerald-300">{selectedHotspot.dominantWaste}</strong>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Clean Clearance Schedule:</span>
                    <strong className="text-white">{selectedHotspot.cleanFrequency}</strong>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Municipal Zone:</span>
                    <strong className="text-white">{selectedHotspot.zone}</strong>
                  </div>
                </div>

                <button
                  type="button"
                  className="w-full mt-2 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
                  onClick={() => alert(`Municipal dispatch recommended for ${selectedHotspot.name}`)}
                >
                  Generate Targeted Clean Route
                </button>
              </div>
            )}

            {/* List of All Hotspots to Click & Inspect */}
            <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-3">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                All Identified Clusters
              </h4>

              <div className="space-y-2 max-h-[280px] overflow-y-auto pr-1">
                {hotspots.map((hs) => (
                  <button
                    key={hs.id}
                    onClick={() => setSelectedHotspot(hs)}
                    className={`w-full text-left p-3 rounded-2xl border transition-all text-xs flex items-center justify-between ${
                      selectedHotspot?.id === hs.id
                        ? 'border-emerald-500 bg-emerald-50/70 shadow-2xs font-bold'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="min-w-0 pr-2">
                      <p className="truncate text-slate-900 font-bold">{hs.name}</p>
                      <p className="text-[11px] text-slate-500 font-normal mt-0.5 truncate">
                        {hs.dominantWaste} • {hs.reportCount} reports
                      </p>
                    </div>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase shrink-0 ${
                        hs.priorityLevel === 'Critical'
                          ? 'bg-rose-100 text-rose-700'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {hs.priorityLevel}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      <MobileSidebar role="admin" />
    </div>
  )
}
