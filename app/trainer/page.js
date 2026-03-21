'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function TrainerDashboard() {
  const [data, setData] = useState({ user: null, assignments: [], assessments: [] });

  useEffect(() => {
    Promise.all([
      fetch('/api/auth/me').then(r => r.json()),
      fetch('/api/assignments').then(r => r.json()),
      fetch('/api/assessments').then(r => r.json()),
    ]).then(([u, a, as]) => {
      setData({ user: u.user, assignments: a.assignments || [], assessments: as.assessments || [] });
    });
  }, []);

  const totalSubmissions = data.assignments.reduce((s, a) => s + (a.submission_count || 0), 0);
  const totalAttempts = data.assessments.reduce((s, a) => s + (a.attempts || 0), 0);

  return (
    <div>
      <div className="dashboard-header">
        <div>
          <h1>Welcome, {data.user?.name || 'Trainer'}! 👨‍🏫</h1>
          <p>Manage your assignments and assessments</p>
        </div>
      </div>

      <div className="stat-cards">
        <div className="stat-card purple">
          <div className="stat-card-header"><span className="stat-card-icon">📝</span></div>
          <div className="stat-card-value">{data.assignments.length}</div>
          <div className="stat-card-label">Assignments Created</div>
        </div>
        <div className="stat-card gold">
          <div className="stat-card-header"><span className="stat-card-icon">📋</span></div>
          <div className="stat-card-value">{totalSubmissions}</div>
          <div className="stat-card-label">Total Submissions</div>
        </div>
        <div className="stat-card green">
          <div className="stat-card-header"><span className="stat-card-icon">🎯</span></div>
          <div className="stat-card-value">{data.assessments.length}</div>
          <div className="stat-card-label">Assessments Created</div>
        </div>
        <div className="stat-card blue">
          <div className="stat-card-header"><span className="stat-card-icon">📊</span></div>
          <div className="stat-card-value">{totalAttempts}</div>
          <div className="stat-card-label">Test Attempts</div>
        </div>
      </div>

      <div className="grid-2">
        <div className="data-table-wrapper">
          <div className="data-table-header">
            <h3>📝 Recent Assignments</h3>
            <Link href="/trainer/assignments" className="btn btn-secondary btn-sm">Manage</Link>
          </div>
          <table className="data-table">
            <thead><tr><th>Title</th><th>Batch</th><th>Submissions</th></tr></thead>
            <tbody>
              {data.assignments.slice(0, 5).map(a => (
                <tr key={a.id}>
                  <td style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{a.title}</td>
                  <td>{a.batch_name}</td>
                  <td><span className="badge badge-info">{a.submission_count || 0}</span></td>
                </tr>
              ))}
              {data.assignments.length === 0 && <tr><td colSpan={3} style={{textAlign:'center',color:'var(--text-muted)'}}>No assignments</td></tr>}
            </tbody>
          </table>
        </div>

        <div className="data-table-wrapper">
          <div className="data-table-header">
            <h3>🎯 Recent Assessments</h3>
            <Link href="/trainer/assessments" className="btn btn-secondary btn-sm">Manage</Link>
          </div>
          <table className="data-table">
            <thead><tr><th>Title</th><th>Questions</th><th>Attempts</th></tr></thead>
            <tbody>
              {data.assessments.slice(0, 5).map(a => (
                <tr key={a.id}>
                  <td style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{a.title}</td>
                  <td>{a.question_count}</td>
                  <td><span className="badge badge-info">{a.attempts || 0}</span></td>
                </tr>
              ))}
              {data.assessments.length === 0 && <tr><td colSpan={3} style={{textAlign:'center',color:'var(--text-muted)'}}>No assessments</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
