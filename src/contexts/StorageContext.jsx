import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import StorageService from '../services/StorageService.js'

const StorageContext = createContext(null)

export const useStorage = () => {
  const context = useContext(StorageContext)
  if (!context) {
    throw new Error('useStorage must be used within StorageProvider')
  }
  return context
}

export const StorageProvider = ({ children }) => {
  const [appState, setAppState] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isStorageAvailable, setIsStorageAvailable] = useState(true)

  // Load data on mount
  useEffect(() => {
    const loadInitialData = async () => {
      setIsLoading(true)
      setError(null)

      // Check storage availability
      const available = StorageService.isStorageAvailable()
      setIsStorageAvailable(available)

      if (!available) {
        setError('Storage is not available. Data will not persist across sessions.')
        setAppState(StorageService.createInitialState())
        setIsLoading(false)
        return
      }

      // Load data
      const result = await StorageService.loadData()
      
      if (result.success) {
        setAppState(result.data)
      } else {
        setError(result.error)
        setAppState(result.data) // Use fallback initial state
      }

      setIsLoading(false)
    }

    loadInitialData()
  }, [])

  // Save data to storage
  const saveData = useCallback(async (newState) => {
    if (!isStorageAvailable) {
      // Update in-memory state only
      setAppState(newState)
      return { success: true }
    }

    const result = await StorageService.saveData(newState)
    
    if (result.success) {
      setAppState(newState)
      setError(null)
    } else {
      setError(result.error)
    }

    return result
  }, [isStorageAvailable])

  // Update app state (convenience method)
  const updateState = useCallback((updates) => {
    setAppState(prevState => {
      const newState = { ...prevState, ...updates }
      // Save asynchronously
      if (isStorageAvailable) {
        StorageService.saveData(newState).catch(err => {
          console.error('Failed to save state:', err)
          setError('Failed to save changes')
        })
      }
      return newState
    })
  }, [isStorageAvailable])

  // Export data
  const exportData = useCallback(() => {
    if (!appState) {
      return { success: false, error: 'No data to export' }
    }

    const result = StorageService.exportData(appState)
    
    if (result.success && result.blob) {
      // Trigger download
      const url = URL.createObjectURL(result.blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `medicine-tracker-backup-${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    }

    return result
  }, [appState])

  // Import data
  const importData = useCallback(async (jsonString, mode = 'replace') => {
    const result = StorageService.importData(jsonString)
    
    if (!result.success) {
      return result
    }

    let newState
    if (mode === 'replace') {
      newState = result.data
    } else if (mode === 'merge') {
      // Merge imported data with existing data
      newState = {
        patients: [...appState.patients, ...result.data.patients],
        medicines: [...appState.medicines, ...result.data.medicines],
        doseRecords: [...appState.doseRecords, ...result.data.doseRecords],
        refillRecords: [...appState.refillRecords, ...result.data.refillRecords],
        settings: { ...appState.settings, ...result.data.settings }
      }
    }

    const saveResult = await saveData(newState)
    return saveResult
  }, [appState, saveData])

  // Clear all data
  const clearAllData = useCallback(async () => {
    const result = await StorageService.clearData()
    
    if (result.success) {
      const initialState = StorageService.createInitialState()
      setAppState(initialState)
      setError(null)
    }

    return result
  }, [])

  const value = {
    appState,
    isLoading,
    error,
    isStorageAvailable,
    saveData,
    updateState,
    exportData,
    importData,
    clearAllData
  }

  return (
    <StorageContext.Provider value={value}>
      {children}
    </StorageContext.Provider>
  )
}

export default StorageContext
