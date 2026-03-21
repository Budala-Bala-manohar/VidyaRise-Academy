'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function StudentDashboard() {
  const [data, setData] = useState({ assignments: [], results: [], user: null });

  useEffect(() => {
    Promise.all([
      fetch('/api/assignments').then(r => r.json()),
      fetch('/api/assessment-results').then(r => r.json()),
      fetch('/api/auth/me').then(r => r.json()),
    ]).then(([a, r, u]) => {
      setData({ assignments: a.assignments || [], results: r.results || [], user: u.user });
    });
  }, []);

  const pending = data.assignments.length;
  const avgScore = data.results.length > 0 
    ? Math.round(data.results.reduce((s, r) => s + (r.score / r.total) * 100, 0) / data.results.length)
    : 0;

  return (
    <div>
      <div className="dashboard-header">
        <div>
          <h1>Welcome back, {data.user?.name || 'Student'}! 👋</h1>
          <p>Here&apos;s your learning overview</p>
        </div>
      </div>

      <div className="stat-cards">
        <div className="stat-card purple">
          <div className="stat-card-header">
            <span className="stat-card-icon">📚</span>
          </div>
          <div className="stat-card-value">{pending}</div>
          <div className="stat-card-label">Total Assignments</div>
        </div>
        <div className="stat-card gold">
          <div className="stat-card-header">
            <span className="stat-card-icon">🎯</span>
          </div>
          <div className="stat-card-value">{data.results.length}</div>
          <div className="stat-card-label">Tests Completed</div>
        </div>
        <div className="stat-card green">
          <div className="stat-card-header">
            <span className="stat-card-icon">📊</span>
          </div>
          <div className="stat-card-value">{avgScore}%</div>
          <div className="stat-card-label">Average Score</div>
        </div>
        <div className="stat-card blue">
          <div className="stat-card-header">
            <span className="stat-card-icon">🏆</span>
          </div>
          <div className="stat-card-value">{data.results.filter(r => (r.score/r.total)*100 >= 80).length}</div>
          <div className="stat-card-label">High Scores (80%+)</div>
        </div>
      </div>

      <div className="grid-2">
        {/* Recent Assignments */}
        <div className="data-table-wrapper">
          <div className="data-table-header">
            <h3>📋 Recent Assignments</h3>
            <Link href="/student/assignments" className="btn btn-secondary btn-sm">View All</Link>
          </div>
          <table className="data-table">
            <thead><tr><th>Title</th><th>Due Date</th><th>Status</th></tr></thead>
            <tbody>
              {data.assignments.slice(0, 5).map(a => (
                <tr key={a.id}>
                  <td style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{a.title}</td>
                  <td>{a.due_date || '—'}</td>
                  <td>{new Date(a.due_date) < new Date() ? <span className="badge badge-danger">Overdue</span> : <span className="badge badge-success">Active</span>}</td>
                </tr>
              ))}
              {data.assignments.length === 0 && <tr><td colSpan={3} style={{textAlign:'center', color:'var(--text-muted)'}}>No assignments yet</td></tr>}
            </tbody>
          </table>
        </div>

        {/* Recent Results */}
        <div className="data-table-wrapper">
          <div className="data-table-header">
            <h3>🎯 Recent Test Results</h3>
            <Link href="/student/marks" className="btn btn-secondary btn-sm">View All</Link>
          </div>
          <table className="data-table">
            <thead><tr><th>Test</th><th>Score</th><th>Percentage</th></tr></thead>
            <tbody>
              {data.results.slice(0, 5).map(r => (
                <tr key={r.id}>
                  <td style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{r.assessment_title}</td>
                  <td>{r.score}/{r.total}</td>
                  <td>
                    <span className={`badge ${(r.score/r.total)*100 >= 80 ? 'badge-success' : (r.score/r.total)*100 >= 50 ? 'badge-warning' : 'badge-danger'}`}>
                      {Math.round((r.score/r.total)*100)}%
                    </span>
                  </td>
                </tr>
              ))}
              {data.results.length === 0 && <tr><td colSpan={3} style={{textAlign:'center', color:'var(--text-muted)'}}>No results yet</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
