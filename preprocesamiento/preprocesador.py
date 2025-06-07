import nltk
from nltk.corpus import stopwords, wordnet
from nltk.data import find
import spacy #muy lentoooo
from nltk import regexp_tokenize
from nltk.stem import SnowballStemmer
from nltk.stem import WordNetLemmatizer
from nltk.tag import pos_tag

class Preprocesador ():
    attr_preprocesado = "text_preproccessed"
    paquetes_requeridos = [
       'punkt','punkt_tab','stopwords', 'wordnet', 'averaged_perceptron_tagger', 'averaged_perceptron_tagger_eng'
    ]

    @staticmethod
    def _resource_path(package_name): #este aun no encuentro bien la ruta
        # Mapea nombre del paquete al path real del recurso
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


    def __init__(self):
        self.descargar_paquetes_necesarios()
        self.stop_words= set(stopwords.words('english'))
        self.stemmer = SnowballStemmer("english")
        self.lematizer_spacy =  spacy.load("en_core_web_sm")
        self.lematizer =  WordNetLemmatizer()

    @classmethod
    def descargar_paquetes_necesarios(cls):
        spacy.cli.download("en_core_web_sm")
        for paquete in cls.paquetes_requeridos:
            try:
                # Intenta encontrar el recurso localmente
                find(f"{cls._resource_path(paquete)}")
            except LookupError:
                print(f"Descargando: {paquete}")
                nltk.download(paquete)

    def normalizar_tokenizar(self, doc):
        return regexp_tokenize(doc.lower(), r"[a-zA-Z]+")

    def eliminar_stopwords(self,tokens):
        tokens = tokens.copy()
        for token in self.stop_words:
            if token in tokens:
                tokens.remove(token)
        return tokens

    def stemming (self, doc):
        def steamming_doc (doc):
            return [self.stemmer.stem(token) for token in doc]

        return steamming_doc(doc)


    def lematizar(self,tokens):
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
      return     [token.lemma_ for token in self.lematizer_spacy(' '.join(tokens)) if not token.is_stop and not token.is_punct]


    def preprocesar_con_lmt (self, doc):
        tokens = self.normalizar_tokenizar(doc)
        wr_stopword = self.eliminar_stopwords(tokens)
        return  ' '.join(self.lematizar(wr_stopword))

    def preprocesar_con_lmt_spacy (self, doc):
        tokens = self.normalizar_tokenizar(doc)
        wr_stopword = self.eliminar_stopwords(tokens)
        return  ' '.join(self.lematizar_spacy(wr_stopword))

    def preprocesar_con_stm(self, doc):
        tokens = self.normalizar_tokenizar(doc)
        wr_stopword = self.eliminar_stopwords(tokens)
        return ' '.join(self.stemming(wr_stopword))

    def preprocesar_corpus(self,corpus, attr, attr_new=attr_preprocesado,lmt=True):
        metodo = self.preprocesar_con_lmt
        if not lmt:
            metodo = self.preprocesar_con_stm

        corpus[attr_new] = corpus[attr].apply(lambda x: metodo(x))

        return corpus

    def preprocesar_corpus_spacy (self, corpus, attr, attr_new=attr_preprocesado + "_spacy", lmt=True):
        metodo = self.preprocesar_con_lmt_spacy
        if not lmt:
            metodo = self.preprocesar_con_stm

        corpus[attr_new] = corpus[attr].apply(lambda x: metodo(x))
        return corpus