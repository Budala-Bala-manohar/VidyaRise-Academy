'use client';
import { useState, useEffect } from 'react';

export default function AdminTrainers() {
  const [trainers, setTrainers] = useState([]);
  const [schools, setSchools] = useState([]);
  const [batches, setBatches] = useState([]);

  useEffect(() => {
    fetch('/api/users?role=trainer').then(r => r.json()).then(d => setTrainers(d.users || []));
    fetch('/api/schools').then(r => r.json()).then(d => setSchools(d.schools || []));
    fetch('/api/batches').then(r => r.json()).then(d => setBatches(d.batches || []));
  }, []);

  return (
    <div>
      <div className="dashboard-header">
        <div><h1>👨‍🏫 Assign Trainers</h1><p>Manage trainer assignments to schools and batches</p></div>
      </div>

      <div className="stat-cards">
        <div className="stat-card purple">
          <div className="stat-card-value">{trainers.length}</div>
          <div className="stat-card-label">Total Trainers</div>
        </div>
        <div className="stat-card gold">
          <div className="stat-card-value">{trainers.filter(t => t.school_id).length}</div>
          <div className="stat-card-label">Assigned to Schools</div>
        </div>
      </div>

      <div className="data-table-wrapper">
        <div className="data-table-header"><h3>All Trainers</h3></div>
        <table className="data-table">
          <thead>
            <tr><th>Name</th><th>Email</th><th>Phone</th><th>School</th><th>Joined</th></tr>
          </thead>
          <tbody>
            {trainers.map(t => (
              <tr key={t.id}>
                <td style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{t.name}</td>
                <td>{t.email}</td>
                <td>{t.phone || '—'}</td>
                <td>{t.school_name || <span className="badge badge-warning">Unassigned</span>}</td>
                <td>{new Date(t.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
            {trainers.length === 0 && <tr><td colSpan={5} style={{textAlign:'center',color:'var(--text-muted)',padding:'var(--space-8)'}}>No trainers found</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
