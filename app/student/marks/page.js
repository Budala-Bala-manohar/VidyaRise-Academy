'use client';
import { useState, useEffect } from 'react';

export default function StudentMarks() {
  const [results, setResults] = useState([]);
  const [submissions, setSubmissions] = useState([]);

  useEffect(() => {
    Promise.all([
      fetch('/api/assessment-results').then(r => r.json()),
      fetch('/api/submissions').then(r => r.json()),
    ]).then(([r, s]) => {
      setResults(r.results || []);
      setSubmissions(s.submissions || []);
    });
  }, []);

  return (
    <div>
      <div className="dashboard-header">
        <div>
          <h1>📊 View Marks</h1>
          <p>Your assessment scores and assignment grades</p>
        </div>
      </div>

      {/* Assessment Results */}
      <div className="data-table-wrapper mb-8">
        <div className="data-table-header">
          <h3>🎯 Assessment Scores</h3>
          <span className="badge badge-info">{results.length} Tests</span>
        </div>
        <table className="data-table">
          <thead>
            <tr><th>Assessment</th><th>Type</th><th>Score</th><th>Percentage</th><th>Date</th></tr>
          </thead>
          <tbody>
            {results.map(r => {
              const pct = Math.round((r.score / r.total) * 100);
              return (
                <tr key={r.id}>
                  <td style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{r.assessment_title}</td>
                  <td><span className={`badge ${r.type === 'weekly' ? 'badge-info' : 'badge-purple'}`}>{r.type}</span></td>
                  <td>{r.score} / {r.total}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                      <div style={{ flex: 1, height: 6, background: 'var(--bg-glass)', borderRadius: 'var(--radius-full)', maxWidth: 100 }}>
                        <div style={{ height: '100%', width: `${pct}%`, background: pct >= 80 ? 'var(--success)' : pct >= 50 ? 'var(--warning)' : 'var(--danger)', borderRadius: 'var(--radius-full)' }}></div>
                      </div>
                      <span className={`badge ${pct >= 80 ? 'badge-success' : pct >= 50 ? 'badge-warning' : 'badge-danger'}`}>{pct}%</span>
                    </div>
                  </td>
                  <td>{new Date(r.submitted_at).toLocaleDateString()}</td>
                </tr>
              );
            })}
            {results.length === 0 && <tr><td colSpan={5} style={{textAlign:'center',color:'var(--text-muted)', padding: 'var(--space-8)'}}>No assessment results yet</td></tr>}
          </tbody>
        </table>
      </div>

      {/* Assignment Grades */}
      <div className="data-table-wrapper">
        <div className="data-table-header">
          <h3>✍️ Assignment Grades</h3>
          <span className="badge badge-info">{submissions.filter(s => s.marks != null).length} Graded</span>
        </div>
        <table className="data-table">
          <thead>
            <tr><th>Assignment</th><th>Marks</th><th>Feedback</th><th>Submitted</th></tr>
          </thead>
          <tbody>
            {submissions.map(s => (
              <tr key={s.id}>
                <td style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{s.assignment_title}</td>
                <td>
                  {s.marks != null 
                    ? <span style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: '1.1rem' }}>{s.marks}/100</span>
                    : <span className="badge badge-warning">Pending</span>
                  }
                </td>
                <td style={{ maxWidth: 300 }}>{s.feedback || '—'}</td>
                <td>{new Date(s.submitted_at).toLocaleDateString()}</td>
              </tr>
            ))}
            {submissions.length === 0 && <tr><td colSpan={4} style={{textAlign:'center',color:'var(--text-muted)', padding: 'var(--space-8)'}}>No submissions yet</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
