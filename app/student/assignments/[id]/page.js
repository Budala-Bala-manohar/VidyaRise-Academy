'use client';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

export default function SubmitAssignment() {
  const router = useRouter();
  const params = useParams();
  const [assignment, setAssignment] = useState(null);
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);

  useEffect(() => {
    fetch('/api/assignments').then(r => r.json()).then(data => {
      const a = data.assignments?.find(a => a.id === parseInt(params.id));
      if (a) setAssignment(a);
    });
  }, [params.id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assignment_id: parseInt(params.id), answer_text: answer }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus('success');
        setTimeout(() => router.push('/student/assignments'), 2000);
      } else {
        setStatus(data.error || 'Submission failed');
      }
    } catch {
      setStatus('Network error');
    }
    setLoading(false);
  };

  if (!assignment) return <div className="page-loading"><div className="loading-spinner" style={{width:40,height:40}}></div></div>;

  return (
    <div>
      <div className="dashboard-header">
        <div>
          <h1>Submit Assignment</h1>
          <p>{assignment.title}</p>
        </div>
        <button onClick={() => router.back()} className="btn btn-secondary">← Back</button>
      </div>

      <div className="card" style={{ maxWidth: 800 }}>
        <div style={{ marginBottom: 'var(--space-6)', paddingBottom: 'var(--space-6)', borderBottom: '1px solid var(--border-subtle)' }}>
          <h3 style={{ marginBottom: 'var(--space-2)' }}>{assignment.title}</h3>
          <p style={{ marginBottom: 'var(--space-3)' }}>{assignment.description || 'No description.'}</p>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', gap: 'var(--space-4)' }}>
            <span>👨‍🏫 {assignment.trainer_name}</span>
            <span>📅 Due: {assignment.due_date || 'No deadline'}</span>
          </div>
        </div>

        {status === 'success' ? (
          <div className="alert alert-success">✓ Assignment submitted successfully! Redirecting...</div>
        ) : (
          <form onSubmit={handleSubmit}>
            {typeof status === 'string' && status !== 'success' && (
              <div className="alert alert-error">⚠ {status}</div>
            )}
            <div className="form-group">
              <label htmlFor="answer">Your Answer</label>
              <textarea
                id="answer"
                className="form-textarea"
                style={{ minHeight: 200 }}
                value={answer}
                onChange={e => setAnswer(e.target.value)}
                placeholder="Type your answer here..."
                required
              />
            </div>
            <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
              {loading ? <><span className="loading-spinner"></span> Submitting...</> : 'Submit Answer →'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
