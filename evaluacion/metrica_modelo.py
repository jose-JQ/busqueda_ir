import pandas as pd
import numpy as np

class Metrica_modelo ():

  def __init__(self, modelo, corpus_df, queries_df, qrels_df, key_doc_id="doc_id", key_query="text_processed", key_query_id="query_id", k=50):
    self.modelo = modelo
    self.qrels_df = qrels_df
    self.key_doc_id = key_doc_id
    self.key_query = key_query
    self.queries_df = queries_df
    self.key_query_id = key_query_id
    self.corpus_df = corpus_df
   # self.valores = self.obtener_precision_recall_modelo(k)

  # query = text
  # qrels = [docs_ids]
  # dataframe datos_df

  def obtener_relevantes(self, query_id:str):
    return self.qrels_df[self.qrels_df[self.key_query_id]==query_id] [self.key_doc_id].values

  def recuperar_k_docs_indices (self, query_procesada, k=50):
    return self.modelo.obtener_docs_relevantes(query_procesada, self.corpus_df, k)[self.key_doc_id].values

  def obtener_precision_recall_query (self, query_id, query_procesada, k=50):
    
    docs_relevantes = self.obtener_relevantes(query_id)
    docs_recuperados = self.recuperar_k_docs_indices(query_procesada, k)

    tp = np.intersect1d(docs_relevantes, docs_recuperados).size
    fp = docs_recuperados.size - tp
    fn = docs_relevantes.size - tp

    print(query_id)
    print(docs_relevantes)
    print(docs_recuperados)
    print(f"tp:{tp}")
    print(f"fp:{fp}")
    print(f"fn:{fn}")

    precision = tp/(tp + fp)
    recall = tp/(tp+fn)
    return precision, recall

  def obtener_precision_recall_modelo(self, k=50):
    self.queries_df['precision_recall'] = self.queries_df.apply(lambda row: 
                                                           self.obtener_precision_recall_query
                                                            (row[self.key_query_id], row[self.key_query], k), axis=1)
    self.queries_df['precision'] = self.queries_df['precision_recall'].apply(lambda x: x[0])
    self.queries_df['recall'] = self.queries_df['precision_recall'].apply(lambda x: x[1])

    promedios = self.queries_df[['recall', 'precision']].mean()
    return promedios

  def obtener_MAP_query(self, query_id, query_procesada, k=50):
    hits = 0
    docs_relevantes = self.obtener_relevantes(query_id)
    docs_recuperados = self.recuperar_k_docs_indices(query_procesada, k)

    sum_precisions = 0
    for i, doc_id in enumerate(docs_recuperados):
        if doc_id in docs_relevantes:
            hits += 1
            sum_precisions += hits / (i + 1)
    return sum_precisions / hits if hits > 0 else 0
  
  def obtener_MAP_modelo (self, k=50):
    self.queries_df['ap'] = self.queries_df.apply(lambda row: self.obtener_MAP_query(row[self.key_query_id], row[self.key_query], k), axis=1)
    return self.queries_df['ap'].sum()/len(self.queries_df)
