import React, { useState } from 'react';

const Input = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  helperText,
  disabled = false,
  required = false,
  className = '',
  labelClassName = '',
  inputClassName = '',
  containerClassName = '',
  icon = null,
  iconPosition = 'left',
  ...props
}) => {
  const [focused, setFocused] = useState(false);
  
  const handleFocus = () => setFocused(true);
  const handleBlur = () => setFocused(false);
  
  const containerClasses = `relative ${containerClassName}`;
  
  const inputContainerClasses = `relative flex items-center w-full rounded-lg border ${
    error
      ? 'border-red-300 focus-within:border-red-500 focus-within:ring-1 focus-within:ring-red-500'
      : focused
        ? 'border-blue-300 ring-1 ring-blue-500'
        : 'border-gray-300 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500'
  } ${disabled ? 'bg-gray-50' : 'bg-white'} overflow-hidden transition-all duration-150 ${className}`;
  
  return (
    <div className={containerClasses}>
      {label && (
        <label 
          htmlFor={name} 
          className={`block text-sm font-medium text-gray-700 mb-1 ${labelClassName}`}
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className={inputContainerClasses}>
        {icon && iconPosition === 'left' && (
          <div className="absolute left-3 flex items-center pointer-events-none text-gray-400">
            {icon}
          </div>
        )}
        
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className={`w-full px-4 py-2.5 bg-white ${
            icon && iconPosition === 'left' ? 'pl-10' : ''
          } ${
            icon && iconPosition === 'right' ? 'pr-10' : ''
          } focus:outline-none text-gray-900 ${
            disabled ? 'cursor-not-allowed text-gray-500' : ''
          } ${inputClassName}`}
          {...props}
        />
        
        {icon && iconPosition === 'right' && (
          <div className="absolute right-3 flex items-center pointer-events-none text-gray-400">
            {icon}
          </div>
        )}
      </div>
      
      {(error || helperText) && (
        <p className={`mt-1 text-sm ${error ? 'text-red-600' : 'text-gray-500'}`}>
          {error || helperText}
        </p>
      )}
    </div>
  );
};

export default Input;