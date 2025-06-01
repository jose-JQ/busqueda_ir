import joblib
from rank_bm25 import BM25Okapi
import numpy as np

class Bm25:
    def __init__(self, corpus=None):
        if corpus:
            self.bm25 = BM25Okapi(corpus)
            joblib.dump(self.bm25, "modelo_bm25.joblib")
        else:
            self.bm25 = joblib.load("modelo_bm25.joblib")
        
    def obtener_scores (self, query):
        return self.bm25.get_scores(query)

    def obtener_indices_docs_relevantes(self, query, cantidad=10):
        scores = self.obtener_scores(query)
        sorted_indices = np.argsort(-(scores))

        return sorted_indices[:cantidad]