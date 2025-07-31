import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// User roles with permissions
export const ROLES = {
  GUEST: {
    name: 'guest',
    displayName: 'Gast',
    permissions: ['camera.use', 'frame.select']
  },
  USER: {
    name: 'user',
    displayName: 'Benutzer',
    permissions: ['camera.use', 'frame.select', 'photo.save', 'photo.share']
  },
  MODERATOR: {
    name: 'moderator',
    displayName: 'Moderator',
    permissions: [
      'camera.use', 'frame.select', 'photo.save', 'photo.share',
      'frames.view', 'settings.view'
    ]
  },
  ADMIN: {
    name: 'admin',
    displayName: 'Administrator',
    permissions: [
      'camera.use', 'frame.select', 'photo.save', 'photo.share',
      'frames.view', 'frames.add', 'frames.edit', 'frames.delete',
      'settings.view', 'settings.edit', 'users.view', 'users.manage',
      'analytics.view'
    ]
  },
  SUPER_ADMIN: {
    name: 'super_admin',
    displayName: 'Super Administrator',
    permissions: ['*'] // All permissions
  }
};

// Mock users for demonstration
const MOCK_USERS = [
  {
    id: '1',
    username: 'admin',
    email: 'admin@example.com',
    password: 'admin123',
    role: ROLES.ADMIN,
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
    isActive: true,
    lastLogin: new Date('2024-01-15T10:30:00Z'),
    createdAt: new Date('2024-01-01T00:00:00Z')
  },
  {
    id: '2',
    username: 'moderator',
    email: 'mod@example.com',
    password: 'mod123',
    role: ROLES.MODERATOR,
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
    isActive: true,
    lastLogin: new Date('2024-01-14T15:45:00Z'),
    createdAt: new Date('2024-01-02T00:00:00Z')
  },
  {
    id: '3',
    username: 'user1',
    email: 'user1@example.com',
    password: 'user123',
    role: ROLES.USER,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    isActive: true,
    lastLogin: new Date('2024-01-13T09:20:00Z'),
    createdAt: new Date('2024-01-03T00:00:00Z')
  },
  {
    id: '4',
    username: 'user2',
    email: 'user2@example.com',
    password: 'user123',
    role: ROLES.USER,
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
    isActive: false,
    lastLogin: new Date('2024-01-10T14:15:00Z'),
    createdAt: new Date('2024-01-04T00:00:00Z')
  }
];

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState(MOCK_USERS);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setCurrentUser(user);
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('currentUser');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (username, password) => {
    const user = users.find(u => 
      (u.username === username || u.email === username) && 
      u.password === password &&
      u.isActive
    );

    if (user) {
      const updatedUser = {
        ...user,
        lastLogin: new Date()
      };
      setCurrentUser(updatedUser);
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      
      // Update users list with new last login
      setUsers(prev => prev.map(u => u.id === user.id ? updatedUser : u));
      
      return { success: true, user: updatedUser };
    } else {
      return { success: false, error: 'Ungültige Anmeldedaten oder Konto deaktiviert' };
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
  };

  const hasPermission = (permission) => {
    if (!currentUser) return false;
    
    const userPermissions = currentUser.role.permissions;
    
    // Super admin has all permissions
    if (userPermissions.includes('*')) return true;
    
    // Check specific permission
    return userPermissions.includes(permission);
  };

  const hasAnyPermission = (permissions) => {
    return permissions.some(permission => hasPermission(permission));
  };

  const hasRole = (roleName) => {
    if (!currentUser) return false;
    return currentUser.role.name === roleName;
  };

  const isAtLeastRole = (roleName) => {
    if (!currentUser) return false;
    
    const roleHierarchy = ['guest', 'user', 'moderator', 'admin', 'super_admin'];
    const currentRoleIndex = roleHierarchy.indexOf(currentUser.role.name);
    const requiredRoleIndex = roleHierarchy.indexOf(roleName);
    
    return currentRoleIndex >= requiredRoleIndex;
  };

  const updateUser = (userId, updates) => {
    setUsers(prev => prev.map(user => 
      user.id === userId ? { ...user, ...updates } : user
    ));
    
    // Update current user if it's the one being updated
    if (currentUser && currentUser.id === userId) {
      const updatedCurrentUser = { ...currentUser, ...updates };
      setCurrentUser(updatedCurrentUser);
      localStorage.setItem('currentUser', JSON.stringify(updatedCurrentUser));
    }
  };

  const createUser = (userData) => {
    const newUser = {
      id: Date.now().toString(),
      ...userData,
      createdAt: new Date(),
      lastLogin: null,
      isActive: true
    };
    
    setUsers(prev => [...prev, newUser]);
    return newUser;
  };

  const deleteUser = (userId) => {
    setUsers(prev => prev.filter(user => user.id !== userId));
    
    // Logout if current user is being deleted
    if (currentUser && currentUser.id === userId) {
      logout();
    }
  };

  const value = {
    currentUser,
    users,
    isLoading,
    login,
    logout,
    hasPermission,
    hasAnyPermission,
    hasRole,
    isAtLeastRole,
    updateUser,
    createUser,
    deleteUser,
    ROLES
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};