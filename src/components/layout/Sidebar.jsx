import React from 'react'
import { Link, useLocation } from 'react-router-dom'

/**
 * Sidebar Component
 * 
 * Desktop navigation sidebar
 * Shows on desktop viewports (>1024px)
 */
const Sidebar = () => {
  const location = useLocation()

  const navItems = [
    {
      path: '/',
      label: 'Dashboard',
      icon: '🏠',
      exact: true
    },
    {
      path: '/patients',
      label: 'Patients',
      icon: '👥'
    },
    {
      path: '/medicines',
      label: 'Medicines',
      icon: '💊'
    },
    {
      path: '/calendar',
      label: 'Calendar',
      icon: '📅'
    },
    {
      path: '/inventory',
      label: 'Inventory',
      icon: '📦'
    },
    {
      path: '/history',
      label: 'History',
      icon: '📊'
    },
    {
      path: '/settings',
      label: 'Settings',
      icon: '⚙️'
    }
  ]

  const isActive = (item) => {
    if (item.exact) {
      return location.pathname === item.path
    }
    return location.pathname.startsWith(item.path)
  }

  return (
    <aside className="w-64 bg-white border-r border-neutral-200 min-h-screen sticky top-0">
      {/* Logo/Brand */}
      <div className="p-6 border-b border-neutral-200">
        <h1 className="text-2xl font-bold text-primary-600">
          💊 MediTrack
        </h1>
        <p className="text-sm text-neutral-600 mt-1">
          Medicine Tracker
        </p>
      </div>

      {/* Navigation */}
      <nav className="p-4">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const active = isActive(item)
            
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors min-h-touch ${
                    active
                      ? 'bg-primary-50 text-primary-700 font-semibold'
                      : 'text-neutral-700 hover:bg-neutral-50'
                  }`}
                  aria-current={active ? 'page' : undefined}
                >
                  <span className="text-2xl">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Footer Info */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-neutral-200 bg-neutral-50">
        <p className="text-xs text-neutral-600 text-center">
          Medicine Tracker v1.0.0
        </p>
      </div>
    </aside>
  )
}

export default Sidebar
