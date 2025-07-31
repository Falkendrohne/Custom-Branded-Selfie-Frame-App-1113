import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useAuth } from '../contexts/AuthContext';
import { formatDistanceToNow } from 'date-fns';
import { de } from 'date-fns/locale';

const { FiUser, FiLogOut, FiSettings, FiChevronDown, FiShield, FiClock } = FiIcons;

const UserProfile = () => {
  const { currentUser, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);

  if (!currentUser) return null;

  const handleLogout = () => {
    logout();
    setShowDropdown(false);
  };

  const getRoleBadgeColor = (role) => {
    switch (role.name) {
      case 'super_admin':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'admin':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'moderator':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'user':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="relative">
      <motion.button
        onClick={() => setShowDropdown(!showDropdown)}
        className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-colors"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200">
          {currentUser.avatar ? (
            <img
              src={currentUser.avatar}
              alt={currentUser.username}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <SafeIcon icon={FiUser} className="w-4 h-4 text-gray-500" />
            </div>
          )}
        </div>
        <div className="hidden sm:block text-left">
          <div className="text-sm font-medium text-gray-800">
            {currentUser.username}
          </div>
          <div className={`text-xs px-2 py-0.5 rounded-full border ${getRoleBadgeColor(currentUser.role)}`}>
            {currentUser.role.displayName}
          </div>
        </div>
        <SafeIcon 
          icon={FiChevronDown} 
          className={`w-4 h-4 text-gray-500 transition-transform ${showDropdown ? 'rotate-180' : ''}`} 
        />
      </motion.button>

      <AnimatePresence>
        {showDropdown && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-10"
              onClick={() => setShowDropdown(false)}
            />
            
            {/* Dropdown */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              className="absolute right-0 top-full mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-20"
            >
              {/* User Info */}
              <div className="p-4 border-b border-gray-100">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200">
                    {currentUser.avatar ? (
                      <img
                        src={currentUser.avatar}
                        alt={currentUser.username}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <SafeIcon icon={FiUser} className="w-6 h-6 text-gray-500" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-800">
                      {currentUser.username}
                    </div>
                    <div className="text-sm text-gray-600">
                      {currentUser.email}
                    </div>
                    <div className={`inline-block text-xs px-2 py-1 rounded-full border mt-1 ${getRoleBadgeColor(currentUser.role)}`}>
                      <SafeIcon icon={FiShield} className="w-3 h-3 inline mr-1" />
                      {currentUser.role.displayName}
                    </div>
                  </div>
                </div>
              </div>

              {/* User Stats */}
              <div className="p-4 border-b border-gray-100">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-gray-500">Mitglied seit</div>
                    <div className="font-medium text-gray-800">
                      {formatDistanceToNow(new Date(currentUser.createdAt), { 
                        addSuffix: true, 
                        locale: de 
                      })}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-500">Letzter Login</div>
                    <div className="font-medium text-gray-800 flex items-center">
                      <SafeIcon icon={FiClock} className="w-3 h-3 mr-1" />
                      {currentUser.lastLogin ? 
                        formatDistanceToNow(new Date(currentUser.lastLogin), { 
                          addSuffix: true, 
                          locale: de 
                        }) : 
                        'Nie'
                      }
                    </div>
                  </div>
                </div>
              </div>

              {/* Permissions */}
              <div className="p-4 border-b border-gray-100">
                <div className="text-sm font-medium text-gray-700 mb-2">
                  Berechtigungen
                </div>
                <div className="max-h-32 overflow-y-auto">
                  {currentUser.role.permissions.includes('*') ? (
                    <div className="text-xs bg-purple-50 text-purple-700 px-2 py-1 rounded">
                      Alle Berechtigungen
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-1">
                      {currentUser.role.permissions.map((permission) => (
                        <div
                          key={permission}
                          className="text-xs bg-gray-50 text-gray-700 px-2 py-1 rounded"
                        >
                          {permission}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="p-2">
                <motion.button
                  onClick={handleLogout}
                  className="w-full flex items-center space-x-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <SafeIcon icon={FiLogOut} className="w-4 h-4" />
                  <span>Abmelden</span>
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserProfile;