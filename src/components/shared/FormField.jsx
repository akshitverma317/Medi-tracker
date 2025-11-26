import React from 'react'

/**
 * FormField Component
 * 
 * Wrapper for form inputs with label, error display, and help text
 */
const FormField = ({
  label,
  error,
  errorMessage,
  helpText,
  required = false,
  children,
  className = ''
}) => {
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-neutral-700 mb-1">
          {label}
          {required && <span className="text-danger-500 ml-1">*</span>}
        </label>
      )}
      
      {children}
      
      {helpText && !error && (
        <p className="mt-1 text-sm text-neutral-500">
          {helpText}
        </p>
      )}
      
      {error && errorMessage && (
        <p className="mt-1 text-sm text-danger-600">
          {errorMessage}
        </p>
      )}
    </div>
  )
}

export default FormField
