import React, { useState } from 'react';
import { Filter, FilterGroup } from '../types';
import { filterGroups } from '../data/mockData';
import { ChevronDown, ChevronUp, Filter as FilterIcon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface FilterSectionProps {
  onFilterChange: (filters: Filter[]) => void;
  selectedMetric: string;
  metricasTFIDF: { [key: string]: number };
  metricasBM25: { [key: string]: number };
}

const FilterSection: React.FC<FilterSectionProps> = ({ onFilterChange, selectedMetric, metricasBM25, metricasTFIDF }) => {
  const { theme } = useTheme();
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string>>({
    metrica: 'promedio'
  });
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
    metrica: true
  });
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const handleFilterSelect = (groupId: string, value: string) => {
    const newSelectedFilters = {
      ...selectedFilters,
      [groupId]: value
    };
    
    setSelectedFilters(newSelectedFilters);
    
    // Convert to array of Filter objects
    const filtersArray: Filter[] = Object.entries(newSelectedFilters).map(([type, value]) => ({
      type: type as 'metrica',
      value
    }));
    
    onFilterChange(filtersArray);
  };

  const toggleGroup = (groupId: string) => {
    setExpandedGroups(prev => ({
      ...prev,
      [groupId]: !prev[groupId]
    }));
  };

  const toggleMobileFilters = () => {
    setMobileFiltersOpen(!mobileFiltersOpen);
  };

  return (
    <>
      {/* Mobile filter toggle */}
      <div className="lg:hidden mb-4">
        <button
          onClick={toggleMobileFilters}
          className={`
            w-full flex items-center justify-between px-4 py-3 rounded-lg
            ${theme === 'dark' 
              ? 'bg-gray-800 text-white border-gray-700' 
              : 'bg-white text-gray-800 border-gray-200'}
            border shadow-sm
          `}
        >
          <span className="flex items-center">
            <FilterIcon size={18} className="mr-2" />
            Métricas de búsqueda
          </span>
          {mobileFiltersOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>
      </div>

      {/* Filter content */}
      <div className={`
        ${mobileFiltersOpen ? 'block' : 'hidden'} 
        lg:block
        ${theme === 'dark' 
          ? 'bg-gray-800 border-gray-700 text-white' 
          : 'bg-white border-gray-200 text-gray-800'}
        rounded-lg border shadow-sm p-4
      `}>
        <div className="mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold">Configuración de búsqueda</h2>
          <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            Selecciona el modelo de búsqueda
          </p>
        </div>
        
        {filterGroups.map((group) => (
          <div key={group.id} className="mb-4 pb-4 border-b border-gray-200 dark:border-gray-700 last:border-0">
            <button
              onClick={() => toggleGroup(group.id)}
              className="flex items-center justify-between w-full text-left mb-2"
            >
              <h3 className="font-medium">{group.name}</h3>
              {expandedGroups[group.id] ? 
                <ChevronUp size={18} className="opacity-70" /> : 
                <ChevronDown size={18} className="opacity-70" />
              }
            </button>
            
            {expandedGroups[group.id] && (
              <div className="space-y-3 mt-3 pl-1">
                {group.options.map((option) => (
                  <div key={option.id} className="flex items-center">
                    <input
                      type="radio"
                      id={option.id}
                      name={group.id}
                      checked={selectedFilters[group.id] === option.value}
                      onChange={() => handleFilterSelect(group.id, option.value)}
                      className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 dark:border-gray-600 rounded"
                    />
                    <label 
                      htmlFor={option.id}
                      className={`ml-3 text-sm cursor-pointer ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}
                    >
                      <span className="font-medium">{option.label}</span>
                      <div className={`text-xs mt-0.5 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
                        {getMetricDescription(option.value)}
                      </div>
                    </label>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
        
        {/* Current selection indicator */}
        
        <div className={`mt-4 p-3 rounded-lg ${
            theme === 'dark' ? 'bg-purple-900/30 border-purple-700' : 'bg-purple-50 border-purple-200'
          } border`}>
            <div className="flex flex-col gap-1">
              <div className="flex items-center">
                <div className={`w-2 h-2 rounded-full mr-2 ${theme === 'dark' ? 'bg-purple-400' : 'bg-purple-600'}`}></div>
                <span className={`text-sm font-medium ${theme === 'dark' ? 'text-purple-200' : 'text-purple-800'}`}>
                  Seleccionado: {selectedMetric.toUpperCase()}
                </span>
              </div>

              {selectedMetric === 'tfidf' && (
                <div className="text-xs mt-1 text-gray-500 dark:text-gray-400">
                  Precision: {metricasTFIDF?.precision?.toFixed(4)}<br />
                  Recall: {metricasTFIDF?.recall?.toFixed(4)}
                </div>
              )}
              {selectedMetric === 'bm25' && (
                <div className="text-xs mt-1 text-gray-500 dark:text-gray-400">
                  Precision: {metricasBM25?.precision?.toFixed(4)}<br />
                  Recall: {metricasBM25?.recall?.toFixed(4)}
                </div>
              )}
            </div>
        </div>

      </div>
    </>
  );
};

const getMetricDescription = (metric: string): string => {
  switch(metric) {
    case 'tfidf':
      return 'Term Frequency-Inverse Document Frequency';
    case 'bm25':
      return 'Función "Best Matching 25 ranking"';
    case 'promedio':
      return 'Promedio de las múltiples métricas';
    default:
      return '';
  }
};

export default FilterSection;