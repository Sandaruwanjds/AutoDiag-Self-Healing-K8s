import React, { useState, useEffect } from 'react';

export default function App() {
  const [systemStatus, setSystemStatus] = useState("Checking...");
  const [logs, setLogs] = useState([
    { id: 1, service: "auth-api", level: "INFO", message: "Pod started successfully on node-1", time: "10:42:01" },
    { id: 2, service: "payment-svc", level: "WARNING", message: "High CPU usage detected (88%)", time: "10:42:15" },
    { id: 3, service: "ai-engine", level: "CRITICAL", message: "OOMKilled event on pod payment-svc-5b86", time: "10:42:30" }
  ]);

  useEffect(() => {
    // Backend API එක සමඟ සම්බන්ධ වීමට පරීක්ෂාව
    fetch("http://127.0.0.1:8000/")
      .then(res => res.json())
      .then(data => setSystemStatus(data.status))
      .catch(err => setSystemStatus("Offline"));
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-6 font-sans">
      {/* Header */}
      <header className="flex justify-between items-center mb-8 border-b border-gray-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-wide text-indigo-400">AutoDiag Self-Healing K8s</h1>
          <p className="text-sm text-gray-400">AI-Assisted Incident Detection & Remediation Dashboard</p>
        </div>
        <div className="flex items-center space-x-2 bg-gray-800 px-4 py-2 rounded-full border border-gray-700">
          <span className={`h-3 w-3 rounded-full ${systemStatus === 'Active' ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></span>
          <span className="text-sm font-medium">Backend: {systemStatus}</span>
        </div>
      </header>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gray-800 p-5 rounded-xl border border-gray-700 shadow-lg">
          <h3 className="text-sm text-gray-400 font-medium">Active Pods</h3>
          <p className="text-3xl font-bold text-white mt-2">18 / 20</p>
        </div>
        <div className="bg-gray-800 p-5 rounded-xl border border-gray-700 shadow-lg">
          <h3 className="text-sm text-gray-400 font-medium">Detected Incidents</h3>
          <p className="text-3xl font-bold text-yellow-400 mt-2">3</p>
        </div>
        <div className="bg-gray-800 p-5 rounded-xl border border-gray-700 shadow-lg">
          <h3 className="text-sm text-gray-400 font-medium">Self-Healing Actions</h3>
          <p className="text-3xl font-bold text-green-400 mt-2">12</p>
        </div>
        <div className="bg-gray-800 p-5 rounded-xl border border-gray-700 shadow-lg">
          <h3 className="text-sm text-gray-400 font-medium">AI Model Status</h3>
          <p className="text-3xl font-bold text-indigo-400 mt-2">Ready</p>
        </div>
      </div>

      {/* Live Logs & Incidents Section */}
      <div className="bg-gray-800 rounded-xl border border-gray-700 p-6 shadow-lg">
        <h2 className="text-lg font-semibold mb-4 text-gray-200">Live Telemetry & Incident Logs</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-700 text-gray-400 text-sm">
                <th className="py-3 px-4">Time</th>
                <th className="py-3 px-4">Service</th>
                <th className="py-3 px-4">Level</th>
                <th className="py-3 px-4">Message</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700 text-sm">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-750">
                  <td className="py-3 px-4 text-gray-400">{log.time}</td>
                  <td className="py-3 px-4 font-medium text-indigo-300">{log.service}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      log.level === 'CRITICAL' ? 'bg-red-900 text-red-300' :
                      log.level === 'WARNING' ? 'bg-yellow-900 text-yellow-300' :
                      'bg-blue-900 text-blue-300'
                    }`}>
                      {log.level}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-300">{log.message}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}