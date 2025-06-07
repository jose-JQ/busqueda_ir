import pandas as pd
import zipfile
from pathlib import Path

class PklZipTools:
    
    @staticmethod
    def compress_pkl_to_zip(pkl_path: str, zip_path: str = None):
        """
        Comprime un archivo .pkl a un archivo .zip
        """
        pkl_path = Path(pkl_path)
        if not pkl_path.exists():
            raise FileNotFoundError(f"No se encuentra el archivo: {pkl_path}")
        
        if zip_path is None:
            zip_path = pkl_path.with_suffix('.zip')

        with zipfile.ZipFile(zip_path, 'w', compression=zipfile.ZIP_DEFLATED) as zipf:
            zipf.write(pkl_path, arcname=pkl_path.name)

        print(f"Archivo comprimido: {zip_path}")

    @staticmethod
    def read_pkl_from_zip(zip_path: str, pkl_filename: str = None) -> pd.DataFrame:
        """
        Lee un archivo .pkl desde un .zip y retorna un DataFrame
        """
        zip_path = Path(zip_path)
        if not zip_path.exists():
            raise FileNotFoundError(f"No se encuentra el archivo ZIP: {zip_path}")
        
        with zipfile.ZipFile(zip_path, 'r') as zipf:
            # Si no se especifica, intenta usar el único archivo .pkl dentro
            if pkl_filename is None:
                pkl_files = [name for name in zipf.namelist() if name.endswith('.pkl')]
                if not pkl_files:
                    raise ValueError("No hay archivos .pkl en el ZIP.")
                if len(pkl_files) > 1:
                    raise ValueError(f"Se encontraron múltiples .pkl, especifique uno: {pkl_files}")
                pkl_filename = pkl_files[0]

            with zipf.open(pkl_filename) as f:
                df = pd.read_pickle(f)

        print(f"Archivo leído desde ZIP: {pkl_filename}")
        return df
    
    @staticmethod
    def comprimirArchivos():
        PklZipTools.compress_pkl_to_zip("data/dataset.pkl", "data/dataset.zip")
        PklZipTools.compress_pkl_to_zip("data/qrels.pkl", "data/qrels.zip")
        PklZipTools.compress_pkl_to_zip("data/queries.pkl", "data/queries.zip")

        