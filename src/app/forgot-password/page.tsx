'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);

    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (resetError) {
      setError(resetError.message);
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
  };

  return (
    <div className="layout-2-col" style={{ minHeight: '100vh' }}>
      <div className="left-col bg-pattern p-8" style={{ display: 'flex', flexDirection: 'column', padding: '10%' }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '1rem', color: '#fff' }}>Reset Password</h1>
        <p style={{ fontSize: '1.2rem', color: '#e2e8f0', marginBottom: '2rem' }}>
          Forgotten your password? Enter your email address and we'll send you a link to reset it.
        </p>
      </div>

      <div className="right-col p-8" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="glass-card fade-in" style={{ maxWidth: '400px', width: '100%', padding: '2rem' }}>
          
          <h2 style={{ marginBottom: '1.5rem', color: '#0f172a' }}>Forgot Password</h2>
          
          {error && <div style={{ background: '#fee2e2', color: '#b91c1c', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>{error}</div>}
          {success && <div style={{ background: '#dcfce3', color: '#166534', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>Password reset link sent! Please check your email.</div>}

          {!success && (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="form-group">
                <label>Email Address</label>
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>

              <button type="submit" className="btn-primary" disabled={loading} style={{ marginTop: '1rem' }}>
                {loading ? 'Sending...' : 'Send Reset Link'}
              </button>
            </form>
          )}
          
          <p style={{ marginTop: '1.5rem', textAlign: 'center', color: '#64748b' }}>
            Remembered your password? <Link href="/login" style={{ color: '#0f766e', fontWeight: 'bold' }}>Back to login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
