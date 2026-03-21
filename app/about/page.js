import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export const metadata = {
  title: 'About Us - VidyaRise Academy',
  description: 'Learn about VidyaRise Academy\'s mission, vision, and the team behind our innovative education platform.',
};

export default function AboutPage() {
  return (
    <div className="about-page">
      <Navbar />

      {/* Hero */}
      <section className="section" style={{ paddingTop: '8rem' }}>
        <div className="section-inner">
          <div className="section-header">
            <span className="section-label">About Us</span>
            <h2>Shaping the <span className="gradient-text">Future of Education</span></h2>
            <p>Founded with a mission to make quality education accessible, personalized, and impactful for every student.</p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="section" style={{ background: 'var(--bg-secondary)' }}>
        <div className="section-inner">
          <div className="grid-2">
            <div className="card" style={{ borderTop: '3px solid var(--primary-500)' }}>
              <div className="card-icon">🎯</div>
              <h3>Our Mission</h3>
              <p>To empower every student with personalized, technology-driven education that builds confidence, nurtures curiosity, and prepares them for real-world challenges. We believe that every child deserves access to world-class learning experiences.</p>
            </div>
            <div className="card" style={{ borderTop: '3px solid var(--accent-500)' }}>
              <div className="card-icon">🔭</div>
              <h3>Our Vision</h3>
              <p>To become India&apos;s most trusted education platform by 2030, setting new benchmarks in personalized learning, assessment innovation, and student success rates. We envision a future where education knows no boundaries.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story Timeline */}
      <section className="section">
        <div className="section-inner">
          <div className="section-header">
            <span className="section-label">Our Journey</span>
            <h2>The VidyaRise <span className="gradient-text">Story</span></h2>
          </div>
          <div style={{ maxWidth: '700px', margin: '0 auto' }}>
            <div className="timeline">
              {[
                { year: '2018', title: 'The Beginning', desc: 'VidyaRise Academy was founded in Bangalore with a small team of 5 passionate educators.' },
                { year: '2019', title: 'First 500 Students', desc: 'Expanded to 3 partner schools and introduced our proprietary assessment system.' },
                { year: '2020', title: 'Digital Transformation', desc: 'Launched our full digital platform enabling remote learning during challenging times.' },
                { year: '2022', title: 'National Expansion', desc: 'Reached 50+ partner schools across 10 states with 3,000+ active students.' },
                { year: '2024', title: 'AI-Powered Learning', desc: 'Introduced personalized learning paths and intelligent assessment analytics.' },
                { year: '2026', title: 'Today', desc: 'Serving 5,000+ students with 200+ expert trainers and a 95% success rate.' },
              ].map((item, i) => (
                <div className="timeline-item" key={i}>
                  <div className="year">{item.year}</div>
                  <h4>{item.title}</h4>
                  <p>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="section" style={{ background: 'var(--bg-secondary)' }}>
        <div className="section-inner">
          <div className="section-header">
            <span className="section-label">Core Values</span>
            <h2>What Drives <span className="gradient-text">Us Forward</span></h2>
          </div>
          <div className="grid-4">
            {[
              { icon: '💡', title: 'Innovation', desc: 'Constantly evolving our methods and technology.' },
              { icon: '🤝', title: 'Integrity', desc: 'Transparent and honest in everything we do.' },
              { icon: '🌟', title: 'Excellence', desc: 'Setting the highest standards in education.' },
              { icon: '❤️', title: 'Empathy', desc: 'Understanding every student\'s unique needs.' },
            ].map((v, i) => (
              <div className="card" key={i} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: 'var(--space-4)' }}>{v.icon}</div>
                <h3>{v.title}</h3>
                <p>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="section">
        <div className="section-inner">
          <div className="section-header">
            <span className="section-label">Our Team</span>
            <h2>Meet the <span className="gradient-text">Leaders</span></h2>
          </div>
          <div className="grid-3">
            {[
              { name: 'Bala Manohar Budala', role: 'Founder & CEO', desc: 'Leading the vision of VidyaRise with a passion for education and innovation.' },
              { name: 'Gopi Rayala', role: 'Co Founder & COO', desc: 'Driving operations and scaling the platform to reach more students.' },
              { name: 'Durga Shankar Vajrapu', role: 'Co Founder & CTO', desc: 'Spearheading technology and building a seamless digital experience.' },
            ].map((t, i) => (
              <div className="card" key={i} style={{ textAlign: 'center' }}>
                <div style={{ width: '80px', height: '80px', borderRadius: 'var(--radius-full)', background: 'linear-gradient(135deg, var(--primary-600), var(--primary-800))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', margin: '0 auto var(--space-4)' }}>
                  {t.name.split(' ').map(n => n[0]).join('')}
                </div>
                <h3>{t.name}</h3>
                <div style={{ color: 'var(--accent-400)', fontSize: '0.85rem', marginBottom: 'var(--space-2)' }}>{t.role}</div>
                <p>{t.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
