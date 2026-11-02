<div align="center">

# 🛡️ AutoDiag
### AI-Assisted Incident Detection, Diagnosis & Self-Healing Framework for Kubernetes-Based Microservices

<strong>Detect • Diagnose • Recover</strong><br/>
An intelligent AIOps framework for automated incident management in Kubernetes environments.

</div>

---

## 🌟 Project Overview

Modern cloud-native applications consist of distributed microservices running across Kubernetes clusters. These services continuously generate large volumes of telemetry data, including metrics, logs, traces, and Kubernetes events.

When failures occur, traditional monitoring systems often rely on predefined thresholds and static alerts. This requires engineers to manually investigate logs, identify root causes, and perform recovery operations. 

**AutoDiag** aims to address this challenge through an AI-assisted, closed-loop incident management framework that integrates intelligent anomaly detection, root cause analysis, and policy-driven automated recovery.

---

## 🎯 What AutoDiag Does

* **🔍 Detects:** Identifies abnormal system behavior using machine learning and telemetry analysis.
* **🧠 Diagnoses:** Analyzes logs and correlates telemetry data to identify potential root causes.
* **⚡ Recovers:** Executes predefined, policy-controlled healing actions through the Kubernetes API.
* **📊 Monitors:** Tracks incidents, recovery operations, and system performance through a centralized dashboard.

---
## 🔄 The Three Core Components

### 1. 🟢 Incident Detection Engine
* **Purpose:** Continuously monitor microservices and identify abnormal system behavior by collecting telemetry data from Kubernetes workloads.
* **Key Features:**
  * Continuous telemetry ingestion using Prometheus and OpenTelemetry.
  * Monitoring of CPU utilization, memory usage, network I/O, response time, and HTTP 5xx error rates.
  * Machine learning-based anomaly detection using **Isolation Forest** and **Autoencoders**.
  * Anomaly confidence scoring to support incident prioritization.
* **Example:** A sudden increase in CPU utilization and response time may indicate an emerging performance issue.

---

### 2. 🟡 Root Cause Analysis (RCA) Engine
* **Purpose:** Analyze detected incidents and isolate primary faults from downstream symptoms by correlating multiple telemetry sources.
* **Key Features:**
  * Application log collection from Kubernetes workloads.
  * NLP-based log parsing using the **Drain3 algorithm** to extract reusable log templates.
  * Correlation of logs, metrics, traces, and Kubernetes events alongside temporal analysis.
* **Example:** If an Order Service experiences timeouts because the Payment Service is down, the RCA engine identifies the Payment Service failure as the primary root cause rather than treating every timeout as an independent incident.

---

### 3. 🔵 Autonomous Self-Healing Engine
* **Purpose:** Execute safe and predefined recovery operations through the Kubernetes Python client after validating against safety guardrails.

| Detected Failure | Potential Root Cause | Healing Action / Kubernetes Operation |
| :--- | :--- | :--- |
| **Unresponsive Pod** | Deadlock or thread starvation | Recreate Pod (`delete_namespaced_pod()`) |
| **High CPU Utilization** | CPU exhaustion or traffic spike | Scale Deployment (`patch_namespaced_deployment_scale()`) |
| **OOMKilled Container** | Memory limit exceeded | Apply approved resource configuration (`patch_namespaced_deployment()`) |
| **CrashLoopBackOff** | Defective application deployment | Trigger controlled rollback (Deployment rollout revision management) |

> 📌 **Note:** Recovery operations are strictly restricted to predefined and approved actions depending on diagnosis confidence and configured policies.

---

## 🛡️ Safety & Reliability Mechanisms

Autonomous recovery must not introduce additional failures. AutoDiag incorporates strict safety mechanisms:

| Safety Mechanism | Description |
| :--- | :--- |
| **Policy-Based Execution** | Only predefined recovery operations are permitted. |
| **Cooldown Timer** | Prevents repeated recovery actions within a configured time period. |
| **Circuit Breaker** | Stops repeated unsuccessful recovery attempts. |
| **Action Limits** | Restricts the number of healing operations per workload. |
| **Human-in-the-Loop** | Allows engineers to review, approve, or override recovery decisions. |
| **Audit Logging** | Records incident details and recovery activities for future analysis. |

* **Example Safety Policy:** A workload may allow a maximum of two automated recovery attempts within one hour. If both fail, the system stops further automated actions and requests human intervention.

---

## 📊 Performance Evaluation & Targets

AutoDiag will be evaluated against conventional rule-based monitoring approaches using the following criteria:

* **Metrics Assessed:** Mean Time to Detect (MTTD), Mean Time to Recover (MTTR), Detection Accuracy, Precision & Recall, F1-Score, Root Cause Accuracy, System Availability, Downtime Reduction, and Recovery Success Rate.

### 🎯 Initial Performance Targets *(Proposed)*

| Evaluation Metric | Target Goal |
| :--- | :--- |
| **Incident Detection Time** | Less than 3 seconds |
| **Automated Recovery Time** | Less than 10 seconds |
| **Anomaly Confidence** | Above 90% for selected high-confidence detections |

---

## 🧪 Testing & Fault Injection

The framework will be tested using simulated microservice failures in a controlled Kubernetes environment, including:

* Pod crashes and unexpected restarts
* CPU and memory resource exhaustion (OOMKilled)
* Application exceptions and increased network latency
* Service unavailability and abnormal response times

---

## 🧰 Technology Stack

| Component | Technologies Used |
| :--- | :--- |
| **Frontend** | React.js, Tailwind CSS |
| **Backend** | Python, FastAPI |
| **Machine Learning** | Python, Scikit-learn, TensorFlow / PyTorch |
| **Log Processing** | Drain3 |
| **Monitoring & Tracing** | Prometheus, Grafana, OpenTelemetry |
| **Orchestration & Client** | Docker, Kubernetes, Kubernetes Python Client |
| **Database** | PostgreSQL |

---

## 🔁 Overall Workflow

1. **Telemetry Generation:** Kubernetes microservices generate telemetry data.
2. **Collection:** Prometheus and OpenTelemetry collect operational metrics, traces, and logs.
3. **Detection:** The Incident Detection Engine analyzes telemetry and identifies anomalies.
4. **Diagnosis:** The RCA Engine processes application logs and correlates relevant telemetry.
5. **Proposal:** The system identifies a potential root cause and proposes a recovery plan.
6. **Validation:** The Policy Engine validates the proposed action against safety rules.
7. **Execution:** The Self-Healing Engine executes an approved operation through the Kubernetes API.
8. **Monitoring:** The system monitors the recovery outcome.
9. **Auditing:** Incident details and recovery activities are recorded for evaluation and auditing.

---

## 🚀 Project Goals

* Reduce manual incident investigation overhead.
* Improve anomaly detection using machine learning.
* Identify root causes through multi-source telemetry correlation.
* Automate safe, policy-driven recovery operations.
* Improve overall service availability and operational reliability.

---

<div align="center">

<strong>🛡️ AutoDiag — Towards Intelligent, Reliable & Self-Healing Microservices</strong><br/>
<sub>Detect intelligently. Diagnose accurately. Recover safely.</sub>

</div>
