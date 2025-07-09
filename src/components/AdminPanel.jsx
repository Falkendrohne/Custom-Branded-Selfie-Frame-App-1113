import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiSettings, FiImage, FiUpload, FiTrash2, FiSave, FiEye } = FiIcons;

const AdminPanel = ({ appConfig, setAppConfig }) => {
  const [activeTab, setActiveTab] = useState('frames');
  const [newFrame, setNewFrame] = useState({ name: '', url: '' });
  const [logoSettings, setLogoSettings] = useState(appConfig.logo);
  const [businessSettings, setBusinessSettings] = useState({
    businessName: appConfig.businessName,
    primaryColor: appConfig.primaryColor,
    secondaryColor: appConfig.secondaryColor
  });

  const tabs = [
    { id: 'frames', label: 'Rahmen', icon: FiImage },
    { id: 'logo', label: 'Logo', icon: FiUpload },
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

          <div className="flex border-b border-gray-200">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex-1 px-6 py-4 font-medium flex items-center justify-center space-x-2 transition-all duration-200
                  ${activeTab === tab.id
                    ? 'bg-indigo-50 text-indigo-600 border-b-2 border-indigo-600'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                  }
                `}
              >
                <SafeIcon icon={tab.icon} className="w-5 h-5" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          <div className="p-6">
            {activeTab === 'frames' && renderFramesTab()}
            {activeTab === 'logo' && renderLogoTab()}
            {activeTab === 'settings' && renderSettingsTab()}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminPanel;