'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function StudentAssignments() {
  const [assignments, setAssignments] = useState([]);
  const [submissions, setSubmissions] = useState([]);

  useEffect(() => {
    Promise.all([
      fetch('/api/assignments').then(r => r.json()),
      fetch('/api/submissions').then(r => r.json()),
    ]).then(([a, s]) => {
      setAssignments(a.assignments || []);
      setSubmissions(s.submissions || []);
    });
  }, []);

  const submittedIds = new Set(submissions.map(s => s.assignment_id));

  // Filter to show recent/weekly assignments
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 30);
  const recentAssignments = assignments.filter(a => new Date(a.created_at) >= weekAgo);

  return (
    <div>
      <div className="dashboard-header">
        <div>
          <h1>✍️ Weekly Assignments</h1>
          <p>Complete and submit your assignments on time</p>
        </div>
      </div>

      <div className="grid-2" style={{ gridTemplateColumns: '1fr' }}>
        {(recentAssignments.length > 0 ? recentAssignments : assignments).map(a => {
          const isSubmitted = submittedIds.has(a.id);
          const sub = submissions.find(s => s.assignment_id === a.id);
          return (
            <div key={a.id} className="card" style={{ borderLeft: `3px solid ${isSubmitted ? 'var(--success)' : 'var(--accent-500)'}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h3 style={{ fontSize: '1.1rem', marginBottom: 'var(--space-2)' }}>{a.title}</h3>
                  <p style={{ marginBottom: 'var(--space-3)' }}>{a.description || 'No description provided.'}</p>
                  <div style={{ display: 'flex', gap: 'var(--space-4)', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    <span>👨‍🏫 {a.trainer_name}</span>
                    <span>📅 Due: {a.due_date || 'No deadline'}</span>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  {isSubmitted ? (
                    <div>
                      <span className="badge badge-success" style={{ marginBottom: 'var(--space-2)', display: 'inline-block' }}>✓ Submitted</span>
                      {sub?.marks != null && <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'Outfit' }}>{sub.marks}/100</div>}
                      {sub?.feedback && <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', maxWidth: 200 }}>{sub.feedback}</div>}
                    </div>
                  ) : (
                    <Link href={`/student/assignments/${a.id}`} className="btn btn-primary btn-sm">
                      Submit →
                    </Link>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        {assignments.length === 0 && (
          <div className="empty-state">
            <div className="icon">📝</div>
            <h3>No assignments yet</h3>
            <p>Your trainer hasn&apos;t posted any assignments.</p>
          </div>
        )}
      </div>
    </div>
  );
}
