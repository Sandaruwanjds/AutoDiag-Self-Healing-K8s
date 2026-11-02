from fastapi import FastAPI

app = FastAPI(title="AutoDiag Self-Healing K8s Backend", version="1.0.0")

@app.get("/")
def read_root():
    return {"message": "Welcome to AutoDiag Self-Healing K8s API Engine!"}

@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "backend-core"}