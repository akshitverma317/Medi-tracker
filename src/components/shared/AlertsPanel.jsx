import React from 'react'
import Card from './Card.jsx'
import Badge from './Badge.jsx'

/**
 * AlertsPanel Component
 * 
 * Display smart alerts and warnings
 */
const AlertsPanel = ({ alerts = [] }) => {
  if (alerts.length === 0) {
    return (
      <Card title="🛡️ Safety Alerts">
        <div className="text-center py-6">
          <div className="text-4xl mb-2">✅</div>
          <p className="text-neutral-600">No alerts at this time</p>
          <p className="text-xs text-neutral-500 mt-1">
            All medications are safe and properly managed
          </p>
        </div>
      </Card>
    )
  }

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical':
        return 'danger'
      case 'high':
        return 'warning'
      case 'medium':
        return 'info'
      default:
        return 'secondary'
    }
  }

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'critical':
        return '🚨'
      case 'high':
        return '⚠️'
      case 'medium':
        return 'ℹ️'
      default:
        return '📌'
    }
  }

  const getTypeLabel = (type) => {
    switch (type) {
      case 'allergy':
        return 'Allergy Alert'
      case 'drug-interaction':
        return 'Drug Interaction'
      case 'duplicate':
        return 'Duplicate Medication'
      case 'expired':
        return 'Expired'
      case 'expiring-soon':
        return 'Expiring Soon'
      case 'out-of-stock':
        return 'Out of Stock'
      case 'low-stock':
        return 'Low Stock'
      default:
        return 'Alert'
    }
  }

  return (
    <Card title="🛡️ Safety Alerts">
      <div className="space-y-3">
        {alerts.map((alert, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg border-l-4 ${
              alert.severity === 'critical'
                ? 'bg-danger-50 border-danger-500'
                : alert.severity === 'high'
                ? 'bg-warning-50 border-warning-500'
                : alert.severity === 'medium'
                ? 'bg-info-50 border-info-500'
                : 'bg-neutral-50 border-neutral-300'
            }`}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-xl">{getSeverityIcon(alert.severity)}</span>
                <div>
                  <h4 className="font-semibold text-neutral-800">
                    {alert.title}
                  </h4>
                  <p className="text-xs text-neutral-600">
                    {getTypeLabel(alert.type)}
                  </p>
                </div>
              </div>
              <Badge variant={getSeverityColor(alert.severity)}>
                {alert.severity.toUpperCase()}
              </Badge>
            </div>

            {/* Message */}
            <p className="text-sm text-neutral-700 mb-2">
              {alert.message}
            </p>

            {/* Details */}
            {alert.details && (
              <p className="text-xs text-neutral-600 bg-white bg-opacity-50 p-2 rounded">
                {alert.details}
              </p>
            )}

            {/* Additional Info */}
            {alert.medicines && alert.medicines.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1">
                {alert.medicines.map((med, i) => (
                  <span
                    key={i}
                    className="text-xs bg-white px-2 py-1 rounded border border-neutral-200"
                  >
                    {med}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </Card>
  )
}

export default AlertsPanel
