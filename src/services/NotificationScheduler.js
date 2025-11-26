/**
 * NotificationScheduler
 * 
 * Automatically schedules and sends medication reminders
 */

import notificationService from './NotificationService.js'

class NotificationScheduler {
  constructor() {
    this.scheduledNotifications = new Map() // Map of timeoutIds
    this.checkInterval = null
    this.isRunning = false
    this.reminderMinutes = 5 // Default: remind 5 minutes before
  }

  /**
   * Start the notification scheduler
   */
  start(scheduleContext, medicineContext, patientContext) {
    if (this.isRunning) {
      console.log('Notification scheduler already running')
      return
    }

    console.log('Starting notification scheduler...')
    this.isRunning = true
    this.scheduleContext = scheduleContext
    this.medicineContext = medicineContext
    this.patientContext = patientContext

    // Check for upcoming doses every minute
    this.checkInterval = setInterval(() => {
      this.checkAndScheduleNotifications()
    }, 60 * 1000) // Check every 60 seconds

    // Also check immediately
    this.checkAndScheduleNotifications()
  }

  /**
   * Stop the notification scheduler
   */
  stop() {
    console.log('Stopping notification scheduler...')
    this.isRunning = false

    // Clear the check interval
    if (this.checkInterval) {
      clearInterval(this.checkInterval)
      this.checkInterval = null
    }

    // Clear all scheduled notifications
    this.scheduledNotifications.forEach(timeoutId => {
      clearTimeout(timeoutId)
    })
    this.scheduledNotifications.clear()
  }

  /**
   * Set reminder time (minutes before dose)
   */
  setReminderMinutes(minutes) {
    this.reminderMinutes = minutes
    console.log(`Reminder time set to ${minutes} minutes before dose`)
  }

  /**
   * Check for upcoming doses and schedule notifications
   */
  checkAndScheduleNotifications() {
    if (!this.scheduleContext || !this.medicineContext || !this.patientContext) {
      return
    }

    try {
      // Get today's doses
      const todayDoses = this.scheduleContext.getTodayDoses()
      const now = new Date()

      todayDoses.forEach(dose => {
        // Only schedule for upcoming doses (not taken, not missed, not overdue)
        if (dose.status !== 'upcoming') {
          return
        }

        // Get medicine to access its reminder settings
        const medicine = this.medicineContext.getMedicine(dose.medicineId)
        if (!medicine) {
          return
        }

        // Use medicine's specific reminder time (or default to 15 minutes)
        const reminderMinutes = medicine.reminderMinutesBefore || 15

        const scheduledTime = new Date(dose.scheduledTime)
        const reminderTime = new Date(scheduledTime.getTime() - (reminderMinutes * 60 * 1000))
        const timeUntilReminder = reminderTime - now

        // Create unique key for this dose
        const doseKey = `${dose.medicineId}-${dose.scheduledTime}`

        // If reminder time is in the future and not already scheduled
        if (timeUntilReminder > 0 && !this.scheduledNotifications.has(doseKey)) {
          console.log(`Scheduling notification for ${medicine.name} in ${Math.round(timeUntilReminder / 1000 / 60)} minutes (${reminderMinutes} min before dose)`)

          // Schedule the notification
          const timeoutId = setTimeout(() => {
            this.sendMedicationReminder(dose, reminderMinutes)
            this.scheduledNotifications.delete(doseKey)
          }, timeUntilReminder)

          this.scheduledNotifications.set(doseKey, timeoutId)
        }

        // Also check if dose time has passed (for immediate notification)
        const timeUntilDose = scheduledTime - now
        if (timeUntilDose > 0 && timeUntilDose <= 60000 && !this.scheduledNotifications.has(`${doseKey}-now`)) {
          // Dose is within 1 minute, send notification now
          console.log(`Dose time approaching for ${medicine.name}, sending notification now`)
          
          const timeoutId = setTimeout(() => {
            this.sendMedicationReminder(dose, reminderMinutes, true)
            this.scheduledNotifications.delete(`${doseKey}-now`)
          }, timeUntilDose)

          this.scheduledNotifications.set(`${doseKey}-now`, timeoutId)
        }
      })
    } catch (error) {
      console.error('Error checking and scheduling notifications:', error)
    }
  }

  /**
   * Send medication reminder notification
   */
  sendMedicationReminder(dose, reminderMinutes = 15, isNow = false) {
    try {
      const medicine = this.medicineContext.getMedicine(dose.medicineId)
      const patient = this.patientContext.getPatient(dose.patientId)

      if (!medicine || !patient) {
        console.warn('Medicine or patient not found for dose:', dose)
        return
      }

      const scheduledTime = new Date(dose.scheduledTime)
      const timeStr = scheduledTime.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      })

      const title = isNow 
        ? `💊 Time to take ${medicine.name}!`
        : `⏰ Reminder: ${medicine.name} in ${reminderMinutes} minutes`

      const body = `${patient.name} - ${medicine.dosage}\nScheduled for ${timeStr}`

      // Show notification
      const notification = notificationService.showNotification(title, {
        body: body,
        tag: `med-${dose.medicineId}-${dose.scheduledTime}`,
        requireInteraction: true,
        data: {
          medicineId: dose.medicineId,
          patientId: dose.patientId,
          scheduledTime: dose.scheduledTime
        }
      })

      if (notification) {
        console.log(`Notification sent for ${medicine.name} at ${timeStr} (${reminderMinutes} min reminder)`)
        
        // Play sound if available
        notificationService.playNotificationSound()
      }
    } catch (error) {
      console.error('Error sending medication reminder:', error)
    }
  }

  /**
   * Get status information
   */
  getStatus() {
    return {
      isRunning: this.isRunning,
      scheduledCount: this.scheduledNotifications.size,
      reminderMinutes: 'Per-medicine setting'
    }
  }
}

// Export singleton instance
const notificationScheduler = new NotificationScheduler()
export default notificationScheduler
