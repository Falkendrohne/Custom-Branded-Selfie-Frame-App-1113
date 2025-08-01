import React from 'react'
import {HashRouter as Router,Routes,Route} from 'react-router-dom'
import {TenantProvider} from './contexts/TenantContext'
import {AdminAuthProvider} from './contexts/AdminAuthContext'
import {AuthProvider} from './contexts/AuthContext'
import TenantApp from './components/TenantApp'
import Navigation from './components/Navigation'
import CameraView from './components/CameraView'
import GetStartedView from './components/GetStartedView'
import AdminPanel from './components/AdminPanel'
import UserRoleManagement from './components/UserRoleManagement'
import ProtectedRoute from './components/ProtectedRoute'
import './App.css'

function App() {
  // Check if we're in tenant mode (subdomain or path-based)
  const hostname = window.location.hostname
  const pathname = window.location.pathname
  
  let isTenantMode = false
  
  // Check for subdomain (fahrschule.yourdomain.com)
  if (hostname.includes('.') && !hostname.startsWith('www.')) {
    isTenantMode = true
  }
  
  // Check for path-based tenant (yourdomain.com/fahrschule)
  const pathSegments = pathname.split('/').filter(Boolean)
  if (pathSegments.length > 0 && pathSegments[0] !== 'admin' && pathSegments[0] !== 'demo') {
    isTenantMode = true
  }

  // If tenant mode, render tenant app
  if (isTenantMode) {
    return (
      <TenantProvider>
        <AdminAuthProvider>
          <Router>
            <div className="min-h-screen">
              <Routes>
                <Route path="/*" element={<TenantApp />} />
              </Routes>
            </div>
          </Router>
        </AdminAuthProvider>
      </TenantProvider>
    )
  }

  // Default app with full functionality
  return (
    <AuthProvider>
      <Router>
        <div className="app-container">
          <Navigation />
          <Routes>
            <Route 
              path="/" 
              element={
                <ProtectedRoute permission="camera.use">
                  <CameraView />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/get-started" 
              element={<GetStartedView />} 
            />
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute permission="settings.view">
                  <AdminPanel />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/users" 
              element={
                <ProtectedRoute permission="users.view">
                  <UserRoleManagement />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App