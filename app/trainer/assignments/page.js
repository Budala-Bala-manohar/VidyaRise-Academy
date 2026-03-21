'use client';
import { useState, useEffect } from 'react';

export default function TrainerAssignments() {
  const [assignments, setAssignments] = useState([]);
  const [batches, setBatches] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', batch_id: '', due_date: '' });
  const [submissions, setSubmissions] = useState({});
  const [gradeForm, setGradeForm] = useState(null);
  const [alert, setAlert] = useState(null);

  const loadData = () => {
    fetch('/api/assignments').then(r => r.json()).then(d => setAssignments(d.assignments || []));
    fetch('/api/batches').then(r => r.json()).then(d => setBatches(d.batches || []));
  };

  useEffect(() => { loadData(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/assignments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, batch_id: parseInt(form.batch_id) }),
    });
    if (res.ok) {
      setForm({ title: '', description: '', batch_id: '', due_date: '' });
      setShowForm(false);
      setAlert({ type: 'success', msg: 'Assignment created!' });
      loadData();
    }
  };

  const viewSubmissions = async (assignmentId) => {
    const res = await fetch(`/api/submissions?assignment_id=${assignmentId}`);
    const data = await res.json();
    setSubmissions(prev => ({ ...prev, [assignmentId]: data.submissions || [] }));
  };

  const handleGrade = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/submissions', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(gradeForm),
    });
    if (res.ok) {
      setGradeForm(null);
      setAlert({ type: 'success', msg: 'Graded successfully!' });
      if (gradeForm.assignment_id) viewSubmissions(gradeForm.assignment_id);
    }
  };

  return (
    <div>
      <div className="dashboard-header">
        <div>
          <h1>📝 Upload Assignments</h1>
          <p>Create and manage assignments for your batches</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn btn-primary">
          {showForm ? '✕ Cancel' : '+ New Assignment'}
        </button>
      </div>

      {alert && <div className={`alert alert-${alert.type}`}>{alert.type === 'success' ? '✓' : '⚠'} {alert.msg}</div>}

      {showForm && (
        <div className="card mb-8">
          <h3 style={{ marginBottom: 'var(--space-4)' }}>Create New Assignment</h3>
          <form onSubmit={handleCreate}>
            <div className="grid-2">
              <div className="form-group">
                <label>Title</label>
                <input className="form-input" required value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="Assignment title" />
              </div>
              <div className="form-group">
                <label>Batch</label>
                <select className="form-select" required value={form.batch_id} onChange={e => setForm({...form, batch_id: e.target.value})}>
                  <option value="">Select Batch</option>
                  {batches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                </select>
              </div>
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea className="form-textarea" value={form.description} onChange={e => setForm({...form, description: e.target.value})} placeholder="Assignment instructions..." />
            </div>
            <div className="form-group">
              <label>Due Date</label>
              <input type="date" className="form-input" value={form.due_date} onChange={e => setForm({...form, due_date: e.target.value})} style={{ maxWidth: 300 }} />
            </div>
            <button type="submit" className="btn btn-primary">Create Assignment</button>
          </form>
        </div>
      )}

      {/* Assignments List */}
      {assignments.map(a => (
        <div key={a.id} className="card mb-4" style={{ borderLeft: '3px solid var(--primary-500)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <h3>{a.title}</h3>
              <p>{a.description || 'No description'}</p>
              <div style={{ display: 'flex', gap: 'var(--space-4)', fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 'var(--space-2)' }}>
                <span>📦 {a.batch_name}</span>
                <span>📅 Due: {a.due_date || '—'}</span>
                <span>📋 {a.submission_count || 0} submissions</span>
              </div>
            </div>
            <button onClick={() => viewSubmissions(a.id)} className="btn btn-secondary btn-sm">
              View Submissions
            </button>
          </div>

          {submissions[a.id] && (
            <div style={{ marginTop: 'var(--space-6)', paddingTop: 'var(--space-4)', borderTop: '1px solid var(--border-subtle)' }}>
              <h4 style={{ fontSize: '0.9rem', marginBottom: 'var(--space-3)' }}>Submissions ({submissions[a.id].length})</h4>
              {submissions[a.id].length === 0 ? (
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>No submissions yet</p>
              ) : (
                <table className="data-table">
                  <thead><tr><th>Student</th><th>Answer</th><th>Marks</th><th>Action</th></tr></thead>
                  <tbody>
                    {submissions[a.id].map(s => (
                      <tr key={s.id}>
                        <td style={{ fontWeight: 500 }}>{s.student_name}</td>
                        <td style={{ maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.answer_text}</td>
                        <td>{s.marks != null ? `${s.marks}/100` : <span className="badge badge-warning">Ungraded</span>}</td>
                        <td>
                          <button onClick={() => setGradeForm({ id: s.id, marks: s.marks || '', feedback: s.feedback || '', assignment_id: a.id })} className="btn btn-secondary btn-sm">
                            Grade
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </div>
      ))}

      {/* Grade Modal */}
      {gradeForm && (
        <div className="modal-overlay" onClick={() => setGradeForm(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2>Grade Submission</h2>
            <form onSubmit={handleGrade}>
              <div className="form-group">
                <label>Marks (out of 100)</label>
                <input type="number" min="0" max="100" className="form-input" required value={gradeForm.marks} onChange={e => setGradeForm({...gradeForm, marks: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Feedback</label>
                <textarea className="form-textarea" value={gradeForm.feedback} onChange={e => setGradeForm({...gradeForm, feedback: e.target.value})} placeholder="Feedback for the student..." />
              </div>
              <div className="modal-actions">
                <button type="button" onClick={() => setGradeForm(null)} className="btn btn-secondary">Cancel</button>
                <button type="submit" className="btn btn-primary">Save Grade</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
