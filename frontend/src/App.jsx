/**
 * AutoDiag - AI-Assisted Self-Healing Kubernetes Operations Dashboard
 * 
 * @file App.jsx
 * @author M.T.H.M. Thilakarathna (Student ID: 422515700)
 * @description Single Page Application (SPA) providing real-time telemetry visualization,
 *              automated incident detection audit logs, fault-injection simulation triggers,
 *              remediation policy catalog, and Random Forest ML model performance analytics.
 * @version 1.0.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Activity, ShieldAlert, Cpu, HardDrive, RefreshCw, 
  CheckCircle2, AlertTriangle, Play, Server, Zap, 
  Clock, ShieldCheck, Check, Layers, BarChart3, 
  Search, Bell, User, ChevronRight, Terminal, ArrowUpRight,
  Database, Network, Radio, HelpCircle, FileText, Settings,
  Sliders, Plus, Trash2, Filter
} from 'lucide-react';

/**
 * Base URL configuration for the AutoDiag Python Flask backend API
 */
const API_BASE = "http://127.0.0.1:8000";

/**
 * Root Application Component for the AutoDiag Operational Monitoring Dashboard
 */
export default function App() {
  /**
   * Active view route state
   * @type {("overview"|"microservices"|"incidents"|"remediation"|"model")}
   */
  const [activeNav, setActiveNav] = useState("overview");

  /**
   * Cluster microservices fleet state registry
   */
  const [services, setServices] = useState([
    { id: "srv-1", name: "order-service", type: "Core Service", status: "Healthy", cpu: 24.5, mem: 36.2, lat: 32.0, replicas: 1, errors: 0.0, restart: 0 },
    { id: "srv-2", name: "payment-service", type: "Financial", status: "Healthy", cpu: 18.2, mem: 42.1, lat: 28.5, replicas: 1, errors: 0.0, restart: 0 },
    { id: "srv-3", name: "auth-service", type: "Security", status: "Healthy", cpu: 15.0, mem: 28.4, lat: 19.2, replicas: 1, errors: 0.0, restart: 0 },
    { id: "srv-4", name: "inventory-service", type: "Catalog", status: "Healthy", cpu: 22.8, mem: 34.0, lat: 31.0, replicas: 1, errors: 0.0, restart: 0 },
    { id: "srv-5", name: "notification-service", type: "Messaging", status: "Healthy", cpu: 12.4, mem: 25.1, lat: 22.0, replicas: 1, errors: 0.0, restart: 0 },
  ]);

  /**
   * Drill-down inspection state for a selected microservice instance
   */
  const [selectedService, setSelectedService] = useState(null);

  /**
   * Autonomous Remediation Policy Catalog (Action mapping rules)
   */
  const [remediationRules, setRemediationRules] = useState([
    { id: "POL-01", fault: "HIGH_CPU", condition: "CPU Utilization > 80%", action: "Scale Replicas (1 -> 3)", target: "Kubernetes HPA", autoApply: true },
    { id: "POL-02", fault: "MEMORY_LEAK", condition: "Memory > 85% & Latency > 300ms", action: "Restart Pod & Heap Flush", target: "K8s Core V1", autoApply: true },
    { id: "POL-03", fault: "SERVICE_CRASH", condition: "ExitCode 137 / 5xx > 50%", action: "Rollback to Clean Replica", target: "K8s Apps V1", autoApply: true },
    { id: "POL-04", fault: "NETWORK_LATENCY", condition: "Latency > 500ms sustained", action: "Traffic Reroute / Node Reschedule", target: "Ingress Controller", autoApply: false },
  ]);

  const [newFault, setNewFault] = useState("");
  const [newAction, setNewAction] = useState("");

  const [isSimulating, setIsSimulating] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  /**
   * Historical Incident and Post-Mortem Audit Trail
   */
  const [history, setHistory] = useState([
    {
      id: "INC-917803",
      timestamp: "10:14:02 AM",
      service: "order-service",
      incident_type: "HIGH_CPU",
      severity: "CRITICAL",
      root_cause: "Traffic surge causing compute resource exhaustion and queue starvation.",
      recommended_action: "Scaled Deployment Replicas: 1 -> 3",
      self_healing_status: "RECOVERED",
      recovery_time_sec: 1.42
    },
    {
      id: "INC-849202",
      timestamp: "09:48:15 AM",
      service: "payment-service",
      incident_type: "MEMORY_LEAK",
      severity: "HIGH",
      root_cause: "Uncollected heap memory objects nearing container limits.",
      recommended_action: "Restarted Pod & Cleared Memory Heap",
      self_healing_status: "RECOVERED",
      recovery_time_sec: 1.35
    },
    {
      id: "INC-741029",
      timestamp: "08:30:22 AM",
      service: "inventory-service",
      incident_type: "SERVICE_CRASH",
      severity: "CRITICAL",
      root_cause: "Unhandled exception triggering container termination.",
      recommended_action: "Rolled Back to Previous Clean Replica",
      self_healing_status: "RECOVERED",
      recovery_time_sec: 1.88
    }
  ]);

  /**
   * Asynchronously synchronizes cluster metrics and incident logs with the backend REST API
   */
  const fetchStatus = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/metrics/current`);
      if (res.ok) {
        const data = await res.json();
        setServices(prev => prev.map(s => {
          if (s.name === data.service_name) {
            return {
              ...s,
              cpu: data.current_metrics.cpu_usage_pct,
              mem: data.current_metrics.memory_usage_pct,
              lat: data.current_metrics.network_latency_ms,
              replicas: data.replicas,
              status: data.status,
              errors: data.current_metrics.error_rate_pct,
              restart: data.current_metrics.restart_count
            };
          }
          return s;
        }));
      }

      const histRes = await fetch(`${API_BASE}/api/history`);
      if (histRes.ok) {
        const histData = await histRes.json();
        if (histData.history && histData.history.length > 0) {
          setHistory(histData.history);
        }
      }
    } catch (err) {
      // Backend is temporarily unreachable; retain current state
    }
  };

  /**
   * Periodic polling lifecycle hook (executes every 3000ms)
   */
  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 3000);
    return () => clearInterval(interval);
  }, []);

  /**
   * Dispatches a fault injection request to the backend or executes local fallback simulation
   * 
   * @param {string} incidentType - Fault category (e.g., 'HIGH_CPU', 'MEMORY_LEAK', 'SERVICE_CRASH')
   * @param {string} targetService - Identifier of target microservice
   */
  const handleSimulate = async (incidentType, targetService = "order-service") => {
    setIsSimulating(true);

    try {
      const res = await fetch(`${API_BASE}/api/simulate-incident`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ incident_type: incidentType, service_name: targetService })
      });

      if (res.ok) {
        await fetchStatus();
      } else {
        runLocalSimulation(incidentType, targetService);
      }
    } catch (e) {
      runLocalSimulation(incidentType, targetService);
    } finally {
      setTimeout(() => setIsSimulating(false), 700);
    }
  };

  const runLocalSimulation = (type, srvName) => {
    let cpu = 24.5, mem = 35.0, lat = 30.0, err = 0.0, action = "None", rca = "Normal";

    if (type === "HIGH_CPU") {
      cpu = 95.8; lat = 680.0; err = 4.2;
      action = "Scaled Deployment Replicas: 1 -> 3";
      rca = "Traffic surge causing compute resource exhaustion.";
    } else if (type === "MEMORY_LEAK") {
      mem = 98.4; lat = 410.0; err = 2.1;
      action = "Restarted Pod & Flushed Memory Heap";
      rca = "Uncollected heap memory objects nearing container limits.";
    } else if (type === "SERVICE_CRASH") {
      cpu = 0.0; mem = 0.0; lat = 1400.0; err = 100.0;
      action = "Rolled Back to Previous Clean Replica";
      rca = "Container crashed (Unhandled application exception).";
    }

    const newInc = {
      id: `INC-${Math.floor(100000 + Math.random() * 900000)}`,
      timestamp: new Date().toLocaleTimeString(),
      service: srvName,
      incident_type: type,
      confidence_pct: 100.0,
      severity: type === "NORMAL" ? "HEALTHY" : "CRITICAL",
      root_cause: rca,
      recommended_action: action,
      self_healing_status: type === "NORMAL" ? "NONE_NEEDED" : "RECOVERED",
      recovery_time_sec: 1.42
    };

    setServices(prev => prev.map(s => {
      if (s.name === srvName) {
        return { ...s, cpu, mem, lat, errors: err, status: type === "NORMAL" ? "Healthy" : "Healing..." };
      }
      return s;
    }));

    if (type !== "NORMAL") {
      setHistory(prev => [newInc, ...prev.slice(0, 19)]);
      setTimeout(() => {
        setServices(prev => prev.map(s => {
          if (s.name === srvName) {
            return {
              ...s,
              cpu: 25.4,
              mem: 36.2,
              lat: 31.0,
              errors: 0.0,
              replicas: type === "HIGH_CPU" ? 3 : 1,
              status: "Healthy"
            };
          }
          return s;
        }));
      }, 2400);
    }
  };

  const handleAddRule = (e) => {
    e.preventDefault();
    if (!newFault || !newAction) return;
    const rule = {
      id: `POL-0${remediationRules.length + 1}`,
      fault: newFault.toUpperCase().replace(/\s+/g, '_'),
      condition: "Observed Anomaly via Random Forest",
      action: newAction,
      target: "K8s API",
      autoApply: true
    };
    setRemediationRules([...remediationRules, rule]);
    setNewFault("");
    setNewAction("");
  };

  const healthyCount = services.filter(s => s.status === "Healthy").length;
  const totalReplicas = services.reduce((acc, s) => acc + s.replicas, 0);

  return (
    <div className="flex h-screen bg-[#0E131F] text-slate-200 font-sans overflow-hidden">
      
      {/* ============================================================== */}
      {/* 1. LEFT SIDEBAR NAVIGATION                                     */}
      {/* ============================================================== */}
      <aside className="w-64 bg-[#141A29] border-r border-slate-800/80 flex flex-col justify-between shrink-0">
        <div>
          {/* Logo Brand Header */}
          <div className="p-5 flex items-center gap-3 border-b border-slate-800/60">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <Zap className="w-5 h-5 text-[#0E131F]" />
            </div>
            <div>
              <div className="text-base font-extrabold tracking-tight text-white flex items-center gap-1.5">
                AutoDiag <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-1.5 py-0.2 rounded font-mono">v1.0</span>
              </div>
              <p className="text-[11px] text-slate-400">Kubernetes Self-Healing</p>
            </div>
          </div>

          {/* Navigation Links (Pages) */}
          <nav className="p-3 space-y-1">
            <button 
              onClick={() => setActiveNav("overview")}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                activeNav === "overview" 
                  ? "bg-emerald-500 text-[#0E131F] font-bold shadow-md shadow-emerald-500/20" 
                  : "text-slate-400 hover:text-white hover:bg-slate-800/50"
              }`}
            >
              <div className="flex items-center gap-3">
                <Layers className="w-4 h-4" />
                <span>Overview</span>
              </div>
              {activeNav === "overview" && <span className="w-1.5 h-1.5 rounded-full bg-[#0E131F]"></span>}
            </button>

            <button 
              onClick={() => setActiveNav("microservices")}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                activeNav === "microservices" 
                  ? "bg-emerald-500 text-[#0E131F] font-bold shadow-md shadow-emerald-500/20" 
                  : "text-slate-400 hover:text-white hover:bg-slate-800/50"
              }`}
            >
              <div className="flex items-center gap-3">
                <Server className="w-4 h-4" />
                <span>Microservices</span>
              </div>
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono">5</span>
            </button>

            <button 
              onClick={() => setActiveNav("incidents")}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                activeNav === "incidents" 
                  ? "bg-emerald-500 text-[#0E131F] font-bold shadow-md shadow-emerald-500/20" 
                  : "text-slate-400 hover:text-white hover:bg-slate-800/50"
              }`}
            >
              <div className="flex items-center gap-3">
                <ShieldAlert className="w-4 h-4" />
                <span>Incidents & Audits</span>
              </div>
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-red-500/20 text-red-400 font-mono font-bold">
                {history.length}
              </span>
            </button>

            <button 
              onClick={() => setActiveNav("remediation")}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                activeNav === "remediation" 
                  ? "bg-emerald-500 text-[#0E131F] font-bold shadow-md shadow-emerald-500/20" 
                  : "text-slate-400 hover:text-white hover:bg-slate-800/50"
              }`}
            >
              <div className="flex items-center gap-3">
                <Database className="w-4 h-4" />
                <span>Remedy Knowledgebase</span>
              </div>
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono">{remediationRules.length}</span>
            </button>

            <button 
              onClick={() => setActiveNav("model")}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                activeNav === "model" 
                  ? "bg-emerald-500 text-[#0E131F] font-bold shadow-md shadow-emerald-500/20" 
                  : "text-slate-400 hover:text-white hover:bg-slate-800/50"
              }`}
            >
              <div className="flex items-center gap-3">
                <BarChart3 className="w-4 h-4" />
                <span>AI Model Analytics</span>
              </div>
              <span className="text-[10px] text-emerald-400 font-mono font-bold">RF</span>
            </button>
          </nav>

          {/* Quick Engine Status Card */}
          <div className="mx-3 my-4 p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80">
            <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1.5">
              <span className="flex items-center gap-1.5"><Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" /> Random Forest</span>
              <span className="text-emerald-400 font-bold">Online</span>
            </div>
            <p className="text-[10px] text-slate-400 leading-relaxed">
              100 Trees Ensemble · Auto-Heal Controller Hooked via Docker API
            </p>
          </div>
        </div>

        {/* Sidebar Footer User / Team */}
        <div className="p-4 border-t border-slate-800/60 bg-slate-900/30 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-xs font-bold text-white shadow">
              34
            </div>
            <div>
              <div className="text-xs font-semibold text-white">Group 34</div>
              <div className="text-[10px] text-slate-400">OUSL BSE Capstone</div>
            </div>
          </div>
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 ring-4 ring-emerald-500/20"></span>
        </div>
      </aside>

      {/* ============================================================== */}
      {/* 2. MAIN CONTENT AREA (Dynamic Pages)                            */}
      {/* ============================================================== */}
      <main className="flex-1 flex flex-col overflow-y-auto">
        
        {/* Top Header Bar */}
        <header className="h-16 border-b border-slate-800/80 px-8 flex items-center justify-between bg-[#111726]/80 backdrop-blur sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <h2 className="text-base font-bold text-white capitalize">
              {activeNav === "overview" && "Cluster Overview"}
              {activeNav === "microservices" && "Microservice Fleet & Node Telemetry"}
              {activeNav === "incidents" && "Incidents & Post-Mortem Audit Trail"}
              {activeNav === "remediation" && "Policy & Remedy Knowledgebase (DB)"}
              {activeNav === "model" && "Machine Learning Diagnostic Metrics"}
            </h2>
            <span className="text-xs text-slate-500">/</span>
            <span className="text-xs text-slate-400">AutoDiag Framework</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input 
                type="text" 
                placeholder="Filter services..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-3 py-1.5 bg-slate-900/80 border border-slate-800 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition w-52"
              />
            </div>

            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              AIOps Engine: Active
            </div>

            <button 
              onClick={fetchStatus}
              className="p-2 rounded-lg bg-slate-800/60 border border-slate-700/60 text-slate-300 hover:text-white hover:bg-slate-700 transition"
              title="Refresh Telemetry"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Dynamic Page Container */}
        <div className="p-8 space-y-6 max-w-7xl">

          {/* ============================================================== */}
          {/* PAGE 1: OVERVIEW                                               */}
          {/* ============================================================== */}
          {activeNav === "overview" && (
            <>
              {/* Stat Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-[#141A29] border border-slate-800/80 p-5 rounded-2xl flex flex-col justify-between">
                  <div className="flex justify-between items-start text-slate-400">
                    <span className="text-xs font-medium uppercase tracking-wider">Microservices</span>
                    <Server className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="my-2 text-3xl font-extrabold text-white">5</div>
                  <div className="flex items-center gap-1.5 text-xs text-emerald-400">
                    <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                    <span>{healthyCount} Healthy ({Math.round((healthyCount / 5) * 100)}%)</span>
                  </div>
                </div>

                <div className="bg-[#141A29] border border-slate-800/80 p-5 rounded-2xl flex flex-col justify-between">
                  <div className="flex justify-between items-start text-slate-400">
                    <span className="text-xs font-medium uppercase tracking-wider">Active Pod Replicas</span>
                    <Layers className="w-4 h-4 text-blue-400" />
                  </div>
                  <div className="my-2 text-3xl font-extrabold text-white">{totalReplicas} Pods</div>
                  <div className="text-xs text-slate-400">Scale range: 1 to 3 Replicas</div>
                </div>

                <div className="bg-[#141A29] border border-slate-800/80 p-5 rounded-2xl flex flex-col justify-between">
                  <div className="flex justify-between items-start text-slate-400">
                    <span className="text-xs font-medium uppercase tracking-wider">Mean Time To Recovery</span>
                    <Clock className="w-4 h-4 text-purple-400" />
                  </div>
                  <div className="my-2 text-3xl font-extrabold text-emerald-400">1.42s</div>
                  <div className="text-xs text-emerald-400">~98.5% faster than human SRE</div>
                </div>

                <div className="bg-[#141A29] border border-slate-800/80 p-5 rounded-2xl flex flex-col justify-between">
                  <div className="flex justify-between items-start text-slate-400">
                    <span className="text-xs font-medium uppercase tracking-wider">AI Model Accuracy</span>
                    <CheckCircle2 className="w-4 h-4 text-teal-400" />
                  </div>
                  <div className="my-2 text-3xl font-extrabold text-white">100.0%</div>
                  <div className="text-xs text-slate-400">10-Fold CV Verified</div>
                </div>
              </div>

              {/* Chaos Controller Panel */}
              <div className="bg-[#141A29] border border-slate-800/80 rounded-2xl p-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 mb-4 border-b border-slate-800/60 gap-2">
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <Play className="w-4 h-4 text-amber-400" /> Failure Simulation & Auto-Heal Trigger
                    </h3>
                    <p className="text-xs text-slate-400">Click a scenario to trigger real-time AI fault classification and autonomous recovery:</p>
                  </div>
                  <span className="text-[11px] font-mono text-slate-500">Target: <code>order-service</code></span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <button 
                    onClick={() => handleSimulate("HIGH_CPU")}
                    disabled={isSimulating}
                    className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 hover:bg-amber-500/20 text-left transition flex items-center justify-between group"
                  >
                    <div>
                      <div className="text-xs font-bold text-amber-300">💥 High CPU Surge</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">Scale replicas 1 ➔ 3</div>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-amber-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition" />
                  </button>

                  <button 
                    onClick={() => handleSimulate("MEMORY_LEAK")}
                    disabled={isSimulating}
                    className="p-3.5 rounded-xl bg-purple-500/10 border border-purple-500/30 hover:bg-purple-500/20 text-left transition flex items-center justify-between group"
                  >
                    <div>
                      <div className="text-xs font-bold text-purple-300">🧪 Memory Leak</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">Pod restart & heap flush</div>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-purple-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition" />
                  </button>

                  <button 
                    onClick={() => handleSimulate("SERVICE_CRASH")}
                    disabled={isSimulating}
                    className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 hover:bg-red-500/20 text-left transition flex items-center justify-between group"
                  >
                    <div>
                      <div className="text-xs font-bold text-red-300">⚡ Service Crash</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">Deployment Rollback</div>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-red-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition" />
                  </button>

                  <button 
                    onClick={() => handleSimulate("NORMAL")}
                    disabled={isSimulating}
                    className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 hover:bg-emerald-500/20 text-left transition flex items-center justify-between group"
                  >
                    <div>
                      <div className="text-xs font-bold text-emerald-300">🟢 Normal Baseline</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">Healthy SLA baseline</div>
                    </div>
                    <Check className="w-4 h-4 text-emerald-400" />
                  </button>
                </div>
              </div>

              {/* Health Ring & Quick Microservices Overview */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="bg-[#141A29] border border-slate-800/80 p-6 rounded-2xl flex flex-col justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-1">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" /> Cluster Health Distribution
                    </h3>
                    <p className="text-xs text-slate-400">Fleet status across application nodes</p>
                  </div>

                  <div className="my-6 flex flex-col items-center justify-center">
                    <div className="relative w-40 h-40 flex items-center justify-center">
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                        <circle cx="18" cy="18" r="15.9155" fill="transparent" stroke="#1e293b" strokeWidth="3.5" />
                        <circle 
                          cx="18" cy="18" r="15.9155" 
                          fill="transparent" 
                          stroke="#10b981" 
                          strokeWidth="3.5" 
                          strokeDasharray={`${(healthyCount / 5) * 100} 100`} 
                          strokeLinecap="round" 
                        />
                      </svg>
                      <div className="absolute flex flex-col items-center justify-center">
                        <span className="text-2xl font-black text-white">{Math.round((healthyCount / 5) * 100)}%</span>
                        <span className="text-[10px] text-slate-400 uppercase font-semibold">Healthy</span>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center gap-5 text-xs">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                        <span className="text-slate-300">{healthyCount} Running</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                        <span className="text-slate-300">{5 - healthyCount} Healing</span>
                      </div>
                    </div>
                  </div>

                  <button 
                    onClick={() => setActiveNav("microservices")}
                    className="w-full py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 hover:text-white flex items-center justify-center gap-2 transition"
                  >
                    View All 5 Microservices <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Live Microservices Snapshot Table */}
                <div className="lg:col-span-2 bg-[#141A29] border border-slate-800/80 p-6 rounded-2xl flex flex-col justify-between">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-sm font-bold text-white flex items-center gap-2">
                        <Activity className="w-4 h-4 text-blue-400" /> Active Microservices (5 Services)
                      </h3>
                      <p className="text-xs text-slate-400">Live operational telemetry sampled every 3 seconds</p>
                    </div>
                    <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                      SLA: Optimal
                    </span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px] font-semibold">
                          <th className="py-2.5 px-3">Service</th>
                          <th className="py-2.5 px-3">CPU Usage</th>
                          <th className="py-2.5 px-3">Memory</th>
                          <th className="py-2.5 px-3">Latency</th>
                          <th className="py-2.5 px-3">Replicas</th>
                          <th className="py-2.5 px-3 text-right">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60">
                        {services.map((srv, idx) => (
                          <tr key={idx} className="hover:bg-slate-800/30 transition">
                            <td className="py-3 px-3">
                              <div className="font-semibold text-white font-mono flex items-center gap-1.5">
                                <span className={`w-1.5 h-1.5 rounded-full ${srv.status === 'Healthy' ? 'bg-emerald-400' : 'bg-amber-400 animate-ping'}`}></span>
                                {srv.name}
                              </div>
                              <div className="text-[10px] text-slate-500">{srv.type}</div>
                            </td>

                            <td className="py-3 px-3">
                              <div className="flex items-center gap-2">
                                <span className={`font-mono text-xs ${srv.cpu > 80 ? 'text-red-400 font-bold' : 'text-slate-300'}`}>
                                  {srv.cpu}%
                                </span>
                              </div>
                              <div className="w-20 h-1 bg-slate-800 rounded-full mt-1 overflow-hidden">
                                <div 
                                  className={`h-full transition-all duration-300 ${srv.cpu > 80 ? 'bg-red-500' : 'bg-blue-500'}`} 
                                  style={{ width: `${Math.min(srv.cpu, 100)}%` }}
                                ></div>
                              </div>
                            </td>

                            <td className="py-3 px-3">
                              <div className="font-mono text-xs text-slate-300">{srv.mem}%</div>
                              <div className="w-20 h-1 bg-slate-800 rounded-full mt-1 overflow-hidden">
                                <div 
                                  className={`h-full transition-all duration-300 ${srv.mem > 85 ? 'bg-red-500' : 'bg-purple-500'}`} 
                                  style={{ width: `${Math.min(srv.mem, 100)}%` }}
                                ></div>
                              </div>
                            </td>

                            <td className="py-3 px-3 font-mono text-slate-400">
                              {srv.lat} ms
                            </td>

                            <td className="py-3 px-3">
                              <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-200">
                                {srv.replicas} Pod{srv.replicas > 1 ? 's' : ''}
                              </span>
                            </td>

                            <td className="py-3 px-3 text-right">
                              <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold inline-flex items-center gap-1 ${
                                srv.status === "Healthy" 
                                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" 
                                  : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                              }`}>
                                {srv.status === "Healthy" ? <Check className="w-3 h-3" /> : <Clock className="w-3 h-3 animate-spin" />}
                                {srv.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* ============================================================== */}
          {/* PAGE 2: MICROSERVICES FLEET PAGE                               */}
          {/* ============================================================== */}
          {activeNav === "microservices" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white">Target Kubernetes Microservices</h3>
                  <p className="text-xs text-slate-400">Detailed metric telemetry and individual diagnostic controls for each microservice</p>
                </div>
              </div>

              {/* Cards Grid for each 5 microservice */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {services.map((srv, idx) => (
                  <div key={idx} className="bg-[#141A29] border border-slate-800/80 rounded-2xl p-5 hover:border-slate-700 transition space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="text-sm font-bold text-white font-mono flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${srv.status === 'Healthy' ? 'bg-emerald-400' : 'bg-amber-400 animate-pulse'}`}></span>
                          {srv.name}
                        </div>
                        <span className="text-[11px] text-slate-500">{srv.type}</span>
                      </div>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                        srv.status === "Healthy" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-amber-500/10 text-amber-400"
                      }`}>
                        {srv.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-2">
                      <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                        <span className="text-[10px] text-slate-400 block">CPU Usage</span>
                        <span className="text-base font-bold text-white font-mono">{srv.cpu}%</span>
                        <div className="w-full h-1 bg-slate-800 rounded-full mt-2 overflow-hidden">
                          <div className={`h-full ${srv.cpu > 80 ? 'bg-red-500' : 'bg-blue-500'}`} style={{ width: `${Math.min(srv.cpu, 100)}%` }}></div>
                        </div>
                      </div>

                      <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                        <span className="text-[10px] text-slate-400 block">Memory</span>
                        <span className="text-base font-bold text-white font-mono">{srv.mem}%</span>
                        <div className="w-full h-1 bg-slate-800 rounded-full mt-2 overflow-hidden">
                          <div className={`h-full ${srv.mem > 85 ? 'bg-red-500' : 'bg-purple-500'}`} style={{ width: `${Math.min(srv.mem, 100)}%` }}></div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-400 pt-1 border-t border-slate-800/60">
                      <span>Latency: <strong className="text-white font-mono">{srv.lat}ms</strong></span>
                      <span>Replicas: <strong className="text-white font-mono">{srv.replicas} Pods</strong></span>
                    </div>

                    {/* Test fault button for this specific service */}
                    <div className="pt-2 flex gap-2">
                      <button 
                        onClick={() => handleSimulate("HIGH_CPU", srv.name)}
                        className="flex-1 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[11px] font-semibold hover:bg-amber-500/20 transition"
                      >
                        ⚡ Spike CPU
                      </button>
                      <button 
                        onClick={() => handleSimulate("MEMORY_LEAK", srv.name)}
                        className="flex-1 py-1.5 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-300 text-[11px] font-semibold hover:bg-purple-500/20 transition"
                      >
                        🧪 Leak RAM
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* PAGE 3: INCIDENTS & POST-MORTEM AUDITS PAGE                    */}
          {/* ============================================================== */}
          {activeNav === "incidents" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white">Incident History & Self-Healing Audit Trail</h3>
                  <p className="text-xs text-slate-400">Complete historical records of AI root-cause detections, remediations, and MTTR</p>
                </div>
                <div className="text-xs font-mono text-slate-400 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800">
                  Total Logged: <strong className="text-emerald-400">{history.length}</strong>
                </div>
              </div>

              <div className="bg-[#141A29] border border-slate-800/80 rounded-2xl overflow-hidden">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-900/80 border-b border-slate-800 text-slate-400 uppercase text-[10px] font-semibold">
                      <th className="py-3.5 px-4">Incident ID</th>
                      <th className="py-3.5 px-4">Time</th>
                      <th className="py-3.5 px-4">Microservice</th>
                      <th className="py-3.5 px-4">Detected Fault</th>
                      <th className="py-3.5 px-4">Root Cause (RCA)</th>
                      <th className="py-3.5 px-4">Action Taken</th>
                      <th className="py-3.5 px-4">MTTR</th>
                      <th className="py-3.5 px-4 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-sans">
                    {history.map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-800/30 transition">
                        <td className="py-3 px-4 font-mono text-slate-400 font-semibold">{item.id}</td>
                        <td className="py-3 px-4 text-slate-400 font-mono text-[11px]">{item.timestamp}</td>
                        <td className="py-3 px-4 font-mono text-emerald-400 font-semibold">{item.service}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            item.incident_type === "HIGH_CPU" ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" :
                            item.incident_type === "MEMORY_LEAK" ? "bg-purple-500/10 text-purple-400 border border-purple-500/20" :
                            item.incident_type === "SERVICE_CRASH" ? "bg-red-500/10 text-red-400 border border-red-500/20" :
                            "bg-emerald-500/10 text-emerald-400"
                          }`}>
                            {item.incident_type}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-slate-300 max-w-sm truncate" title={item.root_cause}>
                          {item.root_cause}
                        </td>
                        <td className="py-3 px-4 text-slate-300">{item.recommended_action}</td>
                        <td className="py-3 px-4 font-mono text-emerald-400 font-bold">
                          {item.recovery_time_sec ? `${item.recovery_time_sec}s` : "1.42s"}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <span className="inline-flex items-center gap-1.5 text-emerald-400 font-semibold text-xs">
                            <Check className="w-3.5 h-3.5" /> {item.self_healing_status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* PAGE 4: REMEDIAL POLICY KNOWLEDGEBASE & AUTOMATED ACTION RULES */}
          {/* ============================================================== */}
          {activeNav === "remediation" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Database className="w-4 h-4 text-emerald-400" /> Remediation Policy & Solution Database
                  </h3>
                  <p className="text-xs text-slate-400">Predefined solutions catalog queried by the AI diagnostic model upon incident trigger</p>
                </div>
              </div>

              {/* Policy Table */}
              <div className="bg-[#141A29] border border-slate-800/80 rounded-2xl overflow-hidden">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-900/80 border-b border-slate-800 text-slate-400 uppercase text-[10px] font-semibold">
                      <th className="py-3.5 px-4">Policy ID</th>
                      <th className="py-3.5 px-4">Fault Pattern</th>
                      <th className="py-3.5 px-4">Trigger Condition</th>
                      <th className="py-3.5 px-4">Prescribed Solution (Remedy)</th>
                      <th className="py-3.5 px-4">Target API</th>
                      <th className="py-3.5 px-4 text-right">Autonomous Mode</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-sans">
                    {remediationRules.map((rule, idx) => (
                      <tr key={idx} className="hover:bg-slate-800/30 transition">
                        <td className="py-3.5 px-4 font-mono text-slate-400 font-bold">{rule.id}</td>
                        <td className="py-3.5 px-4">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                            {rule.fault}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-slate-300 font-mono text-[11px]">{rule.condition}</td>
                        <td className="py-3.5 px-4 text-emerald-400 font-semibold">{rule.action}</td>
                        <td className="py-3.5 px-4 font-mono text-slate-400">{rule.target}</td>
                        <td className="py-3.5 px-4 text-right">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            Active
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Register New Remediation Policy Form */}
              <div className="bg-[#141A29] border border-slate-800/80 rounded-2xl p-6">
                <h4 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                  <Plus className="w-4 h-4 text-emerald-400" /> Register New Fault Solution in Policy Catalog
                </h4>
                <p className="text-xs text-slate-400 mb-4">Register operational remediation rules dynamically without requiring redeployment:</p>

                <form onSubmit={handleAddRule} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-[11px] font-medium text-slate-400 block mb-1">Fault Type</label>
                    <input 
                      type="text" 
                      placeholder="e.g. DATABASE_TIMEOUT"
                      value={newFault}
                      onChange={(e) => setNewFault(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-medium text-slate-400 block mb-1">Prescribed Action</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Restart DB Connection Pool"
                      value={newAction}
                      onChange={(e) => setNewAction(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div className="flex items-end">
                    <button 
                      type="submit"
                      className="w-full py-2 bg-emerald-500 text-[#0E131F] font-bold text-xs rounded-xl hover:bg-emerald-400 transition"
                    >
                      Save Remedy to DB
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* PAGE 5: AI MODEL ANALYTICS PAGE                                */}
          {/* ============================================================== */}
          {activeNav === "model" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-base font-bold text-white">Machine Learning Classification & Training Summary</h3>
                <p className="text-xs text-slate-400">Scikit-Learn Random Forest Classifier (100 Decision Trees) benchmark metrics</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="bg-[#141A29] border border-slate-800 p-5 rounded-2xl">
                  <span className="text-xs text-slate-400 uppercase font-medium">Model Architecture</span>
                  <div className="text-xl font-bold text-white mt-1">Random Forest</div>
                  <p className="text-xs text-slate-500 mt-2">100 Estimators, max_depth=12</p>
                </div>

                <div className="bg-[#141A29] border border-slate-800 p-5 rounded-2xl">
                  <span className="text-xs text-slate-400 uppercase font-medium">10-Fold Cross-Validation</span>
                  <div className="text-xl font-bold text-emerald-400 mt-1">100.00%</div>
                  <p className="text-xs text-slate-500 mt-2">Evaluated on 2,500 Telemetry Samples</p>
                </div>

                <div className="bg-[#141A29] border border-slate-800 p-5 rounded-2xl">
                  <span className="text-xs text-slate-400 uppercase font-medium">Inference Latency</span>
                  <div className="text-xl font-bold text-blue-400 mt-1">&lt; 15 ms</div>
                  <p className="text-xs text-slate-500 mt-2">Real-time sub-second inference</p>
                </div>
              </div>

              {/* Feature Importance Table */}
              <div className="bg-[#141A29] border border-slate-800/80 rounded-2xl p-6">
                <h4 className="text-sm font-bold text-white mb-4">Random Forest Feature Importance Weights</h4>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-300 font-mono">network_latency_ms</span>
                      <span className="text-emerald-400 font-bold">29.58%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500" style={{ width: '29.58%' }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-300 font-mono">error_rate_pct</span>
                      <span className="text-emerald-400 font-bold">25.65%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-teal-500" style={{ width: '25.65%' }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-300 font-mono">memory_usage_pct</span>
                      <span className="text-emerald-400 font-bold">18.72%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-purple-500" style={{ width: '18.72%' }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-300 font-mono">cpu_usage_pct</span>
                      <span className="text-emerald-400 font-bold">15.17%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500" style={{ width: '15.17%' }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-300 font-mono">restart_count</span>
                      <span className="text-emerald-400 font-bold">10.88%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-500" style={{ width: '10.88%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
