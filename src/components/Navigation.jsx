import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import UserProfile from './UserProfile';
import { useAuth } from '../contexts/AuthContext';

const { FiCamera, FiSettings, FiHome, FiPlay, FiUsers } = FiIcons;

const Navigation = () => {
  const location = useLocation();
  const { currentUser, hasPermission } = useAuth();

  const navItems = [
    { path: '/', label: 'Kamera', icon: FiCamera, permission: 'camera.use' },
    { path: '/get-started', label: 'Start', icon: FiPlay, permission: null },
    { path: '/admin', label: 'Admin', icon: FiSettings, permission: 'settings.view' },
    { path: '/users', label: 'Benutzer', icon: FiUsers, permission: 'users.view' }
  ];

  // Filter navigation items based on permissions
  const visibleNavItems = navItems.filter(item => 
    !item.permission || hasPermission(item.permission)
  );

  return (
    <nav className="bg-white/80 backdrop-blur-md shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <SafeIcon icon={FiCamera} className="w-8 h-8 text-indigo-600" />
            <h1 className="text-xl font-bold text-gray-800">Selfie Frame</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex space-x-1">
              {visibleNavItems.map((item) => (
                <Link key={item.path} to={item.path}>
                  <motion.div
                    className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-all duration-200 ${
                      location.pathname === item.path
                        ? 'bg-indigo-600 text-white'
                        : 'text-gray-600 hover:bg-indigo-50 hover:text-indigo-600'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <SafeIcon icon={item.icon} className="w-5 h-5" />
                    <span className="font-medium hidden sm:inline">{item.label}</span>
                  </motion.div>
                </Link>
              ))}
            </div>
            
            {/* User Profile */}
            <UserProfile />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;