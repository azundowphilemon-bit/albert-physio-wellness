'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Appointment {
  timestamp: string;
  firstName: string;
  lastName: string;
  patientStatus: string;
  insuranceType: string;
  appointmentDate: string;
  appointmentTime: string;
  appointmentDetails: string;
  status?: string;
}

const format12Hour = (time24: string) => {
  if (!time24) return '';
  const [h, m] = time24.split(':');
  const hours = parseInt(h, 10);
  const suffix = hours >= 12 ? 'PM' : 'AM';
  const hours12 = hours % 12 || 12;
  return `${hours12}:${m} ${suffix}`;
};

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [apptLoading, setApptLoading] = useState(false);
  const [cancellingKey, setCancellingKey] = useState<string | null>(null);
  const [rescheduling, setRescheduling] = useState<Appointment | null>(null);
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');
  const [rescheduleSlots, setRescheduleSlots] = useState<{time: string, booked: boolean}[]>([]);
  const [rescheduleLoading, setRescheduleLoading] = useState(false);
  const [rescheduleSaving, setRescheduleSaving] = useState(false);
  const [profileEdit, setProfileEdit] = useState(false);
  const [profileData, setProfileData] = useState({ firstName: '', lastName: '', phone: '', address: '', city: '' });
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMsg, setProfileMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/login');
      } else {
        setUser(session.user);
        fetchAppointments(session.user.email!);
        const meta = session.user.user_metadata || {};
        setProfileData({
          firstName: meta.first_name || '',
          lastName: meta.last_name || '',
          phone: meta.phone || '',
          address: meta.address || '',
          city: meta.city || '',
        });
      }
      setLoading(false);
    };
    checkAuth();
  }, [router]);

  const fetchAppointments = async (email: string) => {
    setApptLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      
      const res = await fetch(`/api/appointments?email=${encodeURIComponent(email)}`, {
        headers: { 'Authorization': `Bearer ${session.access_token}` }
      });
      const data = await res.json();
      setAppointments(data.appointments || []);
    } catch (err) {
      console.error('Failed to fetch appointments', err);
    } finally {
      setApptLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  const handleProfileSave = async () => {
    setProfileSaving(true);
    setProfileMsg(null);
    const { error } = await supabase.auth.updateUser({
      data: {
        first_name: profileData.firstName,
        last_name: profileData.lastName,
        phone: profileData.phone,
        address: profileData.address,
        city: profileData.city,
      }
    });
    if (error) {
      setProfileMsg({ type: 'error', text: error.message });
    } else {
      setProfileMsg({ type: 'success', text: 'Profile updated successfully.' });
      setProfileEdit(false);
      // Refresh user
      const { data: { session } } = await supabase.auth.getSession();
      if (session) setUser(session.user);
    }
    setProfileSaving(false);
  };

  const handleCancel = async (appt: Appointment) => {
    const key = `${appt.appointmentDate}-${appt.appointmentTime}`;
    if (!confirm(`Cancel your appointment on ${appt.appointmentDate} at ${appt.appointmentTime}?`)) return;
    setCancellingKey(key);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const res = await fetch('/api/cancel', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          email: user.email,
          appointmentDate: appt.appointmentDate,
          appointmentTime: appt.appointmentTime,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to cancel');
      // Refresh appointments
      fetchAppointments(user.email);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setCancellingKey(null);
    }
  };

  const handleRescheduleOpen = (appt: Appointment) => {
    setRescheduling(appt);
    setNewDate('');
    setNewTime('');
    setRescheduleSlots([]);
  };

  const handleRescheduleDateChange = async (date: string) => {
    setNewDate(date);
    setNewTime('');
    if (!date) { setRescheduleSlots([]); return; }
    setRescheduleLoading(true);
    try {
      const res = await fetch(`/api/availability?date=${date}`);
      const data = await res.json();
      const booked: string[] = data.bookedSlots || [];
      const slots = [];
      for (let i = 8; i <= 17; i++) {
        const t = `${i.toString().padStart(2, '0')}:00`;
        slots.push({ time: t, booked: booked.includes(t) });
      }
      setRescheduleSlots(slots);
    } catch { setRescheduleSlots([]); }
    finally { setRescheduleLoading(false); }
  };

  const handleRescheduleSave = async () => {
    if (!rescheduling || !newDate || !newTime) return;
    setRescheduleSaving(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const res = await fetch('/api/reschedule', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          email: user.email,
          oldDate: rescheduling.appointmentDate,
          oldTime: rescheduling.appointmentTime,
          newDate,
          newTime,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to reschedule');
      setRescheduling(null);
      fetchAppointments(user.email);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setRescheduleSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontSize: '1.2rem', color: '#0f766e' }}>
        Loading secure portal...
      </div>
    );
  }

  const firstName = user?.user_metadata?.first_name || 'Patient';
  const today = new Date().toISOString().split('T')[0];
  const upcoming = appointments.filter(a => a.appointmentDate >= today && a.status !== 'Cancelled');
  const past = appointments.filter(a => a.appointmentDate < today || a.status === 'Cancelled');

  return (
    <div className="landing-page" style={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>

      <header className="navbar" style={{ background: '#fff', borderBottom: '1px solid #e2e8f0' }}>
        <div className="container nav-container">
          <div className="logo-section">
            <span className="brand-text">Patient Portal</span>
          </div>
          <div className="nav-actions">
            <button onClick={handleLogout} className="btn outline sm-btn">Logout</button>
          </div>
        </div>
      </header>

      <main className="container fade-in" style={{ padding: '3rem 1rem' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', color: '#0f172a' }}>Hello, {firstName}! 👋</h1>
        <p style={{ color: '#64748b', marginBottom: '3rem' }}>Welcome to your secure patient dashboard.</p>

        <div className="services-grid" style={{ marginBottom: '3rem' }}>

          {/* Book CTA */}
          <div className="glass-card p-8" style={{ borderTop: '4px solid #0f766e', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
            <h2 style={{ marginBottom: '1rem', color: '#0f172a' }}>Ready for your next visit?</h2>
            <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>Book an appointment instantly through the portal.</p>
            <Link href="/book" className="btn primary full-w">Book Appointment Now</Link>
          </div>

          {/* Upcoming */}
          <div className="glass-card p-8" style={{ borderTop: '4px solid #0f766e' }}>
            <h2 style={{ marginBottom: '1rem', color: '#0f172a' }}>Upcoming Appointments</h2>
            {apptLoading ? (
              <p style={{ color: '#64748b' }}>Loading...</p>
            ) : upcoming.length === 0 ? (
              <p style={{ color: '#64748b' }}>No upcoming appointments.</p>
            ) : (
              upcoming.map((appt, i) => (
                <AppointmentCard
                  key={i}
                  appt={appt}
                  onCancel={() => handleCancel(appt)}
                  onReschedule={() => handleRescheduleOpen(appt)}
                  cancelling={cancellingKey === `${appt.appointmentDate}-${appt.appointmentTime}`}
                />
              ))
            )}
          </div>

        </div>

        {/* Past Appointments */}
        <div className="glass-card p-8" style={{ borderTop: '4px solid #cbd5e1' }}>
          <h2 style={{ marginBottom: '1rem', color: '#0f172a' }}>Past Appointments</h2>
          {apptLoading ? (
            <p style={{ color: '#64748b' }}>Loading...</p>
          ) : past.length === 0 ? (
            <p style={{ color: '#64748b' }}>No past appointments on record.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {past.map((appt, i) => (
                <AppointmentCard key={i} appt={appt} faded />
              ))}
            </div>
          )}
        </div>

        {/* Profile */}
        <div className="glass-card p-8" style={{ borderTop: '4px solid #0f766e', marginTop: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ color: '#0f172a' }}>My Profile</h2>
            {!profileEdit && (
              <button onClick={() => { setProfileEdit(true); setProfileMsg(null); }} className="btn outline sm-btn">
                Edit
              </button>
            )}
          </div>

          {profileMsg && (
            <div style={{ padding: '0.75rem 1rem', borderRadius: '8px', marginBottom: '1rem',
              background: profileMsg.type === 'success' ? '#dcfce7' : '#fee2e2',
              color: profileMsg.type === 'success' ? '#166534' : '#b91c1c' }}>
              {profileMsg.text}
            </div>
          )}

          {!profileEdit ? (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              {[
                { label: 'First Name', value: profileData.firstName },
                { label: 'Last Name', value: profileData.lastName },
                { label: 'Phone', value: profileData.phone },
                { label: 'Email', value: user?.email },
                { label: 'Address', value: profileData.address || '—' },
                { label: 'City', value: profileData.city || '—' },
              ].map(({ label, value }) => (
                <div key={label}>
                  <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '0.25rem' }}>{label}</p>
                  <p style={{ color: '#0f172a', fontWeight: 500 }}>{value}</p>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="form-row">
                <div className="form-group">
                  <label>First Name</label>
                  <input type="text" value={profileData.firstName} onChange={e => setProfileData({ ...profileData, firstName: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Last Name</label>
                  <input type="text" value={profileData.lastName} onChange={e => setProfileData({ ...profileData, lastName: e.target.value })} />
                </div>
              </div>
              <div className="form-group">
                <label>Phone Number</label>
                <input type="tel" value={profileData.phone} onChange={e => setProfileData({ ...profileData, phone: e.target.value })} />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Address</label>
                  <input type="text" value={profileData.address} onChange={e => setProfileData({ ...profileData, address: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>City</label>
                  <input type="text" value={profileData.city} onChange={e => setProfileData({ ...profileData, city: e.target.value })} />
                </div>
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                <button onClick={handleProfileSave} disabled={profileSaving} className="btn primary sm-btn">
                  {profileSaving ? 'Saving...' : 'Save Changes'}
                </button>
                <button onClick={() => { setProfileEdit(false); setProfileMsg(null); }} className="btn outline sm-btn">
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Reschedule Modal */}
        {rescheduling && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
            <div className="glass-card p-8 fade-in" style={{ maxWidth: '480px', width: '100%', maxHeight: '90vh', overflowY: 'auto' }}>
              <h2 style={{ color: '#0f172a', marginBottom: '0.5rem' }}>Reschedule Appointment</h2>
              <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                Current: {new Date(rescheduling.appointmentDate + 'T12:00:00').toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })} at {format12Hour(rescheduling.appointmentTime)}
              </p>

              <div className="form-group">
                <label>New Date</label>
                <input type="date" value={newDate} min={new Date().toISOString().split('T')[0]}
                  onChange={e => handleRescheduleDateChange(e.target.value)} />
              </div>

              {newDate && (
                <div className="form-group">
                  <label>New Time {rescheduleLoading && <span style={{ color: '#0f766e', fontSize: '0.8rem' }}>(Loading...)</span>}</label>
                  <div className="time-slot-grid" style={{ opacity: rescheduleLoading ? 0.5 : 1 }}>
                    {rescheduleSlots.map(slot => (
                      <div key={slot.time}
                        className={`time-slot ${slot.booked ? 'booked' : ''} ${newTime === slot.time ? 'selected' : ''}`}
                        onClick={() => !slot.booked && !rescheduleLoading && setNewTime(slot.time)}>
                        {format12Hour(slot.time)}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                <button onClick={handleRescheduleSave} disabled={!newDate || !newTime || rescheduleSaving}
                  className="btn primary" style={{ flex: 1 }}>
                  {rescheduleSaving ? 'Saving...' : 'Confirm Reschedule'}
                </button>
                <button onClick={() => setRescheduling(null)} className="btn outline" style={{ flex: 1 }}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}

function AppointmentCard({ appt, faded, onCancel, onReschedule, cancelling }: {
  appt: Appointment;
  faded?: boolean;
  onCancel?: () => void;
  onReschedule?: () => void;
  cancelling?: boolean;
}) {
  const dateLabel = new Date(appt.appointmentDate + 'T12:00:00').toLocaleDateString('en-GB', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });

  return (
    <div style={{
      padding: '1rem',
      borderRadius: '10px',
      background: faded ? '#f8fafc' : '#f0fdf4',
      border: `1px solid ${faded ? '#e2e8f0' : '#bbf7d0'}`,
      marginBottom: '0.75rem',
      opacity: faded ? 0.8 : 1,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div>
          <p style={{ fontWeight: 'bold', color: '#0f172a', marginBottom: '0.25rem' }}>{dateLabel} at {format12Hour(appt.appointmentTime)}</p>
          <p style={{ color: '#64748b', fontSize: '0.9rem' }}>{appt.appointmentDetails}</p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <span style={{ fontSize: '0.75rem', padding: '0.25rem 0.75rem', borderRadius: '999px', background: '#e0f2fe', color: '#0369a1' }}>
            {appt.patientStatus}
          </span>
          <span style={{ fontSize: '0.75rem', padding: '0.25rem 0.75rem', borderRadius: '999px', background: '#fef9c3', color: '#854d0e' }}>
            {appt.insuranceType}
          </span>
          {appt.status === 'Cancelled' && (
            <span style={{ fontSize: '0.75rem', padding: '0.25rem 0.75rem', borderRadius: '999px', background: '#fee2e2', color: '#b91c1c' }}>
              Cancelled
            </span>
          )}
          {onCancel && appt.status !== 'Cancelled' && (
            <button onClick={onCancel} disabled={cancelling}
              style={{ fontSize: '0.75rem', padding: '0.25rem 0.75rem', borderRadius: '999px',
                background: '#fff', border: '1px solid #fca5a5', color: '#dc2626',
                cursor: cancelling ? 'not-allowed' : 'pointer', opacity: cancelling ? 0.6 : 1 }}>
              {cancelling ? 'Cancelling...' : 'Cancel'}
            </button>
          )}
          {onReschedule && appt.status !== 'Cancelled' && (
            <button onClick={onReschedule}
              style={{ fontSize: '0.75rem', padding: '0.25rem 0.75rem', borderRadius: '999px',
                background: '#fff', border: '1px solid #a5b4fc', color: '#4f46e5', cursor: 'pointer' }}>
              Reschedule
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
