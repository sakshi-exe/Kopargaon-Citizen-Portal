import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase.js';
import {
  Mail,
  Lock,
  User,
  ShieldCheck,
  Loader2,
} from 'lucide-react';

export default function Auth() {
  const [role, setRole] = useState('citizen');
  const [mode, setMode] = useState('login');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // ======================================================
  // CHECK EXISTING SESSION
  // ======================================================

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();

      if (!data?.session) return;

      const user = data.session.user;

      const userRole =
        user?.user_metadata?.role ||
        user?.app_metadata?.role ||
        'citizen';

      if (userRole === 'admin') {
        window.location.href = '/admin';
      } else {
        window.location.href = '/citizen';
      }
    };

    checkSession();
  }, []);

  // ======================================================
  // RESET
  // ======================================================

  const resetMessages = () => {
    setError('');
    setMessage('');
  };

  const switchRole = (nextRole) => {
    setRole(nextRole);
    setMode('login');
    setPassword('');
    setName('');
    resetMessages();
  };

  // ======================================================
  // EMAIL LOGIN / SIGNUP
  // ======================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    resetMessages();

    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }

    if (!password) {
      setError('Please enter your password.');
      return;
    }

    setLoading(true);

    try {
      // ==================================================
      // CITIZEN SIGN UP
      // ==================================================

      if (mode === 'signup') {
        // Admin signup is NOT allowed
        if (role === 'admin') {
          throw new Error(
            'Admin accounts cannot be created here. Please use an authorized admin account.'
          );
        }

        if (!name.trim()) {
          throw new Error('Please enter your full name.');
        }

        if (password.length < 6) {
          throw new Error(
            'Password must be at least 6 characters.'
          );
        }

        const {
          data,
          error: signUpError,
        } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            data: {
              full_name: name.trim(),
              role: 'citizen',
            },
          },
        });

        if (signUpError) {
          throw signUpError;
        }

        // If email confirmation is disabled
        if (data?.session) {
          window.location.href = '/citizen';
          return;
        }

        setMessage(
          'Account created successfully! Please check your email to confirm your account.'
        );

        setMode('login');
        setPassword('');
        setName('');

        return;
      }

      // ==================================================
      // LOGIN
      // ==================================================

      const {
        data,
        error: loginError,
      } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (loginError) {
        throw loginError;
      }

      if (!data?.session) {
        throw new Error(
          'Login failed. Please try again.'
        );
      }

      const user = data.session.user;

      const userRole =
        user?.user_metadata?.role ||
        user?.app_metadata?.role ||
        'citizen';

      // ==================================================
      // ADMIN LOGIN
      // ==================================================

      if (role === 'admin') {
        if (userRole !== 'admin') {
          await supabase.auth.signOut();

          throw new Error(
            'This account is not authorized for admin access.'
          );
        }

        window.location.href = '/admin';
        return;
      }

      // ==================================================
      // CITIZEN LOGIN
      // ==================================================

      if (userRole === 'admin') {
        await supabase.auth.signOut();

        throw new Error(
          'This is an admin account. Please use the Admin Portal.'
        );
      }

      window.location.href = '/citizen';

    } catch (err) {
      console.error(
        'Authentication error:',
        err
      );

      setError(
        err?.message ||
          'Authentication failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  // ======================================================
  // UI
  // ======================================================

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 bg-slate-950">

      <div className="w-full max-w-md">

        {/* ==================================================
            BRAND
        ================================================== */}

        <div className="text-center mb-7">

          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-teal-600 flex items-center justify-center shadow-xl">

            {role === 'admin' ? (
              <ShieldCheck
                size={32}
                className="text-white"
              />
            ) : (
              <span className="text-3xl">
                🏢
              </span>
            )}

          </div>

          <h1 className="text-3xl font-black text-white">
            CivicFix
          </h1>

          <p className="mt-2 text-sm text-slate-400">
            Smart Civic Governance Platform
          </p>

        </div>


        {/* ==================================================
            CARD
        ================================================== */}

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">

          {/* ==================================================
              ROLE SWITCH
          ================================================== */}

          <div className="grid grid-cols-2 gap-2 p-1 mb-6 rounded-xl bg-slate-800">

            <button
              type="button"
              onClick={() =>
                switchRole('citizen')
              }
              className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition ${
                role === 'citizen'
                  ? 'bg-teal-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >

              <User size={16} />

              Citizen

            </button>


            <button
              type="button"
              onClick={() =>
                switchRole('admin')
              }
              className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition ${
                role === 'admin'
                  ? 'bg-indigo-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >

              <ShieldCheck size={16} />

              Admin

            </button>

          </div>


          {/* ==================================================
              TITLE
          ================================================== */}

          <div className="mb-6">

            <h2 className="text-xl font-bold text-white">

              {role === 'admin'
                ? 'Admin Portal'
                : mode === 'login'
                ? 'Welcome back'
                : 'Create your account'}

            </h2>

            <p className="mt-1 text-sm text-slate-400">

              {role === 'admin'
                ? 'Authorized municipal personnel only.'
                : mode === 'login'
                ? 'Sign in to continue to CivicFix.'
                : 'Create an account to report and track civic issues.'}

            </p>

          </div>


          {/* ==================================================
              ERROR
          ================================================== */}

          {error && (

            <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-sm">

              {error}

            </div>

          )}


          {/* ==================================================
              SUCCESS
          ================================================== */}

          {message && (

            <div className="mb-4 p-3 rounded-xl bg-green-500/10 border border-green-500/30 text-green-300 text-sm">

              {message}

            </div>

          )}


          {/* ==================================================
              FORM
          ================================================== */}

          <form onSubmit={handleSubmit}>

            {/* NAME */}

            {mode === 'signup' && role === 'citizen' && (

              <div className="mb-4">

                <label className="block mb-2 text-sm font-semibold text-slate-200">

                  Full Name

                </label>

                <div className="relative">

                  <User
                    size={17}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                  />

                  <input
                    type="text"
                    value={name}
                    onChange={(e) =>
                      setName(e.target.value)
                    }
                    placeholder="Enter your name"
                    autoComplete="name"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-700 bg-slate-800 text-white placeholder-slate-500 outline-none focus:border-teal-500"
                  />

                </div>

              </div>

            )}


            {/* EMAIL */}

            <div className="mb-4">

              <label className="block mb-2 text-sm font-semibold text-slate-200">

                Email

              </label>

              <div className="relative">

                <Mail
                  size={17}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                />

                <input
                  type="email"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  placeholder="you@example.com"
                  autoComplete="email"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-700 bg-slate-800 text-white placeholder-slate-500 outline-none focus:border-teal-500"
                />

              </div>

            </div>


            {/* PASSWORD */}

            <div className="mb-5">

              <label className="block mb-2 text-sm font-semibold text-slate-200">

                Password

              </label>

              <div className="relative">

                <Lock
                  size={17}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                />

                <input
                  type="password"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  placeholder="••••••••"
                  autoComplete={
                    mode === 'login'
                      ? 'current-password'
                      : 'new-password'
                  }
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-700 bg-slate-800 text-white placeholder-slate-500 outline-none focus:border-teal-500"
                />

              </div>

            </div>


            {/* SUBMIT */}

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-xl flex items-center justify-center gap-2 font-bold text-sm transition ${
                loading
                  ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                  : role === 'admin'
                  ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                  : 'bg-teal-600 hover:bg-teal-700 text-white'
              }`}
            >

              {loading ? (
                <>
                  <Loader2
                    size={17}
                    className="animate-spin"
                  />

                  Please wait...

                </>
              ) : (
                <>
                  {mode === 'login'
                    ? 'Sign In'
                    : 'Create Account'}
                </>
              )}

            </button>

          </form>


          {/* ==================================================
              SIGNUP TOGGLE
          ================================================== */}

          {role === 'citizen' && (

            <div className="mt-5 text-center text-sm text-slate-400">

              {mode === 'login'
                ? "Don't have an account?"
                : 'Already have an account?'}

              {' '}

              <button
                type="button"
                onClick={() => {
                  setMode(
                    mode === 'login'
                      ? 'signup'
                      : 'login'
                  );

                  resetMessages();
                  setPassword('');
                }}
                className="font-bold text-teal-400 hover:text-teal-300"
              >

                {mode === 'login'
                  ? 'Create one'
                  : 'Sign in'}

              </button>

            </div>

          )}


          {/* ==================================================
              ADMIN NOTE
          ================================================== */}

          {role === 'admin' && (

            <div className="mt-5 p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-300 text-center">

              Admin accounts are provisioned
              separately by the municipal system.

            </div>

          )}

        </div>


        {/* FOOTER */}

        <p className="text-center text-xs text-slate-600 mt-5">
          CivicFix • Kopargaon Smart Governance
        </p>

      </div>

    </div>
  );
}