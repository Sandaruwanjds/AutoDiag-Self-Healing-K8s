import random
import time
from datetime import datetime
from typing import List, Optional
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI(
    title="AutoDiag Self-Healing K8s Backend",
    description="Autonomous AI-Assisted Incident Detection, Diagnosis, and Self-Healing Engine",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def now_str() -> str:
    return datetime.now().strftime("%H:%M:%S")

# ---------------- Enterprise Admin Accounts ----------------
ADMIN_USERS = [
    {"id": 1, "name": "Cluster Administrator", "email": "admin@darkadmin.io", "role": "Organization Admin", "status": "Active", "last_active": "Just now"},
    {"id": 2, "name": "Senior SRE Lead", "email": "sre-lead@darkadmin.io", "role": "Cluster Editor", "status": "Active", "last_active": "14m ago"},
    {"id": 3, "name": "Platform Operator", "email": "platform-ops@darkadmin.io", "role": "Viewer", "status": "Active", "last_active": "2h ago"},
    {"id": 4, "name": "K8s Automated Controller", "email": "k8s-agent@system.local", "role": "Service Account", "status": "Active", "last_active": "Continuous"},
]

TEAMS_LIST = [
    {"id": "t1", "name": "Core Platform SRE", "members": 6, "dashboards": 14, "permission": "Admin"},
    {"id": "t2", "name": "Observability & AIOps", "members": 4, "dashboards": 22, "permission": "Admin"},
    {"id": "t3", "name": "Honeybadger On-Call", "members": 8, "dashboards": 9, "permission": "Edit"},
    {"id": "t4", "name": "Cloud Infrastructure", "members": 5, "dashboards": 12, "permission": "View"},
]

DATA_SOURCES = [
    {"id": "ds-1", "name": "Prometheus Production", "type": "Prometheus", "url": "http://prometheus.monitoring:9090", "status": "Working", "default": True},
    {"id": "ds-2", "name": "Loki Log Aggregator", "type": "Loki", "url": "http://loki.monitoring:3100", "status": "Working", "default": False},
    {"id": "ds-3", "name": "Jaeger OpenTelemetry Traces", "type": "Jaeger", "url": "http://jaeger-collector:14268", "status": "Working", "default": False},
    {"id": "ds-4", "name": "Kubernetes API Engine", "type": "K8s API", "url": "https://kubernetes.default.svc:443", "status": "Connected", "default": False},
]

PLUGINS_LIST = [
    {"id": "p-1", "name": "Kubernetes Cluster Observability", "version": "v3.4.1", "author": "Grafana Labs", "installed": True, "type": "App"},
    {"id": "p-2", "name": "Polystat Multi-Node Panel", "version": "v2.1.0", "author": "Grafana Community", "installed": True, "type": "Panel"},
    {"id": "p-3", "name": "Node Graph Trace Visualizer", "version": "v1.8.2", "author": "OpenTelemetry", "installed": True, "type": "Panel"},
    {"id": "p-4", "name": "AutoDiag AI Remediation Hook", "version": "v1.0.0", "author": "DarkAdmin Core", "installed": True, "type": "AIOps"},
]

# ---------------- Live In-Memory Cluster & AIOps State ----------------
STATE = {
    "auto_heal_enabled": True,
    "cluster": {
        "name": "gazelle",
        "k8s_version": "v1.33.5",
        "owner": "giantswarm",
        "installation": "gazelle",
        "region": "eu-central-1",
        "service_priority": "highest",
        "api_availability": 99.986,
    },
    "metrics": {
        "cpu_usage": 29.1,
        "memory_usage": 46.9,
        "healthy_nodes": 16,
        "unhealthy_nodes": 0,
        "active_alerts": 2,
    },
    "nodes": [
        {"name": "ip-10-0-105-102.eu-central-1.com", "cpu": 17.4, "memory": 66.9, "condition": "Ready"},
        {"name": "ip-10-0-114-216.eu-central-1.com", "cpu": 61.4, "memory": 71.8, "condition": "Ready"},
        {"name": "ip-10-0-125-43.eu-central-1.com", "cpu": 43.0, "memory": 76.9, "condition": "Ready"},
        {"name": "ip-10-0-144-187.eu-central-1.com", "cpu": 22.8, "memory": 78.4, "condition": "Ready"},
        {"name": "ip-10-0-144-205.eu-central-1.com", "cpu": 10.4, "memory": 69.7, "condition": "Ready"},
        {"name": "ip-10-0-156-155.eu-central-1.com", "cpu": 9.41, "memory": 64.5, "condition": "Ready"},
        {"name": "ip-10-0-162-193.eu-central-1.com", "cpu": 29.5, "memory": 68.6, "condition": "Ready"},
        {"name": "ip-10-0-173-18.eu-central-1.com", "cpu": 32.2, "memory": 67.7, "condition": "Ready"},
    ],
    "microservices": [
        {"name": "payment-service", "pod": "payment-svc-5b86f9", "namespace": "prod", "status": "Running", "restarts": 1, "cpu": "180m", "memory": "310Mi"},
        {"name": "auth-api", "pod": "auth-api-7c9d41", "namespace": "prod", "status": "Running", "restarts": 0, "cpu": "95m", "memory": "190Mi"},
        {"name": "order-service", "pod": "order-svc-64d812", "namespace": "prod", "status": "Running", "restarts": 0, "cpu": "140m", "memory": "260Mi"},
        {"name": "inventory-db-proxy", "pod": "inv-proxy-9a110c", "namespace": "prod", "status": "Running", "restarts": 2, "cpu": "210m", "memory": "410Mi"},
        {"name": "api-gateway", "pod": "gateway-ingress-3f20", "namespace": "kube-system", "status": "Running", "restarts": 0, "cpu": "120m", "memory": "220Mi"},
        {"name": "crossplane-controller", "pod": "crossplane-7d4b11", "namespace": "crossplane-system", "status": "Degraded", "restarts": 3, "cpu": "410m", "memory": "620Mi"},
    ],
    "alerts": [
        {
            "id": "INC-101",
            "alertname": "CrossplaneDeploymentNotReady",
            "severity": "page",
            "team": "honeybadger",
            "service": "crossplane-controller",
            "pod": "crossplane-7d4b11",
            "node": "ip-10-0-114-216.eu-central-1.com",
            "status": "Firing",
            "detected_at": "11:48:12",
            "anomaly_score": 0.94,
            "symptom": "Replicas mismatch (0/1 ready) & reconciliation loop timeout (>30s)",
            "root_cause": "CRD webhook TLS handshake timeout after high CPU contention on ip-10-0-114-216",
            "recommended_action": "Restart Pod & Reschedule via Kubernetes API",
            "k8s_api_call": "POST /api/v1/namespaces/crossplane-system/pods/crossplane-7d4b11/eviction",
        },
        {
            "id": "INC-102",
            "alertname": "PaymentServiceHighCPUSpike",
            "severity": "warning",
            "team": "payments-sre",
            "service": "payment-service",
            "pod": "payment-svc-5b86f9",
            "node": "ip-10-0-125-43.eu-central-1.com",
            "status": "Firing",
            "detected_at": "11:54:05",
            "anomaly_score": 0.89,
            "symptom": "CPU jumped from 20% baseline to 89% within 45s; p99 latency 1420ms",
            "root_cause": "Database connection pool exhaustion causing tight retry storm",
            "recommended_action": "Horizontal Scale (1 -> 3 replicas) & Reset DB Pool",
            "k8s_api_call": "PATCH /apis/apps/v1/namespaces/prod/deployments/payment-service/scale",
        },
    ],
    "healing_history": [
        {
            "id": "HEAL-098",
            "timestamp": "11:20:44",
            "incident_id": "INC-098",
            "service": "inventory-db-proxy",
            "root_cause": "OOMKilled (Exit Code 137) due to unbounded gRPC response cache",
            "action": "Patched memory limit (256Mi -> 512Mi) & restarted pod inv-proxy-9a110c",
            "recovery_time_sec": 8.4,
            "result": "Resolved",
        },
        {
            "id": "HEAL-099",
            "timestamp": "11:36:19",
            "incident_id": "INC-099",
            "service": "auth-api",
            "root_cause": "Redis session store transient socket hangup",
            "action": "Triggered rolling restart via K8s API Deployment patch",
            "recovery_time_sec": 6.1,
            "result": "Resolved",
        },
    ],
    "logs": [
        {"id": 1, "time": "11:48:10", "service": "crossplane-controller", "level": "ERROR", "trace_id": "tr-98a1f", "message": "Reconcile error: context deadline exceeded calling webhook xrd.apiextensions.crossplane.io"},
        {"id": 2, "time": "11:48:12", "service": "ai-detector", "level": "WARNING", "trace_id": "tr-98a1f", "message": "Anomaly detected (score=0.94) on crossplane-7d4b11"},
        {"id": 3, "time": "11:50:02", "service": "auth-api", "level": "INFO", "trace_id": "tr-44b20", "message": "JWT token verification healthy; p95 latency 14ms on node ip-10-0-105-102"},
        {"id": 4, "time": "11:54:03", "service": "payment-service", "level": "CRITICAL", "trace_id": "tr-77c91", "message": "FATAL: remaining connection slots are reserved for non-replication superuser connections (PostgreSQL)"},
        {"id": 5, "time": "11:54:05", "service": "rca-nlp-engine", "level": "WARNING", "trace_id": "tr-77c91", "message": "Diagnosed root cause for INC-102: DB connection pool exhaustion (confidence 93.2%)"},
    ],
    "changelog": [
        {
            "date": "Jan 06",
            "title": "backstage release v0.93.1",
            "description": "Changed Configuration docs component in the scaffolder custom step has been refactored. Fixed Syntax highlighting in the YamlEditor component has been fixed. See ./docs/releases/v0.93.1-changelog.md for more information.",
        },
        {
            "date": "Jan 06",
            "title": "observability-bundle release v2.5.0",
            "description": "Added Add KSM metrics kube_servicemonitor_info and kube_podmonitor_info for ServiceMonitor and PodMonitor resources Add KSM metrics kube_podlog_info for PodLog resource",
        },
    ],
    "model_evaluation": {
        "detection_model": "Isolation Forest + LSTM Telemetry Detector",
        "diagnosis_model": "BERT & Drain3 NLP Parser + Trace Correlation",
        "accuracy": 96.4,
        "precision": 94.8,
        "recall": 95.9,
        "f1_score": 95.3,
        "avg_recovery_time_sec": 7.2,
        "manual_mttr_min": 38.0,
        "downtime_reduction_pct": 84.5,
    },
}

SCENARIOS = {
    "service_crash": {
        "alertname": "PodCrashLoopBackOff",
        "severity": "page",
        "team": "core-platform",
        "service": "order-service",
        "pod": "order-svc-64d812",
        "node": "ip-10-0-144-187.eu-central-1.com",
        "cpu_delta": 12.5,
        "mem_delta": 6.2,
        "anomaly_score": 0.97,
        "symptom": "Container order-svc terminated with ExitCode 139 (SIGSEGV) - 4 restarts in 2m",
        "root_cause": "Null pointer dereference in gRPC checkout handler after payload schema mismatch",
        "recommended_action": "Rollback Deployment & Restart Pod via Kubernetes API",
        "k8s_api_call": "POST /apis/apps/v1/namespaces/prod/deployments/order-service/rollback",
        "log_msg": "panic: runtime error: invalid memory address or nil pointer dereference in CheckoutHandler()",
    },
    "high_cpu": {
        "alertname": "HighCPUUtilizationAnomaly",
        "severity": "page",
        "team": "payments-sre",
        "service": "payment-service",
        "pod": "payment-svc-5b86f9",
        "node": "ip-10-0-114-216.eu-central-1.com",
        "cpu_delta": 38.0,
        "mem_delta": 8.0,
        "anomaly_score": 0.95,
        "symptom": "Pod CPU spiked from 20% to 92% (throttled 68% of periods)",
        "root_cause": "Database connection failure triggered infinite synchronous retry loop",
        "recommended_action": "Scale Replicas (1 -> 3) & Restart Degraded Pod",
        "k8s_api_call": "PATCH /apis/apps/v1/namespaces/prod/deployments/payment-service/scale",
        "log_msg": "ERROR [payment-svc] DB pool exhausted (0/50 idle) - retrying transaction in tight loop",
    },
    "memory_leak": {
        "alertname": "ContainerOOMKilledImminent",
        "severity": "page",
        "team": "data-platform",
        "service": "inventory-db-proxy",
        "pod": "inv-proxy-9a110c",
        "node": "ip-10-0-125-43.eu-central-1.com",
        "cpu_delta": 9.0,
        "mem_delta": 28.5,
        "anomaly_score": 0.96,
        "symptom": "Working set memory reached 98.4% of container limit (504Mi / 512Mi)",
        "root_cause": "Unreleased buffer slices in streaming inventory sync worker",
        "recommended_action": "Patch Memory Limit (512Mi -> 1Gi) & Graceful Pod Restart",
        "k8s_api_call": "PATCH /apis/apps/v1/namespaces/prod/deployments/inventory-db-proxy",
        "log_msg": "CRITICAL: runtime: out of memory: cannot allocate block (OOMKilled event generated)",
    },
    "network_delay": {
        "alertname": "ServiceMeshHighLatencyP99",
        "severity": "warning",
        "team": "netops",
        "service": "api-gateway",
        "pod": "gateway-ingress-3f20",
        "node": "ip-10-0-162-193.eu-central-1.com",
        "cpu_delta": 6.4,
        "mem_delta": 3.1,
        "anomaly_score": 0.87,
        "symptom": "Span latency p99 increased from 45ms to 2,340ms between api-gateway -> auth-api",
        "root_cause": "Stale kube-proxy iptables endpoint routing to terminated pod IP",
        "recommended_action": "Flush Service Endpoints & Restart Ingress Pod",
        "k8s_api_call": "DELETE /api/v1/namespaces/kube-system/pods/gateway-ingress-3f20",
        "log_msg": "upstream request timeout (504 Gateway Timeout) connecting to backend",
    },
}

class LoginRequest(BaseModel):
    email: str
    password: Optional[str] = ""

class SimulateRequest(BaseModel):
    scenario: str

class HealRequest(BaseModel):
    incident_id: Optional[str] = None
    action_override: Optional[str] = None

class AutoHealToggle(BaseModel):
    enabled: bool

@app.get("/")
def read_root():
    return {
        "status": "Active",
        "message": "AutoDiag Self-Healing K8s API Engine",
        "cluster": "gazelle",
        "k8s_version": "v1.33.5",
    }

@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "backend-core"}

@app.post("/api/auth/login")
def login(req: LoginRequest):
    # Pure Admin login
    email = (req.email or "admin@darkadmin.io").strip().lower()
    return {
        "token": f"jwt-darkadmin-{int(time.time())}",
        "user": {
            "name": "Cluster Administrator",
            "email": email if "@" in email else "admin@darkadmin.io",
            "role": "Organization Admin",
            "org": "Shared Org",
        },
    }

@app.get("/api/overview")
def get_overview():
    STATE["metrics"]["active_alerts"] = len(STATE["alerts"])
    return {
        "status": "Active",
        "auto_heal_enabled": STATE["auto_heal_enabled"],
        "cluster": STATE["cluster"],
        "metrics": STATE["metrics"],
        "nodes": STATE["nodes"],
        "microservices": STATE["microservices"],
        "alerts": STATE["alerts"],
        "healing_history": STATE["healing_history"],
        "logs": STATE["logs"][-30:],
        "changelog": STATE["changelog"],
        "model_evaluation": STATE["model_evaluation"],
        "users": ADMIN_USERS,
        "teams": TEAMS_LIST,
        "data_sources": DATA_SOURCES,
        "plugins": PLUGINS_LIST,
    }

@app.post("/api/simulate")
def simulate_incident(req: SimulateRequest):
    sc = SCENARIOS.get(req.scenario)
    if not sc:
        raise HTTPException(status_code=400, detail=f"Unknown scenario '{req.scenario}'.")

    inc_id = f"INC-{random.randint(103, 999)}"
    ts = now_str()

    STATE["metrics"]["cpu_usage"] = round(min(96.0, STATE["metrics"]["cpu_usage"] + sc["cpu_delta"]), 1)
    STATE["metrics"]["memory_usage"] = round(min(95.0, STATE["metrics"]["memory_usage"] + sc["mem_delta"]), 1)
    STATE["metrics"]["unhealthy_nodes"] = min(16, STATE["metrics"]["unhealthy_nodes"] + 1)
    STATE["metrics"]["healthy_nodes"] = max(0, 16 - STATE["metrics"]["unhealthy_nodes"])
    STATE["cluster"]["api_availability"] = round(max(99.100, STATE["cluster"]["api_availability"] - 0.042), 3)

    for n in STATE["nodes"]:
        if n["name"] == sc["node"]:
            n["cpu"] = round(min(98.0, n["cpu"] + sc["cpu_delta"]), 1)
            n["memory"] = round(min(97.0, n["memory"] + sc["mem_delta"]), 1)
            n["condition"] = "NotReady"

    for svc in STATE["microservices"]:
        if svc["name"] == sc["service"]:
            svc["status"] = "CrashLoopBackOff" if req.scenario == "service_crash" else "AnomalyDetected"
            svc["restarts"] += 1

    alert = {
        "id": inc_id,
        "alertname": sc["alertname"],
        "severity": sc["severity"],
        "team": sc["team"],
        "service": sc["service"],
        "pod": sc["pod"],
        "node": sc["node"],
        "status": "Firing",
        "detected_at": ts,
        "anomaly_score": sc["anomaly_score"],
        "symptom": sc["symptom"],
        "root_cause": sc["root_cause"],
        "recommended_action": sc["recommended_action"],
        "k8s_api_call": sc["k8s_api_call"],
    }
    STATE["alerts"].insert(0, alert)
    STATE["metrics"]["active_alerts"] = len(STATE["alerts"])

    trace_id = f"tr-{random.randint(10000, 99999):x}"
    STATE["logs"].append({"id": len(STATE["logs"]) + 1, "time": ts, "service": sc["service"], "level": "CRITICAL", "trace_id": trace_id, "message": sc["log_msg"]})
    STATE["logs"].append({"id": len(STATE["logs"]) + 1, "time": ts, "service": "ai-detector", "level": "WARNING", "trace_id": trace_id, "message": f"[{inc_id}] Anomaly score {sc['anomaly_score']} -> {sc['symptom']}"})
    STATE["logs"].append({"id": len(STATE["logs"]) + 1, "time": ts, "service": "rca-nlp-engine", "level": "INFO", "trace_id": trace_id, "message": f"[{inc_id}] Root Cause Identified: {sc['root_cause']}"})

    return {"message": f"Injected fault '{req.scenario}' ({inc_id})", "incident": alert, "overview": get_overview()}

@app.post("/api/heal")
def execute_self_healing(req: HealRequest):
    if not STATE["alerts"]:
        return {"message": "No active incidents to heal.", "overview": get_overview()}

    target = None
    if req.incident_id:
        for idx, a in enumerate(STATE["alerts"]):
            if a["id"] == req.incident_id:
                target = STATE["alerts"].pop(idx)
                break
        if not target:
            raise HTTPException(status_code=404, detail=f"Incident {req.incident_id} not found")
    else:
        target = STATE["alerts"].pop(0)

    ts = now_str()
    rec_time = round(random.uniform(4.2, 9.8), 1)
    action_taken = req.action_override or f"{target['recommended_action']} ({target['k8s_api_call']})"

    for n in STATE["nodes"]:
        if n["name"] == target["node"]:
            n["cpu"] = round(max(12.0, n["cpu"] * 0.55), 1)
            n["memory"] = round(max(62.0, n["memory"] * 0.85), 1)
            n["condition"] = "Ready"

    for svc in STATE["microservices"]:
        if svc["name"] == target["service"]:
            svc["status"] = "Running"

    unhealthy = sum(1 for n in STATE["nodes"] if n["condition"] != "Ready")
    STATE["metrics"]["unhealthy_nodes"] = unhealthy
    STATE["metrics"]["healthy_nodes"] = 16 - unhealthy
    STATE["metrics"]["cpu_usage"] = round(max(24.5, STATE["metrics"]["cpu_usage"] - 14.2), 1)
    STATE["metrics"]["memory_usage"] = round(max(44.0, STATE["metrics"]["memory_usage"] - 9.5), 1)
    STATE["metrics"]["active_alerts"] = len(STATE["alerts"])
    STATE["cluster"]["api_availability"] = 99.986

    heal_record = {
        "id": f"HEAL-{random.randint(100, 999)}",
        "timestamp": ts,
        "incident_id": target["id"],
        "service": target["service"],
        "root_cause": target["root_cause"],
        "action": action_taken,
        "recovery_time_sec": rec_time,
        "result": "Resolved",
    }
    STATE["healing_history"].insert(0, heal_record)
    STATE["changelog"].insert(
        0,
        {
            "date": f"Today {ts}",
            "title": f"Auto-Healed {target['service']} ({target['id']})",
            "description": f"AI Diagnosis: {target['root_cause']}. Executed {action_taken}. Recovered in {rec_time}s.",
        },
    )
    STATE["logs"].append(
        {
            "id": len(STATE["logs"]) + 1,
            "time": ts,
            "service": "self-healing-controller",
            "level": "INFO",
            "trace_id": f"heal-{target['id'].lower()}",
            "message": f"K8s API Action succeeded for {target['pod']}: {action_taken} (MTTR={rec_time}s)",
        }
    )

    return {"message": f"Self-healing executed for {target['id']}", "healing": heal_record, "overview": get_overview()}

@app.post("/api/heal-all")
def heal_all_incidents():
    healed = []
    while STATE["alerts"]:
        res = execute_self_healing(HealRequest(incident_id=STATE["alerts"][0]["id"]))
        healed.append(res["healing"])
    return {"message": f"Resolved {len(healed)} incident(s) via Kubernetes API", "healed": healed, "overview": get_overview()}

@app.post("/api/auto-heal")
def toggle_auto_heal(req: AutoHealToggle):
    STATE["auto_heal_enabled"] = req.enabled
    return {"auto_heal_enabled": STATE["auto_heal_enabled"]}
