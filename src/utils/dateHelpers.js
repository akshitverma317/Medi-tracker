/**
 * Date Helper Utilities
 * 
 * Provides date manipulation and formatting functions
 */

import { format, startOfDay, endOfDay, addMinutes, differenceInMinutes, isAfter, isBefore, isEqual, parseISO } from 'date-fns'

/**
 * Format date to ISO date string (YYYY-MM-DD)
 * @param {Date} date
 * @returns {string}
 */
export const formatDateISO = (date) => {
  return format(date, 'yyyy-MM-dd')
}

/**
 * Format time to HH:MM
 * @param {Date} date
 * @returns {string}
 */
export const formatTime = (date) => {
  return format(date, 'HH:mm')
}

/**
 * Combine date and time strings into ISO datetime
 * @param {string} dateStr - YYYY-MM-DD format
 * @param {string} timeStr - HH:MM format
 * @returns {string} ISO datetime string
 */
export const combineDateAndTime = (dateStr, timeStr) => {
  const [hours, minutes] = timeStr.split(':').map(Number)
  const date = new Date(dateStr)
  date.setHours(hours, minutes, 0, 0)
  return date.toISOString()
}

/**
 * Get start of day for a date
 * @param {Date|string} date
 * @returns {Date}
 */
export const getStartOfDay = (date) => {
  const d = typeof date === 'string' ? parseISO(date) : date
  return startOfDay(d)
}

/**
 * Get end of day for a date
 * @param {Date|string} date
 * @returns {Date}
 */
export const getEndOfDay = (date) => {
  const d = typeof date === 'string' ? parseISO(date) : date
  return endOfDay(d)
}

/**
 * Check if a datetime is overdue
 * @param {string} scheduledTime - ISO datetime
 * @param {number} thresholdMinutes - Minutes past scheduled time to consider overdue
 * @returns {boolean}
 */
export const isOverdue = (scheduledTime, thresholdMinutes = 30) => {
  const scheduled = new Date(scheduledTime)
  const now = new Date()
  const minutesPast = differenceInMinutes(now, scheduled)
  return minutesPast > thresholdMinutes
}

/**
 * Check if a datetime is upcoming (in the future)
 * @param {string} scheduledTime - ISO datetime
 * @returns {boolean}
 */
export const isUpcoming = (scheduledTime) => {
  const scheduled = new Date(scheduledTime)
  const now = new Date()
  return isAfter(scheduled, now)
}

/**
 * Calculate reminder time
 * @param {string} scheduledTime - ISO datetime
 * @param {number} minutesBefore - Minutes before scheduled time
 * @returns {string} ISO datetime for reminder
 */
export const calculateReminderTime = (scheduledTime, minutesBefore) => {
  const scheduled = new Date(scheduledTime)
  const reminderTime = addMinutes(scheduled, -minutesBefore)
  return reminderTime.toISOString()
}

/**
 * Check if two dates are the same day
 * @param {Date|string} date1
 * @param {Date|string} date2
 * @returns {boolean}
 */
export const isSameDay = (date1, date2) => {
  const d1 = typeof date1 === 'string' ? parseISO(date1) : date1
  const d2 = typeof date2 === 'string' ? parseISO(date2) : date2
  return formatDateISO(d1) === formatDateISO(d2)
}

/**
 * Get today's date as ISO string
 * @returns {string}
 */
export const getTodayISO = () => {
  return formatDateISO(new Date())
}

/**
 * Parse ISO datetime to Date object
 * @param {string} isoString
 * @returns {Date}
 */
export const parseISODate = (isoString) => {
  return parseISO(isoString)
}

export default {
  formatDateISO,
  formatTime,
  combineDateAndTime,
  getStartOfDay,
  getEndOfDay,
  isOverdue,
  isUpcoming,
  calculateReminderTime,
  isSameDay,
  getTodayISO,
  parseISODate
}
