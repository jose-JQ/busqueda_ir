import React from 'react';
import { SearchResult } from '../types';
import { X, FileText, Tag, Hash, Copy, Check } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface DocumentDetailModalProps {
  document: SearchResult | null;
  isOpen: boolean;
  onClose: () => void;
  selectedMetric: string;
}

const DocumentDetailModal: React.FC<DocumentDetailModalProps> = ({ 
  document, 
  isOpen, 
  onClose, 
  selectedMetric 
}) => {
  const { theme } = useTheme();
  const [copied, setCopied] = React.useState(false);

  if (!isOpen || !document) return null;

  const getScoreValue = () => {
    switch(selectedMetric) {
      case 'tfidf':
        // For TF-IDF, we use sim_cos value which should be in the document
        return document.sim_cos?.toFixed(6) || document.tfidf?.toFixed(6) || 'N/A';
      case 'bm25':
        // For BM25, we use bm25_scores value which should be in the document
        return document.bm25_scores?.toFixed(6) || document.bm25?.toFixed(6) || 'N/A';
      case 'promedio':
      default:
        // For Promedio, we use promedio value
        return document.promedio?.toFixed(6) || 'N/A';
    }
  };

  const getScoreLabel = () => {
    switch(selectedMetric) {
      case 'tfidf':
        return 'TF-IDF Score (sim_cos)';
      case 'bm25':
        return 'BM25 Score (bm25_scores)';
      case 'promedio':
      default:
        return 'Promedio Score';
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className={`
        relative w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-lg shadow-xl
        ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}
      `}>
        {/* Header */}
        <div className={`
          flex items-center justify-between p-6 border-b
          ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}
        `}>
          <div className="flex items-center">
            <FileText className={`h-6 w-6 mr-3 ${theme === 'dark' ? 'text-purple-400' : 'text-purple-600'}`} />
            <div>
              <h2 className={`text-xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                Document Details
              </h2>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                ID: {document.doc_id}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`
              p-2 rounded-full transition-colors duration-200
              ${theme === 'dark' 
                ? 'hover:bg-gray-700 text-gray-400 hover:text-white' 
                : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'}
            `}
            aria-label="Close modal"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="p-6 space-y-6">
            {/* Score Section */}
            <div className={`
              p-4 rounded-lg border
              ${theme === 'dark' 
                ? 'bg-purple-900/20 border-purple-700' 
                : 'bg-purple-50 border-purple-200'}
            `}>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className={`font-medium ${theme === 'dark' ? 'text-purple-200' : 'text-purple-800'}`}>
                    {getScoreLabel()}
                  </h3>
                  <p className={`text-2xl font-bold mt-1 ${theme === 'dark' ? 'text-purple-300' : 'text-purple-700'}`}>
                    {getScoreValue()}
                  </p>
                  <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-purple-400' : 'text-purple-600'}`}>
                    Metric: {selectedMetric === 'tfidf' ? 'sim_cos' : selectedMetric === 'bm25' ? 'bm25_scores' : 'promedio'}
                  </p>
                </div>
                <div className={`
                  px-3 py-1 rounded-full text-sm font-medium
                  ${theme === 'dark' 
                    ? 'bg-purple-800 text-purple-200' 
                    : 'bg-purple-100 text-purple-800'}
                `}>
                  {selectedMetric.toUpperCase()}
                </div>
              </div>
            </div>

            {/* Title Section */}
            <div>
              <h3 className={`text-lg font-semibold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                Title
              </h3>
              <div className={`
                p-4 rounded-lg border
                ${theme === 'dark' 
                  ? 'bg-gray-700 border-gray-600' 
                  : 'bg-gray-50 border-gray-200'}
              `}>
                <p className={`text-lg ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
                  {document.title}
                </p>
              </div>
            </div>

            {/* Content Section */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                  Document Content
                </h3>
                <button
                  onClick={() => copyToClipboard(document.text)}
                  className={`
                    flex items-center px-3 py-1 text-sm rounded-md transition-colors duration-200
                    ${theme === 'dark' 
                      ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}
                  `}
                >
                  {copied ? (
                    <>
                      <Check size={14} className="mr-1" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy size={14} className="mr-1" />
                      Copy
                    </>
                  )}
                </button>
              </div>
              <div className={`
                p-4 rounded-lg border max-h-96 overflow-y-auto
                ${theme === 'dark' 
                  ? 'bg-gray-700 border-gray-600' 
                  : 'bg-gray-50 border-gray-200'}
              `}>
                <p className={`text-sm leading-relaxed whitespace-pre-wrap ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
                  {document.text}
                </p>
              </div>
            </div>

            {/* Tags Section */}
            {document.tags && document.tags.length > 0 && (
              <div>
                <h3 className={`text-lg font-semibold mb-3 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                  Tags ({document.tags.length})
                </h3>
                <div className="flex flex-wrap gap-2">
                  {document.tags.map((tag, index) => (
                    <span 
                      key={index}
                      className={`
                        inline-flex items-center px-3 py-1 rounded-full text-sm font-medium
                        ${theme === 'dark' 
                          ? 'bg-gray-700 text-gray-300 border border-gray-600' 
                          : 'bg-gray-100 text-gray-700 border border-gray-200'}
                      `}
                    >
                      <Tag size={12} className="mr-1" />
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* All Scores Section - Show all available scores for debugging */}
            <div className={`
              p-4 rounded-lg border
              ${theme === 'dark' 
                ? 'bg-gray-700 border-gray-600' 
                : 'bg-gray-50 border-gray-200'}
            `}>
              <h3 className={`text-lg font-semibold mb-3 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                All Available Scores
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {document.promedio !== undefined && (
                  <div>
                    <span className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                      Promedio:
                    </span>
                    <p className={`mt-1 font-mono ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
                      {document.promedio.toFixed(6)}
                    </p>
                  </div>
                )}
                {document.sim_cos !== undefined && (
                  <div>
                    <span className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                      TF-IDF (sim_cos):
                    </span>
                    <p className={`mt-1 font-mono ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
                      {document.sim_cos.toFixed(6)}
                    </p>
                  </div>
                )}
                {document.bm25_scores !== undefined && (
                  <div>
                    <span className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                      BM25 (bm25_scores):
                    </span>
                    <p className={`mt-1 font-mono ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
                      {document.bm25_scores.toFixed(6)}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Metadata Section */}
            <div className={`
              p-4 rounded-lg border
              ${theme === 'dark' 
                ? 'bg-gray-700 border-gray-600' 
                : 'bg-gray-50 border-gray-200'}
            `}>
              <h3 className={`text-lg font-semibold mb-3 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                Document Metadata
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    Document ID:
                  </span>
                  <p className={`mt-1 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
                    {document.doc_id}
                  </p>
                </div>
                <div>
                  <span className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    Content Length:
                  </span>
                  <p className={`mt-1 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
                    {document.text.length} characters
                  </p>
                </div>
                <div>
                  <span className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    Word Count:
                  </span>
                  <p className={`mt-1 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
                    ~{document.text.split(/\s+/).length} words
                  </p>
                </div>
                <div>
                  <span className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    Tags Count:
                  </span>
                  <p className={`mt-1 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
                    {document.tags.length} tag{document.tags.length !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className={`
          flex justify-end p-6 border-t
          ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}
        `}>
          <button
            onClick={onClose}
            className={`
              px-6 py-2 rounded-lg font-medium transition-colors duration-200
              ${theme === 'dark' 
                ? 'bg-purple-600 hover:bg-purple-700 text-white' 
                : 'bg-purple-600 hover:bg-purple-700 text-white'}
            `}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default DocumentDetailModal;