'use client';

import { useState } from 'react';

interface Appointment {
  rowIndex: number;
  timestamp: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  patientStatus: string;
  insuranceType: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  appointmentDate: string;
  appointmentTime: string;
  appointmentDetails: string;
  status: string;
  paymentStatus?: string;
}

export default function AdminPage() {
  const format12Hour = (time24: string) => {
    if (!time24) return '';
    const [h, m] = time24.split(':');
    const hours = parseInt(h, 10);
    const suffix = hours >= 12 ? 'PM' : 'AM';
    const hours12 = hours % 12 || 12;
    return `${hours12}:${m} ${suffix}`;
  };

  const [password, setPassword] = useState('');
  const [authed, setAuthed] = useState(false);
  const [authError, setAuthError] = useState('');
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);
  const [cancellingKey, setCancellingKey] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'past' | 'cancelled'>('upcoming');
  const [search, setSearch] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setAuthError('');
    try {
      const res = await fetch(`/api/admin/appointments?password=${encodeURIComponent(password)}`);
      if (res.status === 401) { setAuthError('Incorrect password.'); setLoading(false); return; }
      const data = await res.json();
      setAppointments(data.appointments || []);
      setAuthed(true);
    } catch {
      setAuthError('Failed to connect. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const refresh = async () => {
    const res = await fetch(`/api/admin/appointments?password=${encodeURIComponent(password)}`);
    const data = await res.json();
    setAppointments(data.appointments || []);
  };

  const handleCancel = async (appt: Appointment) => {
    const key = `${appt.appointmentDate}-${appt.appointmentTime}`;
    if (!confirm(`Cancel appointment for ${appt.firstName} ${appt.lastName} on ${appt.appointmentDate} at ${appt.appointmentTime}?`)) return;
    setCancellingKey(key);
    try {
      const res = await fetch('/api/cancel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: appt.email, appointmentDate: appt.appointmentDate, appointmentTime: appt.appointmentTime }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to cancel');
      await refresh();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setCancellingKey(null);
    }
  };

  const today = new Date().toISOString().split('T')[0];

  const filtered = appointments.filter(a => {
    const matchSearch = search === '' ||
      `${a.firstName} ${a.lastName} ${a.email} ${a.phone}`.toLowerCase().includes(search.toLowerCase());
    if (!matchSearch) return false;
    if (filter === 'upcoming') return a.appointmentDate >= today && a.status !== 'Cancelled';
    if (filter === 'past') return a.appointmentDate < today && a.status !== 'Cancelled';
    if (filter === 'cancelled') return a.status === 'Cancelled';
    return true;
  });

  const counts = {
    upcoming: appointments.filter(a => a.appointmentDate >= today && a.status !== 'Cancelled').length,
    past: appointments.filter(a => a.appointmentDate < today && a.status !== 'Cancelled').length,
    cancelled: appointments.filter(a => a.status === 'Cancelled').length,
    all: appointments.length,
  };

  if (!authed) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc' }}>
        <div className="glass-card fade-in" style={{ maxWidth: '400px', width: '100%', padding: '2.5rem' }}>
          <h1 style={{ fontSize: '1.75rem', marginBottom: '0.5rem', color: '#0f172a' }}>Admin Portal</h1>
          <p style={{ color: '#64748b', marginBottom: '2rem' }}>Enter the admin password to continue.</p>
          {authError && (
            <div style={{ background: '#fee2e2', color: '#b91c1c', padding: '0.75rem 1rem', borderRadius: '8px', marginBottom: '1rem' }}>
              {authError}
            </div>
          )}
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="form-group">
              <label>Password</label>
              <input type="password" required value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" />
            </div>
            <button type="submit" className="btn primary" disabled={loading}>
              {loading ? 'Verifying...' : 'Enter Dashboard'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      <header className="navbar" style={{ background: '#0f172a', borderBottom: '1px solid #1e293b' }}>
        <div className="container nav-container">
          <span className="brand-text" style={{ color: '#fff' }}>Admin Dashboard</span>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>{appointments.length} total records</span>
            <button onClick={() => { setAuthed(false); setPassword(''); }} className="btn outline sm-btn" style={{ color: '#fff', borderColor: '#475569' }}>
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="container fade-in" style={{ padding: '2rem 1rem' }}>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
          {(['upcoming', 'past', 'cancelled', 'all'] as const).map(key => (
            <div
              key={key}
              onClick={() => setFilter(key)}
              style={{
                padding: '1.25rem', borderRadius: '12px', cursor: 'pointer', textAlign: 'center',
                background: filter === key ? '#0f766e' : '#fff',
                color: filter === key ? '#fff' : '#0f172a',
                border: `2px solid ${filter === key ? '#0f766e' : '#e2e8f0'}`,
                transition: 'all 0.2s',
              }}
            >
              <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0 }}>{counts[key]}</p>
              <p style={{ fontSize: '0.8rem', margin: 0, opacity: 0.8, textTransform: 'capitalize' }}>{key}</p>
            </div>
          ))}
        </div>

        {/* Search */}
        <div className="form-group" style={{ marginBottom: '1.5rem', maxWidth: '400px' }}>
          <input
            type="text"
            placeholder="Search by name, email or phone..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {/* Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
            <thead>
              <tr style={{ background: '#f1f5f9' }}>
                {['Patient', 'Contact', 'Date & Time', 'Reason', 'Insurance', 'Payment', 'Status', 'Action'].map(h => (
                  <th key={h} style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.8rem', color: '#64748b', fontWeight: 600, whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>No appointments found.</td>
                </tr>
              ) : filtered.map((appt, i) => {
                const key = `${appt.appointmentDate}-${appt.appointmentTime}`;
                const isPast = appt.appointmentDate < today;
                return (
                  <tr key={i} style={{ borderTop: '1px solid #f1f5f9', opacity: isPast ? 0.75 : 1 }}>
                    <td style={{ padding: '0.75rem 1rem' }}>
                      <p style={{ fontWeight: 600, color: '#0f172a', margin: 0 }}>{appt.firstName} {appt.lastName}</p>
                      <p style={{ fontSize: '0.75rem', color: '#94a3b8', margin: 0 }}>DOB: {appt.dateOfBirth || '—'}</p>
                    </td>
                    <td style={{ padding: '0.75rem 1rem' }}>
                      <p style={{ margin: 0, fontSize: '0.85rem', color: '#334155' }}>{appt.email}</p>
                      <p style={{ margin: 0, fontSize: '0.85rem', color: '#334155' }}>{appt.phone}</p>
                    </td>
                    <td style={{ padding: '0.75rem 1rem', whiteSpace: 'nowrap' }}>
                      <p style={{ fontWeight: 600, margin: 0, color: '#0f172a' }}>{appt.appointmentDate}</p>
                      <p style={{ margin: 0, color: '#64748b', fontSize: '0.85rem' }}>{format12Hour(appt.appointmentTime)}</p>
                    </td>
                    <td style={{ padding: '0.75rem 1rem', maxWidth: '180px' }}>
                      <p style={{ margin: 0, fontSize: '0.85rem', color: '#334155', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {appt.appointmentDetails}
                      </p>
                    </td>
                    <td style={{ padding: '0.75rem 1rem' }}>
                      <span style={{ fontSize: '0.75rem', padding: '0.2rem 0.6rem', borderRadius: '999px', background: '#fef9c3', color: '#854d0e' }}>
                        {appt.insuranceType}
                      </span>
                    </td>
                    <td style={{ padding: '0.75rem 1rem' }}>
                      <span style={{
                        fontSize: '0.75rem', padding: '0.2rem 0.6rem', borderRadius: '999px',
                        background: appt.paymentStatus?.includes('Deposit') ? '#dcfce7' : '#fee2e2',
                        color: appt.paymentStatus?.includes('Deposit') ? '#166534' : '#b91c1c',
                      }}>
                        {appt.paymentStatus?.includes('Deposit') ? appt.paymentStatus : 'Pending'}
                      </span>
                    </td>
                    <td style={{ padding: '0.75rem 1rem' }}>
                      <span style={{
                        fontSize: '0.75rem', padding: '0.2rem 0.6rem', borderRadius: '999px',
                        background: appt.status === 'Cancelled' ? '#fee2e2' : isPast ? '#f1f5f9' : '#dcfce7',
                        color: appt.status === 'Cancelled' ? '#b91c1c' : isPast ? '#64748b' : '#166534',
                      }}>
                        {appt.status === 'Cancelled' ? 'Cancelled' : isPast ? 'Completed' : 'Upcoming'}
                      </span>
                    </td>
                    <td style={{ padding: '0.75rem 1rem' }}>
                      {appt.status !== 'Cancelled' && !isPast && (
                        <button
                          onClick={() => handleCancel(appt)}
                          disabled={cancellingKey === key}
                          style={{
                            fontSize: '0.75rem', padding: '0.25rem 0.75rem', borderRadius: '6px',
                            background: '#fff', border: '1px solid #fca5a5', color: '#dc2626',
                            cursor: cancellingKey === key ? 'not-allowed' : 'pointer',
                            opacity: cancellingKey === key ? 0.6 : 1,
                          }}
                        >
                          {cancellingKey === key ? 'Cancelling...' : 'Cancel'}
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
