import React, { useState } from 'react';
import { 
  Lock, 
  Mail, 
  User, 
  ArrowRight, 
  ShieldCheck, 
  Car, 
  Building2, 
  Sparkles, 
  CheckCircle2,
  ChevronLeft
} from 'lucide-react';
import { useParking } from '../../context/ParkingContext';
import { UserRole } from '../../types';

export const AuthPage: React.FC = () => {
  const { authMode, setAuthMode, setCurrentRole, setCurrentView, showToast } = useParking();

  const [email, setEmail] = useState('driver@parksmart.city');
  const [password, setPassword] = useState('password123');
  const [name, setName] = useState('Rahul Sharma');
  const [role, setRole] = useState<UserRole>('driver');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (authMode === 'forgot-password') {
      showToast(`Password reset link dispatched to ${email}`);
      setAuthMode('login');
      return;
    }

    setCurrentRole(role);
    if (role === 'city-operator') {
      setCurrentView('admin');
      showToast(`Signed in as City Operator (${email})`);
    } else {
      setCurrentView('driver');
      showToast(`Signed in as Driver (${email})`);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Back to Home Button */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md px-4 mb-4">
        <button
          onClick={() => setCurrentView('landing')}
          className="text-xs font-mono text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Landing Page</span>
        </button>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md px-4">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-slate-950 font-bold text-2xl mx-auto shadow-lg shadow-cyan-500/25">
            P
          </div>
          <h2 className="font-display text-3xl font-extrabold text-white tracking-tight">
            {authMode === 'login' ? 'Sign in to ParkSmart' :
             authMode === 'signup' ? 'Create your Account' : 'Reset your Password'}
          </h2>
          <p className="text-xs text-slate-400">
            {authMode === 'login' ? 'Access real-time parking spot reservations & municipal analytics' :
             authMode === 'signup' ? 'Join the intelligent mobility grid across Delhi-NCR' :
             'Enter your email to receive a recovery token'}
          </p>
        </div>

        {/* Form Container */}
        <div className="mt-6 bg-slate-900/90 border border-slate-800 p-8 rounded-3xl shadow-2xl backdrop-blur-xl relative">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Role Switcher Pills (for demo quick testing) */}
            {authMode !== 'forgot-password' && (
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  Select User Perspective / Role
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setRole('driver');
                      setEmail('driver@parksmart.city');
                    }}
                    className={`p-3 rounded-xl border text-left transition-all flex items-center gap-2.5 ${
                      role === 'driver'
                        ? 'bg-cyan-500/10 border-cyan-500 text-cyan-300'
                        : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    <Car className="w-4 h-4" />
                    <div>
                      <div className="text-xs font-bold">Driver</div>
                      <div className="text-[10px] text-slate-400">Search & Reserve</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setRole('city-operator');
                      setEmail('operator@delhi-smartcity.gov');
                    }}
                    className={`p-3 rounded-xl border text-left transition-all flex items-center gap-2.5 ${
                      role === 'city-operator'
                        ? 'bg-cyan-500/10 border-cyan-500 text-cyan-300'
                        : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    <Building2 className="w-4 h-4" />
                    <div>
                      <div className="text-xs font-bold">City Operator</div>
                      <div className="text-[10px] text-slate-400">Analytics & Grid</div>
                    </div>
                  </button>
                </div>
              </div>
            )}

            {/* Name field if signup */}
            {authMode === 'signup' && (
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-cyan-400" /> Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm outline-none focus:border-cyan-500"
                  required
                />
              </div>
            )}

            {/* Email field */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-cyan-400" /> Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm outline-none focus:border-cyan-500 font-mono text-xs"
                required
              />
            </div>

            {/* Password field */}
            {authMode !== 'forgot-password' && (
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-300 flex items-center gap-1">
                    <Lock className="w-3.5 h-3.5 text-cyan-400" /> Password
                  </label>
                  {authMode === 'login' && (
                    <button
                      type="button"
                      onClick={() => setAuthMode('forgot-password')}
                      className="text-[11px] text-cyan-400 hover:underline"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm outline-none focus:border-cyan-500"
                  required
                />
              </div>
            )}

            {/* Submit button */}
            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-sm shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 transition-all mt-2"
              id="auth-submit-btn"
            >
              <span>
                {authMode === 'login' ? `Sign In as ${role === 'city-operator' ? 'City Operator' : 'Driver'}` :
                 authMode === 'signup' ? 'Create Account' : 'Send Reset Link'}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Toggle between login / signup */}
          <div className="mt-6 pt-4 border-t border-slate-800/80 text-center text-xs text-slate-400">
            {authMode === 'login' ? (
              <p>
                Don't have an account?{' '}
                <button
                  onClick={() => setAuthMode('signup')}
                  className="text-cyan-400 font-semibold hover:underline"
                >
                  Sign up
                </button>
              </p>
            ) : (
              <p>
                Already have an account?{' '}
                <button
                  onClick={() => setAuthMode('login')}
                  className="text-cyan-400 font-semibold hover:underline"
                >
                  Sign in
                </button>
              </p>
            )}
          </div>
        </div>

        {/* Hackathon credential hint pill */}
        <div className="mt-4 p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-center text-[11px] font-mono text-slate-400">
          💡 Demo Mode: Click either Driver or Operator above to instantly sign in.
        </div>
      </div>
    </div>
  );
};
