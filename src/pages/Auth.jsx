import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase.js';
import {
  Mail,
  Lock,
  User,
  Phone,
  Chrome,
  ShieldCheck,
  ArrowLeft,
  Loader2,
} from 'lucide-react';

export default function Auth() {
  const [role, setRole] = useState('citizen');

  const [mode, setMode] = useState('login');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');

  const [authMethod, setAuthMethod] = useState('email');

  const [otpSent, setOtpSent] = useState(false);

  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // ======================================================
  // CHECK EXISTING SESSION
  // ======================================================

  useEffect(() => {
    const checkSession = async () => {
      const { data } =
        await supabase.auth.getSession();

      if (data?.session) {
        window.location.href =
          role === 'admin'
            ? '/admin'
            : '/citizen';
      }
    };

    checkSession();
  }, [role]);

  // ======================================================
  // RESET FORM
  // ======================================================

  const resetMessages = () => {
    setError('');
    setMessage('');
  };

  const switchRole = (nextRole) => {
    setRole(nextRole);
    setMode('login');
    setAuthMethod('email');
    setOtpSent(false);
    setPassword('');
    setOtp('');
    resetMessages();
  };

  // ======================================================
  // GOOGLE LOGIN
  // ======================================================

  const handleGoogleLogin = async () => {
    setLoading(true);
    resetMessages();

    try {
      const { error } =
        await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo:
              `${window.location.origin}/auth`,
          },
        });

      if (error) {
        throw error;
      }
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
  // PHONE OTP
  // ======================================================

  const sendPhoneOtp = async () => {
    resetMessages();

    if (!phone.trim()) {
      setError(
        'Please enter your phone number.'
      );
      return;
    }

    setLoading(true);

    try {
      const { error } =
        await supabase.auth.signInWithOtp({
          phone: phone.trim(),
        });

      if (error) {
        throw error;
      }

      setOtpSent(true);

      setMessage(
        'OTP sent successfully. Please check your phone.'
      );
    } catch (err) {
      console.error(
        'Phone OTP error:',
        err
      );

      setError(
        err?.message ||
          'Could not send OTP. Please check your phone number.'
      );
    } finally {
      setLoading(false);
    }
  };

  // ======================================================
  // VERIFY PHONE OTP
  // ======================================================

  const verifyPhoneOtp = async () => {
    resetMessages();

    if (!otp.trim()) {
      setError(
        'Please enter the OTP.'
      );
      return;
    }

    setLoading(true);

    try {
      const { data, error } =
        await supabase.auth.verifyOtp({
          phone: phone.trim(),
          token: otp.trim(),
          type: 'sms',
        });

      if (error) {
        throw error;
      }

      if (data?.session) {
        /*
         * Admin accounts still need to be
         * authorized separately.
         *
         * For now phone authentication
         * is treated as citizen authentication.
         */
        if (role === 'admin') {
          await supabase.auth.signOut();

          throw new Error(
            'Admin access cannot be created using phone OTP. Please use your authorized admin email account.'
          );
        }

        window.location.href =
          '/citizen';
      }
    } catch (err) {
      console.error(
        'OTP verification error:',
        err
      );

      setError(
        err?.message ||
          'Invalid OTP. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  // ======================================================
  // EMAIL LOGIN / SIGNUP
  // ======================================================

  const handleEmailSubmit = async (e) => {
    e.preventDefault();

    resetMessages();

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

    setLoading(true);

    try {
      // --------------------------------------------------
      // SIGN UP
      // --------------------------------------------------

      if (
        mode === 'signup' &&
        role === 'citizen'
      ) {
        if (!name.trim()) {
          throw new Error(
            'Please enter your full name.'
          );
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
              full_name:
                name.trim(),

              role: 'citizen',
            },
          },
        });

        if (signUpError) {
          throw signUpError;
        }

        if (data?.session) {
          window.location.href =
            '/citizen';
          return;
        }

        setMessage(
          'Account created! Please check your email to confirm your account.'
        );

        setMode('login');
        setPassword('');

        return;
      }

      // --------------------------------------------------
      // LOGIN
      // --------------------------------------------------

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

      /*
       * IMPORTANT:
       *
       * Admin role is validated using the
       * user's Supabase metadata.
       *
       * A normal citizen cannot select
       * Admin and automatically become admin.
       */

      const user =
        data.session.user;

      const userRole =
        user?.user_metadata?.role ||
        user?.app_metadata?.role ||
        'citizen';

      if (role === 'admin') {
        if (userRole !== 'admin') {
          await supabase.auth.signOut();

          throw new Error(
            'This account is not authorized for admin access.'
          );
        }

        window.location.href =
          '/admin';

        return;
      }

      window.location.href =
        '/citizen';
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

          <div className="mx-auto mb-4 w-14 h-14 rounded-2xl bg-teal-600 flex items-center justify-center shadow-lg">

            <ShieldCheck
              size={28}
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

          <div className="grid grid-cols-2 gap-2 p-1 mb-6 rounded-xl bg-slate-800">

            <button
              type="button"
              onClick={() =>
                switchRole('citizen')
              }
              className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition ${
                role === 'citizen'
                  ? 'bg-teal-600 text-white'
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
              SOCIAL LOGIN
          ================================================== */}

          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 py-3 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-750 text-white font-semibold text-sm transition disabled:opacity-50"
          >

            {loading ? (
              <Loader2
                size={18}
                className="animate-spin"
              />
            ) : (
              <Chrome size={18} />
            )}

            Continue with Google

          </button>


          {/* Divider */}

          <div className="flex items-center gap-3 my-5">

            <div className="h-px flex-1 bg-slate-800" />

            <span className="text-xs text-slate-500">
              OR
            </span>

            <div className="h-px flex-1 bg-slate-800" />

          </div>


          {/* ==================================================
              AUTH METHOD
          ================================================== */}

          <div className="grid grid-cols-2 gap-2 mb-5">

            <button
              type="button"
              onClick={() => {
                setAuthMethod('email');
                setOtpSent(false);
                resetMessages();
              }}
              className={`flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold ${
                authMethod === 'email'
                  ? 'bg-slate-700 text-white'
                  : 'text-slate-400'
              }`}
            >

              <Mail size={14} />

              Email

            </button>

            <button
              type="button"
              onClick={() => {
                setAuthMethod('phone');
                resetMessages();
              }}
              className={`flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold ${
                authMethod === 'phone'
                  ? 'bg-slate-700 text-white'
                  : 'text-slate-400'
              }`}
            >

              <Phone size={14} />

              Phone OTP

            </button>

          </div>


          {/* ==================================================
              PHONE AUTH
          ================================================== */}

          {authMethod === 'phone' ? (

            <div>

              <label className="block text-sm font-semibold text-slate-300 mb-2">
                Phone Number
              </label>

              <input
                type="tel"
                value={phone}
                onChange={(e) =>
                  setPhone(e.target.value)
                }
                placeholder="+91 9876543210"
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-white outline-none focus:border-teal-500"
              />


              {otpSent && (

                <div className="mt-4">

                  <label className="block text-sm font-semibold text-slate-300 mb-2">
                    Enter OTP
                  </label>

                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    value={otp}
                    onChange={(e) =>
                      setOtp(
                        e.target.value.replace(
                          /\D/g,
                          ''
                        )
                      )
                    }
                    placeholder="6-digit OTP"
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-white outline-none focus:border-teal-500"
                  />

                </div>

              )}


              <button
                type="button"
                disabled={loading}
                onClick={
                  otpSent
                    ? verifyPhoneOtp
                    : sendPhoneOtp
                }
                className="w-full mt-4 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold transition disabled:opacity-50"
              >

                {loading
                  ? 'Please wait...'
                  : otpSent
                  ? 'Verify OTP'
                  : 'Send OTP'}

              </button>

              {otpSent && (

                <button
                  type="button"
                  onClick={() => {
                    setOtpSent(false);
                    setOtp('');
                    resetMessages();
                  }}
                  className="w-full mt-2 text-xs text-slate-400 hover:text-white"
                >
                  Use a different number
                </button>

              )}

            </div>

          ) : (

            /* ==================================================
               EMAIL AUTH
            ================================================== */

            <form
              onSubmit={
                handleEmailSubmit
              }
            >

              {mode === 'signup' &&
                role === 'citizen' && (

                  <div className="mb-4">

                    <label className="block text-sm font-semibold text-slate-300 mb-2">
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
                          setName(
                            e.target.value
                          )
                        }
                        placeholder="Enter your name"
                        autoComplete="name"
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-white outline-none focus:border-teal-500"
                      />

                    </div>

                  </div>

                )}


              <div className="mb-4">

                <label className="block text-sm font-semibold text-slate-300 mb-2">
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
                      setEmail(
                        e.target.value
                      )
                    }
                    placeholder="you@example.com"
                    autoComplete="email"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-white outline-none focus:border-teal-500"
                  />

                </div>

              </div>


              <div className="mb-5">

                <label className="block text-sm font-semibold text-slate-300 mb-2">
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
                      setPassword(
                        e.target.value
                      )
                    }
                    placeholder="••••••••"
                    autoComplete={
                      mode === 'login'
                        ? 'current-password'
                        : 'new-password'
                    }
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-white outline-none focus:border-teal-500"
                  />

                </div>

              </div>


              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 rounded-xl text-white font-bold transition disabled:opacity-50 ${
                  role === 'admin'
                    ? 'bg-indigo-600 hover:bg-indigo-700'
                    : 'bg-teal-600 hover:bg-teal-700'
                }`}
              >

                {loading
                  ? 'Please wait...'
                  : role === 'admin'
                  ? 'Admin Sign In'
                  : mode === 'login'
                  ? 'Sign In'
                  : 'Create Account'}

              </button>

            </form>

          )}


          {/* ==================================================
              CITIZEN SIGNUP TOGGLE
          ================================================== */}

          {role === 'citizen' && (

            <div className="mt-6 text-center text-sm text-slate-400">

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
                }}
                className="text-teal-400 hover:text-teal-300 font-bold"
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

            <div className="mt-5 flex gap-2 p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20">

              <ShieldCheck
                size={16}
                className="text-indigo-400 shrink-0 mt-0.5"
              />

              <p className="text-[11px] leading-relaxed text-slate-400">
                Admin access is restricted to authorized
                municipal accounts. Selecting Admin does not
                grant administrative privileges.
              </p>

            </div>

          )}

        </div>


        {/* Back */}

        <button
          type="button"
          onClick={() => {
            window.location.href =
              '/';
          }}
          className="flex items-center justify-center gap-2 mx-auto mt-5 text-xs text-slate-500 hover:text-slate-300"
        >

          <ArrowLeft size={14} />

          Back to CivicFix

        </button>

      </div>

    </div>
  );
}