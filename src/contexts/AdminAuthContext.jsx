import React, { createContext, useContext, useState, useEffect } from 'react'
import { useTenant } from './TenantContext'

const AdminAuthContext = createContext()

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext)
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider')
  }
  return context
}

export const AdminAuthProvider = ({ children }) => {
  const { currentTenant } = useTenant()
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false)
  const [adminUser, setAdminUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for stored admin session
    const storedAdmin = localStorage.getItem(`admin_session_${currentTenant?.id}`)
    if (storedAdmin && currentTenant) {
      try {
        const adminData = JSON.parse(storedAdmin)
        const expiryTime = new Date(adminData.expiresAt)
        
        if (expiryTime > new Date()) {
          setIsAdminAuthenticated(true)
          setAdminUser(adminData.admin)
        } else {
          localStorage.removeItem(`admin_session_${currentTenant.id}`)
        }
      } catch (error) {
        localStorage.removeItem(`admin_session_${currentTenant?.id}`)
      }
    }
    setIsLoading(false)
  }, [currentTenant])

  const adminLogin = async (email, password) => {
    try {
      // In production, this would authenticate against Supabase
      // For demo, use tenant email and a default password
      if (!currentTenant) {
        return { success: false, error: 'Fahrschule nicht gefunden' }
      }

      const validEmail = currentTenant.email
      const validPassword = 'admin123' // In production, this would be hashed

      if (email === validEmail && password === validPassword) {
        const adminData = {
          id: currentTenant.id,
          email: email,
          tenantId: currentTenant.id,
          tenantName: currentTenant.name,
          role: 'admin'
        }

        const sessionData = {
          admin: adminData,
          expiresAt: new Date(Date.now() + 8 * 60 * 60 * 1000) // 8 hours
        }

        localStorage.setItem(`admin_session_${currentTenant.id}`, JSON.stringify(sessionData))
        setIsAdminAuthenticated(true)
        setAdminUser(adminData)

        return { success: true, admin: adminData }
      } else {
        return { success: false, error: 'Ungültige Anmeldedaten' }
      }
    } catch (error) {
      return { success: false, error: 'Anmeldung fehlgeschlagen' }
    }
  }

  const adminLogout = () => {
    if (currentTenant) {
      localStorage.removeItem(`admin_session_${currentTenant.id}`)
    }
    setIsAdminAuthenticated(false)
    setAdminUser(null)
  }

  const value = {
    isAdminAuthenticated,
    adminUser,
    isLoading,
    adminLogin,
    adminLogout
  }

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  )
}