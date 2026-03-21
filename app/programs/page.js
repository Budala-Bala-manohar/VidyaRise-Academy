import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
const { getDb } = require('@/lib/db');

export const metadata = {
  title: 'Programs - VidyaRise Academy',
  description: 'Explore our comprehensive educational programs in Science, Mathematics, Computer Science, and Humanities.',
};

export const dynamic = 'force-dynamic';

export default function ProgramsPage() {
  const db = getDb();
  let courses = [];
  try {
    courses = db.prepare('SELECT * FROM courses ORDER BY created_at ASC').all();
  } catch (e) {
    console.error('Failed to load courses:', e);
  }

  const getCourseStyle = (index) => {
    const styles = [
      { icon: '💻', color: 'var(--primary-500)', level: 'All Levels', desc: 'Learn programming fundamentals, data structures, and web development.', duration: '8 weeks', mode: 'Online' },
      { icon: '🧠', color: 'var(--accent-500)', level: 'Beginner to Advanced', desc: 'Develop critical thinking, logical reasoning, and problem-solving skills.', duration: '4 weeks', mode: 'Hybrid' },
      { icon: '🤖', color: 'var(--success)', level: 'Intermediate', desc: 'Deep dive into machine learning, artificial intelligence, and new technologies.', duration: '12 weeks', mode: 'Online' },
      { icon: '🗣️', color: 'var(--warning)', level: 'All Levels', desc: 'Master communication, teamwork, and leadership skills for modern workplaces.', duration: '6 weeks', mode: 'Offline' },
      { icon: '📚', color: 'var(--info)', level: 'Foundational', desc: 'Comprehensive curriculum designed to build absolute mastery.', duration: '10 weeks', mode: 'Hybrid' },
    ];
    return styles[index % styles.length];
  };

  return (
    <div className="programs-page">
      <Navbar />

      {/* Hero */}
      <section className="section" style={{ paddingTop: '8rem' }}>
        <div className="section-inner">
          <div className="section-header">
            <span className="section-label">Our Programs</span>
            <h2>Comprehensive <span className="gradient-text">Learning Programs</span></h2>
            <p>Carefully designed courses that cater to every level, from foundational concepts to advanced competitive preparation.</p>
          </div>
        </div>
      </section>

      {/* Programs Grid */}
      <section className="section" style={{ background: 'var(--bg-secondary)', paddingTop: 'var(--space-8)' }}>
        <div className="section-inner">
          <div className="grid-2">
            {courses.length > 0 ? courses.map((course, i) => {
              const style = getCourseStyle(i);
              return (
                <div className="card" key={course.id} style={{ borderLeft: `3px solid ${style.color}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-4)' }}>
                    <div>
                      <div style={{ fontSize: '2rem', marginBottom: 'var(--space-2)' }}>{style.icon}</div>
                      <h3 style={{ fontSize: '1.25rem', textTransform: 'capitalize' }}>{course.name}</h3>
                      <span className="badge badge-purple" style={{ marginTop: 'var(--space-2)' }}>{style.level}</span>
                    </div>
                  </div>
                  <p style={{ marginBottom: 'var(--space-4)' }}>{style.desc}</p>
                  <div style={{ display: 'flex', gap: 'var(--space-6)', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    <span>⏱ {style.duration}</span>
                    <span>📍 {style.mode}</span>
                  </div>
                </div>
              );
            }) : (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', color: 'var(--text-muted)' }}>
                <p>No courses available at the moment. Check back soon!</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section">
        <div className="section-inner" style={{ textAlign: 'center' }}>
          <h2>Ready to <span className="gradient-text">Enroll</span>?</h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '500px', margin: '0 auto var(--space-8)' }}>
            Get in touch with us to learn more about our programs and find the perfect fit for your learning goals.
          </p>
          <a href="/contact" className="btn btn-primary btn-lg">Contact Us →</a>
        </div>
      </section>

      <Footer />
    </div>
  );
}
