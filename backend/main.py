from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI(
    title="AutoDiag Self-Healing K8s API",
    description="Backend API for AI-assisted incident detection and remediation",
    version="1.0.0"
)

class TelemetryLog(BaseModel):
    label: str
    message: str
    severity: str

@app.get("/")
def read_root():
    return {"status": "Active", "message": "AutoDiag Backend Engine is running successfully!"}

@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "backend-core"}

@app.post("/api/v1/logs/ingest")
def ingest_telemetry_log(log_data: dict):
    # මෙහිදී මයික්රොසර්විස් වලින් එන ලොග්ස් ප්රොසෙස් කිරීම සිදු කරයි
    return {
        "status": "Received",
        "processed": True,
        "details": log_data
    }
