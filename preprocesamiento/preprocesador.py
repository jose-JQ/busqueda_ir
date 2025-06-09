import nltk
from nltk.corpus import stopwords, wordnet
from nltk.data import find
import spacy #muy lentoooo
from nltk import regexp_tokenize
from nltk.stem import SnowballStemmer
from nltk.stem import WordNetLemmatizer
from nltk.tag import pos_tag

class Preprocesador ():
    """
    Clase para el preprocesamiento de texto usando NLTK y spaCy.
    
    Funcionalidades principales:
    - Tokenización y normalización
    - Eliminación de stopwords
    - Stemming (con SnowballStemmer)
    - Lematización (con WordNetLemmatizer o spaCy)
    - Preprocesamiento por lote de corpus tipo DataFrame

    Atributos:
    ----------
    attr_preprocesado : str
        Nombre por defecto de la nueva columna con texto preprocesado.
    paquetes_requeridos : list
        Recursos de NLTK necesarios para los métodos de procesamiento.

    Métodos:
    --------
    descargar_paquetes_necesarios():
        Descarga los recursos necesarios de NLTK y spaCy si no están disponibles.
    
    normalizar_tokenizar(doc):
        Convierte el texto a minúsculas y extrae solo tokens alfabéticos.
    
    eliminar_stopwords(tokens):
        Elimina las palabras vacías del conjunto de tokens.
    
    stemming(doc):
        Aplica stemming a una lista de tokens.
    
    lematizar(tokens):
        Lematiza los tokens utilizando WordNet y POS tagging.
    
    lematizar_spacy(tokens):
        Lematiza usando el modelo en_core_web_sm de spaCy (más lento).
    
    preprocesar_con_lmt(doc):
        Preprocesa un documento aplicando lematización (NLTK).
    
    preprocesar_con_lmt_spacy(doc):
        Preprocesa un documento aplicando lematización con spaCy.
    
    preprocesar_con_stm(doc):
        Preprocesa un documento aplicando stemming.
    
    preprocesar_corpus(corpus, attr, attr_new, lmt=True):
        Preprocesa una columna de un DataFrame usando lematización o stemming.
    
    preprocesar_corpus_spacy(corpus, attr, attr_new, lmt=True):
        Igual que preprocesar_corpus, pero con lematización vía spaCy.
    """

    attr_preprocesado = "text_preproccessed"
    paquetes_requeridos = [
       'punkt','punkt_tab','stopwords', 'wordnet', 'averaged_perceptron_tagger', 'averaged_perceptron_tagger_eng'
    ]

    
    @staticmethod
    def _resource_path(package_name): #este aun no encuentro bien la ruta
        """
        Retorna la ruta local al recurso NLTK basado en su nombre.

        Parameters
        ----------
        package_name : str
            Nombre del recurso NLTK.

        Returns
            -------
        str
            Ruta local al recurso o el nombre si no está mapeado."""
        base_path = r"C:\Users\54Y1\AppData\Roaming\nltk_data"
        mapping = {
            "punkt": base_path + "/tokenizers/punkt",
            "punkt_tab": base_path+ "/tokenizers/punk_tab",
            "stopwords": base_path + "/corpora/stopwords",
            "wordnet": base_path + "/corpora/wordnet",
            "averaged_perceptron_tagger": base_path + "/taggers/averaged_perceptron_tagger",
            "averaged_perceptron_tagger_eng": base_path + "/taggers/averaged_perceptron_tagger_eng"

        }
        return mapping.get(package_name, package_name)

    def __init__(self, attr_id="doc_id"):
        """
        Inicializa el preprocesador, descargando los recursos necesarios y
        cargando las stopwords, stemmer y lematizadores.

        Parameters
        ----------
        attr_id : str
            Nombre del atributo identificador de cada documento en el corpus.
        """
        self.descargar_paquetes_necesarios()
        self.stop_words= set(stopwords.words('english'))
        self.stemmer = SnowballStemmer("english")
        self.lematizer_spacy =  spacy.load("en_core_web_sm")
        self.lematizer =  WordNetLemmatizer()
        self.attr_id = attr_id

    @classmethod
    def descargar_paquetes_necesarios(cls):
        """
        Descarga los recursos necesarios de NLTK y el modelo spaCy
            'en_core_web_sm' si no están disponibles localmente.
        """
        spacy.cli.download("en_core_web_sm")
        for paquete in cls.paquetes_requeridos:
            try:
                # Intenta encontrar el recurso localmente
                find(f"{cls._resource_path(paquete)}")
            except LookupError:
                print(f"Descargando: {paquete}")
                nltk.download(paquete)

    def normalizar_tokenizar(self, doc):
        """
    Convierte texto a minúsculas y extrae solo palabras (tokens alfabéticos).

        Parameters
        ----------
        doc : str
            Texto a procesar.

        Returns
        -------
        list
            Lista de tokens normalizados.
    """
        return regexp_tokenize(doc.lower(), r"[a-zA-Z]+")
    
    
    def eliminar_stopwords(self,tokens):
        """
     Elimina las palabras vacías (stopwords) de una lista de tokens.

        Parameters
        ----------
        tokens : list
            Lista de tokens.

        Returns
        -------
        list
            Lista de tokens sin stopwords.
    """
        tokens = tokens.copy()
        for token in self.stop_words:
            if token in tokens:
                tokens.remove(token)
        return tokens
    
    
    def stemming (self, doc):
        """
        Aplica stemming a cada token del documento.

        Parameters
        ----------
        doc : list
            Lista de tokens.

        Returns
        -------
        list
            Lista de tokens con stemming aplicado.
    """
        def steamming_doc (doc):
            return [self.stemmer.stem(token) for token in doc]

        return steamming_doc(doc)

    def lematizar(self,tokens):
        """
        Lematiza una lista de tokens usando WordNet y POS tagging.

        Parameters
        ----------
        tokens : list
            Lista de tokens.

        Returns
        -------
        list
            Lista de lemas.
        """
        tagged = pos_tag(tokens)

        def get_wordnet_pos(tag):
                if tag.startswith('J'):
                    return wordnet.ADJ
                elif tag.startswith('V'):
                    return wordnet.VERB
                elif tag.startswith('N'):
                    return wordnet.NOUN
                elif tag.startswith('R'):
                    return wordnet.ADV
                return wordnet.NOUN

        return [
                self.lematizer.lemmatize(word, get_wordnet_pos(pos))
                for word, pos in tagged
            ]
    
 
    def lematizar_spacy (self, tokens):
      """
     Preprocesa un texto con lematización usando WordNet (NLTK).

        Parameters
        ----------
        doc : str
            Texto original.

        Returns
        -------
        str
            Texto preprocesado.
        """
      return     [token.lemma_ for token in self.lematizer_spacy(' '.join(tokens)) if not token.is_stop and not token.is_punct]

    
    def preprocesar_con_lmt (self, doc):
        """
    Lematiza tokens usando el modelo spaCy 'en_core_web_sm'.

        Parameters
        ----------
        tokens : list
            Lista de tokens.

        Returns
        -------
        list
            Lista de lemas, excluyendo stopwords y signos de puntuación.
    """
        tokens = self.normalizar_tokenizar(doc)
        wr_stopword = self.eliminar_stopwords(tokens)
        return  ' '.join(self.lematizar(wr_stopword))

    
    def preprocesar_con_lmt_spacy (self, doc):
        """
     Preprocesa un texto con lematización usando spaCy.

        Parameters
        ----------
        doc : str
            Texto original.

        Returns
        -------
        str
            Texto preprocesado.
    """
        tokens = self.normalizar_tokenizar(doc)
        wr_stopword = self.eliminar_stopwords(tokens)
        return  ' '.join(self.lematizar_spacy(wr_stopword))
    

    def preprocesar_con_stm(self, doc):
        """
        Preprocesa un texto aplicando stemming.

        Parameters
        ----------
        doc : str
            Texto original.

        Returns
        -------
        str
            Texto preprocesado.
        """
        tokens = self.normalizar_tokenizar(doc)
        wr_stopword = self.eliminar_stopwords(tokens)
        return ' '.join(self.stemming(wr_stopword))
    
    
    def preprocesar_corpus(self,corpus, attr, attr_new=attr_preprocesado,lmt=True):
        """
         Preprocesa una columna de un DataFrame utilizando lematización o stemming.

        Parameters
        ----------
        corpus : pandas.DataFrame
            DataFrame que contiene la columna de texto a procesar.
        attr : str
            Nombre de la columna de texto original.
        attr_new : str
            Nombre de la nueva columna con el texto preprocesado.
        lmt : bool
            Si True, se aplica lematización; si False, se aplica stemming.

        Returns
        -------
        pandas.DataFrame
            DataFrame con la columna nueva agregada.
         """
        metodo = self.preprocesar_con_lmt
        if not lmt:
            metodo = self.preprocesar_con_stm

        corpus[attr_new] = corpus[attr].apply(lambda x: metodo(x))

        if self.attr_id not in corpus.columns:
            corpus[self.attr_id] = [str(i) for i in range(len(corpus))]

        return corpus

    def preprocesar_corpus_spacy (self, corpus, attr, attr_new=attr_preprocesado + "_spacy", lmt=True):
        """
        Preprocesa una columna de un DataFrame utilizando spaCy (lematización o stemming).

            Parameters
            ----------
            corpus : pandas.DataFrame
                DataFrame que contiene la columna de texto a procesar.
            attr : str
                Nombre de la columna de texto original.
            attr_new : str
                Nombre de la nueva columna con el texto preprocesado.
            lmt : bool
                Si True, se aplica lematización; si False, se aplica stemming.

            Returns
            -------
            pandas.DataFrame
                DataFrame con la columna nueva agregada.
        """
        metodo = self.preprocesar_con_lmt_spacy
        if not lmt:
            metodo = self.preprocesar_con_stm

        corpus[attr_new] = corpus[attr].apply(lambda x: metodo(x))

        if self.attr_id not in corpus.columns:
            corpus[self.attr_id] = [str(i) for i in range(len(corpus))]
        
        return corpus