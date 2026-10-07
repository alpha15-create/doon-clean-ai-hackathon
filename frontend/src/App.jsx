import { lazy, Suspense } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ToastProvider } from './context/ToastContext'

// Global Components
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ProtectedRoute from './components/ProtectedRoute'
import Loading from './components/Loading'

// Lazy-loaded Pages
const Home = lazy(() => import('./pages/Home'))
const Login = lazy(() => import('./pages/Login'))
const Register = lazy(() => import('./pages/Register'))
const NotFound = lazy(() => import('./pages/NotFound'))

// Citizen Pages
const CitizenDashboard = lazy(() => import('./pages/citizen/CitizenDashboard'))
const ReportWaste = lazy(() => import('./pages/citizen/ReportWaste'))
const MyReports = lazy(() => import('./pages/citizen/MyReports'))
const ReportDetails = lazy(() => import('./pages/citizen/ReportDetails'))

// Admin Pages
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'))
const Complaints = lazy(() => import('./pages/admin/Complaints'))
const ComplaintDetails = lazy(() => import('./pages/admin/ComplaintDetails'))
const Analytics = lazy(() => import('./pages/admin/Analytics'))
const Hotspots = lazy(() => import('./pages/admin/Hotspots'))
const Collection = lazy(() => import('./pages/admin/Collection'))

// Collector Pages
const CollectorDashboard = lazy(() => import('./pages/collector/CollectorDashboard'))
const Tasks = lazy(() => import('./pages/collector/Tasks'))
const TaskDetails = lazy(() => import('./pages/collector/TaskDetails'))

function App() {
  return (
    <Router>
      <AuthProvider>
        <ToastProvider>
          <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900">
            <Navbar />

            <div className="flex-1">
              <Suspense fallback={<Loading fullScreen message="Loading page..." />}>
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />

                  {/* Citizen Routes */}
                  <Route
                    path="/citizen"
                    element={
                      <ProtectedRoute allowedRoles={['citizen', 'admin']}>
                        <CitizenDashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/citizen/report"
                    element={
                      <ProtectedRoute allowedRoles={['citizen', 'admin']}>
                        <ReportWaste />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/citizen/reports"
                    element={
                      <ProtectedRoute allowedRoles={['citizen', 'admin']}>
                        <MyReports />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/citizen/reports/:id"
                    element={
                      <ProtectedRoute allowedRoles={['citizen', 'admin']}>
                        <ReportDetails />
                      </ProtectedRoute>
                    }
                  />

                  {/* Admin Routes */}
                  <Route
                    path="/admin"
                    element={
                      <ProtectedRoute allowedRoles={['admin']}>
                        <AdminDashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/complaints"
                    element={
                      <ProtectedRoute allowedRoles={['admin']}>
                        <Complaints />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/complaints/:id"
                    element={
                      <ProtectedRoute allowedRoles={['admin']}>
                        <ComplaintDetails />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/analytics"
                    element={
                      <ProtectedRoute allowedRoles={['admin']}>
                        <Analytics />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/hotspots"
                    element={
                      <ProtectedRoute allowedRoles={['admin']}>
                        <Hotspots />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/collection"
                    element={
                      <ProtectedRoute allowedRoles={['admin']}>
                        <Collection />
                      </ProtectedRoute>
                    }
                  />

                  {/* Collector Routes */}
                  <Route
                    path="/collector"
                    element={
                      <ProtectedRoute allowedRoles={['collector', 'admin']}>
                        <CollectorDashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/collector/tasks"
                    element={
                      <ProtectedRoute allowedRoles={['collector', 'admin']}>
                        <Tasks />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/collector/tasks/:id"
                    element={
                      <ProtectedRoute allowedRoles={['collector', 'admin']}>
                        <TaskDetails />
                      </ProtectedRoute>
                    }
                  />

                  {/* 404 Route */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </div>

            <Footer />
          </div>
        </ToastProvider>
      </AuthProvider>
    </Router>
  )
}

export default App
