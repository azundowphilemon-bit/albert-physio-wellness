'use client';

import { useState } from 'react';

type CheckStatus = 'ok' | 'error' | 'warning';
interface HealthResult { status: CheckStatus; message: string; detail?: string; }
interface HealthData { results: Record<string, HealthResult>; checkedAt: string; }

const TROUBLESHOOTING = [
  {
    id: 'sheets',
    title: 'Appointments not recording in Google Sheets',
    symptoms: ['Booking succeeds but no row appears in the sheet', 'Console shows "Google Sheets Error"'],
    causes: ['Service account not shared on the sheet', 'Wrong GOOGLE_SHEET_ID in .env.local', 'GOOGLE_PRIVATE_KEY has broken line breaks'],
    fixes: [
      { step: 1, action: 'Open Google Sheets → Share → add sheet-writer@albert-physio.iam.gserviceaccount.com as Editor' },
      { step: 2, action: 'Verify GOOGLE_SHEET_ID in .env.local matches the ID in the sheet URL' },
      { step: 3, action: 'Ensure GOOGLE_PRIVATE_KEY in .env.local has \\n (not actual newlines) between key lines' },
      { step: 4, action: 'Restart the dev server after any .env.local change' },
    ],
    file: 'src/app/api/book/route.ts',
  },
  {
    id: 'calendar',
    title: 'Appointments not appearing in Google Calendar',
    symptoms: ['Booking succeeds but no calendar event created', 'Console shows "Google Calendar Error"'],
    causes: ['Service account not added to the calendar', 'Wrong GOOGLE_CALENDAR_ID', 'Calendar API not enabled in Google Cloud'],
    fixes: [
      { step: 1, action: 'Open Google Calendar → Settings → Share with specific people → add sheet-writer@albert-physio.iam.gserviceaccount.com with "Make changes to events" permission' },
      { step: 2, action: 'Verify GOOGLE_CALENDAR_ID in .env.local (find it in Calendar Settings → Integrate calendar)' },
      { step: 3, action: 'Go to Google Cloud Console → APIs & Services → Enable "Google Calendar API" for the project' },
    ],
    file: 'src/app/api/book/route.ts',
  },
  {
    id: 'email',
    title: 'Email notifications not being sent',
    symptoms: ['Booking succeeds but clinic receives no email', 'Console shows "Email credentials not found"'],
    causes: ['EMAIL_USER or EMAIL_PASS missing from .env.local', 'Gmail app password expired or revoked', 'Less secure app access disabled'],
    fixes: [
      { step: 1, action: 'Go to Google Account → Security → 2-Step Verification → App Passwords → generate a new password' },
      { step: 2, action: 'Update EMAIL_PASS in .env.local with the new 16-character app password (no spaces)' },
      { step: 3, action: 'Ensure EMAIL_USER is the full Gmail address (e.g. azundowphilemon@gmail.com)' },
      { step: 4, action: 'Restart the dev server' },
    ],
    file: 'src/app/api/book/route.ts',
  },
  {
    id: 'supabase-auth',
    title: 'Patients cannot register or login',
    symptoms: ['Register shows "Email rate limit exceeded"', 'Login shows "Invalid Email or Password"', 'Users not appearing in Supabase dashboard'],
    causes: ['Supabase email rate limit hit (free tier: 2/hour)', 'Email confirmation still enabled', 'Wrong Supabase URL or anon key'],
    fixes: [
      { step: 1, action: 'Go to Supabase Dashboard → Authentication → Providers → Email → disable "Confirm email"' },
      { step: 2, action: 'Go to Authentication → Emails → SMTP Settings → configure custom SMTP with Gmail credentials' },
      { step: 3, action: 'Verify NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local match your Supabase project settings' },
    ],
    file: 'src/lib/supabase.ts',
  },
  {
    id: 'booking-redirect',
    title: 'Patients can access /book without logging in',
    symptoms: ['Booking page loads without authentication', 'Form shows without session check'],
    causes: ['Auth check removed or broken in book/page.tsx', 'router.replace not firing'],
    fixes: [
      { step: 1, action: 'Open src/app/book/page.tsx — verify the useEffect checks supabase.auth.getSession() and calls router.replace("/login?redirect=/book") if no session' },
      { step: 2, action: 'Ensure the loading guard "if (!authChecked || !isAuthenticated)" is present before the return statement' },
    ],
    file: 'src/app/book/page.tsx',
  },
  {
    id: 'payment',
    title: 'Payment not updating Google Sheets',
    symptoms: ['Payment succeeds but column O stays empty', 'Payment API returns 404 "Appointment not found"'],
    causes: ['Header row in Sheet not being skipped', 'Email/date/time mismatch between booking and payment data'],
    fixes: [
      { step: 1, action: 'Open src/app/api/payment/route.ts — verify rowIndex search starts at i > 0 to skip the header row' },
      { step: 2, action: 'Check that column O in your sheet is labeled "Payment Status" (row 1)' },
      { step: 3, action: 'Confirm the email, appointmentDate, and appointmentTime sent to /api/payment exactly match what was saved during booking' },
    ],
    file: 'src/app/api/payment/route.ts',
  },
  {
    id: 'cancel',
    title: 'Appointment cancellation not working',
    symptoms: ['Cancel button shows error', 'Appointment not marked as Cancelled in sheet', 'Calendar event not deleted'],
    causes: ['Row not found due to header skip issue', 'Calendar event time mismatch', 'Service account missing calendar delete permission'],
    fixes: [
      { step: 1, action: 'Open src/app/api/cancel/route.ts — verify rowIndex search skips header (i > 0)' },
      { step: 2, action: 'Check Google Calendar sharing — service account needs "Make changes to events" permission' },
      { step: 3, action: 'Verify GOOGLE_CALENDAR_ID is correct in .env.local' },
    ],
    file: 'src/app/api/cancel/route.ts',
  },
  {
    id: 'env',
    title: 'Environment variables not loading',
    symptoms: ['All Google/Supabase features broken after deployment', 'Console shows "credentials not found" warnings'],
    causes: ['.env.local not present or not loaded', 'Variables not set in hosting platform (Vercel/Netlify)', 'Typo in variable name'],
    fixes: [
      { step: 1, action: 'Ensure .env.local exists in the root of albert-physio-app/ folder' },
      { step: 2, action: 'If deployed on Vercel: go to Project Settings → Environment Variables → add all variables from .env.local' },
      { step: 3, action: 'Variable names are case-sensitive — double check spelling matches exactly' },
      { step: 4, action: 'NEXT_PUBLIC_ prefix is required for variables used in the browser (Supabase URL and anon key)' },
      { step: 5, action: 'Always restart the dev server after editing .env.local' },
    ],
    file: '.env.local',
  },
];

const statusColor: Record<CheckStatus, { bg: string; color: string; label: string }> = {
  ok:      { bg: '#dcfce7', color: '#166534', label: '✓ OK' },
  warning: { bg: '#fef9c3', color: '#854d0e', label: '⚠ Warning' },
  error:   { bg: '#fee2e2', color: '#b91c1c', label: '✗ Error' },
};

const serviceLabels: Record<string, string> = {
  googleSheets: 'Google Sheets',
  googleCalendar: 'Google Calendar',
  supabase: 'Supabase Auth',
  email: 'Email (SMTP)',
  envVars: 'Environment Variables',
};

export default function ITAdminPage() {
  const [password, setPassword] = useState('');
  const [authed, setAuthed] = useState(false);
  const [authError, setAuthError] = useState('');
  const [health, setHealth] = useState<HealthData | null>(null);
  const [healthLoading, setHealthLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'health' | 'troubleshooting'>('health');
  const [expandedIssue, setExpandedIssue] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setHealthLoading(true);
    const res = await fetch(`/api/it/health?password=${encodeURIComponent(password)}`);
    if (res.status === 401) { setAuthError('Incorrect password.'); setHealthLoading(false); return; }
    const data = await res.json();
    setHealth(data);
    setAuthed(true);
    setHealthLoading(false);
  };

  const runHealthCheck = async () => {
    setHealthLoading(true);
    const res = await fetch(`/api/it/health?password=${encodeURIComponent(password)}`);
    const data = await res.json();
    setHealth(data);
    setHealthLoading(false);
  };

  if (!authed) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0f172a' }}>
        <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '16px', padding: '2.5rem', maxWidth: '400px', width: '100%' }}>
          <div style={{ marginBottom: '2rem' }}>
            <p style={{ color: '#0d9488', fontSize: '0.8rem', fontWeight: 600, letterSpacing: '1px', marginBottom: '0.5rem' }}>ALBERT PHYSIO</p>
            <h1 style={{ color: '#f1f5f9', fontSize: '1.75rem', fontFamily: 'Outfit, sans-serif' }}>IT Admin Portal</h1>
            <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '0.5rem' }}>System diagnostics & troubleshooting</p>
          </div>
          {authError && <div style={{ background: '#450a0a', color: '#fca5a5', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.9rem' }}>{authError}</div>}
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ color: '#94a3b8', fontSize: '0.85rem', display: 'block', marginBottom: '0.5rem' }}>IT Admin Password</label>
              <input type="password" required value={password} onChange={e => setPassword(e.target.value)}
                style={{ width: '100%', padding: '0.85rem 1rem', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', color: '#f1f5f9', fontSize: '1rem' }}
                placeholder="••••••••" />
            </div>
            <button type="submit" disabled={healthLoading}
              style={{ padding: '0.85rem', background: '#0d9488', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '1rem', fontWeight: 600, cursor: 'pointer' }}>
              {healthLoading ? 'Connecting...' : 'Access Dashboard'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  const overallStatus = health ? Object.values(health.results).some(r => r.status === 'error') ? 'error'
    : Object.values(health.results).some(r => r.status === 'warning') ? 'warning' : 'ok' : 'ok';

  return (
    <div style={{ minHeight: '100vh', background: '#0f172a', color: '#f1f5f9', fontFamily: 'Inter, sans-serif' }}>

      {/* Header */}
      <header style={{ background: '#1e293b', borderBottom: '1px solid #334155', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <p style={{ color: '#0d9488', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '1px' }}>ALBERT PHYSIO</p>
          <h1 style={{ fontSize: '1.25rem', fontFamily: 'Outfit, sans-serif', color: '#f1f5f9' }}>IT Admin Dashboard</h1>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
            Last check: {health ? new Date(health.checkedAt).toLocaleTimeString() : '—'}
          </span>
          <button onClick={runHealthCheck} disabled={healthLoading}
            style={{ padding: '0.5rem 1rem', background: '#0d9488', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '0.85rem', cursor: 'pointer' }}>
            {healthLoading ? 'Checking...' : '↻ Run Check'}
          </button>
          <button onClick={() => { setAuthed(false); setPassword(''); }}
            style={{ padding: '0.5rem 1rem', background: 'transparent', color: '#64748b', border: '1px solid #334155', borderRadius: '6px', fontSize: '0.85rem', cursor: 'pointer' }}>
            Logout
          </button>
        </div>
      </header>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>

        {/* Overall status banner */}
        {health && (
          <div style={{
            padding: '1rem 1.5rem', borderRadius: '12px', marginBottom: '2rem',
            background: overallStatus === 'ok' ? '#052e16' : overallStatus === 'warning' ? '#422006' : '#450a0a',
            border: `1px solid ${overallStatus === 'ok' ? '#166534' : overallStatus === 'warning' ? '#854d0e' : '#b91c1c'}`,
            display: 'flex', alignItems: 'center', gap: '1rem',
          }}>
            <span style={{ fontSize: '1.5rem' }}>{overallStatus === 'ok' ? '✅' : overallStatus === 'warning' ? '⚠️' : '🚨'}</span>
            <div>
              <p style={{ fontWeight: 600, color: overallStatus === 'ok' ? '#4ade80' : overallStatus === 'warning' ? '#fbbf24' : '#f87171' }}>
                {overallStatus === 'ok' ? 'All systems operational' : overallStatus === 'warning' ? 'Some systems need attention' : 'Critical issues detected'}
              </p>
              <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
                {Object.values(health.results).filter(r => r.status === 'error').length} errors,{' '}
                {Object.values(health.results).filter(r => r.status === 'warning').length} warnings
              </p>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', borderBottom: '1px solid #334155', paddingBottom: '0' }}>
          {(['health', 'troubleshooting'] as const).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              style={{
                padding: '0.75rem 1.5rem', background: 'transparent', border: 'none', cursor: 'pointer',
                color: activeTab === tab ? '#0d9488' : '#64748b',
                borderBottom: activeTab === tab ? '2px solid #0d9488' : '2px solid transparent',
                fontWeight: activeTab === tab ? 600 : 400, fontSize: '0.95rem', textTransform: 'capitalize',
              }}>
              {tab === 'health' ? '🔍 System Health' : '🛠 Troubleshooting Guide'}
            </button>
          ))}
        </div>

        {/* Health Tab */}
        {activeTab === 'health' && health && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1rem' }}>
            {Object.entries(health.results).map(([key, result]) => {
              const s = statusColor[result.status];
              return (
                <div key={key} style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '12px', padding: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                    <h3 style={{ fontSize: '1rem', color: '#f1f5f9', fontFamily: 'Outfit, sans-serif' }}>{serviceLabels[key] || key}</h3>
                    <span style={{ fontSize: '0.75rem', padding: '0.2rem 0.6rem', borderRadius: '999px', background: s.bg, color: s.color, fontWeight: 600 }}>
                      {s.label}
                    </span>
                  </div>
                  <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '0.5rem' }}>{result.message}</p>
                  {result.detail && <p style={{ color: '#475569', fontSize: '0.8rem', fontFamily: 'monospace', background: '#0f172a', padding: '0.5rem', borderRadius: '6px', wordBreak: 'break-all' }}>{result.detail}</p>}
                  {result.status === 'error' && (
                    <button onClick={() => { setActiveTab('troubleshooting'); }}
                      style={{ marginTop: '0.75rem', fontSize: '0.8rem', color: '#0d9488', background: 'transparent', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>
                      View fix →
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Troubleshooting Tab */}
        {activeTab === 'troubleshooting' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {TROUBLESHOOTING.map(issue => (
              <div key={issue.id} style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '12px', overflow: 'hidden' }}>
                <button onClick={() => setExpandedIssue(expandedIssue === issue.id ? null : issue.id)}
                  style={{ width: '100%', padding: '1.25rem 1.5rem', background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', textAlign: 'left' }}>
                  <div>
                    <h3 style={{ color: '#f1f5f9', fontSize: '1rem', fontFamily: 'Outfit, sans-serif', marginBottom: '0.25rem' }}>{issue.title}</h3>
                    <p style={{ color: '#475569', fontSize: '0.8rem', fontFamily: 'monospace' }}>📁 {issue.file}</p>
                  </div>
                  <span style={{ color: '#64748b', fontSize: '1.2rem' }}>{expandedIssue === issue.id ? '▲' : '▼'}</span>
                </button>

                {expandedIssue === issue.id && (
                  <div style={{ padding: '0 1.5rem 1.5rem', borderTop: '1px solid #334155' }}>

                    <div style={{ marginTop: '1.25rem', marginBottom: '1.25rem' }}>
                      <p style={{ color: '#94a3b8', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.5rem', letterSpacing: '0.5px' }}>SYMPTOMS</p>
                      {issue.symptoms.map((s, i) => (
                        <p key={i} style={{ color: '#f87171', fontSize: '0.875rem', marginBottom: '0.25rem' }}>• {s}</p>
                      ))}
                    </div>

                    <div style={{ marginBottom: '1.25rem' }}>
                      <p style={{ color: '#94a3b8', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.5rem', letterSpacing: '0.5px' }}>POSSIBLE CAUSES</p>
                      {issue.causes.map((c, i) => (
                        <p key={i} style={{ color: '#fbbf24', fontSize: '0.875rem', marginBottom: '0.25rem' }}>• {c}</p>
                      ))}
                    </div>

                    <div>
                      <p style={{ color: '#94a3b8', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.75rem', letterSpacing: '0.5px' }}>HOW TO FIX</p>
                      {issue.fixes.map(fix => (
                        <div key={fix.step} style={{ display: 'flex', gap: '1rem', marginBottom: '0.75rem', alignItems: 'flex-start' }}>
                          <span style={{ background: '#0d9488', color: '#fff', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700, flexShrink: 0 }}>
                            {fix.step}
                          </span>
                          <p style={{ color: '#cbd5e1', fontSize: '0.875rem', lineHeight: 1.6 }}>{fix.action}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
