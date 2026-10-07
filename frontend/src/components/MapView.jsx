import { useState } from 'react'
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Circle,
  useMap,
} from 'react-leaflet'
import L from 'leaflet'
import { DEHRADUN_CENTER, DEHRADUN_DEFAULT_ZOOM } from '../utils/helpers'
import StatusBadge from './StatusBadge'
import PriorityBadge from './PriorityBadge'
import { MapPin, Navigation, Eye } from 'lucide-react'
import { Link } from 'react-router-dom'

// Custom SVG map icons to avoid Leaflet missing PNG asset issues
const createPinIcon = (color = '#10b981', isSelected = false) => {
  return L.divIcon({
    className: 'custom-leaflet-marker',
    html: `
      <div style="
        width: 34px;
        height: 34px;
        display: flex;
        align-items: center;
        justify-content: center;
        transform: translate(-17px, -34px);
        filter: drop-shadow(0 4px 6px rgba(0,0,0,0.3));
      ">
        <svg viewBox="0 0 24 24" width="34" height="34" fill="${color}" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
          <circle cx="12" cy="10" r="3" fill="#ffffff"></circle>
        </svg>
        ${isSelected ? '<span style="position:absolute; width:10px; height:10px; background:#fff; border-radius:50%; animation:ping 1s cubic-bezier(0,0,0.2,1) infinite;"></span>' : ''}
      </div>
    `,
    iconSize: [34, 34],
    iconAnchor: [17, 34],
    popupAnchor: [0, -34],
  })
}

// Controller to smoothly pan to center
function MapController({ center, zoom }) {
  const map = useMap()
  if (center) {
    map.setView(center, zoom || map.getZoom(), { animate: true })
  }
  return null
}

export default function MapView({
  reports = [],
  hotspots = [],
  center = DEHRADUN_CENTER,
  zoom = DEHRADUN_DEFAULT_ZOOM,
  height = '480px',
  selectedReportId = null,
  onSelectReport,
  showHotspots = true,
  userLocation = null,
}) {
  const getMarkerColor = (report) => {
    const p = (report.severity || '').toLowerCase()
    if (p === 'high' || p === 'critical') return '#ef4444' // red
    if (p === 'medium') return '#f59e0b' // amber
    return '#10b981' // emerald
  }

  return (
    <div
      style={{ height }}
      className="w-full relative rounded-2xl overflow-hidden border border-slate-200/90 shadow-xs z-0"
    >
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={true}
        style={{ width: '100%', height: '100%' }}
      >
        <MapController center={center} zoom={zoom} />

        {/* Clean OpenStreetMap Tiles */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* User live position marker if available */}
        {userLocation && (
          <Marker
            position={[userLocation.lat, userLocation.lng]}
            icon={L.divIcon({
              className: 'user-pin',
              html: `
                <div style="width:20px;height:20px;background:#3b82f6;border:3px solid #fff;border-radius:50%;box-shadow:0 0 10px rgba(59,130,246,0.6);transform:translate(-10px,-10px);"></div>
              `,
              iconSize: [20, 20],
            })}
          >
            <Popup>
              <div className="text-xs font-semibold p-1">
                📍 Your Current Location
              </div>
            </Popup>
          </Marker>
        )}

        {/* Hotspot Circles */}
        {showHotspots &&
          hotspots.map((hs) => (
            <Circle
              key={hs.id}
              center={hs.center}
              radius={hs.radius || 500}
              pathOptions={{
                color: hs.priorityLevel === 'Critical' ? '#ef4444' : '#f59e0b',
                fillColor: hs.priorityLevel === 'Critical' ? '#ef4444' : '#f59e0b',
                fillOpacity: 0.18,
                weight: 2,
                dashArray: '4, 6',
              }}
            >
              <Popup>
                <div className="p-2 min-w-[200px]">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                    <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                    {hs.name}
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">{hs.description}</p>
                  <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                    <span className="text-slate-600">Reports: <strong>{hs.reportCount}</strong></span>
                    <span className="text-rose-600 font-semibold">{hs.dominantWaste}</span>
                  </div>
                </div>
              </Popup>
            </Circle>
          ))}

        {/* Waste Reports Markers */}
        {reports.map((report) => {
          if (!report.location?.lat || !report.location?.lng) return null
          const isSelected = selectedReportId === report.id
          const color = getMarkerColor(report)

          return (
            <Marker
              key={report.id}
              position={[report.location.lat, report.location.lng]}
              icon={createPinIcon(color, isSelected)}
              eventHandlers={{
                click: () => onSelectReport?.(report),
              }}
            >
              <Popup>
                <div className="p-1 min-w-[230px] max-w-[260px]">
                  <div className="rounded-lg overflow-hidden mb-2 relative">
                    <img
                      src={report.imageUrl}
                      alt={report.title}
                      className="w-full h-24 object-cover"
                    />
                    <div className="absolute top-1.5 left-1.5">
                      <span className="px-1.5 py-0.5 bg-black/70 text-white rounded text-[10px] font-mono">
                        {report.id}
                      </span>
                    </div>
                  </div>

                  <h5 className="font-bold text-xs text-slate-900 leading-snug line-clamp-1">
                    {report.title || report.wasteType}
                  </h5>

                  <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                    {report.location.address || report.location.landmark}
                  </p>

                  <div className="mt-2 flex items-center justify-between gap-1">
                    <StatusBadge status={report.status} size="sm" />
                    <PriorityBadge priority={report.severity} score={report.priorityScore} />
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[10px] text-slate-400">
                      {report.wasteType}
                    </span>
                    <Link
                      to={`/citizen/reports/${report.id}`}
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 hover:text-emerald-700"
                    >
                      <Eye className="w-3 h-3" /> View Details
                    </Link>
                  </div>
                </div>
              </Popup>
            </Marker>
          )
        })}
      </MapContainer>

      {/* Map Legend */}
      <div className="absolute bottom-3 left-3 z-[1000] bg-white/95 backdrop-blur-md px-3 py-2 rounded-xl border border-slate-200 shadow-md text-[11px] flex items-center gap-3">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
          <span className="text-slate-700 font-medium">High</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
          <span className="text-slate-700 font-medium">Medium</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          <span className="text-slate-700 font-medium">Low</span>
        </div>
        {showHotspots && (
          <div className="flex items-center gap-1.5 border-l border-slate-200 pl-2">
            <span className="w-2.5 h-2.5 rounded-full border border-rose-500 border-dashed bg-rose-200/50" />
            <span className="text-slate-700 font-medium">Hotspots</span>
          </div>
        )}
      </div>
    </div>
  )
}
