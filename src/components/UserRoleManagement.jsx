import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import * as FiIcons from 'react-icons/fi'
import SafeIcon from '../common/SafeIcon'
import { useAuth } from '../contexts/AuthContext'
import { formatDistanceToNow } from 'date-fns'
import { de } from 'date-fns/locale'

const {
  FiUsers, FiShield, FiPlus, FiEdit3, FiTrash2, FiSearch, FiFilter,
  FiUser, FiMail, FiClock, FiToggleLeft, FiToggleRight, FiX, FiSave,
  FiEye, FiEyeOff, FiSettings, FiCheck, FiAlertTriangle, FiLock,
  FiUnlock, FiUserPlus, FiUserCheck, FiUserX, FiChevronDown,
  FiActivity, FiCalendar, FiStar
} = FiIcons

const UserRoleManagement = () => {
  const { 
    users, 
    currentUser, 
    ROLES, 
    updateUser, 
    createUser, 
    deleteUser, 
    hasPermission 
  } = useAuth()

  const [activeTab, setActiveTab] = useState('users')
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showRoleModal, setShowRoleModal] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [showPassword, setShowPassword] = useState(false)
  const [bulkSelection, setBulkSelection] = useState([])
  const [showBulkActions, setShowBulkActions] = useState(false)
  const [newUser, setNewUser] = useState({
    username: '',
    email: '',
    password: '',
    role: ROLES.USER,
    isActive: true
  })

  const tabs = [
    { id: 'users', label: 'Benutzer', icon: FiUsers },
    { id: 'roles', label: 'Rollen', icon: FiShield },
    { id: 'permissions', label: 'Berechtigungen', icon: FiLock },
    { id: 'analytics', label: 'Statistiken', icon: FiActivity }
  ]

  // Filter users
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesRole = roleFilter === 'all' || user.role.name === roleFilter
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'active' && user.isActive) ||
      (statusFilter === 'inactive' && !user.isActive)
    
    return matchesSearch && matchesRole && matchesStatus
  })

  const handleCreateUser = (e) => {
    e.preventDefault()
    
    // Check if username or email already exists
    const existingUser = users.find(u => 
      u.username === newUser.username || u.email === newUser.email
    )
    
    if (existingUser) {
      alert('Benutzername oder E-Mail bereits vergeben')
      return
    }

    createUser(newUser)
    setNewUser({
      username: '',
      email: '',
      password: '',
      role: ROLES.USER,
      isActive: true
    })
    setShowCreateModal(false)
  }

  const handleUpdateUser = (userId, updates) => {
    updateUser(userId, updates)
    setEditingUser(null)
  }

  const handleDeleteUser = (userId) => {
    if (userId === currentUser.id) {
      alert('Sie können sich nicht selbst löschen')
      return
    }
    
    if (window.confirm('Sind Sie sicher, dass Sie diesen Benutzer löschen möchten?')) {
      deleteUser(userId)
    }
  }

  const toggleUserStatus = (userId, currentStatus) => {
    if (userId === currentUser.id) {
      alert('Sie können Ihren eigenen Status nicht ändern')
      return
    }
    
    updateUser(userId, { isActive: !currentStatus })
  }

  const handleBulkSelection = (userId) => {
    setBulkSelection(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    )
  }

  const handleBulkAction = (action) => {
    switch (action) {
      case 'activate':
        bulkSelection.forEach(userId => {
          if (userId !== currentUser.id) {
            updateUser(userId, { isActive: true })
          }
        })
        break
      case 'deactivate':
        bulkSelection.forEach(userId => {
          if (userId !== currentUser.id) {
            updateUser(userId, { isActive: false })
          }
        })
        break
      case 'delete':
        if (window.confirm(`${bulkSelection.length} Benutzer löschen?`)) {
          bulkSelection.forEach(userId => {
            if (userId !== currentUser.id) {
              deleteUser(userId)
            }
          })
        }
        break
    }
    setBulkSelection([])
    setShowBulkActions(false)
  }

  const getRoleBadgeColor = (role) => {
    switch (role.name) {
      case 'super_admin': return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'admin': return 'bg-red-100 text-red-800 border-red-200'
      case 'moderator': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'user': return 'bg-green-100 text-green-800 border-green-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getUserStats = () => {
    const total = users.length
    const active = users.filter(u => u.isActive).length
    const byRole = Object.values(ROLES).map(role => ({
      role,
      count: users.filter(u => u.role.name === role.name).length
    }))
    
    return { total, active, inactive: total - active, byRole }
  }

  const stats = getUserStats()

  const renderUsersTab = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-4 shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Gesamt</p>
              <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
            </div>
            <SafeIcon icon={FiUsers} className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-4 shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Aktiv</p>
              <p className="text-2xl font-bold text-green-600">{stats.active}</p>
            </div>
            <SafeIcon icon={FiUserCheck} className="w-8 h-8 text-green-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-4 shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Inaktiv</p>
              <p className="text-2xl font-bold text-red-600">{stats.inactive}</p>
            </div>
            <SafeIcon icon={FiUserX} className="w-8 h-8 text-red-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-4 shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Administratoren</p>
              <p className="text-2xl font-bold text-purple-600">
                {stats.byRole.filter(r => r.role.name === 'admin' || r.role.name === 'super_admin').reduce((sum, r) => sum + r.count, 0)}
              </p>
            </div>
            <SafeIcon icon={FiShield} className="w-8 h-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Filters and Actions */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Search and Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1">
            <div className="relative">
              <SafeIcon icon={FiSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Benutzer suchen..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Alle Rollen</option>
              {Object.values(ROLES).map(role => (
                <option key={role.name} value={role.name}>
                  {role.displayName}
                </option>
              ))}
            </select>
            
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Alle Status</option>
              <option value="active">Aktiv</option>
              <option value="inactive">Inaktiv</option>
            </select>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2">
            {bulkSelection.length > 0 && (
              <div className="relative">
                <button
                  onClick={() => setShowBulkActions(!showBulkActions)}
                  className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors flex items-center space-x-2"
                >
                  <span>{bulkSelection.length} ausgewählt</span>
                  <SafeIcon icon={FiChevronDown} className="w-4 h-4" />
                </button>
                
                {showBulkActions && (
                  <div className="absolute right-0 top-full mt-2 bg-white rounded-lg shadow-lg border border-gray-200 z-10 min-w-48">
                    <button
                      onClick={() => handleBulkAction('activate')}
                      className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center space-x-2"
                    >
                      <SafeIcon icon={FiUserCheck} className="w-4 h-4 text-green-600" />
                      <span>Aktivieren</span>
                    </button>
                    <button
                      onClick={() => handleBulkAction('deactivate')}
                      className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center space-x-2"
                    >
                      <SafeIcon icon={FiUserX} className="w-4 h-4 text-yellow-600" />
                      <span>Deaktivieren</span>
                    </button>
                    <button
                      onClick={() => handleBulkAction('delete')}
                      className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center space-x-2 text-red-600"
                    >
                      <SafeIcon icon={FiTrash2} className="w-4 h-4" />
                      <span>Löschen</span>
                    </button>
                  </div>
                )}
              </div>
            )}
            
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <SafeIcon icon={FiPlus} className="w-4 h-4" />
              <span>Neuer Benutzer</span>
            </button>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={bulkSelection.length === filteredUsers.length && filteredUsers.length > 0}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setBulkSelection(filteredUsers.map(u => u.id))
                      } else {
                        setBulkSelection([])
                      }
                    }}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Benutzer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rolle
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Letzter Login
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aktionen
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <motion.tr
                  key={user.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={`hover:bg-gray-50 ${bulkSelection.includes(user.id) ? 'bg-blue-50' : ''}`}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={bulkSelection.includes(user.id)}
                      onChange={() => handleBulkSelection(user.id)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 mr-3">
                        {user.avatar ? (
                          <img
                            src={user.avatar}
                            alt={user.username}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <SafeIcon icon={FiUser} className="w-5 h-5 text-gray-500" />
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900 flex items-center">
                          {user.username}
                          {user.id === currentUser.id && (
                            <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                              Sie
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getRoleBadgeColor(user.role)}`}>
                      <SafeIcon icon={FiShield} className="w-3 h-3 mr-1" />
                      {user.role.displayName}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => toggleUserStatus(user.id, user.isActive)}
                      disabled={user.id === currentUser.id}
                      className={`flex items-center space-x-1 ${
                        user.id === currentUser.id ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
                      }`}
                    >
                      <SafeIcon
                        icon={user.isActive ? FiToggleRight : FiToggleLeft}
                        className={`w-5 h-5 ${user.isActive ? 'text-green-500' : 'text-gray-400'}`}
                      />
                      <span className={`text-sm ${user.isActive ? 'text-green-700' : 'text-gray-500'}`}>
                        {user.isActive ? 'Aktiv' : 'Inaktiv'}
                      </span>
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.lastLogin ? (
                      <div className="flex items-center">
                        <SafeIcon icon={FiClock} className="w-4 h-4 mr-1" />
                        {formatDistanceToNow(new Date(user.lastLogin), {
                          addSuffix: true,
                          locale: de
                        })}
                      </div>
                    ) : (
                      'Nie'
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setEditingUser(user)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <SafeIcon icon={FiEdit3} className="w-4 h-4" />
                      </button>
                      {user.id !== currentUser.id && (
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <SafeIcon icon={FiTrash2} className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )

  const renderRolesTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.values(ROLES).map((role) => (
          <motion.div
            key={role.name}
            className="bg-white rounded-lg shadow-md p-6"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getRoleBadgeColor(role)}`}>
                  <SafeIcon icon={FiShield} className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{role.displayName}</h3>
                  <p className="text-sm text-gray-600">{stats.byRole.find(r => r.role.name === role.name)?.count || 0} Benutzer</p>
                </div>
              </div>
            </div>
            
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Berechtigungen:</h4>
              <div className="max-h-32 overflow-y-auto">
                {role.permissions.includes('*') ? (
                  <div className="text-xs bg-purple-50 text-purple-700 px-2 py-1 rounded">
                    Alle Berechtigungen
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-1">
                    {role.permissions.map((permission) => (
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
          </motion.div>
        ))}
      </div>
    </div>
  )

  const renderPermissionsTab = () => {
    const allPermissions = [
      'camera.use', 'frame.select', 'photo.save', 'photo.share',
      'frames.view', 'frames.add', 'frames.edit', 'frames.delete',
      'settings.view', 'settings.edit', 'users.view', 'users.manage',
      'analytics.view'
    ]

    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Berechtigungsmatrix</h3>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="text-left py-2 px-4 border-b">Berechtigung</th>
                  {Object.values(ROLES).map(role => (
                    <th key={role.name} className="text-center py-2 px-4 border-b">
                      {role.displayName}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {allPermissions.map(permission => (
                  <tr key={permission} className="hover:bg-gray-50">
                    <td className="py-2 px-4 border-b font-medium text-gray-800">
                      {permission}
                    </td>
                    {Object.values(ROLES).map(role => (
                      <td key={role.name} className="text-center py-2 px-4 border-b">
                        {role.permissions.includes('*') || role.permissions.includes(permission) ? (
                          <SafeIcon icon={FiCheck} className="w-5 h-5 text-green-600 mx-auto" />
                        ) : (
                          <SafeIcon icon={FiX} className="w-5 h-5 text-gray-300 mx-auto" />
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    )
  }

  const renderAnalyticsTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Benutzer nach Rollen</h3>
          <div className="space-y-3">
            {stats.byRole.map(({ role, count }) => (
              <div key={role.name} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className={`w-4 h-4 rounded ${getRoleBadgeColor(role)}`}></div>
                  <span className="text-sm text-gray-700">{role.displayName}</span>
                </div>
                <span className="text-sm font-medium text-gray-800">{count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Aktivitätsübersicht</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Aktive Benutzer</span>
              <span className="text-sm font-medium text-green-600">{stats.active}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Inaktive Benutzer</span>
              <span className="text-sm font-medium text-red-600">{stats.inactive}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Aktivitätsrate</span>
              <span className="text-sm font-medium text-blue-600">
                {stats.total > 0 ? Math.round((stats.active / stats.total) * 100) : 0}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center">
            <SafeIcon icon={FiUsers} className="w-8 h-8 mr-2 text-blue-600" />
            Benutzer- & Rollenverwaltung
          </h2>
          <p className="text-gray-600 mt-1">
            Verwalten Sie Benutzerkonten, Rollen und Berechtigungen
          </p>
        </div>
      </div>

      {/* Navigation Tabs */}
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
          {activeTab === 'users' && renderUsersTab()}
          {activeTab === 'roles' && renderRolesTab()}
          {activeTab === 'permissions' && renderPermissionsTab()}
          {activeTab === 'analytics' && renderAnalyticsTab()}
        </div>
      </div>

      {/* Create User Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowCreateModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl max-w-md w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-800">Neuen Benutzer erstellen</h3>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <SafeIcon icon={FiX} className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleCreateUser} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Benutzername
                  </label>
                  <input
                    type="text"
                    value={newUser.username}
                    onChange={(e) => setNewUser(prev => ({ ...prev, username: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    E-Mail
                  </label>
                  <input
                    type="email"
                    value={newUser.email}
                    onChange={(e) => setNewUser(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Passwort
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={newUser.password}
                      onChange={(e) => setNewUser(prev => ({ ...prev, password: e.target.value }))}
                      className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <SafeIcon icon={showPassword ? FiEyeOff : FiEye} className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rolle
                  </label>
                  <select
                    value={newUser.role.name}
                    onChange={(e) => setNewUser(prev => ({
                      ...prev,
                      role: Object.values(ROLES).find(r => r.name === e.target.value)
                    }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {Object.values(ROLES).map(role => (
                      <option key={role.name} value={role.name}>
                        {role.displayName}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={newUser.isActive}
                    onChange={(e) => setNewUser(prev => ({ ...prev, isActive: e.target.checked }))}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700">
                    Benutzer ist aktiv
                  </label>
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="flex-1 bg-gray-600 text-white py-2 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Abbrechen
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                  >
                    <SafeIcon icon={FiSave} className="w-4 h-4" />
                    <span>Erstellen</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit User Modal */}
      <AnimatePresence>
        {editingUser && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setEditingUser(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl max-w-md w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-800">Benutzer bearbeiten</h3>
                <button
                  onClick={() => setEditingUser(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <SafeIcon icon={FiX} className="w-6 h-6" />
                </button>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  handleUpdateUser(editingUser.id, {
                    role: editingUser.role,
                    isActive: editingUser.isActive
                  })
                }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Benutzername
                  </label>
                  <input
                    type="text"
                    value={editingUser.username}
                    disabled
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    E-Mail
                  </label>
                  <input
                    type="email"
                    value={editingUser.email}
                    disabled
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rolle
                  </label>
                  <select
                    value={editingUser.role.name}
                    onChange={(e) => setEditingUser(prev => ({
                      ...prev,
                      role: Object.values(ROLES).find(r => r.name === e.target.value)
                    }))}
                    disabled={editingUser.id === currentUser.id}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:text-gray-500"
                  >
                    {Object.values(ROLES).map(role => (
                      <option key={role.name} value={role.name}>
                        {role.displayName}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="editIsActive"
                    checked={editingUser.isActive}
                    onChange={(e) => setEditingUser(prev => ({ ...prev, isActive: e.target.checked }))}
                    disabled={editingUser.id === currentUser.id}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded disabled:opacity-50"
                  />
                  <label htmlFor="editIsActive" className="ml-2 block text-sm text-gray-700">
                    Benutzer ist aktiv
                  </label>
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setEditingUser(null)}
                    className="flex-1 bg-gray-600 text-white py-2 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Abbrechen
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                  >
                    <SafeIcon icon={FiSave} className="w-4 h-4" />
                    <span>Speichern</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default UserRoleManagement