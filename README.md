# 🔍Sistema de Recuperación de Información (SRI)
Este proyecto implementa un Sistema de Recuperación de Información (SRI) basado en los modelos TF-IDF y BM25, evaluando métricas como precisión y recall, y desplegando una interfaz de usuario moderna en React junto con un backend en FastAPI.

### 📂 Estructura del Proyecto
- Backend: FastAPI
- Frontend: React + TypeScript
- Modelos IR: TF-IDF, BM25
- Evaluación: Precisión y Recall
- Métricas expuestas: sim_cos (TF-IDF), bm25_scores (BM25), promedio (combinado)

### 🚀 DEMOS EN GOOGLE COLAB
- Colab de prueba: https://colab.research.google.com/drive/1FyGKJXnbNDV9OV9iU-Cl3OdZbPY_9bCK?usp=sharing

- Colab simplificado: https://colab.research.google.com/drive/1RTXcKBk2ldInu4bVEjBGv2IoGBZ8LupZ?usp=sharing

### ⚙️ Instalación y Ejecución
1. Clonar el repositorio
git clone https://github.com/jose-JQ/busqueda_ir.git

2. Backend (FastAPI)
- Para ejecutar el código es necesario instalar todas las dependencias

📦 Requisitos:
- Python 3.9 o superior
- pip
🔧 Instalación
```python
# Ejecutar desde la consola en el directorio raiz del proyecto
fastapi dev main.py
```
- El backend quedará disponible en:
📍 http://127.0.0.1:8000
- La documentación de la API se verá en:
http://127.0.0.1:8000/docs

3. Frontend (React)
📦 Requisitos
- Node.js

- npm

🔧 Instalación
```python
# Ejecutar desde la consola en la carpeta frontend del proyecto
# esto instalará las dependencias del proyecto
npm install
```

▶️ Ejecutar el frontend
```python
# Ejecutar desde la consola en la carpeta frontend del proyecto
# esto instalará las dependencias del proyecto
npm run dev
```
Interfaz accesible en:
🌐 http://localhost:5173 (o el puerto que indique la consola)

###📊 Métricas de Evaluación
El sistema expone métricas de evaluación de los modelos implementados. Estas métricas se calculan automáticamente y se muestran en la interfaz gráfica al seleccionar el modelo correspondiente:

| Modelo | Precisión | Recall   |
| ------ | --------- | -------- |
| TF-IDF | `0.00732` | `0.3041` |
| BM25   | `0.00942` | `0.4009` |


###🧠 Tecnologías Utilizadas
- Python / FastAPI – Backend moderno y rápido.

- Scikit-learn / Pandas – Procesamiento y modelado de datos.

- React / TypeScript / TailwindCSS – Interfaz web interactiva.

- Google Colab – Demos y pruebas en la nube.

### 🧑‍💻 Autores
Desarrollado por:
- Alexis Guanoluisa
- José Quiros
