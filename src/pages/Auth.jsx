import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase.js';
import {
  Mail,
  Lock,
  User,
  Chrome,
  ShieldCheck,
  Loader2,
  ArrowLeft,
} from 'lucide-react';

export default function Auth() {
  // ======================================================
  // STATE
  // ======================================================

  const [role, setRole] = useState('citizen');
  const [mode, setMode] = useState('login');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // ======================================================
  // RESET MESSAGES
  // ======================================================

  const resetMessages = () => {
    setError('');
    setMessage('');
  };

  // ======================================================
  // ROLE SWITCH
  // ======================================================

  const switchRole = (nextRole) => {
    setRole(nextRole);
    setMode('login');
    setPassword('');
    resetMessages();
  };

  // ======================================================
  // CHECK EXISTING SESSION
  // ======================================================

  useEffect(() => {
    let mounted = true;

    const checkSession = async () => {
      const { data, error: sessionError } =
        await supabase.auth.getSession();

      if (sessionError) {
        console.error(
          'Session check error:',
          sessionError
        );
        return;
      }

      if (!mounted || !data?.session) {
        return;
      }

      const user = data.session.user;

      const userRole =
        user?.app_metadata?.role ||
        user?.user_metadata?.role ||
        'citizen';

      // --------------------------------------------------
      // ADMIN SESSION
      // --------------------------------------------------

      if (userRole === 'admin') {
        window.location.replace('/admin');
        return;
      }

      // --------------------------------------------------
      // CITIZEN SESSION
      // --------------------------------------------------

      window.location.replace('/citizen');
    };

    checkSession();

    return () => {
      mounted = false;
    };
  }, []);

  // ======================================================
  // GOOGLE LOGIN
  // ======================================================

  const handleGoogleLogin = async () => {
    resetMessages();

    // Google login is kept for citizens.
    // Admin access remains restricted to authorized
    // admin email/password accounts.

    if (role === 'admin') {
      setError(
        'Admin access is restricted to authorized admin accounts. Please use your admin email and password.'
      );
      return;
    }

    setLoading(true);

    try {
      const { error: googleError } =
        await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo:
              `${window.location.origin}/auth`,
          },
        });

      if (googleError) {
        throw googleError;
      }

      // Supabase redirects the browser to Google.
    } catch (err) {
      console.error(
        'Google authentication error:',
        err
      );

      setError(
        err?.message ||
          'Google sign in failed. Please try again.'
      );

      setLoading(false);
    }
  };

  // ======================================================
  // EMAIL LOGIN / SIGNUP
  // ======================================================

  const handleEmailSubmit = async (e) => {
    e.preventDefault();

    resetMessages();

    // --------------------------------------------------
    // BASIC VALIDATION
    // --------------------------------------------------

    if (!email.trim()) {
      setError(
        'Please enter your email address.'
      );
      return;
    }

    if (!password) {
      setError(
        'Please enter your password.'
      );
      return;
    }

    if (mode === 'signup' && role === 'citizen') {
      if (!name.trim()) {
        setError(
          'Please enter your full name.'
        );
        return;
      }

      if (password.length < 6) {
        setError(
          'Password must be at least 6 characters.'
        );
        return;
      }
    }

    setLoading(true);

    try {
      // ==================================================
      // CITIZEN SIGNUP
      // ==================================================

      if (
        mode === 'signup' &&
        role === 'citizen'
      ) {
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

        // ------------------------------------------------
        // EMAIL CONFIRMATION DISABLED
        // ------------------------------------------------

        if (data?.session) {
          window.location.replace('/citizen');
          return;
        }

        // ------------------------------------------------
        // EMAIL CONFIRMATION ENABLED
        // ------------------------------------------------

        setMessage(
          'Account created! Please check your email to confirm your account.'
        );

        setMode('login');
        setPassword('');

        return;
      }

      // ==================================================
      // EMAIL LOGIN
      // ==================================================

      const {
        data,
        error: loginError,
      } =
        await supabase.auth.signInWithPassword({
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

      // ==================================================
      // GET USER ROLE
      // ==================================================

      const userRole =
        user?.app_metadata?.role ||
        user?.user_metadata?.role ||
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

        window.location.replace('/admin');
        return;
      }

      // ==================================================
      // CITIZEN LOGIN
      // ==================================================

      if (userRole === 'admin') {
        // An admin account can still exist,
        // but don't allow accidental citizen entry.
        window.location.replace('/admin');
        return;
      }

      window.location.replace('/citizen');
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
  // TOGGLE LOGIN / SIGNUP
  // ======================================================

  const toggleMode = () => {
    resetMessages();

    if (role === 'admin') {
      setMode('login');
      return;
    }

    setMode(
      mode === 'login'
        ? 'signup'
        : 'login'
    );

    setPassword('');
  };

  // ======================================================
  // UI
  // ======================================================

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4 py-10">

      <div className="w-full max-w-md">

        {/* ==================================================
            BRAND
        ================================================== */}

        <div className="text-center mb-8">

          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-teal-600 shadow-xl shadow-teal-900/30">

            <ShieldCheck
              size={32}
              className="text-white"
            />

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

          <div className="grid grid-cols-2 gap-2 rounded-xl bg-slate-800 p-1 mb-6">

            {/* CITIZEN */}

            <button
              type="button"
              onClick={() =>
                switchRole('citizen')
              }
              disabled={loading}
              className={`flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-bold transition ${
                role === 'citizen'
                  ? 'bg-teal-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <User size={16} />

              Citizen
            </button>


            {/* ADMIN */}

            <button
              type="button"
              onClick={() =>
                switchRole('admin')
              }
              disabled={loading}
              className={`flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-bold transition ${
                role === 'admin'
                  ? 'bg-indigo-600 text-white'
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
            <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">
              {error}
            </div>
          )}


          {/* ==================================================
              SUCCESS MESSAGE
          ================================================== */}

          {message && (
            <div className="mb-4 rounded-xl border border-green-500/30 bg-green-500/10 p-3 text-sm text-green-300">
              {message}
            </div>
          )}


          {/* ==================================================
              GOOGLE LOGIN
          ================================================== */}

          {role === 'citizen' && (
            <>
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={loading}
                className="flex w-full items-center justify-center gap-3 rounded-xl border border-slate-700 bg-white px-4 py-3 font-semibold text-slate-900 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
              >

                {loading ? (
                  <Loader2
                    size={19}
                    className="animate-spin"
                  />
                ) : (
                  <Chrome size={19} />
                )}

                Continue with Google

              </button>


              {/* DIVIDER */}

              <div className="my-6 flex items-center gap-3">

                <div className="h-px flex-1 bg-slate-800" />

                <span className="text-xs font-medium text-slate-500">
                  OR
                </span>

                <div className="h-px flex-1 bg-slate-800" />

              </div>
            </>
          )}


          {/* ==================================================
              EMAIL FORM
          ================================================== */}

          <form
            onSubmit={handleEmailSubmit}
            className="space-y-4"
          >

            {/* NAME - CITIZEN SIGNUP ONLY */}

            {role === 'citizen' &&
              mode === 'signup' && (
                <div>

                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Full Name
                  </label>

                  <div className="relative">

                    <User
                      size={18}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                    />

                    <input
                      type="text"
                      value={name}
                      onChange={(e) =>
                        setName(e.target.value)
                      }
                      placeholder="Enter your full name"
                      disabled={loading}
                      className="w-full rounded-xl border border-slate-700 bg-slate-800 py-3 pl-10 pr-4 text-white outline-none transition placeholder:text-slate-500 focus:border-teal-500"
                    />

                  </div>

                </div>
              )}


            {/* EMAIL */}

            <div>

              <label className="mb-2 block text-sm font-medium text-slate-300">
                Email Address
              </label>

              <div className="relative">

                <Mail
                  size={18}
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
                  disabled={loading}
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 py-3 pl-10 pr-4 text-white outline-none transition placeholder:text-slate-500 focus:border-teal-500"
                />

              </div>

            </div>


            {/* PASSWORD */}

            <div>

              <label className="mb-2 block text-sm font-medium text-slate-300">
                Password
              </label>

              <div className="relative">

                <Lock
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                />

                <input
                  type="password"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  placeholder="Enter your password"
                  autoComplete={
                    mode === 'signup'
                      ? 'new-password'
                      : 'current-password'
                  }
                  disabled={loading}
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 py-3 pl-10 pr-4 text-white outline-none transition placeholder:text-slate-500 focus:border-teal-500"
                />

              </div>

              {mode === 'signup' &&
                role === 'citizen' && (
                  <p className="mt-2 text-xs text-slate-500">
                    Password must be at least 6 characters.
                  </p>
                )}

            </div>


            {/* SUBMIT */}

            <button
              type="submit"
              disabled={loading}
              className={`flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 font-bold text-white transition disabled:cursor-not-allowed disabled:opacity-60 ${
                role === 'admin'
                  ? 'bg-indigo-600 hover:bg-indigo-500'
                  : 'bg-teal-600 hover:bg-teal-500'
              }`}
            >

              {loading && (
                <Loader2
                  size={18}
                  className="animate-spin"
                />
              )}

              {role === 'admin'
                ? 'Sign in as Admin'
                : mode === 'login'
                ? 'Sign In'
                : 'Create Account'}

            </button>

          </form>


          {/* ==================================================
              LOGIN / SIGNUP SWITCH
          ================================================== */}

          {role === 'citizen' && (
            <div className="mt-6 text-center">

              <button
                type="button"
                onClick={toggleMode}
                disabled={loading}
                className="text-sm font-semibold text-teal-400 hover:text-teal-300"
              >

                {mode === 'login'
                  ? "Don't have an account? Create one"
                  : 'Already have an account? Sign in'}

              </button>

            </div>
          )}


          {/* ==================================================
              ADMIN NOTE
          ================================================== */}

          {role === 'admin' && (
            <div className="mt-5 rounded-xl border border-indigo-500/20 bg-indigo-500/5 p-3">

              <div className="flex items-start gap-2">

                <ShieldCheck
                  size={17}
                  className="mt-0.5 shrink-0 text-indigo-400"
                />

                <p className="text-xs leading-5 text-slate-400">
                  Admin access is restricted to authorized
                  municipal personnel. Selecting Admin does
                  not automatically grant admin privileges.
                </p>

              </div>

            </div>
          )}


          {/* ==================================================
              FOOTER
          ================================================== */}

          <div className="mt-6 text-center">

            <p className="text-xs text-slate-600">
              CivicFix • Smart Civic Governance
            </p>

          </div>

        </div>


        {/* ==================================================
            BACK
        ================================================== */}

        <button
          type="button"
          onClick={() =>
            window.history.back()
          }
          className="mx-auto mt-5 flex items-center gap-2 text-sm text-slate-500 transition hover:text-slate-300"
        >
          <ArrowLeft size={16} />
          Back
        </button>

      </div>

    </div>
  );
}