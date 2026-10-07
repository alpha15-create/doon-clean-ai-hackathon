import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  FileText,
  AlertTriangle,
  BarChart3,
  Flame,
  Truck,
  PlusCircle,
  MapPin,
  CheckSquare,
  Shield,
  User,
} from 'lucide-react'

export default function Sidebar({ role = 'citizen' }) {
  const citizenLinks = [
    { to: '/citizen', label: 'Overview', icon: LayoutDashboard, end: true },
    { to: '/citizen/report', label: 'Report Waste', icon: PlusCircle },
    { to: '/citizen/reports', label: 'My Reports', icon: FileText },
  ]

  const adminLinks = [
    { to: '/admin', label: 'Overview', icon: LayoutDashboard, end: true },
    { to: '/admin/complaints', label: 'Complaints', icon: FileText },
    { to: '/admin/hotspots', label: 'Hotspot Map', icon: Flame },
    { to: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
    { to: '/admin/collection', label: 'Fleet & Dispatch', icon: Truck },
  ]

  const collectorLinks = [
    { to: '/collector', label: 'Dashboard', icon: LayoutDashboard, end: true },
    { to: '/collector/tasks', label: 'My Pickup Tasks', icon: CheckSquare },
  ]

  const links =
    role === 'admin' ? adminLinks : role === 'collector' ? collectorLinks : citizenLinks

  return (
    <aside className="w-64 bg-white border-r border-slate-200/80 p-5 flex flex-col justify-between hidden md:flex shrink-0 min-h-[calc(100vh-4rem)]">
      <div>
        <div className="pb-4 mb-4 border-b border-slate-100">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
            {role === 'admin' ? (
              <>
                <Shield className="w-3.5 h-3.5 text-emerald-600" />
                <span>Admin Operations</span>
              </>
            ) : role === 'collector' ? (
              <>
                <Truck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Sanitation Fleet</span>
              </>
            ) : (
              <>
                <User className="w-3.5 h-3.5 text-emerald-600" />
                <span>Citizen Workspace</span>
              </>
            )}
          </div>
        </div>

        <nav className="space-y-1.5">
          {links.map((link) => {
            const Icon = link.icon
            return (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-emerald-50 text-emerald-700 shadow-2xs font-bold border border-emerald-100'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`
                }
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{link.label}</span>
              </NavLink>
            )
          })}
        </nav>
      </div>

      {/* Municipal Hotline Box */}
      <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs">
        <p className="font-bold text-slate-800">Dehradun Helpline</p>
        <p className="text-slate-500 text-[11px] mt-0.5">Toll Free: 1800-180-4104</p>
        <p className="text-[10px] text-emerald-600 font-semibold mt-2">
          Dehradun Nagar Nigam AI Grid
        </p>
      </div>
    </aside>
  )
}
