import React, { useState, useRef, useEffect } from 'react';
import { Search, Clock, X } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface SearchBarProps {
  onSearch: (query: string) => void;
  setQuery: (query: string) => void;
  query: string;
  searchHistory: string[];
  onDeleteHistoryItem: (item: string) => void; // NUEVO
}

const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  setQuery,
  query,
  searchHistory,
  onDeleteHistoryItem // NUEVO
}) => {
  const [showHistory, setShowHistory] = useState(false);
  const [inputFocused, setInputFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const historyRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        historyRef.current && 
        !historyRef.current.contains(event.target as Node) && 
        inputRef.current && 
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowHistory(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query);
      setShowHistory(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setShowHistory(false);
    }
  };

  const handleHistoryItemClick = (item: string) => {
    setQuery(item);
    onSearch(item);
    setShowHistory(false);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleClearSearch = () => {
    setQuery('');
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div className="relative w-full">
      <form onSubmit={handleSubmit} className="relative">
        <div className={`
          flex items-center w-full relative overflow-hidden transition-all duration-300
          ${theme === 'dark' 
            ? 'bg-gray-800 border-gray-700 text-white' 
            : 'bg-white border-gray-300 text-gray-900'}
          border rounded-lg 
          ${inputFocused ? 'ring-2 ring-purple-500 border-transparent shadow-lg' : 'shadow'}
        `}>
          <Search 
            className={`ml-3 h-5 w-5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} 
            aria-hidden="true" 
          />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => {
              setInputFocused(true);
              if (searchHistory.length > 0) {
                setShowHistory(true);
              }
            }}
            onBlur={() => setInputFocused(false)}
            onKeyDown={handleKeyDown}
            placeholder="Buscar algo acerca de Wordpress"
            className={`
              w-full py-4 pl-3 pr-12 focus:outline-none
              ${theme === 'dark' ? 'bg-gray-800 placeholder-gray-500' : 'bg-white placeholder-gray-400'}
            `}
            aria-label="Search query"
          />
          {query && (
            <div className="absolute right-6 flex items-center space-x-2">
              <button
                type="button"
                onClick={handleClearSearch}
                className="p-1 rounded-full hover:bg-red-600 group"
                aria-label="Clear search"
              >
                <X
                  size={18}
                  className={`transition-colors duration-200 group-hover:text-white ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}
                />
              </button>

              <div className={`w-px h-5 ${theme === 'dark' ? 'bg-gray-600' : 'bg-gray-300'}`} />

              <button
                type="submit"
                className="p-1 rounded-full hover:bg-purple-600 group"
                disabled={!query.trim()}
                aria-label="Submit search"
              >
                <Search
                  size={18}
                  className={`transition-colors duration-200 group-hover:text-white ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}
                />
              </button>
            </div>
          )}
        </div>
      </form>

      {/* Search History Dropdown */}
      {showHistory && searchHistory.length > 0 && (
        <div 
          ref={historyRef} 
          className={`
            absolute z-10 w-full mt-1 rounded-lg shadow-lg overflow-hidden
            ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} 
            border
          `}
        >
          <div className={`py-2 px-3 ${theme === 'dark' ? 'text-gray-400 border-gray-700' : 'text-gray-500 border-gray-200'} text-sm border-b`}>
            Búsquedas recientes
          </div>
          <ul>
            {searchHistory.map((item, index) => (
              <li key={index} className="flex items-center group">
                <button
                  type="button"
                  onClick={() => handleHistoryItemClick(item)}
                  className={`
                    flex-1 text-left px-3 py-2 flex items-center
                    ${theme === 'dark' 
                      ? 'hover:bg-gray-700 text-gray-200' 
                      : 'hover:bg-gray-100 text-gray-800'}
                  `}
                >
                  <Clock size={16} className="mr-2 opacity-70" />
                  <span className="truncate">{item}</span>
                </button>
                <button
                  type="button"
                  onClick={() => onDeleteHistoryItem(item)}
                  className={`
                    p-1 rounded-full ml-1 mr-3 hover:bg-red-600 group
                    transition-colors duration-200
                  `}
                  aria-label={`Eliminar búsqueda "${item}"`}
                  tabIndex={0}
                >
                  <X
                    size={18}
                    className={`transition-colors duration-200 group-hover:text-white ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}
                  />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SearchBar;