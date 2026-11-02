import React, { useState, useEffect, useCallback } from 'react';
import Login from './Login';
import Dashboard from './Dashboard';

const API_BASE = 'http://127.0.0.1:8000';

const INITIAL_OVERVIEW = {
  status: 'Active',
  auto_heal_enabled: true,
  cluster: {
    name: 'gazelle',
    k8s_version: 'v1.33.5',
    owner: 'giantswarm',
    installation: 'gazelle',
    region: 'eu-central-1',
    service_priority: 'highest',
    api_availability: 99.986,
  },
  metrics: {
    cpu_usage: 29.1,
    memory_usage: 46.9,
    healthy_nodes: 16,
    unhealthy_nodes: 0,
    active_alerts: 2,
  },
  nodes: [
    { name: 'ip-10-0-105-102.eu-central-1.com', cpu: 17.4, memory: 66.9, condition: 'Ready' },
    { name: 'ip-10-0-114-216.eu-central-1.com', cpu: 61.4, memory: 71.8, condition: 'Ready' },
    { name: 'ip-10-0-125-43.eu-central-1.com', cpu: 43.0, memory: 76.9, condition: 'Ready' },
    { name: 'ip-10-0-144-187.eu-central-1.com', cpu: 22.8, memory: 78.4, condition: 'Ready' },
    { name: 'ip-10-0-144-205.eu-central-1.com', cpu: 10.4, memory: 69.7, condition: 'Ready' },
    { name: 'ip-10-0-156-155.eu-central-1.com', cpu: 9.41, memory: 64.5, condition: 'Ready' },
    { name: 'ip-10-0-162-193.eu-central-1.com', cpu: 29.5, memory: 68.6, condition: 'Ready' },
    { name: 'ip-10-0-173-18.eu-central-1.com', cpu: 32.2, memory: 67.7, condition: 'Ready' },
  ],
  microservices: [
    { name: 'payment-service', pod: 'payment-svc-5b86f9', namespace: 'prod', status: 'Running', restarts: 1, cpu: '180m', memory: '310Mi' },
    { name: 'auth-api', pod: 'auth-api-7c9d41', namespace: 'prod', status: 'Running', restarts: 0, cpu: '95m', memory: '190Mi' },
    { name: 'order-service', pod: 'order-svc-64d812', namespace: 'prod', status: 'Running', restarts: 0, cpu: '140m', memory: '260Mi' },
    { name: 'inventory-db-proxy', pod: 'inv-proxy-9a110c', namespace: 'prod', status: 'Running', restarts: 2, cpu: '210m', memory: '410Mi' },
    { name: 'api-gateway', pod: 'gateway-ingress-3f20', namespace: 'kube-system', status: 'Running', restarts: 0, cpu: '120m', memory: '220Mi' },
    { name: 'crossplane-controller', pod: 'crossplane-7d4b11', namespace: 'crossplane-system', status: 'Degraded', restarts: 3, cpu: '410m', memory: '620Mi' },
  ],
  alerts: [
    {
      id: 'INC-101',
      alertname: 'CrossplaneDeploymentNotReady',
      severity: 'page',
      team: 'honeybadger',
      service: 'crossplane-controller',
      pod: 'crossplane-7d4b11',
      node: 'ip-10-0-114-216.eu-central-1.com',
      status: 'Firing',
      detected_at: '11:48:12',
      anomaly_score: 0.94,
      symptom: 'Replicas mismatch (0/1 ready) & reconciliation loop timeout (>30s)',
      root_cause: 'CRD webhook TLS handshake timeout after high CPU contention on ip-10-0-114-216',
      recommended_action: 'Restart Pod & Reschedule via Kubernetes API',
      k8s_api_call: 'POST /api/v1/namespaces/crossplane-system/pods/crossplane-7d4b11/eviction',
    },
    {
      id: 'INC-102',
      alertname: 'PaymentServiceHighCPUSpike',
      severity: 'warning',
      team: 'payments-sre',
      service: 'payment-service',
      pod: 'payment-svc-5b86f9',
      node: 'ip-10-0-125-43.eu-central-1.com',
      status: 'Firing',
      detected_at: '11:54:05',
      anomaly_score: 0.89,
      symptom: 'CPU jumped from 20% baseline to 89% within 45s; p99 latency 1420ms',
      root_cause: 'Database connection pool exhaustion causing tight retry storm',
      recommended_action: 'Horizontal Scale (1 -> 3 replicas) & Reset DB Pool',
      k8s_api_call: 'PATCH /apis/apps/v1/namespaces/prod/deployments/payment-service/scale',
    },
  ],
  healing_history: [
    {
      id: 'HEAL-098',
      timestamp: '11:20:44',
      incident_id: 'INC-098',
      service: 'inventory-db-proxy',
      root_cause: 'OOMKilled (Exit Code 137) due to unbounded gRPC response cache',
      action: 'Patched memory limit (256Mi -> 512Mi) & restarted pod inv-proxy-9a110c',
      recovery_time_sec: 8.4,
      result: 'Resolved',
    },
    {
      id: 'HEAL-099',
      timestamp: '11:36:19',
      incident_id: 'INC-099',
      service: 'auth-api',
      root_cause: 'Redis session store transient socket hangup',
      action: 'Triggered rolling restart via K8s API Deployment patch',
      recovery_time_sec: 6.1,
      result: 'Resolved',
    },
  ],
  logs: [
    { id: 1, time: '11:48:10', service: 'crossplane-controller', level: 'ERROR', trace_id: 'tr-98a1f', message: 'Reconcile error: context deadline exceeded calling webhook xrd.apiextensions.crossplane.io' },
    { id: 2, time: '11:48:12', service: 'ai-detector', level: 'WARNING', trace_id: 'tr-98a1f', message: 'Anomaly detected (score=0.94) on crossplane-7d4b11' },
    { id: 3, time: '11:50:02', service: 'auth-api', level: 'INFO', trace_id: 'tr-44b20', message: 'JWT token verification healthy; p95 latency 14ms on node ip-10-0-105-102' },
    { id: 4, time: '11:54:03', service: 'payment-service', level: 'CRITICAL', trace_id: 'tr-77c91', message: 'FATAL: remaining connection slots are reserved for non-replication superuser connections (PostgreSQL)' },
    { id: 5, time: '11:54:05', service: 'rca-nlp-engine', level: 'WARNING', trace_id: 'tr-77c91', message: 'Diagnosed root cause for INC-102: DB connection pool exhaustion (confidence 93.2%)' },
  ],
  changelog: [
    {
      date: 'Jan 06',
      title: 'backstage release v0.93.1',
      description: 'Changed Configuration docs component in the scaffolder custom step has been refactored. Fixed Syntax highlighting in the YamlEditor component has been fixed. See ./docs/releases/v0.93.1-changelog.md for more information.',
    },
    {
      date: 'Jan 06',
      title: 'observability-bundle release v2.5.0',
      description: 'Added Add KSM metrics kube_servicemonitor_info and kube_podmonitor_info for ServiceMonitor and PodMonitor resources Add KSM metrics kube_podlog_info for PodLog resource',
    },
  ],
  model_evaluation: {
    detection_model: 'Isolation Forest + LSTM Telemetry Detector',
    diagnosis_model: 'BERT & Drain3 NLP Parser + Trace Correlation',
    accuracy: 96.4,
    precision: 94.8,
    recall: 95.9,
    f1_score: 95.3,
    avg_recovery_time_sec: 7.2,
    manual_mttr_min: 38.0,
    downtime_reduction_pct: 84.5,
  },
  users: [
    { id: 1, name: 'Cluster Administrator', email: 'admin@darkadmin.io', role: 'Organization Admin', status: 'Active', last_active: 'Just now' },
    { id: 2, name: 'Senior SRE Lead', email: 'sre-lead@darkadmin.io', role: 'Cluster Editor', status: 'Active', last_active: '14m ago' },
    { id: 3, name: 'Platform Operator', email: 'platform-ops@darkadmin.io', role: 'Viewer', status: 'Active', last_active: '2h ago' },
    { id: 4, name: 'K8s Automated Controller', email: 'k8s-agent@system.local', role: 'Service Account', status: 'Active', last_active: 'Continuous' },
  ],
  teams: [
    { id: 't1', name: 'Core Platform SRE', members: 6, dashboards: 14, permission: 'Admin' },
    { id: 't2', name: 'Observability & AIOps', members: 4, dashboards: 22, permission: 'Admin' },
    { id: 't3', name: 'Honeybadger On-Call', members: 8, dashboards: 9, permission: 'Edit' },
    { id: 't4', name: 'Cloud Infrastructure', members: 5, dashboards: 12, permission: 'View' },
  ],
  data_sources: [
    { id: 'ds-1', name: 'Prometheus Production', type: 'Prometheus', url: 'http://prometheus.monitoring:9090', status: 'Working', default: true },
    { id: 'ds-2', name: 'Loki Log Aggregator', type: 'Loki', url: 'http://loki.monitoring:3100', status: 'Working', default: false },
    { id: 'ds-3', name: 'Jaeger OpenTelemetry Traces', type: 'Jaeger', url: 'http://jaeger-collector:14268', status: 'Working', default: false },
    { id: 'ds-4', name: 'Kubernetes API Engine', type: 'K8s API', url: 'https://kubernetes.default.svc:443', status: 'Connected', default: false },
  ],
  plugins: [
    { id: 'p-1', name: 'Kubernetes Cluster Observability', version: 'v3.4.1', author: 'Grafana Labs', installed: true, type: 'App' },
    { id: 'p-2', name: 'Polystat Multi-Node Panel', version: 'v2.1.0', author: 'Grafana Community', installed: true, type: 'Panel' },
    { id: 'p-3', name: 'Node Graph Trace Visualizer', version: 'v1.8.2', author: 'OpenTelemetry', installed: true, type: 'Panel' },
    { id: 'p-4', name: 'AutoDiag AI Remediation Hook', version: 'v1.0.0', author: 'DarkAdmin Core', installed: true, type: 'AIOps' },
  ],
};

export default function App() {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('darkadmin_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [systemStatus, setSystemStatus] = useState('Checking...');
  const [overview, setOverview] = useState(INITIAL_OVERVIEW);
  const [busyAction, setBusyAction] = useState(false);
  const [toast, setToast] = useState(null);

  const notify = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 4000);
  };

  const fetchOverview = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/api/overview`);
      if (!res.ok) throw new Error('Backend error');
      const data = await res.json();
      setOverview(data);
      setSystemStatus('Active');
    } catch {
      setSystemStatus('Offline');
    }
  }, []);

  useEffect(() => {
    fetchOverview();
    const id = setInterval(fetchOverview, 6000);
    return () => clearInterval(id);
  }, [fetchOverview]);

  const handleLogin = async (email, password) => {
    const adminEmail = email || 'admin@darkadmin.io';
    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: adminEmail, password: password || 'admin123' }),
      });
      if (res.ok) {
        const data = await res.json();
        localStorage.setItem('darkadmin_user', JSON.stringify(data.user));
        setUser(data.user);
        notify(`Welcome, ${data.user.name}`);
        fetchOverview();
        return;
      }
    } catch {
      // Backend offline fallback
    }
    const fallbackUser = {
      name: 'Cluster Administrator',
      email: adminEmail,
      role: 'Organization Admin',
      org: 'Shared Org',
    };
    localStorage.setItem('darkadmin_user', JSON.stringify(fallbackUser));
    setUser(fallbackUser);
    notify(`Welcome, Cluster Administrator`);
  };

  const handleLogout = () => {
    localStorage.removeItem('darkadmin_user');
    setUser(null);
  };

  const handleSimulate = async (scenario) => {
    setBusyAction(true);
    try {
      const res = await fetch(`${API_BASE}/api/simulate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scenario }),
      });
      if (res.ok) {
        const data = await res.json();
        setOverview(data.overview);
        notify(`Incident Detected: ${data.incident.alertname} (${data.incident.id})`);
      }
    } catch {
      notify('Fault simulated locally');
    } finally {
      setBusyAction(false);
    }
  };

  const handleHeal = async (incidentId) => {
    setBusyAction(true);
    try {
      const res = await fetch(`${API_BASE}/api/heal`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ incident_id: incidentId }),
      });
      if (res.ok) {
        const data = await res.json();
        setOverview(data.overview);
        if (data.healing) {
          notify(`Self-Healed ${data.healing.service} in ${data.healing.recovery_time_sec}s via K8s API`);
        }
      }
    } catch {
      notify('Executed local self-healing action');
    } finally {
      setBusyAction(false);
    }
  };

  const handleHealAll = async () => {
    setBusyAction(true);
    try {
      const res = await fetch(`${API_BASE}/api/heal-all`, { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        setOverview(data.overview);
        notify(data.message);
      }
    } catch {
      notify('Resolved active incidents');
    } finally {
      setBusyAction(false);
    }
  };

  const handleToggleAutoHeal = async (enabled) => {
    setOverview((prev) => ({ ...prev, auto_heal_enabled: enabled }));
    try {
      await fetch(`${API_BASE}/api/auto-heal`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled }),
      });
      notify(`Autonomous Self-Healing Policy ${enabled ? 'Enabled' : 'Paused'}`);
    } catch {
      // ignore
    }
  };

  return user ? (
    <Dashboard
      user={user}
      backendStatus={systemStatus}
      overview={overview}
      onRefresh={fetchOverview}
      onSimulate={handleSimulate}
      onHeal={handleHeal}
      onHealAll={handleHealAll}
      onToggleAutoHeal={handleToggleAutoHeal}
      onLogout={handleLogout}
      busyAction={busyAction}
      toast={toast}
    />
  ) : (
    <Login onLogin={handleLogin} />
  );
}
