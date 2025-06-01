import nltk
from nltk.corpus import stopwords, wordnet
from nltk.data import find
from nltk.stem import WordNetLemmatizer
from unidecode import unidecode
import re
from nltk.tokenize import word_tokenize 
from nltk.stem import PorterStemmer
from nltk.tag import pos_tag

class Preprocesador ():

    required_packages = [
       'punkt','punkt_tab','stopwords', 'wordnet', 'averaged_perceptron_tagger', 'averaged_perceptron_tagger_eng'
    ]

    @staticmethod
    def _resource_path(package_name): #este aun no encuentro bien la ruta
        # Mapea nombre del paquete al path real del recurso
        base_path = r"C:\Users\54Y1\AppData\Roaming\nltk_data"
        mapping = {
            "punkt": base_path + "/tokenizers/punkt",
            "stopwords": base_path + "/corpora/stopwords",
            "wordnet": base_path + "/corpora/wordnet",
            "averaged_perceptron_tagger": base_path + "/taggers/averaged_perceptron_tagger",
            "averaged_perceptron_tagger_eng": base_path + "/taggers/averaged_perceptron_tagger_eng"
        }
        return mapping.get(package_name, package_name)


    def __init__(self):
        self.ensure_nltk_data()
        self.stop_words= set(stopwords.words('english'))
        self.stemmer = PorterStemmer()
        self.lematizer =  WordNetLemmatizer()

    @classmethod
    def ensure_nltk_data(cls):
        for package in cls.required_packages:
            try:
                # Intenta encontrar el recurso localmente
                find(f"{cls._resource_path(package)}")
            except LookupError:
                print(f"Descargando: {package}")
                nltk.download(package)
    
    def tokenizar (self, doc):
        return word_tokenize(doc)
    
    """
    Corpus -> en listas
    """
    def normalizar (self, doc): 
        def procesar_token(token):
            token = token.lower() #lower
            token = unidecode(token)

            if not (bool(re.fullmatch(r'[^a-z\s]', token))): # filtrado de signos de puntuación y carácteres especiales
                return token
            else:
                return None
        
        return list(filter(None, map(procesar_token, doc)))


    def drop_stopwords(self,doc):
        def borrar_stopwords(doc):
            return [t for t in doc if not t in self.stop_words]

        return borrar_stopwords(doc)

    def stemming (self, doc):
        def steamming_doc (doc):
            return [self.stemmer.stem(token) for token in doc]
        
        return steamming_doc(doc)
    
    def lemeatizacion(self, doc):
        def get_wordnet_pos(tag):
            if tag.startswith('J'):
                return wordnet.ADJ
            elif tag.startswith('V'):
                return wordnet.VERB
            elif tag.startswith('N'):
                return wordnet.NOUN
            elif tag.startswith('R'):
                return wordnet.ADV
            else:
                return wordnet.NOUN  # por defecto

        def lematizar_doc (doc):
            tag = pos_tag(doc)
            return [self.lematizer.lemmatize(word, get_wordnet_pos(pos)) for word, pos in tag]
        
        return lematizar_doc(doc)
    

    def preprocesar_doc (self, doc):
        token = self.tokenizar(doc)
        normalizar = self.normalizar(token)
        sin_stopword = self.drop_stopwords(normalizar)
        lematizado = self.lemeatizacion(sin_stopword)
        stemm = self.stemming(lematizado)
        return stemm
    
    def preprocesar_corpus(self,corpus):
        return [self.preprocesar_doc(doc) for doc in corpus]
