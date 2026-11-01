# AutoDiag Self-Healing K8s
*AI-Assisted Incident Detection, Diagnosis, and Self-Healing Framework for Kubernetes-Based Microservices*

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Kubernetes](https://img.shields.io/badge/Kubernetes-1.28%2B-blue?logo=kubernetes)](https://kubernetes.io/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.100%2B-green?logo=fastapi)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-18.x-blue?logo=react)](https://react.dev/)

---

## 📖 Overview
Modern cloud-native applications deployed on Kubernetes generate vast amounts of telemetry data (metrics, logs, and events)[cite: 10, 13]. While Kubernetes handles basic pod restarts, understanding *why* an operational failure occurred and executing intelligent, context-aware remediation still relies heavily on manual human intervention[cite: 3]. 

**AutoDiag Self-Healing K8s** is an automated AIOps platform designed to bridge this gap. It continuously monitors microservice health, uses Artificial Intelligence (AI) and Large Language Models (LLMs) to perform root-cause analysis (RCA) on unstructured logs and metrics, and automatically triggers safe remediation actions via the Kubernetes API[cite: 13, 14, 20].

---

## 🏗️ System Architecture
The platform is organized into a modular, cloud-native architecture:

```text
autodiag-selfhealing-k8s/
│
├── frontend/             # React & Tailwind CSS observability dashboard
├── backend/              # FastAPI core server & API endpoints
├── ai-engine/            # LLM prompts, anomaly detection, & log analysis models
├── telemetry/            # Prometheus metrics, logs, and trace scrapers
├── kubernetes/           # K8s manifests, deployments, services, & autoscaling configs
├── microservices/        # Target containerized microservices (Service A, B, C)
├── self-healing/         # Autonomous recovery engine & Kubernetes API controller
├── datasets/             # Telemetry samples, log logs, and incident records
├── tests/                # Unit, integration, and system test suites
└── docs/                 # Architecture diagrams, research reports, and documentation
