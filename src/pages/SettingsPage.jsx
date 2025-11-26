import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext.jsx'
import { useStorage } from '../contexts/StorageContext.jsx'
import Card from '../components/shared/Card.jsx'
import Button from '../components/shared/Button.jsx'
import Input from '../components/shared/Input.jsx'
import ConfirmDialog from '../components/shared/ConfirmDialog.jsx'
import NotificationSettings from '../components/shared/NotificationSettings.jsx'
import notificationScheduler from '../services/NotificationScheduler.js'

/**
 * SettingsPage Component
 * 
 * App preferences and data management
 */
const SettingsPage = () => {
  const { user, logout } = useAuth()
  const { appState, exportData, importData, clearAllData, isStorageAvailable } = useStorage()
  const [importFile, setImportFile] = useState(null)
  const [clearConfirm, setClearConfirm] = useState(false)
  const [message, setMessage] = useState(null)
  const [schedulerStatus, setSchedulerStatus] = useState(notificationScheduler.getStatus())

  // Update scheduler status every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setSchedulerStatus(notificationScheduler.getStatus())
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const handleExport = () => {
    const result = exportData()
    
    if (result.success) {
      setMessage({ type: 'success', text: 'Data exported successfully!' })
    } else {
      setMessage({ type: 'error', text: result.error || 'Failed to export data' })
    }
  }

  const handleImportFile = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      setImportFile(file)
    }
  }

  const handleImport = async () => {
    if (!importFile) {
      setMessage({ type: 'error', text: 'Please select a file to import' })
      return
    }

    try {
      const text = await importFile.text()
      const result = await importData(text, 'replace')
      
      if (result.success) {
        setMessage({ type: 'success', text: 'Data imported successfully! Refreshing...' })
        setTimeout(() => window.location.reload(), 1500)
      } else {
        setMessage({ type: 'error', text: result.errors?.join(', ') || 'Failed to import data' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to read file' })
    }
  }

  const handleClearData = async () => {
    const result = await clearAllData()
    
    if (result.success) {
      setMessage({ type: 'success', text: 'All data cleared! Refreshing...' })
      setTimeout(() => window.location.reload(), 1500)
    } else {
      setMessage({ type: 'error', text: result.error || 'Failed to clear data' })
    }
    
    setClearConfirm(false)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-neutral-800">Settings</h2>
        <p className="text-neutral-600 mt-1">
          App preferences and data management
        </p>
      </div>

      {/* Message */}
      {message && (
        <div className={`p-4 rounded-lg ${
          message.type === 'success' 
            ? 'bg-success-50 text-success-800 border-l-4 border-success-500'
            : 'bg-danger-50 text-danger-800 border-l-4 border-danger-500'
        }`}>
          {message.text}
        </div>
      )}

      {/* Notification Settings */}
      <NotificationSettings />

      {/* Storage Status */}
      <Card title="Storage Status">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-neutral-700">Storage Available:</span>
            <span className={`font-semibold ${isStorageAvailable ? 'text-success-600' : 'text-danger-600'}`}>
              {isStorageAvailable ? '✓ Yes' : '✗ No'}
            </span>
          </div>
          
          {appState && (
            <>
              <div className="flex items-center justify-between">
                <span className="text-neutral-700">Patients:</span>
                <span className="font-semibold text-neutral-800">{appState.patients.length}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-neutral-700">Medicines:</span>
                <span className="font-semibold text-neutral-800">{appState.medicines.length}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-neutral-700">Dose Records:</span>
                <span className="font-semibold text-neutral-800">{appState.doseRecords.length}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-neutral-700">Refill Records:</span>
                <span className="font-semibold text-neutral-800">{appState.refillRecords.length}</span>
              </div>
            </>
          )}
        </div>
      </Card>

      {/* Data Export */}
      {user?.permissions?.canExportData && (
        <Card title="Export Data">
          <p className="text-neutral-600 mb-4">
            Download all your data as a JSON file for backup or transfer.
          </p>
          <Button variant="primary" onClick={handleExport}>
            📥 Export Data
          </Button>
        </Card>
      )}

      {/* Data Import */}
      {user?.permissions?.canImportData && (
        <Card title="Import Data">
          <p className="text-neutral-600 mb-4">
            Import data from a previously exported JSON file. This will replace all current data.
          </p>
          
          <div className="space-y-4">
            <Input
              type="file"
              accept=".json"
              onChange={handleImportFile}
              label="Select JSON File"
            />
            
            {importFile && (
              <div className="bg-neutral-50 p-3 rounded">
                <p className="text-sm text-neutral-700">
                  Selected: <span className="font-medium">{importFile.name}</span>
                </p>
              </div>
            )}
            
            <Button 
              variant="primary" 
              onClick={handleImport}
              disabled={!importFile}
            >
              📤 Import Data
            </Button>
          </div>
        </Card>
      )}

      {/* User Account */}
      <Card title="Account">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-neutral-700">Logged in as:</span>
            <span className="font-semibold text-neutral-800">
              {user?.role === 'admin' && '👑 '}
              {user?.role === 'caregiver' && '👨‍⚕️ '}
              {user?.role === 'family' && '👨‍👩‍👧 '}
              {user?.name}
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-neutral-700">Username:</span>
            <span className="font-semibold text-neutral-800">@{user?.username}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-neutral-700">Role:</span>
            <span className="font-semibold text-neutral-800 capitalize">{user?.role}</span>
          </div>
          
          <div className="pt-2 border-t border-neutral-200">
            <p className="text-xs text-neutral-600 mb-2">Permissions:</p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className={user?.permissions?.canEditPatients ? 'text-success-600' : 'text-neutral-400'}>
                {user?.permissions?.canEditPatients ? '✓' : '✗'} Edit Patients
              </div>
              <div className={user?.permissions?.canEditMedicines ? 'text-success-600' : 'text-neutral-400'}>
                {user?.permissions?.canEditMedicines ? '✓' : '✗'} Edit Medicines
              </div>
              <div className={user?.permissions?.canDeletePatients ? 'text-success-600' : 'text-neutral-400'}>
                {user?.permissions?.canDeletePatients ? '✓' : '✗'} Delete Patients
              </div>
              <div className={user?.permissions?.canDeleteMedicines ? 'text-success-600' : 'text-neutral-400'}>
                {user?.permissions?.canDeleteMedicines ? '✓' : '✗'} Delete Medicines
              </div>
              <div className={user?.permissions?.canManageInventory ? 'text-success-600' : 'text-neutral-400'}>
                {user?.permissions?.canManageInventory ? '✓' : '✗'} Manage Inventory
              </div>
              <div className={user?.permissions?.canExportData ? 'text-success-600' : 'text-neutral-400'}>
                {user?.permissions?.canExportData ? '✓' : '✗'} Export Data
              </div>
            </div>
          </div>
          
          <div className="pt-2">
            <Button variant="outline" onClick={logout}>
              🚪 Sign Out
            </Button>
          </div>
        </div>
      </Card>

      {/* App Information */}
      <Card title="About">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-neutral-700">App Name:</span>
            <span className="font-semibold text-neutral-800">Medicine Tracker</span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-neutral-700">Version:</span>
            <span className="font-semibold text-neutral-800">1.0.0</span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-neutral-700">Build:</span>
            <span className="font-semibold text-neutral-800">Production</span>
          </div>
        </div>
      </Card>

      {/* Danger Zone */}
      {user?.permissions?.canClearData && (
        <Card title="⚠️ Danger Zone" className="border-danger-200">
          <p className="text-neutral-600 mb-4">
            Permanently delete all data. This action cannot be undone.
          </p>
          <Button 
            variant="danger" 
            onClick={() => setClearConfirm(true)}
          >
            🗑️ Clear All Data
          </Button>
        </Card>
      )}

      {/* Clear Confirmation Dialog */}
      <ConfirmDialog
        isOpen={clearConfirm}
        onClose={() => setClearConfirm(false)}
        onConfirm={handleClearData}
        title="Clear All Data"
        message="Are you sure you want to delete all data? This will remove all patients, medicines, doses, and refill records. This action cannot be undone."
        confirmLabel="Delete Everything"
        variant="danger"
      />
    </div>
  )
}

export default SettingsPage
