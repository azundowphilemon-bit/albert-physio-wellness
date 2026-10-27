'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from '@/lib/i18n';
import { LanguageSwitcher } from '../LanguageSwitcher';

export default function AboutClient() {
  const { t } = useLanguage();

  return (
    <div className="landing-page">
      {/* Navigation Bar */}
      <header className="navbar">
        <div className="container nav-container">
          <Link href="/" className="logo-section" style={{ textDecoration: 'none' }}>
            <Image src="/logo.png" alt="ACOOR Logo" width={52} height={52} className="logo-sm" />
            <div>
              <span className="brand-text" style={{ display: 'block', fontSize: '1.25rem', color: 'var(--secondary-color)' }}>
                ACOOR
              </span>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', fontWeight: 600, letterSpacing: '0.02em' }}>
                {t.common.brandSubtitle}
              </span>
            </div>
          </Link>

          {/* Centered Navigation Menu */}
          <nav className="nav-center">
            <Link href="/" className="nav-link">{t.common.home}</Link>
            <Link href="/about" className="nav-link active-link">{t.common.aboutUs}</Link>
            <Link href="/#treatments" className="nav-link">{t.common.treatments}</Link>
            <Link href="/about#rehabilitation" className="nav-link">{t.common.rehabilitation}</Link>
          </nav>

          {/* Right Action, Language Switcher & Registration Menu */}
          <div className="nav-actions">
            <LanguageSwitcher />
            <Link href="/login" className="nav-link">{t.common.login}</Link>
            <Link href="/register" className="btn outline sm-btn">{t.common.register}</Link>
            <Link href="/book" className="btn primary sm-btn">{t.common.bookAppointment}</Link>
          </div>
        </div>
      </header>

      <main>
        {/* Banner Section */}
        <section className="acoor-hero-banner fade-in">
          <div className="container" style={{ display: 'block' }}>
            <span className="acoor-hero-badge">{t.about.heroBadge}</span>
            <h1 className="acoor-main-title">
              ACOOR
            </h1>
            <h2 style={{ fontSize: 'clamp(1.2rem, 2.5vw, 1.85rem)', color: '#0d9488', fontWeight: 700, marginBottom: '1rem', fontFamily: 'Outfit, sans-serif' }}>
              {t.common.brandSubtitleFull}
            </h2>
            <p className="acoor-subtitle">
              {t.about.heroSubtitle}
            </p>
          </div>
        </section>

        {/* Section 1: What is Osteopathy? */}
        <section className="container fade-in" style={{ padding: '4rem 2rem 2rem 2rem', display: 'block' }}>
          <div className="section-title" style={{ textAlign: 'left', marginBottom: '2rem' }}>
            <span className="section-badge">{t.about.sec1Badge}</span>
            <h2>{t.about.sec1Title}</h2>
          </div>
          <div style={{ background: '#ffffff', borderRadius: '20px', padding: '2.5rem', border: '1px solid rgba(13, 148, 136, 0.16)', boxShadow: '0 10px 30px rgba(0,0,0,0.04)', lineHeight: '1.8', color: '#334155', fontSize: '1.02rem' }}>
            <p style={{ marginBottom: '1.25rem' }}>
              <strong>{t.about.sec1P1Bold}</strong>
              {t.about.sec1P1Rest}
            </p>
            <p style={{ margin: 0 }}>
              {t.about.sec1P2Prefix}
              <em>{t.about.sec1P2Em}</em>
              {t.about.sec1P2Suffix}
            </p>
          </div>
        </section>

        {/* Section 2: The 5 Pillars of Osteopathy */}
        <section className="container fade-in" style={{ padding: '2rem 2rem 4rem 2rem', display: 'block' }}>
          <div className="section-title" style={{ textAlign: 'left', marginBottom: '1.5rem' }}>
            <span className="section-badge">{t.about.sec2Badge}</span>
            <h2>{t.about.sec2Title}</h2>
            <p>{t.about.sec2Subtitle}</p>
          </div>

          <div className="pillars-grid">
            {t.about.pillars.map(p => (
              <div key={p.num} className="pillar-card">
                <span className="pillar-num">{p.num}</span>
                <h3 className="pillar-title">{p.title}</h3>
                <p className="pillar-desc">{p.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Section 3: Who is an Osteopath? */}
        <section style={{ background: '#f0fdfa', borderTop: '1px solid #ccfbf1', borderBottom: '1px solid #ccfbf1', padding: '4.5rem 0' }}>
          <div className="container" style={{ display: 'block' }}>
            <div className="section-title" style={{ textAlign: 'left', marginBottom: '2rem' }}>
              <span className="section-badge">{t.about.sec3Badge}</span>
              <h2>{t.about.sec3Title}</h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
              <div style={{ background: '#ffffff', borderRadius: '18px', padding: '2rem', border: '1px solid #e2e8f0', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
                <h3 style={{ fontSize: '1.2rem', color: 'var(--secondary-color)', marginBottom: '0.75rem' }}>
                  {t.about.sec3Card1Title}
                </h3>
                <p style={{ color: '#475569', fontSize: '0.94rem', lineHeight: '1.7' }}>
                  {t.about.sec3Card1Desc}
                </p>
              </div>
              <div style={{ background: '#ffffff', borderRadius: '18px', padding: '2rem', border: '1px solid #e2e8f0', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
                <h3 style={{ fontSize: '1.2rem', color: 'var(--secondary-color)', marginBottom: '0.75rem' }}>
                  {t.about.sec3Card2Title}
                </h3>
                <p style={{ color: '#475569', fontSize: '0.94rem', lineHeight: '1.7' }}>
                  {t.about.sec3Card2Desc}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 4: Clinical Leadership & Still Academy Faculty */}
        <section className="container fade-in" style={{ padding: '4rem 2rem', display: 'block' }}>
          <div className="section-title" style={{ textAlign: 'left', marginBottom: '1.5rem' }}>
            <span className="section-badge">{t.about.sec4Badge}</span>
            <h2>{t.about.sec4Title}</h2>
            <p>{t.about.sec4Subtitle}</p>
          </div>

          <div className="bio-card-wrapper">
            <div className="bio-img-container">
              <Image
                src="/albert-physio.png"
                alt="ACOOR Clinical Director"
                fill
                style={{ objectFit: 'cover', objectPosition: 'center top' }}
                priority
              />
            </div>
            <div className="bio-content">
              <span className="still-badge">
                {t.about.stillBadge}
              </span>
              <h3 style={{ fontSize: '1.85rem', color: 'var(--text-primary)', marginBottom: '0.35rem', fontWeight: 800 }}>
                Albert Nana Yaw Ntekoh
              </h3>
              <p style={{ fontSize: '0.95rem', color: 'var(--primary-color)', fontWeight: 600, marginBottom: '1.25rem' }}>
                {t.about.directorRole}
              </p>
              <div style={{ color: '#334155', fontSize: '0.94rem', lineHeight: '1.7', display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
                <p>{t.about.bioP1}</p>
                <p>{t.about.bioP2}</p>
                <p>{t.about.bioP3}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 5: Our Global Mission & International Hospital Advisory */}
        <section className="container fade-in" style={{ padding: '0 2rem 3rem 2rem', display: 'block' }}>
          <div className="global-advisory-banner">
            <span style={{ background: 'rgba(13, 148, 136, 0.3)', border: '1px solid #0d9488', color: '#5eead4', fontSize: '0.75rem', fontWeight: 700, padding: '0.35rem 0.85rem', borderRadius: '9999px', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'inline-block', marginBottom: '1rem' }}>
              {t.about.sec5Badge}
            </span>
            <h2 style={{ fontSize: 'clamp(1.75rem, 3vw, 2.4rem)', color: '#ffffff', marginBottom: '1rem', fontWeight: 800 }}>
              {t.about.sec5Title}
            </h2>
            <p style={{ color: '#cbd5e1', fontSize: '1.02rem', lineHeight: '1.75', maxWidth: '850px', marginBottom: '1.75rem' }}>
              {t.about.sec5Desc}
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
              {t.about.sec5Cards.map((card, i) => (
                <div key={i} style={{ background: 'rgba(255,255,255,0.06)', borderRadius: '12px', padding: '1.25rem', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <strong style={{ display: 'block', color: '#5eead4', fontSize: '1.05rem', marginBottom: '0.4rem' }}>
                    {card.title}
                  </strong>
                  <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
                    {card.desc}
                  </span>
                </div>
              ))}
            </div>

            <a
              href="https://wa.me/49123456789?text=Hello%20ACOOR,%20I%20would%20like%20to%20inquire%20about%20your%20International%20Hospital%20Advisory"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: '#0d9488',
                color: '#ffffff',
                padding: '0.8rem 1.6rem',
                borderRadius: '12px',
                fontWeight: 700,
                fontSize: '0.92rem',
                textDecoration: 'none',
              }}
            >
              <span>💬</span> {t.about.sec5Cta}
            </a>
          </div>
        </section>

        {/* Section 6: Comprehensive Rehabilitation Services */}
        <section id="rehabilitation" className="container fade-in" style={{ padding: '1rem 2rem 5rem 2rem', display: 'block' }}>
          <div className="section-title" style={{ textAlign: 'left', marginBottom: '2rem' }}>
            <span className="section-badge">{t.about.sec6Badge}</span>
            <h2>{t.about.sec6Title}</h2>
            <p>{t.about.sec6Subtitle}</p>
          </div>

          <div className="rehab-quad-grid">
            {t.about.rehabCards.map((card, i) => (
              <div key={i} className="rehab-quad-card">
                <span style={{ fontSize: '2rem', display: 'block', marginBottom: '0.75rem' }}>{card.icon}</span>
                <h3 style={{ fontSize: '1.2rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                  {card.title}
                </h3>
                <p style={{ color: '#64748b', fontSize: '0.88rem', lineHeight: '1.6', marginBottom: '1rem' }}>
                  {card.desc}
                </p>
                {'linkText' in card && card.linkText && card.linkHref ? (
                  <Link href={card.linkHref} style={{ color: 'var(--primary-color)', fontSize: '0.82rem', fontWeight: 700, textDecoration: 'none' }}>
                    {card.linkText}
                  </Link>
                ) : (
                  <span style={{ background: '#f1f5f9', color: '#475569', padding: '0.2rem 0.6rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600 }}>
                    {'badge' in card ? card.badge : ''}
                  </span>
                )}
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '3rem' }}>
            <Link href="/book" className="btn primary" style={{ padding: '1rem 2.5rem', fontSize: '1.05rem', textDecoration: 'none' }}>
              {t.about.sec6Cta}
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="site-footer">
        <div className="footer-inner container" style={{ display: 'block', padding: '0 2rem' }}>
          <div className="footer-top">
            <div className="footer-brand">
              <Image src="/logo.png" alt="ACOOR Logo" width={44} height={44} className="logo-sm" />
              <div>
                <span className="brand-text" style={{ color: '#fff', display: 'block', fontSize: '1.15rem' }}>ACOOR</span>
                <span style={{ color: '#94a3b8', fontSize: '0.72rem' }}>{t.common.brandSubtitleFull}</span>
              </div>
            </div>
            <div className="footer-links">
              <Link href="/">{t.common.home}</Link>
              <Link href="/about">{t.common.aboutUs}</Link>
              <Link href="/book">{t.common.bookAppointment}</Link>
              <Link href="/dashboard">{t.common.patientPortal}</Link>
            </div>
          </div>
          <div className="footer-divider" />
          <div className="footer-bottom">
            <p>© {new Date().getFullYear()} ACOOR - {t.common.brandSubtitleFull}. {t.common.allRightsReserved}</p>
            <Link href="/admin" className="admin-link">{t.common.staffPortal}</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
