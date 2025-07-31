import React, { useState } from 'react'
import { motion } from 'framer-motion'
import * as FiIcons from 'react-icons/fi'
import SafeIcon from '../common/SafeIcon'
import { useTenant } from '../contexts/TenantContext'
import { formatDistanceToNow } from 'date-fns'
import { de } from 'date-fns/locale'

const { 
  FiCreditCard, FiCheck, FiX, FiCalendar, FiDollarSign, 
  FiAlertTriangle, FiCheckCircle, FiClock 
} = FiIcons

const SubscriptionManager = () => {
  const { 
    currentTenant, 
    updateSubscription, 
    isSubscriptionActive, 
    getDaysUntilExpiry, 
    SUBSCRIPTION_PLANS 
  } = useTenant()
  
  const [isChangingPlan, setIsChangingPlan] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState(null)

  const handlePlanChange = async (planId) => {
    if (planId === currentTenant.subscription.plan.id) return
    
    setIsChangingPlan(true)
    try {
      const result = await updateSubscription(planId)
      if (result.success) {
        alert('Tarif erfolgreich geändert!')
        setSelectedPlan(null)
      } else {
        alert('Fehler beim Ändern des Tarifs: ' + result.error)
      }
    } catch (error) {
      alert('Ein Fehler ist aufgetreten')
    } finally {
      setIsChangingPlan(false)
    }
  }

  const getStatusColor = () => {
    if (!isSubscriptionActive()) return 'text-red-600'
    
    const daysLeft = getDaysUntilExpiry()
    if (daysLeft <= 7) return 'text-yellow-600'
    return 'text-green-600'
  }

  const getStatusIcon = () => {
    if (!isSubscriptionActive()) return FiX
    
    const daysLeft = getDaysUntilExpiry()
    if (daysLeft <= 7) return FiAlertTriangle
    return FiCheckCircle
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Abonnement verwalten</h2>
        <p className="text-gray-600 mt-1">
          Übersicht und Verwaltung Ihres Abonnements
        </p>
      </div>

      {/* Current Subscription Status */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold">Aktuelles Abonnement</h3>
              <p className="opacity-90">Status und Details</p>
            </div>
            <SafeIcon icon={FiCreditCard} className="w-8 h-8" />
          </div>
        </div>

        <div className="p-6 space-y-4">
          {/* Status */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <SafeIcon icon={getStatusIcon()} className={`w-6 h-6 ${getStatusColor()}`} />
              <div>
                <div className="font-semibold text-gray-800">
                  {isSubscriptionActive() ? 'Aktiv' : 'Abgelaufen'}
                </div>
                <div className="text-sm text-gray-600">
                  {isSubscriptionActive() 
                    ? `Läuft ab in ${getDaysUntilExpiry()} Tagen`
                    : 'Abonnement ist abgelaufen'
                  }
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="font-bold text-2xl text-gray-800">
                {currentTenant.subscription.plan.name}
              </div>
              <div className="text-sm text-gray-600">
                €{currentTenant.subscription.plan.price}/{currentTenant.subscription.plan.interval === 'month' ? 'Monat' : 'Jahr'}
              </div>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <SafeIcon icon={FiCalendar} className="w-6 h-6 text-blue-600 mx-auto mb-2" />
              <div className="font-medium text-gray-800">Nächste Abrechnung</div>
              <div className="text-sm text-gray-600">
                {new Date(currentTenant.subscription.currentPeriodEnd).toLocaleDateString('de-DE')}
              </div>
            </div>

            <div className="text-center p-4 bg-green-50 rounded-lg">
              <SafeIcon icon={FiDollarSign} className="w-6 h-6 text-green-600 mx-auto mb-2" />
              <div className="font-medium text-gray-800">Monatliche Kosten</div>
              <div className="text-sm text-gray-600">
                €{currentTenant.subscription.plan.interval === 'year' 
                  ? Math.round(currentTenant.subscription.plan.price / 12) 
                  : currentTenant.subscription.plan.price
                }
              </div>
            </div>

            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <SafeIcon icon={FiClock} className="w-6 h-6 text-purple-600 mx-auto mb-2" />
              <div className="font-medium text-gray-800">Kunde seit</div>
              <div className="text-sm text-gray-600">
                {formatDistanceToNow(new Date(currentTenant.subscription.createdAt), { 
                  addSuffix: true, 
                  locale: de 
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Plan Options */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-xl font-bold text-gray-800">Verfügbare Tarife</h3>
          <p className="text-gray-600 mt-1">
            Wählen Sie den passenden Tarif für Ihre Fahrschule
          </p>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.values(SUBSCRIPTION_PLANS).map((plan) => (
              <motion.div
                key={plan.id}
                className={`relative border-2 rounded-xl p-6 cursor-pointer transition-all ${
                  currentTenant.subscription.plan.id === plan.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-300'
                }`}
                whileHover={{ scale: 1.02 }}
                onClick={() => setSelectedPlan(plan)}
              >
                {/* Current Plan Badge */}
                {currentTenant.subscription.plan.id === plan.id && (
                  <div className="absolute -top-3 left-6">
                    <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                      Aktueller Tarif
                    </span>
                  </div>
                )}

                {/* Popular Badge for Yearly */}
                {plan.id === 'yearly' && (
                  <div className="absolute -top-3 right-6">
                    <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                      Beliebt
                    </span>
                  </div>
                )}

                <div className="text-center">
                  <h4 className="text-2xl font-bold text-gray-800 mb-2">{plan.name}</h4>
                  <div className="text-4xl font-bold text-blue-600 mb-2">
                    €{plan.price}
                  </div>
                  <div className="text-gray-600 mb-4">
                    pro {plan.interval === 'month' ? 'Monat' : 'Jahr'}
                  </div>
                  
                  {plan.id === 'yearly' && (
                    <div className="text-sm text-green-600 font-medium mb-4">
                      Sparen Sie €{(SUBSCRIPTION_PLANS.MONTHLY.price * 12) - plan.price} pro Jahr!
                    </div>
                  )}

                  <div className="text-gray-600 text-sm mb-6">
                    {plan.description}
                  </div>

                  {/* Features */}
                  <div className="space-y-2 mb-6">
                    {[
                      'Unbegrenzte Selfies',
                      'Eigene Rahmen hochladen',
                      'Logo-Integration',
                      'Text-Overlay',
                      'Anpassbare Farben',
                      'E-Mail Support'
                    ].map((feature) => (
                      <div key={feature} className="flex items-center justify-center space-x-2">
                        <SafeIcon icon={FiCheck} className="w-4 h-4 text-green-500" />
                        <span className="text-sm text-gray-600">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {currentTenant.subscription.plan.id !== plan.id && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handlePlanChange(plan.id)
                      }}
                      disabled={isChangingPlan}
                      className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                    >
                      {isChangingPlan ? 'Wird geändert...' : 'Wechseln'}
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Billing Information */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-xl font-bold text-gray-800">Rechnungsinformationen</h3>
        </div>

        <div className="p-6">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <SafeIcon icon={FiAlertTriangle} className="w-5 h-5 text-yellow-600" />
              <span className="font-medium text-yellow-800">Demo-Modus</span>
            </div>
            <p className="text-yellow-700 mt-2">
              Dies ist eine Demo-Version. In der Produktionsversion würden hier echte Zahlungsinformationen 
              und Rechnungen angezeigt werden.
            </p>
          </div>
        </div>
      </div>

      {/* Support Contact */}
      <div className="bg-gray-50 rounded-xl p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Benötigen Sie Hilfe?</h3>
        <p className="text-gray-600 mb-4">
          Unser Support-Team hilft Ihnen gerne bei Fragen zu Ihrem Abonnement.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <a
            href="mailto:support@selfie-app.de"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors text-center"
          >
            E-Mail Support
          </a>
          <a
            href="tel:+4912345678"
            className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors text-center"
          >
            Telefon: +49 123 456 78
          </a>
        </div>
      </div>
    </div>
  )
}

export default SubscriptionManager