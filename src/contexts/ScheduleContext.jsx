import React, { createContext, useContext, useCallback, useMemo } from 'react'
import { useStorage } from './StorageContext.jsx'
import { useMedicines } from './MedicineContext.jsx'
import { generateId } from '../utils/idGenerator.js'
import { combineDateAndTime, isOverdue, isSameDay, getTodayISO } from '../utils/dateHelpers.js'
import { DOSE_STATUS, OVERDUE_THRESHOLD_MINUTES } from '../types/constants.js'

const ScheduleContext = createContext(null)

export const useSchedule = () => {
  const context = useContext(ScheduleContext)
  if (!context) {
    throw new Error('useSchedule must be used within ScheduleProvider')
  }
  return context
}

export const ScheduleProvider = ({ children }) => {
  const { appState, updateState } = useStorage()
  const { getMedicine, decrementStock } = useMedicines()

  const doseRecords = useMemo(() => appState?.doseRecords || [], [appState?.doseRecords])

  // Get dose record by ID
  const getDoseRecord = useCallback((id) => {
    return doseRecords.find(d => d.id === id) || null
  }, [doseRecords])

  // Generate doses for a medicine on a specific date
  const generateDosesForDate = useCallback((medicine, dateStr) => {
    if (!medicine || !medicine.timings || medicine.timings.length === 0) {
      return []
    }

    // Check if date is within medicine's active period
    const date = new Date(dateStr)
    const startDate = new Date(medicine.startDate)
    
    if (date < startDate) {
      return [] // Medicine not started yet
    }

    if (medicine.endDate) {
      const endDate = new Date(medicine.endDate)
      if (date > endDate) {
        return [] // Medicine period ended
      }
    }

    // Generate dose for each timing
    return medicine.timings.map(timeStr => {
      const scheduledTime = combineDateAndTime(dateStr, timeStr)
      
      // Check if dose record already exists
      const existing = doseRecords.find(d =>
        d.medicineId === medicine.id &&
        d.scheduledTime === scheduledTime
      )

      if (existing) {
        return existing
      }

      // Create new dose record
      return {
        id: generateId(),
        medicineId: medicine.id,
        patientId: medicine.patientId,
        scheduledTime,
        status: DOSE_STATUS.UPCOMING,
        actualTime: null,
        notes: ''
      }
    })
  }, [doseRecords])

  // Get doses for a specific date
  const getDosesForDate = useCallback((dateStr, patientId = null) => {
    const medicines = appState?.medicines || []
    const allDoses = []

    medicines.forEach(medicine => {
      // Filter by patient if specified
      if (patientId && medicine.patientId !== patientId) {
        return
      }

      const doses = generateDosesForDate(medicine, dateStr)
      allDoses.push(...doses)
    })

    // Update status for existing doses
    const updatedDoses = allDoses.map(dose => {
      if (dose.status === DOSE_STATUS.UPCOMING && isOverdue(dose.scheduledTime, OVERDUE_THRESHOLD_MINUTES)) {
        return { ...dose, status: DOSE_STATUS.OVERDUE }
      }
      return dose
    })

    // Sort by scheduled time
    return updatedDoses.sort((a, b) =>
      new Date(a.scheduledTime) - new Date(b.scheduledTime)
    )
  }, [appState?.medicines, generateDosesForDate])

  // Get today's doses
  const getTodayDoses = useCallback((patientId = null) => {
    return getDosesForDate(getTodayISO(), patientId)
  }, [getDosesForDate])

  // Get daily schedule (sorted chronologically)
  const getDailySchedule = useCallback((dateStr, patientId = null) => {
    return getDosesForDate(dateStr, patientId)
  }, [getDosesForDate])

  // Mark dose as taken
  const markDoseTaken = useCallback((doseIdOrDose, notes = '') => {
    // Handle both dose ID (string) and dose object
    let dose = null
    let doseId = null
    
    if (typeof doseIdOrDose === 'string') {
      doseId = doseIdOrDose
      // First try to find in stored records
      dose = getDoseRecord(doseId)
      
      // If not found in storage, try to find in today's generated doses
      if (!dose) {
        const todayDoses = getDosesForDate(getTodayISO())
        dose = todayDoses.find(d => d.id === doseId)
      }
    } else {
      // Dose object passed directly
      dose = doseIdOrDose
      doseId = dose.id
    }
    
    if (!dose) {
      console.error('Dose not found:', doseId)
      return { success: false, error: 'Dose not found' }
    }

    if (dose.status === DOSE_STATUS.TAKEN) {
      return { success: false, error: 'Dose already marked as taken' }
    }

    const now = new Date().toISOString()
    const updatedDose = {
      ...dose,
      status: DOSE_STATUS.TAKEN,
      actualTime: now,
      notes: notes || dose.notes || ''
    }

    // Check if dose already exists in storage by matching medicineId and scheduledTime
    const existingDose = doseRecords.find(d => 
      d.medicineId === dose.medicineId && 
      d.scheduledTime === dose.scheduledTime
    )
    
    let updatedDoseRecords
    
    if (existingDose) {
      // Update existing dose
      updatedDoseRecords = doseRecords.map(d =>
        d.medicineId === dose.medicineId && d.scheduledTime === dose.scheduledTime
          ? updatedDose
          : d
      )
    } else {
      // Add new dose
      updatedDoseRecords = [...doseRecords, updatedDose]
    }

    updateState({ doseRecords: updatedDoseRecords })

    // Decrement stock
    decrementStock(dose.medicineId)

    return {
      success: true,
      dose: updatedDose
    }
  }, [doseRecords, getDoseRecord, getDosesForDate, updateState, decrementStock])

  // Mark dose as missed
  const markDoseMissed = useCallback((doseIdOrDose, notes = '') => {
    // Handle both dose ID (string) and dose object
    let dose = null
    let doseId = null
    
    if (typeof doseIdOrDose === 'string') {
      doseId = doseIdOrDose
      // First try to find in stored records
      dose = getDoseRecord(doseId)
      
      // If not found in storage, try to find in today's generated doses
      if (!dose) {
        const todayDoses = getDosesForDate(getTodayISO())
        dose = todayDoses.find(d => d.id === doseId)
      }
    } else {
      // Dose object passed directly
      dose = doseIdOrDose
      doseId = dose.id
    }
    
    if (!dose) {
      console.error('Dose not found:', doseId)
      return { success: false, error: 'Dose not found' }
    }

    if (dose.status === DOSE_STATUS.TAKEN) {
      return { success: false, error: 'Cannot mark taken dose as missed' }
    }

    const now = new Date().toISOString()
    const updatedDose = {
      ...dose,
      status: DOSE_STATUS.MISSED,
      actualTime: now,
      notes: notes || dose.notes || ''
    }

    // Check if dose already exists in storage by matching medicineId and scheduledTime
    const existingDose = doseRecords.find(d => 
      d.medicineId === dose.medicineId && 
      d.scheduledTime === dose.scheduledTime
    )
    
    let updatedDoseRecords
    
    if (existingDose) {
      // Update existing dose
      updatedDoseRecords = doseRecords.map(d =>
        d.medicineId === dose.medicineId && d.scheduledTime === dose.scheduledTime
          ? updatedDose
          : d
      )
    } else {
      // Add new dose
      updatedDoseRecords = [...doseRecords, updatedDose]
    }

    updateState({ doseRecords: updatedDoseRecords })

    return {
      success: true,
      dose: updatedDose
    }
  }, [doseRecords, getDoseRecord, getDosesForDate, updateState])

  // Undo/Reset dose status (mark as pending again)
  const undoDose = useCallback((doseIdOrDose) => {
    // Handle both dose ID (string) and dose object
    let dose = null
    let doseId = null
    
    if (typeof doseIdOrDose === 'string') {
      doseId = doseIdOrDose
      dose = getDoseRecord(doseId)
    } else {
      dose = doseIdOrDose
      doseId = dose.id
    }
    
    if (!dose) {
      console.error('Dose not found:', doseId)
      return { success: false, error: 'Dose not found' }
    }

    if (dose.status === DOSE_STATUS.PENDING) {
      return { success: false, error: 'Dose is already pending' }
    }

    const wasTaken = dose.status === DOSE_STATUS.TAKEN

    // Remove the dose record from storage (revert to pending state)
    const updatedDoseRecords = doseRecords.filter(d => 
      !(d.medicineId === dose.medicineId && d.scheduledTime === dose.scheduledTime)
    )

    updateState({ doseRecords: updatedDoseRecords })

    // If dose was taken, increment stock back
    if (wasTaken) {
      const medicine = getMedicine(dose.medicineId)
      if (medicine) {
        const updatedMedicine = {
          ...medicine,
          stockQuantity: medicine.stockQuantity + 1
        }
        // Update medicine stock
        const { appState } = useStorage()
        const updatedMedicines = appState.medicines.map(m =>
          m.id === medicine.id ? updatedMedicine : m
        )
        updateState({ medicines: updatedMedicines })
      }
    }

    return {
      success: true,
      dose: { ...dose, status: DOSE_STATUS.PENDING, actualTime: null, notes: '' }
    }
  }, [doseRecords, getDoseRecord, getMedicine, updateState])

  // Get dose history
  const getDoseHistory = useCallback((filters = {}) => {
    let filtered = [...doseRecords]

    // Filter by patient
    if (filters.patientId) {
      filtered = filtered.filter(d => d.patientId === filters.patientId)
    }

    // Filter by medicine
    if (filters.medicineId) {
      filtered = filtered.filter(d => d.medicineId === filters.medicineId)
    }

    // Filter by status
    if (filters.status) {
      filtered = filtered.filter(d => d.status === filters.status)
    }

    // Filter by date range
    if (filters.startDate) {
      const start = new Date(filters.startDate)
      filtered = filtered.filter(d => new Date(d.scheduledTime) >= start)
    }

    if (filters.endDate) {
      const end = new Date(filters.endDate)
      filtered = filtered.filter(d => new Date(d.scheduledTime) <= end)
    }

    // Only include taken or missed doses in history
    filtered = filtered.filter(d =>
      d.status === DOSE_STATUS.TAKEN || d.status === DOSE_STATUS.MISSED
    )

    // Sort by scheduled time (most recent first)
    return filtered.sort((a, b) =>
      new Date(b.scheduledTime) - new Date(a.scheduledTime)
    )
  }, [doseRecords])

  // Get upcoming doses (future doses)
  const getUpcomingDoses = useCallback((patientId = null, limit = 10) => {
    const now = new Date()
    let upcoming = doseRecords.filter(d =>
      d.status === DOSE_STATUS.UPCOMING &&
      new Date(d.scheduledTime) > now
    )

    if (patientId) {
      upcoming = upcoming.filter(d => d.patientId === patientId)
    }

    // Sort by scheduled time (soonest first)
    upcoming.sort((a, b) =>
      new Date(a.scheduledTime) - new Date(b.scheduledTime)
    )

    return upcoming.slice(0, limit)
  }, [doseRecords])

  // Get overdue doses
  const getOverdueDoses = useCallback((patientId = null) => {
    let overdue = doseRecords.filter(d =>
      (d.status === DOSE_STATUS.UPCOMING || d.status === DOSE_STATUS.OVERDUE) &&
      isOverdue(d.scheduledTime, OVERDUE_THRESHOLD_MINUTES)
    )

    if (patientId) {
      overdue = overdue.filter(d => d.patientId === patientId)
    }

    // Sort by scheduled time (oldest first)
    return overdue.sort((a, b) =>
      new Date(a.scheduledTime) - new Date(b.scheduledTime)
    )
  }, [doseRecords])

  const value = {
    doseRecords,
    getDoseRecord,
    generateDosesForDate,
    getDosesForDate,
    getTodayDoses,
    getDailySchedule,
    markDoseTaken,
    markDoseMissed,
    undoDose,
    getDoseHistory,
    getUpcomingDoses,
    getOverdueDoses
  }

  return (
    <ScheduleContext.Provider value={value}>
      {children}
    </ScheduleContext.Provider>
  )
}

export default ScheduleContext
