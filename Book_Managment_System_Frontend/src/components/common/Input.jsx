import React from 'react';

const Input = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  disabled = false,
  required = false,
  className = '',
  labelClassName = '',
  inputClassName = '',
  ...props
}) => {
  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label 
          htmlFor={name} 
          className={`block text-sm font-medium text-gray-700 mb-1 ${labelClassName}`}
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
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
              className={`w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                error ? 'border-red-500' : ''
              } ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''} ${inputClassName}`}
              {...props}
            />
            
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
          </div>
        );
      };

export default Input;