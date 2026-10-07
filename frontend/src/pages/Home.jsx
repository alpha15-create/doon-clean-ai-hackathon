import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Recycle,
  Sparkles,
  MapPin,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  Cpu,
  Truck,
  CheckCircle2,
  Users,
  Camera,
  Layers,
  Flame,
  Award,
} from 'lucide-react'
import MapView from '../components/MapView'
import { INITIAL_REPORTS, MOCK_HOTSPOTS } from '../data/mockData'

export default function Home() {
  const [reports] = useState(INITIAL_REPORTS)
  const [hotspots] = useState(MOCK_HOTSPOTS)

  return (
    <div className="bg-slate-50 text-slate-900">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 sm:pt-20 sm:pb-28">
        {/* Soft decorative background circles */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-emerald-100/60 to-transparent rounded-full blur-3xl -z-10 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            {/* Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100/80 border border-emerald-300 text-emerald-800 text-xs font-semibold mb-6 shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Next-Gen Civic Technology for Dehradun</span>
            </div>

            {/* Title */}
            <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Cleaner Doon. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600">
                Smarter Doon.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="mt-5 text-base sm:text-xl text-slate-600 font-normal leading-relaxed">
              AI-powered waste reporting and response for a cleaner Dehradun. Snap a photo, let computer vision assess severity, and watch municipal sanitation teams resolve it in real time.
            </p>

            {/* CTAs */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/citizen/report"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-base font-bold shadow-md hover:shadow-lg transition-all active:scale-95"
              >
                <span>Report Waste</span>
                <ArrowRight className="w-5 h-5" />
              </Link>

              <a
                href="#waste-map"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-white border border-slate-300 hover:bg-slate-100 text-slate-800 rounded-2xl text-base font-bold shadow-xs transition-colors"
              >
                <MapPin className="w-5 h-5 text-emerald-600" />
                <span>Explore Waste Map</span>
              </a>
            </div>

            {/* Verified Trust Badges */}
            <div className="mt-10 pt-6 border-t border-slate-200/80 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 font-medium">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Instant YOLOv8 Vision
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> GPS Geotagged Tracking
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Nagar Nigam Fleet Dispatch
              </span>
            </div>
          </div>

          {/* Hero Visual Showcase */}
          <div className="mt-12 sm:mt-16 relative max-w-5xl mx-auto rounded-3xl p-3 bg-white/70 border border-slate-200/90 shadow-xl backdrop-blur-md">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-2">
              {/* Feature Preview 1 */}
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200/70">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-3">
                  <Camera className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-900 text-sm">1. Citizen Photo Upload</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Upload waste photo from your mobile browser with one-tap GPS geolocation.
                </p>
              </div>

              {/* Feature Preview 2 */}
              <div className="bg-slate-900 text-white rounded-2xl p-5 border border-slate-800 shadow-md">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-3">
                  <Cpu className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-white text-sm">2. AI Vision Analysis</h3>
                <p className="text-xs text-slate-300 mt-1">
                  Automated waste type classification, volume estimation, and 0-100 priority score calculation.
                </p>
              </div>

              {/* Feature Preview 3 */}
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200/70">
                <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center mb-3">
                  <Truck className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-900 text-sm">3. Rapid Fleet Dispatch</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Zone sanitation teams are routed via optimized pathfinding and resolve reports swiftly.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SAMPLE DEMO STATISTICS */}
      <section className="py-12 bg-white border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-6 border-b border-slate-100 gap-2">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Platform Performance Metrics</h2>
              <p className="text-xs text-slate-500">Live operational overview across Dehradun municipal zones</p>
            </div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-800 border border-amber-200 rounded-full text-xs font-semibold self-start sm:self-auto">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
              Demo / Prototype Sample Data
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 text-center">
              <span className="text-3xl sm:text-4xl font-extrabold text-emerald-600">140+</span>
              <p className="text-xs font-medium text-slate-500 mt-1">Waste Complaints Logged</p>
            </div>
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 text-center">
              <span className="text-3xl sm:text-4xl font-extrabold text-blue-600">92.4%</span>
              <p className="text-xs font-medium text-slate-500 mt-1">AI Detection Accuracy</p>
            </div>
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 text-center">
              <span className="text-3xl sm:text-4xl font-extrabold text-teal-600">4.8 hrs</span>
              <p className="text-xs font-medium text-slate-500 mt-1">Average Resolution Time</p>
            </div>
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 text-center">
              <span className="text-3xl sm:text-4xl font-extrabold text-emerald-700">80.3%</span>
              <p className="text-xs font-medium text-slate-500 mt-1">Resolution Success Rate</p>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
            Simple 4-Step Architecture
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 mt-2">
            How DoonClean AI Works
          </h2>
          <p className="text-sm text-slate-600 mt-3">
            Transforming municipal waste reporting from a slow bureaucratic process into an instant, transparent AI-driven civic pipeline.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs relative">
            <span className="text-4xl font-black text-emerald-100 absolute top-4 right-4">01</span>
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-lg mb-4">
              <Camera className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-slate-900">Citizen Reporting</h3>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              Citizen clicks a photo of dumped garbage on their smartphone. GPS coordinates and Dehradun landmark are captured automatically.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs relative">
            <span className="text-4xl font-black text-emerald-100 absolute top-4 right-4">02</span>
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-lg mb-4">
              <Cpu className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-slate-900">YOLOv8 Analysis</h3>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              Neural network parses pixels to identify plastic, debris, organic, or e-waste, estimating weight and confidence within seconds.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs relative">
            <span className="text-4xl font-black text-emerald-100 absolute top-4 right-4">03</span>
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-lg mb-4">
              <Flame className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-slate-900">Smart Prioritization</h3>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              Factors severity, drainage clogging risk, school/market proximity, and repeat clusters to assign an objective urgency score.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs relative">
            <span className="text-4xl font-black text-emerald-100 absolute top-4 right-4">04</span>
            <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold text-lg mb-4">
              <Truck className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-slate-900">Collector Dispatch</h3>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              Zone sanitation tipper receives route waypoint, arrives on-site, completes pickup, and logs photo confirmation.
            </p>
          </div>
        </div>
      </section>

      {/* INTERACTIVE WASTE MAP PREVIEW */}
      <section id="waste-map" className="py-16 bg-slate-100/70 border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
                Geospatial Intelligence
              </span>
              <h2 className="text-3xl font-extrabold text-slate-900 mt-1">
                Dehradun Live Waste & Hotspot Map
              </h2>
              <p className="text-sm text-slate-600 mt-1 max-w-xl">
                Explore real-time waste incidents and high-density cluster hotspots across Clock Tower, Paltan Bazaar, Rispana, and Rajpur Road.
              </p>
            </div>

            <Link
              to="/citizen/report"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold shadow-xs self-start md:self-auto"
            >
              <Camera className="w-4 h-4" />
              Pin New Report on Map
            </Link>
          </div>

          <div className="bg-white p-3 rounded-3xl shadow-sm border border-slate-200">
            <MapView
              reports={reports}
              hotspots={hotspots}
              height="520px"
              showHotspots={true}
            />
          </div>
        </div>
      </section>

      {/* KEY FEATURES SECTION */}
      <section id="features" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
            Capabilities
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 mt-2">
            Built for Citizens, Officers & Ground Teams
          </h2>
          <p className="text-sm text-slate-600 mt-3">
            Engineered to empower every participant in Dehradun’s circular waste management ecosystem.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs hover:border-emerald-300 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4">
              <Camera className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-slate-900">Mobile Citizen Portal</h3>
            <p className="text-sm text-slate-600 mt-2 leading-relaxed">
              Mobile-first submission with camera upload, location detection, and live status progress timeline tracking from report to resolution.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs hover:border-emerald-300 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center mb-4">
              <Cpu className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-slate-900">AI YOLO Vision Engine</h3>
            <p className="text-sm text-slate-600 mt-2 leading-relaxed">
              Automated classification into Plastic, Organic, C&D Debris, or E-Waste, with confidence percentages and quantity estimations.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs hover:border-emerald-300 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center mb-4">
              <Flame className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-slate-900">Hotspot Clustering</h3>
            <p className="text-sm text-slate-600 mt-2 leading-relaxed">
              Identifies chronic dumping clusters across Dehradun, helping municipal authorities deploy permanent bins and patrol schedules.
            </p>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="bg-gradient-to-r from-emerald-800 to-teal-900 text-white py-16">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Help Make Dehradun the Cleanest Hill Valley in India
          </h2>
          <p className="mt-4 text-emerald-100 text-sm sm:text-base max-w-xl mx-auto">
            Join thousands of conscious citizens and smart sanitation officers using AI to preserve Doon Valley’s green beauty.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              to="/citizen/report"
              className="px-7 py-3.5 bg-white text-emerald-900 hover:bg-emerald-50 rounded-2xl font-bold text-sm shadow-md transition-all active:scale-95"
            >
              Report an Issue Now
            </Link>
            <Link
              to="/admin"
              className="px-7 py-3.5 bg-emerald-700/80 hover:bg-emerald-700 text-white border border-emerald-500/50 rounded-2xl font-bold text-sm transition-all"
            >
              Municipal Admin Portal
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
