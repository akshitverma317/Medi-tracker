import React from 'react'

/**
 * DatePicker Component
 * 
 * Date input with validation
 */
const DatePicker = ({
  value,
  onChange,
  min,
  max,
  disabled = false,
  error = false,
  errorMessage,
  label,
  required = false,
  className = '',
  ...props
}) => {
  const inputClasses = `input ${error ? 'input-error' : ''} ${className}`
  
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-neutral-700 mb-1">
          {label}
          {required && <span className="text-danger-500 ml-1">*</span>}
        </label>
      )}
      
      <input
        type="date"
        value={value}
        onChange={onChange}
        min={min}
        max={max}
        disabled={disabled}
        className={inputClasses}
        aria-invalid={error}
        aria-describedby={error && errorMessage ? 'error-message' : undefined}
        {...props}
      />
      
      {error && errorMessage && (
        <p id="error-message" className="mt-1 text-sm text-danger-600">
          {errorMessage}
        </p>
      )}
    </div>
  )
}

export default DatePicker
