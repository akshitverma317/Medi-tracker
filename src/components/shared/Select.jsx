import React from 'react'

/**
 * Select Component
 * 
 * Dropdown select with validation states
 */
const Select = ({
  value,
  onChange,
  options = [],
  placeholder = 'Select an option',
  disabled = false,
  error = false,
  errorMessage,
  label,
  required = false,
  className = '',
  ...props
}) => {
  const selectClasses = `input ${error ? 'input-error' : ''} ${className}`
  
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-neutral-700 mb-1">
          {label}
          {required && <span className="text-danger-500 ml-1">*</span>}
        </label>
      )}
      
      <select
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={selectClasses}
        aria-invalid={error}
        aria-describedby={error && errorMessage ? 'error-message' : undefined}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        
        {options.map((option) => {
          // Support both string array and object array
          const optionValue = typeof option === 'string' ? option : option.value
          const optionLabel = typeof option === 'string' ? option : option.label
          
          return (
            <option key={optionValue} value={optionValue}>
              {optionLabel}
            </option>
          )
        })}
      </select>
      
      {error && errorMessage && (
        <p id="error-message" className="mt-1 text-sm text-danger-600">
          {errorMessage}
        </p>
      )}
    </div>
  )
}

export default Select
