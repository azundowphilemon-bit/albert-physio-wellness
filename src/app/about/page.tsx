import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About ACOOR | Africa Clinic of Osteopathy and Rehabilitation',
  description: 'Learn about ACOOR, the 5 pillars of osteopathy, Dr. Albert (Still Academy lecturer), our global hospital network, and multidisciplinary rehabilitation.',
};

export default function AboutPage() {
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
                Africa Clinic of Osteopathy & Rehabilitation
              </span>
            </div>
          </Link>
          <nav className="nav-actions">
            <Link href="/" className="nav-link">Home</Link>
            <Link href="/about" className="nav-link" style={{ color: 'var(--primary-color)', fontWeight: 700 }}>About Us</Link>
            <Link href="/book" className="btn primary sm-btn">Book Appointment</Link>
          </nav>
        </div>
      </header>

      <main>
        {/* Banner Section */}
        <section className="acoor-hero-banner fade-in">
          <div className="container" style={{ display: 'block' }}>
            <span className="acoor-hero-badge">Clinical Excellence & Holistic Medicine</span>
            <h1 className="acoor-main-title">
              ACOOR
            </h1>
            <h2 style={{ fontSize: 'clamp(1.2rem, 2.5vw, 1.85rem)', color: '#0d9488', fontWeight: 700, marginBottom: '1rem', fontFamily: 'Outfit, sans-serif' }}>
              Africa Clinic of Osteopathy and Rehabilitation
            </h2>
            <p className="acoor-subtitle">
              Pioneering international osteopathic medicine, specialized multidisciplinary rehabilitation, and elite global healthcare navigation for patients across Africa and beyond.
            </p>
          </div>
        </section>

        {/* Section 1: What is Osteopathy? */}
        <section className="container fade-in" style={{ padding: '4rem 2rem 2rem 2rem', display: 'block' }}>
          <div className="section-title" style={{ textAlign: 'left', marginBottom: '2rem' }}>
            <span className="section-badge">Holistic Medical Science</span>
            <h2>What is Osteopathy?</h2>
          </div>
          <div style={{ background: '#ffffff', borderRadius: '20px', padding: '2.5rem', border: '1px solid rgba(13, 148, 136, 0.16)', boxShadow: '0 10px 30px rgba(0,0,0,0.04)', lineHeight: '1.8', color: '#334155', fontSize: '1.02rem' }}>
            <p style={{ marginBottom: '1.25rem' }}>
              <strong>Osteopathy</strong> is an established, evidence-informed system of holistic healthcare that recognizes the profound interconnectedness of the human body’s structure, mobility, and biological function. Rather than merely masking superficial symptoms or prescribing temporary pain relievers, osteopathic medicine identifies and treats the underlying somatic dysfunctions that restrict blood flow, impair nerve conduction, and hinder mobility.
            </p>
            <p style={{ margin: 0 }}>
              Guided by the core medical philosophy that <em>the body possesses self-healing and self-regulating mechanisms</em>, an osteopathic physician uses precise hands-on palpation and gentle manual techniques to restore equilibrium across joints, spinal segments, fascial planes, visceral organs, and cranial membranes.
            </p>
          </div>
        </section>

        {/* Section 2: The 5 Pillars of Osteopathy */}
        <section className="container fade-in" style={{ padding: '2rem 2rem 4rem 2rem', display: 'block' }}>
          <div className="section-title" style={{ textAlign: 'left', marginBottom: '1.5rem' }}>
            <span className="section-badge">Core Clinical Principles</span>
            <h2>The 5 Pillars of Osteopathic Medicine</h2>
            <p>The foundational models used internationally and at Germany’s prestigious Still Academy to evaluate and restore health:</p>
          </div>

          <div className="pillars-grid">
            {[
              {
                num: 'Pillar 01',
                title: 'The Biomechanical Model (Parietal)',
                desc: 'Focuses on structural alignment, joint articulation, muscular balance, and fascial elasticity. Restores unrestricted biomechanical motion across the spine and extremities to eliminate mechanical strain.'
              },
              {
                num: 'Pillar 02',
                title: 'The Neurological Model',
                desc: 'Addresses the central, peripheral, and autonomic nervous systems. Reduces neural entrapments, normalizes hyperactive spinal reflexes, and calms chronic neurogenic pain pathways.'
              },
              {
                num: 'Pillar 03',
                title: 'The Respiratory & Circulatory Model',
                desc: 'Optimizes arterial blood supply, venous return, and lymphatic drainage. Cellular repair requires oxygenation and toxin clearance; osteopathy decompress thoracic and diaphragmatic restrictions.'
              },
              {
                num: 'Pillar 04',
                title: 'The Metabolic & Visceral Model',
                desc: 'Focuses on the physiological mobility of internal organs (stomach, liver, intestines, pelvis) and their vascular supply to enhance digestive efficiency, neuroendocrine balance, and metabolic vitality.'
              },
              {
                num: 'Pillar 05',
                title: 'The Biopsychosocial Model (Craniosacral)',
                desc: 'Recognizes the patient as a complete unity of body, mind, and emotional equilibrium. Integrates craniosacral rhythm therapy to release profound deep-tissue tension and stress-induced somatic holding patterns.'
              }
            ].map(p => (
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
              <span className="section-badge">Professional Standards</span>
              <h2>Who is an Osteopath?</h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
              <div style={{ background: '#ffffff', borderRadius: '18px', padding: '2rem', border: '1px solid #e2e8f0', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
                <h3 style={{ fontSize: '1.2rem', color: 'var(--secondary-color)', marginBottom: '0.75rem' }}>
                  🎓 Extensive Medical & Academy Training
                </h3>
                <p style={{ color: '#475569', fontSize: '0.94rem', lineHeight: '1.7' }}>
                  An Osteopath is an extensively trained, highly skilled primary-contact medical practitioner specializing in manual diagnosis and non-invasive therapy. In Germany and across the EU, qualified osteopaths complete rigorous multi-year medical education (over 1,350+ to 5,000+ hours) mastering clinical anatomy, embryology, neurology, pathology, and biomechanics.
                </p>
              </div>
              <div style={{ background: '#ffffff', borderRadius: '18px', padding: '2rem', border: '1px solid #e2e8f0', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
                <h3 style={{ fontSize: '1.2rem', color: 'var(--secondary-color)', marginBottom: '0.75rem' }}>
                  🔍 Detecting Root Causes, Not Symptoms
                </h3>
                <p style={{ color: '#475569', fontSize: '0.94rem', lineHeight: '1.7' }}>
                  Unlike practitioners who focus solely on the immediate area of pain, an osteopath examines the entire functional chain. For instance, chronic shoulder stiffness may stem from diaphragm tension or cervical nerve restriction; an osteopath accurately identifies the root origin and applies gentle, targeted corrections.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 4: Biography of Dr. Albert */}
        <section className="container fade-in" style={{ padding: '4rem 2rem', display: 'block' }}>
          <div className="section-title" style={{ textAlign: 'left', marginBottom: '1.5rem' }}>
            <span className="section-badge">Leadership & Clinical Mastery</span>
            <h2>Meet Dr. Albert</h2>
            <p>Founder & Executive Clinical Director of ACOOR</p>
          </div>

          <div className="bio-card-wrapper">
            <div className="bio-img-container">
              <Image
                src="/albert-physio.png"
                alt="Dr. Albert"
                fill
                style={{ objectFit: 'cover', objectPosition: 'center top' }}
                priority
              />
            </div>
            <div className="bio-content">
              <span className="still-badge">
                🏛️ Lecturer at Still Academy Germany
              </span>
              <h3 style={{ fontSize: '1.85rem', color: 'var(--text-primary)', marginBottom: '0.35rem', fontWeight: 800 }}>
                Albert T.
              </h3>
              <p style={{ fontSize: '0.95rem', color: 'var(--primary-color)', fontWeight: 600, marginBottom: '1.25rem' }}>
                Osteopathic Medicine & Clinical Rehabilitation Specialist
              </p>
              <div style={{ color: '#334155', fontSize: '0.94rem', lineHeight: '1.7', display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
                <p>
                  Dr. Albert completed his comprehensive medical education in <strong>Osteopathic Medicine in Germany</strong>, immersing himself in the highest standards of European clinical rigor, functional rehabilitation, and musculoskeletal science.
                </p>
                <p>
                  Demonstrating exceptional clinical acumen and pedagogical mastery, he was appointed as a distinguished <strong>Lecturer and Clinical Instructor at the Still Academy</strong> in Germany—one of Europe’s foremost academic institutions for osteopathic science, founded on the foundational teachings of Dr. Andrew Taylor Still.
                </p>
                <p>
                  Driven by a profound vision to elevate healthcare on the African continent, Dr. Albert established <strong>ACOOR (Africa Clinic of Osteopathy and Rehabilitation)</strong>. His clinical practice unites European precision, hands-on empathy, and evidence-based therapeutic protocols, providing patients in Ghana and across Africa with healthcare comparable to the finest clinics in Munich, Berlin, and Zurich.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 5: Our Global Mission & International Hospital Advisory */}
        <section className="container fade-in" style={{ padding: '0 2rem 3rem 2rem', display: 'block' }}>
          <div className="global-advisory-banner">
            <span style={{ background: 'rgba(13, 148, 136, 0.3)', border: '1px solid #0d9488', color: '#5eead4', fontSize: '0.75rem', fontWeight: 700, padding: '0.35rem 0.85rem', borderRadius: '9999px', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'inline-block', marginBottom: '1rem' }}>
              Global Medical Advisory & Travel Coordination
            </span>
            <h2 style={{ fontSize: 'clamp(1.75rem, 3vw, 2.4rem)', color: '#ffffff', marginBottom: '1rem', fontWeight: 800 }}>
              Our Global Mission: Connecting You With the World’s Leading Hospitals
            </h2>
            <p style={{ color: '#cbd5e1', fontSize: '1.02rem', lineHeight: '1.75', maxWidth: '850px', marginBottom: '1.75rem' }}>
              At ACOOR, our commitment extends beyond local outpatient therapy. Through Dr. Albert’s established medical faculty connections and institutional liaisons across <strong>Germany, Switzerland, the UK, and Europe</strong>, we provide specialized advisory and direct medical referrals for patients requiring advanced surgical, neurosurgical, or tertiary medical care abroad.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
              <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: '12px', padding: '1.25rem', border: '1px solid rgba(255,255,255,0.1)' }}>
                <strong style={{ display: 'block', color: '#5eead4', fontSize: '1.05rem', marginBottom: '0.4rem' }}>
                  🏥 Elite Hospital Network
                </strong>
                <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
                  Direct contact with accredited university clinics and top orthopedic surgery centers in Germany and across Europe.
                </span>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: '12px', padding: '1.25rem', border: '1px solid rgba(255,255,255,0.1)' }}>
                <strong style={{ display: 'block', color: '#5eead4', fontSize: '1.05rem', marginBottom: '0.4rem' }}>
                  🩺 Second Opinions & Case Review
                </strong>
                <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
                  Independent clinical review of MRI scans, surgical indications, and treatment protocols before traveling overseas.
                </span>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: '12px', padding: '1.25rem', border: '1px solid rgba(255,255,255,0.1)' }}>
                <strong style={{ display: 'block', color: '#5eead4', fontSize: '1.05rem', marginBottom: '0.4rem' }}>
                  🔄 Seamless Pre- & Post-Op Care
                </strong>
                <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
                  Complete pre-operative conditioning in Accra and intensive rehabilitation upon your return home.
                </span>
              </div>
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
              <span>💬</span> Inquire About International Hospital Advisory
            </a>
          </div>
        </section>

        {/* Section 6: Comprehensive Rehabilitation Services */}
        <section className="container fade-in" style={{ padding: '1rem 2rem 5rem 2rem', display: 'block' }}>
          <div className="section-title" style={{ textAlign: 'left', marginBottom: '2rem' }}>
            <span className="section-badge">Comprehensive Clinical Care</span>
            <h2>Multidisciplinary Rehabilitation at ACOOR</h2>
            <p>Integrated rehabilitation departments structured to restore full functional independence:</p>
          </div>

          <div className="rehab-quad-grid">
            <div className="rehab-quad-card">
              <span style={{ fontSize: '2rem', display: 'block', marginBottom: '0.75rem' }}>🖐️</span>
              <h3 style={{ fontSize: '1.2rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                Physical Therapy (Physiotherapie)
              </h3>
              <p style={{ color: '#64748b', fontSize: '0.88rem', lineHeight: '1.6', marginBottom: '1rem' }}>
                State-of-the-art manual joint mobilization, spinal decompression, therapeutic ultrasound, sports kinetic recovery, and specialized neuromuscular re-education for acute and chronic conditions.
              </p>
              <Link href="/#treatments" style={{ color: 'var(--primary-color)', fontSize: '0.82rem', fontWeight: 700, textDecoration: 'none' }}>
                View 8 Specialized Treatments →
              </Link>
            </div>

            <div className="rehab-quad-card">
              <span style={{ fontSize: '2rem', display: 'block', marginBottom: '0.75rem' }}>🧩</span>
              <h3 style={{ fontSize: '1.2rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                Occupational Therapy (Ergotherapie)
              </h3>
              <p style={{ color: '#64748b', fontSize: '0.88rem', lineHeight: '1.6', marginBottom: '1rem' }}>
                Restoring everyday independence and functional autonomy. Tailored training for fine motor skills, hand therapy, stroke rehabilitation, ergonomic workplace adaptation, and cognitive re-integration.
              </p>
              <span style={{ background: '#f1f5f9', color: '#475569', padding: '0.2rem 0.6rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600 }}>
                Specialized Department
              </span>
            </div>

            <div className="rehab-quad-card">
              <span style={{ fontSize: '2rem', display: 'block', marginBottom: '0.75rem' }}>🗣️</span>
              <h3 style={{ fontSize: '1.2rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                Speech & Language Therapy (Logopädie)
              </h3>
              <p style={{ color: '#64748b', fontSize: '0.88rem', lineHeight: '1.6', marginBottom: '1rem' }}>
                Diagnostic assessment and therapeutic intervention for speech, language, voice, and swallowing disorders (dysphagia) following neurological trauma, stroke, surgery, or developmental delays.
              </p>
              <span style={{ background: '#f1f5f9', color: '#475569', padding: '0.2rem 0.6rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600 }}>
                Specialized Department
              </span>
            </div>

            <div className="rehab-quad-card">
              <span style={{ fontSize: '2rem', display: 'block', marginBottom: '0.75rem' }}>🏥</span>
              <h3 style={{ fontSize: '1.2rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                Post-Surgical Specialized Care
              </h3>
              <p style={{ color: '#64748b', fontSize: '0.88rem', lineHeight: '1.6', marginBottom: '1rem' }}>
                Structured surgeon-coordinated protocols following joint replacement (hip, knee, shoulder), spine operations, and ligament repairs. Prevents scar adhesion, restores gait, and safely rebuilds strength.
              </p>
              <Link href="/book?service=post-surgery" style={{ color: 'var(--primary-color)', fontSize: '0.82rem', fontWeight: 700, textDecoration: 'none' }}>
                Book Post-Surgery Care →
              </Link>
            </div>
          </div>

          <div style={{ textAlign: 'center', marginTop: '3rem' }}>
            <Link href="/book" className="btn primary" style={{ padding: '1rem 2.5rem', fontSize: '1.05rem', textDecoration: 'none' }}>
              Schedule Your Consultation at ACOOR Now
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
                <span style={{ color: '#94a3b8', fontSize: '0.72rem' }}>Africa Clinic of Osteopathy & Rehabilitation</span>
              </div>
            </div>
            <div className="footer-links">
              <Link href="/">Home</Link>
              <Link href="/about">About Us</Link>
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
