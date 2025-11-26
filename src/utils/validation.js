/**
 * Validation Utilities
 * 
 * Provides validation functions for all data models with detailed error messages.
 */

import {
  VALIDATION,
  MEDICINE_CATEGORIES,
  MEDICINE_FREQUENCIES,
  DOSE_STATUS
} from '../types/constants.js'

/**
 * Validate time format (HH:MM)
 * @param {string} time
 * @returns {{valid: boolean, error?: string}}
 */
export const validateTimeFormat = (time) => {
  if (!time || typeof time !== 'string') {
    return { valid: false, error: 'Time is required' }
  }

  if (!VALIDATION.TIME_REGEX.test(time)) {
    return { valid: false, error: 'Time must be in HH:MM format (00:00 to 23:59)' }
  }

  return { valid: true }
}

/**
 * Validate medicine category
 * @param {string} category
 * @returns {{valid: boolean, error?: string}}
 */
export const validateMedicineCategory = (category) => {
  const validCategories = Object.values(MEDICINE_CATEGORIES)
  
  if (!category) {
    return { valid: false, error: 'Category is required' }
  }

  if (!validCategories.includes(category)) {
    return {
      valid: false,
      error: `Category must be one of: ${validCategories.join(', ')}`
    }
  }

  return { valid: true }
}

/**
 * Validate medicine frequency
 * @param {string} frequency
 * @returns {{valid: boolean, error?: string}}
 */
export const validateMedicineFrequency = (frequency) => {
  const validFrequencies = Object.values(MEDICINE_FREQUENCIES)
  
  if (!frequency) {
    return { valid: false, error: 'Frequency is required' }
  }

  if (!validFrequencies.includes(frequency)) {
    return {
      valid: false,
      error: `Frequency must be one of: ${validFrequencies.join(', ')}`
    }
  }

  return { valid: true }
}

/**
 * Validate medicine data
 * @param {Partial<import('../types/index.js').Medicine>} medicine
 * @returns {{valid: boolean, errors: {[key: string]: string}}}
 */
export const validateMedicine = (medicine) => {
  const errors = {}

  // Validate name
  if (!medicine.name || typeof medicine.name !== 'string') {
    errors.name = 'Medicine name is required'
  } else if (medicine.name.trim().length < VALIDATION.MEDICINE_NAME_MIN) {
    errors.name = `Medicine name must be at least ${VALIDATION.MEDICINE_NAME_MIN} character`
  } else if (medicine.name.length > VALIDATION.MEDICINE_NAME_MAX) {
    errors.name = `Medicine name must not exceed ${VALIDATION.MEDICINE_NAME_MAX} characters`
  }

  // Validate dosage
  if (!medicine.dosage || typeof medicine.dosage !== 'string') {
    errors.dosage = 'Dosage is required'
  } else if (medicine.dosage.trim().length < VALIDATION.DOSAGE_MIN) {
    errors.dosage = 'Dosage is required'
  } else if (medicine.dosage.length > VALIDATION.DOSAGE_MAX) {
    errors.dosage = `Dosage must not exceed ${VALIDATION.DOSAGE_MAX} characters`
  }

  // Validate frequency
  const frequencyValidation = validateMedicineFrequency(medicine.frequency)
  if (!frequencyValidation.valid) {
    errors.frequency = frequencyValidation.error
  }

  // Validate timings
  if (!medicine.timings || !Array.isArray(medicine.timings)) {
    errors.timings = 'At least one timing is required'
  } else if (medicine.timings.length === 0) {
    errors.timings = 'At least one timing is required'
  } else {
    // Validate each timing
    const invalidTimings = []
    medicine.timings.forEach((time, index) => {
      const timeValidation = validateTimeFormat(time)
      if (!timeValidation.valid) {
        invalidTimings.push(`Timing ${index + 1}: ${timeValidation.error}`)
      }
    })
    if (invalidTimings.length > 0) {
      errors.timings = invalidTimings.join('; ')
    }
  }

  // Validate category
  const categoryValidation = validateMedicineCategory(medicine.category)
  if (!categoryValidation.valid) {
    errors.category = categoryValidation.error
  }

  // Validate patientId
  if (!medicine.patientId || typeof medicine.patientId !== 'string') {
    errors.patientId = 'Patient selection is required'
  }

  // Validate stock quantity
  if (typeof medicine.stockQuantity !== 'number') {
    errors.stockQuantity = 'Stock quantity is required'
  } else if (medicine.stockQuantity < VALIDATION.STOCK_MIN) {
    errors.stockQuantity = `Stock quantity must be at least ${VALIDATION.STOCK_MIN}`
  }

  // Validate low stock threshold
  if (typeof medicine.lowStockThreshold !== 'number') {
    errors.lowStockThreshold = 'Low stock threshold is required'
  } else if (medicine.lowStockThreshold < VALIDATION.THRESHOLD_MIN) {
    errors.lowStockThreshold = `Low stock threshold must be at least ${VALIDATION.THRESHOLD_MIN}`
  }

  // Validate reminder minutes
  if (typeof medicine.reminderMinutesBefore !== 'number') {
    errors.reminderMinutesBefore = 'Reminder time is required'
  } else if (medicine.reminderMinutesBefore < VALIDATION.REMINDER_MIN) {
    errors.reminderMinutesBefore = `Reminder time must be at least ${VALIDATION.REMINDER_MIN} minutes`
  }

  // Validate start date
  if (!medicine.startDate) {
    errors.startDate = 'Start date is required'
  }

  // Validate end date (if provided)
  if (medicine.endDate && medicine.startDate) {
    const start = new Date(medicine.startDate)
    const end = new Date(medicine.endDate)
    if (end <= start) {
      errors.endDate = 'End date must be after start date'
    }
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors
  }
}

/**
 * Validate patient data
 * @param {Partial<import('../types/index.js').Patient>} patient
 * @returns {{valid: boolean, errors: {[key: string]: string}}}
 */
export const validatePatient = (patient) => {
  const errors = {}

  // Validate name
  if (!patient.name || typeof patient.name !== 'string') {
    errors.name = 'Patient name is required'
  } else if (patient.name.trim().length < VALIDATION.PATIENT_NAME_MIN) {
    errors.name = 'Patient name is required'
  } else if (patient.name.length > VALIDATION.PATIENT_NAME_MAX) {
    errors.name = `Patient name must not exceed ${VALIDATION.PATIENT_NAME_MAX} characters`
  }

  // Validate age
  if (typeof patient.age !== 'number') {
    errors.age = 'Age is required'
  } else if (patient.age < VALIDATION.PATIENT_AGE_MIN) {
    errors.age = `Age must be at least ${VALIDATION.PATIENT_AGE_MIN}`
  } else if (patient.age > VALIDATION.PATIENT_AGE_MAX) {
    errors.age = `Age must not exceed ${VALIDATION.PATIENT_AGE_MAX}`
  } else if (!Number.isInteger(patient.age)) {
    errors.age = 'Age must be a whole number'
  }

  // Validate caregiver name
  if (!patient.caregiverName || typeof patient.caregiverName !== 'string') {
    errors.caregiverName = 'Caregiver name is required'
  } else if (patient.caregiverName.trim().length < VALIDATION.CAREGIVER_NAME_MIN) {
    errors.caregiverName = 'Caregiver name is required'
  } else if (patient.caregiverName.length > VALIDATION.CAREGIVER_NAME_MAX) {
    errors.caregiverName = `Caregiver name must not exceed ${VALIDATION.CAREGIVER_NAME_MAX} characters`
  }

  // Validate medical conditions (optional, but must be array if provided)
  if (patient.medicalConditions !== undefined && !Array.isArray(patient.medicalConditions)) {
    errors.medicalConditions = 'Medical conditions must be an array'
  }

  // Validate allergies (optional, but must be array if provided)
  if (patient.allergies !== undefined && !Array.isArray(patient.allergies)) {
    errors.allergies = 'Allergies must be an array'
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors
  }
}

/**
 * Validate dose status
 * @param {string} status
 * @returns {{valid: boolean, error?: string}}
 */
export const validateDoseStatus = (status) => {
  const validStatuses = Object.values(DOSE_STATUS)
  
  if (!status) {
    return { valid: false, error: 'Status is required' }
  }

  if (!validStatuses.includes(status)) {
    return {
      valid: false,
      error: `Status must be one of: ${validStatuses.join(', ')}`
    }
  }

  return { valid: true }
}

/**
 * Validate dose record data
 * @param {Partial<import('../types/index.js').DoseRecord>} doseRecord
 * @returns {{valid: boolean, errors: {[key: string]: string}}}
 */
export const validateDoseRecord = (doseRecord) => {
  const errors = {}

  // Validate medicineId
  if (!doseRecord.medicineId || typeof doseRecord.medicineId !== 'string') {
    errors.medicineId = 'Medicine ID is required'
  }

  // Validate patientId
  if (!doseRecord.patientId || typeof doseRecord.patientId !== 'string') {
    errors.patientId = 'Patient ID is required'
  }

  // Validate scheduled time
  if (!doseRecord.scheduledTime) {
    errors.scheduledTime = 'Scheduled time is required'
  } else {
    try {
      const date = new Date(doseRecord.scheduledTime)
      if (isNaN(date.getTime())) {
        errors.scheduledTime = 'Invalid scheduled time format'
      }
    } catch (e) {
      errors.scheduledTime = 'Invalid scheduled time format'
    }
  }

  // Validate status
  const statusValidation = validateDoseStatus(doseRecord.status)
  if (!statusValidation.valid) {
    errors.status = statusValidation.error
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors
  }
}

/**
 * Validate refill record data
 * @param {Partial<import('../types/index.js').RefillRecord>} refillRecord
 * @returns {{valid: boolean, errors: {[key: string]: string}}}
 */
export const validateRefillRecord = (refillRecord) => {
  const errors = {}

  // Validate medicineId
  if (!refillRecord.medicineId || typeof refillRecord.medicineId !== 'string') {
    errors.medicineId = 'Medicine ID is required'
  }

  // Validate date
  if (!refillRecord.date) {
    errors.date = 'Date is required'
  }

  // Validate quantity added
  if (typeof refillRecord.quantityAdded !== 'number') {
    errors.quantityAdded = 'Quantity is required'
  } else if (refillRecord.quantityAdded <= 0) {
    errors.quantityAdded = 'Quantity must be greater than 0'
  } else if (!Number.isInteger(refillRecord.quantityAdded)) {
    errors.quantityAdded = 'Quantity must be a whole number'
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors
  }
}

export default {
  validateTimeFormat,
  validateMedicineCategory,
  validateMedicineFrequency,
  validateMedicine,
  validatePatient,
  validateDoseStatus,
  validateDoseRecord,
  validateRefillRecord
}
