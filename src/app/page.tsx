import Image from 'next/image';
import Link from 'next/link';

export default function LandingPage() {
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
              <span style={{ fontSize: '0.68rem', color: 'var(--text-secondary)', fontWeight: 600, letterSpacing: '0.02em' }}>
                Africa Clinic of Osteopathy & Rehab
              </span>
            </div>
          </Link>
          <nav className="nav-actions">
            <Link href="/about" className="nav-link" style={{ fontWeight: 600, color: 'var(--primary-color)' }}>About Us</Link>
            <Link href="#treatments" className="nav-link">Treatments</Link>
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
            <span className="hero-badge">Certified Osteopathic Medicine & Comprehensive Rehabilitation</span>
            <h1>Restoring Movement,<br />Transforming Lives.</h1>
            <p className="hero-subtext">
              Welcome to <strong>ACOOR (Africa Clinic of Osteopathy and Rehabilitation)</strong>. Directed by Dr. Albert—lecturer at Germany’s prestigious Still Academy—we integrate European osteopathic clinical rigor, multidisciplinary rehabilitation, and international hospital coordination.
            </p>
            <div className="cta-wrapper" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <Link href="/book" className="btn primary cta-btn">Book Your Visit Now</Link>
              <Link href="/about" className="btn outline cta-btn" style={{ padding: '1rem 2rem', fontSize: '1rem' }}>About ACOOR & Dr. Albert →</Link>
            </div>
            <div className="hero-stats">
              <div className="stat"><span className="stat-num">500+</span><span className="stat-label">Patients Treated</span></div>
              <div className="stat-divider" />
              <div className="stat"><span className="stat-num">Still Academy</span><span className="stat-label">German Faculty</span></div>
              <div className="stat-divider" />
              <div className="stat"><span className="stat-num">98%</span><span className="stat-label">Satisfaction Rate</span></div>
            </div>
          </div>
          <div className="right-col fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="image-wrapper hero-img">
              <Image src="/albert-physio.png" alt="Dr. Albert at ACOOR" fill style={{ objectFit: 'cover', objectPosition: 'center top', borderRadius: '24px' }} priority />
            </div>
          </div>
        </section>

        {/* Section Divider */}
        <div className="section-divider" />

        {/* About ACOOR Spotlight Section */}
        <section className="about-spotlight-section container fade-in" style={{ padding: '4rem 2rem 2rem 2rem', display: 'block' }}>
          <div className="section-title">
            <span className="section-badge">Welcome to ACOOR</span>
            <h2>Africa Clinic of Osteopathy and Rehabilitation</h2>
            <p>Pioneering European osteopathic standards, multidisciplinary therapy, and international medical navigation</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.75rem', marginBottom: '2.5rem' }}>
            <div style={{ background: '#ffffff', borderRadius: '18px', padding: '2rem', border: '1px solid rgba(13, 148, 136, 0.16)', boxShadow: '0 8px 24px rgba(0,0,0,0.04)' }}>
              <span style={{ fontSize: '2.2rem', display: 'block', marginBottom: '0.75rem' }}>🏛️</span>
              <h3 style={{ fontSize: '1.25rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>German Osteopathic Faculty</h3>
              <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: '1.6' }}>
                Founded by Dr. Albert, who completed advanced medical studies in Germany and serves as a lecturer and clinical educator at the renowned Still Academy in Germany.
              </p>
            </div>

            <div style={{ background: '#ffffff', borderRadius: '18px', padding: '2rem', border: '1px solid rgba(13, 148, 136, 0.16)', boxShadow: '0 8px 24px rgba(0,0,0,0.04)' }}>
              <span style={{ fontSize: '2.2rem', display: 'block', marginBottom: '0.75rem' }}>🩺</span>
              <h3 style={{ fontSize: '1.25rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>The 5 Pillars of Osteopathy</h3>
              <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: '1.6' }}>
                Evaluating the patient through the Biomechanical, Neurological, Circulatory, Metabolic, and Biopsychosocial models to treat root causes rather than just masking symptoms.
              </p>
            </div>

            <div style={{ background: '#ffffff', borderRadius: '18px', padding: '2rem', border: '1px solid rgba(13, 148, 136, 0.16)', boxShadow: '0 8px 24px rgba(0,0,0,0.04)' }}>
              <span style={{ fontSize: '2.2rem', display: 'block', marginBottom: '0.75rem' }}>🌐</span>
              <h3 style={{ fontSize: '1.25rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Global Hospital Advisory</h3>
              <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: '1.6' }}>
                Direct clinical bridges and referrals to premier university hospitals and specialized orthopedic surgical centers in Germany and across Europe for complex surgical care.
              </p>
            </div>

            <div style={{ background: '#ffffff', borderRadius: '18px', padding: '2rem', border: '1px solid rgba(13, 148, 136, 0.16)', boxShadow: '0 8px 24px rgba(0,0,0,0.04)' }}>
              <span style={{ fontSize: '2.2rem', display: 'block', marginBottom: '0.75rem' }}>🏥</span>
              <h3 style={{ fontSize: '1.25rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>4 Departments of Rehab</h3>
              <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: '1.6' }}>
                Complete integration of <strong>Physical Therapy</strong>, <strong>Occupational Therapy (Ergotherapie)</strong>, <strong>Speech Therapy (Logopädie)</strong>, and <strong>Post-Surgical Care</strong>.
              </p>
            </div>
          </div>

          <div style={{ textAlign: 'center' }}>
            <Link href="/about" className="btn outline" style={{ padding: '0.85rem 2rem', fontWeight: 700, fontSize: '0.95rem', textDecoration: 'none' }}>
              Read the Complete About ACOOR & Biography Story →
            </Link>
          </div>
        </section>

        {/* Section Divider */}
        <div className="section-divider" />

        {/* Services / Treatments Showcase (Luxury Resort Catalog Style) */}
        <section id="treatments" className="services-section bg-mint fade-in" style={{ animationDelay: '0.4s' }}>
          <div className="container" style={{ display: 'block', padding: '5rem 2rem' }}>
            <div className="section-title">
              <span className="section-badge">Comprehensive Clinical Treatments</span>
              <h2>Our Specialized Physiotherapy Programs</h2>
              <p>State-of-the-art rehabilitation, hands-on physical therapy, and personalized recovery protocols</p>
            </div>
            
            <div className="treatments-showcase-grid">
              {[
                {
                  id: 'manual-therapy',
                  title: 'Manual Therapy & Spinal Realignment',
                  badge: 'Hands-On Specialty',
                  image: '/treatments/manual-therapy.jpg',
                  duration: '45–60 Min',
                  type: 'Spine & Joint Mobilization',
                  description: 'Expert hands-on mobilization and soft tissue manipulation to decompress restricted spinal segments, ease muscle guarding, and treat sciatica and chronic back tension.',
                  highlights: [
                    'Targeted spinal decompression & joint realignment',
                    'Rapid nerve root and lumbar spasm relief',
                    'Posture ergonomics & core stabilization'
                  ],
                  bookingParam: 'manual-therapy'
                },
                {
                  id: 'sports-physio',
                  title: 'Sports Physiotherapy & Athletic Rehab',
                  badge: 'Athletic Recovery',
                  image: '/treatments/sports-physio.jpg',
                  duration: '45–60 Min',
                  type: 'Kinetic Performance',
                  description: 'Specialized rehabilitation protocols for athletes and active individuals recovering from muscle tears, ankle sprains, ACL/meniscus injuries, and rotator cuff strains.',
                  highlights: [
                    'Comprehensive biomechanical movement screening',
                    'Accelerated soft-tissue repair protocols',
                    'Progressive loading & return-to-sport testing'
                  ],
                  bookingParam: 'sports-physio'
                },
                {
                  id: 'advanced-rehab',
                  title: 'Advanced Electrotherapy & Deep Ultrasound',
                  badge: 'Cutting-Edge Modalities',
                  image: '/treatments/advanced-rehab.jpg',
                  duration: '45–60 Min',
                  type: 'Cellular Healing',
                  description: 'Non-invasive therapeutic ultrasound and neuromuscular electrical stimulation designed to stimulate deep collagen healing, break down fibrous adhesions, and resolve stubborn pain.',
                  highlights: [
                    'High-frequency therapeutic ultrasound therapy',
                    'Neuromuscular stimulation & muscle re-education',
                    'Chronic tendonitis, bursitis & calcification care'
                  ],
                  bookingParam: 'advanced-rehab'
                },
                {
                  id: 'post-surgery',
                  title: 'Post-Surgical Orthopedic Recovery',
                  badge: 'Surgeon-Aligned Care',
                  image: '/treatments/post-surgery.jpg',
                  duration: '45–60 Min',
                  type: 'Guided Progression',
                  description: 'Structured, physician-coordinated physical rehabilitation following total knee/hip replacements, ligament reconstructions, and fracture fixations.',
                  highlights: [
                    'Gentle passive-to-active range of motion progression',
                    'Adhesion and scar tissue restriction prevention',
                    'Independent gait retraining and balance recovery'
                  ],
                  bookingParam: 'post-surgery'
                },
                {
                  id: 'lymphatic-drainage',
                  title: 'Medical Lymphatic Drainage & Edema Care',
                  badge: 'Circulation & Swelling Relief',
                  image: '/treatments/lymphatic-drainage.jpg',
                  duration: '45–60 Min',
                  type: 'Gentle Decongestive Therapy',
                  description: 'Specialized rhythmic gentle manual therapy that stimulates the lymphatic vascular network, significantly accelerating post-operative fluid clearance and reducing limb swelling.',
                  highlights: [
                    'Rapid clearance of post-surgical fluid accumulation',
                    'Relief from heavy legs, lymphedema & tissue inflammation',
                    'Detoxification and enhanced circulatory comfort'
                  ],
                  bookingParam: 'lymphatic-drainage'
                },
                {
                  id: 'trigger-point',
                  title: 'Trigger Point & Myofascial Deep Release',
                  badge: 'Deep Muscle Knots',
                  image: '/treatments/trigger-point.jpg',
                  duration: '45–60 Min',
                  type: 'Myofascial Therapy',
                  description: 'Focused ischemic compression and myofascial stripping on hyper-irritable muscle knots to eliminate referred pain, ease tension headaches, and restore muscle elasticity.',
                  highlights: [
                    'Dissolves stubborn chronic myofascial knots',
                    'Direct relief from tension headaches & neck stiffness',
                    'Restores healthy tissue oxygenation and flexibility'
                  ],
                  bookingParam: 'trigger-point'
                },
                {
                  id: 'posture-ergonomics',
                  title: 'Cervical Spine, Neck & Posture Alignment',
                  badge: 'Desk Worker & Posture Health',
                  image: '/treatments/posture-ergonomics.jpg',
                  duration: '45–60 Min',
                  type: 'Ergonomic Realignment',
                  description: 'Targeted correction for tech-neck, rounded shoulders, forward head syndrome, and occupational strains caused by prolonged sitting and screen use.',
                  highlights: [
                    'Decompresses cervical spine & thoracic cage',
                    'Strengthens deep neck flexors and rhomboids',
                    'Personalized workplace ergonomic recommendations'
                  ],
                  bookingParam: 'posture-care'
                },
                {
                  id: 'mobility-balance',
                  title: 'Functional Joint Mobility & Balance Care',
                  badge: 'Longevity & Joint Health',
                  image: '/treatments/mobility-balance.jpg',
                  duration: '45–60 Min',
                  type: 'Active Movement Therapy',
                  description: 'Evidence-based functional exercise therapies specifically calibrated for osteoarthritis management, hip/knee stiffness, and dynamic stability for active aging.',
                  highlights: [
                    'Eases osteoarthritis friction & increases joint fluid',
                    'Dynamic proprioception & fall prevention drills',
                    'Restores confidence and ease in everyday movement'
                  ],
                  bookingParam: 'mobility-balance'
                }
              ].map((treatment) => (
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
                      <span className="treatment-chip">✓ 1-on-1 with Dr. Albert</span>
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
                        <span className="treatment-fee-label">Consultation & Care</span>
                        <span className="treatment-fee-val">300 GHS</span>
                        <span className="treatment-fee-deposit">90 GHS Online Deposit</span>
                      </div>
                      <Link href={`/book?service=${treatment.bookingParam}`} className="treatment-book-btn">
                        Book Treatment →
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
              <Image src="/logo.png" alt="ACOOR Logo" width={44} height={44} className="logo-sm" />
              <div>
                <span className="brand-text" style={{ color: '#fff', display: 'block', fontSize: '1.15rem' }}>ACOOR</span>
                <span style={{ color: '#94a3b8', fontSize: '0.72rem' }}>Africa Clinic of Osteopathy & Rehabilitation</span>
              </div>
            </div>
            <div className="footer-links">
              <Link href="/">Home</Link>
              <Link href="/about">About Us</Link>
              <Link href="/#treatments">Treatments</Link>
              <Link href="/book">Book Appointment</Link>
              <Link href="/dashboard">Patient Portal</Link>
            </div>
          </div>
          <div className="footer-divider" />
          <div className="footer-bottom">
            <p>© {new Date().getFullYear()} ACOOR - Africa Clinic of Osteopathy and Rehabilitation. All rights reserved.</p>
            <Link href="/admin" className="admin-link">Staff Portal</Link>
          </div>
        </div>
      </footer>

    </div>
  );
}
