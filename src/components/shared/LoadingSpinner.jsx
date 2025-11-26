import React from 'react'

/**
 * LoadingSpinner Component
 * 
 * Animated loading indicator
 */
const LoadingSpinner = ({
  size = 'medium',
  color = 'primary',
  text,
  fullScreen = false,
  className = ''
}) => {
  const sizeClasses = {
    small: 'h-6 w-6',
    medium: 'h-12 w-12',
    large: 'h-16 w-16'
  }
  
  const colorClasses = {
    primary: 'border-primary-600',
    success: 'border-success-600',
    warning: 'border-warning-600',
    danger: 'border-danger-600',
    white: 'border-white'
  }
  
  const spinnerClasses = `animate-spin rounded-full border-b-2 ${sizeClasses[size]} ${colorClasses[color]}`
  
  const content = (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div className={spinnerClasses}></div>
      {text && (
        <p className="mt-4 text-neutral-600">{text}</p>
      )}
    </div>
  )
  
  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-neutral-50 bg-opacity-75 flex items-center justify-center z-50">
        {content}
      </div>
    )
  }
  
  return content
}

export default LoadingSpinner
