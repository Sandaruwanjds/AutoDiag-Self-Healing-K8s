import React, { useState } from 'react';
import { 
  Activity, Cpu, ShieldCheck, Eye, EyeOff, 
  Mail, Lock, User, ArrowRight, Sparkles, Key, AlertCircle
} from 'lucide-react';

export default function Auth({ onLoginSuccess }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');

  // Form input states (Initially empty)
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('Senior SRE Lead');

  // Switch to Sign Up: Resets all inputs so Sign Up is 100% clean
  const handleSwitchToSignUp = () => {
    setIsSignUp(true);
    setName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setError('');
  };

  // Switch to Login: Resets fields
  const handleSwitchToLogin = () => {
    setIsSignUp(false);
    setName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setError('');
  };

  // 1-Click Demo Fill: Fills the page inputs with admin@darkadmin.io and admin123
  const handleFillDemoAdmin = () => {
    setEmail('admin@darkadmin.io');
    setPassword('admin123');
    setError('');
  };

  // Submit to Dashboard (Only proceeds AFTER fields are filled!)
  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (isSignUp) {
      if (!name.trim()) {
        setError('Please enter your full name');
        return;
      }
      if (!email.trim()) {
        setError('Please enter your email address');
        return;
      }
      if (!password) {
        setError('Please enter a password');
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match');
        return;
      }

      onLoginSuccess({
        name: name.trim(),
        email: email.trim(),
        role: role
      });
    } else {
      // Must NOT auto move if empty! Validates that email and password are typed or demo-filled
      if (!email.trim() || !password) {
        setError('Please enter your email and password, or click "Demo Admin" above to fill credentials.');
        return;
      }

      onLoginSuccess({
        name: email.trim() === 'admin@darkadmin.io' ? 'Cluster Administrator' : email.split('@')[0],
        email: email.trim(),
        role: 'Organization Admin'
      });
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-[#060913] text-gray-100 font-sans selection:bg-indigo-500 selection:text-white overflow-hidden">
      
      {/* LEFT SIDE: HERO PRESENTATION */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-12 lg:p-16 border-r border-[#151c2e] overflow-hidden bg-gradient-to-b from-[#060913] via-[#090e1c] to-[#060913]">
        <div className="relative z-10 flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 border border-white/20">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          <div>
            <span className="text-lg font-bold tracking-wider text-white">ORACL</span>
            <span className="ml-2 text-xs font-mono text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800">
              v2.4 AIOps
            </span>
          </div>
        </div>

        <div className="relative z-10 my-auto text-center max-w-lg mx-auto">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-indigo-950/80 border border-indigo-700/60 text-indigo-300 text-xs font-medium mb-6">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span>Autonomous Cloud-Native Resiliency</span>
          </div>

          <h1 className="text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight">
            Detect. Diagnose. Self-Heal.
          </h1>

          <p className="mt-4 text-sm text-gray-400 leading-relaxed max-w-md mx-auto">
            One unified AIOps platform to continuously monitor Kubernetes telemetry, diagnose complex microservice incidents with AI, and trigger self-healing — all from a single powerful dashboard.
          </p>

          <div className="grid grid-cols-3 gap-3 mt-10">
            <div className="p-3.5 rounded-xl bg-[#0d1424]/90 border border-[#1b253b]">
              <div className="w-8 h-8 rounded-lg bg-cyan-950/80 text-cyan-400 flex items-center justify-center mx-auto mb-2 border border-cyan-800/60">
                <Activity className="w-4 h-4" />
              </div>
              <div className="text-xs font-semibold text-gray-200">Real-time</div>
              <div className="text-[11px] text-gray-400">Telemetry</div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#0d1424]/90 border border-[#1b253b]">
              <div className="w-8 h-8 rounded-lg bg-indigo-950/80 text-indigo-400 flex items-center justify-center mx-auto mb-2 border border-indigo-800/60">
                <Cpu className="w-4 h-4" />
              </div>
              <div className="text-xs font-semibold text-gray-200">AI Root Cause</div>
              <div className="text-[11px] text-gray-400">Diagnosis</div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#0d1424]/90 border border-[#1b253b]">
              <div className="w-8 h-8 rounded-lg bg-emerald-950/80 text-emerald-400 flex items-center justify-center mx-auto mb-2 border border-emerald-800/60">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div className="text-xs font-semibold text-gray-200">Autonomous</div>
              <div className="text-[11px] text-gray-400">Self-Healing</div>
            </div>
          </div>
        </div>

        <div className="relative z-10 flex items-center justify-between text-xs text-gray-500 pt-6 border-t border-[#151c2e]">
          <span>Open University of Sri Lanka (OUSL)</span>
          <span>BSE Final Project • Group 34</span>
        </div>
      </div>

      {/* RIGHT SIDE: LOGIN / SIGNUP CARD */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative bg-[#070b14]">
        <div className="w-full max-w-md bg-[#0e1526]/95 border border-[#1c263d] rounded-2xl p-8 sm:p-10 shadow-2xl backdrop-blur-xl relative z-10">
          
          {/* Card Header */}
          <div className="text-left mb-6 flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white tracking-tight">
                {isSignUp ? 'Create your account' : 'Welcome back'}
              </h2>
              <p className="text-xs text-gray-400 mt-1">
                {isSignUp 
                  ? 'Join your cloud observability and SRE cluster team'
                  : 'Sign in to your cluster management dashboard'}
              </p>
            </div>

            {/* CLICK TO AUTO-FILL CREDENTIALS */}
            {!isSignUp && (
              <button
                type="button"
                onClick={handleFillDemoAdmin}
                className="text-[11px] px-3 py-1.5 rounded-lg bg-indigo-950 border border-indigo-700/60 text-indigo-300 hover:bg-indigo-900 transition flex items-center space-x-1 cursor-pointer shadow-sm"
                title="Click to fill admin@darkadmin.io and admin123"
              >
                <Key className="w-3 h-3 text-cyan-400" />
                <span className="font-semibold">Demo Admin</span>
              </button>
            )}
          </div>

          {/* Error Banner (Displays when empty) */}
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-950/70 border border-red-800 text-red-300 text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
            
            {/* SIGN UP ONLY: Full Name */}
            {isSignUp && (
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3.5 top-3 text-gray-500" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => { setName(e.target.value); setError(''); }}
                    placeholder="e.g. Supun Sandaruwan"
                    autoComplete="off"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#090e1a] border border-[#212d47] text-sm text-gray-100 placeholder-gray-600 focus:outline-none focus:border-indigo-500 transition"
                  />
                </div>
              </div>
            )}

            {/* Email Address */}
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-3 text-gray-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(''); }}
                  placeholder={isSignUp ? "yourname@ousl.lk" : "admin@darkadmin.io"}
                  autoComplete="off"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#090e1a] border border-[#212d47] text-sm text-gray-100 placeholder-gray-600 focus:outline-none focus:border-indigo-500 transition font-mono"
                />
              </div>
            </div>

            {/* SIGN UP ONLY: Role Selector */}
            {isSignUp && (
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1.5">
                  Cluster Role
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#090e1a] border border-[#212d47] text-sm text-gray-200 focus:outline-none focus:border-indigo-500 transition"
                >
                  <option value="Senior SRE Lead">Senior SRE Lead</option>
                  <option value="DevOps & Cloud Engineer">DevOps & Cloud Engineer</option>
                  <option value="AI/ML Engineer">AI/ML Engineer</option>
                  <option value="Cluster Administrator">Cluster Administrator</option>
                </select>
              </div>
            )}

            {/* Password */}
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-3 text-gray-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(''); }}
                  placeholder="••••••••"
                  autoComplete={isSignUp ? "new-password" : "current-password"}
                  className="w-full pl-10 pr-11 py-2.5 rounded-xl bg-[#090e1a] border border-[#212d47] text-sm text-gray-100 placeholder-gray-600 focus:outline-none focus:border-indigo-500 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3 text-gray-500 hover:text-gray-300 transition"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* SIGN UP ONLY: Confirm Password */}
            {isSignUp && (
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1.5">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-3 text-gray-500" />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => { setConfirmPassword(e.target.value); setError(''); }}
                    placeholder="••••••••"
                    autoComplete="new-password"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#090e1a] border border-[#212d47] text-sm text-gray-100 placeholder-gray-600 focus:outline-none focus:border-indigo-500 transition"
                  />
                </div>
              </div>
            )}

            {/* Remember Me */}
            {!isSignUp && (
              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center space-x-2 cursor-pointer text-gray-400">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-[#212d47] bg-[#090e1a] text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                  />
                  <span>Remember me</span>
                </label>
                <span className="text-indigo-400 hover:underline cursor-pointer">Forgot password?</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-2.5 mt-2 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-lg shadow-indigo-600/30 flex items-center justify-center space-x-2 cursor-pointer transition transform active:scale-[0.99]"
            >
              <span>{isSignUp ? 'Create Dashboard Account' : 'Sign In to Dashboard'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Social Demo Fill Buttons */}
          <div className="mt-6">
            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-[#1e293b]"></div>
              <span className="flex-shrink mx-3 text-[11px] uppercase tracking-wider text-gray-500 font-mono">
                or fill demo credentials
              </span>
              <div className="flex-grow border-t border-[#1e293b]"></div>
            </div>

            <div className="grid grid-cols-3 gap-2 mt-3">
              <button
                type="button"
                onClick={() => {
                  setEmail('google.sre@ousl.lk');
                  setPassword('admin123');
                  setError('');
                }}
                className="py-2 px-3 rounded-lg bg-[#090e1a] border border-[#1e293b] hover:border-gray-600 text-xs text-gray-300 flex items-center justify-center space-x-1.5 transition cursor-pointer"
                title="Fill Google Demo Account"
              >
                <span className="font-bold text-red-400">G</span>
                <span>Google</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setEmail('github.devops@ousl.lk');
                  setPassword('admin123');
                  setError('');
                }}
                className="py-2 px-3 rounded-lg bg-[#090e1a] border border-[#1e293b] hover:border-gray-600 text-xs text-gray-300 flex items-center justify-center space-x-1.5 transition cursor-pointer"
                title="Fill GitHub Demo Account"
              >
                <span>🐙 GitHub</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setEmail('admin@darkadmin.io');
                  setPassword('admin123');
                  setError('');
                }}
                className="py-2 px-3 rounded-lg bg-[#090e1a] border border-[#1e293b] hover:border-gray-600 text-xs text-gray-300 flex items-center justify-center space-x-1.5 transition cursor-pointer"
                title="Fill Admin Account"
              >
                <span className="font-bold text-blue-400">⊞</span>
                <span>MSFT</span>
              </button>
            </div>
          </div>

          <div className="mt-6 text-center text-xs text-gray-400">
            {isSignUp ? (
              <span>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={handleSwitchToLogin}
                  className="font-semibold text-indigo-400 hover:underline ml-1 cursor-pointer"
                >
                  Sign in
                </button>
              </span>
            ) : (
              <span>
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={handleSwitchToSignUp}
                  className="font-semibold text-indigo-400 hover:underline ml-1 cursor-pointer"
                >
                  Create one now
                </button>
              </span>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
