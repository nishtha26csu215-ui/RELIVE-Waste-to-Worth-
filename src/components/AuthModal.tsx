import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  Sparkles,
  Recycle,
  User,
  Mail,
  Lock,
  Home,
  MapPin,
  Phone,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Building,
  Database,
} from 'lucide-react';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    authMode,
    setAuthMode,
    signIn,
    signUp,
    userProfile,
  } = useApp();

  // Sign In state
  const [signInEmail, setSignInEmail] = useState('aarav.k@relive.org');
  const [signInPassword, setSignInPassword] = useState('password123');

  // Sign Up state (House Address & House No)
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [houseNo, setHouseNo] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Gurugram');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [agreed, setAgreed] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!signInEmail.trim()) {
      setError('Please enter your email or registered phone number.');
      return;
    }
    setError(null);
    signIn(signInEmail.trim(), signInPassword);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please provide your full name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setError('Please provide a valid email address.');
      return;
    }
    if (!houseNo.trim()) {
      setError('Please provide your House / Flat / Apartment No.');
      return;
    }
    if (!address.trim()) {
      setError('Please provide your complete street address or society name.');
      return;
    }
    if (!city.trim()) {
      setError('Please provide your city / town.');
      return;
    }
    if (!phone.trim() || phone.length < 8) {
      setError('Please enter a valid phone number for doorstep pickup coordination.');
      return;
    }
    if (!agreed) {
      setError('Please accept the community recycling guidelines.');
      return;
    }

    setError(null);
    setIsSubmitting(true);
    try {
      await signUp({
        name: name.trim(),
        email: email.trim(),
        houseNo: houseNo.trim(),
        address: address.trim(),
        city: city.trim(),
        phone: phone.trim(),
      });
    } catch (err) {
      console.error(err);
      setError('An error occurred while saving your account to the database. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative bg-white rounded-3xl max-w-md w-full border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Top Header Pattern */}
        <div className="bg-gradient-to-r from-emerald-800 to-teal-900 p-6 text-white relative">
          <button
            onClick={() => setIsAuthModalOpen(false)}
            className="absolute right-4 top-4 p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center font-bold">
              <Recycle className="w-5 h-5" />
            </div>
            <span className="font-extrabold text-base tracking-tight text-white">
              RELIVE
            </span>
            <span className="text-emerald-300 text-xs font-semibold">· Waste to Worth</span>
          </div>

          <h2 className="text-xl font-extrabold text-white">
            {authMode === 'signup' ? 'Create Your Account' : 'Welcome Back'}
          </h2>
          <p className="text-xs text-emerald-100 mt-1">
            {authMode === 'signup'
              ? 'Sign up to sell scrap, donate reusable items & earn vouchers.'
              : 'Sign in to manage your doorstep pickups and reward vouchers.'}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-100 bg-slate-50">
          <button
            type="button"
            onClick={() => {
              setAuthMode('signin');
              setError(null);
            }}
            className={`flex-1 py-3 text-xs font-bold text-center transition-colors border-b-2 ${
              authMode === 'signin'
                ? 'border-emerald-600 text-emerald-800 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setAuthMode('signup');
              setError(null);
            }}
            className={`flex-1 py-3 text-xs font-bold text-center transition-colors border-b-2 ${
              authMode === 'signup'
                ? 'border-emerald-600 text-emerald-800 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Sign Up (+100 Pts Bonus)
          </button>
        </div>

        {/* Modal Form Body */}
        <div className="p-6 max-h-[75vh] overflow-y-auto">
          {error && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-medium">
              {error}
            </div>
          )}

          {authMode === 'signup' ? (
            /* Sign Up Form (House Address & House No) */
            <form onSubmit={handleSignUp} className="space-y-3.5">
              
              {/* Bonus Announcement */}
              <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200/80 flex items-center gap-2.5">
                <Sparkles className="w-5 h-5 text-amber-500 shrink-0" />
                <div className="text-xs text-emerald-950 font-medium">
                  <strong className="font-bold text-emerald-900">+100 RELIVE Bonus Points</strong> will be credited directly upon signup!
                </div>
              </div>

              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Priya Sharma"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Email Address <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="email"
                    required
                    placeholder="priya.sharma@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* House No / Flat No & City */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    House / Flat No. <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Home className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Flat 402, Block B"
                      value={houseNo}
                      onChange={(e) => setHouseNo(e.target.value)}
                      className="w-full pl-8 pr-2.5 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    City / Town <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Building className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Gurugram"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full pl-8 pr-2.5 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>
              </div>

              {/* Street / Society Address */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Street / Society / Colony Address <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Palm Grove Heights, Golf Course Road"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Contact Phone */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Contact Phone (for Doorstep Pickup) <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 tabular-nums"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Create Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Terms Checkbox */}
              <label className="flex items-start gap-2 pt-1 text-xs text-slate-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="rounded accent-emerald-600 mt-0.5"
                />
                <span>
                  I agree to support zero-waste living and abide by verified scrap weighing guidelines.
                </span>
              </label>

              {/* Submit CTA */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs sm:text-sm transition-all shadow-xs flex items-center justify-center gap-1.5 disabled:opacity-50"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{isSubmitting ? 'Saving to Database...' : 'Create Account & Claim +100 Pts'}</span>
                </button>
                <div className="flex items-center justify-center gap-1.5 text-[11px] text-emerald-800 font-semibold mt-2">
                  <Database className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Profile saved to Cloud Firestore database</span>
                </div>
              </div>

              <p className="text-center text-xs text-slate-500 pt-2">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => setAuthMode('signin')}
                  className="font-bold text-emerald-700 hover:text-emerald-800"
                >
                  Sign In here
                </button>
              </p>
            </form>
          ) : (
            /* Sign In Form */
            <form onSubmit={handleSignIn} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Email or Mobile Number
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    value={signInEmail}
                    onChange={(e) => setSignInEmail(e.target.value)}
                    placeholder="aarav.k@relive.org"
                    className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Password
                  </label>
                  <span className="text-[11px] text-emerald-700 font-semibold cursor-pointer">
                    Forgot password?
                  </span>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="password"
                    required
                    value={signInPassword}
                    onChange={(e) => setSignInPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs sm:text-sm transition-all shadow-xs flex items-center justify-center gap-1.5"
                >
                  <span>Sign In to RELIVE</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Quick Demo Switcher */}
              <div className="mt-4 pt-4 border-t border-slate-100">
                <span className="text-[11px] uppercase font-bold text-slate-400 block mb-2 text-center">
                  Or Test Quick Sign-In
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setSignInEmail('aarav.k@relive.org');
                    signIn('aarav.k@relive.org');
                  }}
                  className="w-full p-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs text-slate-700 flex items-center justify-between font-semibold transition-colors"
                >
                  <span>Demo User: Aarav K. (Resident)</span>
                  <span className="text-emerald-700 text-[11px]">Instant Login →</span>
                </button>
              </div>

              <p className="text-center text-xs text-slate-500 pt-2">
                Don’t have an account yet?{' '}
                <button
                  type="button"
                  onClick={() => setAuthMode('signup')}
                  className="font-bold text-emerald-700 hover:text-emerald-800"
                >
                  Sign Up (+100 Pts)
                </button>
              </p>
            </form>
          )}

        </div>

      </div>
    </div>
  );
};
