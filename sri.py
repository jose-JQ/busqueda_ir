import pandas as pd
import numpy as np
from .tools.herramienta import PklZipTools
from .preprocesamiento.preprocesador import Preprocesador
from .ir_models.tfidf.tf_idf import Tfidf
from .ir_models.bm25.bm25 import Bm25
from .evaluacion.metrica_modelo import Metrica_modelo
from sklearn.preprocessing import MinMaxScaler
from sklearn.feature_extraction.text import CountVectorizer

class Sri_app () :
  def __init__(self,corpus=None, queries=None, qrels=None, preprocesar = False, procesar=False, attr_corpus="text",attr_id="doc_id", attr_query="text", lmt=True):
    self.corpus = corpus
    self.queries = queries
    self.qrels = qrels
    self.preprocesador = Preprocesador()
    self.attr_id = attr_id
    self.text_preprocessed_id = self.preprocesador.attr_preprocesado
    self.modelo_tfidf = None
    self.modelo_bm25 = None
    self.metrica_tfidf_id = "metricas_modelo_tfidf_res"
    self.metrica_bm25_id = "metricas_modelo_bm25_res"
    self.metricas_tfidf_res = None
    self.metricas_bm25_res = None
    self.metodo = self.preprocesador.preprocesar_con_lmt
    self.scaler = MinMaxScaler()
    self.metricas_buscar = ['sim_cos', 'bm25_scores', "promedio"]
    self.vectorizer_cv = CountVectorizer()

    if lmt:
          self.metodo = self.preprocesador.preprocesar_con_lmt

    if (preprocesar):
        self.preprocesador.preprocesar_corpus(corpus, attr_corpus, self.text_preprocessed_id,lmt) #lmt o stm
        if self.queries is not None and len(self.queries) > 0:
          self.queries[self.text_preprocessed_id] = queries[attr_query].apply(self.metodo)
    else: 
      self.corpus = PklZipTools.read_pkl_from_zip('data/dataset.zip')
      self.queries = PklZipTools.read_pkl_from_zip('data/queries.zip')
      self.qrels = PklZipTools.read_pkl_from_zip('data/qrels.zip')
  
    if (procesar):
      self.modelo_tfidf = Tfidf(self.corpus[self.text_preprocessed_id].values)
      self.modelo_bm25 = Bm25(self.corpus[self.text_preprocessed_id].values)
    else: 
      self.modelo_tfidf = Tfidf()
      self.modelo_bm25 = Bm25()
    

    # Métricas
    if self.queries is not None and self.qrels is not None and len(self.queries) > 0 and len(self.qrels) > 0:
      self.metrica_modelo_tfidf = Metrica_modelo(self.modelo_tfidf, self.corpus, self.queries, self.qrels)
      self.metrica_modelo_bm25 = Metrica_modelo(self.modelo_bm25, self.corpus,self.queries, self.qrels)
      self.resultados_metricas()


  def calcular_metrica(self, modelo, modelo_id):
    pre_recall = modelo.obtener_precision_recall_modelo()
    map_res = modelo.obtener_MAP_modelo()

    pre_recall['map'] = [map_res]
    pre_recall.to_pickle(modelo_id)
    return pre_recall
  
  def carga_metrica (self, modelo_id):
    return pd.read_pickle(modelo_id)
  
  def resultados_metricas(self, calcular=False):
      if calcular:
        self.metricas_tfidf_res = self.calcular_metrica(self.metrica_modelo_tfidf, self.metrica_tfidf_id)
        self.metricas_bm25_res = self.calcular_metrica(self.metrica_modelo_bm25, self.metrica_bm25_id)
      else:
        self.metricas_tfidf_res = self.carga_metrica(self.metrica_tfidf_id)
        self.metricas_bm25_res = self.carga_metrica(self.metrica_bm25_id)
  
  def buscar(self, query, k=10, metrica="promedio"):
    attr= self.corpus.select_dtypes(exclude=['number']).columns.values  # esto es para limpiar las selecciones :)
    if self.attr_id not in attr:
      attr = np.append(attr, self.attr_id)
    
    self.corpus = self.corpus[attr]

    query_preprocesada = self.metodo(query)
    sim_scores_df = pd.DataFrame({
        self.metricas_buscar[0]: self.modelo_tfidf.obtener_similitud_coseno(query_preprocesada),
        self.metricas_buscar[1]: self.modelo_bm25.obtener_scores(query_preprocesada)
    }, index = self.corpus[self.attr_id].values)
    
    attr_num = sim_scores_df.select_dtypes(include="number").columns

   # print(sim_scores_df.sort_values(by="bm25_scores", ascending=False))
    sim_scores_df = pd.DataFrame(self.scaler.fit_transform(sim_scores_df[attr_num]), columns=attr_num, index=sim_scores_df.index)

    sim_scores_df[self.metricas_buscar[2]] = sim_scores_df.mean(axis=1)
    print(sim_scores_df.sort_values(by=self.metricas_buscar[0], ascending=False))
    print(sim_scores_df.sort_values(by=self.metricas_buscar[1], ascending=False))
    print(sim_scores_df.sort_values(by=self.metricas_buscar[2], ascending=False))
    print('Resultados metrica tf-idf: ',self.metricas_tfidf_res)
    print('Resultados metrica bm-25: ',self.metricas_bm25_res)
    self.corpus[metrica] = sim_scores_df[metrica].values
    
    return self.corpus.sort_values(by=metrica, ascending=False).head(k)

    #docs_recuperados = self.dataset[self.dataset['doc_id'].isin(docs_id)]
    #docs_recuperados['doc_id'] = pd.Categorical(docs_recuperados ['doc_id'], categories = docs_id, ordered=True)
    #return docs_recuperados.sort_values('doc_id')

  def obtener_diccionario (self, calcular=False):
    diccionario = None
    if calcular:
      X = self.vectorizer_cv.fit_transform(self.corpus[self.text_preprocessed_id].values)
      diccionario = pd.DataFrame(X.toarray(), columns=self.vectorizer_cv.get_feature_names_out(), index=self.corpus[self.attr_id])
      diccionario.to_pickle("diccionario.pkl")
    else:
      diccionario = pd.read_pickle("diccionario.pkl")
    
    return diccionario