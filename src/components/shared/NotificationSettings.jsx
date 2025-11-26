import { useState, useEffect } from 'react'
import notificationService from '../../services/NotificationService.js'
import Card from './Card.jsx'
import Button from './Button.jsx'
import Badge from './Badge.jsx'

/**
 * NotificationSettings Component
 * 
 * Manage notification permissions and preferences
 */
const NotificationSettings = () => {
  const [permission, setPermission] = useState('default')
  const [isRequesting, setIsRequesting] = useState(false)

  useEffect(() => {
    setPermission(notificationService.checkPermission())
  }, [])

  const handleRequestPermission = async () => {
    setIsRequesting(true)
    
    try {
      const granted = await notificationService.requestPermission()
      setPermission(notificationService.checkPermission())
      
      if (granted) {
        // Show test notification
        notificationService.showNotification(
          '✅ Notifications Enabled!',
          {
            body: 'You will now receive medication reminders',
            tag: 'permission-granted'
          }
        )
      } else {
        alert('Notification permission was denied. Please check your browser settings.')
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error)
      alert('Failed to request notification permission. Please try again.')
    } finally {
      setIsRequesting(false)
    }
  }

  const handleTestNotification = () => {
    try {
      const notification = notificationService.showNotification(
        '💊 Test Notification',
        {
          body: 'This is how medication reminders will look',
          tag: 'test-notification'
        }
      )
      
      if (!notification) {
        alert('Failed to show notification. Please check if notifications are enabled in your browser.')
      }
    } catch (error) {
      console.error('Error showing test notification:', error)
      alert('Failed to show notification: ' + error.message)
    }
  }

  const getPermissionBadge = () => {
    switch (permission) {
      case 'granted':
        return <Badge variant="success">Enabled</Badge>
      case 'denied':
        return <Badge variant="danger">Blocked</Badge>
      default:
        return <Badge variant="warning">Not Set</Badge>
    }
  }

  const getPermissionMessage = () => {
    switch (permission) {
      case 'granted':
        return 'Notifications are enabled. You will receive medication reminders.'
      case 'denied':
        return 'Notifications are blocked. Please enable them in your browser settings.'
      default:
        return 'Enable notifications to receive medication reminders.'
    }
  }

  return (
    <Card title="🔔 Medication Reminders">
      <div className="space-y-4">
        {/* Permission Status */}
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-neutral-800">Notification Status</p>
            <p className="text-sm text-neutral-600 mt-1">
              {getPermissionMessage()}
            </p>
          </div>
          {getPermissionBadge()}
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          {permission !== 'granted' && (
            <Button
              variant="primary"
              onClick={handleRequestPermission}
              disabled={isRequesting || permission === 'denied'}
            >
              {isRequesting ? 'Requesting...' : '🔔 Enable Notifications'}
            </Button>
          )}

          {permission === 'granted' && (
            <Button
              variant="outline"
              onClick={handleTestNotification}
            >
              🧪 Test Notification
            </Button>
          )}
        </div>

        {/* Help Text */}
        {permission === 'denied' && (
          <div className="bg-warning-50 border-l-4 border-warning-500 p-3 rounded">
            <p className="text-sm text-warning-800">
              <strong>Notifications are blocked.</strong> To enable them:
            </p>
            <ol className="text-xs text-warning-700 mt-2 ml-4 list-decimal space-y-1">
              <li>Click the lock icon in your browser's address bar</li>
              <li>Find "Notifications" in the permissions list</li>
              <li>Change it to "Allow"</li>
              <li>Refresh this page</li>
            </ol>
          </div>
        )}

        {/* Features */}
        <div className="bg-neutral-50 p-3 rounded">
          <p className="text-sm font-medium text-neutral-800 mb-2">
            What you'll receive:
          </p>
          <ul className="text-xs text-neutral-600 space-y-1">
            <li>✅ Medication reminders at scheduled times</li>
            <li>✅ Overdue dose alerts</li>
            <li>✅ Low stock warnings</li>
            <li>✅ Critical safety alerts</li>
          </ul>
        </div>
      </div>
    </Card>
  )
}

export default NotificationSettings
