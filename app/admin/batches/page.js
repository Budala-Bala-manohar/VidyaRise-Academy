'use client';
import { useState, useEffect } from 'react';

export default function AdminBatches() {
  const [batches, setBatches] = useState([]);
  const [schools, setSchools] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ school_id: '', name: '', start_date: '', end_date: '' });
  const [alert, setAlert] = useState(null);

  const loadData = () => {
    fetch('/api/batches').then(r => r.json()).then(d => setBatches(d.batches || []));
    fetch('/api/schools').then(r => r.json()).then(d => setSchools(d.schools || []));
  };
  useEffect(() => { loadData(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/batches', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...form, school_id: parseInt(form.school_id) }) });
    if (res.ok) { setForm({ school_id: '', name: '', start_date: '', end_date: '' }); setShowForm(false); setAlert({ type: 'success', msg: 'Batch created!' }); loadData(); }
  };

  return (
    <div>
      <div className="dashboard-header">
        <div><h1>📦 Batches</h1><p>Create and manage student batches</p></div>
        <button onClick={() => setShowForm(!showForm)} className="btn btn-primary">{showForm ? '✕ Cancel' : '+ New Batch'}</button>
      </div>

      {alert && <div className={`alert alert-${alert.type}`}>✓ {alert.msg}</div>}

      {showForm && (
        <div className="card mb-8">
          <h3 style={{ marginBottom: 'var(--space-4)' }}>Create New Batch</h3>
          <form onSubmit={handleCreate}>
            <div className="grid-2">
              <div className="form-group"><label>Batch Name</label><input className="form-input" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Batch name" /></div>
              <div className="form-group"><label>School</label>
                <select className="form-select" required value={form.school_id} onChange={e => setForm({ ...form, school_id: e.target.value })}>
                  <option value="">Select School</option>
                  {schools.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
            </div>
            <div className="grid-2">
              <div className="form-group"><label>Start Date</label><input type="date" className="form-input" value={form.start_date} onChange={e => setForm({ ...form, start_date: e.target.value })} /></div>
              <div className="form-group"><label>End Date</label><input type="date" className="form-input" value={form.end_date} onChange={e => setForm({ ...form, end_date: e.target.value })} /></div>
            </div>
            <button type="submit" className="btn btn-primary">Create Batch</button>
          </form>
        </div>
      )}

      <div className="data-table-wrapper">
        <div className="data-table-header"><h3>All Batches ({batches.length})</h3></div>
        <table className="data-table">
          <thead><tr><th>Name</th><th>School</th><th>Start</th><th>End</th><th>Created</th></tr></thead>
          <tbody>
            {batches.map(b => (
              <tr key={b.id}>
                <td style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{b.name}</td>
                <td>{b.school_name}</td>
                <td>{b.start_date || '—'}</td>
                <td>{b.end_date || '—'}</td>
                <td>{new Date(b.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
