import React from 'react'
import { Link, useLocation } from 'react-router-dom'

/**
 * BottomTabBar Component
 * 
 * Mobile navigation bar with primary tabs
 * Shows on mobile viewports (<768px)
 */
const BottomTabBar = () => {
  const location = useLocation()

  const tabs = [
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
      path: '/more',
      label: 'More',
      icon: '⋯'
    }
  ]

  const isActive = (tab) => {
    if (tab.exact) {
      return location.pathname === tab.path
    }
    return location.pathname.startsWith(tab.path)
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-200 shadow-lg z-40">
      <div className="flex justify-around items-center h-16">
        {tabs.map((tab) => {
          const active = isActive(tab)
          
          return (
            <Link
              key={tab.path}
              to={tab.path}
              className={`flex flex-col items-center justify-center flex-1 h-full min-w-touch transition-colors ${
                active
                  ? 'text-primary-600'
                  : 'text-neutral-600 hover:text-primary-500'
              }`}
              aria-current={active ? 'page' : undefined}
            >
              <span className="text-2xl mb-1">{tab.icon}</span>
              <span className="text-xs font-medium">{tab.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

export default BottomTabBar
