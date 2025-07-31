import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import LoginForm from './LoginForm';

const ProtectedRoute = ({ 
  children, 
  permission = null, 
  role = null, 
  permissions = [],
  requireAuth = true,
  fallback = null 
}) => {
  const { currentUser, hasPermission, hasRole, hasAnyPermission } = useAuth();

  // If no authentication required, render children
  if (!requireAuth) {
    return children;
  }

  // If user not authenticated, show login
  if (!currentUser) {
    return fallback || <LoginForm />;
  }

  // Check specific permission
  if (permission && !hasPermission(permission)) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-600 text-2xl">🚫</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Zugriff verweigert</h2>
          <p className="text-gray-600 mb-4">
            Sie haben nicht die erforderlichen Berechtigungen für diese Seite.
          </p>
          <p className="text-sm text-gray-500">
            Erforderliche Berechtigung: <code className="bg-gray-100 px-2 py-1 rounded">{permission}</code>
          </p>
        </div>
      </div>
    );
  }

  // Check specific role
  if (role && !hasRole(role)) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-600 text-2xl">🚫</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Zugriff verweigert</h2>
          <p className="text-gray-600 mb-4">
            Ihre Rolle hat keinen Zugriff auf diese Seite.
          </p>
          <p className="text-sm text-gray-500">
            Erforderliche Rolle: <code className="bg-gray-100 px-2 py-1 rounded">{role}</code>
          </p>
        </div>
      </div>
    );
  }

  // Check multiple permissions (user needs at least one)
  if (permissions.length > 0 && !hasAnyPermission(permissions)) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-600 text-2xl">🚫</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Zugriff verweigert</h2>
          <p className="text-gray-600 mb-4">
            Sie haben nicht die erforderlichen Berechtigungen für diese Seite.
          </p>
          <div className="text-sm text-gray-500">
            <p className="mb-2">Erforderliche Berechtigungen (mindestens eine):</p>
            <div className="space-y-1">
              {permissions.map(perm => (
                <code key={perm} className="bg-gray-100 px-2 py-1 rounded block">
                  {perm}
                </code>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // User has required permissions, render children
  return children;
};

export default ProtectedRoute;