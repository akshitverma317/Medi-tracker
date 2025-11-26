/**
 * ScheduleService
 * 
 * Business logic for dose scheduling, generation, and status management.
 */

import { DOSE_STATUS, OVERDUE_THRESHOLD_MINUTES, MEDICINE_FREQUENCIES } from '../types/constants.js'
import { combineDateAndTime, isOverdue as checkIsOverdue, formatDateISO } from '../utils/dateHelpers.js'
import { generateId } from '../utils/idGenerator.js'
import { startOfWeek, endOfWeek, startOfMonth, endOfMonth, eachDayOfInterval, addDays } from 'date-fns'

/**
 * Generate default timings based on frequency
 * @param {string} frequency - Medicine frequency
 * @returns {string[]} Array of time strings (HH:MM)
 */
export const getDefaultTimingsForFrequency = (frequency) => {
  switch (frequency) {
    case MEDICINE_FREQUENCIES.ONCE_DAILY:
      return ['08:00']
    
    case MEDICINE_FREQUENCIES.TWICE_DAILY:
      return ['08:00', '20:00']
    
    case MEDICINE_FREQUENCIES.THREE_TIMES_DAILY:
      return ['08:00', '14:00', '20:00']
    
    case MEDICINE_FREQUENCIES.FOUR_TIMES_DAILY:
      return ['08:00', '12:00', '16:00', '20:00']
    
    case MEDICINE_FREQUENCIES.AS_NEEDED:
      return []
    
    case MEDICINE_FREQUENCIES.CUSTOM:
      return []
    
    default:
      return []
  }
}

/**
 * Calculate dose status based on scheduled time and current status
 * @param {string} scheduledTime - ISO datetime
 * @param {string} currentStatus - Current dose status
 * @returns {string} Updated status
 */
export const calculateDoseStatus = (scheduledTime, currentStatus) => {
  // Don't change status if already taken or missed
  if (currentStatus === DOSE_STATUS.TAKEN || currentStatus === DOSE_STATUS.MISSED) {
    return currentStatus
  }

  // Check if overdue
  if (checkIsOverdue(scheduledTime, OVERDUE_THRESHOLD_MINUTES)) {
    return DOSE_STATUS.OVERDUE
  }

  // Check if upcoming (in the future)
  const scheduled = new Date(scheduledTime)
  const now = new Date()
  
  if (scheduled > now) {
    return DOSE_STATUS.UPCOMING
  }

  // Within threshold but past scheduled time
  return DOSE_STATUS.OVERDUE
}

/**
 * Generate dose records for a medicine on a specific date
 * @param {import('../types/index.js').Medicine} medicine
 * @param {string} dateStr - Date in YYYY-MM-DD format
 * @param {import('../types/index.js').DoseRecord[]} existingDoses - Existing dose records
 * @returns {import('../types/index.js').DoseRecord[]}
 */
export const generateDosesForMedicineOnDate = (medicine, dateStr, existingDoses = []) => {
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
    const existing = existingDoses.find(d =>
      d.medicineId === medicine.id &&
      d.scheduledTime === scheduledTime
    )

    if (existing) {
      // Update status if needed
      const updatedStatus = calculateDoseStatus(scheduledTime, existing.status)
      return {
        ...existing,
        status: updatedStatus
      }
    }

    // Create new dose record
    const status = calculateDoseStatus(scheduledTime, DOSE_STATUS.UPCOMING)
    
    return {
      id: generateId(),
      medicineId: medicine.id,
      patientId: medicine.patientId,
      scheduledTime,
      status,
      actualTime: null,
      notes: ''
    }
  })
}

/**
 * Generate doses for all medicines on a specific date
 * @param {import('../types/index.js').Medicine[]} medicines
 * @param {string} dateStr - Date in YYYY-MM-DD format
 * @param {import('../types/index.js').DoseRecord[]} existingDoses
 * @returns {import('../types/index.js').DoseRecord[]}
 */
export const generateDosesForDate = (medicines, dateStr, existingDoses = []) => {
  const allDoses = []

  medicines.forEach(medicine => {
    const doses = generateDosesForMedicineOnDate(medicine, dateStr, existingDoses)
    allDoses.push(...doses)
  })

  return allDoses
}

/**
 * Generate doses for a date range
 * @param {import('../types/index.js').Medicine[]} medicines
 * @param {Date} startDate
 * @param {Date} endDate
 * @param {import('../types/index.js').DoseRecord[]} existingDoses
 * @returns {import('../types/index.js').DoseRecord[]}
 */
export const generateDosesForDateRange = (medicines, startDate, endDate, existingDoses = []) => {
  const days = eachDayOfInterval({ start: startDate, end: endDate })
  const allDoses = []

  days.forEach(day => {
    const dateStr = formatDateISO(day)
    const doses = generateDosesForDate(medicines, dateStr, existingDoses)
    allDoses.push(...doses)
  })

  return allDoses
}

/**
 * Sort doses chronologically
 * @param {import('../types/index.js').DoseRecord[]} doses
 * @param {boolean} ascending - Sort order (default: true)
 * @returns {import('../types/index.js').DoseRecord[]}
 */
export const sortDosesChronologically = (doses, ascending = true) => {
  const sorted = [...doses]
  
  sorted.sort((a, b) => {
    const timeA = new Date(a.scheduledTime).getTime()
    const timeB = new Date(b.scheduledTime).getTime()
    return ascending ? timeA - timeB : timeB - timeA
  })

  return sorted
}

/**
 * Filter doses by status
 * @param {import('../types/index.js').DoseRecord[]} doses
 * @param {string|string[]} status - Status or array of statuses
 * @returns {import('../types/index.js').DoseRecord[]}
 */
export const filterDosesByStatus = (doses, status) => {
  const statuses = Array.isArray(status) ? status : [status]
  return doses.filter(d => statuses.includes(d.status))
}

/**
 * Filter doses by patient
 * @param {import('../types/index.js').DoseRecord[]} doses
 * @param {string} patientId
 * @returns {import('../types/index.js').DoseRecord[]}
 */
export const filterDosesByPatient = (doses, patientId) => {
  return doses.filter(d => d.patientId === patientId)
}

/**
 * Filter doses by medicine
 * @param {import('../types/index.js').DoseRecord[]} doses
 * @param {string} medicineId
 * @returns {import('../types/index.js').DoseRecord[]}
 */
export const filterDosesByMedicine = (doses, medicineId) => {
  return doses.filter(d => d.medicineId === medicineId)
}

/**
 * Get doses for current week
 * @param {import('../types/index.js').Medicine[]} medicines
 * @param {import('../types/index.js').DoseRecord[]} existingDoses
 * @returns {import('../types/index.js').DoseRecord[]}
 */
export const getWeeklyDoses = (medicines, existingDoses = []) => {
  const now = new Date()
  const weekStart = startOfWeek(now, { weekStartsOn: 1 }) // Monday
  const weekEnd = endOfWeek(now, { weekStartsOn: 1 }) // Sunday

  return generateDosesForDateRange(medicines, weekStart, weekEnd, existingDoses)
}

/**
 * Get doses for current month
 * @param {import('../types/index.js').Medicine[]} medicines
 * @param {import('../types/index.js').DoseRecord[]} existingDoses
 * @returns {import('../types/index.js').DoseRecord[]}
 */
export const getMonthlyDoses = (medicines, existingDoses = []) => {
  const now = new Date()
  const monthStart = startOfMonth(now)
  const monthEnd = endOfMonth(now)

  return generateDosesForDateRange(medicines, monthStart, monthEnd, existingDoses)
}

/**
 * Get adherence statistics for a patient
 * @param {import('../types/index.js').DoseRecord[]} doses
 * @returns {{total: number, taken: number, missed: number, overdue: number, upcoming: number, adherenceRate: number}}
 */
export const calculateAdherenceStats = (doses) => {
  const stats = {
    total: doses.length,
    taken: 0,
    missed: 0,
    overdue: 0,
    upcoming: 0,
    adherenceRate: 0
  }

  doses.forEach(dose => {
    switch (dose.status) {
      case DOSE_STATUS.TAKEN:
        stats.taken++
        break
      case DOSE_STATUS.MISSED:
        stats.missed++
        break
      case DOSE_STATUS.OVERDUE:
        stats.overdue++
        break
      case DOSE_STATUS.UPCOMING:
        stats.upcoming++
        break
    }
  })

  // Calculate adherence rate (taken / (taken + missed))
  const completed = stats.taken + stats.missed
  if (completed > 0) {
    stats.adherenceRate = Math.round((stats.taken / completed) * 100)
  }

  return stats
}

export default {
  getDefaultTimingsForFrequency,
  calculateDoseStatus,
  generateDosesForMedicineOnDate,
  generateDosesForDate,
  generateDosesForDateRange,
  sortDosesChronologically,
  filterDosesByStatus,
  filterDosesByPatient,
  filterDosesByMedicine,
  getWeeklyDoses,
  getMonthlyDoses,
  calculateAdherenceStats
}
