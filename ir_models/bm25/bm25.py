import joblib
from rank_bm25 import BM25Okapi
import numpy as np

class Bm25:
    def __init__(self, corpus=None, modelName="modelo_bm25"):
        if corpus is not None and len(corpus) > 0:

            if type(corpus[0]) == str:
                corpus = [doc.split() for doc in corpus]

            self.bm25 = BM25Okapi(corpus)
            joblib.dump(self.bm25, modelName + ".joblib")
        else:
            self.bm25 = joblib.load(modelName + ".joblib")

    def obtener_scores (self, query_preprocesada):
        if type(query_preprocesada) == str:
            query_preprocesada = query_preprocesada.split()
        return self.bm25.get_scores(query_preprocesada)

    def obtener_docs_relevantes(self, query_preprocesada, corpus_df, k=10):
        scores = self.obtener_scores(query_preprocesada)
        sorted_indices = np.argsort(-(scores))

        return corpus_df.iloc[sorted_indices[:k]]