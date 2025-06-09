from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import joblib
import numpy as np

class Tfidf:
    """
    Clase que implementa un modelo de representación vectorial basado en TF-IDF
    para calcular similitud de coseno entre una consulta y un corpus documental.
    """
    def __init__(self, corpus=None, modelName="modelo_tfidf"):
       """
            Inicializa el modelo TF-IDF. Si se proporciona un corpus, se entrena y guarda
            el modelo y la matriz TF-IDF. Si no, carga un modelo previamente entrenado.

            Parámetros:
            - corpus: lista o arreglo de textos preprocesados.
            - modelName: nombre base para guardar/cargar los archivos del modelo.
       """
       self.tfidf_vectorizer = None
       self.tfidf_matrix = None
       if corpus is not None and len(corpus) > 0:
           self.tfidf_vectorizer = TfidfVectorizer()
           self.tfidf_matrix = self.tfidf_vectorizer.fit_transform(corpus)
           joblib.dump(self.tfidf_vectorizer, modelName + ".joblib")
           joblib.dump(self.tfidf_matrix, "matriz_" + modelName +".joblib")
       else:
           self.tfidf_vectorizer = joblib.load(modelName + ".joblib")
           self.tfidf_matrix = joblib.load( "matriz_" + modelName +".joblib")


    def obtener_similitud_coseno (self, query_preprocesada):
        """
        Calcula la similitud de coseno entre la consulta y todos los documentos del corpus.

        Parámetros:
        - query_preprocesada: texto ya preprocesado (str o lista con un único elemento).

        Retorna:
        - Arreglo de similitudes de coseno (1D).
        """
        if type(query_preprocesada) == str:
            query_preprocesada = [query_preprocesada]
        query_vector = self.tfidf_vectorizer.transform(query_preprocesada)
        return cosine_similarity(query_vector, self.tfidf_matrix).flatten()

    def obtener_docs_relevantes (self, query_preprocesada, corpus_df, k=10):
        """
          Retorna los k documentos más relevantes del corpus para una consulta dada.

        Parámetros:
        - query_preprocesada: texto de la consulta ya preprocesado.
        - corpus_df: DataFrame con el corpus original.
        - k: número de documentos a retornar.

        Retorna:
        - DataFrame con los k documentos más relevantes ordenados por similitud.
        """
        sim_cos = self.obtener_similitud_coseno(query_preprocesada)
        sorted_indices = np.argsort(-(sim_cos))

        return corpus_df.iloc[sorted_indices[:k]]

