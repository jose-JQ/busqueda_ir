import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface PaginationProps {
  currentPage: number;
  totalResults: number;
  resultsPerPage: number;
  onPageChange: (page: number) => void;
  onResultsPerPageChange: (count: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalResults,
  resultsPerPage,
  onPageChange,
  onResultsPerPageChange,
}) => {
  const { theme } = useTheme();
  
  const totalPages = Math.ceil(totalResults / resultsPerPage);
  
  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };
  
  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };
  
  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    
    if (totalPages <= 7) {
      // Show all pages if there are 7 or fewer
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always include first page
      pages.push(1);
      
      // Add ellipsis if current page is more than 3
      if (currentPage > 3) {
        pages.push('...');
      }
      
      // Add pages around current page
      const startPage = Math.max(2, currentPage - 1);
      const endPage = Math.min(totalPages - 1, currentPage + 1);
      
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
      
      // Add ellipsis if current page is less than totalPages - 2
      if (currentPage < totalPages - 2) {
        pages.push('...');
      }
      
      // Always include last page
      pages.push(totalPages);
    }
    
    return pages;
  };
  
  return (
    <div className={`
      flex flex-col sm:flex-row items-center justify-between
      ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}
      py-3
    `}>
      <div className="flex items-center text-sm mb-4 sm:mb-0">
        <span>Showing </span>
        <select
          value={resultsPerPage}
          onChange={(e) => onResultsPerPageChange(Number(e.target.value))}
          className={`
            mx-1 rounded-md border px-2 py-1
            ${theme === 'dark' 
              ? 'bg-gray-800 text-white border-gray-700' 
              : 'bg-white text-gray-900 border-gray-300'}
          `}
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
        </select>
        <span>of {totalResults} results</span>
      </div>
      
      <div className="flex items-center space-x-1">
        <button
          onClick={handlePrevious}
          disabled={currentPage === 1}
          className={`
            p-2 rounded-md border transition-colors duration-200 flex items-center justify-center
            ${currentPage === 1 
              ? (theme === 'dark' ? 'bg-gray-800 text-gray-600 border-gray-700' : 'bg-gray-100 text-gray-400 border-gray-200') 
              : (theme === 'dark' ? 'bg-gray-800 text-gray-300 border-gray-700 hover:bg-gray-700' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50')}
          `}
          aria-label="Previous page"
        >
          <ChevronLeft size={18} />
        </button>
        
        {getPageNumbers().map((page, index) => (
          <React.Fragment key={index}>
            {typeof page === 'number' ? (
              <button
                onClick={() => onPageChange(page)}
                className={`
                  w-9 h-9 rounded-md border transition-colors duration-200 flex items-center justify-center
                  ${page === currentPage
                    ? (theme === 'dark' ? 'bg-purple-900 text-white border-purple-800' : 'bg-purple-600 text-white border-purple-500')
                    : (theme === 'dark' ? 'bg-gray-800 text-gray-300 border-gray-700 hover:bg-gray-700' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50')}
                `}
                aria-label={`Page ${page}`}
                aria-current={page === currentPage ? 'page' : undefined}
              >
                {page}
              </button>
            ) : (
              <span className="w-9 h-9 flex items-center justify-center">...</span>
            )}
          </React.Fragment>
        ))}
        
        <button
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className={`
            p-2 rounded-md border transition-colors duration-200 flex items-center justify-center
            ${currentPage === totalPages 
              ? (theme === 'dark' ? 'bg-gray-800 text-gray-600 border-gray-700' : 'bg-gray-100 text-gray-400 border-gray-200') 
              : (theme === 'dark' ? 'bg-gray-800 text-gray-300 border-gray-700 hover:bg-gray-700' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50')}
          `}
          aria-label="Next page"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
};

export default Pagination;