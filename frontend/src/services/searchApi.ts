import { SearchRequest, SearchResponse, SearchResult } from '../types';

const API_BASE_URL = 'http://127.0.0.1:8000';
interface ApiSearchResponse {
  resultados: SearchResult[];
  metricas_tfidf_res: { [key: string]: number };
  metricas_bm25_res: { [key: string]: number };
}
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
  
  /**
   * Realiza una búsqueda en la API con el query y métrica especificados.
   * @param query - El término de búsqueda.
   * @param metrica - La métrica a utilizar ('tfidf', 'bm25', 'promedio').
   * @param k - Número de resultados a retornar (opcional, por defecto 10).
   * @returns Una promesa que resuelve con los resultados de la búsqueda.
   */
  static async search(query: string, metrica: string, k: number = 10): Promise<ApiSearchResponse> {
    const apiMetricName = this.getApiMetricName(metrica);

    const response = await fetch(`${API_BASE_URL}/consultar`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, metrica: apiMetricName, k }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  }
}