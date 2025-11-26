import React, { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext.jsx'
import { AppProviders } from './contexts/AppProviders.jsx'
import { useStorage } from './contexts/StorageContext.jsx'
import { useSchedule } from './contexts/ScheduleContext.jsx'
import { useMedicines } from './contexts/MedicineContext.jsx'
import { usePatients } from './contexts/PatientContext.jsx'
import AppLayout from './components/layout/AppLayout.jsx'
import LoadingSpinner from './components/shared/LoadingSpinner.jsx'
import ErrorMessage from './components/shared/ErrorMessage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import notificationScheduler from './services/NotificationScheduler.js'
import Dashboard from './pages/Dashboard.jsx'
import PatientListPage from './pages/PatientListPage.jsx'
import PatientDetailPage from './pages/PatientDetailPage.jsx'
import AddEditPatientPage from './pages/AddEditPatientPage.jsx'
import MedicineListPage from './pages/MedicineListPage.jsx'
import AddEditMedicinePage from './pages/AddEditMedicinePage.jsx'
import CalendarPage from './pages/CalendarPage.jsx'
import InventoryPage from './pages/InventoryPage.jsx'
import HistoryPage from './pages/HistoryPage.jsx'
import SettingsPage from './pages/SettingsPage.jsx'
import ComingSoon from './pages/ComingSoon.jsx'

function AppContent() {
  const { isAuthenticated, isLoading: authLoading } = useAuth()
  const { isLoading, error, isStorageAvailable } = useStorage()
  const scheduleContext = useSchedule()
  const medicineContext = useMedicines()
  const patientContext = usePatients()

  // Start notification scheduler when app loads
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      console.log('Starting notification scheduler...')
      notificationScheduler.start(scheduleContext, medicineContext, patientContext)

      // Cleanup on unmount
      return () => {
        notificationScheduler.stop()
      }
    }
  }, [isAuthenticated, isLoading, scheduleContext, medicineContext, patientContext])

  // Show auth loading first
  if (authLoading) {
    return <LoadingSpinner fullScreen text="Checking authentication..." />
  }

  // Show login if not authenticated
  if (!isAuthenticated) {
    return <LoginPage />
  }

  // Show app loading
  if (isLoading) {
    return <LoadingSpinner fullScreen text="Loading Medicine Tracker..." />
  }

  return (
    <>
      {/* Storage Warning */}
      {!isStorageAvailable && (
        <div className="fixed top-0 left-0 right-0 z-50">
          <ErrorMessage
            variant="warning"
            title="Storage Unavailable"
            message="Your data will not persist across sessions."
          />
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="fixed top-0 left-0 right-0 z-50">
          <ErrorMessage
            variant="danger"
            title="Error"
            message={error}
          />
        </div>
      )}

      {/* Main App Layout with Routes */}
      <AppLayout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/patients" element={<PatientListPage />} />
          <Route path="/patients/add" element={<AddEditPatientPage />} />
          <Route path="/patients/:id" element={<PatientDetailPage />} />
          <Route path="/patients/:id/edit" element={<AddEditPatientPage />} />
          <Route path="/medicines" element={<MedicineListPage />} />
          <Route path="/medicines/add" element={<AddEditMedicinePage />} />
          <Route path="/medicines/:id/edit" element={<AddEditMedicinePage />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/inventory" element={<InventoryPage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/more" element={<ComingSoon pageName="More" />} />
          <Route path="*" element={<ComingSoon pageName="Page Not Found" />} />
        </Routes>
      </AppLayout>
    </>
  )
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppProviders>
          <AppContent />
        </AppProviders>
      </AuthProvider>
    </Router>
  )
}

export default App
