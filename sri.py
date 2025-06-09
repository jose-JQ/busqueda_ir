import pandas as pd
from .tools.herramienta import PklZipTools
from .preprocesamiento.preprocesador import Preprocesador
from .ir_models.tfidf.tf_idf import Tfidf
from .ir_models.bm25.bm25 import Bm25
from .evaluacion.metrica_modelo import Metrica_modelo
from sklearn.preprocessing import MinMaxScaler

class Sri_app () :
  def __init__(self,dataset=None, queries=None, qrels=None, preprocesar = False, procesar=False, attr_corpus="text", attr_query="text", lmt=True):
    self.dataset = dataset
    self.queries = queries
    self.qrels = qrels
    self.preprocesador = Preprocesador()
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
    if lmt:
          self.metodo = self.preprocesador.preprocesar_con_lmt

    if (preprocesar):
        self.preprocesador.preprocesar_corpus(dataset, attr_corpus, self.text_preprocessed_id,lmt) #lmt o stm
        self.queries[self.text_preprocessed_id] = queries[attr_query].apply(self.metodo)
    else: 
      self.dataset = PklZipTools.read_pkl_from_zip('data/dataset.zip')
      self.queries = PklZipTools.read_pkl_from_zip('data/queries.zip')
      self.qrels = PklZipTools.read_pkl_from_zip('data/qrels.zip')
  
    if (procesar):
      self.modelo_tfidf = Tfidf(self.dataset[self.text_preprocessed_id].values)
      self.modelo_bm25 = Bm25(self.dataset[self.text_preprocessed_id].values)
    else: 
      self.modelo_tfidf = Tfidf()
      self.modelo_bm25 = Bm25()
    

    # Métricas
    self.metrica_modelo_tfidf = Metrica_modelo(self.modelo_tfidf, self.dataset, self.queries, self.qrels)
    self.metrica_modelo_bm25 = Metrica_modelo(self.modelo_bm25, self.dataset,self.queries, self.qrels)
    self.resultados_metricas()


  def calcular_metrica(self, modelo, modelo_id):
    resultado = modelo.obtener_precision_recall_modelo()
    resultado.to_pickle(modelo_id)
    return resultado
  
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
    self.dataset=self.dataset.select_dtypes(exclude=['number'])  # esto es para limpiar las selecciones :)
    
    query_preprocesada = self.metodo(query)
    sim_scores_df = pd.DataFrame({
        self.metricas_buscar[0]: self.modelo_tfidf.obtener_similitud_coseno(query_preprocesada),
        self.metricas_buscar[1]: self.modelo_bm25.obtener_scores(query_preprocesada)
    }, index = self.dataset['doc_id'].values)
    attr_num = sim_scores_df.select_dtypes(include="number").columns
   # print(sim_scores_df.sort_values(by="bm25_scores", ascending=False))
    sim_scores_df = pd.DataFrame(self.scaler.fit_transform(sim_scores_df[attr_num]), columns=attr_num, index=sim_scores_df.index)

    sim_scores_df[self.metricas_buscar[2]] = sim_scores_df.mean(axis=1)
    print(sim_scores_df.sort_values(by=self.metricas_buscar[0], ascending=False))
    print(sim_scores_df.sort_values(by=self.metricas_buscar[1], ascending=False))
    print(sim_scores_df.sort_values(by=self.metricas_buscar[2], ascending=False))
    print('Resultados metrica tf-idf: ',self.metricas_tfidf_res)
    print('Resultados metrica bm-25: ',self.metricas_bm25_res)
    self.dataset[metrica] = sim_scores_df[metrica].values
    
    return self.dataset.sort_values(by=metrica, ascending=False).head(k)

    #docs_recuperados = self.dataset[self.dataset['doc_id'].isin(docs_id)]
    #docs_recuperados['doc_id'] = pd.Categorical(docs_recuperados ['doc_id'], categories = docs_id, ordered=True)
    #return docs_recuperados.sort_values('doc_id')
