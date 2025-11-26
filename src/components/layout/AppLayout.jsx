import React from 'react'
import { useLocation } from 'react-router-dom'
import Header from './Header.jsx'
import BottomTabBar from './BottomTabBar.jsx'
import Sidebar from './Sidebar.jsx'

/**
 * AppLayout Component
 * 
 * Main layout wrapper with responsive navigation
 * - Mobile (<768px): Bottom tab bar
 * - Desktop (>1024px): Sidebar
 */
const AppLayout = ({ children }) => {
  const location = useLocation()

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col md:flex-row">
      {/* Desktop Sidebar - hidden on mobile */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Header */}
        <Header />

        {/* Page Content */}
        <main className="flex-1 container mx-auto px-4 py-6 pb-20 md:pb-6">
          {children}
        </main>

        {/* Mobile Bottom Tab Bar - hidden on desktop */}
        <div className="lg:hidden">
          <BottomTabBar />
        </div>
      </div>
    </div>
  )
}

export default AppLayout
