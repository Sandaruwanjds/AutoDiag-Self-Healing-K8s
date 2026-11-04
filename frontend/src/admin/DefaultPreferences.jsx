import React, { useState } from 'react';

export default function DefaultPreferences() {
  const [theme, setTheme] = useState('dark');
  const [orgName, setOrgName] = useState('Shared Org');
  const [landingDashboard, setLandingDashboard] = useState('Dashboards / Cluster Overview');
  const [timezone, setTimezone] = useState('Browser Timezone (UTC+05:30) / Coordinated Universal Time (UTC)');

  return (
    <div className="bg-[#121319] text-gray-200 min-h-screen p-8 text-sm font-sans">
      <div className="max-w-4xl">
        <h1 className="text-base font-semibold mb-6 flex items-center gap-1.5 text-gray-100">
          Administration / Default preferences
          <span className="text-xs text-gray-400">↗</span>
        </h1>

        <form onSubmit={(e) => e.preventDefault()} className="space-y-5">
          {/* Organization Name */}
          <div>
            <label className="block text-xs font-medium mb-1 text-gray-300">
              Organization Name
            </label>
            <input
              type="text"
              value={orgName}
              onChange={(e) => setOrgName(e.target.value)}
              className="w-[#380px] max-w-full bg-[#181920] border border-gray-800 rounded px-3 py-1.5 text-gray-200 focus:outline-none focus:border-blue-500 text-sm"
            />
          </div>

          {/* Default Landing Dashboard */}
          <div>
            <label className="block text-xs font-medium mb-1 text-gray-300">
              Default Landing Dashboard
            </label>
            <input
              type="text"
              value={landingDashboard}
              onChange={(e) => setLandingDashboard(e.target.value)}
              className="w-[#380px] max-w-full bg-[#181920] border border-gray-800 rounded px-3 py-1.5 text-gray-200 focus:outline-none focus:border-blue-500 text-sm"
            />
          </div>

          {/* UI Color Theme */}
          <div>
            <label className="block text-xs font-medium mb-1.5 text-gray-300">
              UI Color Theme
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setTheme('dark')}
                className={`px-3 py-1 rounded text-xs border ${
                  theme === 'dark'
                    ? 'border-indigo-500 text-white bg-[#181920]'
                    : 'border-gray-800 text-gray-400 hover:text-white'
                }`}
              >
                Dark (Default)
              </button>
              <button
                type="button"
                onClick={() => setTheme('light')}
                className={`px-3 py-1 rounded text-xs border ${
                  theme === 'light'
                    ? 'border-indigo-500 text-white bg-[#181920]'
                    : 'border-gray-800 text-gray-400 hover:text-white'
                }`}
              >
                Light
              </button>
              <button
                type="button"
                onClick={() => setTheme('system')}
                className={`px-3 py-1 rounded text-xs border ${
                  theme === 'system'
                    ? 'border-indigo-500 text-white bg-[#181920]'
                    : 'border-gray-800 text-gray-400 hover:text-white'
                }`}
              >
                System Sync
              </button>
            </div>
          </div>

          {/* Timezone */}
          <div>
            <label className="block text-xs font-medium mb-1 text-gray-300">
              Timezone
            </label>
            <input
              type="text"
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              className="w-[#380px] max-w-full bg-[#181920] border border-gray-800 rounded px-3 py-1.5 text-gray-200 focus:outline-none focus:border-blue-500 text-sm"
            />
          </div>

          {/* Save Button */}
          <div className="pt-2">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded text-sm font-medium transition"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}