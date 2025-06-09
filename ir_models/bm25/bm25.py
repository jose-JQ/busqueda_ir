import joblib
from rank_bm25 import BM25Okapi
import numpy as np

class Bm25:
    """
    Clase para implementar un modelo BM25 usando la librería rank_bm25.

    Este modelo puede entrenarse con un corpus nuevo o cargar un modelo previamente guardado con joblib.

    Parámetros
    ----------
    corpus : list of str or list of list of str, opcional
        Corpus de documentos. Cada documento puede ser una cadena (que se tokenizará por espacios)
        o una lista de tokens. Si se proporciona, se entrena un nuevo modelo BM25.
    modelName : str, opcional
        Nombre base del archivo para guardar o cargar el modelo BM25 con joblib.
    """

    def __init__(self, corpus=None, modelName="modelo_bm25"):
        """
        Inicializa el modelo BM25. Si se proporciona un corpus, entrena y guarda el modelo;
        de lo contrario, carga el modelo desde el archivo especificado.
        """
        if corpus is not None and len(corpus) > 0:

            if type(corpus[0]) == str:
                corpus = [doc.split() for doc in corpus]

            self.bm25 = BM25Okapi(corpus)
            joblib.dump(self.bm25, modelName + ".joblib")
        else:
            self.bm25 = joblib.load(modelName + ".joblib")

    def obtener_scores (self, query_preprocesada):
        """
        Calcula los puntajes BM25 de todos los documentos del corpus respecto a una consulta dada.

        Parámetros
        ----------
        query_preprocesada : str or list of str
            Consulta ya preprocesada (tokenizada como lista o cadena de palabras separadas por espacio).

        Retorna
        -------
        numpy.ndarray
            Array de puntajes BM25 para cada documento del corpus.
        """
        if type(query_preprocesada) == str:
            query_preprocesada = query_preprocesada.split()
        return self.bm25.get_scores(query_preprocesada)

    def obtener_docs_relevantes(self, query_preprocesada, corpus_df, k=10):
        """
        Recupera los k documentos más relevantes para una consulta dada según BM25.

        Parámetros
        ----------
        query_preprocesada : str or list of str
            Consulta ya preprocesada (tokenizada como lista o cadena de palabras).
        corpus_df : pandas.DataFrame
            DataFrame que contiene el corpus original, usado para retornar los documentos relevantes.
        k : int, opcional
            Número de documentos a recuperar (default 10).

        Retorna
        -------
        pandas.DataFrame
            Subconjunto del corpus_df con los k documentos más relevantes ordenados por score.
        """
        scores = self.obtener_scores(query_preprocesada)
        sorted_indices = np.argsort(-(scores))

        return corpus_df.iloc[sorted_indices[:k]]