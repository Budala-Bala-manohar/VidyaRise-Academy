import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Link from 'next/link';
const { getDb } = require('@/lib/db');

export const dynamic = 'force-dynamic';

export default function HomePage() {
  const db = getDb();
  let courses = [];
  try {
    courses = db.prepare('SELECT * FROM courses ORDER BY created_at ASC').all();
  } catch (e) {
    console.error('Failed to load courses:', e);
  }

  const getCourseStyle = (index) => {
    const styles = [
      { icon: '💻', color: 'var(--primary-500)', desc: 'Learn programming, data structures, algorithms, and web development from industry experts.' },
      { icon: '🧠', color: 'var(--accent-500)', desc: 'Develop critical thinking, problem-solving, and professional competencies.' },
      { icon: '🤖', color: 'var(--success)', desc: 'Deep dive into machine learning, artificial intelligence, and cutting-edge technologies.' },
      { icon: '🗣️', color: 'var(--warning)', desc: 'Master communication, teamwork, and leadership skills for modern workplaces.' },
      { icon: '📚', color: 'var(--info)', desc: 'Comprehensive curriculum designed to build foundational knowledge progressing to advanced mastery.' },
    ];
    return styles[index % styles.length];
  };

  return (
    <>
      <Navbar />
      
      {/* Hero Section */}
      <section className="hero" id="hero">
        <div className="hero-content">
          <div className="hero-badge">Transforming Education Since 2018</div>
          <h1>
            Unlock Your <span className="gradient-text">Full Potential</span> with VidyaRise Academy
          </h1>
          <p>
            Experience a revolutionary approach to learning with personalized teaching, 
            cutting-edge assessments, and real-time progress tracking that empowers every student to excel.
          </p>
          <div className="hero-buttons">
            <Link href="/programs" className="btn btn-primary btn-lg">Explore Programs →</Link>
            <Link href="/login" className="btn btn-secondary btn-lg">Student Portal</Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <div className="stats-bar" id="stats">
        <div className="stat">
          <div className="stat-number">5,000+</div>
          <div className="stat-label">Students Enrolled</div>
        </div>
        <div className="stat">
          <div className="stat-number">200+</div>
          <div className="stat-label">Expert Trainers</div>
        </div>
        <div className="stat">
          <div className="stat-number">50+</div>
          <div className="stat-label">Partner Schools</div>
        </div>
        <div className="stat">
          <div className="stat-number">95%</div>
          <div className="stat-label">Success Rate</div>
        </div>
      </div>

      {/* Features */}
      <section className="section" id="features">
        <div className="section-inner">
          <div className="section-header">
            <span className="section-label">Why Students Love Us</span>
            <h2>Everything You Need to <span className="gradient-text">Succeed</span></h2>
            <p>Our comprehensive platform provides every tool and resource needed for academic excellence.</p>
          </div>
          <div className="grid-3">
            {[
              { icon: '📚', title: 'Structured Curriculum', desc: 'Carefully designed programs that build knowledge progressively with clear learning objectives.' },
              { icon: '🎯', title: 'Personalized Learning', desc: 'Adaptive assessments and customized study plans tailored to each student\'s pace and style.' },
              { icon: '📊', title: 'Progress Tracking', desc: 'Real-time analytics and interactive charts showing detailed performance metrics over time.' },
              { icon: '✍️', title: 'Weekly Assignments', desc: 'Regular assignments with detailed feedback from expert trainers to reinforce learning.' },
              { icon: '🏆', title: 'MCQ Assessments', desc: 'Timed online tests with auto-evaluation for instant results and performance insights.' },
              { icon: '👥', title: 'Expert Trainers', desc: 'Learn from experienced educators passionate about nurturing the next generation.' },
            ].map((f, i) => (
              <div className="card" key={i}>
                <div className="card-icon">{f.icon}</div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Programs Preview */}
      <section className="section" style={{ background: 'var(--bg-secondary)' }} id="programs-preview">
        <div className="section-inner">
          <div className="section-header">
            <span className="section-label">Our Programs</span>
            <h2>Comprehensive <span className="gradient-text">Learning Paths</span></h2>
            <p>From foundational courses to advanced topics, we have programs for every level.</p>
          </div>
          <div className="grid-3">
            {courses.length > 0 ? courses.map((course, i) => {
              const style = getCourseStyle(i);
              return (
                <div className="card" key={course.id} style={{ borderTop: `3px solid ${style.color}` }}>
                  <div className="card-icon">{style.icon}</div>
                  <h3 style={{ textTransform: 'capitalize' }}>{course.name}</h3>
                  <p>{style.desc}</p>
                  <Link href="/programs" className="btn btn-secondary btn-sm" style={{ marginTop: 'var(--space-4)' }}>
                    Learn More →
                  </Link>
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

      {/* Testimonials */}
      <section className="section" id="testimonials">
        <div className="section-inner">
          <div className="section-header">
            <span className="section-label">Testimonials</span>
            <h2>What Our <span className="gradient-text">Community Says</span></h2>
          </div>
          <div className="grid-3">
            {[
              { text: 'VidyaRise transformed my learning experience. The personalized approach and regular assessments helped me score 95% in my final exams!', author: 'Priya M.', role: 'Student, Class XII' },
              { text: 'The trainer dashboard makes it incredibly easy to track student progress and create engaging assessments. Best platform I\'ve worked with.', author: 'Dr. Rajesh K.', role: 'Senior Trainer' },
              { text: 'As a parent, I love the weekly progress reports and the transparency in my child\'s learning journey. Highly recommended!', author: 'Meera S.', role: 'Parent' },
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

      {/* CTA */}
      <section className="section" style={{ background: 'var(--bg-secondary)' }}>
        <div className="section-inner" style={{ textAlign: 'center' }}>
          <h2 style={{ marginBottom: 'var(--space-4)' }}>Ready to Start Your <span className="gradient-text">Learning Journey</span>?</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-8)', maxWidth: '500px', margin: '0 auto var(--space-8)' }}>
            Join thousands of students who are already transforming their education with VidyaRise Academy.
          </p>
          <div className="hero-buttons">
            <Link href="/contact" className="btn btn-primary btn-lg">Get Started Today</Link>
            <Link href="/about" className="btn btn-secondary btn-lg">Learn More</Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
