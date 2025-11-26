import React from 'react'
import Button from './Button.jsx'

/**
 * EmptyState Component
 * 
 * Helpful message when no data exists with optional action
 */
const EmptyState = ({
  icon,
  title,
  message,
  actionLabel,
  onAction,
  className = ''
}) => {
  return (
    <div className={`flex flex-col items-center justify-center py-12 px-4 text-center ${className}`}>
      {icon && (
        <div className="text-6xl mb-4 text-neutral-300">
          {icon}
        </div>
      )}
      
      {title && (
        <h3 className="text-xl font-semibold text-neutral-800 mb-2">
          {title}
        </h3>
      )}
      
      {message && (
        <p className="text-neutral-600 max-w-md mb-6">
          {message}
        </p>
      )}
      
      {actionLabel && onAction && (
        <Button onClick={onAction} variant="primary">
          {actionLabel}
        </Button>
      )}
    </div>
  )
}

export default EmptyState
