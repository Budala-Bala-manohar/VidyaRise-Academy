import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export const metadata = {
  title: 'Why Choose Us - VidyaRise Academy',
  description: 'Discover why VidyaRise Academy is the preferred choice for quality education and student success.',
};

export default function WhyChooseUsPage() {
  return (
    <div className="why-page">
      <Navbar />

      <section className="section" style={{ paddingTop: '8rem' }}>
        <div className="section-inner">
          <div className="section-header">
            <span className="section-label">Why Choose Us</span>
            <h2>The VidyaRise <span className="gradient-text">Advantage</span></h2>
            <p>Here&apos;s what sets VidyaRise Academy apart from traditional education systems.</p>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="section" style={{ background: 'var(--bg-secondary)' }}>
        <div className="section-inner">
          <div className="grid-3">
            {[
              { icon: '🏆', title: '95% Success Rate', desc: 'Our students consistently outperform peers with a proven track record of academic excellence.' },
              { icon: '👨‍🏫', title: '200+ Expert Trainers', desc: 'Learn from industry veterans and subject matter experts who are passionate about teaching.' },
              { icon: '📱', title: 'Digital-First Platform', desc: 'Access learning materials, submit assignments, and take assessments from anywhere, anytime.' },
              { icon: '📊', title: 'Real-Time Analytics', desc: 'Interactive progress charts and detailed performance reports keep students and parents informed.' },
              { icon: '⏱️', title: 'Timed Assessments', desc: 'MCQ-based tests with auto-evaluation simulate real exam conditions for better preparation.' },
              { icon: '🔒', title: 'Safe & Secure', desc: 'Enterprise-grade security ensures all student data and academic records are fully protected.' },
              { icon: '💰', title: 'Affordable Pricing', desc: 'Quality education at competitive prices with flexible payment options and scholarship programs.' },
              { icon: '🤝', title: 'Parent Engagement', desc: 'Regular updates and progress reports keep parents actively involved in their child\'s journey.' },
              { icon: '🌐', title: 'Multi-School Network', desc: 'Our network of 50+ partner schools ensures consistent quality across all locations.' },
            ].map((b, i) => (
              <div className="card" key={i}>
                <div style={{ fontSize: '2rem', marginBottom: 'var(--space-4)' }}>{b.icon}</div>
                <h3>{b.title}</h3>
                <p>{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="section">
        <div className="section-inner">
          <div className="section-header">
            <span className="section-label">Comparison</span>
            <h2>VidyaRise vs <span className="gradient-text">Traditional Learning</span></h2>
          </div>
          <div style={{ maxWidth: '900px', margin: '0 auto', overflowX: 'auto' }}>
            <table className="comparison-table">
              <thead>
                <tr>
                  <th>Feature</th>
                  <th>VidyaRise Academy</th>
                  <th>Traditional System</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Personalized Learning Paths', true, false],
                  ['Real-Time Progress Tracking', true, false],
                  ['Auto-Evaluated Assessments', true, false],
                  ['Weekly Performance Reports', true, false],
                  ['Expert Trainer Network', true, true],
                  ['Digital Assignment Submission', true, false],
                  ['Interactive MCQ Testing', true, false],
                  ['Parent Dashboard Access', true, false],
                  ['Timed Online Examinations', true, false],
                  ['Data-Driven Teaching', true, false],
                ].map(([feature, vr, trad], i) => (
                  <tr key={i}>
                    <td>{feature}</td>
                    <td><span className={vr ? 'check' : 'cross'}>{vr ? '✓' : '✕'}</span></td>
                    <td><span className={trad ? 'check' : 'cross'}>{trad ? '✓' : '✕'}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section" style={{ background: 'var(--bg-secondary)' }}>
        <div className="section-inner">
          <div className="section-header">
            <span className="section-label">Success Stories</span>
            <h2>Hear From Our <span className="gradient-text">Students</span></h2>
          </div>
          <div className="grid-2">
            {[
              { text: 'The weekly assessments and instant feedback helped me identify my weak areas early. I improved my math score by 40% in just 3 months!', author: 'Aarav Sharma', role: 'Class X Student' },
              { text: 'VidyaRise\'s platform makes teaching so much more efficient. I can track every student\'s progress and provide targeted support where needed.', author: 'Dr. Sunita Verma', role: 'Senior Math Trainer' },
              { text: 'As a parent, the transparency and regular updates give me peace of mind. I always know how my daughter is performing.', author: 'Rajesh Gupta', role: 'Parent' },
              { text: 'The MCQ assessments with timer really prepared me for competitive exams. I cleared the Science Olympiad on my first attempt!', author: 'Neha Patel', role: 'Class XII Student' },
            ].map((t, i) => (
              <div className="testimonial-card" key={i}>
                <p>{t.text}</p>
                <div className="testimonial-author">{t.author}</div>
                <div className="testimonial-role">{t.role}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
