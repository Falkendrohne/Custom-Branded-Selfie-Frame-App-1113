import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useAuth } from '../contexts/AuthContext';

const { FiUser, FiLock, FiLogIn, FiEye, FiEyeOff, FiUserCheck } = FiIcons;

const LoginForm = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showDemoAccounts, setShowDemoAccounts] = useState(false);
  
  const { login, ROLES } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const result = await login(formData.username, formData.password);
      if (!result.success) {
        setError(result.error);
      }
    } catch (err) {
      setError('Ein unerwarteter Fehler ist aufgetreten');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async (username, password) => {
    setFormData({ username, password });
    setIsLoading(true);
    setError('');

    try {
      const result = await login(username, password);
      if (!result.success) {
        setError(result.error);
      }
    } catch (err) {
      setError('Ein unerwarteter Fehler ist aufgetreten');
    } finally {
      setIsLoading(false);
    }
  };

  const demoAccounts = [
    {
      username: 'admin',
      password: 'admin123',
      role: ROLES.ADMIN,
      description: 'Vollzugriff auf alle Funktionen'
    },
    {
      username: 'moderator',
      password: 'mod123',
      role: ROLES.MODERATOR,
      description: 'Kann Rahmen und Einstellungen einsehen'
    },
    {
      username: 'user1',
      password: 'user123',
      role: ROLES.USER,
      description: 'Kann Fotos machen und teilen'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-2xl overflow-hidden max-w-md w-full"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6">
          <div className="text-center">
            <SafeIcon icon={FiUserCheck} className="w-12 h-12 mx-auto mb-2" />
            <h1 className="text-2xl font-bold">Anmeldung</h1>
            <p className="text-indigo-100 mt-1">
              Melden Sie sich an, um fortzufahren
            </p>
          </div>
        </div>

        <div className="p-6">
          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4"
            >
              {error}
            </motion.div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Benutzername oder E-Mail
              </label>
              <div className="relative">
                <SafeIcon 
                  icon={FiUser} 
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" 
                />
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Benutzername eingeben"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Passwort
              </label>
              <div className="relative">
                <SafeIcon 
                  icon={FiLock} 
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" 
                />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Passwort eingeben"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <SafeIcon icon={showPassword ? FiEyeOff : FiEye} className="w-5 h-5" />
                </button>
              </div>
            </div>

            <motion.button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-lg font-semibold flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={{ scale: isLoading ? 1 : 1.02 }}
              whileTap={{ scale: isLoading ? 1 : 0.98 }}
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <SafeIcon icon={FiLogIn} className="w-5 h-5" />
                  <span>Anmelden</span>
                </>
              )}
            </motion.button>
          </form>

          {/* Demo Accounts */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <button
              onClick={() => setShowDemoAccounts(!showDemoAccounts)}
              className="w-full text-sm text-indigo-600 hover:text-indigo-800 font-medium"
            >
              {showDemoAccounts ? 'Demo-Konten ausblenden' : 'Demo-Konten anzeigen'}
            </button>

            {showDemoAccounts && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-4 space-y-3"
              >
                <p className="text-sm text-gray-600 text-center mb-3">
                  Klicken Sie auf ein Demo-Konto zum Anmelden:
                </p>
                {demoAccounts.map((account) => (
                  <motion.button
                    key={account.username}
                    onClick={() => handleDemoLogin(account.username, account.password)}
                    disabled={isLoading}
                    className="w-full p-3 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 text-left transition-colors disabled:opacity-50"
                    whileHover={{ scale: isLoading ? 1 : 1.02 }}
                    whileTap={{ scale: isLoading ? 1 : 0.98 }}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-medium text-gray-800">
                          {account.username}
                        </div>
                        <div className="text-sm text-gray-600">
                          {account.role.displayName}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {account.description}
                        </div>
                      </div>
                      <div className="text-xs text-gray-400">
                        Passwort: {account.password}
                      </div>
                    </div>
                  </motion.button>
                ))}
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginForm;