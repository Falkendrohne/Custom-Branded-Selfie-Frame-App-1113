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
        url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=600&fit=crop&crop=center',
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
      url: 'https://via.placeholder.com/150x50/4F46E5/FFFFFF?text=LOGO',
      position: 'top-center',
      size: 'medium'
    },
    businessName: 'Ihr Unternehmen',
    primaryColor: '#4F46E5',
    secondaryColor: '#10B981'
  });

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
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