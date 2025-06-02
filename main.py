from preprocesamiento.preprocesador import Preprocesador
from ir_models.bm25.bm25 import Bm25
from ir_models.tfidf.tf_idf import Tfidf
from sklearn.datasets import fetch_20newsgroups
import pandas as pd
from sklearn.preprocessing import MinMaxScaler
import os


def obtener_corpus(path, cantidad=10):
    with open("corpus.txt", "r", encoding="utf-8") as f:
        contenido = f.read()
        documentos = contenido.split("|||")

    if cantidad=="max":
        return documentos
    else:
        return documentos[:cantidad]
    

if __name__ == "__main__":
    inicializar = False # Aqui toca cambiar cuando es la primera vez
    preprocesador = Preprocesador()
    
    if inicializar:
        #Carga de datos
        newsgroups = fetch_20newsgroups(subset='all', remove=('headers', 'footers', 'quotes'))
        newsgroupsdocs = newsgroups.data
        corpus = newsgroupsdocs

        corpus_df = pd.DataFrame({"documento": newsgroupsdocs})
        corpus_df.to_pickle("datos.pkl")

        #Preprocesamiento
        corpus_preprocesado = preprocesador.preprocesar_corpus(corpus)

        #Modelo 1:
        tfidf_model = Tfidf([' '.join(doc) for doc in corpus_preprocesado]) #[' '.join(doc) for doc in corpus_preprocesado]
        #Modelo 2:
        bm25_model = Bm25(corpus_preprocesado) #corpus_preprocesado
    else :
        tfidf_model = Tfidf()
        bm25_model = Bm25()
        corpus_df = pd.read_pickle("datos.pkl")
        corpus = corpus_df["documento"].values

    #Aqui iniciaria el loop 
    #query:
    os.system('cls' if os.name == 'nt' else 'clear')
    while True: 
        
        query = input("Ingrese la consulta: ")
        query_preprocesada = preprocesador.preprocesar_doc(query)
        # analisis
        res_tfidf = tfidf_model.cos_sim([' '.join(query_preprocesada)])
        res_bm25 = bm25_model.obtener_scores(query_preprocesada)

       # print(len(corpus))
       # print (res_tfidf.size)
       # print (res_bm25.size)

        comparacion_df = pd.DataFrame({
            "documentos":corpus,
            "cos_sim": res_tfidf,
            "bm25": res_bm25
        })

        atrr_num = comparacion_df.select_dtypes(include="number").columns
        scaler = MinMaxScaler()

        norm = scaler.fit_transform(comparacion_df[atrr_num])
        for i, col in enumerate(atrr_num):
            comparacion_df[col+"_norm"] = norm[:,i]

        comparacion_df["prom"] = (comparacion_df["cos_sim_norm"] + comparacion_df["bm25_norm"])/2

        keys = ["cos_sim", "bm25", "prom"]
        cantidad = 10
        for i in comparacion_df.sort_values(by=keys[2], ascending=False).index.values[0:10]:
            print ("---------------------------------------------------------")
            print (f"Documento {i}")
            print ("Contenido:\n", comparacion_df.loc[i,"documentos"])
            print ("\n Estadísticas:")
            print ("  - cos_sim:", comparacion_df.loc[i,"cos_sim"])
            print ("  - bm25",comparacion_df.loc[i,"bm25"] )
            print ("  - prom:", comparacion_df.loc[i,"prom"])
        
        print("\n\n\n\n\n")
        input("Press enter to continue....")
        print("\n\n\n\n\n\n\n\n\n\n")
