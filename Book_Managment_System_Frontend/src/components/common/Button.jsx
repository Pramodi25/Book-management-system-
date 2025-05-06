import React from 'react';

const Button = ({ 
  children, 
  onClick, 
  type = 'button', 
  variant = 'primary', 
  size = 'md',
  disabled = false,
  className = '',
  fullWidth = false,
  icon = null,
  iconPosition = 'left',
  isLoading = false,
  ...props 
}) => {
  const baseClasses = 'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variantClasses = {
    primary: 'bg-primary-purple text-white hover:bg-primary-navy focus:ring-primary-mauve shadow-sm',
    secondary: 'bg-primary-lavender bg-opacity-20 text-primary-navy hover:bg-primary-lavender hover:bg-opacity-30 focus:ring-primary-mauve border border-primary-lavender',
    success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500 shadow-sm',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 shadow-sm',
    warning: 'bg-yellow-500 text-white hover:bg-yellow-600 focus:ring-yellow-400 shadow-sm',
    info: 'bg-primary-mauve text-white hover:bg-primary-purple focus:ring-primary-lavender shadow-sm',
    light: 'bg-white text-primary-navy hover:bg-primary-lavender hover:bg-opacity-10 focus:ring-primary-lavender border border-primary-lavender shadow-sm',
    dark: 'bg-primary-navy text-white hover:bg-opacity-90 focus:ring-primary-mauve shadow-sm',
    link: 'bg-transparent text-primary-purple hover:text-primary-peach hover:underline',
    outline: 'bg-transparent border border-current text-primary-purple hover:bg-primary-lavender hover:bg-opacity-10',
    peach: 'bg-primary-peach text-white hover:bg-opacity-90 focus:ring-primary-lavender shadow-sm',
  };
  
  const sizeClasses = {
    xs: 'text-xs px-2.5 py-1.5',
    sm: 'text-sm px-3 py-2',
    md: 'text-base px-4 py-2',
    lg: 'text-lg px-5 py-2.5',
    xl: 'text-xl px-6 py-3',
  };
  
  const disabledClasses = disabled || isLoading ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer';
  const widthClass = fullWidth ? 'w-full' : '';
  
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${disabledClasses} ${widthClass} ${className}`}
      {...props}
    >
      {isLoading ? (
        <>
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Loading...
        </>
      ) : (
        <>
          {icon && iconPosition === 'left' && <span className="mr-2">{icon}</span>}
          {children}
          {icon && iconPosition === 'right' && <span className="ml-2">{icon}</span>}
        </>
      )}
    </button>
  );
};

export default Button;