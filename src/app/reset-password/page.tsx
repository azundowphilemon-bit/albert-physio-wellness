'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    const { error: updateError } = await supabase.auth.updateUser({
      password: password
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
    }, 2000);
  };

  return (
    <div className="layout-2-col" style={{ minHeight: '100vh' }}>
      <div className="left-col bg-pattern p-8" style={{ display: 'flex', flexDirection: 'column', padding: '10%' }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '1rem', color: '#fff' }}>Secure Your Account</h1>
        <p style={{ fontSize: '1.2rem', color: '#e2e8f0', marginBottom: '2rem' }}>
          Please enter your new password below.
        </p>
      </div>

      <div className="right-col p-8" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="glass-card fade-in" style={{ maxWidth: '400px', width: '100%', padding: '2rem' }}>
          
          <h2 style={{ marginBottom: '1.5rem', color: '#0f172a' }}>Set New Password</h2>
          
          {error && <div style={{ background: '#fee2e2', color: '#b91c1c', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>{error}</div>}
          {success && <div style={{ background: '#dcfce3', color: '#166534', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>Password updated successfully! Redirecting...</div>}

          {!success && (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="form-group">
                <label>New Password</label>
                <input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>

              <div className="form-group">
                <label>Confirm Password</label>
                <input type="password" required minLength={6} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
              </div>

              <button type="submit" className="btn-primary" disabled={loading} style={{ marginTop: '1rem' }}>
                {loading ? 'Updating...' : 'Update Password'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
