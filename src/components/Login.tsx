import React, { useState, useEffect } from 'react';
import { User } from '../types';
import { Lock, User as UserIcon, ArrowRight, Shield, Zap, LayoutDashboard } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { mockApi } from '../services/mockApi';

interface LoginProps {
  onLogin: (user: User) => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isAdminMode, setIsAdminMode] = useState(false);

  // Clear inputs when switching modes
  useEffect(() => {
    setUsername('');
    setPassword('');
    setError('');
  }, [isAdminMode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const users = await mockApi.getUsers();
      const normalizedInputUser = username.trim().toLowerCase();
      const normalizedInputPass = password.trim().toLowerCase();
      const user = users.find(u => u.username.toLowerCase() === normalizedInputUser && normalizedInputUser === normalizedInputPass); 
      
      if (user) {
        // Enforce role check if in Admin mode
        if (isAdminMode && user.role !== 'Admin') {
          setError('Access Denied: Admin privileges required.');
        } else {
          onLogin(user);
        }
      } else {
        setError('Invalid username or password');
      }
    } catch (err) {
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-6 font-sans relative overflow-hidden transition-colors duration-700 ${isAdminMode ? 'bg-slate-950' : 'bg-slate-50'}`}>
      {/* Decorative Gradients for Normal Mode */}
      <AnimatePresence>
        {!isAdminMode && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 pointer-events-none">
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[120px]" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-emerald-500/10 rounded-full blur-[120px]" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Decorative Gradients for Admin Mode */}
      <AnimatePresence>
        {isAdminMode && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 pointer-events-none">
            <div className="absolute top-[-20%] left-1/4 w-[70%] h-[60%] bg-indigo-600/20 rounded-full blur-[150px] animate-pulse" style={{ animationDuration: '4s' }} />
            <div className="absolute bottom-[-10%] right-1/4 w-[60%] h-[50%] bg-emerald-500/10 rounded-full blur-[150px]" />
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 mix-blend-overlay"></div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <div className="w-full max-w-md relative z-10 flex flex-col items-center">
        {/* Mode Switcher */}
        <div className="mb-8 p-1.5 bg-slate-200/50 dark:bg-slate-800/50 backdrop-blur-md rounded-2xl flex gap-2">
          <button 
            onClick={() => setIsAdminMode(false)}
            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${!isAdminMode ? 'bg-white text-slate-900 shadow-md' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'}`}
          >
            User Portal
          </button>
          <button 
            onClick={() => setIsAdminMode(true)}
            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${isAdminMode ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'}`}
          >
            <Shield size={16} /> Admin
          </button>
        </div>

        <motion.div 
          key={isAdminMode ? 'admin' : 'normal'}
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className={`w-full backdrop-blur-xl rounded-[2.5rem] p-8 sm:p-12 border ${
            isAdminMode 
              ? 'bg-slate-900/60 border-indigo-500/30 shadow-[0_0_50px_-12px_rgba(79,70,229,0.3)] text-white' 
              : 'bg-white/80 border-white/40 shadow-2xl shadow-slate-200/50 text-slate-900'
          }`}
        >
          <div className="text-center mb-10">
            <div className={`w-20 h-20 mx-auto mb-6 flex items-center justify-center rounded-2xl shadow-lg border ${
              isAdminMode ? 'bg-slate-800/80 border-indigo-500/50 shadow-indigo-500/20' : 'bg-white border-slate-100 shadow-slate-200/50'
            }`}>
              {isAdminMode ? (
                <Zap className="text-indigo-400" size={32} />
              ) : (
                <LayoutDashboard className="text-blue-500" size={32} />
              )}
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight mb-3">
              {isAdminMode ? (
                <span className="bg-gradient-to-r from-indigo-400 to-emerald-400 bg-clip-text text-transparent">Nexus Admin</span>
              ) : 'KPR HUB'}
            </h1>
            <p className={`text-sm font-medium ${isAdminMode ? 'text-slate-400' : 'text-slate-500'}`}>
              {isAdminMode ? 'Elevated Command Interface' : 'Event & Inventory Management'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className={`block text-xs font-bold uppercase tracking-widest mb-3 ${isAdminMode ? 'text-indigo-300/70' : 'text-slate-400'}`}>Username</label>
              <div className="relative group">
                <UserIcon className={`absolute left-5 top-1/2 -translate-y-1/2 transition-colors ${isAdminMode ? 'text-slate-500 group-focus-within:text-indigo-400' : 'text-slate-300 group-focus-within:text-blue-500'}`} size={20} />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className={`w-full pl-14 pr-6 py-4 border rounded-2xl outline-none transition-all font-medium ${
                    isAdminMode 
                      ? 'bg-slate-950/50 border-slate-800 focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10 text-white placeholder-slate-600' 
                      : 'bg-slate-50 border-slate-200 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 text-slate-900 placeholder-slate-400'
                  }`}
                  placeholder="Enter your username"
                  required
                />
              </div>
            </div>

            <div>
              <label className={`block text-xs font-bold uppercase tracking-widest mb-3 ${isAdminMode ? 'text-indigo-300/70' : 'text-slate-400'}`}>Password</label>
              <div className="relative group">
                <Lock className={`absolute left-5 top-1/2 -translate-y-1/2 transition-colors ${isAdminMode ? 'text-slate-500 group-focus-within:text-emerald-400' : 'text-slate-300 group-focus-within:text-emerald-500'}`} size={20} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full pl-14 pr-6 py-4 border rounded-2xl outline-none transition-all font-medium ${
                    isAdminMode 
                      ? 'bg-slate-950/50 border-slate-800 focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/10 text-white placeholder-slate-600' 
                      : 'bg-slate-50 border-slate-200 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 text-slate-900 placeholder-slate-400'
                  }`}
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <AnimatePresence>
              {error && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }} 
                  animate={{ opacity: 1, height: 'auto' }} 
                  exit={{ opacity: 0, height: 0 }}
                  className={`overflow-hidden rounded-2xl ${isAdminMode ? 'bg-red-950/50 border border-red-900' : 'bg-red-50 border border-red-100'}`}
                >
                  <div className={`p-4 text-sm text-center font-bold ${isAdminMode ? 'text-red-400' : 'text-red-600'}`}>
                    {error}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-5 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all disabled:opacity-50 active:scale-[0.98] mt-4 ${
                isAdminMode 
                  ? 'bg-gradient-to-r from-indigo-600 to-emerald-600 text-white shadow-xl shadow-indigo-600/20 hover:shadow-indigo-600/40 border border-indigo-500/50' 
                  : 'bg-gradient-to-r from-black via-emerald-600 to-blue-600 text-white shadow-xl shadow-blue-600/20 hover:opacity-90'
              }`}
            >
              {loading ? 'Authenticating...' : (isAdminMode ? 'Initialize Session' : 'Sign In')}
              {!loading && <ArrowRight size={20} />}
            </button>
          </form>

          <div className={`mt-10 pt-8 border-t text-center ${isAdminMode ? 'border-slate-800' : 'border-slate-100'}`}>
            <p className={`text-[10px] uppercase tracking-widest font-bold mb-4 ${isAdminMode ? 'text-slate-500' : 'text-slate-400'}`}>Democredentials</p>
            <div className={`grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono font-medium ${isAdminMode ? 'text-slate-400' : 'text-slate-500'}`}>
              <div className={`p-2 rounded-lg ${isAdminMode ? 'bg-slate-800/50 border border-slate-700/50' : 'bg-slate-50'}`}>admin / admin</div>
              <div className={`p-2 rounded-lg ${isAdminMode ? 'bg-slate-800/50 border border-slate-700/50' : 'bg-slate-50'}`}>student / student</div>
              <div className={`p-2 rounded-lg ${isAdminMode ? 'bg-slate-800/50 border border-slate-700/50' : 'bg-slate-50'}`}>it / it</div>
              <div className={`p-2 rounded-lg ${isAdminMode ? 'bg-slate-800/50 border border-slate-700/50' : 'bg-slate-50'}`}>reception / reception</div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
