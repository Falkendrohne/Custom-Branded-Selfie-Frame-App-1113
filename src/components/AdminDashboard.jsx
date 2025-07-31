import React, { useState } from 'react'
import { motion } from 'framer-motion'
import * as FiIcons from 'react-icons/fi'
import SafeIcon from '../common/SafeIcon'
import { useAdminAuth } from '../contexts/AdminAuthContext'
import { useTenant } from '../contexts/TenantContext'
import AdminSettings from './AdminSettings'
import SubscriptionManager from './SubscriptionManager'
import { formatDistanceToNow } from 'date-fns'
import { de } from 'date-fns/locale'

const { 
  FiSettings, FiCreditCard, FiUsers, FiCamera, FiLogOut, 
  FiBarChart3, FiCalendar, FiCheckCircle, FiAlertCircle 
} = FiIcons

const AdminDashboard = () => {
  const { adminLogout, adminUser } = useAdminAuth()
  const { currentTenant, isSubscriptionActive, getDaysUntilExpiry } = useTenant()
  const [activeTab, setActiveTab] = useState('overview')

  const tabs = [
    { id: 'overview', label: 'Übersicht', icon: FiBarChart3 },
    { id: 'settings', label: 'App-Einstellungen', icon: FiSettings },
    { id: 'subscription', label: 'Abonnement', icon: FiCreditCard }
  ]

  const handleLogout = () => {
    adminLogout()
  }

  const getSubscriptionStatusColor = () => {
    if (!isSubscriptionActive()) return 'text-red-600 bg-red-100'
    
    const daysLeft = getDaysUntilExpiry()
    if (daysLeft <= 7) return 'text-yellow-600 bg-yellow-100'
    return 'text-green-600 bg-green-100'
  }

  const renderOverviewTab = () => (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl p-6">
        <h2 className="text-2xl font-bold mb-2">Willkommen, {currentTenant.name}!</h2>
        <p className="opacity-90">
          Verwalten Sie Ihre Selfie-App und überwachen Sie Ihr Abonnement.
        </p>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Subscription Status */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-800">Abonnement-Status</h3>
            <SafeIcon icon={FiCreditCard} className="w-5 h-5 text-blue-600" />
          </div>
          <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getSubscriptionStatusColor()}`}>
            <SafeIcon 
              icon={isSubscriptionActive() ? FiCheckCircle : FiAlertCircle} 
              className="w-4 h-4 mr-2" 
            />
            {isSubscriptionActive() ? 'Aktiv' : 'Abgelaufen'}
          </div>
          {isSubscriptionActive() && (
            <p className="text-sm text-gray-600 mt-2">
              Läuft ab in {getDaysUntilExpiry()} Tagen
            </p>
          )}
        </div>

        {/* Current Plan */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-800">Aktueller Tarif</h3>
            <SafeIcon icon={FiCalendar} className="w-5 h-5 text-green-600" />
          </div>
          <div className="text-2xl font-bold text-gray-800">
            {currentTenant.subscription.plan.name}
          </div>
          <p className="text-sm text-gray-600">
            €{currentTenant.subscription.plan.price}/{currentTenant.subscription.plan.interval === 'month' ? 'Monat' : 'Jahr'}
          </p>
        </div>

        {/* Account Info */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-800">Konto erstellt</h3>
            <SafeIcon icon={FiUsers} className="w-5 h-5 text-purple-600" />
          </div>
          <div className="text-sm text-gray-600">
            {formatDistanceToNow(new Date(currentTenant.createdAt), { 
              addSuffix: true, 
              locale: de 
            })}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="font-semibold text-gray-800 mb-4">Schnellzugriff</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => setActiveTab('settings')}
            className="flex items-center p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
          >
            <SafeIcon icon={FiSettings} className="w-6 h-6 text-blue-600 mr-3" />
            <div className="text-left">
              <div className="font-medium text-gray-800">App konfigurieren</div>
              <div className="text-sm text-gray-600">Rahmen, Logo und Einstellungen anpassen</div>
            </div>
          </button>
          
          <button
            onClick={() => setActiveTab('subscription')}
            className="flex items-center p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
          >
            <SafeIcon icon={FiCreditCard} className="w-6 h-6 text-green-600 mr-3" />
            <div className="text-left">
              <div className="font-medium text-gray-800">Abonnement verwalten</div>
              <div className="text-sm text-gray-600">Tarif ändern oder kündigen</div>
            </div>
          </button>
        </div>
      </div>

      {/* App URL */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="font-semibold text-gray-800 mb-4">Ihre Selfie-App URL</h3>
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <code className="text-blue-600 font-mono">
              {window.location.origin}/{currentTenant.slug}
            </code>
            <button
              onClick={() => {
                navigator.clipboard.writeText(`${window.location.origin}/${currentTenant.slug}`)
                alert('URL kopiert!')
              }}
              className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors"
            >
              Kopieren
            </button>
          </div>
        </div>
        <p className="text-sm text-gray-600 mt-2">
          Teilen Sie diese URL mit Ihren Fahrschülern, damit sie Selfies machen können.
        </p>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div 
        className="text-white shadow-lg"
        style={{ 
          background: `linear-gradient(135deg, ${currentTenant.settings.primaryColor} 0%, ${currentTenant.settings.secondaryColor} 100%)` 
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <SafeIcon icon={FiCamera} className="w-8 h-8" />
              <div>
                <h1 className="text-xl font-bold">{currentTenant.name}</h1>
                <p className="text-sm opacity-90">Admin-Dashboard</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-sm font-medium">{adminUser.email}</div>
                <div className="text-xs opacity-90">Administrator</div>
              </div>
              <button
                onClick={handleLogout}
                className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
              >
                <SafeIcon icon={FiLogOut} className="w-4 h-4" />
                <span>Abmelden</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <SafeIcon icon={tab.icon} className="w-5 h-5" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'overview' && renderOverviewTab()}
          {activeTab === 'settings' && <AdminSettings />}
          {activeTab === 'subscription' && <SubscriptionManager />}
        </motion.div>
      </div>
    </div>
  )
}

export default AdminDashboard