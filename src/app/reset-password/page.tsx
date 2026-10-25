'use client';

import { useState, useEffect, Suspense } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  // null = still checking, true = session ready, false = invalid/expired link
  const [isSessionReady, setIsSessionReady] = useState<boolean | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function verifyRecoverySession() {
      // 1. Check if error is returned in URL parameters
      const urlError = searchParams.get('error_description') || searchParams.get('error');
      if (urlError) {
        if (isMounted) {
          setError(decodeURIComponent(urlError.replace(/\+/g, ' ')));
          setIsSessionReady(false);
        }
        return;
      }

      // 2. Check if a PKCE code was provided (?code=...)
      const code = searchParams.get('code');
      if (code) {
        const { error: exchangeErr } = await supabase.auth.exchangeCodeForSession(code);
        if (exchangeErr) {
          if (isMounted) {
            setError('This password reset link is invalid or has expired. Please request a new one.');
            setIsSessionReady(false);
          }
          return;
        } else {
          if (isMounted) {
            setIsSessionReady(true);
            return;
          }
        }
      }

      // 3. Check if session already exists
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        if (isMounted) {
          setIsSessionReady(true);
          return;
        }
      }

      // 4. Listen for auth state change (such as hash fragment recovery token #access_token=...)
      const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (event === 'PASSWORD_RECOVERY' || (event === 'SIGNED_IN' && session)) {
          if (isMounted) {
            setIsSessionReady(true);
            setError('');
          }
        }
      });

      // 5. Fallback timer if no session is detected within 1.5 seconds
      const timeoutId = setTimeout(async () => {
        if (!isMounted) return;
        const { data } = await supabase.auth.getSession();
        if (data.session) {
          setIsSessionReady(true);
        } else {
          // If no code and no hash token was passed
          setIsSessionReady(false);
          if (!error) {
            setError('No active password reset session found. Security links expire after 1 hour or single use.');
          }
        }
      }, 1500);

      return () => {
        authListener.subscription.unsubscribe();
        clearTimeout(timeoutId);
      };
    }

    verifyRecoverySession();

    return () => {
      isMounted = false;
    };
  }, [searchParams, error]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match. Please verify both fields.');
      return;
    }

    setLoading(true);

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password: password,
      });

      if (updateError) {
        setError(updateError.message);
        setLoading(false);
        return;
      }

      setSuccess(true);
      setLoading(false);

      // Redirect to dashboard where the user is now authenticated
      setTimeout(() => {
        router.push('/dashboard');
      }, 2500);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'An error occurred while setting your password.';
      setError(message);
      setLoading(false);
    }
  };

  const isLengthValid = password.length >= 6;
  const isMatch = password.length > 0 && password === confirmPassword;

  return (
    <div className="layout-2-col" style={{ minHeight: '100vh' }}>
      {/* Left Branding / Guidance Column */}
      <div className="left-col bg-pattern p-8" style={{ display: 'flex', flexDirection: 'column', padding: '8% 10%', justifyContent: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
          <Image src="/logo.png" alt="ACOOR Logo" width={44} height={44} style={{ borderRadius: '50%', background: '#fff', padding: '2px' }} />
          <span style={{ color: '#fff', fontWeight: 800, fontSize: '1.25rem', letterSpacing: '0.04em' }}>ACOOR</span>
        </div>

        <span style={{ display: 'inline-block', background: 'rgba(255,255,255,0.15)', color: '#fff', padding: '0.35rem 0.85rem', borderRadius: '50px', fontSize: '0.85rem', fontWeight: 600, width: 'fit-content', marginBottom: '1rem' }}>
          Security & Access
        </span>

        <h1 style={{ fontSize: 'clamp(2.2rem, 4vw, 3.2rem)', marginBottom: '1rem', color: '#fff', fontWeight: 800, lineHeight: 1.15 }}>
          Set New Password
        </h1>
        <p style={{ fontSize: '1.1rem', color: '#e2e8f0', marginBottom: '2.5rem', lineHeight: 1.6, maxWidth: '520px' }}>
          Create a secure, strong password to protect your medical consultations, appointments, and therapy plans.
        </p>

        <div style={{ background: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(10px)', borderRadius: '14px', padding: '1.25rem', maxWidth: '480px', border: '1px solid rgba(255, 255, 255, 0.18)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#fff', fontWeight: 700, marginBottom: '0.5rem' }}>
            <span>🔒</span>
            <span>Password Guidelines</span>
          </div>
          <ul style={{ color: '#e2e8f0', fontSize: '0.88rem', margin: 0, paddingLeft: '1.25rem', lineHeight: 1.6 }}>
            <li>Must contain at least 6 characters</li>
            <li>Use a mix of letters and numbers for higher protection</li>
            <li>Keep your login credentials private and confidential</li>
          </ul>
        </div>
      </div>

      {/* Right Form Column */}
      <div className="right-col p-8" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <div className="glass-card fade-in" style={{ maxWidth: '440px', width: '100%', padding: '2.5rem', borderRadius: '20px', boxShadow: '0 20px 40px rgba(15, 23, 42, 0.08)' }}>
          
          <div style={{ marginBottom: '1.75rem' }}>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--secondary-color)', marginBottom: '0.5rem' }}>
              Create New Password
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
              Please enter and confirm your new secure credentials below.
            </p>
          </div>

          {/* Case 1: Verifying link */}
          {isSessionReady === null && (
            <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
              <div style={{ display: 'inline-block', width: '40px', height: '40px', border: '3px solid rgba(13,148,136,0.2)', borderTopColor: '#0d9488', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
              <p style={{ marginTop: '1rem', color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                Verifying your secure password reset link...
              </p>
              <style jsx>{`
                @keyframes spin {
                  to { transform: rotate(360deg); }
                }
              `}</style>
            </div>
          )}

          {/* Case 2: Link is invalid, expired, or session missing */}
          {isSessionReady === false && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#b91c1c', padding: '1.25rem', borderRadius: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  <strong style={{ fontSize: '1rem', color: '#991b1b' }}>Reset Link Expired or Invalid</strong>
                </div>
                <p style={{ fontSize: '0.9rem', color: '#b91c1c', margin: 0, lineHeight: 1.5 }}>
                  {error || 'For your security, password reset links are single-use and expire quickly. Please request a fresh reset link.'}
                </p>
              </div>

              <Link
                href="/forgot-password"
                className="btn primary"
                style={{ width: '100%', padding: '0.85rem', textAlign: 'center', borderRadius: '10px' }}
              >
                Request New Reset Link →
              </Link>

              <div style={{ textAlign: 'center', marginTop: '0.5rem' }}>
                <Link href="/login" style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', textDecoration: 'none' }}>
                  ← Return to Login
                </Link>
              </div>
            </div>
          )}

          {/* Case 3: Session is ready */}
          {isSessionReady === true && (
            <>
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
                      <strong style={{ fontSize: '1rem', color: '#065f46' }}>Password Updated!</strong>
                    </div>
                    <p style={{ fontSize: '0.92rem', color: '#047857', margin: 0, lineHeight: 1.5 }}>
                      Your password has been changed successfully. You are being redirected to your dashboard...
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => router.push('/dashboard')}
                    className="btn primary"
                    style={{ width: '100%', padding: '0.85rem', textAlign: 'center', borderRadius: '10px' }}
                  >
                    Go to Dashboard Now →
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                  {/* New Password */}
                  <div className="form-group">
                    <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, color: 'var(--secondary-color)', marginBottom: '0.4rem' }}>
                      New Password
                    </label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        minLength={6}
                        placeholder="At least 6 characters"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '0.75rem 2.75rem 0.75rem 1rem',
                          borderRadius: '10px',
                          border: '1px solid #cbd5e1',
                          fontSize: '0.95rem',
                          outline: 'none',
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', opacity: 0.6 }}
                        title={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? (
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24M1 1l22 22"/></svg>
                        ) : (
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div className="form-group">
                    <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, color: 'var(--secondary-color)', marginBottom: '0.4rem' }}>
                      Confirm New Password
                    </label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        required
                        minLength={6}
                        placeholder="Re-enter your password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '0.75rem 2.75rem 0.75rem 1rem',
                          borderRadius: '10px',
                          border: '1px solid #cbd5e1',
                          fontSize: '0.95rem',
                          outline: 'none',
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', opacity: 0.6 }}
                        title={showConfirmPassword ? 'Hide password' : 'Show password'}
                      >
                        {showConfirmPassword ? (
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24M1 1l22 22"/></svg>
                        ) : (
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Requirements checklist */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.82rem', padding: '0.5rem 0' }}>
                    <div style={{ color: isLengthValid ? '#059669' : '#94a3b8', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <span>{isLengthValid ? '✓' : '○'}</span>
                      <span>At least 6 characters</span>
                    </div>
                    <div style={{ color: isMatch ? '#059669' : '#94a3b8', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <span>{isMatch ? '✓' : '○'}</span>
                      <span>Passwords match</span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="btn primary"
                    disabled={loading || !isLengthValid || !isMatch}
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
                      opacity: (loading || !isLengthValid || !isMatch) ? 0.6 : 1,
                    }}
                  >
                    {loading ? 'Saving New Password...' : 'Save & Secure Account →'}
                  </button>
                </form>
              )}
            </>
          )}

          <div style={{ marginTop: '2rem', paddingTop: '1.25rem', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'center', fontSize: '0.88rem' }}>
            <Link href="/login" style={{ color: 'var(--primary-color)', fontWeight: 600, textDecoration: 'none' }}>
              ← Return to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p>Loading security portal...</p>
      </div>
    }>
      <ResetPasswordContent />
    </Suspense>
  );
}
