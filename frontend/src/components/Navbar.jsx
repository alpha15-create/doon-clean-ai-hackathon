import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  Recycle,
  PlusCircle,
  Menu,
  X,
  LogOut,
  User,
  Shield,
  Truck,
  Sparkles,
  MapPin,
  ChevronDown,
} from 'lucide-react'

export default function Navbar() {
  const { currentUser, role, isAuthenticated, logout, switchRole } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const handleRoleSwitch = (newRole) => {
    switchRole(newRole)
    setRoleDropdownOpen(false)
    if (newRole === 'admin') navigate('/admin')
    else if (newRole === 'collector') navigate('/collector')
    else navigate('/citizen')
  }

  const isActive = (path) => location.pathname === path

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <Recycle className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <span className="font-extrabold text-lg text-slate-900 tracking-tight flex items-center gap-1">
                DoonClean <span className="text-emerald-600">AI</span>
              </span>
              <span className="text-[10px] text-slate-500 block -mt-1 font-medium tracking-wide">
                Smart Sanitation Dehradun
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              to="/"
              className={`text-sm font-medium transition-colors ${
                isActive('/') ? 'text-emerald-600 font-semibold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Home
            </Link>

            {isAuthenticated ? (
              <>
                {role === 'citizen' && (
                  <>
                    <Link
                      to="/citizen"
                      className={`text-sm font-medium transition-colors ${
                        isActive('/citizen') ? 'text-emerald-600 font-semibold' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Dashboard
                    </Link>
                    <Link
                      to="/citizen/reports"
                      className={`text-sm font-medium transition-colors ${
                        isActive('/citizen/reports') ? 'text-emerald-600 font-semibold' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      My Reports
                    </Link>
                  </>
                )}

                {role === 'admin' && (
                  <>
                    <Link
                      to="/admin"
                      className={`text-sm font-medium transition-colors ${
                        isActive('/admin') ? 'text-emerald-600 font-semibold' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Dashboard
                    </Link>
                    <Link
                      to="/admin/complaints"
                      className={`text-sm font-medium transition-colors ${
                        isActive('/admin/complaints') ? 'text-emerald-600 font-semibold' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Complaints
                    </Link>
                    <Link
                      to="/admin/hotspots"
                      className={`text-sm font-medium transition-colors ${
                        isActive('/admin/hotspots') ? 'text-emerald-600 font-semibold' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Hotspots
                    </Link>
                    <Link
                      to="/admin/analytics"
                      className={`text-sm font-medium transition-colors ${
                        isActive('/admin/analytics') ? 'text-emerald-600 font-semibold' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Analytics
                    </Link>
                    <Link
                      to="/admin/collection"
                      className={`text-sm font-medium transition-colors ${
                        isActive('/admin/collection') ? 'text-emerald-600 font-semibold' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Collection
                    </Link>
                  </>
                )}

                {role === 'collector' && (
                  <>
                    <Link
                      to="/collector"
                      className={`text-sm font-medium transition-colors ${
                        isActive('/collector') ? 'text-emerald-600 font-semibold' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Dashboard
                    </Link>
                    <Link
                      to="/collector/tasks"
                      className={`text-sm font-medium transition-colors ${
                        isActive('/collector/tasks') ? 'text-emerald-600 font-semibold' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Assigned Tasks
                    </Link>
                  </>
                )}
              </>
            ) : (
              <>
                <a href="#how-it-works" className="text-sm font-medium text-slate-600 hover:text-slate-900">
                  How It Works
                </a>
                <a href="#waste-map" className="text-sm font-medium text-slate-600 hover:text-slate-900">
                  Waste Map
                </a>
                <a href="#features" className="text-sm font-medium text-slate-600 hover:text-slate-900">
                  Features
                </a>
              </>
            )}
          </nav>

          {/* Desktop Right Side CTA & Auth */}
          <div className="hidden md:flex items-center gap-3">
            {/* Quick Role Switcher for Hackathon Judges */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 transition-colors"
                title="Switch role for demo"
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span className="capitalize font-bold">{role} View</span>
                <ChevronDown className="w-3.5 h-3.5 text-emerald-600" />
              </button>

              {roleDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-200 py-1.5 z-50 animate-in fade-in zoom-in-95">
                  <div className="px-3 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Demo Role Switch
                  </div>
                  <button
                    onClick={() => handleRoleSwitch('citizen')}
                    className={`w-full px-3 py-2 text-left text-xs flex items-center gap-2 hover:bg-slate-50 ${
                      role === 'citizen' ? 'text-emerald-600 font-bold bg-emerald-50/50' : 'text-slate-700'
                    }`}
                  >
                    <User className="w-3.5 h-3.5" /> Citizen Portal
                  </button>
                  <button
                    onClick={() => handleRoleSwitch('admin')}
                    className={`w-full px-3 py-2 text-left text-xs flex items-center gap-2 hover:bg-slate-50 ${
                      role === 'admin' ? 'text-emerald-600 font-bold bg-emerald-50/50' : 'text-slate-700'
                    }`}
                  >
                    <Shield className="w-3.5 h-3.5" /> Municipal Admin
                  </button>
                  <button
                    onClick={() => handleRoleSwitch('collector')}
                    className={`w-full px-3 py-2 text-left text-xs flex items-center gap-2 hover:bg-slate-50 ${
                      role === 'collector' ? 'text-emerald-600 font-bold bg-emerald-50/50' : 'text-slate-700'
                    }`}
                  >
                    <Truck className="w-3.5 h-3.5" /> Sanitation Collector
                  </button>
                </div>
              )}
            </div>

            {/* Report Waste Primary CTA */}
            <Link
              to="/citizen/report"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold shadow-xs hover:shadow-md transition-all active:scale-95"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Report Waste</span>
            </Link>

            {isAuthenticated ? (
              <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                <div className="text-right">
                  <div className="text-xs font-bold text-slate-900 leading-tight">
                    {currentUser?.name || 'User'}
                  </div>
                  <div className="text-[10px] text-slate-500 capitalize">{role}</div>
                </div>
                <button
                  onClick={handleLogout}
                  title="Sign out"
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="text-sm font-semibold text-slate-700 hover:text-emerald-600 px-3 py-2 rounded-xl transition-colors"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile hamburger button */}
          <div className="flex md:hidden items-center gap-2">
            <Link
              to="/citizen/report"
              className="p-2 bg-emerald-600 text-white rounded-xl shadow-xs"
              title="Report Waste"
            >
              <PlusCircle className="w-4 h-4" />
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-5 space-y-3 animate-in slide-in-from-top-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="text-xs text-slate-500">
              Active mode: <strong className="capitalize text-slate-900">{role}</strong>
            </div>
            <div className="flex gap-1.5">
              <button
                onClick={() => handleRoleSwitch('citizen')}
                className="px-2 py-0.5 text-xs bg-slate-100 rounded-md font-medium"
              >
                Citizen
              </button>
              <button
                onClick={() => handleRoleSwitch('admin')}
                className="px-2 py-0.5 text-xs bg-slate-100 rounded-md font-medium"
              >
                Admin
              </button>
              <button
                onClick={() => handleRoleSwitch('collector')}
                className="px-2 py-0.5 text-xs bg-slate-100 rounded-md font-medium"
              >
                Collector
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Home
            </Link>

            {role === 'citizen' && (
              <>
                <Link
                  to="/citizen"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Citizen Dashboard
                </Link>
                <Link
                  to="/citizen/reports"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  My Waste Reports
                </Link>
              </>
            )}

            {role === 'admin' && (
              <>
                <Link
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Admin Overview
                </Link>
                <Link
                  to="/admin/complaints"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Complaint Management
                </Link>
                <Link
                  to="/admin/hotspots"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Hotspot Maps
                </Link>
                <Link
                  to="/admin/analytics"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  City Analytics
                </Link>
                <Link
                  to="/admin/collection"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Collection Fleet
                </Link>
              </>
            )}

            {role === 'collector' && (
              <>
                <Link
                  to="/collector"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Collector Tasks
                </Link>
              </>
            )}

            <Link
              to="/citizen/report"
              onClick={() => setMobileMenuOpen(false)}
              className="mt-2 w-full text-center px-4 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-semibold shadow-xs"
            >
              Report Waste Now
            </Link>

            {isAuthenticated ? (
              <button
                onClick={() => {
                  setMobileMenuOpen(false)
                  handleLogout()
                }}
                className="w-full mt-2 text-left px-3 py-2 rounded-xl text-sm font-medium text-rose-600 hover:bg-rose-50 flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" /> Sign Out ({currentUser?.name})
              </button>
            ) : (
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full mt-2 text-center px-3 py-2 rounded-xl text-sm font-semibold text-slate-700 bg-slate-100"
              >
                Log In
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
