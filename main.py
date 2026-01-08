from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
import requests

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

API_BASE_URL = "https://rickandmortyapi.com/api"

@app.get("/")
def home():
    return {"status": "online", "message": "Rick and Morty Proxy API"}

@app.get("/api/data")
def get_rick_and_morty_data(endpoint: str = "character", page: int = 1, name: str = ""):
    target_url = f"{API_BASE_URL}/{endpoint}/"
    params = {"page": page, "name": name}
    
    try:
        response = requests.get(target_url, params=params)
        if response.status_code == 404:
            return {"info": {"pages": 0, "next": None, "prev": None}, "results": []}
        return response.json()
    except Exception as e:
        return {"error": str(e), "results": []}

