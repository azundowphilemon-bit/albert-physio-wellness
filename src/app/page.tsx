import Image from 'next/image';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="landing-page">

      {/* Navbar */}
      <header className="navbar">
        <div className="container nav-container">
          <div className="logo-section">
            <Image src="/logo.png" alt="Albert Physio & Wellness Logo" width={52} height={52} className="logo-sm" />
            <span className="brand-text">Albert Physio & Wellness</span>
          </div>
          <nav className="nav-actions">
            <Link href="/login" className="nav-link">Login</Link>
            <Link href="/register" className="btn outline sm-btn">Register</Link>
            <Link href="/book" className="btn primary sm-btn">Book Appointment</Link>
          </nav>
        </div>
      </header>

      <main>

        {/* Hero */}
        <section className="hero-section container layout-2-col">
          <div className="left-col hero-content fade-in">
            <span className="hero-badge">Certified Physiotherapy & Wellness</span>
            <h1>Restoring Movement,<br />Reclaiming Life.</h1>
            <p className="hero-subtext">Premium physiotherapy and wellness care tailored exactly to your needs. Experience the difference with expert hands and state-of-the-art technology.</p>
            <div className="cta-wrapper" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <Link href="/book" className="btn primary cta-btn">Book Your Visit Now</Link>
              <Link href="/register" className="btn outline cta-btn" style={{ padding: '1rem 2rem', fontSize: '1rem' }}>Create Account</Link>
            </div>
            <div className="hero-stats">
              <div className="stat"><span className="stat-num">500+</span><span className="stat-label">Patients Treated</span></div>
              <div className="stat-divider" />
              <div className="stat"><span className="stat-num">10+</span><span className="stat-label">Years Experience</span></div>
              <div className="stat-divider" />
              <div className="stat"><span className="stat-num">98%</span><span className="stat-label">Satisfaction Rate</span></div>
            </div>
          </div>
          <div className="right-col fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="image-wrapper hero-img">
              <Image src="/albert-physio.png" alt="Dr. Albert in clinic" fill style={{ objectFit: 'cover', objectPosition: 'center top', borderRadius: '24px' }} priority />
            </div>
          </div>
        </section>

        {/* Section Divider */}
        <div className="section-divider" />

        {/* Services */}
        <section className="services-section bg-mint fade-in" style={{ animationDelay: '0.4s' }}>
          <div className="container" style={{ display: 'block', padding: '5rem 2rem' }}>
            <div className="section-title">
              <span className="section-badge">What We Offer</span>
              <h2>Our Premium Services</h2>
              <p>Specialized treatments for optimal recovery and long-term wellness</p>
            </div>
            <div className="services-grid">
              {[
                { icon: '🖐️', title: 'Manual Therapy', desc: 'Hands-on techniques to mobilize joints, relieve tension, and improve your functional range of motion.' },
                { icon: '⚡', title: 'Advanced Rehab', desc: 'State-of-the-art shockwave and ultrasound treatments for chronic pain and deep tissue repair.' },
                { icon: '🏋️', title: 'Sports Physiotherapy', desc: 'Targeted rehabilitation plans designed for athletes to quickly return to peak performance.' },
                { icon: '🧘', title: 'Post-Surgery Recovery', desc: 'Safe, guided rehabilitative exercises to rebuild strength following orthopedic operations.' },
              ].map(({ icon, title, desc }) => (
                <div key={title} className="service-card">
                  <div className="service-icon">{icon}</div>
                  <h3>{title}</h3>
                  <p>{desc}</p>
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
              <span className="section-badge">Why Albert Physio</span>
              <h2>Care You Can Trust</h2>
              <p>We combine clinical expertise with a patient-first approach</p>
            </div>
            <div className="why-grid">
              {[
                { icon: '🏅', title: 'Certified Specialists', desc: 'Our team holds internationally recognized physiotherapy certifications.' },
                { icon: '📅', title: 'Easy Online Booking', desc: 'Book, reschedule or cancel appointments 24/7 from any device.' },
                { icon: '🔒', title: 'Private & Secure', desc: 'Your health data is protected with industry-standard encryption.' },
                { icon: '💬', title: 'Personalized Plans', desc: 'Every treatment plan is tailored specifically to your condition and goals.' },
                { icon: '🏥', title: 'Modern Facilities', desc: 'Equipped with the latest physiotherapy technology and equipment.' },
                { icon: '❤️', title: 'Compassionate Care', desc: 'We treat every patient with empathy, respect, and full attention.' },
              ].map(({ icon, title, desc }) => (
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
            <span className="section-badge">Find Us</span>
            <h2>Visit Our Clinic</h2>
            <p>Conveniently located in the heart of Berlin</p>
          </div>

          <div className="info-grid" style={{ marginBottom: '2.5rem' }}>
            <div className="info-card">
              <h3>Opening Hours</h3>
              <ul className="hours-list">
                <li><span>Monday – Thursday</span><span>08:00 – 18:00</span></li>
                <li><span>Friday</span><span>08:00 – 15:00</span></li>
                <li><span>Saturday</span><span>Closed</span></li>
                <li><span>Sunday</span><span>Closed</span></li>
              </ul>
            </div>
            <div className="info-card">
              <h3>Contact & Location</h3>
              <p className="contact-details">
                <strong>Address</strong><br />
                Pokuasi<br />
                Accra, Ghana
              </p>
              <p className="contact-details">
                <strong>Phone</strong><br />
                +49 123 456 789
              </p>
              <p className="contact-details">
                <strong>Email</strong><br />
                info@albert-physio.de
              </p>
              <Link href="/book" className="btn primary full-w" style={{ textAlign: 'center', textDecoration: 'none', marginTop: '0.5rem' }}>
                Book an Appointment
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
              title="Albert Physio & Wellness - Pokuasi, Accra"
            />
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="site-footer">
        <div className="footer-inner container" style={{ display: 'block', padding: '0 2rem' }}>
          <div className="footer-top">
            <div className="footer-brand">
              <Image src="/logo.png" alt="Logo" width={44} height={44} className="logo-sm" />
              <span className="brand-text" style={{ color: '#fff' }}>Albert Physio & Wellness</span>
            </div>
            <div className="footer-links">
              <Link href="/book">Book Appointment</Link>
              <Link href="/login">Patient Login</Link>
              <Link href="/register">Register</Link>
            </div>
          </div>
          <div className="footer-divider" />
          <div className="footer-bottom">
            <p>© {new Date().getFullYear()} Albert Physio & Wellness. All rights reserved.</p>
            <Link href="/admin" className="admin-link">Staff Portal</Link>
          </div>
        </div>
      </footer>

    </div>
  );
}
