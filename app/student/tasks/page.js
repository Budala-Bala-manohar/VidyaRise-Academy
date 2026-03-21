'use client';
import { useState, useEffect } from 'react';

export default function StudentTasks() {
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

  return (
    <div>
      <div className="dashboard-header">
        <div>
          <h1>📋 Assigned Tasks</h1>
          <p>View all assignments from your trainers</p>
        </div>
      </div>

      <div className="data-table-wrapper">
        <div className="data-table-header">
          <h3>All Assignments ({assignments.length})</h3>
        </div>
        <table className="data-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Trainer</th>
              <th>Due Date</th>
              <th>Status</th>
              <th>Marks</th>
            </tr>
          </thead>
          <tbody>
            {assignments.map(a => {
              const sub = submissions.find(s => s.assignment_id === a.id);
              return (
                <tr key={a.id}>
                  <td style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{a.title}</td>
                  <td>{a.trainer_name || '—'}</td>
                  <td>{a.due_date || '—'}</td>
                  <td>
                    {sub 
                      ? <span className="badge badge-success">Submitted</span>
                      : new Date(a.due_date) < new Date()
                        ? <span className="badge badge-danger">Overdue</span>
                        : <span className="badge badge-warning">Pending</span>
                    }
                  </td>
                  <td>{sub?.marks != null ? `${sub.marks}/100` : '—'}</td>
                </tr>
              );
            })}
            {assignments.length === 0 && (
              <tr><td colSpan={5} className="empty-state"><h3>No tasks assigned yet</h3></td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
