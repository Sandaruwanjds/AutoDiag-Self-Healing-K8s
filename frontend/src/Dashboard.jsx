import React, { useMemo, useState } from 'react';
import {
  Search, Home, Bookmark, Star, LayoutDashboard, Compass, Layers, Plug, Settings,
  ChevronDown, ChevronUp, PanelLeft, Bell, HelpCircle, RefreshCw, Clock, ZoomOut,
  ChevronLeft, ChevronRight, ExternalLink, Info, Filter, LogOut, Zap, ShieldCheck,
  AlertTriangle, BrainCircuit, CheckCircle2, Activity, Terminal, Users, Play,
  Plus, Database, Cpu, HardDrive, Network, GitFork, Sliders, Shield, Radio,
  Folder, Share2, Eye, Server, RefreshCcw, Download, Copy,
} from 'lucide-react';

/* ---------- Navigation structure matching Grafana screenshot ---------- */
const nav = [
  { label: 'Home', icon: Home },
  { label: 'Bookmarks', icon: Bookmark, chev: true, children: ['Production Queries', 'Alert Triage', 'Saved Nodes'] },
  { label: 'Starred', icon: Star, chev: true, children: ['Cluster Overview', 'Compute Resources', 'Node Exporter'] },
  { label: 'Dashboards', icon: LayoutDashboard, chev: true, active: true, children: ['Playlists', 'Snapshots', 'Library panels'] },
  { label: 'Explore', icon: Compass },
  { label: 'Drilldown', icon: Layers, chev: true, children: ['Metrics', 'Logs', 'Traces', 'Profiles'] },
  { label: 'Connections', icon: Plug, chev: true, children: ['Add new connection', 'Data sources'] },
  {
    label: 'Administration', icon: Settings, chev: true,
    children: ['General', 'Default preferences', 'Provisioning', 'Plugins and data', 'Plugins', 'Correlations', 'Users and access', 'Users', 'Teams', 'Service accounts'],
  },
];
const indentSub = ['Default preferences', 'Provisioning', 'Plugins', 'Correlations', 'Users', 'Teams', 'Service accounts'];

/* ---------- SVG Math & Seeded Charts ---------- */
const seeded = (seed) => () => (seed = (seed * 16807) % 2147483647) / 2147483647;

function StackedChart({ colors, max, labels, seed, base, spikeFactor = 1 }) {
  const W = 400, H = 150, N = 60;
  const layers = useMemo(() => {
    const r = seeded(seed);
    const data = colors.map((_, li) =>
      Array.from({ length: N }, (_, i) => {
        const tailBoost = i > 46 ? spikeFactor : 1;
        return base[li] * tailBoost * (0.85 + 0.3 * r() + (i % 17 === 0 ? 0.25 * r() : 0));
      }),
    );
    const cum = Array.from({ length: N }, () => 0);
    return data.map((arr) => {
      const lower = [...cum];
      arr.forEach((v, i) => (cum[i] += v));
      return { lower, upper: [...cum] };
    });
  }, [seed, spikeFactor, colors, base]);
  const x = (i) => (i / (N - 1)) * W;
  const y = (v) => Math.max(2, H - (v / max) * H);
  return (
    <svg viewBox={`0 0 ${W + 30} ${H + 18}`} className="w-full h-full" preserveAspectRatio="none">
      {[0, 1, 2, 3, 4].map((g) => (
        <g key={g}>
          <line x1="30" x2={W + 30} y1={(g / 4) * H} y2={(g / 4) * H} stroke="#2a2f3a" strokeWidth="0.5" />
          <text x="0" y={(g / 4) * H + 3} fontSize="7" fill="#9aa0ab">{labels[g]}</text>
        </g>
      ))}
      <g transform="translate(30,0)">
        {layers.map((l, li) => {
          const top = l.upper.map((v, i) => `${x(i)},${y(v)}`).join(' L');
          const bot = l.lower.map((v, i) => `${x(i)},${y(v)}`).reverse().join(' L');
          return <path key={li} d={`M${top} L${bot} Z`} fill={colors[li]} opacity="0.9" />;
        })}
      </g>
      {['07:00', '08:00', '09:00', '10:00', '11:00', '12:00'].map((t, i) => (
        <text key={t} x={30 + (i / 5) * (W - 15)} y={H + 12} fontSize="7" fill="#9aa0ab">{t}</text>
      ))}
    </svg>
  );
}

function Gauge({ value }) {
  const r = 52, c = Math.PI * 1.5 * r;
  const color = value > 80 ? '#f2495c' : value > 65 ? '#ff9830' : '#73bf69';
  const arc = (frac, stroke, w) => (
    <circle
      cx="70" cy="70" r={r} fill="none" stroke={stroke} strokeWidth={w} strokeLinecap="butt"
      strokeDasharray={`${c * Math.min(1, frac)} ${2 * Math.PI * r}`} transform="rotate(135 70 70)"
    />
  );
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <svg viewBox="0 0 140 140" className="h-full max-h-[150px]">
        {arc(1, '#2a2f3a', 9)}
        {arc(value / 100, color, 9)}
        <circle
          cx="70" cy="70" r={r + 10} fill="none" stroke="#f2495c" strokeWidth="3"
          strokeDasharray={`${c * 0.1} ${2 * Math.PI * (r + 10)}`} transform="rotate(225 70 70)" opacity="0.8"
        />
      </svg>
      <span className="absolute text-3xl text-gray-100 font-medium">
        {value}<span className="text-2xl">%</span>
      </span>
    </div>
  );
}

function Panel({ title, children, className = '', info, action }) {
  return (
    <div className={`bg-[#181b1f] border border-[#2a2f3a] rounded-sm flex flex-col min-w-0 ${className}`}>
      <div className="flex items-center gap-2 px-3 py-2 text-[13px] font-medium text-gray-200">
        <span className="truncate">{title}</span>
        {info && <Info size={11} className="text-gray-500 shrink-0" />}
        <ExternalLink size={11} className="text-gray-500 ml-1 shrink-0" />
        {action && <div className="ml-auto">{action}</div>}
      </div>
      <div className="flex-1 min-h-0 px-3 pb-3">{children}</div>
    </div>
  );
}

const legendFixed = ['aws-load-balancer-controller', 'backstage', 'crossplane', 'external-secrets', 'flux-giantswarm', 'giantswarm', 'karpenter'];
const lc = ['#73bf69', '#f2cc0c', '#5794f2', '#ff9830', '#b877d9', '#e0b400', '#8ab8ff'];
const cpuColors = ['#8ab8ff', '#e0b400', '#b877d9'];
const memColors = ['#e0b400', '#b877d9'];

const CLUSTERS = [
  { name: 'gazelle', region: 'eu-central-1', k8s: 'v1.33.5', owner: 'giantswarm' },
  { name: 'prod-eu-west-1', region: 'eu-west-1', k8s: 'v1.32.1', owner: 'platform-team' },
  { name: 'staging-us-east-2', region: 'us-east-2', k8s: 'v1.33.0', owner: 'sre-ops' },
];

const TIME_RANGES = ['Last 15 minutes', 'Last 1 hour', 'Last 6 hours', 'Last 24 hours', 'Last 7 days'];

export default function Dashboard({
  user,
  backendStatus,
  overview,
  onRefresh,
  onSimulate,
  onHeal,
  onHealAll,
  onToggleAutoHeal,
  onLogout,
  busyAction,
  toast,
}) {
  const [open, setOpen] = useState({ Bookmarks: true, Starred: true, Dashboards: true, Drilldown: true, Connections: true, Administration: true });
  const [activeNav, setActiveNav] = useState('Dashboards');
  const [selectedCluster, setSelectedCluster] = useState(CLUSTERS[0]);
  const [clusterMenuOpen, setClusterMenuOpen] = useState(false);
  const [timeRange, setTimeRange] = useState('Last 6 hours');
  const [timeMenuOpen, setTimeMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIncident, setSelectedIncident] = useState(null);

  // Explore query state
  const [exploreQuery, setExploreQuery] = useState('rate(node_cpu_seconds_total{mode="idle"}[5m])');
  const [exploreRunning, setExploreRunning] = useState(false);

  // Logs filter state
  const [logFilterLevel, setLogFilterLevel] = useState('ALL');

  const metrics = overview.metrics;
  const nodes = overview.nodes;
  const alerts = overview.alerts;
  const changelog = overview.changelog;
  const logs = overview.logs;
  const healingHistory = overview.healing_history;
  const microservices = overview.microservices;
  const modelEval = overview.model_evaluation;
  const usersList = overview.users || [];
  const teamsList = overview.teams || [];
  const dataSources = overview.data_sources || [];
  const pluginsList = overview.plugins || [];

  const filteredNodes = useMemo(
    () => nodes.filter((n) => n.name.toLowerCase().includes(searchQuery.toLowerCase())),
    [nodes, searchQuery]
  );

  const cpuSpike = metrics.cpu_usage > 45 ? 1.55 : 1;
  const memSpike = metrics.memory_usage > 60 ? 1.35 : 1;

  /* ------------------- Render Different Left-Sidebar Tab Views ------------------- */
  const renderContent = () => {
    switch (activeNav) {
      /* ---------- EXPLORE VIEW ---------- */
      case 'Explore':
        return (
          <div className="space-y-3">
            <div className="bg-[#181b1f] border border-[#2a2f3a] p-3 rounded">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400">Data source:</span>
                  <div className="flex items-center gap-1.5 px-2.5 py-1 bg-[#111217] border border-[#2a2f3a] rounded text-xs text-orange-400 font-semibold">
                    <Database size={12} /> Prometheus Production
                  </div>
                </div>
                <button
                  onClick={() => {
                    setExploreRunning(true);
                    setTimeout(() => setExploreRunning(false), 600);
                  }}
                  className="flex items-center gap-1.5 px-4 py-1.5 bg-[#3d71d9] hover:bg-[#325fc0] text-white rounded text-xs font-semibold"
                >
                  <Play size={12} /> {exploreRunning ? 'Executing...' : 'Run Query'}
                </button>
              </div>

              <div className="relative">
                <div className="absolute left-3 top-2.5 text-xs text-orange-400 font-mono font-bold">A</div>
                <input
                  value={exploreQuery}
                  onChange={(e) => setExploreQuery(e.target.value)}
                  placeholder="Enter a PromQL or LogQL query..."
                  className="w-full bg-[#111217] border border-[#2a2f3a] rounded pl-8 pr-3 py-2 text-xs font-mono text-gray-100 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex gap-2 mt-2">
                {[
                  'rate(node_cpu_seconds_total{mode="idle"}[5m])',
                  'container_memory_working_set_bytes{namespace="prod"}',
                  'sum by (pod) (rate(container_cpu_usage_seconds_total[1m]))',
                  '{namespace="prod"} |= "error"',
                ].map((q) => (
                  <button
                    key={q}
                    onClick={() => setExploreQuery(q)}
                    className="text-[11px] font-mono text-gray-400 hover:text-white bg-[#111217] border border-[#242936] px-2 py-0.5 rounded truncate max-w-[220px]"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>

            <Panel title="Query Graph Inspector" className="h-[280px]">
              <StackedChart colors={cpuColors} max={35} labels={['35', '30', '25', '20', '15']} seed={42} base={[5, 8, 4]} spikeFactor={cpuSpike} />
            </Panel>

            <Panel title="Live Query Output (Series & Values)" className="h-[220px]">
              <div className="overflow-y-auto h-full font-mono text-[11px]">
                <table className="w-full">
                  <thead>
                    <tr className="text-gray-400 border-b border-[#2a2f3a] text-left">
                      <th className="py-1">Metric Series / Labels</th>
                      <th>Value</th>
                      <th>Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {nodes.map((n) => (
                      <tr key={n.name} className="border-b border-[#20242d]">
                        <td className="py-1.5 text-indigo-300 truncate max-w-md">
                          node_cpu_seconds_total&#123;instance=&quot;{n.name}&quot;, mode=&quot;idle&quot;&#125;
                        </td>
                        <td className="text-emerald-400">{n.cpu}%</td>
                        <td className="text-gray-500">Just now</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Panel>
          </div>
        );

      /* ---------- DRILLDOWN: METRICS ---------- */
      case 'Metrics':
        return (
          <div className="space-y-3">
            <div className="grid grid-cols-12 gap-3">
              <Panel title="Cluster CPU Usage Saturation" className="col-span-6 h-[240px]">
                <StackedChart colors={cpuColors} max={35} labels={['35', '30', '25', '20', '15']} seed={7} base={[4, 6, 5]} spikeFactor={cpuSpike} />
              </Panel>
              <Panel title="Cluster Memory Consumption Over Time" className="col-span-6 h-[240px]">
                <StackedChart colors={memColors} max={144} labels={['144 GiB', '112 GiB', '80 GiB', '48 GiB', '16 GiB']} seed={11} base={[40, 55]} spikeFactor={memSpike} />
              </Panel>
            </div>
            <Panel title="Per-Node Microservice Resource Matrix" className="h-[300px]">
              <div className="overflow-y-auto h-full">
                <table className="w-full text-[11px]">
                  <thead>
                    <tr className="text-gray-400 border-b border-[#2a2f3a] text-left">
                      <th className="py-1.5">Node Hostname</th>
                      <th>CPU Load</th>
                      <th>Memory Allocation</th>
                      <th>Status</th>
                      <th>Kubelet Engine</th>
                    </tr>
                  </thead>
                  <tbody>
                    {nodes.map((n, i) => (
                      <tr key={n.name} className={i % 2 ? 'bg-[#1f2229]' : 'bg-[#15181c]'}>
                        <td className="py-2 px-1 font-mono text-gray-200">{n.name}</td>
                        <td className={n.cpu > 70 ? 'text-red-400 font-bold' : 'text-gray-300'}>{n.cpu}%</td>
                        <td className={n.memory > 75 ? 'text-orange-400 font-bold' : 'text-gray-300'}>{n.memory}%</td>
                        <td className={n.condition === 'Ready' ? 'text-emerald-400' : 'text-red-400 font-bold'}>{n.condition}</td>
                        <td className="text-gray-400 font-mono">v1.33.5-k8s</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Panel>
          </div>
        );

      /* ---------- DRILLDOWN: LOGS ---------- */
      case 'Logs':
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between bg-[#181b1f] border border-[#2a2f3a] p-2.5 rounded">
              <div className="flex items-center gap-2">
                <Terminal size={14} className="text-indigo-400" />
                <span className="text-xs font-semibold text-gray-200">Log Aggregator Stream (Loki)</span>
                <span className="text-xs text-gray-500">| {logs.length} events logged</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400">Filter Level:</span>
                {['ALL', 'CRITICAL', 'ERROR', 'WARNING', 'INFO'].map((lvl) => (
                  <button
                    key={lvl}
                    onClick={() => setLogFilterLevel(lvl)}
                    className={`text-[10px] px-2 py-0.5 rounded border transition-colors ${
                      logFilterLevel === lvl
                        ? 'bg-indigo-600 border-indigo-400 text-white'
                        : 'bg-[#111217] border-[#2a2f3a] text-gray-400 hover:text-white'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            <Panel title="Real-Time Container & Kubernetes Event Logs" className="h-[480px]">
              <div className="overflow-y-auto h-full font-mono text-[11px] space-y-1">
                {logs
                  .filter((l) => logFilterLevel === 'ALL' || l.level === logFilterLevel)
                  .slice()
                  .reverse()
                  .map((l) => (
                    <div key={l.id} className="flex items-start gap-2.5 py-1.5 px-2 rounded bg-[#13161c] border-b border-[#1f242e] hover:bg-[#1a1f2b]">
                      <span className="text-gray-500 shrink-0">{l.time}</span>
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold shrink-0 ${
                        l.level === 'CRITICAL' || l.level === 'ERROR'
                          ? 'bg-red-950 text-red-300 border border-red-800/40'
                          : l.level === 'WARNING'
                          ? 'bg-amber-950 text-amber-300 border border-amber-800/40'
                          : 'bg-blue-950 text-blue-300 border border-blue-800/40'
                      }`}>
                        {l.level}
                      </span>
                      <span className="text-indigo-300 shrink-0">[{l.service}]</span>
                      <span className="text-gray-500 text-[10px] shrink-0 font-mono">id={l.trace_id || 'sys'}</span>
                      <span className="text-gray-200 break-all">{l.message}</span>
                    </div>
                  ))}
              </div>
            </Panel>
          </div>
        );

      /* ---------- DRILLDOWN: TRACES ---------- */
      case 'Traces':
        return (
          <div className="space-y-3">
            <Panel title="OpenTelemetry Distributed Trace Waterfall" className="h-[460px]">
              <div className="space-y-3 font-mono text-xs">
                <div className="flex justify-between border-b border-[#2a2f3a] pb-2 text-gray-400">
                  <span>Trace ID: tr-98a1f89c44b20 (Duration: 242ms - 12 Spans)</span>
                  <span className="text-emerald-400">Status: 200 OK</span>
                </div>
                <div className="space-y-2">
                  <div className="p-2.5 rounded bg-[#14171d] border border-[#2a2f3a]">
                    <div className="flex justify-between text-indigo-300 mb-1">
                      <span>api-gateway: HTTP POST /v1/orders/checkout</span>
                      <span>242ms</span>
                    </div>
                    <div className="w-full bg-[#1f2430] h-3 rounded overflow-hidden">
                      <div className="bg-indigo-500 h-full w-full"></div>
                    </div>
                  </div>
                  <div className="p-2.5 rounded bg-[#14171d] border border-[#2a2f3a] ml-4">
                    <div className="flex justify-between text-blue-300 mb-1">
                      <span>auth-api: ValidateJWT & RBAC Check</span>
                      <span>18ms</span>
                    </div>
                    <div className="w-full bg-[#1f2430] h-3 rounded overflow-hidden">
                      <div className="bg-blue-500 h-full w-[15%] ml-[5%]"></div>
                    </div>
                  </div>
                  <div className="p-2.5 rounded bg-[#14171d] border border-[#2a2f3a] ml-8">
                    <div className="flex justify-between text-amber-300 mb-1">
                      <span>payment-service: ExecutePaymentTransaction</span>
                      <span>164ms</span>
                    </div>
                    <div className="w-full bg-[#1f2430] h-3 rounded overflow-hidden">
                      <div className="bg-amber-500 h-full w-[65%] ml-[22%]"></div>
                    </div>
                  </div>
                  <div className="p-2.5 rounded bg-[#14171d] border border-[#2a2f3a] ml-12">
                    <div className="flex justify-between text-emerald-300 mb-1">
                      <span>postgres-cluster: SQL INSERT INTO orders_ledger</span>
                      <span>42ms</span>
                    </div>
                    <div className="w-full bg-[#1f2430] h-3 rounded overflow-hidden">
                      <div className="bg-emerald-500 h-full w-[20%] ml-[65%]"></div>
                    </div>
                  </div>
                </div>
              </div>
            </Panel>
          </div>
        );

      /* ---------- DRILLDOWN: PROFILES ---------- */
      case 'Profiles':
        return (
          <Panel title="Continuous Profiling (Pyroscope / CPU Flame Graph)" className="h-[460px]">
            <div className="h-full flex flex-col justify-center items-center text-center p-6">
              <Activity size={40} className="text-indigo-400 mb-3" />
              <div className="text-sm font-semibold text-gray-200">Continuous CPU Profiling Active</div>
              <p className="text-xs text-gray-400 mt-1 max-w-md">
                Sampling CPU stack traces every 10ms across all cluster microservices to pinpoint execution bottlenecks and memory allocations.
              </p>
              <div className="w-full max-w-lg mt-6 space-y-1.5 font-mono text-[11px]">
                <div className="bg-red-950/60 border border-red-700/50 p-2 rounded text-red-300 flex justify-between">
                  <span>runtime.findrunnable (Kernel Scheduling)</span>
                  <span>34.2% CPU</span>
                </div>
                <div className="bg-orange-950/60 border border-orange-700/50 p-2 rounded text-orange-300 flex justify-between">
                  <span>payment-service.ProcessTransaction (DB Lock Wait)</span>
                  <span>26.8% CPU</span>
                </div>
                <div className="bg-blue-950/60 border border-blue-700/50 p-2 rounded text-blue-300 flex justify-between">
                  <span>net/http.(*conn).serve (HTTP Ingress Processing)</span>
                  <span>14.5% CPU</span>
                </div>
              </div>
            </div>
          </Panel>
        );

      /* ---------- CONNECTIONS & DATA SOURCES ---------- */
      case 'Connections':
      case 'Data sources':
      case 'Add new connection':
        return (
          <div className="space-y-3">
            <div className="flex justify-between items-center bg-[#181b1f] border border-[#2a2f3a] p-3 rounded">
              <div>
                <h3 className="text-sm font-semibold text-gray-100">Configured Data Sources</h3>
                <p className="text-xs text-gray-400">Telemetry inputs feeding the Grafana DarkAdmin dashboard</p>
              </div>
              <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#3d71d9] hover:bg-[#325fc0] text-white rounded text-xs font-semibold">
                <Plus size={13} /> Add data source
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {dataSources.map((ds) => (
                <div key={ds.id} className="bg-[#181b1f] border border-[#2a2f3a] p-3.5 rounded flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded bg-[#111217] border border-[#262b36] flex items-center justify-center text-orange-400 font-bold">
                      <Database size={18} />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-gray-100 flex items-center gap-2">
                        {ds.name} {ds.default && <span className="text-[10px] px-1.5 py-0.2 bg-blue-950 text-blue-300 rounded border border-blue-800">default</span>}
                      </div>
                      <div className="text-[11px] font-mono text-gray-400">{ds.url}</div>
                    </div>
                  </div>
                  <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800/40">
                    {ds.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        );

      /* ---------- ADMINISTRATION: USERS ---------- */
      case 'Users':
      case 'Users and access':
        return (
          <div className="space-y-3">
            <div className="flex justify-between items-center bg-[#181b1f] border border-[#2a2f3a] p-3 rounded">
              <div>
                <h3 className="text-sm font-semibold text-gray-100">User Management</h3>
                <p className="text-xs text-gray-400">Admin and team members with access to the DarkAdmin platform</p>
              </div>
              <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#3d71d9] hover:bg-[#325fc0] text-white rounded text-xs font-semibold">
                <Plus size={13} /> Invite user
              </button>
            </div>

            <Panel title="Platform Administrators & Operators" className="h-[360px]">
              <div className="overflow-y-auto h-full">
                <table className="w-full text-[12px]">
                  <thead>
                    <tr className="text-gray-400 border-b border-[#2a2f3a] text-left">
                      <th className="py-2">Name</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Last Active</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usersList.map((u) => (
                      <tr key={u.id} className="border-b border-[#20242e] hover:bg-[#1f2229]">
                        <td className="py-2.5 font-medium text-gray-200 flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-indigo-600 text-white text-[10px] font-bold flex items-center justify-center uppercase">
                            {u.name.slice(0, 2)}
                          </span>
                          {u.name}
                        </td>
                        <td className="font-mono text-gray-400 text-xs">{u.email}</td>
                        <td>
                          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#111217] border border-[#2a2f3a] text-indigo-300">
                            {u.role}
                          </span>
                        </td>
                        <td className="text-gray-400 text-xs">{u.last_active}</td>
                        <td>
                          <span className="text-emerald-400 text-xs flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> {u.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Panel>
          </div>
        );

      /* ---------- ADMINISTRATION: TEAMS ---------- */
      case 'Teams':
        return (
          <div className="space-y-3">
            <div className="flex justify-between items-center bg-[#181b1f] border border-[#2a2f3a] p-3 rounded">
              <div>
                <h3 className="text-sm font-semibold text-gray-100">Teams</h3>
                <p className="text-xs text-gray-400">Manage SRE, platform, and observability team groups</p>
              </div>
              <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#3d71d9] hover:bg-[#325fc0] text-white rounded text-xs font-semibold">
                <Plus size={13} /> New team
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {teamsList.map((t) => (
                <div key={t.id} className="bg-[#181b1f] border border-[#2a2f3a] p-3.5 rounded flex items-center justify-between">
                  <div>
                    <div className="text-xs font-semibold text-gray-100">{t.name}</div>
                    <div className="text-[11px] text-gray-400 mt-0.5">
                      {t.members} members • {t.dashboards} dashboards
                    </div>
                  </div>
                  <span className="text-[11px] px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800">
                    {t.permission}
                  </span>
                </div>
              ))}
            </div>
          </div>
        );

      /* ---------- ADMINISTRATION: PLUGINS ---------- */
      case 'Plugins':
      case 'Plugins and data':
        return (
          <div className="space-y-3">
            <div className="flex justify-between items-center bg-[#181b1f] border border-[#2a2f3a] p-3 rounded">
              <div>
                <h3 className="text-sm font-semibold text-gray-100">Installed Plugins & Integrations</h3>
                <p className="text-xs text-gray-400">Apps, panels, and data sources installed in DarkAdmin</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {pluginsList.map((p) => (
                <div key={p.id} className="bg-[#181b1f] border border-[#2a2f3a] p-3.5 rounded flex items-center justify-between">
                  <div>
                    <div className="text-xs font-semibold text-gray-100 flex items-center gap-2">
                      {p.name} <span className="text-[10px] text-gray-400 font-mono">{p.version}</span>
                    </div>
                    <div className="text-[11px] text-gray-400 mt-0.5">By {p.author} • Type: {p.type}</div>
                  </div>
                  <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800/40">
                    Installed
                  </span>
                </div>
              ))}
            </div>
          </div>
        );

      /* ---------- ADMINISTRATION: GENERAL & PREFERENCES ---------- */
      case 'General':
      case 'Default preferences':
      case 'Provisioning':
      case 'Correlations':
      case 'Service accounts':
        return (
          <div className="space-y-3">
            <Panel title={`Administration / ${activeNav}`} className="h-[400px]">
              <div className="max-w-lg space-y-4 py-2">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">Organization Name</label>
                  <input
                    defaultValue="Shared Org"
                    className="w-full bg-[#111217] border border-[#2a2f3a] rounded px-3 py-1.5 text-xs text-gray-200"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">Default Landing Dashboard</label>
                  <input
                    defaultValue="Dashboards / Cluster Overview"
                    className="w-full bg-[#111217] border border-[#2a2f3a] rounded px-3 py-1.5 text-xs text-gray-200"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">UI Color Theme</label>
                  <div className="flex gap-2">
                    <button className="px-3 py-1 bg-[#1f2430] border border-indigo-500 text-xs text-white rounded">Dark (Default)</button>
                    <button className="px-3 py-1 bg-[#111217] border border-[#2a2f3a] text-xs text-gray-400 rounded">Light</button>
                    <button className="px-3 py-1 bg-[#111217] border border-[#2a2f3a] text-xs text-gray-400 rounded">System Sync</button>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">Timezone</label>
                  <input
                    defaultValue="Browser Timezone (UTC+05:30) / Coordinated Universal Time (UTC)"
                    className="w-full bg-[#111217] border border-[#2a2f3a] rounded px-3 py-1.5 text-xs text-gray-200"
                  />
                </div>
                <button className="px-4 py-2 bg-[#3d71d9] hover:bg-[#325fc0] text-white rounded text-xs font-semibold">
                  Save Changes
                </button>
              </div>
            </Panel>
          </div>
        );

      /* ---------- PLAYLISTS & SNAPSHOTS ---------- */
      case 'Playlists':
      case 'Snapshots':
      case 'Library panels':
      case 'Bookmarks':
      case 'Production Queries':
      case 'Alert Triage':
      case 'Saved Nodes':
      case 'Starred':
      case 'Compute Resources':
      case 'Node Exporter':
        return (
          <div className="space-y-3">
            <div className="flex justify-between items-center bg-[#181b1f] border border-[#2a2f3a] p-3 rounded">
              <div>
                <h3 className="text-sm font-semibold text-gray-100">{activeNav}</h3>
                <p className="text-xs text-gray-400">Dashboards, saved query collections and telemetry snapshots</p>
              </div>
              <button
                onClick={() => setActiveNav('Dashboards')}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#3d71d9] hover:bg-[#325fc0] text-white rounded text-xs font-semibold"
              >
                <LayoutDashboard size={13} /> Open Cluster Overview
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {[
                { title: 'Cluster Overview', starred: true, tags: ['k8s', 'production', 'giantswarm'] },
                { title: 'Kubernetes / Compute Resources / Namespace', starred: true, tags: ['pods', 'cpu', 'memory'] },
                { title: 'Node Exporter / Full Cluster Telemetry', starred: true, tags: ['hardware', 'disk', 'network'] },
                { title: 'AutoDiag AI Incident Diagnosis & RCA', starred: false, tags: ['aiops', 'self-healing'] },
              ].map((d) => (
                <div key={d.title} className="bg-[#181b1f] border border-[#2a2f3a] p-3.5 rounded hover:border-indigo-500 cursor-pointer" onClick={() => setActiveNav('Dashboards')}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-gray-100">{d.title}</span>
                    <Star size={13} className={d.starred ? 'text-amber-400 fill-amber-400' : 'text-gray-500'} />
                  </div>
                  <div className="flex gap-1">
                    {d.tags.map((t) => (
                      <span key={t} className="text-[10px] px-1.5 py-0.2 rounded bg-[#111217] border border-[#2a2f3a] text-gray-400">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      /* ---------- DEFAULT: DASHBOARDS (THE 100% EXACT CLUSTER OVERVIEW GRAFANA SCREENSHOT) ---------- */
      case 'Dashboards':
      case 'Home':
      default:
        return (
          <>
            {/* Grid matching 100% of Screenshot 1 */}
            <div className="grid grid-cols-12 gap-2">
              {/* Row 1: Cluster Info (4) | CPU Usage (2) | CPU Usage over time (6) */}
              <Panel title="Cluster Info" className="col-span-12 md:col-span-4 h-[230px]">
                <div className="flex items-center h-full gap-5">
                  <svg viewBox="0 0 100 100" className="w-28 h-28 shrink-0">
                    <polygon points="50,3 90,22 100,65 72,98 28,98 0,65 10,22" fill="#326ce5" />
                    <g stroke="white" strokeWidth="4" strokeLinecap="round" fill="none">
                      <circle cx="50" cy="52" r="20" />
                      {[0, 51.4, 102.8, 154.2, 205.6, 257, 308.4].map((a) => (
                        <line key={a} x1="50" y1="52" x2={50 + 28 * Math.cos((a * Math.PI) / 180)} y2={52 + 28 * Math.sin((a * Math.PI) / 180)} />
                      ))}
                    </g>
                    <circle cx="50" cy="52" r="6" fill="#326ce5" stroke="white" strokeWidth="3" />
                  </svg>
                  <div className="text-[12.5px] leading-6">
                    <div><b>Clustername:</b> <b>{selectedCluster.name}</b></div>
                    <div><b>K8S Version:</b> <b>{selectedCluster.k8s}</b></div>
                    <hr className="border-gray-600 my-1 w-40" />
                    <div>Owner: <b>{selectedCluster.owner}</b></div>
                    <div>Installation: <b>{selectedCluster.name}</b></div>
                    <div>Region: <b>{selectedCluster.region}</b></div>
                    <div>Service Priority: <b>highest</b></div>
                  </div>
                </div>
              </Panel>

              <Panel title="CPU Usage" className="col-span-6 md:col-span-2 h-[230px]">
                <Gauge value={metrics.cpu_usage} />
              </Panel>

              <Panel title="CPU Usage over time" className="col-span-12 md:col-span-6 h-[230px]">
                <div className="flex h-full gap-2">
                  <div className="flex-1 min-w-0">
                    <StackedChart colors={cpuColors} max={35} labels={['35', '30', '25', '20', '15']} seed={7} base={[4, 6, 5]} spikeFactor={cpuSpike} />
                  </div>
                  <ul className="text-[10px] text-gray-300 space-y-1 w-40 overflow-hidden">
                    {legendFixed.map((l, i) => (
                      <li key={l} className="flex items-center gap-1.5 truncate">
                        <span className="w-3 h-0.5 shrink-0" style={{ background: lc[i] }} />
                        {l}
                      </li>
                    ))}
                  </ul>
                </div>
              </Panel>

              {/* Row 2: Node Status (2) | Healthy (1) | Unhealthy (1) | Memory Usage (2) | Memory Usage over Time (6) */}
              <Panel title="Node Status" className="col-span-6 md:col-span-2 h-[185px]">
                <div className="grid grid-cols-4 gap-x-3 gap-y-3 place-items-center h-full py-1">
                  {Array.from({ length: 16 }).map((_, i) => {
                    const isUnhealthy = i >= metrics.healthy_nodes;
                    return (
                      <span
                        key={i}
                        title={isUnhealthy ? 'Node Degraded / NotReady' : 'Node Ready'}
                        className={`w-3.5 h-3.5 rounded-full ${isUnhealthy ? 'bg-[#f2495c] animate-pulse' : 'bg-[#73bf69]'}`}
                      />
                    );
                  })}
                </div>
              </Panel>

              <Panel title="He..." info className="col-span-3 md:col-span-1 h-[185px]">
                <div className="h-full flex items-center justify-center text-5xl text-gray-100 font-medium">
                  {metrics.healthy_nodes}
                </div>
              </Panel>

              <Panel title="Un..." info className="col-span-3 md:col-span-1 h-[185px]">
                <div className={`h-full flex items-center justify-center text-5xl font-medium ${
                  metrics.unhealthy_nodes > 0 ? 'text-[#f2495c]' : 'text-gray-100'
                }`}>
                  {metrics.unhealthy_nodes}
                </div>
              </Panel>

              <Panel title="Memory Usage" className="col-span-6 md:col-span-2 h-[185px]">
                <Gauge value={metrics.memory_usage} />
              </Panel>

              <Panel title="Memory Usage over Time" className="col-span-12 md:col-span-6 h-[185px]">
                <div className="flex h-full gap-2">
                  <div className="flex-1 min-w-0">
                    <StackedChart
                      colors={memColors}
                      max={144}
                      labels={['144 GiB', '112 GiB', '80 GiB', '48 GiB', '16 GiB']}
                      seed={11}
                      base={[40, 55]}
                      spikeFactor={memSpike}
                    />
                  </div>
                  <ul className="text-[10px] text-gray-300 space-y-1 w-40 overflow-hidden">
                    {legendFixed.map((l, i) => (
                      <li key={l} className="flex items-center gap-1.5 truncate">
                        <span className="w-3 h-0.5 shrink-0" style={{ background: lc[i] }} />
                        {l}
                      </li>
                    ))}
                  </ul>
                </div>
              </Panel>

              {/* Row 3: Node Overview (4) | Middle Stack: Active Alerts + API Avail + Firing Alerts (4) | Change Log (4) */}
              <Panel title="Node Overview" className="col-span-12 md:col-span-4 h-[255px]">
                <div className="overflow-y-auto h-full">
                  <table className="w-full text-[11px]">
                    <thead>
                      <tr className="text-gray-300 text-left border-b border-[#2a2f3a]">
                        <th className="py-1 font-semibold">Node</th>
                        <th className="font-semibold">CPU</th>
                        <th className="font-semibold">Memory</th>
                        <th className="font-semibold">condition</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredNodes.map((n, i) => (
                        <tr key={n.name} className={i % 2 ? 'bg-[#1f2229]' : 'bg-[#15181c]'}>
                          <td className="py-[5px] px-1 truncate max-w-[140px]">{n.name}</td>
                          <td className={n.cpu > 75 ? 'text-[#f2495c] font-bold' : ''}>{n.cpu}%</td>
                          <td className={n.memory > 80 ? 'text-[#ff9830] font-bold' : ''}>{n.memory}%</td>
                          <td className={n.condition === 'Ready' ? 'text-[#73bf69]' : 'text-[#f2495c] font-bold'}>
                            {n.condition}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Panel>

              <div className="col-span-12 md:col-span-4 grid grid-cols-2 gap-2 h-[255px]">
                <Panel title="Currently Active Ale..." className="col-span-1 h-[115px]">
                  <div className={`h-full flex items-center justify-center text-5xl font-medium ${
                    alerts.length > 0 ? 'text-[#ff9830]' : 'text-[#73bf69]'
                  }`}>
                    {alerts.length}
                  </div>
                </Panel>

                <Panel title="API Server Avai..." info className="col-span-1 h-[115px]">
                  <div className="h-full flex items-center justify-center text-3xl text-gray-100 font-medium">
                    {overview.cluster.api_availability}<span className="text-xl">%</span>
                  </div>
                </Panel>

                <Panel
                  title="Currently Firing Alerts"
                  className="col-span-2 h-[132px]"
                  action={
                    alerts.length > 0 && (
                      <button
                        onClick={() => onHeal(alerts[0].id)}
                        disabled={busyAction}
                        className="text-[10px] px-2 py-0.5 rounded bg-emerald-600/30 hover:bg-emerald-600/50 border border-emerald-500/50 text-emerald-200"
                      >
                        Heal Alert
                      </button>
                    )
                  }
                >
                  <div className="overflow-y-auto h-full">
                    <table className="w-full text-[11px]">
                      <thead>
                        <tr className="text-gray-300 text-left border-b border-[#2a2f3a]">
                          <th className="py-1"><span className="inline-flex items-center gap-1">alertname <Filter size={9} /></span></th>
                          <th><span className="inline-flex items-center gap-1">severity <Filter size={9} /></span></th>
                          <th><span className="inline-flex items-center gap-1">team <Filter size={9} /></span></th>
                          <th className="text-right">action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {alerts.length === 0 ? (
                          <tr>
                            <td colSpan={4} className="py-3 text-center text-emerald-400">
                              All microservices healthy — 0 firing alerts
                            </td>
                          </tr>
                        ) : (
                          alerts.map((a) => (
                            <tr
                              key={a.id}
                              onClick={() => setSelectedIncident(a)}
                              className="bg-[#15181c] hover:bg-[#222733] cursor-pointer border-b border-[#222630]"
                            >
                              <td className="py-1.5 text-[#6e9fff] font-mono truncate max-w-[140px]">{a.alertname}</td>
                              <td className="text-[#6e9fff] font-mono">{a.severity}</td>
                              <td className="text-[#6e9fff] font-mono">{a.team}</td>
                              <td className="text-right">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onHeal(a.id);
                                  }}
                                  className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-600/40 hover:bg-indigo-600 text-white"
                                >
                                  Heal
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </Panel>
              </div>

              <Panel title="Change Log" info className="col-span-12 md:col-span-4 h-[255px]">
                <div className="space-y-3 text-[12px] overflow-y-auto h-full pr-1">
                  {changelog.map((item, idx) => (
                    <div key={idx} className="border-b border-[#242934] pb-2 last:border-b-0">
                      <div className="text-gray-500 text-[11px]">{item.date}</div>
                      <div className="text-[#6e9fff] text-[14px] font-medium">{item.title}</div>
                      <p className="text-gray-300 mt-0.5 leading-snug text-[11.5px]">{item.description}</p>
                    </div>
                  ))}
                </div>
              </Panel>

              {/* Row 4: AI Incident Detection & Self-Healing Engine */}
              <Panel
                title="AI Incident Detection & Root Cause Diagnosis"
                info
                className="col-span-12 md:col-span-7 min-h-[220px]"
                action={
                  <label className="flex items-center gap-1.5 text-[11px] text-gray-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={overview.auto_heal_enabled}
                      onChange={(e) => onToggleAutoHeal(e.target.checked)}
                      className="accent-emerald-500"
                    />
                    Autonomous Self-Healing
                  </label>
                }
              >
                {alerts.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center py-6 text-gray-400">
                    <CheckCircle2 size={26} className="text-emerald-400 mb-2" />
                    <div className="text-sm font-semibold text-gray-200">No Active Anomalies Detected</div>
                    <div className="text-xs text-gray-500 mt-1">
                      Use the &ldquo;Inject Fault&rdquo; buttons above to simulate Pod Crash, High CPU Spike, Memory Leak, or Network Delay.
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2 overflow-y-auto max-h-[180px] pr-1">
                    {(selectedIncident ? [selectedIncident] : alerts).map((inc) => (
                      <div key={inc.id} className="p-2.5 rounded bg-[#14171c] border border-[#2c3342] text-xs space-y-1.5">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="px-1.5 py-0.5 rounded bg-red-950 text-red-300 border border-red-700/50 font-mono text-[10px]">
                              {inc.id}
                            </span>
                            <span className="font-semibold text-white">{inc.alertname}</span>
                            <span className="text-gray-400">on pod</span>
                            <code className="text-indigo-300">{inc.pod}</code>
                          </div>
                          <span className="text-[11px] text-amber-300 font-mono">
                            Anomaly Score: {(inc.anomaly_score * 100).toFixed(0)}%
                          </span>
                        </div>
                        <div className="text-gray-300">
                          <b className="text-gray-400">1. Telemetry Symptom:</b> {inc.symptom}
                        </div>
                        <div className="text-indigo-200">
                          <b className="text-indigo-400">2. Root Cause:</b> {inc.root_cause}
                        </div>
                        <div className="flex items-center justify-between pt-1 border-t border-[#232936]">
                          <div className="text-emerald-300 truncate mr-2">
                            <b>3. Remediation Action:</b> {inc.recommended_action}{' '}
                            <code className="text-[10px] text-gray-400">({inc.k8s_api_call})</code>
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0">
                            {selectedIncident && (
                              <button
                                onClick={() => setSelectedIncident(null)}
                                className="px-2 py-1 rounded bg-[#232834] text-gray-300 text-[11px]"
                              >
                                Show All
                              </button>
                            )}
                            <button
                              onClick={() => onHeal(inc.id)}
                              disabled={busyAction}
                              className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-[11px] flex items-center gap-1"
                            >
                              <Play size={10} /> Execute K8s Action
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Panel>

              <Panel title="AIOps Engine Metrics & Audit Trail" info className="col-span-12 md:col-span-5 min-h-[220px]">
                <div className="grid grid-cols-4 gap-1.5 mb-2.5 text-center">
                  <div className="bg-[#14171c] border border-[#262b36] rounded p-1.5">
                    <div className="text-[10px] text-gray-400">Accuracy</div>
                    <div className="text-sm font-bold text-emerald-400">{modelEval.accuracy}%</div>
                  </div>
                  <div className="bg-[#14171c] border border-[#262b36] rounded p-1.5">
                    <div className="text-[10px] text-gray-400">F1-Score</div>
                    <div className="text-sm font-bold text-indigo-400">{modelEval.f1_score}%</div>
                  </div>
                  <div className="bg-[#14171c] border border-[#262b36] rounded p-1.5">
                    <div className="text-[10px] text-gray-400">MTTR</div>
                    <div className="text-sm font-bold text-amber-300">{modelEval.avg_recovery_time_sec}s</div>
                  </div>
                  <div className="bg-[#14171c] border border-[#262b36] rounded p-1.5">
                    <div className="text-[10px] text-gray-400">Downtime Cut</div>
                    <div className="text-sm font-bold text-emerald-300">-{modelEval.downtime_reduction_pct}%</div>
                  </div>
                </div>
                <div className="text-[11px] text-gray-400 mb-1 font-semibold">Recent K8s API Self-Healing Actions:</div>
                <div className="space-y-1.5 overflow-y-auto max-h-[110px] text-[11px]">
                  {healingHistory.map((h) => (
                    <div key={h.id} className="bg-[#14171c] border border-[#242a35] rounded px-2 py-1.5 flex items-center justify-between">
                      <div className="truncate pr-2">
                        <span className="text-emerald-400 font-mono mr-1.5">[{h.timestamp}]</span>
                        <b className="text-gray-200">{h.service}:</b> <span className="text-gray-400">{h.action}</span>
                      </div>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-700/40 shrink-0">
                        {h.recovery_time_sec}s
                      </span>
                    </div>
                  ))}
                </div>
              </Panel>
            </div>
          </>
        );
    }
  };

  return (
    <div className="h-screen flex flex-col bg-[#111217] text-gray-200 text-[13px] overflow-hidden">
      {/* Toast banner */}
      {toast && (
        <div className="fixed bottom-4 right-4 z-50 bg-[#1f2637] border border-indigo-500/60 text-gray-100 px-4 py-2.5 rounded-lg shadow-2xl flex items-center gap-2 text-xs">
          <Zap size={14} className="text-indigo-400 shrink-0" />
          <span>{toast}</span>
        </div>
      )}

      {/* Top bar (100% exact to Grafana screenshot) */}
      <div className="flex items-center h-10 border-b border-[#2a2f3a] bg-[#111217] shrink-0">
        <div
          onClick={() => setActiveNav('Dashboards')}
          className="w-[178px] px-3 flex items-center gap-2 border-r border-[#2a2f3a] h-full cursor-pointer hover:bg-[#1a1c22]"
        >
          <span className="w-4 h-4 rounded bg-orange-500 flex items-center justify-center text-[10px] font-bold text-black">G</span>
          <span className="text-gray-200 font-medium truncate">Shared Org</span>
          <ChevronDown size={12} className="ml-auto text-gray-400" />
        </div>
        <PanelLeft
          size={15}
          className="mx-3 text-gray-400 cursor-pointer hover:text-white"
          onClick={() => setActiveNav('Dashboards')}
        />
        <div className="text-gray-400 truncate text-xs">
          Home <span className="mx-1">›</span> Dashboards <span className="mx-1">›</span>{' '}
          <span className="text-gray-100 font-medium cursor-pointer" onClick={() => setActiveNav('Dashboards')}>
            Cluster Overview
          </span>
          {activeNav !== 'Dashboards' && activeNav !== 'Home' && (
            <>
              <span className="mx-1">›</span>
              <span className="text-indigo-400 font-medium">{activeNav}</span>
            </>
          )}
        </div>
        <div className="ml-auto flex items-center gap-2.5 pr-3">
          <div className="flex items-center gap-2 bg-[#111217] border border-[#2a2f3a] rounded px-2 py-1 w-52 text-gray-400 focus-within:border-indigo-500">
            <Search size={12} />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search..."
              className="bg-transparent text-xs text-gray-200 placeholder-gray-500 focus:outline-none w-full"
            />
            <span className="text-[10px] text-gray-500">⌘+k</span>
          </div>
          <span className={`flex items-center gap-1.5 text-xs px-2 py-0.5 rounded border ${
            backendStatus === 'Active'
              ? 'border-green-700/50 bg-green-950/40 text-green-400'
              : 'border-amber-700/50 bg-amber-950/40 text-amber-300'
          }`}>
            <span className={`h-2 w-2 rounded-full ${backendStatus === 'Active' ? 'bg-green-500 animate-pulse' : 'bg-amber-400'}`} />
            {backendStatus === 'Active' ? 'API Active' : 'API Offline'}
          </span>
          <Bell size={14} className="text-gray-400 hover:text-white cursor-pointer" onClick={() => setActiveNav('Explore')} />
          <HelpCircle size={14} className="text-gray-400 hover:text-white cursor-pointer" onClick={() => setActiveNav('General')} />
          <button
            onClick={onLogout}
            title={`Sign out (${user?.email || 'admin@darkadmin.io'})`}
            className="flex items-center gap-1 text-gray-400 hover:text-red-400 px-1.5 py-1 rounded hover:bg-[#1f2229]"
          >
            <LogOut size={14} />
          </button>
          <span
            title={user?.email || 'admin@darkadmin.io'}
            className="w-6 h-6 rounded-full bg-indigo-600 text-white text-[10px] font-bold flex items-center justify-center uppercase cursor-pointer"
            onClick={() => setActiveNav('Users')}
          >
            {(user?.email || 'AD').slice(0, 2)}
          </span>
        </div>
      </div>

      <div className="flex flex-1 min-h-0">
        {/* Left Sidebar with all working tabs */}
        <aside className="w-[178px] shrink-0 border-r border-[#2a2f3a] bg-[#111217] overflow-y-auto py-1">
          {nav.map((n) => {
            const isActive = activeNav === n.label || (n.label === 'Dashboards' && ['Dashboards', 'Home'].includes(activeNav));
            return (
              <div key={n.label}>
                <button
                  onClick={() => {
                    setActiveNav(n.label);
                    if (n.children) setOpen({ ...open, [n.label]: !open[n.label] });
                  }}
                  className={`relative w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-[#1f2229] transition-colors ${
                    isActive ? 'bg-[#1f2229] text-white' : 'text-gray-300'
                  }`}
                >
                  {isActive && <span className="absolute left-0 top-0 bottom-0 w-[3px] bg-orange-500" />}
                  <n.icon size={14} />
                  <span className="flex-1 truncate">{n.label}</span>
                  {n.chev && (open[n.label] ? <ChevronUp size={12} /> : <ChevronDown size={12} />)}
                </button>
                {n.children && open[n.label] && n.children.map((c) => (
                  <div
                    key={c}
                    onClick={() => setActiveNav(c)}
                    className={`py-1.5 pr-3 cursor-pointer hover:text-white transition-colors truncate ${
                      activeNav === c ? 'text-orange-400 font-semibold' : 'text-gray-400'
                    } ${indentSub.includes(c) ? 'pl-12' : 'pl-10'} ${
                      ['General', 'Plugins and data', 'Users and access'].includes(c) ? 'flex items-center' : ''
                    }`}
                  >
                    {c}
                    {['General', 'Plugins and data', 'Users and access'].includes(c) && <ChevronUp size={12} className="ml-auto" />}
                  </div>
                ))}
              </div>
            );
          })}
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 min-w-0 overflow-y-auto p-3">
          {/* Sub-header action buttons matching Grafana screenshot */}
          <div className="flex items-center justify-between mb-2 pb-2 border-b border-[#222630]">
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <span className="text-gray-100 font-semibold">Cluster Overview</span>
              <span>•</span>
              <span className="text-gray-400">{selectedCluster.name}</span>
              <span>•</span>
              <span className="text-indigo-400">{user?.email || 'admin@darkadmin.io'}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => onSimulate('high_cpu')}
                disabled={busyAction}
                className="flex items-center gap-1 bg-[#1e2433] hover:bg-[#283147] border border-[#384464] text-blue-300 rounded px-2.5 py-1 text-xs"
              >
                Add <ChevronDown size={11} />
              </button>
              <button
                onClick={() => setActiveNav('General')}
                className="bg-[#181b1f] hover:bg-[#22262c] border border-[#2a2f3a] text-gray-200 rounded px-2.5 py-1 text-xs"
              >
                Settings
              </button>
              <button
                onClick={() => setActiveNav('Dashboards')}
                className="bg-[#181b1f] hover:bg-[#22262c] border border-[#2a2f3a] text-gray-200 rounded px-2.5 py-1 text-xs"
              >
                Exit edit
              </button>
              <button
                onClick={onHealAll}
                disabled={busyAction || alerts.length === 0}
                className="flex items-center gap-1 bg-[#3d71d9] hover:bg-[#325fc0] disabled:opacity-50 text-white rounded px-2.5 py-1 text-xs font-medium"
              >
                Save dashboard <ChevronDown size={11} />
              </button>
            </div>
          </div>

          {/* Toolbar: Cluster selector, Fault Injections, Time Picker, Refresh */}
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative flex items-center border border-[#2a2f3a] rounded bg-[#111217]">
                <span className="px-2 py-1 border-r border-[#2a2f3a] text-gray-400 text-xs bg-[#1f2229] flex items-center gap-1">
                  cluster <Info size={10} />
                </span>
                <button
                  onClick={() => setClusterMenuOpen(!clusterMenuOpen)}
                  className="px-3 py-1 flex items-center gap-4 text-gray-100 hover:bg-[#1f2229]"
                >
                  {selectedCluster.name} <ChevronDown size={12} />
                </button>
                {clusterMenuOpen && (
                  <div className="absolute top-full left-0 mt-1 w-48 bg-[#181b1f] border border-[#2a2f3a] rounded shadow-xl z-30">
                    {CLUSTERS.map((c) => (
                      <button
                        key={c.name}
                        onClick={() => {
                          setSelectedCluster(c);
                          setClusterMenuOpen(false);
                        }}
                        className="w-full text-left px-3 py-1.5 text-xs hover:bg-[#252a33] flex justify-between"
                      >
                        <span>{c.name}</span>
                        <span className="text-gray-500">{c.region}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Fast Fault Simulation & Self-Healing triggers */}
              <div className="flex items-center gap-1 bg-[#181b1f] border border-[#2a2f3a] rounded px-2 py-1">
                <span className="text-[11px] text-gray-400 mr-1 flex items-center gap-1">
                  <BrainCircuit size={12} className="text-indigo-400" /> Inject Fault:
                </span>
                {[
                  { id: 'high_cpu', label: 'High CPU' },
                  { id: 'service_crash', label: 'Pod Crash' },
                  { id: 'memory_leak', label: 'Memory OOM' },
                  { id: 'network_delay', label: 'Net Delay' },
                ].map((sc) => (
                  <button
                    key={sc.id}
                    onClick={() => onSimulate(sc.id)}
                    disabled={busyAction}
                    className="px-2 py-0.5 rounded bg-[#232834] hover:bg-red-950/70 hover:text-red-300 hover:border-red-700/60 border border-[#2f3646] text-[11px] text-gray-200 transition-colors"
                  >
                    + {sc.label}
                  </button>
                ))}
                <button
                  onClick={onHealAll}
                  disabled={busyAction || alerts.length === 0}
                  className="ml-1 px-2.5 py-0.5 rounded bg-emerald-600/25 hover:bg-emerald-600/40 border border-emerald-500/50 text-emerald-300 text-[11px] font-semibold disabled:opacity-40 flex items-center gap-1"
                >
                  <ShieldCheck size={12} /> Auto-Heal ({alerts.length})
                </button>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <div className="relative flex items-center gap-1.5 border border-[#2a2f3a] rounded px-2 py-1 mr-1 bg-[#181b1f]">
                <ChevronLeft size={13} className="cursor-pointer hover:text-white" />
                <Clock size={12} />
                <button onClick={() => setTimeMenuOpen(!timeMenuOpen)} className="flex items-center gap-1">
                  {timeRange} <ChevronDown size={11} />
                </button>
                <ChevronRight size={13} className="cursor-pointer hover:text-white" />
                <ZoomOut size={13} className="cursor-pointer hover:text-white ml-1" />
                {timeMenuOpen && (
                  <div className="absolute top-full right-0 mt-1 w-40 bg-[#181b1f] border border-[#2a2f3a] rounded shadow-xl z-30">
                    {TIME_RANGES.map((t) => (
                      <button
                        key={t}
                        onClick={() => {
                          setTimeRange(t);
                          setTimeMenuOpen(false);
                        }}
                        className="w-full text-left px-3 py-1.5 text-xs hover:bg-[#252a33]"
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <button
                onClick={onRefresh}
                className="flex items-center gap-1 border border-[#2a2f3a] bg-[#181b1f] hover:bg-[#22262e] rounded px-2.5 py-1"
              >
                <RefreshCw size={12} className={busyAction ? 'animate-spin' : ''} /> Refresh <ChevronDown size={11} />
              </button>
            </div>
          </div>

          {/* Dynamic Content View based on active left-sidebar tab */}
          {renderContent()}
        </main>
      </div>
    </div>
  );
}
