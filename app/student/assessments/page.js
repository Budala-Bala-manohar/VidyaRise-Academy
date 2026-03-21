'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function StudentAssessments() {
  const [assessments, setAssessments] = useState([]);

  useEffect(() => {
    fetch('/api/assessments').then(r => r.json()).then(data => {
      setAssessments(data.assessments || []);
    });
  }, []);

  return (
    <div>
      <div className="dashboard-header">
        <div>
          <h1>🎯 Assessments</h1>
          <p>Take MCQ-based tests and view your results</p>
        </div>
      </div>

      <div className="grid-2" style={{ gridTemplateColumns: '1fr' }}>
        {assessments.map(a => {
          const completed = a.result_id != null;
          return (
            <div key={a.id} className="card" style={{ borderLeft: `3px solid ${completed ? 'var(--success)' : 'var(--primary-500)'}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center', marginBottom: 'var(--space-2)' }}>
                    <h3 style={{ margin: 0 }}>{a.title}</h3>
                    <span className={`badge ${a.type === 'weekly' ? 'badge-info' : 'badge-purple'}`}>{a.type}</span>
                  </div>
                  <div style={{ display: 'flex', gap: 'var(--space-4)', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    <span>👨‍🏫 {a.trainer_name}</span>
                    <span>❓ {a.question_count} Questions</span>
                    <span>⏱ {a.duration_minutes} min</span>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  {completed ? (
                    <div>
                      <span className="badge badge-success" style={{ display: 'block', marginBottom: 'var(--space-2)' }}>✓ Completed</span>
                      <div style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: '1.5rem' }}>{a.score}/{a.total}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{Math.round((a.score/a.total)*100)}%</div>
                    </div>
                  ) : (
                    <Link href={`/student/assessments/${a.id}`} className="btn btn-primary">
                      Start Test →
                    </Link>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        {assessments.length === 0 && (
          <div className="empty-state">
            <div className="icon">🎯</div>
            <h3>No assessments available</h3>
            <p>Your trainer hasn&apos;t created any assessments yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
