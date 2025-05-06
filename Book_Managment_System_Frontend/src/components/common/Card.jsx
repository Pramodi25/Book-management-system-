import React from 'react';

const Card = ({
  children,
  title,
  subtitle,
  footer,
  className = '',
  bodyClassName = '',
  headerClassName = '',
  footerClassName = '',
  onClick,
  icon,
  cardType = 'default',
  isLoading = false,
}) => {
  const baseClasses = "bg-white rounded-xl shadow-sm overflow-hidden transform transition-all duration-200";
  
  const hoverClasses = onClick ? "hover:shadow-md hover:-translate-y-1 cursor-pointer" : "";
  
  const cardTypeClasses = {
    default: "",
    primary: "border-l-4 border-primary-purple",
    secondary: "border-l-4 border-primary-mauve",
    peach: "border-l-4 border-primary-peach",
    navy: "border-l-4 border-primary-navy",
    lavender: "border-l-4 border-primary-lavender",
    success: "border-l-4 border-green-500",
    warning: "border-l-4 border-yellow-500",
    danger: "border-l-4 border-red-500",
  };
  
  return (
    <div 
      className={`${baseClasses} ${hoverClasses} ${cardTypeClasses[cardType]} ${className}`}
      onClick={onClick}
    >
      {isLoading && (
        <div className="absolute inset-0 bg-white bg-opacity-80 flex items-center justify-center z-10">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary-purple"></div>
        </div>
      )}
      
      {(title || subtitle) && (
        <div className={`px-6 py-4 border-b border-primary-lavender border-opacity-20 ${headerClassName}`}>
          <div className="flex items-center">
            {icon && <div className="mr-3">{icon}</div>}
            <div>
              {title && <h3 className="text-lg font-semibold text-primary-navy">{title}</h3>}
              {subtitle && <p className="mt-1 text-sm text-primary-mauve">{subtitle}</p>}
            </div>
          </div>
        </div>
      )}
      
      <div className={`px-6 py-5 ${bodyClassName}`}>
        {children}
      </div>
      
      {footer && (
        <div className={`px-6 py-4 bg-primary-lavender bg-opacity-5 border-t border-primary-lavender border-opacity-20 ${footerClassName}`}>
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card;