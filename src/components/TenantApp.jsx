import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useTenant } from '../contexts/TenantContext'
import { useAdminAuth } from '../contexts/AdminAuthContext'
import TenantCameraView from './TenantCameraView'
import AdminLogin from './AdminLogin'
import AdminDashboard from './AdminDashboard'
import * as FiIcons from 'react-icons/fi'
import SafeIcon from '../common/SafeIcon'

const { FiCamera } = FiIcons

const TenantApp = () => {
  const { currentTenant, isLoading: tenantLoading } = useTenant()
  const { isAdminAuthenticated, isLoading: authLoading } = useAdminAuth()

  if (tenantLoading || authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Lädt...</p>
        </motion.div>
      </div>
    )
  }

  if (!currentTenant) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center"
        >
          <SafeIcon icon={FiCamera} className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Fahrschule nicht gefunden</h2>
          <p className="text-gray-600 mb-6">
            Diese URL ist nicht mit einer aktiven Fahrschule verknüpft.
          </p>
          <p className="text-sm text-gray-500">
            Bitte überprüfen Sie die URL oder kontaktieren Sie Ihre Fahrschule.
          </p>
        </motion.div>
      </div>
    )
  }

  return (
    <Routes>
      {/* Public selfie camera route */}
      <Route path="/" element={<TenantCameraView />} />
      
      {/* Admin routes */}
      <Route 
        path="/admin" 
        element={isAdminAuthenticated ? <AdminDashboard /> : <AdminLogin />} 
      />
      
      {/* Fallback for any other routes */}
      <Route path="/*" element={<TenantCameraView />} />
    </Routes>
  )
}

export default TenantApp