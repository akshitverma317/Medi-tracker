/**
 * Application Constants
 */

// Medicine Categories
export const MEDICINE_CATEGORIES = {
  PILLS: 'pills',
  LIQUID: 'liquid',
  INJECTION: 'injection',
  INHALER: 'inhaler',
  OTHER: 'other'
}

export const MEDICINE_CATEGORY_LABELS = {
  [MEDICINE_CATEGORIES.PILLS]: 'Pills/Tablets',
  [MEDICINE_CATEGORIES.LIQUID]: 'Liquid',
  [MEDICINE_CATEGORIES.INJECTION]: 'Injection',
  [MEDICINE_CATEGORIES.INHALER]: 'Inhaler',
  [MEDICINE_CATEGORIES.OTHER]: 'Other'
}

// Medicine Frequencies
export const MEDICINE_FREQUENCIES = {
  ONCE_DAILY: 'once-daily',
  TWICE_DAILY: 'twice-daily',
  THREE_TIMES_DAILY: 'three-times-daily',
  FOUR_TIMES_DAILY: 'four-times-daily',
  AS_NEEDED: 'as-needed',
  CUSTOM: 'custom'
}

export const MEDICINE_FREQUENCY_LABELS = {
  [MEDICINE_FREQUENCIES.ONCE_DAILY]: 'Once Daily',
  [MEDICINE_FREQUENCIES.TWICE_DAILY]: 'Twice Daily',
  [MEDICINE_FREQUENCIES.THREE_TIMES_DAILY]: 'Three Times Daily',
  [MEDICINE_FREQUENCIES.FOUR_TIMES_DAILY]: 'Four Times Daily',
  [MEDICINE_FREQUENCIES.AS_NEEDED]: 'As Needed',
  [MEDICINE_FREQUENCIES.CUSTOM]: 'Custom Schedule'
}

// Dose Status
export const DOSE_STATUS = {
  UPCOMING: 'upcoming',
  TAKEN: 'taken',
  MISSED: 'missed',
  OVERDUE: 'overdue'
}

export const DOSE_STATUS_LABELS = {
  [DOSE_STATUS.UPCOMING]: 'Upcoming',
  [DOSE_STATUS.TAKEN]: 'Taken',
  [DOSE_STATUS.MISSED]: 'Missed',
  [DOSE_STATUS.OVERDUE]: 'Overdue'
}

// Status Colors (matching Tailwind classes)
export const DOSE_STATUS_COLORS = {
  [DOSE_STATUS.UPCOMING]: {
    bg: 'bg-primary-100',
    text: 'text-primary-800',
    border: 'border-primary-300',
    hex: '#b3d9ff'
  },
  [DOSE_STATUS.TAKEN]: {
    bg: 'bg-success-100',
    text: 'text-success-800',
    border: 'border-success-300',
    hex: '#b3e6cc'
  },
  [DOSE_STATUS.MISSED]: {
    bg: 'bg-danger-100',
    text: 'text-danger-800',
    border: 'border-danger-300',
    hex: '#ffb3b3'
  },
  [DOSE_STATUS.OVERDUE]: {
    bg: 'bg-warning-100',
    text: 'text-warning-800',
    border: 'border-warning-300',
    hex: '#ffecb3'
  }
}

// Validation Constants
export const VALIDATION = {
  PATIENT_NAME_MIN: 1,
  PATIENT_NAME_MAX: 100,
  PATIENT_AGE_MIN: 0,
  PATIENT_AGE_MAX: 150,
  CAREGIVER_NAME_MIN: 1,
  CAREGIVER_NAME_MAX: 100,
  MEDICINE_NAME_MIN: 1,
  MEDICINE_NAME_MAX: 200,
  DOSAGE_MIN: 1,
  DOSAGE_MAX: 100,
  STOCK_MIN: 0,
  THRESHOLD_MIN: 0,
  REMINDER_MIN: 0,
  TIME_REGEX: /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/
}

// Default Settings
export const DEFAULT_SETTINGS = {
  defaultReminderMinutes: 15,
  defaultLowStockThreshold: 5,
  theme: 'light',
  notificationsEnabled: true
}

// Storage Keys
export const STORAGE_KEY = 'medicine-tracker-data'
export const STORAGE_VERSION = '1.0.0'

// Time Constants
export const OVERDUE_THRESHOLD_MINUTES = 30
export const UNDO_TIMEOUT_SECONDS = 10

// UI Constants
export const MIN_TOUCH_TARGET = 44 // pixels
export const MIN_FONT_SIZE = 16 // pixels
export const SEARCH_DEBOUNCE_MS = 300
