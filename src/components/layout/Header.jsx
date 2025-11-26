import React from 'react'
import { useLocation, Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext.jsx'
import { usePatients } from '../../contexts/PatientContext.jsx'
import { useInventory } from '../../contexts/InventoryContext.jsx'
import Button from '../shared/Button.jsx'

/**
 * Header Component
 * 
 * Page header with title and action buttons
 */
const Header = () => {
  const location = useLocation()
  const { user, logout } = useAuth()
  const { selectedPatient } = usePatients()
  const { getInventorySummary } = useInventory()

  // Get page title based on route
  const getPageTitle = () => {
    const path = location.pathname
    
    if (path === '/') return 'Dashboard'
    if (path.startsWith('/patients')) return 'Patients'
    if (path.startsWith('/medicines')) return 'Medicines'
    if (path.startsWith('/calendar')) return 'Calendar'
    if (path.startsWith('/inventory')) return 'Inventory'
    if (path.startsWith('/history')) return 'History'
    if (path.startsWith('/settings')) return 'Settings'
    
    return 'Medicine Tracker'
  }

  const title = getPageTitle()

  return (
    <header className="bg-white border-b border-neutral-200 sticky top-0 z-30">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Title and Patient Info */}
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-primary-600">
              {title}
            </h1>
            {selectedPatient && location.pathname === '/' && (
              <p className="text-sm text-neutral-600 mt-1">
                Viewing: {selectedPatient.name}
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            {/* User Info */}
            <div className="hidden md:block text-right">
              <p className="text-sm font-medium text-neutral-800">
                {user?.role === 'admin' && '👑 '}
                {user?.role === 'caregiver' && '👨‍⚕️ '}
                {user?.role === 'family' && '👨‍👩‍👧 '}
                {user?.name}
              </p>
              <p className="text-xs text-neutral-600 capitalize">{user?.role}</p>
            </div>

            {/* Quick Add Medicine Button */}
            {(location.pathname === '/' || location.pathname === '/medicines') && (
              <Link
                to="/medicines/add"
                className="btn btn-primary hidden md:inline-flex"
                aria-label="Add Medicine"
              >
                + Add Medicine
              </Link>
            )}

            {/* Notifications/Alerts Indicator */}
            <NotificationBadge />

            {/* Logout Button */}
            <Button
              variant="outline"
              size="small"
              onClick={logout}
              className="hidden md:inline-flex"
            >
              Logout
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}

/**
 * NotificationBadge Component
 * Shows count of critical alerts
 */
const NotificationBadge = () => {
  const { getInventorySummary } = useInventory()
  
  try {
    const summary = getInventorySummary()
    const alertCount = summary.criticalAlerts + summary.warningAlerts

    if (alertCount === 0) return null

    return (
      <button
        className="relative p-2 text-neutral-600 hover:text-primary-600 transition-colors"
        aria-label={`${alertCount} notifications`}
      >
        <span className="text-2xl">🔔</span>
        {alertCount > 0 && (
          <span className="absolute top-0 right-0 bg-danger-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
            {alertCount > 9 ? '9+' : alertCount}
          </span>
        )}
      </button>
    )
  } catch (error) {
    return null
  }
}

export default Header
