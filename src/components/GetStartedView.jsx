import React from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiCamera, FiUsers, FiSettings, FiCreditCard, FiCheck, FiArrowRight } = FiIcons;

const GetStartedView = () => {
  const features = [
    {
      icon: FiCamera,
      title: 'Professionelle Selfie-App',
      description: 'Ihre Fahrschüler können hochwertige Selfies mit individuellen Rahmen erstellen'
    },
    {
      icon: FiSettings,
      title: 'Vollständig anpassbar',
      description: 'Logo, Farben, Rahmen und Text-Overlays nach Ihren Wünschen konfigurieren'
    },
    {
      icon: FiUsers,
      title: 'Einfache Nutzung',
      description: 'Keine Registrierung für Fahrschüler - einfach URL öffnen und loslegen'
    },
    {
      icon: FiCreditCard,
      title: 'Flexible Preise',
      description: 'Monatlich €67 oder jährlich €479 (2 Monate gratis)'
    }
  ];

  const steps = [
    'Registrieren Sie sich für einen Account',
    'Wählen Sie Ihren gewünschten Tarif',
    'Passen Sie Ihre App individuell an',
    'Teilen Sie die URL mit Ihren Fahrschülern'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-6">
              Selfie-App für
              <span className="text-blue-600"> Fahrschulen</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Bieten Sie Ihren Fahrschülern eine professionelle Selfie-Erfahrung mit 
              individuellen Rahmen, Ihrem Logo und perfekter Integration in Ihr Corporate Design.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                className="bg-blue-600 text-white px-8 py-4 rounded-full text-lg font-semibold shadow-lg hover:bg-blue-700 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Jetzt starten
              </motion.button>
              <motion.button
                className="border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-full text-lg font-semibold hover:bg-blue-50 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Demo ansehen
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Warum unsere Selfie-App?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Perfekt zugeschnitten auf die Bedürfnisse von Fahrschulen
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-center p-6 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <SafeIcon icon={feature.icon} className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* How it works */}
      <div className="py-24 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              So einfach geht's
            </h2>
            <p className="text-xl text-gray-600">
              In wenigen Schritten zur eigenen Selfie-App
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center mb-8 last:mb-0"
              >
                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg mr-6 flex-shrink-0">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <p className="text-lg text-gray-800">{step}</p>
                </div>
                {index < steps.length - 1 && (
                  <SafeIcon icon={FiArrowRight} className="w-6 h-6 text-blue-600 ml-4" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Pricing */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Transparente Preise
            </h2>
            <p className="text-xl text-gray-600">
              Wählen Sie den passenden Tarif für Ihre Fahrschule
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Monthly Plan */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white border-2 border-gray-200 rounded-2xl p-8 text-center hover:border-blue-300 transition-colors"
            >
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Monatlich</h3>
              <div className="text-5xl font-bold text-blue-600 mb-2">€67</div>
              <div className="text-gray-600 mb-8">pro Monat</div>
              
              <ul className="space-y-3 mb-8">
                {[
                  'Unbegrenzte Selfies',
                  'Eigene Rahmen hochladen',
                  'Logo-Integration',
                  'Anpassbare Farben',
                  'E-Mail Support'
                ].map((feature, index) => (
                  <li key={index} className="flex items-center justify-center">
                    <SafeIcon icon={FiCheck} className="w-5 h-5 text-green-500 mr-2" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                Monatlich starten
              </button>
            </motion.div>

            {/* Yearly Plan */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-blue-600 text-white rounded-2xl p-8 text-center relative overflow-hidden"
            >
              <div className="absolute top-4 right-4 bg-yellow-400 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                Beliebt
              </div>
              
              <h3 className="text-2xl font-bold mb-4">Jährlich</h3>
              <div className="text-5xl font-bold mb-2">€479</div>
              <div className="opacity-90 mb-2">pro Jahr</div>
              <div className="text-yellow-300 text-sm mb-8">Sparen Sie €325 pro Jahr!</div>
              
              <ul className="space-y-3 mb-8">
                {[
                  'Unbegrenzte Selfies',
                  'Eigene Rahmen hochladen',
                  'Logo-Integration',
                  'Anpassbare Farben',
                  'E-Mail Support',
                  '2 Monate gratis'
                ].map((feature, index) => (
                  <li key={index} className="flex items-center justify-center">
                    <SafeIcon icon={FiCheck} className="w-5 h-5 text-yellow-300 mr-2" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <button className="w-full bg-white text-blue-600 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                Jährlich starten
              </button>
            </motion.div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-24 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Bereit für Ihre eigene Selfie-App?
            </h2>
            <p className="text-xl opacity-90 mb-8">
              Starten Sie noch heute und begeistern Sie Ihre Fahrschüler
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-blue-600 px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-100 transition-colors">
                Kostenlos testen
              </button>
              <button className="border-2 border-white text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors">
                Kontakt aufnehmen
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default GetStartedView;