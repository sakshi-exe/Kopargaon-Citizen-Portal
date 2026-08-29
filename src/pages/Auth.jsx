import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase.js';

export default function Auth() {
  const [mode, setMode] = useState('login');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();

      if (data?.session) {
        window.location.href = '/';
      }
    };

    checkSession();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setMessage('');
    setError('');

    try {
      if (!email || !password) {
        setError('Please enter email and password.');
        return;
      }

      if (mode === 'signup') {
        if (!name.trim()) {
          setError('Please enter your name.');
          return;
        }

        if (password.length < 6) {
          setError('Password must be at least 6 characters.');
          return;
        }

        const { data, error: signUpError } =
          await supabase.auth.signUp({
            email: email.trim(),
            password,
            options: {
              data: {
                full_name: name.trim(),
              },
            },
          });

        if (signUpError) {
          throw signUpError;
        }

        if (data?.session) {
          window.location.href = '/';
          return;
        }

        setMessage(
          'Account created! Please check your email to confirm your account.'
        );

        setMode('login');
        setPassword('');
        return;
      }

      const { data, error: loginError } =
        await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

      if (loginError) {
        throw loginError;
      }

      if (data?.session) {
        window.location.href = '/';
      }
    } catch (err) {
      console.error('Authentication error:', err);

      setError(
        err?.message ||
          'Authentication failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        background:
          'linear-gradient(135deg, #07111f 0%, #0d1728 50%, #101d32 100%)',
        color: '#f8fafc',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '430px',
          padding: '32px',
          borderRadius: '20px',
          background: '#172337',
          border: '1px solid #2d3c55',
          boxShadow: '0 25px 70px rgba(0,0,0,0.35)',
        }}
      >
        {/* Brand */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div
            style={{
              width: '58px',
              height: '58px',
              margin: '0 auto 14px',
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: '#2563eb',
              fontSize: '28px',
            }}
          >
            🏢
          </div>

          <h1
            style={{
              margin: 0,
              fontSize: '28px',
              fontWeight: 800,
            }}
          >
            CivicFix
          </h1>

          <p
            style={{
              marginTop: '8px',
              marginBottom: 0,
              color: '#94a3b8',
              fontSize: '14px',
            }}
          >
            Kopargaon Citizen Portal
          </p>
        </div>

        {/* Heading */}
        <div style={{ marginBottom: '22px' }}>
          <h2
            style={{
              margin: 0,
              fontSize: '22px',
            }}
          >
            {mode === 'login'
              ? 'Welcome back'
              : 'Create your account'}
          </h2>

          <p
            style={{
              marginTop: '7px',
              color: '#94a3b8',
              fontSize: '14px',
            }}
          >
            {mode === 'login'
              ? 'Sign in to continue to CivicFix.'
              : 'Create an account to report and track civic issues.'}
          </p>
        </div>

        {/* Error */}
        {error && (
          <div
            style={{
              marginBottom: '16px',
              padding: '12px 14px',
              borderRadius: '10px',
              background: 'rgba(239,68,68,0.12)',
              border: '1px solid rgba(239,68,68,0.35)',
              color: '#fca5a5',
              fontSize: '14px',
            }}
          >
            {error}
          </div>
        )}

        {/* Success */}
        {message && (
          <div
            style={{
              marginBottom: '16px',
              padding: '12px 14px',
              borderRadius: '10px',
              background: 'rgba(34,197,94,0.12)',
              border: '1px solid rgba(34,197,94,0.35)',
              color: '#86efac',
              fontSize: '14px',
            }}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Name */}
          {mode === 'signup' && (
            <div style={{ marginBottom: '16px' }}>
              <label
                style={{
                  display: 'block',
                  marginBottom: '7px',
                  fontSize: '14px',
                  fontWeight: 600,
                }}
              >
                Full Name
              </label>

              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                autoComplete="name"
                style={inputStyle}
              />
            </div>
          )}

          {/* Email */}
          <div style={{ marginBottom: '16px' }}>
            <label
              style={{
                display: 'block',
                marginBottom: '7px',
                fontSize: '14px',
                fontWeight: 600,
              }}
            >
              Email
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              style={inputStyle}
            />
          </div>

          {/* Password */}
          <div style={{ marginBottom: '20px' }}>
            <label
              style={{
                display: 'block',
                marginBottom: '7px',
                fontSize: '14px',
                fontWeight: 600,
              }}
            >
              Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete={
                mode === 'login'
                  ? 'current-password'
                  : 'new-password'
              }
              style={inputStyle}
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '13px 16px',
              border: 'none',
              borderRadius: '10px',
              background: loading ? '#475569' : '#2563eb',
              color: '#fff',
              fontSize: '15px',
              fontWeight: 700,
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
          >
            {loading
              ? 'Please wait...'
              : mode === 'login'
              ? 'Sign In'
              : 'Create Account'}
          </button>
        </form>

        {/* Toggle */}
        <div
          style={{
            marginTop: '22px',
            textAlign: 'center',
            color: '#94a3b8',
            fontSize: '14px',
          }}
        >
          {mode === 'login'
            ? "Don't have an account?"
            : 'Already have an account?'}{' '}
          <button
            type="button"
            onClick={() => {
              setMode(
                mode === 'login'
                  ? 'signup'
                  : 'login'
              );
              setError('');
              setMessage('');
            }}
            style={{
              border: 'none',
              background: 'transparent',
              color: '#60a5fa',
              fontWeight: 700,
              cursor: 'pointer',
              padding: 0,
            }}
          >
            {mode === 'login'
              ? 'Create one'
              : 'Sign in'}
          </button>
        </div>
      </div>
    </div>
  );
}

const inputStyle = {
  width: '100%',
  boxSizing: 'border-box',
  padding: '12px 14px',
  borderRadius: '10px',
  border: '1px solid #3a4a63',
  background: '#0f1a2b',
  color: '#f8fafc',
  outline: 'none',
  fontSize: '14px',
};