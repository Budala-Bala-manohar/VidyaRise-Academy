'use client';
import { useState, useEffect } from 'react';

export default function TrainerPerformance() {
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
          <h1>📊 Student Performance</h1>
          <p>Track and monitor your students&apos; academic progress</p>
        </div>
      </div>

      <div className="stat-cards">
        <div className="stat-card purple">
          <div className="stat-card-value">{results.length}</div>
          <div className="stat-card-label">Test Attempts</div>
        </div>
        <div className="stat-card gold">
          <div className="stat-card-value">
            {results.length > 0 ? Math.round(results.reduce((s, r) => s + (r.score/r.total)*100, 0) / results.length) : 0}%
          </div>
          <div className="stat-card-label">Average Score</div>
        </div>
        <div className="stat-card green">
          <div className="stat-card-value">{submissions.length}</div>
          <div className="stat-card-label">Assignment Submissions</div>
        </div>
        <div className="stat-card blue">
          <div className="stat-card-value">{submissions.filter(s => s.marks == null).length}</div>
          <div className="stat-card-label">Pending Grades</div>
        </div>
      </div>

      {/* Assessment Results */}
      <div className="data-table-wrapper mb-8">
        <div className="data-table-header">
          <h3>🎯 Assessment Results</h3>
        </div>
        <table className="data-table">
          <thead>
            <tr><th>Student</th><th>Assessment</th><th>Score</th><th>Percentage</th><th>Date</th></tr>
          </thead>
          <tbody>
            {results.map(r => {
              const pct = Math.round((r.score/r.total)*100);
              return (
                <tr key={r.id}>
                  <td style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{r.student_name}</td>
                  <td>{r.assessment_title}</td>
                  <td>{r.score}/{r.total}</td>
                  <td><span className={`badge ${pct >= 80 ? 'badge-success' : pct >= 50 ? 'badge-warning' : 'badge-danger'}`}>{pct}%</span></td>
                  <td>{new Date(r.submitted_at).toLocaleDateString()}</td>
                </tr>
              );
            })}
            {results.length === 0 && <tr><td colSpan={5} style={{textAlign:'center',color:'var(--text-muted)',padding:'var(--space-8)'}}>No results yet</td></tr>}
          </tbody>
        </table>
      </div>

      {/* Assignment Grades */}
      <div className="data-table-wrapper">
        <div className="data-table-header">
          <h3>✍️ Assignment Submissions</h3>
        </div>
        <table className="data-table">
          <thead>
            <tr><th>Student</th><th>Assignment</th><th>Marks</th><th>Status</th></tr>
          </thead>
          <tbody>
            {submissions.map(s => (
              <tr key={s.id}>
                <td style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{s.student_name}</td>
                <td>{s.assignment_title}</td>
                <td>{s.marks != null ? `${s.marks}/100` : '—'}</td>
                <td>{s.marks != null ? <span className="badge badge-success">Graded</span> : <span className="badge badge-warning">Pending</span>}</td>
              </tr>
            ))}
            {submissions.length === 0 && <tr><td colSpan={4} style={{textAlign:'center',color:'var(--text-muted)',padding:'var(--space-8)'}}>No submissions yet</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
