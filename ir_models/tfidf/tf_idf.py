from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import joblib
import numpy as np

class Tfidf:
    def __init__(self, corpus=None, modelName="modelo_tfidf"):
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
        if type(query_preprocesada) == str:
            query_preprocesada = [query_preprocesada]
        query_vector = self.tfidf_vectorizer.transform(query_preprocesada)
        return cosine_similarity(query_vector, self.tfidf_matrix).flatten()

    def obtener_docs_relevantes (self, query_preprocesada, corpus_df, k=10):
        sim_cos = self.obtener_similitud_coseno(query_preprocesada)
        sorted_indices = np.argsort(-(sim_cos))

        return corpus_df.iloc[sorted_indices[:k]]

