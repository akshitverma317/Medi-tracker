/**
 * Data Models and Type Definitions
 * 
 * This file contains JSDoc type definitions for all data models
 * used throughout the Medicine Tracker application.
 */

/**
 * @typedef {Object} Patient
 * @property {string} id - Unique identifier
 * @property {string} name - Patient name
 * @property {number} age - Patient age (0-150)
 * @property {string} [photo] - Optional photo URL
 * @property {string[]} medicalConditions - List of medical conditions
 * @property {string[]} allergies - List of allergies
 * @property {string} caregiverName - Assigned caregiver name
 * @property {string} createdAt - ISO datetime string
 * @property {string} updatedAt - ISO datetime string
 */

/**
 * @typedef {'once-daily' | 'twice-daily' | 'three-times-daily' | 'four-times-daily' | 'as-needed' | 'custom'} MedicineFrequency
 */

/**
 * @typedef {'pills' | 'liquid' | 'injection' | 'inhaler' | 'other'} MedicineCategory
 */

/**
 * @typedef {Object} Medicine
 * @property {string} id - Unique identifier
 * @property {string} patientId - Reference to patient
 * @property {string} name - Medicine name
 * @property {string} dosage - Dosage information (e.g., "500mg")
 * @property {MedicineFrequency} frequency - How often to take
 * @property {string[]} timings - Array of time strings (HH:MM format)
 * @property {MedicineCategory} category - Type of medicine
 * @property {string} [notes] - Optional instructions
 * @property {number} stockQuantity - Current number of doses available
 * @property {number} lowStockThreshold - Alert when stock falls below this
 * @property {number} reminderMinutesBefore - Minutes before dose to remind
 * @property {string} startDate - ISO date string
 * @property {string} [endDate] - Optional end date
 * @property {string} createdAt - ISO datetime string
 * @property {string} updatedAt - ISO datetime string
 */

/**
 * @typedef {'upcoming' | 'taken' | 'missed' | 'overdue'} DoseStatus
 */

/**
 * @typedef {Object} DoseRecord
 * @property {string} id - Unique identifier
 * @property {string} medicineId - Reference to medicine
 * @property {string} patientId - Reference to patient
 * @property {string} scheduledTime - ISO datetime string
 * @property {DoseStatus} status - Current status
 * @property {string} [actualTime] - ISO datetime when marked taken/missed
 * @property {string} [notes] - Optional notes
 */

/**
 * @typedef {Object} RefillRecord
 * @property {string} id - Unique identifier
 * @property {string} medicineId - Reference to medicine
 * @property {string} date - ISO date string
 * @property {number} quantityAdded - Number of doses added
 * @property {string} [notes] - Optional notes
 */

/**
 * @typedef {Object} AppSettings
 * @property {number} defaultReminderMinutes - Default reminder time
 * @property {number} defaultLowStockThreshold - Default low stock threshold
 * @property {'light' | 'dark'} theme - UI theme
 * @property {boolean} notificationsEnabled - Whether notifications are enabled
 */

/**
 * @typedef {Object} AppState
 * @property {Patient[]} patients - All patients
 * @property {Medicine[]} medicines - All medicines
 * @property {DoseRecord[]} doseRecords - All dose records
 * @property {RefillRecord[]} refillRecords - All refill records
 * @property {AppSettings} settings - Application settings
 */

export {}
