'use client';
import { useState, useEffect } from 'react';

export default function AdminSchools() {
  const [schools, setSchools] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', address: '', phone: '', email: '' });
  const [alert, setAlert] = useState(null);

  const loadSchools = () => fetch('/api/schools').then(r => r.json()).then(d => setSchools(d.schools || []));
  useEffect(() => { loadSchools(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/schools', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    if (res.ok) { setForm({ name: '', address: '', phone: '', email: '' }); setShowForm(false); setAlert({ type: 'success', msg: 'School created!' }); loadSchools(); }
  };

  return (
    <div>
      <div className="dashboard-header">
        <div><h1>🏫 Schools</h1><p>Create and manage schools</p></div>
        <button onClick={() => setShowForm(!showForm)} className="btn btn-primary">{showForm ? '✕ Cancel' : '+ New School'}</button>
      </div>

      {alert && <div className={`alert alert-${alert.type}`}>✓ {alert.msg}</div>}

      {showForm && (
        <div className="card mb-8">
          <h3 style={{ marginBottom: 'var(--space-4)' }}>Create New School</h3>
          <form onSubmit={handleCreate}>
            <div className="grid-2">
              <div className="form-group"><label>School Name</label><input className="form-input" required value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="School name" /></div>
              <div className="form-group"><label>Email</label><input type="email" className="form-input" value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="school@example.com" /></div>
            </div>
            <div className="grid-2">
              <div className="form-group"><label>Address</label><input className="form-input" value={form.address} onChange={e => setForm({...form, address: e.target.value})} placeholder="Full address" /></div>
              <div className="form-group"><label>Phone</label><input className="form-input" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} placeholder="+91 XXXXXXXXXX" /></div>
            </div>
            <button type="submit" className="btn btn-primary">Create School</button>
          </form>
        </div>
      )}

      <div className="data-table-wrapper">
        <div className="data-table-header"><h3>All Schools ({schools.length})</h3></div>
        <table className="data-table">
          <thead><tr><th>Name</th><th>Address</th><th>Phone</th><th>Email</th><th>Created</th></tr></thead>
          <tbody>
            {schools.map(s => (
              <tr key={s.id}>
                <td style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{s.name}</td>
                <td>{s.address || '—'}</td>
                <td>{s.phone || '—'}</td>
                <td>{s.email || '—'}</td>
                <td>{new Date(s.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
