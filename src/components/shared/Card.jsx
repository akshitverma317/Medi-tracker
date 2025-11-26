import React from 'react'

/**
 * Card Component
 * 
 * Container component for content sections
 */
const Card = ({
  children,
  title,
  subtitle,
  actions,
  padding = 'normal',
  className = '',
  onClick,
  ...props
}) => {
  const paddingClasses = {
    none: '',
    small: 'p-2',
    normal: 'p-4',
    large: 'p-6'
  }
  
  const baseClasses = `card ${paddingClasses[padding]} ${onClick ? 'cursor-pointer hover:shadow-lg transition-shadow' : ''} ${className}`
  
  return (
    <div className={baseClasses} onClick={onClick} {...props}>
      {(title || actions) && (
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            {title && (
              <h3 className="text-lg font-semibold text-neutral-800">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-sm text-neutral-600 mt-1">
                {subtitle}
              </p>
            )}
          </div>
          {actions && (
            <div className="flex items-center gap-2 ml-4">
              {actions}
            </div>
          )}
        </div>
      )}
      
      {children}
    </div>
  )
}

export default Card
