import React from 'react';
import { SearchResult } from '../types';
import { FileText, Tag, Hash, Eye } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface DocumentCardProps {
  document: SearchResult;
  selectedMetric: string;
  onViewDetails: (document: SearchResult) => void;
}

const DocumentCard: React.FC<DocumentCardProps> = ({ document, selectedMetric, onViewDetails }) => {
  const { theme } = useTheme();
  
  const getScoreValue = () => {
    switch(selectedMetric) {
      case 'tfidf':
        // For TF-IDF, we use sim_cos value which should be in the document
        return document.sim_cos?.toFixed(4) || document.tfidf?.toFixed(4) || 'N/A';
      case 'bm25':
        // For BM25, we use bm25_scores value which should be in the document
        return document.bm25_scores?.toFixed(4) || document.bm25?.toFixed(4) || 'N/A';
      case 'promedio':
      default:
        // For Promedio, we use promedio value
        return document.promedio?.toFixed(4) || 'N/A';
    }
  };

  const getScoreLabel = () => {
    switch(selectedMetric) {
      case 'tfidf':
        return 'TF-IDF (sim_cos)';
      case 'bm25':
        return 'BM25 Score';
      case 'promedio':
      default:
        return 'Promedio Score';
    }
  };

  const truncateText = (text: string, maxLength: number = 300) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const handleCardClick = () => {
    onViewDetails(document);
  };

  return (
    <div 
      className={`
        rounded-lg overflow-hidden transition-all duration-300 hover:shadow-lg border cursor-pointer
        ${theme === 'dark' 
          ? 'bg-gray-800 border-gray-700 hover:border-gray-600 hover:bg-gray-750' 
          : 'bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50'} 
        shadow-sm transform hover:scale-[1.02]
      `}
      onClick={handleCardClick}
    >
      <div className="p-6">
        {/* Header with document ID and score */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center">
            <FileText className={`h-5 w-5 mr-2 ${theme === 'dark' ? 'text-purple-400' : 'text-purple-600'}`} />
            <span className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              Doc ID: {document.doc_id}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <div className={`
              px-3 py-1 rounded-full text-sm font-medium
              ${theme === 'dark' 
                ? 'bg-purple-900 text-purple-200' 
                : 'bg-purple-100 text-purple-800'}
            `}>
              {getScoreLabel()}: {getScoreValue()}
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onViewDetails(document);
              }}
              className={`
                p-2 rounded-full transition-colors duration-200
                ${theme === 'dark' 
                  ? 'hover:bg-gray-700 text-gray-400 hover:text-white' 
                  : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'}
              `}
              aria-label="View details"
            >
              <Eye size={16} />
            </button>
          </div>
        </div>

        {/* Title */}
        <h3 className={`text-lg font-semibold mb-3 leading-tight ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
          {document.title}
        </h3>

        {/* Document text content */}
        <div className={`mb-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
          <p className="text-sm leading-relaxed">
            {truncateText(document.text)}
          </p>
        </div>

        {/* Tags */}
        {document.tags && document.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {document.tags.slice(0, 4).map((tag, index) => (
              <span 
                key={index}
                className={`
                  inline-flex items-center text-xs px-2 py-1 rounded-full
                  ${theme === 'dark' 
                    ? 'bg-gray-700 text-gray-300 border border-gray-600' 
                    : 'bg-gray-100 text-gray-700 border border-gray-200'}
                `}
              >
                <Tag size={10} className="mr-1" />
                {tag}
              </span>
            ))}
            {document.tags.length > 4 && (
              <span className={`
                inline-flex items-center text-xs px-2 py-1 rounded-full
                ${theme === 'dark' 
                  ? 'bg-gray-600 text-gray-400' 
                  : 'bg-gray-200 text-gray-600'}
              `}>
                +{document.tags.length - 4} more
              </span>
            )}
          </div>
        )}

        {/* Footer with additional info */}
        <div className={`mt-4 pt-3 border-t flex items-center justify-between ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className={`flex items-center text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
            <Hash size={12} className="mr-1" />
            <span>Document #{document.doc_id}</span>
          </div>
          <div className={`flex items-center text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
            <span>{document.tags.length} tag{document.tags.length !== 1 ? 's' : ''}</span>
            <span className="mx-2">•</span>
            <span>Click para ver detalles</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentCard;