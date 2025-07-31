import React, { useState } from 'react'
import { motion } from 'framer-motion'
import * as FiIcons from 'react-icons/fi'
import SafeIcon from '../common/SafeIcon'
import { useTenant } from '../contexts/TenantContext'

const { 
  FiSettings, FiImage, FiUpload, FiTrash2, FiSave, FiType, FiMapPin, FiEye 
} = FiIcons

const AdminSettings = () => {
  const { currentTenant, tenantConfig, updateTenantConfig } = useTenant()
  const [activeTab, setActiveTab] = useState('frames')
  const [isSaving, setIsSaving] = useState(false)

  const [newFrame, setNewFrame] = useState({ name: '', url: '' })
  const [logoSettings, setLogoSettings] = useState(tenantConfig?.logo || {})
  const [textOverlaySettings, setTextOverlaySettings] = useState(tenantConfig?.textOverlay || {})
  const [businessSettings, setBusinessSettings] = useState({
    primaryColor: currentTenant?.settings?.primaryColor || '#1E40AF',
    secondaryColor: currentTenant?.settings?.secondaryColor || '#F59E0B'
  })

  const tabs = [
    { id: 'frames', label: 'Rahmen', icon: FiImage },
    { id: 'logo', label: 'Logo', icon: FiUpload },
    { id: 'textOverlay', label: 'Text Overlay', icon: FiType },
    { id: 'design', label: 'Design', icon: FiSettings }
  ]

  const addFrame = async () => {
    if (newFrame.name && newFrame.url) {
      const frame = {
        id: Date.now(),
        name: newFrame.name,
        url: newFrame.url,
        isDefault: false,
        isActive: true
      }

      const updatedFrames = [...(tenantConfig.frames || []), frame]
      await updateTenantConfig({ frames: updatedFrames })
      setNewFrame({ name: '', url: '' })
    }
  }

  const removeFrame = async (frameId) => {
    const updatedFrames = tenantConfig.frames.filter(f => f.id !== frameId)
    await updateTenantConfig({ frames: updatedFrames })
  }

  const setDefaultFrame = async (frameId) => {
    const updatedFrames = tenantConfig.frames.map(f => ({
      ...f,
      isDefault: f.id === frameId
    }))
    await updateTenantConfig({ frames: updatedFrames })
  }

  const updateLogo = async () => {
    setIsSaving(true)
    await updateTenantConfig({ logo: logoSettings })
    setIsSaving(false)
  }

  const updateTextOverlay = async () => {
    setIsSaving(true)
    await updateTenantConfig({ textOverlay: textOverlaySettings })
    setIsSaving(false)
  }

  const updateBusinessSettings = async () => {
    setIsSaving(true)
    await updateTenantConfig(businessSettings)
    setIsSaving(false)
  }

  const renderFramesTab = () => (
    <div className="space-y-6">
      {/* Add New Frame */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="font-semibold text-gray-800 mb-4">Neuen Rahmen hinzufügen</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Rahmen Name"
            value={newFrame.name}
            onChange={(e) => setNewFrame(prev => ({ ...prev, name: e.target.value }))}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <input
            type="url"
            placeholder="Rahmen URL (PNG mit transparenter Mitte)"
            value={newFrame.url}
            onChange={(e) => setNewFrame(prev => ({ ...prev, url: e.target.value }))}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <button
          onClick={addFrame}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <SafeIcon icon={FiUpload} className="w-4 h-4" />
          <span>Rahmen hinzufügen</span>
        </button>
      </div>

      {/* Existing Frames */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tenantConfig?.frames?.map((frame) => (
          <motion.div
            key={frame.id}
            className="bg-white rounded-lg shadow-md overflow-hidden"
            whileHover={{ scale: 1.02 }}
          >
            <div className="aspect-[3/4] bg-gray-100">
              {frame.url ? (
                <img
                  src={frame.url}
                  alt={frame.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-500">
                  Kein Rahmen
                </div>
              )}
            </div>
            <div className="p-4">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-semibold text-gray-800">{frame.name}</h4>
                {frame.isDefault && (
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                    Standard
                  </span>
                )}
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setDefaultFrame(frame.id)}
                  className="flex-1 bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors"
                >
                  Standard
                </button>
                {frame.id !== 0 && (
                  <button
                    onClick={() => removeFrame(frame.id)}
                    className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition-colors"
                  >
                    <SafeIcon icon={FiTrash2} className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )

  const renderLogoTab = () => (
    <div className="space-y-6">
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="font-semibold text-gray-800 mb-4">Logo-Einstellungen</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Logo URL
            </label>
            <input
              type="url"
              value={logoSettings.url || ''}
              onChange={(e) => setLogoSettings(prev => ({ ...prev, url: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="https://example.com/logo.png"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Logo-Größe
              </label>
              <select
                value={logoSettings.size || 'medium'}
                onChange={(e) => setLogoSettings(prev => ({ ...prev, size: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="small">Klein</option>
                <option value="medium">Mittel</option>
                <option value="large">Groß</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Position
              </label>
              <select
                value={logoSettings.position || 'top-center'}
                onChange={(e) => setLogoSettings(prev => ({ ...prev, position: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="top-center">Oben Mitte</option>
                <option value="top-left">Oben Links</option>
                <option value="top-right">Oben Rechts</option>
                <option value="bottom-center">Unten Mitte</option>
              </select>
            </div>
          </div>

          <button
            onClick={updateLogo}
            disabled={isSaving}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 disabled:opacity-50"
          >
            <SafeIcon icon={FiSave} className="w-4 h-4" />
            <span>{isSaving ? 'Speichert...' : 'Logo speichern'}</span>
          </button>
        </div>

        {/* Logo Preview */}
        {logoSettings.url && (
          <div className="mt-6 p-4 bg-white rounded-lg border">
            <h4 className="font-medium text-gray-800 mb-2">Vorschau</h4>
            <div className="flex justify-center">
              <img
                src={logoSettings.url}
                alt="Logo preview"
                className={`object-contain ${
                  logoSettings.size === 'small' ? 'h-8' : 
                  logoSettings.size === 'large' ? 'h-16' : 'h-12'
                }`}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )

  const renderTextOverlayTab = () => (
    <div className="space-y-6">
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="font-semibold text-gray-800 mb-4">Text Overlay Einstellungen</h3>
        <div className="space-y-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="enableTextOverlay"
              checked={textOverlaySettings.enabled || false}
              onChange={(e) => setTextOverlaySettings(prev => ({ ...prev, enabled: e.target.checked }))}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="enableTextOverlay" className="ml-2 block text-sm text-gray-700">
              Text Overlay aktivieren
            </label>
          </div>

          {textOverlaySettings.enabled && (
            <div className="space-y-4 pl-6 border-l-2 border-blue-200">
              <div>
                <input
                  type="text"
                  value={textOverlaySettings.text || ''}
                  onChange={(e) => setTextOverlaySettings(prev => ({ ...prev, text: e.target.value }))}
                  placeholder="z.B. www.ihre-fahrschule.de"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Position
                  </label>
                  <select
                    value={textOverlaySettings.position || 'bottom'}
                    onChange={(e) => setTextOverlaySettings(prev => ({ ...prev, position: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="top">Oben</option>
                    <option value="bottom">Unten</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Schriftgröße
                  </label>
                  <select
                    value={textOverlaySettings.fontSize || 'medium'}
                    onChange={(e) => setTextOverlaySettings(prev => ({ ...prev, fontSize: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="small">Klein</option>
                    <option value="medium">Mittel</option>
                    <option value="large">Groß</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Farbschema
                  </label>
                  <select
                    value={textOverlaySettings.colorScheme || 'primary'}
                    onChange={(e) => setTextOverlaySettings(prev => ({ ...prev, colorScheme: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="primary">Ihre Farben</option>
                    <option value="blackwhite">Schwarz & Weiß</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          <button
            onClick={updateTextOverlay}
            disabled={isSaving}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 disabled:opacity-50"
          >
            <SafeIcon icon={FiSave} className="w-4 h-4" />
            <span>{isSaving ? 'Speichert...' : 'Text-Einstellungen speichern'}</span>
          </button>
        </div>

        {/* Text Preview */}
        {textOverlaySettings.enabled && textOverlaySettings.text && (
          <div className="mt-6 p-4 bg-white rounded-lg border">
            <h4 className="font-medium text-gray-800 mb-2">Vorschau</h4>
            <div className="relative w-full h-16 flex items-center justify-center">
              <div
                className={`px-4 py-1 rounded-lg ${
                  textOverlaySettings.fontSize === 'small' ? 'text-sm' : 
                  textOverlaySettings.fontSize === 'large' ? 'text-xl' : 'text-base'
                }`}
                style={{
                  backgroundColor: textOverlaySettings.colorScheme === 'primary' ? 
                    businessSettings.primaryColor : 'black',
                  color: textOverlaySettings.colorScheme === 'primary' ? 
                    businessSettings.secondaryColor : 'white'
                }}
              >
                {textOverlaySettings.text}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )

  const renderDesignTab = () => (
    <div className="space-y-6">
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="font-semibold text-gray-800 mb-4">Design-Einstellungen</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Primärfarbe
              </label>
              <input
                type="color"
                value={businessSettings.primaryColor}
                onChange={(e) => setBusinessSettings(prev => ({ ...prev, primaryColor: e.target.value }))}
                className="w-full h-12 border border-gray-300 rounded-lg cursor-pointer"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sekundärfarbe
              </label>
              <input
                type="color"
                value={businessSettings.secondaryColor}
                onChange={(e) => setBusinessSettings(prev => ({ ...prev, secondaryColor: e.target.value }))}
                className="w-full h-12 border border-gray-300 rounded-lg cursor-pointer"
              />
            </div>
          </div>

          <button
            onClick={updateBusinessSettings}
            disabled={isSaving}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 disabled:opacity-50"
          >
            <SafeIcon icon={FiSave} className="w-4 h-4" />
            <span>{isSaving ? 'Speichert...' : 'Design speichern'}</span>
          </button>
        </div>

        {/* Color Preview */}
        <div className="mt-6 p-4 bg-white rounded-lg border">
          <h4 className="font-medium text-gray-800 mb-2">Farbvorschau</h4>
          <div className="flex space-x-4">
            <div
              className="w-16 h-16 rounded-lg flex items-center justify-center text-white font-medium"
              style={{ backgroundColor: businessSettings.primaryColor }}
            >
              Primär
            </div>
            <div
              className="w-16 h-16 rounded-lg flex items-center justify-center text-white font-medium"
              style={{ backgroundColor: businessSettings.secondaryColor }}
            >
              Sekundär
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800">App-Einstellungen</h2>
        <p className="text-gray-600 mt-1">
          Passen Sie Ihre Selfie-App an Ihre Fahrschule an
        </p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="flex flex-wrap border-b border-gray-200">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 min-w-[120px] px-4 py-4 font-medium flex items-center justify-center space-x-2 transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
              }`}
            >
              <SafeIcon icon={tab.icon} className="w-5 h-5" />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        <div className="p-6">
          {activeTab === 'frames' && renderFramesTab()}
          {activeTab === 'logo' && renderLogoTab()}
          {activeTab === 'textOverlay' && renderTextOverlayTab()}
          {activeTab === 'design' && renderDesignTab()}
        </div>
      </div>
    </div>
  )
}

export default AdminSettings