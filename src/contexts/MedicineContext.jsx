import React, { createContext, useContext, useCallback, useMemo } from 'react'
import { useStorage } from './StorageContext.jsx'
import { generateId } from '../utils/idGenerator.js'
import { validateMedicine } from '../utils/validation.js'

const MedicineContext = createContext(null)

export const useMedicines = () => {
  const context = useContext(MedicineContext)
  if (!context) {
    throw new Error('useMedicines must be used within MedicineProvider')
  }
  return context
}

export const MedicineProvider = ({ children }) => {
  const { appState, updateState } = useStorage()

  const medicines = useMemo(() => appState?.medicines || [], [appState?.medicines])

  // Get medicine by ID
  const getMedicine = useCallback((id) => {
    return medicines.find(m => m.id === id) || null
  }, [medicines])

  // Get medicines by patient ID
  const getMedicinesByPatient = useCallback((patientId) => {
    return medicines.filter(m => m.patientId === patientId)
  }, [medicines])

  // Add new medicine
  const addMedicine = useCallback((medicineData) => {
    // Validate medicine data
    const validation = validateMedicine(medicineData)
    if (!validation.valid) {
      return {
        success: false,
        errors: validation.errors
      }
    }

    const now = new Date().toISOString()
    const newMedicine = {
      id: generateId(),
      patientId: medicineData.patientId,
      name: medicineData.name.trim(),
      dosage: medicineData.dosage.trim(),
      frequency: medicineData.frequency,
      timings: medicineData.timings,
      category: medicineData.category,
      notes: medicineData.notes?.trim() || '',
      stockQuantity: medicineData.stockQuantity,
      lowStockThreshold: medicineData.lowStockThreshold,
      reminderMinutesBefore: medicineData.reminderMinutesBefore,
      startDate: medicineData.startDate,
      endDate: medicineData.endDate || null,
      createdAt: now,
      updatedAt: now
    }

    const updatedMedicines = [...medicines, newMedicine]
    updateState({ medicines: updatedMedicines })

    return {
      success: true,
      medicine: newMedicine
    }
  }, [medicines, updateState])

  // Update existing medicine
  const updateMedicine = useCallback((id, updates) => {
    const existingMedicine = getMedicine(id)
    if (!existingMedicine) {
      return {
        success: false,
        errors: { general: 'Medicine not found' }
      }
    }

    // Merge updates with existing data
    const updatedData = {
      ...existingMedicine,
      ...updates,
      id: existingMedicine.id, // Preserve ID
      createdAt: existingMedicine.createdAt, // Preserve creation time
      updatedAt: new Date().toISOString()
    }

    // Validate updated data
    const validation = validateMedicine(updatedData)
    if (!validation.valid) {
      return {
        success: false,
        errors: validation.errors
      }
    }

    const updatedMedicines = medicines.map(m =>
      m.id === id ? updatedData : m
    )

    updateState({ medicines: updatedMedicines })

    return {
      success: true,
      medicine: updatedData
    }
  }, [medicines, getMedicine, updateState])

  // Delete medicine
  const deleteMedicine = useCallback((id) => {
    const medicine = getMedicine(id)
    if (!medicine) {
      return {
        success: false,
        error: 'Medicine not found'
      }
    }

    // Remove medicine
    const updatedMedicines = medicines.filter(m => m.id !== id)
    
    // Remove all dose records for this medicine
    const updatedDoseRecords = (appState?.doseRecords || []).filter(d => d.medicineId !== id)
    
    // Remove all refill records for this medicine
    const updatedRefillRecords = (appState?.refillRecords || []).filter(r => r.medicineId !== id)

    updateState({
      medicines: updatedMedicines,
      doseRecords: updatedDoseRecords,
      refillRecords: updatedRefillRecords
    })

    return {
      success: true,
      deletedMedicine: medicine
    }
  }, [medicines, appState, getMedicine, updateState])

  // Update stock quantity
  const updateStock = useCallback((medicineId, newQuantity) => {
    const medicine = getMedicine(medicineId)
    if (!medicine) {
      return { success: false, error: 'Medicine not found' }
    }

    if (typeof newQuantity !== 'number' || newQuantity < 0) {
      return { success: false, error: 'Invalid stock quantity' }
    }

    return updateMedicine(medicineId, { stockQuantity: newQuantity })
  }, [getMedicine, updateMedicine])

  // Decrement stock (when dose is taken)
  const decrementStock = useCallback((medicineId) => {
    const medicine = getMedicine(medicineId)
    if (!medicine) {
      return { success: false, error: 'Medicine not found' }
    }

    const newQuantity = Math.max(0, medicine.stockQuantity - 1)
    return updateStock(medicineId, newQuantity)
  }, [getMedicine, updateStock])

  // Get low stock medicines
  const getLowStockMedicines = useCallback(() => {
    return medicines.filter(m => m.stockQuantity <= m.lowStockThreshold)
  }, [medicines])

  // Search medicines by name
  const searchMedicines = useCallback((query) => {
    if (!query || query.trim() === '') {
      return medicines
    }

    const lowerQuery = query.toLowerCase().trim()
    return medicines.filter(m =>
      m.name.toLowerCase().includes(lowerQuery)
    )
  }, [medicines])

  // Sort medicines
  const sortMedicines = useCallback((medicineList, sortBy = 'name') => {
    const sorted = [...medicineList]

    switch (sortBy) {
      case 'name':
        return sorted.sort((a, b) => a.name.localeCompare(b.name))
      
      case 'patient':
        return sorted.sort((a, b) => a.patientId.localeCompare(b.patientId))
      
      case 'time':
        return sorted.sort((a, b) => {
          const timeA = a.timings[0] || '00:00'
          const timeB = b.timings[0] || '00:00'
          return timeA.localeCompare(timeB)
        })
      
      case 'stock':
        return sorted.sort((a, b) => a.stockQuantity - b.stockQuantity)
      
      default:
        return sorted
    }
  }, [])

  // Check for duplicate medicines (same name and dosage)
  const checkDuplicates = useCallback((name, dosage, excludeId = null) => {
    const nameLower = name.toLowerCase().trim()
    const dosageLower = dosage.toLowerCase().trim()

    return medicines.filter(m => {
      if (excludeId && m.id === excludeId) return false
      return m.name.toLowerCase().trim() === nameLower && 
             m.dosage.toLowerCase().trim() === dosageLower
    })
  }, [medicines])

  const value = {
    medicines,
    getMedicine,
    getMedicinesByPatient,
    addMedicine,
    updateMedicine,
    deleteMedicine,
    updateStock,
    decrementStock,
    getLowStockMedicines,
    searchMedicines,
    sortMedicines,
    checkDuplicates
  }

  return (
    <MedicineContext.Provider value={value}>
      {children}
    </MedicineContext.Provider>
  )
}

export default MedicineContext
