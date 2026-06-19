import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ShieldAlert, Mail, Lock, User, Plus, Smile, KeyRound, Sparkles } from 'lucide-react';

interface AuthViewProps {
  onLoginSuccess: (user: { name: string; email: string; teamId: string; role: string; profilePic?: string; joinedDate: string }) => void;
  onBypass: () => void;
}

export default function AuthView({ onLoginSuccess, onBypass }: AuthViewProps) {
  const [authMode, setAuthMode] = useState<'login' | 'register' | 'forgot'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [selectedTeam, setSelectedTeam] = useState('RAMPUR');
  const [selectedRole, setSelectedRole] = useState('All-Rounder');
  
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!email || !password) {
      setErrorMsg('Please specify all email and password parameters.');
      return;
    }

    // Check if user exists in custom local accounts
    const savedAccounts = localStorage.getItem('apna_cricket_users');
    let accounts = savedAccounts ? JSON.parse(savedAccounts) : [];

    // Fallback seed admin user
    if (email === 'admin@apnacricket.com' && password === 'admin123') {
      const adminUser = {
        name: 'Ramesh "Captain" Kumar',
        email: 'admin@apnacricket.com',
        teamId: 'RAMPUR',
        role: 'Captain / Administrator',
        joinedDate: 'Jun 2026'
      };
      onLoginSuccess(adminUser);
      return;
    }

    const matched = accounts.find((acc: any) => acc.email.toLowerCase() === email.toLowerCase());
    if (matched) {
      onLoginSuccess(matched);
    } else {
      // Simulate successful auto-registration or login since we do not mock external services negatively
      const defaultUser = {
        name: email.split('@')[0].toUpperCase(),
        email: email,
        teamId: 'MALGUDI',
        role: 'Local Representative',
        joinedDate: 'Jun 2026'
      };
      onLoginSuccess(defaultUser);
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!email || !password || !name) {
      setErrorMsg('Ensure Name, Email, and Password values are fully specified.');
      return;
    }

    const savedAccounts = localStorage.getItem('apna_cricket_users');
    let accounts = savedAccounts ? JSON.parse(savedAccounts) : [];

    if (accounts.some((acc: any) => acc.email.toLowerCase() === email.toLowerCase())) {
      setErrorMsg('This email identifier has already registered an active profile.');
      return;
    }

    const newUser = {
      name,
      email,
      teamId: selectedTeam,
      role: selectedRole,
      joinedDate: 'Jun 2026'
    };

    accounts.push(newUser);
    localStorage.setItem('apna_cricket_users', JSON.stringify(accounts));
    
    setSuccessMsg('Account registered successfully! Automatic logon incoming...');
    setTimeout(() => {
      onLoginSuccess(newUser);
    }, 1200);
  };

  const handleForgot = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    
    if (!email) {
      setErrorMsg('Provide your identifier email address.');
      return;
    }

    setSuccessMsg('A security recovery pin has been dispatched to your local cell and email inbox. Simulate default password reset.');
  };

  return (
    <div className="max-w-md mx-auto w-full my-8 p-8 bg-black/40 border border-white/10 rounded-2xl relative overflow-hidden shadow-2xl" id="auth-panel-wrapper">
      <div className="absolute top-0 right-0 h-32 w-32 bg-[#ccff00]/5 rounded-full blur-2xl pointer-events-none" />

      {/* Header icon */}
      <div className="flex flex-col items-center text-center space-y-3 mb-8">
        <div className="h-14 w-14 rounded-2xl bg-[#ccff00]/10 border border-[#ccff00]/25 flex items-center justify-center text-3xl">
          🔑
        </div>
        <div>
          <h2 className="font-display text-2xl font-black text-white uppercase tracking-tight">
            {authMode === 'login' ? 'MEMBERS AREA LOGON' : authMode === 'register' ? 'CREATE VILLAGE PROFILE' : 'RECOVER CRICKET PASSPORT'}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Access secure player rosters, tournament tools, and team setups.
          </p>
        </div>
      </div>

      {errorMsg && (
        <div className="mb-4 bg-red-950/40 text-red-400 border border-red-900/40 p-3 rounded-lg text-xs font-mono">
          🚨 {errorMsg}
        </div>
      )}

      {successMsg && (
        <div className="mb-4 bg-emerald-950/40 text-[#ccff00] border border-[#ccff00]/25 p-3 rounded-lg text-xs font-mono">
          🎉 {successMsg}
        </div>
      )}

      {authMode === 'login' && (
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase text-slate-300 tracking-wider">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="e.g. kiran@villageleagues.com"
                className="w-full bg-black border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs focus:outline-none focus:border-[#ccff00] text-white"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-[10px] font-black uppercase text-slate-300 tracking-wider">Access PIN Code</label>
              <button
                type="button"
                onClick={() => setAuthMode('forgot')}
                className="text-[10px] text-slate-450 uppercase tracking-wider font-extrabold hover:text-[#ccff00]"
              >
                Forgot PIN?
              </button>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter safety passcode"
                className="w-full bg-black border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs focus:outline-none focus:border-[#ccff00] text-white"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-[#ccff00] text-[#061a12] font-black uppercase tracking-widest text-xs rounded-xl shadow-lg hover:bg-white border hover:border-[#ccff00] transition-colors"
          >
            SIGN IN NOW
          </button>

          <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs">
            <span className="text-slate-450">No sports credentials?</span>
            <button
              type="button"
              onClick={() => setAuthMode('register')}
              className="text-[#ccff00] font-black uppercase"
            >
              Sign Up
            </button>
          </div>
        </form>
      )}

      {authMode === 'register' && (
        <form onSubmit={handleRegister} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase text-slate-300 tracking-wider">Player / Rep Name</label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. Ramesh 'Sixer' Kumar"
                className="w-full bg-black border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs focus:outline-none focus:border-[#ccff00] text-white"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase text-slate-300 tracking-wider">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="e.g. ramesh@gmail.com"
                className="w-full bg-black border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs focus:outline-none focus:border-[#ccff00] text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase text-slate-300 tracking-wider">Favored Team</label>
              <select
                value={selectedTeam}
                onChange={e => setSelectedTeam(e.target.value)}
                className="w-full bg-black border border-white/10 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-[#ccff00] text-white"
              >
                <option value="RAMPUR">Rampur Warriors</option>
                <option value="MALGUDI">Malgudi Stars</option>
                <option value="DANGAL">Dangal Kings</option>
                <option value="GULLY">Gully Raiders</option>
              </select>
            </div>
            
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase text-slate-300 tracking-wider">Default Role</label>
              <select
                value={selectedRole}
                onChange={e => setSelectedRole(e.target.value)}
                className="w-full bg-black border border-white/10 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-[#ccff00] text-white"
              >
                <option value="Batsman">Batsman</option>
                <option value="Bowler">Bowler</option>
                <option value="All-Rounder">All-Rounder</option>
                <option value="Wicket-Keeper">Wicket-Keeper</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase text-slate-300 tracking-wider">Set Lock Passcode</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Choose security PIN"
                className="w-full bg-black border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs focus:outline-none focus:border-[#ccff00] text-white"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-[#ccff00] text-[#061a12] font-black uppercase tracking-widest text-xs rounded-xl shadow-lg hover:bg-white border hover:border-[#ccff00] transition-colors"
          >
            REGISTER NEW ACCOUNT
          </button>

          <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs">
            <span className="text-slate-450">Already have a passport?</span>
            <button
              type="button"
              onClick={() => setAuthMode('login')}
              className="text-[#ccff00] font-black uppercase"
            >
              Sign In
            </button>
          </div>
        </form>
      )}

      {authMode === 'forgot' && (
        <form onSubmit={handleForgot} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase text-slate-300 tracking-wider">Recovery Email ID</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Give Registered Registered Email"
                className="w-full bg-black border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs focus:outline-none focus:border-[#ccff00] text-[#ccff00]"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-[#ccff00] text-[#061a12] font-black uppercase tracking-widest text-xs rounded-xl shadow-lg hover:bg-white border hover:border-[#ccff00]"
          >
            TRANSMIT RECOVERY PIN
          </button>

          <div className="pt-4 border-t border-white/15 flex items-center justify-center">
            <button
              type="button"
              onClick={() => setAuthMode('login')}
              className="text-xs text-slate-400 font-extrabold uppercase hover:text-white"
            >
              Cancel and login
            </button>
          </div>
        </form>
      )}

      <div className="mt-6 pt-5 border-t border-[#ccff00]/10 text-center">
        <button
          onClick={onBypass}
          className="text-[11px] font-bold tracking-widest uppercase text-[#ccff00]/70 hover:text-[#ccff00] underline underline-offset-4"
        >
          ⚡ Quick Skip / View public scoreboard as Guest
        </button>
      </div>
    </div>
  );
}
