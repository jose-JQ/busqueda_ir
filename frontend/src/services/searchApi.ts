import { SearchRequest, SearchResponse, SearchResult } from '../types';

const API_BASE_URL = 'http://127.0.0.1:8000';

export class SearchApiService {
  static getApiMetricName(selectedMetric: string): string {
    switch(selectedMetric) {
      case 'tfidf':
        return 'sim_cos';
      case 'bm25':
        return 'bm25_scores';
      case 'promedio':
      default:
        return 'promedio';
    }
  }

  static async search(query: string, metrica: string, k: number = 10): Promise<SearchResult[]> {
    try {
      const apiMetricName = this.getApiMetricName(metrica);
      
      const requestBody: SearchRequest = {
        query,
        metrica: apiMetricName,
        k
      };

      const response = await fetch(`${API_BASE_URL}/consultar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // If the API returns an array directly, use it
      if (Array.isArray(data)) {
        return data;
      }
      
      // If the API returns an object with results property, use that
      if (data.results && Array.isArray(data.results)) {
        return data.results;
      }
      
      // Otherwise, assume the data is the results array
      return data;
      
    } catch (error) {
      console.error('Search API error:', error);
      throw new Error(`Failed to search: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}