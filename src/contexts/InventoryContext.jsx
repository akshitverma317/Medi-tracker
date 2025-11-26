import React, { createContext, useContext, useCallback, useMemo } from 'react'
import { useStorage } from './StorageContext.jsx'
import { useMedicines } from './MedicineContext.jsx'
import { generateId } from '../utils/idGenerator.js'
import { formatDateISO } from '../utils/dateHelpers.js'
import { addDays } from 'date-fns'

const InventoryContext = createContext(null)

export const useInventory = () => {
  const context = useContext(InventoryContext)
  if (!context) {
    throw new Error('useInventory must be used within InventoryProvider')
  }
  return context
}

export const InventoryProvider = ({ children }) => {
  const { appState, updateState } = useStorage()
  const { getMedicine, updateStock: updateMedicineStock } = useMedicines()

  const refillRecords = useMemo(() => appState?.refillRecords || [], [appState?.refillRecords])

  // Get refill records for a medicine
  const getRefillsByMedicine = useCallback((medicineId) => {
    return refillRecords
      .filter(r => r.medicineId === medicineId)
      .sort((a, b) => new Date(b.date) - new Date(a.date)) // Most recent first
  }, [refillRecords])

  // Calculate daily consumption rate for a medicine
  const calculateDailyConsumption = useCallback((medicine) => {
    if (!medicine || !medicine.timings) {
      return 0
    }

    // For simplicity, daily consumption = number of doses per day
    return medicine.timings.length
  }, [])

  // Calculate refill date based on current stock and consumption
  const calculateRefillDate = useCallback((medicineId) => {
    const medicine = getMedicine(medicineId)
    
    if (!medicine) {
      return null
    }

    const dailyConsumption = calculateDailyConsumption(medicine)
    
    if (dailyConsumption === 0) {
      return null // No consumption, no refill needed
    }

    const daysRemaining = Math.floor(medicine.stockQuantity / dailyConsumption)
    
    if (daysRemaining <= 0) {
      return formatDateISO(new Date()) // Refill needed today
    }

    const refillDate = addDays(new Date(), daysRemaining)
    return formatDateISO(refillDate)
  }, [getMedicine, calculateDailyConsumption])

  // Add refill record
  const addRefill = useCallback((medicineId, quantityAdded, notes = '') => {
    const medicine = getMedicine(medicineId)
    
    if (!medicine) {
      return { success: false, error: 'Medicine not found' }
    }

    if (typeof quantityAdded !== 'number' || quantityAdded <= 0) {
      return { success: false, error: 'Invalid quantity' }
    }

    if (!Number.isInteger(quantityAdded)) {
      return { success: false, error: 'Quantity must be a whole number' }
    }

    // Create refill record
    const refillRecord = {
      id: generateId(),
      medicineId,
      date: formatDateISO(new Date()),
      quantityAdded,
      notes: notes.trim()
    }

    // Update refill records
    const updatedRefillRecords = [...refillRecords, refillRecord]
    
    // Update medicine stock
    const newStockQuantity = medicine.stockQuantity + quantityAdded
    
    updateState({ refillRecords: updatedRefillRecords })
    updateMedicineStock(medicineId, newStockQuantity)

    return {
      success: true,
      refillRecord,
      newStockQuantity
    }
  }, [refillRecords, getMedicine, updateState, updateMedicineStock])

  // Update refill record
  const updateRefill = useCallback((refillId, quantityAdded, notes = '') => {
    const refill = refillRecords.find(r => r.id === refillId)
    
    if (!refill) {
      return { success: false, error: 'Refill record not found' }
    }

    const medicine = getMedicine(refill.medicineId)
    if (!medicine) {
      return { success: false, error: 'Medicine not found' }
    }

    if (typeof quantityAdded !== 'number' || quantityAdded <= 0) {
      return { success: false, error: 'Invalid quantity' }
    }

    if (!Number.isInteger(quantityAdded)) {
      return { success: false, error: 'Quantity must be a whole number' }
    }

    // Calculate stock difference
    const quantityDifference = quantityAdded - refill.quantityAdded
    
    // Update refill record
    const updatedRefill = {
      ...refill,
      quantityAdded,
      notes: notes.trim()
    }

    const updatedRefillRecords = refillRecords.map(r =>
      r.id === refillId ? updatedRefill : r
    )

    // Update medicine stock
    const newStockQuantity = medicine.stockQuantity + quantityDifference
    
    updateState({ refillRecords: updatedRefillRecords })
    updateMedicineStock(refill.medicineId, newStockQuantity)

    return {
      success: true,
      refillRecord: updatedRefill,
      newStockQuantity
    }
  }, [refillRecords, getMedicine, updateState, updateMedicineStock])

  // Delete refill record
  const deleteRefill = useCallback((refillId) => {
    const refill = refillRecords.find(r => r.id === refillId)
    
    if (!refill) {
      return { success: false, error: 'Refill record not found' }
    }

    const medicine = getMedicine(refill.medicineId)
    if (!medicine) {
      return { success: false, error: 'Medicine not found' }
    }

    // Remove refill record
    const updatedRefillRecords = refillRecords.filter(r => r.id !== refillId)

    // Subtract the refill quantity from stock
    const newStockQuantity = medicine.stockQuantity - refill.quantityAdded
    
    updateState({ refillRecords: updatedRefillRecords })
    updateMedicineStock(refill.medicineId, Math.max(0, newStockQuantity))

    return {
      success: true,
      deletedRefill: refill,
      newStockQuantity: Math.max(0, newStockQuantity)
    }
  }, [refillRecords, getMedicine, updateState, updateMedicineStock])

  // Get low stock medicines
  const getLowStockMedicines = useCallback(() => {
    const medicines = appState?.medicines || []
    return medicines.filter(m => m.stockQuantity <= m.lowStockThreshold)
  }, [appState?.medicines])

  // Get medicines that need refill soon (within X days)
  const getMedicinesNeedingRefill = useCallback((daysThreshold = 7) => {
    const medicines = appState?.medicines || []
    const today = new Date()
    const thresholdDate = addDays(today, daysThreshold)

    return medicines.filter(medicine => {
      const refillDateStr = calculateRefillDate(medicine.id)
      if (!refillDateStr) return false

      const refillDate = new Date(refillDateStr)
      return refillDate <= thresholdDate
    }).map(medicine => ({
      ...medicine,
      refillDate: calculateRefillDate(medicine.id),
      daysUntilRefill: Math.floor(
        (new Date(calculateRefillDate(medicine.id)) - today) / (1000 * 60 * 60 * 24)
      )
    }))
  }, [appState?.medicines, calculateRefillDate])

  // Get inventory summary
  const getInventorySummary = useCallback(() => {
    const medicines = appState?.medicines || []
    
    const summary = {
      totalMedicines: medicines.length,
      lowStockCount: getLowStockMedicines().length,
      outOfStockCount: medicines.filter(m => m.stockQuantity === 0).length,
      needsRefillSoon: getMedicinesNeedingRefill(7).length,
      totalStock: medicines.reduce((sum, m) => sum + m.stockQuantity, 0)
    }

    return summary
  }, [appState?.medicines, getLowStockMedicines, getMedicinesNeedingRefill])

  // Update stock quantity (wrapper for medicine context method)
  const updateStock = useCallback((medicineId, newQuantity) => {
    return updateMedicineStock(medicineId, newQuantity)
  }, [updateMedicineStock])

  const value = {
    refillRecords,
    getRefillsByMedicine,
    calculateDailyConsumption,
    calculateRefillDate,
    addRefill,
    updateRefill,
    deleteRefill,
    getLowStockMedicines,
    getMedicinesNeedingRefill,
    getInventorySummary,
    updateStock
  }

  return (
    <InventoryContext.Provider value={value}>
      {children}
    </InventoryContext.Provider>
  )
}

export default InventoryContext
