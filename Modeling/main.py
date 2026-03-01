from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import json
import os

app = FastAPI()

origins = [
    "http://localhost:5173",
    "http://localhost:3000",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

current_dir = os.path.dirname(os.path.abspath(__file__))

# Load advisory data
with open(os.path.join(current_dir, "configs/advisory_system.json"), "r", encoding="utf-8") as f:
    advisory_data = json.load(f)

@app.get("/advisory/{disease}")
def advisory(disease: str, language: str = "english"):
    disease_info = advisory_data.get("advisory_system", {}).get("diseases", {}).get(disease)
    if not disease_info:
        return {"message": f"No advisory found for {disease}"}
    return disease_info
