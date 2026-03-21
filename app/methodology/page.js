import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export const metadata = {
  title: 'Teaching Methodology - VidyaRise Academy',
  description: 'Discover our innovative teaching methodology combining traditional wisdom with modern technology.',
};

export default function MethodologyPage() {
  return (
    <div className="methodology-page">
      <Navbar />

      <section className="section" style={{ paddingTop: '8rem' }}>
        <div className="section-inner">
          <div className="section-header">
            <span className="section-label">Our Approach</span>
            <h2>Innovative <span className="gradient-text">Teaching Methodology</span></h2>
            <p>A proven 6-step framework that ensures deep understanding, retention, and practical application of knowledge.</p>
          </div>
        </div>
      </section>

      {/* Methodology Steps */}
      <section className="section" style={{ background: 'var(--bg-secondary)' }}>
        <div className="section-inner" style={{ maxWidth: '800px' }}>
          <div className="methodology-steps">
            {[
              { num: '01', title: 'Concept Introduction', desc: 'Every lesson begins with a relatable real-world scenario or story that connects the concept to the student\'s everyday life, making abstract ideas tangible and interesting.' },
              { num: '02', title: 'Interactive Exploration', desc: 'Students engage with the material through visual aids, simulations, and guided discussions. We use Socratic questioning to develop critical thinking rather than rote memorization.' },
              { num: '03', title: 'Guided Practice', desc: 'Step-by-step worked examples are presented, followed by collaborative problem-solving where students work together, learning from peers while being guided by expert trainers.' },
              { num: '04', title: 'Independent Application', desc: 'Weekly assignments challenge students to apply concepts independently. Tasks range from structured exercises to open-ended problems encouraging creative thinking.' },
              { num: '05', title: 'Assessment & Feedback', desc: 'Regular MCQ-based assessments with auto-evaluation provide instant feedback. Detailed analytics help identify strengths and areas needing improvement.' },
              { num: '06', title: 'Review & Reinforce', desc: 'Monthly comprehensive reviews ensure long-term retention. Personalized revision plans are generated based on each student\'s performance data.' },
            ].map((step, i) => (
              <div className="methodology-step" key={i}>
                <div className="methodology-step-number">{step.num}</div>
                <div className="methodology-step-content">
                  <h3>{step.title}</h3>
                  <p>{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Key Principles */}
      <section className="section">
        <div className="section-inner">
          <div className="section-header">
            <span className="section-label">Principles</span>
            <h2>Built on <span className="gradient-text">Proven Principles</span></h2>
          </div>
          <div className="grid-3">
            {[
              { icon: '🧠', title: 'Active Learning', desc: 'Students learn best by doing. Our methodology emphasizes hands-on activities, discussions, and problem-solving over passive listening.' },
              { icon: '🔄', title: 'Spaced Repetition', desc: 'Content is revisited at strategic intervals to move knowledge from short-term to long-term memory, dramatically improving retention rates.' },
              { icon: '📈', title: 'Growth Mindset', desc: 'We cultivate a growth mindset where mistakes are viewed as learning opportunities. Regular feedback focuses on progress, not just grades.' },
              { icon: '🎮', title: 'Gamification', desc: 'Learning milestones, achievements, and healthy competition keep students motivated and engaged throughout their journey.' },
              { icon: '🤖', title: 'Data-Driven Insights', desc: 'Analytics from assessments guide our teaching strategy, allowing us to adapt content and pace to each student\'s needs.' },
              { icon: '🌱', title: 'Holistic Development', desc: 'Beyond academics, we focus on developing communication, teamwork, and problem-solving skills essential for real-world success.' },
            ].map((p, i) => (
              <div className="card" key={i}>
                <div style={{ fontSize: '2rem', marginBottom: 'var(--space-4)' }}>{p.icon}</div>
                <h3>{p.title}</h3>
                <p>{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
