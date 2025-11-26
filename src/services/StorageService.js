/**
 * StorageService
 * 
 * Handles all data persistence operations using window.storage API.
 * Provides error handling and graceful degradation if storage is unavailable.
 */

import { STORAGE_KEY, STORAGE_VERSION, DEFAULT_SETTINGS } from '../types/constants.js'

/**
 * Check if window.storage API is available
 * @returns {boolean}
 */
export const isStorageAvailable = () => {
  try {
    // Check if window.storage exists
    if (typeof window === 'undefined' || !window.storage) {
      return false
    }
    
    // Test if we can actually use it
    const testKey = '__storage_test__'
    window.storage.setItem(testKey, 'test')
    window.storage.removeItem(testKey)
    return true
  } catch (error) {
    console.error('Storage availability check failed:', error)
    return false
  }
}

/**
 * Create initial empty state
 * @returns {import('../types/index.js').AppState}
 */
export const createInitialState = () => ({
  patients: [],
  medicines: [],
  doseRecords: [],
  refillRecords: [],
  settings: { ...DEFAULT_SETTINGS }
})

/**
 * Save data to storage
 * @param {import('../types/index.js').AppState} data
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export const saveData = async (data) => {
  try {
    if (!isStorageAvailable()) {
      throw new Error('Storage API is not available')
    }

    const storageData = {
      version: STORAGE_VERSION,
      lastModified: new Date().toISOString(),
      ...data
    }

    const jsonString = JSON.stringify(storageData)
    window.storage.setItem(STORAGE_KEY, jsonString)

    return { success: true }
  } catch (error) {
    console.error('Failed to save data:', error)
    return {
      success: false,
      error: error.message || 'Failed to save data to storage'
    }
  }
}

/**
 * Load data from storage
 * @returns {Promise<{success: boolean, data?: import('../types/index.js').AppState, error?: string}>}
 */
export const loadData = async () => {
  try {
    if (!isStorageAvailable()) {
      throw new Error('Storage API is not available')
    }

    const jsonString = window.storage.getItem(STORAGE_KEY)
    
    if (!jsonString) {
      // No data exists yet, return initial state
      return {
        success: true,
        data: createInitialState()
      }
    }

    const storageData = JSON.parse(jsonString)
    
    // Validate version (for future migrations)
    if (storageData.version !== STORAGE_VERSION) {
      console.warn(`Storage version mismatch: ${storageData.version} vs ${STORAGE_VERSION}`)
      // For now, we'll still load it, but in future we might need migration logic
    }

    // Extract app state (remove metadata)
    const { version, lastModified, ...appState } = storageData

    // Ensure all required fields exist
    const data = {
      patients: appState.patients || [],
      medicines: appState.medicines || [],
      doseRecords: appState.doseRecords || [],
      refillRecords: appState.refillRecords || [],
      settings: { ...DEFAULT_SETTINGS, ...appState.settings }
    }

    return { success: true, data }
  } catch (error) {
    console.error('Failed to load data:', error)
    return {
      success: false,
      error: error.message || 'Failed to load data from storage',
      data: createInitialState() // Return initial state as fallback
    }
  }
}

/**
 * Export data as downloadable JSON
 * @param {import('../types/index.js').AppState} data
 * @returns {{success: boolean, blob?: Blob, error?: string}}
 */
export const exportData = (data) => {
  try {
    const exportData = {
      version: STORAGE_VERSION,
      exportedAt: new Date().toISOString(),
      ...data
    }

    const jsonString = JSON.stringify(exportData, null, 2)
    const blob = new Blob([jsonString], { type: 'application/json' })

    return { success: true, blob }
  } catch (error) {
    console.error('Failed to export data:', error)
    return {
      success: false,
      error: error.message || 'Failed to export data'
    }
  }
}

/**
 * Validate imported data structure
 * @param {any} data
 * @returns {{valid: boolean, errors: string[]}}
 */
export const validateImportData = (data) => {
  const errors = []

  if (!data || typeof data !== 'object') {
    errors.push('Invalid data format: must be an object')
    return { valid: false, errors }
  }

  // Check for required fields
  if (!Array.isArray(data.patients)) {
    errors.push('Missing or invalid "patients" array')
  }

  if (!Array.isArray(data.medicines)) {
    errors.push('Missing or invalid "medicines" array')
  }

  if (!Array.isArray(data.doseRecords)) {
    errors.push('Missing or invalid "doseRecords" array')
  }

  if (!Array.isArray(data.refillRecords)) {
    errors.push('Missing or invalid "refillRecords" array')
  }

  if (!data.settings || typeof data.settings !== 'object') {
    errors.push('Missing or invalid "settings" object')
  }

  // Validate patient structure
  if (Array.isArray(data.patients)) {
    data.patients.forEach((patient, index) => {
      if (!patient.id || typeof patient.id !== 'string') {
        errors.push(`Patient ${index}: missing or invalid id`)
      }
      if (!patient.name || typeof patient.name !== 'string') {
        errors.push(`Patient ${index}: missing or invalid name`)
      }
      if (typeof patient.age !== 'number') {
        errors.push(`Patient ${index}: missing or invalid age`)
      }
    })
  }

  // Validate medicine structure
  if (Array.isArray(data.medicines)) {
    data.medicines.forEach((medicine, index) => {
      if (!medicine.id || typeof medicine.id !== 'string') {
        errors.push(`Medicine ${index}: missing or invalid id`)
      }
      if (!medicine.name || typeof medicine.name !== 'string') {
        errors.push(`Medicine ${index}: missing or invalid name`)
      }
      if (!medicine.patientId || typeof medicine.patientId !== 'string') {
        errors.push(`Medicine ${index}: missing or invalid patientId`)
      }
    })
  }

  return {
    valid: errors.length === 0,
    errors
  }
}

/**
 * Import data from JSON
 * @param {string} jsonString
 * @returns {{success: boolean, data?: import('../types/index.js').AppState, errors?: string[]}}
 */
export const importData = (jsonString) => {
  try {
    const parsedData = JSON.parse(jsonString)
    
    // Remove metadata fields if present
    const { version, exportedAt, lastModified, ...appState } = parsedData

    // Validate structure
    const validation = validateImportData(appState)
    
    if (!validation.valid) {
      return {
        success: false,
        errors: validation.errors
      }
    }

    // Ensure all required fields exist with defaults
    const data = {
      patients: appState.patients || [],
      medicines: appState.medicines || [],
      doseRecords: appState.doseRecords || [],
      refillRecords: appState.refillRecords || [],
      settings: { ...DEFAULT_SETTINGS, ...appState.settings }
    }

    return { success: true, data }
  } catch (error) {
    console.error('Failed to import data:', error)
    return {
      success: false,
      errors: [error.message || 'Failed to parse JSON data']
    }
  }
}

/**
 * Clear all data from storage
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export const clearData = async () => {
  try {
    if (!isStorageAvailable()) {
      throw new Error('Storage API is not available')
    }

    window.storage.removeItem(STORAGE_KEY)
    return { success: true }
  } catch (error) {
    console.error('Failed to clear data:', error)
    return {
      success: false,
      error: error.message || 'Failed to clear storage'
    }
  }
}

export default {
  isStorageAvailable,
  createInitialState,
  saveData,
  loadData,
  exportData,
  importData,
  validateImportData,
  clearData
}
