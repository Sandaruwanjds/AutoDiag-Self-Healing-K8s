from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="AutoDiag Self-Healing K8s Backend", version="1.0.0")

# Enable CORS for frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {
        "status": "Active",
        "message": "Welcome to AutoDiag Self-Healing K8s API Engine!"
    }

@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "backend-core"}
