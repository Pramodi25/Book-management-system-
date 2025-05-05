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
    primary: "border-l-4 border-blue-500",
    success: "border-l-4 border-green-500",
    warning: "border-l-4 border-yellow-500",
    danger: "border-l-4 border-red-500",
    info: "border-l-4 border-indigo-500",
  };
  
  return (
    <div 
      className={`${baseClasses} ${hoverClasses} ${cardTypeClasses[cardType]} ${className}`}
      onClick={onClick}
    >
      {isLoading && (
        <div className="absolute inset-0 bg-white bg-opacity-80 flex items-center justify-center z-10">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}
      
      {(title || subtitle) && (
        <div className={`px-6 py-4 border-b border-gray-100 ${headerClassName}`}>
          <div className="flex items-center">
            {icon && <div className="mr-3">{icon}</div>}
            <div>
              {title && <h3 className="text-lg font-semibold text-gray-800">{title}</h3>}
              {subtitle && <p className="mt-1 text-sm text-gray-500">{subtitle}</p>}
            </div>
          </div>
        </div>
      )}
      
      <div className={`px-6 py-5 ${bodyClassName}`}>
        {children}
      </div>
      
      {footer && (
        <div className={`px-6 py-4 bg-gray-50 border-t border-gray-100 ${footerClassName}`}>
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card;