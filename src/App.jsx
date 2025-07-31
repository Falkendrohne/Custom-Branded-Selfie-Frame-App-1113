import React from 'react'
import { HashRouter as Router, Routes, Route } from 'react-router-dom'
import { TenantProvider } from './contexts/TenantContext'
import { AdminAuthProvider } from './contexts/AdminAuthContext'
import TenantApp from './components/TenantApp'
import './App.css'

function App() {
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

export default App