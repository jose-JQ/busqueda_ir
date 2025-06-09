import React, { useState, useCallback } from 'react';
import SearchBar from './SearchBar';
import ResultsList from './ResultsList';
import FilterSection from './FilterSection';
import Pagination from './Pagination';
import { SearchResult, Filter } from '../types';
import { SearchApiService } from '../services/searchApi';
import { mockResults } from '../data/mockData';

const SearchInterface: React.FC = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeFilters, setActiveFilters] = useState<Filter[]>([
    { type: 'metrica', value: 'promedio' }
  ]);
  const [currentPage, setCurrentPage] = useState(1);
  const [resultsPerPage, setResultsPerPage] = useState(10);
  const [totalResults, setTotalResults] = useState(0);
  const [hasSearched, setHasSearched] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [metricasTFIDF, setMetricasTFIDF] = useState<{ [key: string]: number }>({});
  const [metricasBM25, setMetricasBM25] = useState<{ [key: string]: number }>({});


  const getCurrentMetric = () => {
    const metricFilter = activeFilters.find(f => f.type === 'metrica');
    return metricFilter?.value || 'promedio';
  };

  const handleSearch = useCallback(async (searchQuery: string, metricOverride?: string) => {
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    setHasSearched(true);
    setError(null);
    
    try {
      const currentMetric = metricOverride || getCurrentMetric();
      
      // Try to call the real API first
      try {
        const apiResponse = await SearchApiService.search(searchQuery, currentMetric, resultsPerPage);
        setResults(apiResponse.resultados);
        setTotalResults(apiResponse.resultados.length);
        setMetricasTFIDF(apiResponse.metricas_tfidf_res);
        setMetricasBM25(apiResponse.metricas_bm25_res);

        setCurrentPage(1);
        
        // Add to search history if not already present
        if (!searchHistory.includes(searchQuery)) {
          setSearchHistory(prev => [searchQuery, ...prev].slice(0, 5));
        }
        
      } catch (apiError) {
        console.warn('API call failed, falling back to mock data:', apiError);
        
        // Fallback to mock data if API fails
        const filteredResults = mockResults.filter(result => {
          return result.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                 result.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
                 result.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
        });
        
        setResults(filteredResults);
        setTotalResults(filteredResults.length);
        setCurrentPage(1);
        
        // Add to search history if not already present
        if (!searchHistory.includes(searchQuery)) {
          setSearchHistory(prev => [searchQuery, ...prev].slice(0, 5));
        }
        
        setError('API connection failed. Showing mock results for demonstration.');
      }
      
    } catch (error) {
      console.error('Search error:', error);
      setError('An error occurred while searching. Please try again.');
      setResults([]);
      setTotalResults(0);
    } finally {
      setLoading(false);
    }
  }, [activeFilters, resultsPerPage, searchHistory]);

  const handleFilterChange = useCallback((filters: Filter[]) => {
    setActiveFilters(filters);
    const updatedMetric = filters.find(f => f.type === 'metrica')?.value || 'promedio';
    if (query && hasSearched) {
      handleSearch(query, updatedMetric);
    }
  }, [query, hasSearched, handleSearch]);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleResultsPerPageChange = useCallback((count: number) => {
    setResultsPerPage(count);
    setCurrentPage(1);
    if (query && hasSearched) {
      handleSearch(query);
    }
  }, [query, hasSearched, handleSearch]);

  const handleDeleteHistoryItem = (item: string) => {
    setSearchHistory(prev => prev.filter(h => h !== item));
  };

  // Calculate pagination
  const indexOfLastResult = currentPage * resultsPerPage;
  const indexOfFirstResult = indexOfLastResult - resultsPerPage;
  const currentResults = results.slice(indexOfFirstResult, indexOfLastResult);

  return (
    <div className="max-w-7xl mx-auto">
      <SearchBar 
        onSearch={handleSearch} 
        setQuery={setQuery} 
        query={query} 
        searchHistory={searchHistory}
        onDeleteHistoryItem={handleDeleteHistoryItem}
      />
      
      {error && (
        <div className="mt-4 p-4 bg-yellow-100 dark:bg-yellow-900 border border-yellow-300 dark:border-yellow-700 rounded-lg">
          <p className="text-yellow-800 dark:text-yellow-200 text-sm">{error}</p>
        </div>
      )}
      
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <FilterSection 
            onFilterChange={handleFilterChange} 
            selectedMetric={getCurrentMetric()}
            metricasTFIDF={metricasTFIDF}
            metricasBM25={metricasBM25}
          />
        </div>
        
        <div className="lg:col-span-3">
          <ResultsList 
            results={currentResults} 
            loading={loading} 
            hasSearched={hasSearched}
            query={query}
            selectedMetric={getCurrentMetric()}
          />
          
          {results.length > 0 && (
            <div className="mt-8">
              <Pagination 
                currentPage={currentPage}
                totalResults={totalResults}
                resultsPerPage={resultsPerPage}
                onPageChange={handlePageChange}
                onResultsPerPageChange={handleResultsPerPageChange}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchInterface;