'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';

interface SymptomGuide {
  id: string;
  symptom: string;
  tagline: string;
  recommendedService: string;
  description: string;
  howWeHelp: string[];
  bookingAnchor: string;
}

interface FaqItem {
  id: string;
  category: 'general' | 'pricing' | 'visit' | 'appointments';
  question: string;
  answer: string;
  actionText?: string;
  actionHref?: string;
}

const SYMPTOM_GUIDES: SymptomGuide[] = [
  {
    id: 'back-neck',
    symptom: 'Lower Back & Neck Pain',
    tagline: 'Sciatica, stiff neck, postural strain, lumbar spasms',
    recommendedService: 'Manual Therapy & Spinal Realignment',
    description: 'Targeted hands-on therapy to relieve acute spinal pressure, mobilise restricted vertebra, and ease muscle guarding.',
    howWeHelp: [
      'Gentle joint mobilization & spinal decompression',
      'Targeted trigger-point muscle release',
      'Core stabilization and ergonomic correction'
    ],
    bookingAnchor: '/book?service=manual-therapy'
  },
  {
    id: 'sports-injury',
    symptom: 'Sports Injuries & Muscle Sprains',
    tagline: 'Hamstring strains, sprained ankles, ACL rehab, runner’s knee',
    recommendedService: 'Sports Physiotherapy & Kinetic Rehab',
    description: 'Evidence-based protocols to accelerate soft-tissue repair, rebuild explosive joint stability, and safely return to sport.',
    howWeHelp: [
      'Biomechanical movement assessment',
      'Progressive muscle loading and strength recovery',
      'Agility and return-to-sport testing'
    ],
    bookingAnchor: '/book?service=sports-physio'
  },
  {
    id: 'chronic-joints',
    symptom: 'Joint Stiffness & Chronic Tendon Pain',
    tagline: 'Shoulder impingement, arthritis, tennis elbow, plantar fasciitis',
    recommendedService: 'Advanced Rehab (Deep Tissue & Modalities)',
    description: 'Combines hands-on manual techniques with advanced therapeutic ultrasound and shockwave modalities for deep tissue regeneration.',
    howWeHelp: [
      'Deep tissue breakdown of fibrous adhesions',
      'Targeted electrotherapy & ultrasound stimulation',
      'Joint capsule lubrication and mobility restore'
    ],
    bookingAnchor: '/book?service=advanced-rehab'
  },
  {
    id: 'post-surgery',
    symptom: 'Post-Surgical Rehabilitation',
    tagline: 'Knee/hip replacement, arthroscopy, fracture fixation recovery',
    recommendedService: 'Post-Surgery Recovery Protocol',
    description: 'Carefully staged, surgeon-aligned physical therapy to prevent scar tissue stiffness and rebuild functional daily strength safely.',
    howWeHelp: [
      'Early swelling reduction & circulation support',
      'Safe passive-to-active range of motion progression',
      'Gait retraining and independent balance restoration'
    ],
    bookingAnchor: '/book?service=post-surgery'
  }
];

const FAQS: FaqItem[] = [
  {
    id: 'fees',
    category: 'pricing',
    question: 'How much does a consultation and treatment session cost?',
    answer: 'A standard comprehensive consultation and treatment session is 300 GHS. When booking online, a 30% deposit (90 GHS) is required to secure your Google Calendar slot. The remaining balance of 210 GHS is paid at the clinic during your appointment.',
    actionText: 'Book an Appointment Now',
    actionHref: '/book'
  },
  {
    id: 'insurance',
    category: 'pricing',
    question: 'Do you accept health insurance?',
    answer: 'Yes! We accommodate both private self-pay patients and major approved corporate and private health insurance schemes. Please bring your insurance membership card or reach out via WhatsApp with your policy details so our front desk can verify coverage.',
    actionText: 'Ask via WhatsApp',
    actionHref: 'https://wa.me/49123456789?text=Hello%20Albert%20Physio,%20I%20would%20like%20to%20verify%20my%20insurance%20coverage'
  },
  {
    id: 'hours',
    category: 'general',
    question: 'What are your clinic opening hours?',
    answer: 'We are open Monday through Thursday from 08:00 to 18:00, and Friday from 08:00 to 15:00. We are closed on Saturdays and Sundays (urgent post-op checkups available by prior arrangement).',
    actionText: 'View Calendar Availability',
    actionHref: '/book'
  },
  {
    id: 'location',
    category: 'general',
    question: 'Where is the clinic located in Pokuasi?',
    answer: 'Albert Physio & Wellness is located in Pokuasi, Accra, Ghana. We are easily accessible with dedicated, secure on-site parking for patients.',
    actionText: 'Open in Google Maps',
    actionHref: 'https://maps.google.com/?q=Pokuasi,+Accra,+Ghana'
  },
  {
    id: 'wear',
    category: 'visit',
    question: 'What should I wear to my first appointment?',
    answer: 'Please wear loose, flexible, and comfortable sportswear (e.g. t-shirt, shorts, or track pants) that allows Dr. Albert to easily examine and mobilize your affected muscles and joints.'
  },
  {
    id: 'bring',
    category: 'visit',
    question: 'What documents or scans should I bring?',
    answer: 'Please bring your photo ID, along with any previous medical records, X-rays, MRI scans, or doctor referral letters if available. If you don’t have prior scans, don’t worry—Dr. Albert performs a complete clinical assessment during your first visit.'
  },
  {
    id: 'cancel',
    category: 'appointments',
    question: 'Can I cancel or reschedule an existing appointment?',
    answer: 'Yes! You can reschedule or cancel directly from your Patient Dashboard up to 24 hours before your appointment. If you need to make changes within 24 hours, please message us on WhatsApp as soon as possible.',
    actionText: 'Go to Patient Dashboard',
    actionHref: '/dashboard'
  },
  {
    id: 'duration',
    category: 'visit',
    question: 'How long does a physiotherapy session take?',
    answer: 'Your initial session takes approximately 45 to 60 minutes. This includes a thorough diagnostic assessment, hands-on treatment, and a tailored home exercise guidance plan.'
  }
];

const EMERGENCY_KEYWORDS = [
  'chest pain',
  'heart',
  'stroke',
  'paralysis',
  'cannot walk',
  'can\'t walk',
  'broken',
  'fracture',
  'emergency',
  'bleeding',
  'unconscious',
  'fainted',
  'loss of bowel',
  'loss of bladder',
  'saddle numbness',
  'groin numbness',
  'severe trauma'
];

type ViewMode = 'main' | 'symptoms' | 'symptom-detail' | 'pricing' | 'hours' | 'faqs' | 'contact';

export default function ClinicConcierge() {
  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState<ViewMode>('main');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSymptomId, setSelectedSymptomId] = useState<string | null>(null);
  const [hasInteracted, setHasInteracted] = useState(false);

  const isEmergencyQuery = useMemo(() => {
    if (!searchQuery.trim()) return false;
    const lower = searchQuery.toLowerCase();
    return EMERGENCY_KEYWORDS.some(kw => lower.includes(kw));
  }, [searchQuery]);

  const filteredFaqs = useMemo(() => {
    if (!searchQuery.trim()) return FAQS;
    const q = searchQuery.toLowerCase();
    return FAQS.filter(
      f => f.question.toLowerCase().includes(q) || f.answer.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const filteredSymptoms = useMemo(() => {
    if (!searchQuery.trim()) return SYMPTOM_GUIDES;
    const q = searchQuery.toLowerCase();
    return SYMPTOM_GUIDES.filter(
      s => s.symptom.toLowerCase().includes(q) ||
           s.tagline.toLowerCase().includes(q) ||
           s.recommendedService.toLowerCase().includes(q) ||
           s.description.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const activeSymptom = useMemo(() => {
    return SYMPTOM_GUIDES.find(s => s.id === selectedSymptomId) || null;
  }, [selectedSymptomId]);

  const handleOpen = () => {
    setIsOpen(true);
    setHasInteracted(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleSelectSymptom = (id: string) => {
    setSelectedSymptomId(id);
    setView('symptom-detail');
  };

  return (
    <>
      {/* Floating Trigger Button */}
      <aside 
        style={{ position: 'fixed', bottom: '1.5rem', right: '1.5rem', zIndex: 1100 }}
        aria-label="Clinic Support Assistant"
      >
        <button
          onClick={() => (isOpen ? handleClose() : handleOpen())}
          aria-label={isOpen ? 'Close Clinic Assistant' : 'Open Clinic Assistant & FAQ'}
          style={{
            background: 'linear-gradient(135deg, #0d9488 0%, #0f766e 100%)',
            color: '#ffffff',
            border: 'none',
            borderRadius: '9999px',
            padding: '0.75rem 1.25rem',
            boxShadow: '0 8px 24px rgba(13, 148, 136, 0.35), 0 2px 6px rgba(0, 0, 0, 0.08)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem',
            fontWeight: 600,
            fontSize: '0.92rem',
            transition: 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.2s ease',
          }}
          onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-2px)')}
          onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)')}
        >
          <span style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <span style={{ fontSize: '1.25rem' }}>💬</span>
            {!hasInteracted && (
              <span
                style={{
                  position: 'absolute',
                  top: '-2px',
                  right: '-2px',
                  width: '9px',
                  height: '9px',
                  backgroundColor: '#34d399',
                  borderRadius: '50%',
                  border: '2px solid #0f766e',
                }}
              />
            )}
          </span>
          <span>{isOpen ? 'Close Assistant' : 'Clinic Assistant & FAQ'}</span>
        </button>
      </aside>

      {/* Concierge Modal / Panel */}
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Albert Physio & Wellness Support Assistant"
          style={{
            position: 'fixed',
            bottom: '5.2rem',
            right: '1.5rem',
            width: 'min(440px, calc(100vw - 2rem))',
            maxHeight: 'min(640px, calc(100vh - 7rem))',
            background: 'rgba(255, 255, 255, 0.98)',
            backdropFilter: 'blur(16px)',
            borderRadius: '20px',
            boxShadow: '0 20px 45px rgba(15, 23, 42, 0.18), 0 0 0 1px rgba(13, 148, 136, 0.15)',
            display: 'flex',
            flexDirection: 'column',
            zIndex: 1100,
            overflow: 'hidden',
            fontFamily: "'Inter', sans-serif",
            animation: 'fadeIn 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards',
          }}
        >
          {/* Header */}
          <div
            style={{
              background: 'linear-gradient(135deg, #0d9488 0%, #115e59 100%)',
              color: '#ffffff',
              padding: '1.1rem 1.25rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              {view !== 'main' && (
                <button
                  onClick={() => {
                    setView('main');
                    setSelectedSymptomId(null);
                  }}
                  aria-label="Back to main menu"
                  style={{
                    background: 'rgba(255,255,255,0.2)',
                    border: 'none',
                    color: '#fff',
                    borderRadius: '8px',
                    width: '30px',
                    height: '30px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    fontSize: '1rem',
                  }}
                >
                  ←
                </button>
              )}
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  background: 'rgba(255,255,255,0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.2rem',
                }}
              >
                🩺
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: '#fff', fontFamily: "'Outfit', sans-serif" }}>
                  Albert Physio Concierge
                </h3>
                <p style={{ margin: 0, fontSize: '0.75rem', opacity: 0.9, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#34d399', display: 'inline-block' }} />
                  Online • Dr. Albert’s Front Desk
                </p>
              </div>
            </div>

            <button
              onClick={handleClose}
              aria-label="Close Assistant"
              style={{
                background: 'transparent',
                border: 'none',
                color: 'rgba(255,255,255,0.85)',
                fontSize: '1.3rem',
                cursor: 'pointer',
                padding: '0.3rem',
                lineHeight: 1,
              }}
            >
              ✕
            </button>
          </div>

          {/* Search Bar */}
          <div style={{ padding: '0.85rem 1rem 0.5rem 1rem', background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                placeholder="Search symptoms, fees, hours, parking..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.65rem 0.85rem 0.65rem 2.2rem',
                  fontSize: '0.88rem',
                  borderRadius: '12px',
                  border: '1px solid #cbd5e1',
                  background: '#ffffff',
                  color: '#1e293b',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
              <span style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', opacity: 0.5, fontSize: '0.9rem' }}>
                🔍
              </span>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  style={{
                    position: 'absolute',
                    right: '0.65rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: '#94a3b8',
                    cursor: 'pointer',
                  }}
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Body Content Area */}
          <div
            style={{
              padding: '1rem',
              overflowY: 'auto',
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              gap: '0.85rem',
            }}
          >
            {/* Emergency Alert (Safety Shield) */}
            {isEmergencyQuery && (
              <div
                style={{
                  background: '#fef2f2',
                  border: '1px solid #fecaca',
                  borderRadius: '12px',
                  padding: '0.85rem',
                  color: '#991b1b',
                  fontSize: '0.85rem',
                  lineHeight: '1.4',
                }}
              >
                <div style={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.3rem' }}>
                  <span>⚠️</span> Urgent Medical Advisory
                </div>
                If you are experiencing severe acute trauma, loss of limb sensation, chest pain, or sudden loss of bowel/bladder control, please proceed immediately to an emergency hospital department or call emergency services. Outpatient physiotherapy is designed for rehabilitation and non-emergency musculoskeletal recovery.
              </div>
            )}

            {/* If user is searching */}
            {searchQuery.trim().length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>
                  Search Results ({filteredSymptoms.length + filteredFaqs.length})
                </p>

                {/* Matched Symptoms */}
                {filteredSymptoms.map(item => (
                  <div
                    key={item.id}
                    onClick={() => handleSelectSymptom(item.id)}
                    style={{
                      background: '#f0fdfa',
                      border: '1px solid #99f6e4',
                      borderRadius: '12px',
                      padding: '0.75rem 0.9rem',
                      cursor: 'pointer',
                      transition: 'background 0.15s ease',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: 600, fontSize: '0.9rem', color: '#0f766e' }}>
                        🩺 {item.symptom}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: '#0d9488', fontWeight: 600 }}>View Plan →</span>
                    </div>
                    <p style={{ margin: '0.25rem 0 0', fontSize: '0.8rem', color: '#334155' }}>
                      Rec: <strong>{item.recommendedService}</strong>
                    </p>
                  </div>
                ))}

                {/* Matched FAQs */}
                {filteredFaqs.map(item => (
                  <div
                    key={item.id}
                    style={{
                      background: '#ffffff',
                      border: '1px solid #e2e8f0',
                      borderRadius: '12px',
                      padding: '0.85rem',
                    }}
                  >
                    <div style={{ fontWeight: 600, fontSize: '0.88rem', color: '#0f172a', marginBottom: '0.35rem' }}>
                      ❓ {item.question}
                    </div>
                    <div style={{ fontSize: '0.82rem', color: '#475569', lineHeight: '1.45' }}>
                      {item.answer}
                    </div>
                    {item.actionHref && item.actionText && (
                      <Link
                        href={item.actionHref}
                        onClick={handleClose}
                        style={{
                          display: 'inline-block',
                          marginTop: '0.5rem',
                          fontSize: '0.8rem',
                          color: '#0d9488',
                          fontWeight: 600,
                          textDecoration: 'none',
                        }}
                      >
                        {item.actionText} →
                      </Link>
                    )}
                  </div>
                ))}

                {filteredSymptoms.length === 0 && filteredFaqs.length === 0 && (
                  <div style={{ textAlign: 'center', padding: '1.5rem 1rem', color: '#64748b' }}>
                    <p style={{ margin: '0 0 0.5rem', fontSize: '0.9rem' }}>No direct answers matched your query.</p>
                    <p style={{ fontSize: '0.8rem', margin: 0 }}>Would you like to ask Dr. Albert or our reception directly?</p>
                    <a
                      href={`https://wa.me/49123456789?text=Hello%20Albert%20Physio,%20I%20have%20a%20question:%20${encodeURIComponent(searchQuery)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                        marginTop: '0.85rem',
                        background: '#25D366',
                        color: '#fff',
                        padding: '0.5rem 1rem',
                        borderRadius: '9999px',
                        textDecoration: 'none',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                      }}
                    >
                      <span>💬</span> Ask on WhatsApp
                    </a>
                  </div>
                )}
              </div>
            ) : (
              /* View-Specific Navigation */
              <>
                {view === 'main' && (
                  <>
                    {/* Welcome Card */}
                    <div
                      style={{
                        background: 'linear-gradient(135deg, #f0fdfa 0%, #e6fffa 100%)',
                        border: '1px solid #ccfbf1',
                        borderRadius: '14px',
                        padding: '0.9rem 1rem',
                      }}
                    >
                      <p style={{ margin: 0, fontSize: '0.88rem', color: '#0f766e', fontWeight: 600 }}>
                        👋 Hello & Welcome to Albert Physio!
                      </p>
                      <p style={{ margin: '0.35rem 0 0', fontSize: '0.8rem', color: '#334155', lineHeight: '1.4' }}>
                        How can we assist you today? Choose an option below for fast guidance or click to reach us immediately.
                      </p>
                    </div>

                    {/* Quick Action Grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem' }}>
                      <button
                        onClick={() => setView('symptoms')}
                        style={cardButtonStyle}
                      >
                        <span style={{ fontSize: '1.3rem' }}>🩺</span>
                        <div>
                          <strong style={{ display: 'block', fontSize: '0.85rem', color: '#0f172a' }}>Treatment Matcher</strong>
                          <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Find the right therapy</span>
                        </div>
                      </button>

                      <button
                        onClick={() => setView('pricing')}
                        style={cardButtonStyle}
                      >
                        <span style={{ fontSize: '1.3rem' }}>💰</span>
                        <div>
                          <strong style={{ display: 'block', fontSize: '0.85rem', color: '#0f172a' }}>Fees & Insurance</strong>
                          <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Consultation & deposits</span>
                        </div>
                      </button>

                      <button
                        onClick={() => setView('hours')}
                        style={cardButtonStyle}
                      >
                        <span style={{ fontSize: '1.3rem' }}>📍</span>
                        <div>
                          <strong style={{ display: 'block', fontSize: '0.85rem', color: '#0f172a' }}>Hours & Pokuasi</strong>
                          <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Location & schedule</span>
                        </div>
                      </button>

                      <button
                        onClick={() => setView('faqs')}
                        style={cardButtonStyle}
                      >
                        <span style={{ fontSize: '1.3rem' }}>❓</span>
                        <div>
                          <strong style={{ display: 'block', fontSize: '0.85rem', color: '#0f172a' }}>First Visit FAQs</strong>
                          <span style={{ fontSize: '0.72rem', color: '#64748b' }}>What to wear & bring</span>
                        </div>
                      </button>
                    </div>

                    {/* Primary Booking Call-to-Action */}
                    <div
                      style={{
                        background: '#ffffff',
                        border: '1px solid #e2e8f0',
                        borderRadius: '14px',
                        padding: '0.9rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '0.75rem',
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '0.86rem', color: '#0f172a' }}>Ready to schedule?</div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Real-time Google Calendar booking</div>
                      </div>
                      <Link
                        href="/book"
                        onClick={handleClose}
                        style={{
                          background: '#0d9488',
                          color: '#ffffff',
                          padding: '0.55rem 0.95rem',
                          borderRadius: '10px',
                          fontSize: '0.82rem',
                          fontWeight: 600,
                          textDecoration: 'none',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        Book Now →
                      </Link>
                    </div>

                    {/* Direct Contact Button */}
                    <button
                      onClick={() => setView('contact')}
                      style={{
                        background: '#f8fafc',
                        border: '1px solid #cbd5e1',
                        borderRadius: '12px',
                        padding: '0.65rem',
                        fontSize: '0.82rem',
                        color: '#334155',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem',
                      }}
                    >
                      <span>💬</span> Speak with Dr. Albert or Reception Directly
                    </button>
                  </>
                )}

                {/* Treatment / Symptom Finder List */}
                {view === 'symptoms' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                    <div style={{ fontSize: '0.82rem', color: '#475569', marginBottom: '0.2rem' }}>
                      Select the primary condition or discomfort you are experiencing:
                    </div>
                    {SYMPTOM_GUIDES.map(item => (
                      <div
                        key={item.id}
                        onClick={() => handleSelectSymptom(item.id)}
                        style={{
                          background: '#ffffff',
                          border: '1px solid #e2e8f0',
                          borderRadius: '12px',
                          padding: '0.85rem',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease',
                        }}
                        onMouseEnter={e => {
                          e.currentTarget.style.borderColor = '#0d9488';
                          e.currentTarget.style.background = '#f0fdfa';
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.borderColor = '#e2e8f0';
                          e.currentTarget.style.background = '#ffffff';
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontWeight: 700, fontSize: '0.88rem', color: '#0f172a' }}>
                            {item.symptom}
                          </span>
                          <span style={{ color: '#0d9488', fontSize: '0.8rem', fontWeight: 600 }}>Explore →</span>
                        </div>
                        <p style={{ margin: '0.2rem 0 0', fontSize: '0.78rem', color: '#64748b' }}>
                          {item.tagline}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Symptom Detail View */}
                {view === 'symptom-detail' && activeSymptom && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                    <div style={{ background: '#f0fdfa', border: '1px solid #99f6e4', borderRadius: '14px', padding: '0.9rem' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0d9488', textTransform: 'uppercase' }}>
                        Recommended Clinical Treatment
                      </span>
                      <h4 style={{ margin: '0.25rem 0 0.4rem', fontSize: '1rem', color: '#0f766e' }}>
                        {activeSymptom.recommendedService}
                      </h4>
                      <p style={{ margin: 0, fontSize: '0.82rem', color: '#334155', lineHeight: '1.4' }}>
                        {activeSymptom.description}
                      </p>
                    </div>

                    <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '0.85rem' }}>
                      <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0f172a', display: 'block', marginBottom: '0.4rem' }}>
                        How Dr. Albert Helps:
                      </span>
                      <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.8rem', color: '#475569', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                        {activeSymptom.howWeHelp.map((point, idx) => (
                          <li key={idx}>{point}</li>
                        ))}
                      </ul>
                    </div>

                    <Link
                      href={activeSymptom.bookingAnchor}
                      onClick={handleClose}
                      style={{
                        background: '#0d9488',
                        color: '#fff',
                        textAlign: 'center',
                        padding: '0.75rem',
                        borderRadius: '12px',
                        fontWeight: 600,
                        fontSize: '0.88rem',
                        textDecoration: 'none',
                      }}
                    >
                      Book Your {activeSymptom.recommendedService} Visit →
                    </Link>
                  </div>
                )}

                {/* Pricing & Insurance View */}
                {view === 'pricing' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '1rem' }}>
                      <h4 style={{ margin: '0 0 0.5rem', fontSize: '0.92rem', color: '#0f172a' }}>
                        Transparent Clinic Pricing
                      </h4>
                      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4rem 0', borderBottom: '1px solid #e2e8f0', fontSize: '0.84rem' }}>
                        <span style={{ color: '#475569' }}>Comprehensive Consultation & Therapy</span>
                        <strong style={{ color: '#0f766e' }}>300 GHS</strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4rem 0', borderBottom: '1px solid #e2e8f0', fontSize: '0.84rem' }}>
                        <span style={{ color: '#475569' }}>Online Booking Deposit (30%)</span>
                        <strong style={{ color: '#0d9488' }}>90 GHS</strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4rem 0', fontSize: '0.84rem' }}>
                        <span style={{ color: '#475569' }}>Balance Settled at Clinic</span>
                        <strong style={{ color: '#1e293b' }}>210 GHS</strong>
                      </div>
                    </div>

                    <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '0.85rem', fontSize: '0.82rem', color: '#475569', lineHeight: '1.4' }}>
                      <strong style={{ color: '#0f172a', display: 'block', marginBottom: '0.25rem' }}>🛡️ Health Insurance Coverage</strong>
                      We welcome both private self-pay patients and major corporate/private health insurance providers. Bring your valid membership card or policy slip for easy processing.
                    </div>

                    <Link
                      href="/book"
                      onClick={handleClose}
                      style={{
                        background: '#0d9488',
                        color: '#fff',
                        textAlign: 'center',
                        padding: '0.7rem',
                        borderRadius: '12px',
                        fontWeight: 600,
                        fontSize: '0.85rem',
                        textDecoration: 'none',
                      }}
                    >
                      Proceed to Book Slot (90 GHS Deposit) →
                    </Link>
                  </div>
                )}

                {/* Hours & Location View */}
                {view === 'hours' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '0.9rem' }}>
                      <h4 style={{ margin: '0 0 0.5rem', fontSize: '0.92rem', color: '#0f172a' }}>
                        ⏰ Clinic Opening Hours
                      </h4>
                      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.82rem' }}>
                        <li style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed #e2e8f0', paddingBottom: '0.25rem' }}>
                          <span style={{ color: '#475569' }}>Monday – Thursday</span>
                          <strong style={{ color: '#0f172a' }}>08:00 – 18:00</strong>
                        </li>
                        <li style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed #e2e8f0', paddingBottom: '0.25rem' }}>
                          <span style={{ color: '#475569' }}>Friday</span>
                          <strong style={{ color: '#0f172a' }}>08:00 – 15:00</strong>
                        </li>
                        <li style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: '#94a3b8' }}>Saturday – Sunday</span>
                          <span style={{ color: '#ef4444', fontWeight: 600 }}>Closed</span>
                        </li>
                      </ul>
                    </div>

                    <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '0.85rem' }}>
                      <h4 style={{ margin: '0 0 0.25rem', fontSize: '0.88rem', color: '#0f172a' }}>
                        📍 Pokuasi Clinic
                      </h4>
                      <p style={{ margin: 0, fontSize: '0.82rem', color: '#475569', lineHeight: '1.4' }}>
                        Pokuasi, Accra, Ghana.<br />
                        Convenient accessibility with secure on-site patient parking.
                      </p>
                    </div>

                    <a
                      href="https://maps.google.com/?q=Pokuasi,+Accra,+Ghana"
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        background: '#0f172a',
                        color: '#fff',
                        textAlign: 'center',
                        padding: '0.65rem',
                        borderRadius: '12px',
                        fontWeight: 600,
                        fontSize: '0.82rem',
                        textDecoration: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.4rem',
                      }}
                    >
                      <span>🗺️</span> Open Location in Google Maps
                    </a>
                  </div>
                )}

                {/* FAQs View */}
                {view === 'faqs' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                    {FAQS.map(item => (
                      <div
                        key={item.id}
                        style={{
                          background: '#fff',
                          border: '1px solid #e2e8f0',
                          borderRadius: '12px',
                          padding: '0.8rem',
                        }}
                      >
                        <div style={{ fontWeight: 600, fontSize: '0.85rem', color: '#0f172a', marginBottom: '0.3rem' }}>
                          {item.question}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: '#475569', lineHeight: '1.4' }}>
                          {item.answer}
                        </div>
                        {item.actionHref && item.actionText && (
                          <Link
                            href={item.actionHref}
                            onClick={handleClose}
                            style={{
                              display: 'inline-block',
                              marginTop: '0.4rem',
                              fontSize: '0.78rem',
                              color: '#0d9488',
                              fontWeight: 600,
                              textDecoration: 'none',
                            }}
                          >
                            {item.actionText} →
                          </Link>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Direct Contact View */}
                {view === 'contact' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <div style={{ background: '#f0fdfa', border: '1px solid #99f6e4', borderRadius: '12px', padding: '0.85rem' }}>
                      <strong style={{ fontSize: '0.88rem', color: '#0f766e', display: 'block', marginBottom: '0.25rem' }}>
                        Direct Human Support
                      </strong>
                      <p style={{ margin: 0, fontSize: '0.8rem', color: '#334155' }}>
                        Need immediate assistance with a booking or customized therapy inquiry? Reach Dr. Albert or our reception directly through your preferred channel:
                      </p>
                    </div>

                    <a
                      href="https://wa.me/49123456789?text=Hello%20Albert%20Physio,%20I%20have%20a%20question%20about%20your%20services"
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        background: '#25D366',
                        color: '#fff',
                        padding: '0.75rem',
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem',
                        textDecoration: 'none',
                        fontWeight: 600,
                        fontSize: '0.88rem',
                        boxShadow: '0 4px 12px rgba(37, 211, 102, 0.25)',
                      }}
                    >
                      <span>💬</span> Chat on WhatsApp (+49 123 456 789)
                    </a>

                    <a
                      href="tel:+49123456789"
                      style={{
                        background: '#0d9488',
                        color: '#fff',
                        padding: '0.75rem',
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem',
                        textDecoration: 'none',
                        fontWeight: 600,
                        fontSize: '0.88rem',
                      }}
                    >
                      <span>📞</span> Call Clinic Reception
                    </a>

                    <a
                      href="mailto:info@albert-physio.de?subject=Physiotherapy%20Appointment%20Inquiry"
                      style={{
                        background: '#f8fafc',
                        border: '1px solid #cbd5e1',
                        color: '#334155',
                        padding: '0.75rem',
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem',
                        textDecoration: 'none',
                        fontWeight: 600,
                        fontSize: '0.88rem',
                      }}
                    >
                      <span>✉️</span> Email info@albert-physio.de
                    </a>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Footer Bar */}
          <div
            style={{
              padding: '0.65rem 1rem',
              background: '#f8fafc',
              borderTop: '1px solid #e2e8f0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '0.72rem',
              color: '#64748b',
            }}
          >
            <span>Albert Physio & Wellness • Pokuasi</span>
            <Link
              href="/dashboard"
              onClick={handleClose}
              style={{ color: '#0d9488', textDecoration: 'none', fontWeight: 600 }}
            >
              Patient Portal →
            </Link>
          </div>
        </div>
      )}
    </>
  );
}

const cardButtonStyle: React.CSSProperties = {
  background: '#ffffff',
  border: '1px solid #e2e8f0',
  borderRadius: '12px',
  padding: '0.75rem 0.65rem',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: '0.4rem',
  cursor: 'pointer',
  textAlign: 'left',
  transition: 'transform 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease',
};
