import React, { useState } from 'react';
import { SearchResult } from '../types';
import { useTheme } from '../context/ThemeContext';
import DocumentCard from './DocumentCard';
import DocumentDetailModal from './DocumentDetailModal';

interface ResultsListProps {
  results: SearchResult[];
  loading: boolean;
  hasSearched: boolean;
  query: string;
  selectedMetric: string;
}

const ResultsList: React.FC<ResultsListProps> = ({ 
  results, 
  loading, 
  hasSearched, 
  query, 
  selectedMetric 
}) => {
  const { theme } = useTheme();
  const [selectedDocument, setSelectedDocument] = useState<SearchResult | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleViewDetails = (document: SearchResult) => {
    setSelectedDocument(document);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedDocument(null);
  };
  
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-700"></div>
        <p className="mt-4 text-gray-600 dark:text-gray-300">Searching for results...</p>
      </div>
    );
  }
  
  if (!hasSearched) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
        <div className="mx-auto w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mb-4">
          <Search className="h-8 w-8 text-purple-600 dark:text-purple-300" />
        </div>
        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">Start Your Search</h3>
        <p className="text-gray-600 dark:text-gray-300">
          Enter a search query above to discover relevant documents from our database.
        </p>
      </div>
    );
  }
  
  if (results.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
        <div className="mx-auto w-16 h-16 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center mb-4">
          <FileQuestion className="h-8 w-8 text-orange-600 dark:text-orange-300" />
        </div>
        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">No Results Found</h3>
        <p className="text-gray-600 dark:text-gray-300">
          We couldn't find any results for "{query}". Try different keywords or adjust your search metric.
        </p>
      </div>
    );
  }
  
  return (
    <>
      <div>
        <h2 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-200">
          Found {results.length} results for "{query}" using {selectedMetric.toUpperCase()}
        </h2>
        <div className="space-y-6">
          {results.map((document) => (
            <DocumentCard 
              key={document.doc_id} 
              document={document} 
              selectedMetric={selectedMetric}
              onViewDetails={handleViewDetails}
            />
          ))}
        </div>
      </div>

      <DocumentDetailModal
        document={selectedDocument}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        selectedMetric={selectedMetric}
      />
    </>
  );
};

// Helper components
const Search: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
);

const FileQuestion: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
    <path d="M10 10.3c.2-.4.5-.8.9-1a2.1 2.1 0 0 1 2.6.4c.3.4.5.8.5 1.3 0 1.3-2 2-2 2"></path>
    <path d="M12 17h.01"></path>
  </svg>
);

export default ResultsList;