'use client';
import { useState, useEffect } from 'react';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [schools, setSchools] = useState([]);
  const [batches, setBatches] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'student', school_id: '', batch_id: '', phone: '' });
  const [alert, setAlert] = useState(null);
  const [filter, setFilter] = useState('all');

  const loadData = () => {
    fetch('/api/users').then(r => r.json()).then(d => setUsers(d.users || []));
    fetch('/api/schools').then(r => r.json()).then(d => setSchools(d.schools || []));
    fetch('/api/batches').then(r => r.json()).then(d => setBatches(d.batches || []));
  };
  useEffect(() => { loadData(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, school_id: form.school_id ? parseInt(form.school_id) : null, batch_id: form.batch_id ? parseInt(form.batch_id) : null }),
    });
    const data = await res.json();
    if (res.ok) { setForm({ name: '', email: '', password: '', role: 'student', school_id: '', batch_id: '', phone: '' }); setShowForm(false); setAlert({ type: 'success', msg: 'User created!' }); loadData(); }
    else setAlert({ type: 'error', msg: data.error });
  };

  const handleDelete = async (id, name) => {
    if (!confirm(`Delete user "${name}"?`)) return;
    await fetch(`/api/users?id=${id}`, { method: 'DELETE' });
    setAlert({ type: 'success', msg: 'User deleted' });
    loadData();
  };

  const filteredUsers = filter === 'all' ? users : users.filter(u => u.role === filter);

  return (
    <div>
      <div className="dashboard-header">
        <div><h1>👥 Manage Users</h1><p>Create, view, and manage all users</p></div>
        <button onClick={() => setShowForm(!showForm)} className="btn btn-primary">{showForm ? '✕ Cancel' : '+ New User'}</button>
      </div>

      {alert && <div className={`alert alert-${alert.type}`}>{alert.type === 'success' ? '✓' : '⚠'} {alert.msg}</div>}

      {showForm && (
        <div className="card mb-8">
          <h3 style={{ marginBottom: 'var(--space-4)' }}>Create New User</h3>
          <form onSubmit={handleCreate}>
            <div className="grid-2">
              <div className="form-group"><label>Name</label><input className="form-input" required value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="Full name" /></div>
              <div className="form-group"><label>Email</label><input type="email" className="form-input" required value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="user@email.com" /></div>
            </div>
            <div className="grid-2">
              <div className="form-group"><label>Password</label><input type="password" className="form-input" required value={form.password} onChange={e => setForm({...form, password: e.target.value})} placeholder="Min 6 characters" /></div>
              <div className="form-group"><label>Role</label>
                <select className="form-select" value={form.role} onChange={e => setForm({...form, role: e.target.value})}>
                  <option value="student">Student</option>
                  <option value="trainer">Trainer</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>
            <div className="grid-2">
              <div className="form-group"><label>School</label>
                <select className="form-select" value={form.school_id} onChange={e => setForm({...form, school_id: e.target.value})}>
                  <option value="">No School</option>
                  {schools.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
              <div className="form-group"><label>Batch</label>
                <select className="form-select" value={form.batch_id} onChange={e => setForm({...form, batch_id: e.target.value})}>
                  <option value="">No Batch</option>
                  {batches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                </select>
              </div>
            </div>
            <div className="form-group"><label>Phone</label><input className="form-input" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} placeholder="+91 XXXXXXXXXX" style={{ maxWidth: 300 }} /></div>
            <button type="submit" className="btn btn-primary">Create User</button>
          </form>
        </div>
      )}

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: 'var(--space-2)', marginBottom: 'var(--space-6)' }}>
        {['all', 'admin', 'trainer', 'student'].map(r => (
          <button key={r} onClick={() => setFilter(r)} className={`btn btn-sm ${filter === r ? 'btn-primary' : 'btn-secondary'}`}>
            {r.charAt(0).toUpperCase() + r.slice(1)}s ({r === 'all' ? users.length : users.filter(u => u.role === r).length})
          </button>
        ))}
      </div>

      <div className="data-table-wrapper">
        <table className="data-table">
          <thead>
            <tr><th>Name</th><th>Email</th><th>Role</th><th>School</th><th>Batch</th><th>Action</th></tr>
          </thead>
          <tbody>
            {filteredUsers.map(u => (
              <tr key={u.id}>
                <td style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{u.name}</td>
                <td>{u.email}</td>
                <td><span className={`badge ${u.role === 'admin' ? 'badge-danger' : u.role === 'trainer' ? 'badge-purple' : 'badge-info'}`}>{u.role}</span></td>
                <td>{u.school_name || '—'}</td>
                <td>{u.batch_name || '—'}</td>
                <td>
                  <button onClick={() => handleDelete(u.id, u.name)} className="btn btn-danger btn-sm" disabled={u.role === 'admin'}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
