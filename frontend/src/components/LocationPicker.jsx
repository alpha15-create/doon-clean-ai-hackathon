import { useState, useEffect } from 'react'
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  useMap,
} from 'react-leaflet'
import L from 'leaflet'
import { DEHRADUN_CENTER, DEHRADUN_LANDMARKS } from '../utils/helpers'
import {
  MapPin,
  Crosshair,
  Compass,
  AlertCircle,
  CheckCircle2,
  Building,
} from 'lucide-react'

// Location marker icon
const locationPinIcon = L.divIcon({
  className: 'location-picker-pin',
  html: `
    <div style="
      width: 36px;
      height: 36px;
      display: flex;
      align-items: center;
      justify-content: center;
      transform: translate(-18px, -36px);
      filter: drop-shadow(0 4px 8px rgba(0,0,0,0.35));
    ">
      <svg viewBox="0 0 24 24" width="36" height="36" fill="#10b981" stroke="#ffffff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
        <circle cx="12" cy="10" r="3" fill="#ffffff"></circle>
      </svg>
    </div>
  `,
  iconSize: [36, 36],
  iconAnchor: [18, 36],
})

// Click handler on map
function LocationMarker({ position, onChange }) {
  useMapEvents({
    click(e) {
      onChange(e.latlng.lat, e.latlng.lng)
    },
  })

  return position ? (
    <Marker
      position={position}
      icon={locationPinIcon}
      draggable={true}
      eventHandlers={{
        dragend: (e) => {
          const latlng = e.target.getLatLng()
          onChange(latlng.lat, latlng.lng)
        },
      }}
    />
  ) : null
}

function PanToLocation({ position }) {
  const map = useMap()
  useEffect(() => {
    if (position) {
      map.setView(position, 15, { animate: true })
    }
  }, [position, map])
  return null
}

export default function LocationPicker({ value, onChange }) {
  const [geoLoading, setGeoLoading] = useState(false)
  const [geoError, setGeoError] = useState(null)

  const currentLat = value?.lat || DEHRADUN_CENTER[0]
  const currentLng = value?.lng || DEHRADUN_CENTER[1]
  const position = [currentLat, currentLng]

  // Browser geolocation
  const handleUseCurrentLocation = () => {
    setGeoLoading(true)
    setGeoError(null)

    if (!navigator.geolocation) {
      setGeoError('Geolocation is not supported by your browser.')
      setGeoLoading(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = parseFloat(pos.coords.latitude.toFixed(6))
        const lng = parseFloat(pos.coords.longitude.toFixed(6))

        onChange({
          lat,
          lng,
          address: value?.address || 'Current Detected GPS Position',
          landmark: value?.landmark || 'Detected Location',
          zone: 'User Local',
        })
        setGeoLoading(false)
      },
      (err) => {
        let msg = 'Unable to retrieve location.'
        if (err.code === 1) msg = 'Location permission denied. Please click on the map below.'
        else if (err.code === 2) msg = 'Location unavailable. Please select on the map.'
        setGeoError(msg)
        setGeoLoading(false)
      },
      { enableHighAccuracy: true, timeout: 10000 }
    )
  }

  const handleMapClick = (lat, lng) => {
    const fixedLat = parseFloat(lat.toFixed(6))
    const fixedLng = parseFloat(lng.toFixed(6))
    onChange({
      ...value,
      lat: fixedLat,
      lng: fixedLng,
      landmark: value?.landmark || 'Pinned Location on Map',
    })
  }

  const handleLandmarkSelect = (landmark) => {
    onChange({
      ...value,
      lat: landmark.lat,
      lng: landmark.lng,
      landmark: landmark.name,
      address: `${landmark.name}, Dehradun`,
      zone: landmark.zone,
    })
  }

  return (
    <div className="space-y-4">
      {/* Action buttons header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={handleUseCurrentLocation}
          disabled={geoLoading}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-xs transition-colors disabled:opacity-60"
        >
          <Crosshair className={`w-4 h-4 ${geoLoading ? 'animate-spin' : ''}`} />
          {geoLoading ? 'Acquiring GPS...' : 'Use My Current Location'}
        </button>

        <span className="text-xs text-slate-500 font-medium">
          Or click/drag the pin on the map
        </span>
      </div>

      {geoError && (
        <div className="flex items-center gap-2 text-rose-600 text-xs bg-rose-50 p-3 rounded-xl border border-rose-200">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{geoError}</span>
        </div>
      )}

      {/* Interactive Map */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-300 shadow-xs h-72 sm:h-80">
        <MapContainer
          center={position}
          zoom={14}
          scrollWheelZoom={true}
          style={{ width: '100%', height: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <LocationMarker position={position} onChange={handleMapClick} />
          <PanToLocation position={position} />
        </MapContainer>

        {/* GPS coordinates badge on top of map */}
        <div className="absolute top-3 left-3 z-[1000] bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-200 shadow-sm text-xs font-mono text-slate-700 flex items-center gap-2">
          <Compass className="w-3.5 h-3.5 text-emerald-600" />
          <span>
            {currentLat.toFixed(5)}, {currentLng.toFixed(5)}
          </span>
        </div>
      </div>

      {/* Quick Dehradun Landmark Chips */}
      <div>
        <label className="text-xs font-semibold text-slate-600 mb-2 flex items-center gap-1.5">
          <Building className="w-3.5 h-3.5 text-emerald-600" />
          Quick Dehradun Landmarks:
        </label>
        <div className="flex flex-wrap gap-1.5">
          {DEHRADUN_LANDMARKS.slice(0, 6).map((lm, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handleLandmarkSelect(lm)}
              className="text-xs px-2.5 py-1 bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 border border-slate-200 hover:border-emerald-300 rounded-lg transition-colors font-medium"
            >
              {lm.name}
            </button>
          ))}
        </div>
      </div>

      {/* Manual Address Fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Street Address / Locality
          </label>
          <input
            type="text"
            value={value?.address || ''}
            onChange={(e) => onChange({ ...value, address: e.target.value })}
            placeholder="e.g. Near Ghanta Ghar, Rajpur Road"
            className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Landmark / Notes
          </label>
          <input
            type="text"
            value={value?.landmark || ''}
            onChange={(e) => onChange({ ...value, landmark: e.target.value })}
            placeholder="e.g. Opposite post office / culvert"
            className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
          />
        </div>
      </div>
    </div>
  )
}
