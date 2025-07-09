import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiSettings, FiImage, FiUpload, FiTrash2, FiSave, FiEye, FiType, FiMapPin } = FiIcons;

const AdminPanel = ({ appConfig, setAppConfig }) => {
  const [activeTab, setActiveTab] = useState('frames');
  const [newFrame, setNewFrame] = useState({ name: '', url: '' });
  const [logoSettings, setLogoSettings] = useState(appConfig.logo);
  const [businessSettings, setBusinessSettings] = useState({
    businessName: appConfig.businessName,
    primaryColor: appConfig.primaryColor,
    secondaryColor: appConfig.secondaryColor
  });
  const [textOverlaySettings, setTextOverlaySettings] = useState(appConfig.textOverlay || {
    enabled: false,
    text: '',
    useLocation: false,
    locationPrefix: 'Ich bin hier:',
    position: 'bottom',
    fontSize: 'medium',
    colorScheme: 'primary' // 'primary', 'blackwhite'
  });

  const tabs = [
    { id: 'frames', label: 'Rahmen', icon: FiImage },
    { id: 'logo', label: 'Logo', icon: FiUpload },
    { id: 'textOverlay', label: 'Text Overlay', icon: FiType },
    { id: 'settings', label: 'Einstellungen', icon: FiSettings }
  ];

  const addFrame = () => {
    if (newFrame.name && newFrame.url) {
      const frame = {
        id: Date.now(),
        name: newFrame.name,
        url: newFrame.url,
        isDefault: false
      };
      
      setAppConfig(prev => ({
        ...prev,
        frames: [...prev.frames, frame]
      }));
      
      setNewFrame({ name: '', url: '' });
    }
  };

  const removeFrame = (frameId) => {
    setAppConfig(prev => ({
      ...prev,
      frames: prev.frames.filter(f => f.id !== frameId)
    }));
  };

  const setDefaultFrame = (frameId) => {
    setAppConfig(prev => ({
      ...prev,
      frames: prev.frames.map(f => ({
        ...f,
        isDefault: f.id === frameId
      }))
    }));
  };

  const updateLogo = () => {
    setAppConfig(prev => ({
      ...prev,
      logo: logoSettings
    }));
  };

  const updateTextOverlay = () => {
    setAppConfig(prev => ({
      ...prev,
      textOverlay: textOverlaySettings
    }));
  };

  const updateBusinessSettings = () => {
    setAppConfig(prev => ({
      ...prev,
      ...businessSettings
    }));
  };

  const renderFramesTab = () => (
    <div className="space-y-6">
      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="font-semibold text-gray-800 mb-4">Neuen Rahmen hinzufügen</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Rahmen Name"
            value={newFrame.name}
            onChange={(e) => setNewFrame(prev => ({ ...prev, name: e.target.value }))}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
          <input
            type="url"
            placeholder="Rahmen URL (PNG mit transparenter Mitte)"
            value={newFrame.url}
            onChange={(e) => setNewFrame(prev => ({ ...prev, url: e.target.value }))}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
        <button
          onClick={addFrame}
          className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center space-x-2"
        >
          <SafeIcon icon={FiUpload} className="w-4 h-4" />
          <span>Rahmen hinzufügen</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {appConfig.frames.map((frame) => (
          <motion.div
            key={frame.id}
            className="bg-white rounded-lg shadow-md overflow-hidden"
            whileHover={{ scale: 1.02 }}
          >
            <div className="aspect-[3/4] bg-gray-100">
              <img
                src={frame.url}
                alt={frame.name}
                className="w-full h-full object-cover"
              />
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
                <button
                  onClick={() => removeFrame(frame.id)}
                  className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition-colors"
                >
                  <SafeIcon icon={FiTrash2} className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

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
              value={logoSettings.url}
              onChange={(e) => setLogoSettings(prev => ({ ...prev, url: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="https://example.com/logo.png"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Logo-Größe
            </label>
            <select
              value={logoSettings.size}
              onChange={(e) => setLogoSettings(prev => ({ ...prev, size: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
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
              value={logoSettings.position}
              onChange={(e) => setLogoSettings(prev => ({ ...prev, position: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="top-center">Oben Mitte</option>
              <option value="top-left">Oben Links</option>
              <option value="top-right">Oben Rechts</option>
              <option value="bottom-center">Unten Mitte</option>
            </select>
          </div>

          <button
            onClick={updateLogo}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center space-x-2"
          >
            <SafeIcon icon={FiSave} className="w-4 h-4" />
            <span>Logo speichern</span>
          </button>
        </div>

        {logoSettings.url && (
          <div className="mt-6 p-4 bg-white rounded-lg border">
            <h4 className="font-medium text-gray-800 mb-2">Vorschau</h4>
            <div className="flex justify-center">
              <img
                src={logoSettings.url}
                alt="Logo preview"
                className={`
                  ${logoSettings.size === 'small' ? 'h-8' : 
                    logoSettings.size === 'large' ? 'h-16' : 'h-12'}
                  object-contain
                `}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderTextOverlayTab = () => (
    <div className="space-y-6">
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="font-semibold text-gray-800 mb-4">Text Overlay Einstellungen</h3>
        
        <div className="space-y-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="enableTextOverlay"
              checked={textOverlaySettings.enabled}
              onChange={(e) => setTextOverlaySettings(prev => ({ 
                ...prev, 
                enabled: e.target.checked 
              }))}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label htmlFor="enableTextOverlay" className="ml-2 block text-sm text-gray-700">
              Text Overlay aktivieren
            </label>
          </div>

          <div className="mt-4 space-y-4">
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <input
                  type="radio"
                  id="customText"
                  name="textType"
                  checked={!textOverlaySettings.useLocation}
                  onChange={() => setTextOverlaySettings(prev => ({ 
                    ...prev, 
                    useLocation: false 
                  }))}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                />
                <label htmlFor="customText" className="block text-sm font-medium text-gray-700">
                  Benutzerdefinierter Text
                </label>
              </div>
              <input
                type="text"
                value={textOverlaySettings.text}
                onChange={(e) => setTextOverlaySettings(prev => ({ 
                  ...prev, 
                  text: e.target.value 
                }))}
                disabled={textOverlaySettings.useLocation}
                placeholder="Slogan oder URL hinzufügen"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-100 disabled:text-gray-500"
              />
            </div>

            <div>
              <div className="flex items-center space-x-2 mb-2">
                <input
                  type="radio"
                  id="locationText"
                  name="textType"
                  checked={textOverlaySettings.useLocation}
                  onChange={() => setTextOverlaySettings(prev => ({ 
                    ...prev, 
                    useLocation: true 
                  }))}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                />
                <label htmlFor="locationText" className="block text-sm font-medium text-gray-700">
                  Standort anzeigen
                </label>
              </div>
              {textOverlaySettings.useLocation && (
                <input
                  type="text"
                  value={textOverlaySettings.locationPrefix}
                  onChange={(e) => setTextOverlaySettings(prev => ({ 
                    ...prev, 
                    locationPrefix: e.target.value 
                  }))}
                  placeholder="Ich bin hier:"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Position
              </label>
              <select
                value={textOverlaySettings.position}
                onChange={(e) => setTextOverlaySettings(prev => ({ 
                  ...prev, 
                  position: e.target.value 
                }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
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
                value={textOverlaySettings.fontSize}
                onChange={(e) => setTextOverlaySettings(prev => ({ 
                  ...prev, 
                  fontSize: e.target.value 
                }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
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
                value={textOverlaySettings.colorScheme}
                onChange={(e) => setTextOverlaySettings(prev => ({ 
                  ...prev, 
                  colorScheme: e.target.value 
                }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="primary">Primär- und Sekundärfarbe</option>
                <option value="blackwhite">Schwarz & Weiß</option>
              </select>
            </div>
          </div>

          <button
            onClick={updateTextOverlay}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center space-x-2"
          >
            <SafeIcon icon={FiSave} className="w-4 h-4" />
            <span>Text-Einstellungen speichern</span>
          </button>
        </div>

        {textOverlaySettings.enabled && (
          <div className="mt-6 p-4 bg-white rounded-lg border">
            <h4 className="font-medium text-gray-800 mb-2">Vorschau</h4>
            <div className="relative w-full h-16 flex items-center justify-center">
              <div 
                className={`
                  px-4 py-1 rounded-lg 
                  ${textOverlaySettings.colorScheme === 'primary' 
                    ? `bg-[${appConfig.primaryColor}] text-[${appConfig.secondaryColor}]` 
                    : 'bg-black text-white'}
                  ${textOverlaySettings.fontSize === 'small' ? 'text-sm' : 
                    textOverlaySettings.fontSize === 'large' ? 'text-xl' : 'text-base'}
                `}
                style={{
                  backgroundColor: textOverlaySettings.colorScheme === 'primary' 
                    ? appConfig.primaryColor 
                    : 'black',
                  color: textOverlaySettings.colorScheme === 'primary' 
                    ? appConfig.secondaryColor 
                    : 'white'
                }}
              >
                {textOverlaySettings.useLocation 
                  ? `${textOverlaySettings.locationPrefix} [Standort wird angezeigt]` 
                  : textOverlaySettings.text || 'Beispieltext'}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderSettingsTab = () => (
    <div className="space-y-6">
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="font-semibold text-gray-800 mb-4">Unternehmens-Einstellungen</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Unternehmensname
            </label>
            <input
              type="text"
              value={businessSettings.businessName}
              onChange={(e) => setBusinessSettings(prev => ({ ...prev, businessName: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Ihr Unternehmensname"
            />
          </div>

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
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center space-x-2"
          >
            <SafeIcon icon={FiSave} className="w-4 h-4" />
            <span>Einstellungen speichern</span>
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
        >
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6">
            <h1 className="text-3xl font-bold">Admin Panel</h1>
            <p className="text-indigo-100 mt-2">
              Verwalten Sie Ihre Selfie-App Einstellungen
            </p>
          </div>

          <div className="flex flex-wrap border-b border-gray-200">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex-1 min-w-[120px] px-4 py-4 font-medium flex items-center justify-center space-x-2 transition-all duration-200
                  ${activeTab === tab.id
                    ? 'bg-indigo-50 text-indigo-600 border-b-2 border-indigo-600'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                  }
                `}
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
            {activeTab === 'settings' && renderSettingsTab()}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminPanel;