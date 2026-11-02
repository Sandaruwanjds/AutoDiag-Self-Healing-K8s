import React, { useState } from 'react';
import { LineChart, Eye, EyeOff, Gauge, GitBranch, Users } from 'lucide-react';

const features = [
  { icon: Gauge, label: 'Real-time\nAnalytics' },
  { icon: GitBranch, label: 'Project\nTracking' },
  { icon: Users, label: 'User\nManagement' },
];

export default function Login({ onLogin }) {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState('admin@darkadmin.io');
  const [password, setPassword] = useState('admin123');
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await onLogin(email || 'admin@darkadmin.io', password || 'admin123');
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex bg-[#070b14] text-gray-100 font-sans selection:bg-indigo-500 selection:text-white">
      {/* Left hero (100% exact layout to DarkAdmin screenshot) */}
      <div className="hidden lg:flex w-1/2 bg-[#060913] relative items-center justify-center overflow-hidden border-r border-[#151c2e]">
        {/* Subtle decorative vector circuit background */}
        <svg
          className="absolute inset-0 w-full h-full opacity-25 pointer-events-none"
          viewBox="0 0 650 700"
          fill="none"
          stroke="#4f5b75"
          strokeWidth="1.2"
        >
          {/* Hexagon & node structures */}
          <polygon points="140,160 200,125 260,160 260,230 200,265 140,230" />
          <line x1="200" y1="125" x2="200" y2="265" stroke="#374151" />
          <circle cx="430" cy="140" r="14" stroke="#6366f1" />
          <circle cx="430" cy="140" r="4" fill="#6366f1" />
          <polygon points="500,230 530,190 560,230 530,270" />
          {/* Curved glowing connection traces */}
          <path d="M80 430 C 220 320, 280 520, 560 380" stroke="#6366f1" strokeOpacity="0.4" />
          <path d="M60 480 C 200 390, 320 580, 580 430" stroke="#4f5b75" />
          <path d="M40 540 C 210 490, 360 620, 590 500" stroke="#818cf8" strokeOpacity="0.3" />
          <polygon points="60,540 80,510 100,540" />
          <rect x="490" y="420" width="30" height="30" transform="rotate(45 505 435)" stroke="#6366f1" />
          {/* Connected dots */}
          <circle cx="140" cy="160" r="3" fill="#818cf8" />
          <circle cx="260" cy="230" r="3" fill="#818cf8" />
          <circle cx="530" cy="270" r="3" fill="#818cf8" />
          <circle cx="505" cy="435" r="3" fill="#818cf8" />
        </svg>

        <div className="relative z-10 max-w-lg text-center px-8">
          {/* Logo */}
          <div className="flex items-center justify-center gap-3 mb-5">
            <div className="p-1.5 rounded-lg bg-indigo-950/60 border border-indigo-500/30">
              <LineChart className="text-indigo-400" size={28} />
            </div>
            <span className="text-3xl font-bold tracking-tight text-white">DarkAdmin</span>
          </div>

          {/* Heading */}
          <h2 className="text-2xl font-bold text-white mb-3 tracking-wide">
            Monitor. Manage. Control.
          </h2>

          {/* Body */}
          <p className="text-[13px] text-gray-400 leading-relaxed mb-9 max-w-md mx-auto">
            One unified platform to help your team monitor performance metrics, manage complex projects, and control user access — all from a single powerful dashboard.
          </p>

          {/* 3 Action / Feature Cards */}
          <div className="flex justify-center gap-3.5">
            {features.map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="w-28 h-24 rounded-xl bg-[#0e1526]/80 border border-[#1e293f] flex flex-col items-center justify-center gap-2.5 p-2 shadow-lg backdrop-blur-sm"
              >
                <div className="w-8 h-8 rounded-lg bg-indigo-950/50 flex items-center justify-center border border-indigo-500/20">
                  <Icon size={17} className="text-indigo-400" />
                </div>
                <span className="text-[11px] font-medium text-gray-200 leading-tight text-center whitespace-pre-line">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right form pane (100% exact to screenshot) */}
      <div className="w-full lg:w-1/2 bg-[#090e1a] flex flex-col items-center justify-center p-6 sm:p-10">
        <form
          onSubmit={submit}
          className="w-full max-w-[420px] bg-[#101728] border border-[#1d263b] rounded-2xl p-8 sm:p-9 shadow-2xl"
        >
          <h1 className="text-2xl font-bold text-white tracking-tight">Welcome back</h1>
          <p className="text-xs text-gray-400 mt-1 mb-6">Sign in to your dashboard account</p>

          {/* Email Address */}
          <div className="mb-4">
            <label className="block text-xs font-semibold text-gray-300 mb-1.5">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              required
              className="w-full px-3.5 py-3 rounded-lg bg-[#0a0f1d] border border-[#222e47] text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
            />
          </div>

          {/* Password */}
          <div className="mb-4">
            <label className="block text-xs font-semibold text-gray-300 mb-1.5">Password</label>
            <div className="relative">
              <input
                type={show ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                className="w-full px-3.5 py-3 pr-10 rounded-lg bg-[#0a0f1d] border border-[#222e47] text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
              />
              <button
                type="button"
                onClick={() => setShow(!show)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200 transition-colors"
              >
                {show ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Remember me & Forgot password */}
          <div className="flex items-center justify-between text-xs mb-5">
            <label className="flex items-center gap-2 text-gray-300 cursor-pointer select-none">
              <input
                type="checkbox"
                defaultChecked
                className="w-4 h-4 rounded bg-[#0a0f1d] border-[#222e47] accent-indigo-600 focus:ring-0"
              />
              <span>Remember me</span>
            </label>
            <a
              href="#forgot"
              onClick={(e) => {
                e.preventDefault();
                setEmail('admin@darkadmin.io');
                setPassword('admin123');
              }}
              className="font-medium text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              Forgot password?
            </a>
          </div>

          {/* Sign In Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-lg bg-[#6366f1] hover:bg-[#5457ed] active:bg-[#4a4de6] text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition-all disabled:opacity-60"
          >
            {loading ? 'Signing in...' : 'Sign In to Dashboard'}
          </button>

          {/* Divider */}
          <div className="relative flex py-5 items-center">
            <div className="flex-grow border-t border-[#1d273d]"></div>
          </div>

          {/* Social Sign-In Icons */}
          <div className="flex justify-center gap-3">
            <button
              type="button"
              onClick={() => onLogin('admin@darkadmin.io', 'admin123')}
              title="Sign in with Google"
              className="w-11 h-11 rounded-lg bg-[#0a0f1d] border border-[#1f2a42] hover:border-indigo-500 flex items-center justify-center font-bold text-gray-200 text-sm hover:bg-[#121a2f] transition-all"
            >
              G
            </button>
            <button
              type="button"
              onClick={() => onLogin('admin@darkadmin.io', 'admin123')}
              title="Sign in with GitHub"
              className="w-11 h-11 rounded-lg bg-[#0a0f1d] border border-[#1f2a42] hover:border-indigo-500 flex items-center justify-center text-gray-200 hover:bg-[#121a2f] transition-all"
            >
              <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor">
                <path d="M8 0a8 8 0 0 0-2.5 15.6c.4.1.5-.2.5-.4v-1.4c-2.2.5-2.7-1-2.7-1-.4-.9-.9-1.2-.9-1.2-.7-.5.1-.5.1-.5.8.1 1.2.8 1.2.8.7 1.2 1.9.9 2.3.7.1-.5.3-.9.5-1.1-1.8-.2-3.6-.9-3.6-4 0-.9.3-1.6.8-2.1-.1-.2-.4-1 .1-2.1 0 0 .7-.2 2.2.8a7.6 7.6 0 0 1 4 0c1.5-1 2.2-.8 2.2-.8.4 1.1.2 1.9.1 2.1.5.6.8 1.3.8 2.1 0 3.1-1.9 3.8-3.6 4 .3.3.6.8.6 1.5v2.2c0 .2.1.5.6.4A8 8 0 0 0 8 0z" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => onLogin('admin@darkadmin.io', 'admin123')}
              title="Sign in with Microsoft"
              className="w-11 h-11 rounded-lg bg-[#0a0f1d] border border-[#1f2a42] hover:border-indigo-500 flex items-center justify-center hover:bg-[#121a2f] transition-all"
            >
              <svg viewBox="0 0 16 16" width="15" height="15">
                <path fill="#f25022" d="M0 0h7.5v7.5H0z" />
                <path fill="#7fba00" d="M8.5 0H16v7.5H8.5z" />
                <path fill="#00a4ef" d="M0 8.5h7.5V16H0z" />
                <path fill="#ff9830" d="M8.5 8.5H16V16H8.5z" />
              </svg>
            </button>
          </div>
        </form>

        {/* Footer link */}
        <p className="w-full max-w-[420px] text-center mt-5 text-xs text-gray-400">
          Don't have an account?{' '}
          <a
            href="#create"
            onClick={(e) => {
              e.preventDefault();
              onLogin('admin@darkadmin.io', 'admin123');
            }}
            className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
          >
            Create one now
          </a>
        </p>
      </div>
    </div>
  );
}
