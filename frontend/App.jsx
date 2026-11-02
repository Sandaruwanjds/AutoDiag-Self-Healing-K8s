import React from 'react';

function App() {
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', textAlign: 'center', marginTop: '50px' }}>
      <h1>AutoDiag Self-Healing K8s</h1>
      <p style={{ color: '#555' }}>AI-Assisted Incident Detection & Self-Healing Dashboard</p>
      <div style={{ padding: '20px', background: '#f4f4f4', display: 'inline-block', borderRadius: '8px' }}>
        <h3>System Status: Monitoring Active 🟢</h3>
        <p>Waiting for telemetry data from Kubernetes cluster...</p>
      </div>
    </div>
  );
}

export default App;