#quiero usar FastAPI
from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.responses import JSONResponse
from typing import Optional
from fastapi.middleware.cors import CORSMiddleware
from .sri import Sri_app
# App
sri_app  = None

#Fast Api
app = FastAPI()

@app.on_event("startup")
def init_once():
    global sri_app
    sri_app = Sri_app()
    print("App SRI cargada correctamente...:D")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # o "*" para permitir todos (no recomendado en producción)
    allow_credentials=True,
    allow_methods=["*"],  # o ["POST"] 
    allow_headers=["*"],
)

class Consulta(BaseModel):
    query:str
    metrica: Optional[str] = None #sri_app.metricas_buscar[2]
    k: Optional[int] = None


#Endpoint
@app.post("/consultar")
def consultar(input:Consulta):
    global sri_app
    print(input)
    if not input.metrica:
        input.metrica = sri_app.metricas_buscar[-1]
    if not input.k:
        input.k = 10
     
    resultado = sri_app.buscar(input.query,input.k,input.metrica)
    
    data = resultado.to_dict(orient="records")
    
    return JSONResponse(content=data)