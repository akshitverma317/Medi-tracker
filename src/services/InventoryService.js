/**
 * InventoryService
 * 
 * Business logic for inventory management, stock tracking, and refill calculations.
 */

import { addDays, differenceInDays } from 'date-fns'
import { formatDateISO } from '../utils/dateHelpers.js'

/**
 * Calculate daily consumption rate for a medicine
 * @param {import('../types/index.js').Medicine} medicine
 * @returns {number} Number of doses consumed per day
 */
export const calculateDailyConsumption = (medicine) => {
  if (!medicine || !medicine.timings) {
    return 0
  }

  // Daily consumption = number of doses per day
  return medicine.timings.length
}

/**
 * Calculate days remaining until stock runs out
 * @param {number} stockQuantity - Current stock
 * @param {number} dailyConsumption - Doses per day
 * @returns {number} Days remaining (0 if out of stock)
 */
export const calculateDaysRemaining = (stockQuantity, dailyConsumption) => {
  if (dailyConsumption === 0) {
    return Infinity // No consumption, stock never runs out
  }

  if (stockQuantity <= 0) {
    return 0 // Out of stock
  }

  return Math.floor(stockQuantity / dailyConsumption)
}

/**
 * Calculate refill date based on current stock and consumption
 * @param {import('../types/index.js').Medicine} medicine
 * @returns {string|null} ISO date string or null if no refill needed
 */
export const calculateRefillDate = (medicine) => {
  if (!medicine) {
    return null
  }

  const dailyConsumption = calculateDailyConsumption(medicine)
  
  if (dailyConsumption === 0) {
    return null // No consumption, no refill needed
  }

  const daysRemaining = calculateDaysRemaining(medicine.stockQuantity, dailyConsumption)
  
  if (daysRemaining === 0) {
    return formatDateISO(new Date()) // Refill needed today
  }

  if (daysRemaining === Infinity) {
    return null // Stock never runs out
  }

  const refillDate = addDays(new Date(), daysRemaining)
  return formatDateISO(refillDate)
}

/**
 * Check if medicine is low on stock
 * @param {import('../types/index.js').Medicine} medicine
 * @returns {boolean}
 */
export const isLowStock = (medicine) => {
  if (!medicine) {
    return false
  }

  return medicine.stockQuantity <= medicine.lowStockThreshold
}

/**
 * Check if medicine is out of stock
 * @param {import('../types/index.js').Medicine} medicine
 * @returns {boolean}
 */
export const isOutOfStock = (medicine) => {
  if (!medicine) {
    return false
  }

  return medicine.stockQuantity === 0
}

/**
 * Check if medicine needs refill within specified days
 * @param {import('../types/index.js').Medicine} medicine
 * @param {number} daysThreshold - Number of days to check ahead
 * @returns {boolean}
 */
export const needsRefillSoon = (medicine, daysThreshold = 7) => {
  const refillDateStr = calculateRefillDate(medicine)
  
  if (!refillDateStr) {
    return false // No refill needed
  }

  const refillDate = new Date(refillDateStr)
  const thresholdDate = addDays(new Date(), daysThreshold)

  return refillDate <= thresholdDate
}

/**
 * Calculate stock after a number of days
 * @param {number} currentStock - Current stock quantity
 * @param {number} dailyConsumption - Doses per day
 * @param {number} days - Number of days
 * @returns {number} Projected stock (minimum 0)
 */
export const projectStockAfterDays = (currentStock, dailyConsumption, days) => {
  const consumed = dailyConsumption * days
  return Math.max(0, currentStock - consumed)
}

/**
 * Calculate required refill quantity to last for specified days
 * @param {import('../types/index.js').Medicine} medicine
 * @param {number} targetDays - Number of days stock should last
 * @returns {number} Quantity needed
 */
export const calculateRequiredRefillQuantity = (medicine, targetDays = 30) => {
  if (!medicine) {
    return 0
  }

  const dailyConsumption = calculateDailyConsumption(medicine)
  const targetStock = dailyConsumption * targetDays
  const currentStock = medicine.stockQuantity

  if (currentStock >= targetStock) {
    return 0 // Already have enough
  }

  return targetStock - currentStock
}

/**
 * Get inventory alerts for a medicine
 * @param {import('../types/index.js').Medicine} medicine
 * @returns {{type: string, message: string, severity: 'critical'|'warning'|'info'}[]}
 */
export const getInventoryAlerts = (medicine) => {
  const alerts = []

  if (!medicine) {
    return alerts
  }

  // Out of stock alert
  if (isOutOfStock(medicine)) {
    alerts.push({
      type: 'out_of_stock',
      message: `${medicine.name} is out of stock`,
      severity: 'critical'
    })
    return alerts // No need to check other conditions
  }

  // Low stock alert
  if (isLowStock(medicine)) {
    alerts.push({
      type: 'low_stock',
      message: `${medicine.name} is low on stock (${medicine.stockQuantity} doses remaining)`,
      severity: 'warning'
    })
  }

  // Refill needed soon
  if (needsRefillSoon(medicine, 7)) {
    const refillDate = calculateRefillDate(medicine)
    const daysUntil = differenceInDays(new Date(refillDate), new Date())
    
    alerts.push({
      type: 'refill_soon',
      message: `${medicine.name} needs refill in ${daysUntil} day${daysUntil !== 1 ? 's' : ''}`,
      severity: daysUntil <= 3 ? 'warning' : 'info'
    })
  }

  return alerts
}

/**
 * Get inventory summary for multiple medicines
 * @param {import('../types/index.js').Medicine[]} medicines
 * @returns {{totalMedicines: number, lowStockCount: number, outOfStockCount: number, needsRefillSoon: number, totalStock: number, criticalAlerts: number, warningAlerts: number}}
 */
export const getInventorySummary = (medicines) => {
  const summary = {
    totalMedicines: medicines.length,
    lowStockCount: 0,
    outOfStockCount: 0,
    needsRefillSoon: 0,
    totalStock: 0,
    criticalAlerts: 0,
    warningAlerts: 0
  }

  medicines.forEach(medicine => {
    summary.totalStock += medicine.stockQuantity

    if (isOutOfStock(medicine)) {
      summary.outOfStockCount++
    } else if (isLowStock(medicine)) {
      summary.lowStockCount++
    }

    if (needsRefillSoon(medicine, 7)) {
      summary.needsRefillSoon++
    }

    const alerts = getInventoryAlerts(medicine)
    alerts.forEach(alert => {
      if (alert.severity === 'critical') {
        summary.criticalAlerts++
      } else if (alert.severity === 'warning') {
        summary.warningAlerts++
      }
    })
  })

  return summary
}

/**
 * Sort medicines by stock level
 * @param {import('../types/index.js').Medicine[]} medicines
 * @param {boolean} ascending - Sort order (default: true, lowest stock first)
 * @returns {import('../types/index.js').Medicine[]}
 */
export const sortByStockLevel = (medicines, ascending = true) => {
  const sorted = [...medicines]
  
  sorted.sort((a, b) => {
    return ascending 
      ? a.stockQuantity - b.stockQuantity
      : b.stockQuantity - a.stockQuantity
  })

  return sorted
}

/**
 * Sort medicines by refill urgency
 * @param {import('../types/index.js').Medicine[]} medicines
 * @returns {import('../types/index.js').Medicine[]} Sorted with most urgent first
 */
export const sortByRefillUrgency = (medicines) => {
  const sorted = [...medicines]
  
  sorted.sort((a, b) => {
    const refillA = calculateRefillDate(a)
    const refillB = calculateRefillDate(b)

    // Out of stock comes first
    if (isOutOfStock(a) && !isOutOfStock(b)) return -1
    if (!isOutOfStock(a) && isOutOfStock(b)) return 1

    // Then by refill date (soonest first)
    if (!refillA && refillB) return 1
    if (refillA && !refillB) return -1
    if (!refillA && !refillB) return 0

    return new Date(refillA) - new Date(refillB)
  })

  return sorted
}

/**
 * Calculate total refill cost (if prices are tracked)
 * @param {number} quantity - Quantity to refill
 * @param {number} pricePerUnit - Price per dose
 * @returns {number} Total cost
 */
export const calculateRefillCost = (quantity, pricePerUnit) => {
  return quantity * pricePerUnit
}

export default {
  calculateDailyConsumption,
  calculateDaysRemaining,
  calculateRefillDate,
  isLowStock,
  isOutOfStock,
  needsRefillSoon,
  projectStockAfterDays,
  calculateRequiredRefillQuantity,
  getInventoryAlerts,
  getInventorySummary,
  sortByStockLevel,
  sortByRefillUrgency,
  calculateRefillCost
}
