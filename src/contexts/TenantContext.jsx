import React, { createContext, useContext, useState, useEffect } from 'react'
import supabase from '../lib/supabase'

const TenantContext = createContext()

export const useTenant = () => {
  const context = useContext(TenantContext)
  if (!context) {
    throw new Error('useTenant must be used within a TenantProvider')
  }
  return context
}

// Subscription plans
export const SUBSCRIPTION_PLANS = {
  MONTHLY: {
    id: 'monthly',
    name: 'Monatlich',
    price: 67,
    interval: 'month',
    description: 'Monatliche Abrechnung'
  },
  YEARLY: {
    id: 'yearly',
    name: 'Jährlich',
    price: 479,
    interval: 'year',
    description: 'Jährliche Abrechnung (2 Monate gratis)'
  }
}

export const TenantProvider = ({ children }) => {
  const [currentTenant, setCurrentTenant] = useState(null)
  const [tenantConfig, setTenantConfig] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [tenantSlug, setTenantSlug] = useState(null)

  useEffect(() => {
    // Extract tenant slug from URL
    const hostname = window.location.hostname
    const pathname = window.location.pathname
    
    // Support subdomain: fahrschule.yourdomain.com
    // Or path-based: yourdomain.com/fahrschule
    let slug = null
    
    if (hostname.includes('.') && !hostname.startsWith('www.')) {
      // Subdomain approach
      slug = hostname.split('.')[0]
    } else {
      // Path-based approach
      const pathSegments = pathname.split('/').filter(Boolean)
      if (pathSegments.length > 0) {
        slug = pathSegments[0]
      }
    }

    if (slug && slug !== 'admin' && slug !== 'demo') {
      setTenantSlug(slug)
      loadTenant(slug)
    } else {
      // Demo mode for development
      loadDemoTenant()
    }
  }, [])

  const loadTenant = async (slug) => {
    try {
      setIsLoading(true)
      
      // In production, this would query Supabase
      // For now, use demo data
      const demoTenant = {
        id: 'tenant_1',
        slug: slug,
        name: `Fahrschule ${slug.charAt(0).toUpperCase() + slug.slice(1)}`,
        email: `info@${slug}.de`,
        phone: '+49 123 456789',
        address: 'Musterstraße 123, 12345 Musterstadt',
        subscription: {
          plan: SUBSCRIPTION_PLANS.YEARLY,
          status: 'active',
          currentPeriodEnd: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
          createdAt: new Date('2024-01-01')
        },
        settings: {
          primaryColor: '#1E40AF',
          secondaryColor: '#F59E0B',
          logo: {
            url: 'https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=200&h=80&fit=crop',
            position: 'top-center',
            size: 'medium'
          },
          textOverlay: {
            enabled: true,
            text: `www.${slug}.de`,
            useLocation: false,
            position: 'bottom',
            fontSize: 'medium',
            colorScheme: 'primary'
          },
          frames: [
            { 
              id: 0, 
              name: 'Kein Rahmen', 
              url: null, 
              isDefault: true,
              isActive: true 
            },
            {
              id: 1,
              name: 'Führerschein Classic',
              url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=600&fit=crop',
              isDefault: false,
              isActive: true
            },
            {
              id: 2,
              name: 'Moderne Fahrschule',
              url: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=600&fit=crop',
              isDefault: false,
              isActive: true
            }
          ]
        },
        isActive: true,
        createdAt: new Date('2024-01-01')
      }

      setCurrentTenant(demoTenant)
      setTenantConfig(demoTenant.settings)
    } catch (error) {
      console.error('Error loading tenant:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const loadDemoTenant = () => {
    const demoTenant = {
      id: 'demo',
      slug: 'demo',
      name: 'Demo Fahrschule',
      email: 'demo@fahrschule.de',
      phone: '+49 123 456789',
      address: 'Demo Straße 1, 12345 Demo Stadt',
      subscription: {
        plan: SUBSCRIPTION_PLANS.MONTHLY,
        status: 'trial',
        currentPeriodEnd: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        createdAt: new Date()
      },
      settings: {
        primaryColor: '#8B0000',
        secondaryColor: '#FEA400',
        logo: {
          url: 'https://www.falkendrohne.de/selfie/leander.png?text=LOGO',
          position: 'top-center',
          size: 'medium'
        },
        textOverlay: {
          enabled: false,
          text: 'www.demo-fahrschule.de',
          useLocation: false,
          position: 'bottom',
          fontSize: 'medium',
          colorScheme: 'primary'
        },
        frames: [
          { 
            id: 0, 
            name: 'Kein Rahmen', 
            url: null, 
            isDefault: true,
            isActive: true 
          },
          {
            id: 1,
            name: 'Klassisch',
            url: 'https://www.falkendrohne.de/selfie/rahmen3.png?w=400&h=600&fit=crop&crop=center',
            isDefault: false,
            isActive: true
          },
          {
            id: 2,
            name: 'Modern',
            url: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=600&fit=crop&crop=center',
            isDefault: false,
            isActive: true
          }
        ]
      },
      isActive: true,
      createdAt: new Date()
    }

    setCurrentTenant(demoTenant)
    setTenantConfig(demoTenant.settings)
    setIsLoading(false)
  }

  const updateTenantConfig = async (newConfig) => {
    try {
      // In production, this would update Supabase
      const updatedTenant = {
        ...currentTenant,
        settings: { ...currentTenant.settings, ...newConfig }
      }
      
      setCurrentTenant(updatedTenant)
      setTenantConfig(updatedTenant.settings)
      
      return { success: true }
    } catch (error) {
      console.error('Error updating tenant config:', error)
      return { success: false, error: error.message }
    }
  }

  const updateSubscription = async (planId) => {
    try {
      const plan = Object.values(SUBSCRIPTION_PLANS).find(p => p.id === planId)
      if (!plan) throw new Error('Invalid plan')

      const updatedTenant = {
        ...currentTenant,
        subscription: {
          ...currentTenant.subscription,
          plan: plan,
          status: 'active',
          currentPeriodEnd: new Date(Date.now() + (plan.interval === 'year' ? 365 : 30) * 24 * 60 * 60 * 1000)
        }
      }

      setCurrentTenant(updatedTenant)
      return { success: true }
    } catch (error) {
      console.error('Error updating subscription:', error)
      return { success: false, error: error.message }
    }
  }

  const isSubscriptionActive = () => {
    if (!currentTenant?.subscription) return false
    
    const { status, currentPeriodEnd } = currentTenant.subscription
    return status === 'active' && new Date(currentPeriodEnd) > new Date()
  }

  const getDaysUntilExpiry = () => {
    if (!currentTenant?.subscription?.currentPeriodEnd) return 0
    
    const expiryDate = new Date(currentTenant.subscription.currentPeriodEnd)
    const today = new Date()
    const diffTime = expiryDate - today
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }

  const value = {
    currentTenant,
    tenantConfig,
    tenantSlug,
    isLoading,
    updateTenantConfig,
    updateSubscription,
    isSubscriptionActive,
    getDaysUntilExpiry,
    SUBSCRIPTION_PLANS
  }

  return (
    <TenantContext.Provider value={value}>
      {children}
    </TenantContext.Provider>
  )
}