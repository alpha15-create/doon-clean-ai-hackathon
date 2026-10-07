import { Recycle, Heart, Shield, ExternalLink, MapPin } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Col */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-500 flex items-center justify-center text-white shadow-xs">
                <Recycle className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-base text-white tracking-tight">
                DoonClean <span className="text-emerald-400">AI</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              AI-powered civic waste detection, prioritization and rapid response infrastructure designed for the city of Dehradun, Uttarakhand.
            </p>
            <div className="text-[11px] text-emerald-400/90 font-medium flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              Dehradun Nagar Nigam Smart Sanitation Initiative
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              Citizen Portal
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/citizen/report" className="hover:text-emerald-400 transition-colors">
                  Report Waste Incident
                </Link>
              </li>
              <li>
                <Link to="/citizen/reports" className="hover:text-emerald-400 transition-colors">
                  Track My Complaints
                </Link>
              </li>
              <li>
                <Link to="/citizen" className="hover:text-emerald-400 transition-colors">
                  Citizen Dashboard
                </Link>
              </li>
              <li>
                <a href="#how-it-works" className="hover:text-emerald-400 transition-colors">
                  How AI YOLO Detection Works
                </a>
              </li>
            </ul>
          </div>

          {/* Municipal Administration */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              Municipal & Fleet
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/admin" className="hover:text-emerald-400 transition-colors">
                  Admin Control Room
                </Link>
              </li>
              <li>
                <Link to="/admin/hotspots" className="hover:text-emerald-400 transition-colors">
                  Hotspot Density Analysis
                </Link>
              </li>
              <li>
                <Link to="/admin/collection" className="hover:text-emerald-400 transition-colors">
                  Sanitation Fleet Dispatch
                </Link>
              </li>
              <li>
                <Link to="/collector" className="hover:text-emerald-400 transition-colors">
                  Collector Field Interface
                </Link>
              </li>
            </ul>
          </div>

          {/* Hackathon / Demo notice */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              Demo Data Notice
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              This application is built for hackathon demonstration. All statistics, heatmaps, and coordinates represent sample test data and do NOT represent official Dehradun municipal statistics.
            </p>
            <div className="mt-3 text-[11px] text-slate-500">
              Tech Stack: React • Leaflet • Tailwind CSS • YOLO Vision Architecture
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
          <p>© 2026 DoonClean AI. Developed for Dehradun Smart City Hackathon.</p>
          <p className="flex items-center gap-1">
            Engineered with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for a cleaner Uttarakhand
          </p>
        </div>
      </div>
    </footer>
  )
}
