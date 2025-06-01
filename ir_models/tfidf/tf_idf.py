from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import joblib
import numpy as np

class Tfidf:
    def __init__(self, corpus=None):
       self.tfidf_vectorizer = None
       self.tfidf_matrix = None
       if corpus:
           self.tfidf_vectorizer = TfidfVectorizer()
           self.tfidf_matrix = self.tfidf_vectorizer.fit_transform(corpus)
           joblib.dump(self.tfidf_vectorizer, "modelo_tfidf.joblib")
           joblib.dump(self.tfidf_matrix, "matriz.joblib")
       else:
           self.tfidf_vectorizer = joblib.load("modelo_tfidf.joblib")
           self.tfidf_matrix = joblib.load("matriz.joblib")
    

    def cos_sim (self, query):
        quey_vector = self.tfidf_vectorizer.transform(query)
        return cosine_similarity(quey_vector, self.tfidf_matrix).flatten()

    def obtener_indices_docs_relevantes (self, query, cantidad=10):
        predicciones = self.cos_sim(query)
        sorted_indices = np.argsort(-(predicciones))

        return sorted_indices[:cantidad]
     
