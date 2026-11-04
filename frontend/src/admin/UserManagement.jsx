import React from 'react';

const users = [
  {
    initials: 'CL',
    name: 'Cluster Administrator',
    email: 'admin@darkadmin.io',
    role: 'Organization Admin',
    lastActive: 'Just now',
    status: 'Active',
    bg: 'bg-indigo-600',
  },
  {
    initials: 'SE',
    name: 'Senior SRE Lead',
    email: 'sre-lead@darkadmin.io',
    role: 'Cluster Editor',
    lastActive: '14m ago',
    status: 'Active',
    bg: 'bg-blue-600',
  },
  {
    initials: 'PL',
    name: 'Platform Operator',
    email: 'platform-ops@darkadmin.io',
    role: 'Viewer',
    lastActive: '2h ago',
    status: 'Active',
    bg: 'bg-indigo-600',
  },
  {
    initials: 'K8',
    name: 'K8s Automated Controller',
    email: 'k8s-agent@system.local',
    role: 'Service Account',
    lastActive: 'Continuous',
    status: 'Active',
    bg: 'bg-blue-700',
  },
];

export default function UserManagement() {
  return (
    <div className="bg-[#121319] text-gray-200 min-h-screen p-8 text-sm font-sans">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-base font-semibold text-gray-100">User Management</h1>
          <p className="text-xs text-gray-400 mt-0.5">
            Admin and team members with access to the DarkAdmin platform
          </p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded text-xs font-medium flex items-center gap-1 transition">
          <span className="text-base leading-none">+</span> Invite user
        </button>
      </div>

      {/* Subheader */}
      <h2 className="text-xs font-semibold text-gray-300 mb-4 flex items-center gap-1">
        Platform Administrators & Operators
        <span className="text-xs text-gray-500">↗</span>
      </h2>

      {/* User Table */}
      <div className="border-t border-b border-gray-800">
        <div className="grid grid-cols-12 text-xs font-semibold text-gray-400 py-2 border-b border-gray-800">
          <div className="col-span-3">Name</div>
          <div className="col-span-3">Email</div>
          <div className="col-span-2">Role</div>
          <div className="col-span-2">Last Active</div>
          <div className="col-span-2">Status</div>
        </div>

        {users.map((u, idx) => (
          <div
            key={idx}
            className="grid grid-cols-12 items-center py-3 text-xs border-b border-gray-800/60 last:border-b-0 hover:bg-[#181920]/50 transition"
          >
            {/* Avatar & Name */}
            <div className="col-span-3 flex items-center gap-2.5">
              <span
                className={`w-6 h-6 rounded-full text-[10px] font-bold text-white flex items-center justify-center ${u.bg}`}
              >
                {u.initials}
              </span>
              <span className="font-semibold text-gray-100">{u.name}</span>
            </div>

            {/* Email */}
            <div className="col-span-3 text-gray-400 font-mono text-[11px]">
              {u.email}
            </div>

            {/* Role Badge */}
            <div className="col-span-2">
              <span className="bg-[#181920] border border-gray-800 text-gray-300 px-2 py-0.5 rounded text-[11px] font-medium">
                {u.role}
              </span>
            </div>

            {/* Last Active */}
            <div className="col-span-2 text-gray-400">{u.lastActive}</div>

            {/* Status */}
            <div className="col-span-2 flex items-center gap-1.5 text-emerald-400 text-[11px]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block"></span>
              {u.status}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}