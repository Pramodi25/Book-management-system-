/**
 * Comprehensive validation utility for forms
 */

/**
 * Validates that a value is not empty
 * @param {*} value - The value to check
 * @param {string} [message] - Custom error message
 * @returns {string|null} - Error message or null if valid
 */
export const required = (value, message = 'This field is required') => {
  if (value === null || value === undefined || value === '') {
    return message;
  }
  if (typeof value === 'string' && value.trim() === '') {
    return message;
  }
  return null;
};

/**
 * Validates minimum length of a string
 * @param {number} min - Minimum length
 * @param {string} [message] - Custom error message
 * @returns {Function} - Validator function
 */
export const minLength = (min, message) => (value) => {
  if (!value || value.length < min) {
    return message || `Must be at least ${min} characters`;
  }
  return null;
};

/**
 * Validates maximum length of a string
 * @param {number} max - Maximum length
 * @param {string} [message] - Custom error message
 * @returns {Function} - Validator function
 */
export const maxLength = (max, message) => (value) => {
  if (value && value.length > max) {
    return message || `Must be no more than ${max} characters`;
  }
  return null;
};

/**
 * Validates that a value is a number and optionally within range
 * @param {Object} options - Validation options
 * @param {number} [options.min] - Minimum value
 * @param {number} [options.max] - Maximum value
 * @param {boolean} [options.integer=false] - Whether value must be an integer
 * @param {string} [options.message] - Custom error message
 * @returns {Function} - Validator function
 */
export const isNumber = ({ min, max, integer = false, message } = {}) => (value) => {
  if (value === '' || value === null || value === undefined) {
    return null; // Let required validator handle empty values
  }
  
  const num = Number(value);
  
  if (isNaN(num)) {
    return message || 'Must be a valid number';
  }
  
  if (integer && !Number.isInteger(num)) {
    return message || 'Must be a whole number';
  }
  
  if (min !== undefined && num < min) {
    return message || `Must be at least ${min}`;
  }
  
  if (max !== undefined && num > max) {
    return message || `Must be no more than ${max}`;
  }
  
  return null;
};

/**
 * Validates an email address
 * @param {string} [message] - Custom error message
 * @returns {Function} - Validator function
 */
export const isEmail = (message = 'Must be a valid email address') => (value) => {
  if (!value) return null; // Let required validator handle empty values
  
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(value) ? null : message;
};

/**
 * Validates a URL
 * @param {string} [message] - Custom error message
 * @returns {Function} - Validator function
 */
export const isUrl = (message = 'Must be a valid URL') => (value) => {
  if (!value) return null; // Let required validator handle empty values
  
  try {
    new URL(value);
    return null;
  } catch {
    return message;
  }
};

/**
 * Validates a date
 * @param {Object} options - Validation options
 * @param {Date|string} [options.min] - Minimum date
 * @param {Date|string} [options.max] - Maximum date
 * @param {string} [options.message] - Custom error message
 * @returns {Function} - Validator function
 */
export const isDate = ({ min, max, message } = {}) => (value) => {
  if (!value) return null; // Let required validator handle empty values
  
  const date = new Date(value);
  
  if (isNaN(date.getTime())) {
    return message || 'Must be a valid date';
  }
  
  if (min) {
    const minDate = new Date(min);
    if (date < minDate) {
      return message || `Must be after ${minDate.toLocaleDateString()}`;
    }
  }
  
  if (max) {
    const maxDate = new Date(max);
    if (date > maxDate) {
      return message || `Must be before ${maxDate.toLocaleDateString()}`;
    }
  }
  
  return null;
};

/**
 * Validates a value matches a pattern
 * @param {RegExp} pattern - Regular expression to match
 * @param {string} [message] - Custom error message
 * @returns {Function} - Validator function
 */
export const pattern = (pattern, message = 'Invalid format') => (value) => {
  if (!value) return null; // Let required validator handle empty values
  return pattern.test(value) ? null : message;
};

/**
 * ISBN validator
 * @param {string} [message] - Custom error message
 * @returns {Function} - Validator function
 */
export const isIsbn = (message = 'Must be a valid ISBN-10 or ISBN-13') => (value) => {
  if (!value) return null; // Let required validator handle empty values
  
  // Remove hyphens and spaces
  const isbn = value.replace(/[-\s]/g, '');
  
  // ISBN-10
  if (isbn.length === 10) {
    if (!/^\d{9}[\dX]$/.test(isbn)) {
      return message;
    }
    
    // Check digit calculation for ISBN-10
    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += (10 - i) * parseInt(isbn.charAt(i));
    }
    
    // Check digit can be 'X' (representing 10)
    const checkDigit = isbn.charAt(9) === 'X' ? 10 : parseInt(isbn.charAt(9));
    sum += checkDigit;
    
    return sum % 11 === 0 ? null : message;
  }
  
  // ISBN-13
  if (isbn.length === 13) {
    if (!/^\d{13}$/.test(isbn)) {
      return message;
    }
    
    // Check digit calculation for ISBN-13
    let sum = 0;
    for (let i = 0; i < 12; i++) {
      sum += (i % 2 === 0 ? 1 : 3) * parseInt(isbn.charAt(i));
    }
    
    const checkDigit = (10 - (sum % 10)) % 10;
    
    return parseInt(isbn.charAt(12)) === checkDigit ? null : message;
  }
  
  return message;
};

/**
 * Runs multiple validators
 * @param {Array<Function>} validators - List of validator functions
 * @returns {Function} - Combined validator function
 */
export const compose = (validators) => (value) => {
  for (const validator of validators) {
    const error = validator(value);
    if (error) {
      return error;
    }
  }
  return null;
};

/**
 * Validates an entire form
 * @param {Object} values - Form values
 * @param {Object} validations - Validation rules
 * @returns {Object} - Validation errors
 */
export const validateForm = (values, validations) => {
  const errors = {};
  
  Object.entries(validations).forEach(([field, validators]) => {
    const value = values[field];
    
    if (Array.isArray(validators)) {
      // Run through all validators
      for (const validator of validators) {
        const error = validator(value);
        if (error) {
          errors[field] = error;
          break;
        }
      }
    } else {
      // Single validator function
      const error = validators(value);
      if (error) {
        errors[field] = error;
      }
    }
  });
  
  return errors;
};