import React from 'react';

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  className = '',
}) => {
  const getPageNumbers = () => {
    let pages = [];
    
    // Always show first page
    pages.push(1);
    
    // Calculate range around current page
    let start = Math.max(2, currentPage - 1);
    let end = Math.min(totalPages - 1, currentPage + 1);
    
    // Add ellipsis after page 1 if needed
    if (start > 2) {
      pages.push('...');
    }
    
    // Add pages in the middle
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    
    // Add ellipsis before last page if needed
    if (end < totalPages - 1) {
      pages.push('...');
    }
    
    // Always show last page if it exists
    if (totalPages > 1) {
      pages.push(totalPages);
    }
    
    return pages;
  };
  
  if (totalPages <= 1) return null;
  
  const pageNumbers = getPageNumbers();
  
  return (
    <nav className={`flex items-center justify-center mt-6 ${className}`}>
      <ul className="flex space-x-1">
        {/* Previous button */}
        <li>
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-3 py-1 rounded ${
              currentPage === 1
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Previous
          </button>
        </li>
        
        {/* Page numbers */}
        {pageNumbers.map((page, index) => (
          <li key={index}>
            {page === '...' ? (
              <span className="px-3 py-1">...</span>
            ) : (
              <button
                onClick={() => onPageChange(page)}
                className={`px-3 py-1 rounded ${
                  currentPage === page
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {page}
              </button>
            )}
          </li>
        ))}
        
        {/* Next button */}
        <li>
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`px-3 py-1 rounded ${
              currentPage === totalPages
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Next
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;