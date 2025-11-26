/**
 * NotificationService
 * 
 * Handles browser notifications for medication reminders
 */

class NotificationService {
  constructor() {
    this.permission = 'default'
    this.checkPermission()
  }

  /**
   * Check current notification permission
   */
  checkPermission() {
    if ('Notification' in window) {
      this.permission = Notification.permission
    }
    return this.permission
  }

  /**
   * Request notification permission from user
   */
  async requestPermission() {
    if (!('Notification' in window)) {
      console.warn('This browser does not support notifications')
      return false
    }

    if (this.permission === 'granted') {
      return true
    }

    try {
      const permission = await Notification.requestPermission()
      this.permission = permission
      return permission === 'granted'
    } catch (error) {
      console.error('Error requesting notification permission:', error)
      return false
    }
  }

  /**
   * Show a notification
   */
  showNotification(title, options = {}) {
    // Always check current permission status
    this.checkPermission()
    
    if (this.permission !== 'granted') {
      console.warn('Notification permission not granted. Current status:', this.permission)
      return null
    }

    try {
      const notificationOptions = {
        // Don't include icon/badge if they don't exist
        // icon: '/medicine-icon.png',
        // badge: '/medicine-badge.png',
        vibrate: [200, 100, 200],
        requireInteraction: false,
        ...options
      }
      
      const notification = new Notification(title, notificationOptions)

      // Add click handler to focus the window
      notification.onclick = function() {
        window.focus()
        notification.close()
      }

      return notification
    } catch (error) {
      console.error('Error showing notification:', error)
      return null
    }
  }

  /**
   * Show medication reminder notification
   */
  showMedicationReminder(medicine, patient, scheduledTime) {
    const time = new Date(scheduledTime).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })

    return this.showNotification(
      `💊 Time to take ${medicine.name}`,
      {
        body: `${patient.name} - ${medicine.dosage}\nScheduled for ${time}`,
        tag: `med-${medicine.id}-${scheduledTime}`,
        data: {
          medicineId: medicine.id,
          patientId: patient.id,
          scheduledTime
        },
        actions: [
          { action: 'taken', title: '✓ Mark as Taken' },
          { action: 'snooze', title: '⏰ Snooze 10 min' }
        ]
      }
    )
  }

  /**
   * Show overdue medication alert
   */
  showOverdueAlert(medicine, patient, scheduledTime) {
    const time = new Date(scheduledTime).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })

    return this.showNotification(
      `⚠️ Overdue: ${medicine.name}`,
      {
        body: `${patient.name} missed the ${time} dose\n${medicine.dosage}`,
        tag: `overdue-${medicine.id}-${scheduledTime}`,
        data: {
          medicineId: medicine.id,
          patientId: patient.id,
          scheduledTime
        },
        requireInteraction: true
      }
    )
  }

  /**
   * Show low stock alert
   */
  showLowStockAlert(medicine, stockQuantity) {
    return this.showNotification(
      `📦 Low Stock: ${medicine.name}`,
      {
        body: `Only ${stockQuantity} doses remaining\nTime to refill!`,
        tag: `low-stock-${medicine.id}`,
        data: {
          medicineId: medicine.id,
          type: 'low-stock'
        }
      }
    )
  }

  /**
   * Show critical alert
   */
  showCriticalAlert(title, message, data = {}) {
    return this.showNotification(
      `🚨 ${title}`,
      {
        body: message,
        tag: `critical-${Date.now()}`,
        requireInteraction: true,
        data: {
          ...data,
          type: 'critical'
        }
      }
    )
  }

  /**
   * Schedule a notification for a specific time
   */
  scheduleNotification(scheduledTime, callback) {
    const now = new Date()
    const targetTime = new Date(scheduledTime)
    const delay = targetTime - now

    if (delay <= 0) {
      // Time has passed, don't schedule
      return null
    }

    // Schedule notification
    const timeoutId = setTimeout(() => {
      callback()
    }, delay)

    return timeoutId
  }

  /**
   * Cancel a scheduled notification
   */
  cancelNotification(timeoutId) {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }
  }

  /**
   * Play notification sound
   */
  playNotificationSound() {
    try {
      const audio = new Audio('/notification-sound.mp3')
      audio.volume = 0.5
      audio.play().catch(err => console.warn('Could not play sound:', err))
    } catch (error) {
      console.warn('Audio not supported:', error)
    }
  }
}

// Export singleton instance
const notificationService = new NotificationService()
export default notificationService
