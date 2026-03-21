'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AdminDashboard() {
  const [data, setData] = useState({ schools: [], batches: [], users: [], assessments: [] });

  useEffect(() => {
    Promise.all([
      fetch('/api/schools').then(r => r.json()),
      fetch('/api/batches').then(r => r.json()),
      fetch('/api/users').then(r => r.json()),
      fetch('/api/assessments').then(r => r.json()),
    ]).then(([s, b, u, a]) => {
      setData({ schools: s.schools||[], batches: b.batches||[], users: u.users||[], assessments: a.assessments||[] });
    });
  }, []);

  const students = data.users.filter(u => u.role === 'student');
  const trainers = data.users.filter(u => u.role === 'trainer');

  return (
    <div>
      <div className="dashboard-header">
        <div>
          <h1>Admin Dashboard ⚙️</h1>
          <p>Overview of the entire VidyaRise platform</p>
        </div>
      </div>

      <div className="stat-cards">
        <div className="stat-card purple">
          <div className="stat-card-header"><span className="stat-card-icon">🏫</span></div>
          <div className="stat-card-value">{data.schools.length}</div>
          <div className="stat-card-label">Schools</div>
        </div>
        <div className="stat-card gold">
          <div className="stat-card-header"><span className="stat-card-icon">📦</span></div>
          <div className="stat-card-value">{data.batches.length}</div>
          <div className="stat-card-label">Batches</div>
        </div>
        <div className="stat-card green">
          <div className="stat-card-header"><span className="stat-card-icon">🎓</span></div>
          <div className="stat-card-value">{students.length}</div>
          <div className="stat-card-label">Students</div>
        </div>
        <div className="stat-card blue">
          <div className="stat-card-header"><span className="stat-card-icon">👨‍🏫</span></div>
          <div className="stat-card-value">{trainers.length}</div>
          <div className="stat-card-label">Trainers</div>
        </div>
      </div>

      <div className="grid-2">
        <div className="data-table-wrapper">
          <div className="data-table-header">
            <h3>🏫 Schools</h3>
            <Link href="/admin/schools" className="btn btn-secondary btn-sm">Manage</Link>
          </div>
          <table className="data-table">
            <thead><tr><th>Name</th><th>Email</th></tr></thead>
            <tbody>
              {data.schools.map(s => (
                <tr key={s.id}>
                  <td style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{s.name}</td>
                  <td>{s.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="data-table-wrapper">
          <div className="data-table-header">
            <h3>👥 Recent Users</h3>
            <Link href="/admin/users" className="btn btn-secondary btn-sm">Manage</Link>
          </div>
          <table className="data-table">
            <thead><tr><th>Name</th><th>Role</th></tr></thead>
            <tbody>
              {data.users.slice(0, 5).map(u => (
                <tr key={u.id}>
                  <td style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{u.name}</td>
                  <td><span className={`badge ${u.role === 'admin' ? 'badge-danger' : u.role === 'trainer' ? 'badge-purple' : 'badge-info'}`}>{u.role}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
