'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import Image from 'next/image';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const origin = typeof window !== 'undefined' ? window.location.origin : 'https://acoor-clinic.vercel.app';
      const redirectUrl = `${origin}/reset-password`;

      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: redirectUrl,
      });

      if (resetError) {
        setError(resetError.message);
        setLoading(false);
        return;
      }

      setSuccess(true);
      setLoading(false);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'An unexpected error occurred. Please try again.';
      setError(message);
      setLoading(false);
    }
  };

  return (
    <div className="layout-2-col" style={{ minHeight: '100vh' }}>
      {/* Left Branding / Guidance Column */}
      <div className="left-col bg-pattern p-8" style={{ display: 'flex', flexDirection: 'column', padding: '8% 10%', justifyContent: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
          <Image src="/logo.png" alt="ACOOR Logo" width={44} height={44} style={{ borderRadius: '50%', background: '#fff', padding: '2px' }} />
          <span style={{ color: '#fff', fontWeight: 800, fontSize: '1.25rem', letterSpacing: '0.04em' }}>ACOOR</span>
        </div>

        <span style={{ display: 'inline-block', background: 'rgba(255,255,255,0.15)', color: '#fff', padding: '0.35rem 0.85rem', borderRadius: '50px', fontSize: '0.85rem', fontWeight: 600, width: 'fit-content', marginBottom: '1rem' }}>
          Account Security & Recovery
        </span>

        <h1 style={{ fontSize: 'clamp(2.2rem, 4vw, 3.2rem)', marginBottom: '1rem', color: '#fff', fontWeight: 800, lineHeight: 1.15 }}>
          Recover Your Password
        </h1>
        <p style={{ fontSize: '1.1rem', color: '#e2e8f0', marginBottom: '2.5rem', lineHeight: 1.6, maxWidth: '520px' }}>
          Enter the email address registered with your ACOOR patient profile. We will send you an authenticated, secure link to choose a new password.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', maxWidth: '480px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: '#fff' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.9rem', flexShrink: 0 }}>
              1
            </div>
            <span style={{ fontSize: '0.95rem' }}>Enter your registered email address</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: '#fff' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.9rem', flexShrink: 0 }}>
              2
            </div>
            <span style={{ fontSize: '0.95rem' }}>Check your inbox for the one-click reset link</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: '#fff' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.9rem', flexShrink: 0 }}>
              3
            </div>
            <span style={{ fontSize: '0.95rem' }}>Create a new password and log straight in</span>
          </div>
        </div>
      </div>

      {/* Right Form Column */}
      <div className="right-col p-8" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <div className="glass-card fade-in" style={{ maxWidth: '440px', width: '100%', padding: '2.5rem', borderRadius: '20px', boxShadow: '0 20px 40px rgba(15, 23, 42, 0.08)' }}>
          
          <div style={{ marginBottom: '1.75rem' }}>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--secondary-color)', marginBottom: '0.5rem' }}>
              Forgot Password?
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
              No worries! It happens. We will help you regain access in a few moments.
            </p>
          </div>
          
          {error && (
            <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#b91c1c', padding: '0.85rem 1rem', borderRadius: '10px', marginBottom: '1.25rem', fontSize: '0.9rem' }}>
              {error}
            </div>
          )}

          {success ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', color: '#065f46', padding: '1.25rem', borderRadius: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                  <strong style={{ fontSize: '1rem', color: '#065f46' }}>Reset link dispatched!</strong>
                </div>
                <p style={{ fontSize: '0.92rem', color: '#047857', margin: 0, lineHeight: 1.5 }}>
                  We sent a secure password reset link to <strong>{email}</strong>. Please check your inbox and tap the link to set your new password.
                </p>
              </div>

              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '0.9rem 1rem', fontSize: '0.85rem', color: '#64748b' }}>
                💡 <strong>Did not see the email?</strong> Please check your <em>Spam or Junk</em> folder. Password reset links expire after 1 hour for security.
              </div>

              <button
                type="button"
                onClick={() => { setSuccess(false); setError(''); }}
                className="btn outline"
                style={{ width: '100%', padding: '0.75rem', textAlign: 'center' }}
              >
                Send to a different email
              </button>

              <div style={{ textAlign: 'center', marginTop: '0.5rem' }}>
                <a
                  href={`https://wa.me/49123456789?text=Hello%20ACOOR,%20I%20am%20having%20trouble%20resetting%20my%20password%20for%20${encodeURIComponent(email)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ fontSize: '0.85rem', color: '#0d9488', textDecoration: 'none', fontWeight: 600 }}
                >
                  💬 Need help? Chat with ACOOR Desk on WhatsApp
                </a>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              <div className="form-group">
                <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, color: 'var(--secondary-color)', marginBottom: '0.4rem' }}>
                  Registered Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    borderRadius: '10px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.95rem',
                    outline: 'none',
                    transition: 'border-color 0.2s',
                  }}
                />
              </div>

              <button
                type="submit"
                className="btn primary"
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '0.85rem',
                  fontSize: '1rem',
                  fontWeight: 700,
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  marginTop: '0.5rem',
                }}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                    Sending Reset Link...
                  </>
                ) : (
                  'Send Reset Link →'
                )}
              </button>
            </form>
          )}

          <div style={{ marginTop: '2rem', paddingTop: '1.25rem', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem' }}>
            <Link href="/login" style={{ color: 'var(--primary-color)', fontWeight: 600, textDecoration: 'none' }}>
              ← Back to Login
            </Link>
            <Link href="/register" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>
              Create Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
