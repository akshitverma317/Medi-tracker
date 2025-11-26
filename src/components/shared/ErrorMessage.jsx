import React from 'react'

/**
 * ErrorMessage Component
 * 
 * Display error messages with appropriate styling
 */
const ErrorMessage = ({
  title = 'Error',
  message,
  onDismiss,
  variant = 'danger',
  className = ''
}) => {
  const variantClasses = {
    danger: 'bg-danger-50 border-danger-500 text-danger-800',
    warning: 'bg-warning-50 border-warning-500 text-warning-800',
    info: 'bg-primary-50 border-primary-500 text-primary-800'
  }
  
  const iconMap = {
    danger: '❌',
    warning: '⚠️',
    info: 'ℹ️'
  }
  
  return (
    <div className={`border-l-4 p-4 ${variantClasses[variant]} ${className}`} role="alert">
      <div className="flex items-start">
        <div className="flex-shrink-0 text-xl mr-3">
          {iconMap[variant]}
        </div>
        
        <div className="flex-1">
          <h3 className="font-semibold mb-1">
            {title}
          </h3>
          {message && (
            <p className="text-sm">
              {message}
            </p>
          )}
        </div>
        
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="flex-shrink-0 ml-4 text-xl hover:opacity-70 transition-opacity"
            aria-label="Dismiss"
          >
            ×
          </button>
        )}
      </div>
    </div>
  )
}

export default ErrorMessage
