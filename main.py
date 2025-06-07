#quiero usar FastAPI
from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from .sri import Sri_app
# App
sri_app  = Sri_app()

#Fast Api
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # o "*" para permitir todos (no recomendado en producción)
    allow_credentials=True,
    allow_methods=["*"],  # o ["POST"] si querés limitar
    allow_headers=["*"],
)

class Consulta(BaseModel):
    query:str
    metrica:str = sri_app.metricas_buscar[2]
    k: int = 10


#Endpoint
@app.post("/consultar")
def consultar(input:Consulta):
    print(input)
    resultado = sri_app.buscar(input.query,input.k,input.metrica)
    data = resultado.to_dict(orient="records")
    return JSONResponse(content=data)