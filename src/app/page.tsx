'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from '@/lib/i18n';
import { LanguageSwitcher } from './LanguageSwitcher';

export default function LandingPage() {
  const { t } = useLanguage();

  return (
    <div className="landing-page">

      {/* Navbar */}
      <header className="navbar">
        <div className="container nav-container">
          <Link href="/" className="logo-section" style={{ textDecoration: 'none' }}>
            <Image src="/logo.png" alt="ACOOR Logo" width={52} height={52} className="logo-sm" />
            <div>
              <span className="brand-text" style={{ display: 'block', fontSize: '1.25rem', color: 'var(--secondary-color)' }}>
                ACOOR
              </span>
              <span className="brand-subtext">
                {t.common.brandSubtitle}
              </span>
            </div>
          </Link>

          {/* Centered Navigation Menu */}
          <nav className="nav-center">
            <Link href="/" className="nav-link">{t.common.home}</Link>
            <Link href="/about" className="nav-link nav-highlight">{t.common.aboutUs}</Link>
            <Link href="#treatments" className="nav-link">{t.common.treatments}</Link>
            <Link href="/about#rehabilitation" className="nav-link">{t.common.rehabilitation}</Link>
          </nav>

          {/* Language Switcher (top-right on mobile & inline on desktop) */}
          <div className="nav-lang-wrapper">
            <LanguageSwitcher />
          </div>

          {/* Right Action & Registration Menu */}
          <div className="nav-actions">
            <Link href="/login" className="nav-link">{t.common.login}</Link>
            <Link href="/register" className="btn outline sm-btn">{t.common.register}</Link>
            <Link href="/book" className="btn primary sm-btn">{t.common.bookAppointment}</Link>
          </div>
        </div>
      </header>

      <main>

        {/* Hero */}
        <section className="hero-section container layout-2-col">
          <div className="left-col hero-content fade-in">
            <span className="hero-badge">{t.landing.heroBadge}</span>
            <h1>{t.landing.heroTitleLine1}<br />{t.landing.heroTitleLine2}</h1>
            <p className="hero-subtext">
              {t.landing.heroSubtextPrefix}
              <strong>{t.landing.heroSubtextBold}</strong>
              {t.landing.heroSubtextSuffix}
            </p>
            <div className="cta-wrapper" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <Link href="/book" className="btn primary cta-btn">{t.landing.ctaBook}</Link>
              <Link href="/about" className="btn outline cta-btn" style={{ padding: '1rem 2rem', fontSize: '1rem' }}>{t.landing.ctaAbout}</Link>
            </div>
            <div className="hero-stats">
              <div className="stat"><span className="stat-num">500+</span><span className="stat-label">{t.landing.statPatients}</span></div>
              <div className="stat-divider" />
              <div className="stat"><span className="stat-num">Still Academy</span><span className="stat-label">{t.landing.statFaculty}</span></div>
              <div className="stat-divider" />
              <div className="stat"><span className="stat-num">98%</span><span className="stat-label">{t.landing.statSatisfaction}</span></div>
            </div>
          </div>
          <div className="right-col fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="image-wrapper hero-img">
              <Image src="/albert-physio.png" alt="ACOOR Clinical Director" fill style={{ objectFit: 'cover', objectPosition: 'center top', borderRadius: '24px' }} priority />
            </div>
          </div>
        </section>

        {/* Section Divider */}
        <div className="section-divider" />

        {/* About ACOOR Spotlight Section */}
        <section className="about-spotlight-section container fade-in" style={{ padding: '4rem 2rem 2rem 2rem', display: 'block' }}>
          <div className="section-title">
            <span className="section-badge">{t.landing.spotlightBadge}</span>
            <h2>{t.landing.spotlightTitle}</h2>
            <p>{t.landing.spotlightSubtitle}</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.75rem', marginBottom: '2.5rem' }}>
            {t.landing.spotlightCards.map((card, i) => (
              <div key={i} style={{ background: '#ffffff', borderRadius: '18px', padding: '2rem', border: '1px solid rgba(13, 148, 136, 0.16)', boxShadow: '0 8px 24px rgba(0,0,0,0.04)' }}>
                <span style={{ fontSize: '2.2rem', display: 'block', marginBottom: '0.75rem' }}>{card.icon}</span>
                <h3 style={{ fontSize: '1.25rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>{card.title}</h3>
                <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: '1.6' }}>
                  {card.desc}
                </p>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center' }}>
            <Link href="/about" className="btn outline" style={{ padding: '0.85rem 2rem', fontWeight: 700, fontSize: '0.95rem', textDecoration: 'none' }}>
              {t.landing.spotlightBtn}
            </Link>
          </div>
        </section>

        {/* Section Divider */}
        <div className="section-divider" />

        {/* Services / Treatments Showcase (Luxury Resort Catalog Style) */}
        <section id="treatments" className="services-section bg-mint fade-in" style={{ animationDelay: '0.4s' }}>
          <div className="container" style={{ display: 'block', padding: '5rem 2rem' }}>
            <div className="section-title">
              <span className="section-badge">{t.landing.treatmentsBadge}</span>
              <h2>{t.landing.treatmentsTitle}</h2>
              <p>{t.landing.treatmentsSubtitle}</p>
            </div>
            
            <div className="treatments-showcase-grid">
              {t.landing.treatmentsList.map((treatment) => (
                <div key={treatment.id} className="luxury-treatment-card">
                  <div className="treatment-media">
                    <span className="treatment-badge-float">{treatment.badge}</span>
                    <Image
                      src={treatment.image}
                      alt={treatment.title}
                      fill
                      style={{ objectFit: 'cover' }}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
                    />
                  </div>
                  <div className="treatment-body">
                    <div className="treatment-chips-row">
                      <span className="treatment-chip">⏱️ {treatment.duration}</span>
                      <span className="treatment-chip">👤 {treatment.type}</span>
                      <span className="treatment-chip">{t.landing.specialistChip}</span>
                    </div>
                    <h3>{treatment.title}</h3>
                    <p className="treatment-description">{treatment.description}</p>
                    <ul className="treatment-highlights-list">
                      {treatment.highlights.map((h, i) => (
                        <li key={i}>
                          <span className="check-icon">✓</span> {h}
                        </li>
                      ))}
                    </ul>
                    <div className="treatment-card-footer">
                      <div>
                        <span className="treatment-fee-label">{t.landing.feeLabel}</span>
                        <span className="treatment-fee-val">300 GHS</span>
                        <span className="treatment-fee-deposit">{t.landing.feeDeposit}</span>
                      </div>
                      <Link href={`/book?service=${treatment.bookingParam}`} className="treatment-book-btn">
                        {t.landing.bookTreatmentBtn}
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section Divider */}
        <div className="section-divider" />

        {/* Why Choose Us */}
        <section className="why-section fade-in" style={{ animationDelay: '0.5s' }}>
          <div className="container" style={{ display: 'block', padding: '5rem 2rem' }}>
            <div className="section-title">
              <span className="section-badge">{t.landing.whyBadge}</span>
              <h2>{t.landing.whyTitle}</h2>
              <p>{t.landing.whySubtitle}</p>
            </div>
            <div className="why-grid">
              {t.landing.whyList.map(({ icon, title, desc }) => (
                <div key={title} className="why-card">
                  <span className="why-icon">{icon}</span>
                  <div>
                    <h4>{title}</h4>
                    <p>{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section Divider */}
        <div className="section-divider" />

        {/* Info: Hours + Contact + Map */}
        <section className="info-section container fade-in" style={{ animationDelay: '0.6s' }}>
          <div className="section-title" style={{ marginBottom: '3rem' }}>
            <span className="section-badge">{t.landing.findBadge}</span>
            <h2>{t.landing.findTitle}</h2>
            <p>{t.landing.findSubtitle}</p>
          </div>

          <div className="info-grid" style={{ marginBottom: '2.5rem' }}>
            <div className="info-card">
              <h3>{t.landing.openingHours}</h3>
              <ul className="hours-list">
                <li><span>{t.landing.monThu}</span><span>08:00 – 18:00</span></li>
                <li><span>{t.landing.friday}</span><span>08:00 – 15:00</span></li>
                <li><span>{t.landing.saturday}</span><span>{t.landing.closed}</span></li>
                <li><span>{t.landing.sunday}</span><span>{t.landing.closed}</span></li>
              </ul>
            </div>
            <div className="info-card">
              <h3>{t.landing.contactLocation}</h3>
              <p className="contact-details">
                <strong>{t.landing.addressLabel}</strong><br />
                Pokuasi<br />
                Accra, Ghana
              </p>
              <p className="contact-details">
                <strong>{t.landing.phoneLabel}</strong><br />
                +49 123 456 789
              </p>
              <p className="contact-details">
                <strong>{t.landing.emailLabel}</strong><br />
                info@albert-physio.de
              </p>
              <Link href="/book" className="btn primary full-w" style={{ textAlign: 'center', textDecoration: 'none', marginTop: '0.5rem' }}>
                {t.landing.bookAnAppointment}
              </Link>
            </div>
          </div>

          {/* Map */}
          <div className="map-wrapper">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3970.5!2d-0.2674!3d5.6412!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xfdf9b9e5c3b5555%3A0x0!2sPokuasi%2C%20Accra%2C%20Ghana!5e0!3m2!1sen!2sgh!4v1"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="ACOOR Clinic - Pokuasi, Accra"
            />
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
              <Link href="/#treatments">{t.common.treatments}</Link>
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
