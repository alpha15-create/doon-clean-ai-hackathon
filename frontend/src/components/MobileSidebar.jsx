import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  FileText,
  PlusCircle,
  BarChart3,
  Flame,
  Truck,
  CheckSquare,
} from 'lucide-react'

export default function MobileSidebar({ role = 'citizen' }) {
  const citizenTabs = [
    { to: '/citizen', label: 'Home', icon: LayoutDashboard, end: true },
    { to: '/citizen/report', label: 'Report', icon: PlusCircle },
    { to: '/citizen/reports', label: 'Reports', icon: FileText },
  ]

  const adminTabs = [
    { to: '/admin', label: 'Stats', icon: LayoutDashboard, end: true },
    { to: '/admin/complaints', label: 'Reports', icon: FileText },
    { to: '/admin/hotspots', label: 'Hotspots', icon: Flame },
    { to: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
    { to: '/admin/collection', label: 'Fleet', icon: Truck },
  ]

  const collectorTabs = [
    { to: '/collector', label: 'Home', icon: LayoutDashboard, end: true },
    { to: '/collector/tasks', label: 'Tasks', icon: CheckSquare },
  ]

  const tabs =
    role === 'admin' ? adminTabs : role === 'collector' ? collectorTabs : citizenTabs

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-2 py-2 flex items-center justify-around shadow-lg">
      {tabs.map((tab) => {
        const Icon = tab.icon
        return (
          <NavLink
            key={tab.to}
            to={tab.to}
            end={tab.end}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center py-1 px-3 rounded-xl text-xs font-semibold transition-all ${
                isActive
                  ? 'text-emerald-600 font-bold'
                  : 'text-slate-500 hover:text-slate-900'
              }`
            }
          >
            <Icon className="w-5 h-5 mb-0.5" />
            <span className="text-[10px]">{tab.label}</span>
          </NavLink>
        )
      })}
    </nav>
  )
}
