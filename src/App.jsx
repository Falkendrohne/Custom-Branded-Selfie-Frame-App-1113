import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import CameraView from './components/CameraView';
import AdminPanel from './components/AdminPanel';
import Navigation from './components/Navigation';
import './App.css';

function App() {
  const [appConfig, setAppConfig] = useState({
    frames: [
      {
        id: 1,
        name: 'Klassisch',
        url: 'https://www.falkendrohne.de/selfie/rahmen3.png?w=400&h=600&fit=crop&crop=center',
        isDefault: true
      },
      {
        id: 2,
        name: 'Modern',
        url: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=600&fit=crop&crop=center',
        isDefault: false
      },
      {
        id: 3,
        name: 'Elegant',
        url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=600&fit=crop&crop=center',
        isDefault: false
      }
    ],
    logo: {
      url: 'https://www.falkendrohne.de/selfie/leander.png?text=LOGO',
      position: 'top-center',
      size: 'medium'
    },
    textOverlay: {
      enabled: false,
      text: 'www.suchhunde-saarpfalz.de',
      useLocation: false,
      locationPrefix: 'Ich bin hier:',
      position: 'bottom',
      fontSize: 'medium',
      colorScheme: 'primary'
    },
    businessName: 'Suchhunde-SaarPfalz',
    primaryColor: '#8B0000',
    secondaryColor: '#FEA400'
  });

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-darkred-50 to-orange-100">
        <Navigation />
        <Routes>
          <Route 
            path="/" 
            element={<CameraView appConfig={appConfig} />} 
          />
          <Route 
            path="/admin" 
            element={
              <AdminPanel 
                appConfig={appConfig} 
                setAppConfig={setAppConfig} 
              />
            } 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;