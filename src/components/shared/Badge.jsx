import React from 'react'
import { DOSE_STATUS, DOSE_STATUS_LABELS, DOSE_STATUS_COLORS } from '../../types/constants.js'

/**
 * Badge Component
 * 
 * Status badge with color coding for dose statuses
 */
const Badge = ({
  children,
  status,
  variant = 'default',
  size = 'medium',
  className = '',
  ...props
}) => {
  const baseClasses = 'badge inline-flex items-center font-medium'
  
  // If status is provided, use status-specific colors
  let colorClasses = ''
  if (status && DOSE_STATUS_COLORS[status]) {
    const colors = DOSE_STATUS_COLORS[status]
    colorClasses = `${colors.bg} ${colors.text} ${colors.border} border`
  } else {
    // Default variant colors
    const variantClasses = {
      default: 'bg-neutral-100 text-neutral-800',
      primary: 'bg-primary-100 text-primary-800',
      success: 'bg-success-100 text-success-800',
      warning: 'bg-warning-100 text-warning-800',
      danger: 'bg-danger-100 text-danger-800'
    }
    colorClasses = variantClasses[variant]
  }
  
  const sizeClasses = {
    small: 'px-2 py-0.5 text-xs',
    medium: 'px-3 py-1 text-sm',
    large: 'px-4 py-1.5 text-base'
  }
  
  const classes = `${baseClasses} ${colorClasses} ${sizeClasses[size]} ${className}`
  
  // Display status label if status is provided and no children
  const displayText = children || (status && DOSE_STATUS_LABELS[status]) || ''
  
  return (
    <span className={classes} {...props}>
      {displayText}
    </span>
  )
}

export default Badge
