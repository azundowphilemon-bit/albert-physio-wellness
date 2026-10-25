'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

const format12Hour = (time24: string) => {
  if (!time24) return '';
  const [h, m] = time24.split(':');
  const hours = parseInt(h, 10);
  const suffix = hours >= 12 ? 'PM' : 'AM';
  const hours12 = hours % 12 || 12;
  return `${hours12}:${m} ${suffix}`;
};

export default function Home() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    patientStatus: 'new',
    insuranceType: 'public',
    appointmentDate: '',
    appointmentTime: '',
    appointmentDetails: ''
  });
  
  const CONSULTATION_FEE = 300;
  const DEPOSIT_AMOUNT = CONSULTATION_FEE * 0.30; // 90 GHS
  const BALANCE_AMOUNT = CONSULTATION_FEE - DEPOSIT_AMOUNT; // 210 GHS

  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'processing' | 'paid' | 'error'>('pending');
  const [paymentError, setPaymentError] = useState('');
  const [cardData, setCardData] = useState({ cardNumber: '', expiryDate: '', cvv: '', cardName: '' });
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [availableTimeSlots, setAvailableTimeSlots] = useState<{time: string, booked: boolean}[]>([]);
  const [checkingAvailability, setCheckingAvailability] = useState(false);

  useEffect(() => {
    async function checkSession() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.replace('/login?redirect=/book');
        return;
      }
      const meta = session.user.user_metadata || {};
      setFormData(prev => ({
        ...prev,
        firstName: meta.first_name || '',
        lastName: meta.last_name || '',
        dateOfBirth: meta.date_of_birth || '',
        phone: meta.phone || '',
        email: session.user.email || '',
        address: meta.address || '',
        city: meta.city || '',
        patientStatus: 'returning'
      }));
      setIsAuthenticated(true);
      setAuthChecked(true);
    }
    checkSession();
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  useEffect(() => {
    if (!formData.appointmentDate) {
      setAvailableTimeSlots([]);
      return;
    }

    async function fetchAvailability() {
      setCheckingAvailability(true);
      try {
        const res = await fetch(`/api/availability?date=${formData.appointmentDate}`);
        if (!res.ok) throw new Error('Failed to fetch availability');
        
        const data = await res.json();
        const bookedSlotsArr: string[] = data.bookedSlots || [];

        const slots = [];
        for (let i = 8; i <= 17; i++) {
          const timeString = `${i.toString().padStart(2, '0')}:00`;
          slots.push({ 
            time: timeString, 
            booked: bookedSlotsArr.includes(timeString) 
          });
        }
        setAvailableTimeSlots(slots);
      } catch (err) {
        console.error(err);
        // Fallback to all slots available if API fails
        const slots = [];
        for (let i = 8; i <= 17; i++) {
          slots.push({ time: `${i.toString().padStart(2, '0')}:00`, booked: false });
        }
        setAvailableTimeSlots(slots);
      } finally {
        setCheckingAvailability(false);
      }
    }

    fetchAvailability();
  }, [formData.appointmentDate]);

  const handleTimeSelect = (timeStr: string, isBooked: boolean) => {
    if (isBooked) return;
    setFormData({ ...formData, appointmentTime: timeStr });
  };

  const nextStep = () => {
    if (step === 2 && !formData.appointmentTime) {
      setErrorMessage("Please select an available time slot");
      return;
    }
    setErrorMessage('');
    
    // Skip step 3 if authenticated
    if (step === 2 && isAuthenticated) {
      setStep(4);
    } else {
      setStep((prev) => prev + 1);
    }
  };
  const prevStep = () => {
    // Return from step 4 directly to 2 if authenticated
    if (step === 4 && isAuthenticated) {
      setStep(2);
    } else {
      setStep((prev) => prev - 1);
    }
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setPaymentStatus('processing');
    setPaymentError('');
    try {
      const res = await fetch('/api/payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          appointmentDate: formData.appointmentDate,
          appointmentTime: formData.appointmentTime,
          cardNumber: cardData.cardNumber,
          expiryDate: cardData.expiryDate,
          cvv: cardData.cvv,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Payment failed.');
      setPaymentStatus('paid');
    } catch (err: any) {
      setPaymentError(err.message);
      setPaymentStatus('error');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    try {
      const response = await fetch('/api/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to book appointment.');
      }

      setStatus('success');
    } catch (err: any) {
      console.error(err);
      setStatus('error');
      setErrorMessage(err.message || 'Something went wrong. Please try again later.');
    }
  };

  if (!authChecked || !isAuthenticated) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: '#0f766e', fontSize: '1.1rem' }}>
        Checking session...
      </div>
    );
  }

  return (
    <main className="container layout-2-col">
      <div className="left-col">
        <div className="hero fade-in">
          <div className="logo-container">
            <Image 
              src="/logo.png" 
              alt="Albert Physio & Wellness Logo" 
              width={140} 
              height={140} 
              className="logo-img" 
            />
            <div className="title-wrapper">
              <h1>ACOOR</h1>
              <p style={{ fontWeight: 600, color: 'var(--primary-color)', fontSize: '0.88rem', margin: '-0.2rem 0 0.3rem 0' }}>Africa Clinic of Osteopathy & Rehabilitation</p>
              <p>Book your appointment online easily and securely.</p>
            </div>
          </div>
        </div>

        <div className="booking-form-container fade-in" style={{ animationDelay: '0.2s' }}>
          
          {status === 'success' ? (
            <div className="fade-in">
              {paymentStatus === 'paid' ? (
                <div className="success-state">
                  <div className="success-icon">✓</div>
                  <h2>All Done!</h2>
                  <p>Your appointment is confirmed and your deposit of <strong>GHS {DEPOSIT_AMOUNT}</strong> has been received.</p>
                  <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '12px', padding: '1rem', margin: '1rem 0', textAlign: 'left' }}>
                    <p style={{ fontSize: '0.9rem', color: '#166534', marginBottom: '0.5rem' }}>💳 Deposit paid: <strong>GHS {DEPOSIT_AMOUNT}</strong></p>
                    <p style={{ fontSize: '0.9rem', color: '#166534' }}>🏥 Balance due on arrival: <strong>GHS {BALANCE_AMOUNT}</strong></p>
                  </div>
                  <button className="btn outline" onClick={() => window.location.reload()}>Book Another</button>
                </div>
              ) : (
                <div>
                  <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                    <div className="success-icon" style={{ background: '#fef9c3', color: '#854d0e' }}>💳</div>
                    <h2 style={{ marginBottom: '0.5rem' }}>Booking Received!</h2>
                    <p style={{ color: '#64748b', fontSize: '0.95rem' }}>Complete your deposit to confirm your appointment slot.</p>
                  </div>

                  <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1rem', marginBottom: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <span style={{ color: '#64748b', fontSize: '0.9rem' }}>Consultation Fee</span>
                      <span style={{ fontWeight: 600 }}>GHS {CONSULTATION_FEE}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <span style={{ color: '#64748b', fontSize: '0.9rem' }}>Deposit (30%) — Pay now</span>
                      <span style={{ fontWeight: 700, color: '#0f766e' }}>GHS {DEPOSIT_AMOUNT}</span>
                    </div>
                    <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '0.5rem', display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#64748b', fontSize: '0.9rem' }}>Balance — Pay on arrival</span>
                      <span style={{ fontWeight: 600 }}>GHS {BALANCE_AMOUNT}</span>
                    </div>
                  </div>

                  {paymentStatus === 'error' && (
                    <div style={{ background: '#fee2e2', color: '#b91c1c', padding: '0.75rem 1rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.9rem' }}>
                      {paymentError}
                    </div>
                  )}

                  <form onSubmit={handlePayment} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div className="form-group">
                      <label>Cardholder Name</label>
                      <input type="text" required placeholder="John Doe" value={cardData.cardName} onChange={e => setCardData({ ...cardData, cardName: e.target.value })} />
                    </div>
                    <div className="form-group">
                      <label>Card Number</label>
                      <input type="text" required placeholder="1234 5678 9012 3456" maxLength={19}
                        value={cardData.cardNumber}
                        onChange={e => {
                          const val = e.target.value.replace(/\D/g, '').slice(0, 16);
                          setCardData({ ...cardData, cardNumber: val.replace(/(.{4})/g, '$1 ').trim() });
                        }}
                      />
                    </div>
                    <div className="form-row">
                      <div className="form-group">
                        <label>Expiry Date</label>
                        <input type="text" required placeholder="MM/YY" maxLength={5}
                          value={cardData.expiryDate}
                          onChange={e => {
                            const val = e.target.value.replace(/\D/g, '').slice(0, 4);
                            setCardData({ ...cardData, expiryDate: val.length > 2 ? `${val.slice(0,2)}/${val.slice(2)}` : val });
                          }}
                        />
                      </div>
                      <div className="form-group">
                        <label>CVV</label>
                        <input type="password" required placeholder="•••" maxLength={3}
                          value={cardData.cvv}
                          onChange={e => setCardData({ ...cardData, cvv: e.target.value.replace(/\D/g, '').slice(0, 3) })}
                        />
                      </div>
                    </div>
                    <div style={{ background: '#fef9c3', border: '1px solid #fde68a', borderRadius: '8px', padding: '0.75rem', fontSize: '0.8rem', color: '#854d0e' }}>
                      🔒 Test mode — use any card number except 0000 0000 0000 0000 to simulate a successful payment.
                    </div>
                    <button type="submit" className="btn primary submit" disabled={paymentStatus === 'processing'}>
                      {paymentStatus === 'processing' ? 'Processing...' : `Pay GHS ${DEPOSIT_AMOUNT} Deposit`}
                    </button>
                  </form>
                </div>
              )}
            </div>
          ) : (
            <>
              {/* Progress Bar */}
              <div className="progress-container">
                {[1, 2, 3, 4].map((num) => (
                  <div key={num} className={`progress-step ${step >= num ? 'active' : ''}`}>
                    {num}
                  </div>
                ))}
              </div>
              
              {status === 'error' && (
                <div className="message error">
                  {errorMessage}
                </div>
              )}

              <form onSubmit={step === 4 ? handleSubmit : (e) => { e.preventDefault(); nextStep(); }}>
                
                {/* Step 1: Reason */}
                {step === 1 && (
                  <div className="step-content fade-in">
                    <h3>1. What brings you to us?</h3>
                    
                    <div className="form-group">
                      <label htmlFor="patientStatus">Are you a new patient?</label>
                      <div className="radio-group">
                        <label className={`radio-card ${formData.patientStatus === 'new' ? 'selected' : ''}`}>
                          <input type="radio" name="patientStatus" value="new" checked={formData.patientStatus === 'new'} onChange={handleChange} />
                          <div>
                            <strong>Yes</strong>
                            <span>I am a new patient</span>
                          </div>
                        </label>
                        <label className={`radio-card ${formData.patientStatus === 'returning' ? 'selected' : ''}`}>
                          <input type="radio" name="patientStatus" value="returning" checked={formData.patientStatus === 'returning'} onChange={handleChange} />
                          <div>
                            <strong>No</strong>
                            <span>I've been here before</span>
                          </div>
                        </label>
                      </div>
                    </div>

                    <div className="form-group">
                      <label htmlFor="appointmentDetails">Reason for visit</label>
                      <textarea 
                        id="appointmentDetails" 
                        name="appointmentDetails" 
                        required 
                        value={formData.appointmentDetails} 
                        onChange={handleChange} 
                        placeholder="E.g., Back pain, post-surgery rehab..." 
                        rows={3}
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="insuranceType">Insurance Type</label>
                      <select id="insuranceType" name="insuranceType" value={formData.insuranceType} onChange={handleChange}>
                        <option value="public">Public (Gesetzlich)</option>
                        <option value="private">Private / Self-Pay</option>
                      </select>
                    </div>
                  </div>
                )}

                {/* Step 2: Date */}
                {step === 2 && (
                  <div className="step-content fade-in">
                    <h3>2. When would you like to come?</h3>
                    
                    <div className="form-group">
                      <label htmlFor="appointmentDate">Select a Date</label>
                      <input 
                        type="date" 
                        id="appointmentDate" 
                        name="appointmentDate" 
                        required 
                        value={formData.appointmentDate} 
                        onChange={(e) => {
                          handleChange(e);
                          setFormData(prev => ({ ...prev, appointmentDate: e.target.value, appointmentTime: '' }));
                        }} 
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>

                    {formData.appointmentDate ? (
                      <div className="form-group fade-in" style={{ marginTop: '2rem' }}>
                        <label>Available Times {checkingAvailability && <span style={{ color: '#0f766e', fontSize: '0.85rem', marginLeft: '0.5rem' }}>(Checking calendar...)</span>}</label>
                        <p className="hint-text">Select one of the available 60-minute slots.</p>
                        <div className="time-slot-grid" style={{ opacity: checkingAvailability ? 0.5 : 1, transition: 'opacity 0.2s ease' }}>
                          {availableTimeSlots.map((slot) => (
                            <div 
                              key={slot.time}
                              className={`time-slot ${slot.booked ? 'booked' : ''} ${formData.appointmentTime === slot.time ? 'selected' : ''}`}
                              onClick={() => !checkingAvailability && handleTimeSelect(slot.time, slot.booked)}
                            >
                              {format12Hour(slot.time)}
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div style={{ marginTop: '2rem', padding: '2rem', textAlign: 'center', background: '#f8fafc', borderRadius: '10px', color: '#64748b' }}>
                        Please select a date to see available times.
                      </div>
                    )}
                  </div>
                )}

                {/* Step 3: Personal Details */}
                {step === 3 && (
                  <div className="step-content fade-in">
                    <h3>3. Your Details</h3>
                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="firstName">First Name</label>
                        <input type="text" id="firstName" name="firstName" required value={formData.firstName} onChange={handleChange} placeholder="John" />
                      </div>
                      <div className="form-group">
                        <label htmlFor="lastName">Last Name</label>
                        <input type="text" id="lastName" name="lastName" required value={formData.lastName} onChange={handleChange} placeholder="Doe" />
                      </div>
                    </div>

                    <div className="form-group">
                      <label htmlFor="dateOfBirth">Date of Birth</label>
                      <input type="date" id="dateOfBirth" name="dateOfBirth" required value={formData.dateOfBirth} onChange={handleChange} />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="phone">Phone Number</label>
                      <input type="tel" id="phone" name="phone" required value={formData.phone} onChange={handleChange} placeholder="+49 123 456 789" />
                    </div>

                    <div className="form-group">
                      <label htmlFor="email">Email Address</label>
                      <input type="email" id="email" name="email" required value={formData.email} onChange={handleChange} placeholder="john.doe@example.com" />
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="address">Address (Optional)</label>
                        <input type="text" id="address" name="address" value={formData.address} onChange={handleChange} placeholder="Musterstraße 1" />
                      </div>
                      <div className="form-group">
                        <label htmlFor="city">City (Optional)</label>
                        <input type="text" id="city" name="city" value={formData.city} onChange={handleChange} placeholder="Berlin" />
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 4: Review */}
                {step === 4 && (
                  <div className="step-content fade-in review-step">
                    <h3>4. Review & Submit</h3>
                    
                    <div className="review-card">
                      <h4>Visit Details</h4>
                      <p><strong>Patient:</strong> {formData.patientStatus === 'new' ? 'New' : 'Returning'} / {formData.insuranceType === 'public' ? 'Public' : 'Private'} Insurance</p>
                      <p><strong>Reason:</strong> {formData.appointmentDetails}</p>
                      <p><strong>Preferred Space:</strong> {new Date(formData.appointmentDate).toLocaleDateString()} at {format12Hour(formData.appointmentTime)}</p>
                    </div>

                    <div className="review-card">
                      <h4>Personal Information</h4>
                      <p><strong>Name:</strong> {formData.firstName} {formData.lastName}</p>
                      <p><strong>DOB:</strong> {formData.dateOfBirth ? new Date(formData.dateOfBirth).toLocaleDateString() : 'N/A'}</p>
                      <p><strong>Contact:</strong> {formData.email} / {formData.phone}</p>
                      {(formData.address || formData.city) && <p><strong>Address:</strong> {formData.address} {formData.city && `, ${formData.city}`}</p>}
                    </div>
                  </div>
                )}

                <div className="button-group">
                  {step > 1 && (
                    <button type="button" className="btn outline" onClick={prevStep} disabled={status === 'loading'}>
                      Back
                    </button>
                  )}
                  
                  {step < 4 ? (
                    <button type="submit" className="btn primary">
                      Continue
                    </button>
                  ) : (
                    <button type="submit" className="btn primary submit" disabled={status === 'loading'}>
                      {status === 'loading' ? 'Submitting...' : 'Confirm Request'}
                    </button>
                  )}
                </div>
              </form>
            </>
          )}
        </div>
      </div>
      
      <div className="right-col fade-in" style={{ animationDelay: '0.4s' }}>
        <div className="image-wrapper">
          <Image 
            src="/albert-physio.png" 
            alt="Dr. Albert in clinic" 
            fill 
            style={{ objectFit: 'cover', objectPosition: 'center top', borderRadius: '24px' }} 
            priority
          />
        </div>
      </div>
    </main>
  );
}
