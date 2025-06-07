export interface SearchResult {
  doc_id: string;
  text: string;
  title: string;
  tags: string[];
  promedio?: number;
  tfidf?: number;
  bm25?: number;
  sim_cos?: number;      // TF-IDF cosine similarity score
  bm25_scores?: number;  // BM25 score
}

export interface Filter {
  type: 'metrica';
  value: string;
}

export interface FilterOption {
  id: string;
  label: string;
  value: string;
}

export interface FilterGroup {
  id: string;
  name: string;
  options: FilterOption[];
}

export interface SearchRequest {
  query: string;
  metrica: string;
  k: number;
}

export interface SearchResponse {
  results: SearchResult[];
  total: number;
}