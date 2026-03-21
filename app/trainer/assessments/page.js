'use client';
import { useState, useEffect } from 'react';

export default function TrainerAssessments() {
  const [assessments, setAssessments] = useState([]);
  const [batches, setBatches] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', batch_id: '', type: 'weekly', duration_minutes: 15 });
  const [questions, setQuestions] = useState([{ question_text: '', option_a: '', option_b: '', option_c: '', option_d: '', correct_option: 'A' }]);
  const [alert, setAlert] = useState(null);

  const loadData = () => {
    fetch('/api/assessments').then(r => r.json()).then(d => setAssessments(d.assessments || []));
    fetch('/api/batches').then(r => r.json()).then(d => setBatches(d.batches || []));
  };

  useEffect(() => { loadData(); }, []);

  const addQuestion = () => {
    setQuestions([...questions, { question_text: '', option_a: '', option_b: '', option_c: '', option_d: '', correct_option: 'A' }]);
  };

  const updateQuestion = (idx, field, value) => {
    const updated = [...questions];
    updated[idx][field] = value;
    setQuestions(updated);
  };

  const removeQuestion = (idx) => {
    if (questions.length > 1) setQuestions(questions.filter((_, i) => i !== idx));
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/assessments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        batch_id: parseInt(form.batch_id),
        duration_minutes: parseInt(form.duration_minutes),
        questions,
      }),
    });
    if (res.ok) {
      setForm({ title: '', batch_id: '', type: 'weekly', duration_minutes: 15 });
      setQuestions([{ question_text: '', option_a: '', option_b: '', option_c: '', option_d: '', correct_option: 'A' }]);
      setShowForm(false);
      setAlert({ type: 'success', msg: 'Assessment created successfully!' });
      loadData();
    }
  };

  return (
    <div>
      <div className="dashboard-header">
        <div>
          <h1>🎯 Create Assessments</h1>
          <p>Build MCQ-based tests for your students</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn btn-primary">
          {showForm ? '✕ Cancel' : '+ New Assessment'}
        </button>
      </div>

      {alert && <div className={`alert alert-${alert.type}`}>✓ {alert.msg}</div>}

      {showForm && (
        <div className="card mb-8">
          <h3 style={{ marginBottom: 'var(--space-4)' }}>New Assessment</h3>
          <form onSubmit={handleCreate}>
            <div className="grid-2">
              <div className="form-group">
                <label>Title</label>
                <input className="form-input" required value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="Assessment title" />
              </div>
              <div className="form-group">
                <label>Batch</label>
                <select className="form-select" required value={form.batch_id} onChange={e => setForm({...form, batch_id: e.target.value})}>
                  <option value="">Select Batch</option>
                  {batches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                </select>
              </div>
            </div>
            <div className="grid-2">
              <div className="form-group">
                <label>Type</label>
                <select className="form-select" value={form.type} onChange={e => setForm({...form, type: e.target.value})}>
                  <option value="weekly">Weekly Test</option>
                  <option value="monthly">Monthly Test</option>
                </select>
              </div>
              <div className="form-group">
                <label>Duration (minutes)</label>
                <input type="number" min="5" max="180" className="form-input" value={form.duration_minutes} onChange={e => setForm({...form, duration_minutes: e.target.value})} />
              </div>
            </div>

            <h4 style={{ margin: 'var(--space-6) 0 var(--space-4)', borderTop: '1px solid var(--border-subtle)', paddingTop: 'var(--space-4)' }}>
              Questions ({questions.length})
            </h4>

            {questions.map((q, i) => (
              <div key={i} style={{ padding: 'var(--space-4)', background: 'var(--bg-glass)', borderRadius: 'var(--radius-lg)', marginBottom: 'var(--space-4)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-3)' }}>
                  <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>Question {i + 1}</span>
                  {questions.length > 1 && <button type="button" onClick={() => removeQuestion(i)} className="btn btn-danger btn-sm">Remove</button>}
                </div>
                <div className="form-group">
                  <input className="form-input" required placeholder="Question text" value={q.question_text} onChange={e => updateQuestion(i, 'question_text', e.target.value)} />
                </div>
                <div className="grid-2">
                  <div className="form-group">
                    <label>Option A</label>
                    <input className="form-input" required value={q.option_a} onChange={e => updateQuestion(i, 'option_a', e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label>Option B</label>
                    <input className="form-input" required value={q.option_b} onChange={e => updateQuestion(i, 'option_b', e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label>Option C</label>
                    <input className="form-input" required value={q.option_c} onChange={e => updateQuestion(i, 'option_c', e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label>Option D</label>
                    <input className="form-input" required value={q.option_d} onChange={e => updateQuestion(i, 'option_d', e.target.value)} />
                  </div>
                </div>
                <div className="form-group">
                  <label>Correct Answer</label>
                  <select className="form-select" value={q.correct_option} onChange={e => updateQuestion(i, 'correct_option', e.target.value)} style={{ maxWidth: 200 }}>
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                    <option value="D">D</option>
                  </select>
                </div>
              </div>
            ))}

            <div style={{ display: 'flex', gap: 'var(--space-3)', marginTop: 'var(--space-4)' }}>
              <button type="button" onClick={addQuestion} className="btn btn-secondary">+ Add Question</button>
              <button type="submit" className="btn btn-primary">Create Assessment</button>
            </div>
          </form>
        </div>
      )}

      {/* Assessments List */}
      <div className="data-table-wrapper">
        <div className="data-table-header">
          <h3>All Assessments ({assessments.length})</h3>
        </div>
        <table className="data-table">
          <thead>
            <tr><th>Title</th><th>Type</th><th>Batch</th><th>Questions</th><th>Duration</th><th>Attempts</th></tr>
          </thead>
          <tbody>
            {assessments.map(a => (
              <tr key={a.id}>
                <td style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{a.title}</td>
                <td><span className={`badge ${a.type === 'weekly' ? 'badge-info' : 'badge-purple'}`}>{a.type}</span></td>
                <td>{a.batch_name}</td>
                <td>{a.question_count}</td>
                <td>{a.duration_minutes} min</td>
                <td><span className="badge badge-success">{a.attempts || 0}</span></td>
              </tr>
            ))}
            {assessments.length === 0 && <tr><td colSpan={6} style={{textAlign:'center',color:'var(--text-muted)'}}>No assessments created yet</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
