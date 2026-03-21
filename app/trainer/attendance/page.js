'use client';
import { useState, useEffect } from 'react';

export default function TrainerAttendance() {
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Get students from all batches the trainer has assignments for
    fetch('/api/assignments').then(r => r.json()).then(data => {
      const batchIds = [...new Set((data.assignments || []).map(a => a.batch_id))];
      if (batchIds.length > 0) {
        fetch('/api/users?role=student').then(r => r.json()).then(d => {
          const batchStudents = (d.users || []).filter(u => batchIds.includes(u.batch_id));
          setStudents(batchStudents);
          // Default all to present
          const def = {};
          batchStudents.forEach(s => def[s.id] = 'present');
          setAttendance(def);
        });
      }
    });
  }, []);

  // Load existing attendance for selected date
  useEffect(() => {
    fetch(`/api/attendance?date=${date}`).then(r => r.json()).then(d => {
      const existing = {};
      (d.attendance || []).forEach(a => existing[a.student_id] = a.status);
      if (Object.keys(existing).length > 0) {
        setAttendance(prev => {
          const merged = { ...prev };
          for (const [id, status] of Object.entries(existing)) merged[id] = status;
          return merged;
        });
      }
    });
  }, [date]);

  const handleSave = async () => {
    setLoading(true);
    const records = students.map(s => ({
      student_id: s.id,
      date,
      status: attendance[s.id] || 'present',
    }));
    const res = await fetch('/api/attendance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ records }),
    });
    if (res.ok) {
      setAlert({ type: 'success', msg: `Attendance saved for ${date}` });
    } else {
      setAlert({ type: 'error', msg: 'Failed to save attendance' });
    }
    setLoading(false);
  };

  const counts = {
    present: Object.values(attendance).filter(v => v === 'present').length,
    absent: Object.values(attendance).filter(v => v === 'absent').length,
    late: Object.values(attendance).filter(v => v === 'late').length,
  };

  return (
    <div>
      <div className="dashboard-header">
        <div>
          <h1>✅ Mark Attendance</h1>
          <p>Record daily attendance for your students</p>
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center' }}>
          <input type="date" className="form-input" value={date} onChange={e => setDate(e.target.value)} style={{ width: 'auto' }} />
          <button onClick={handleSave} className="btn btn-primary" disabled={loading || students.length === 0}>
            {loading ? <><span className="loading-spinner"></span> Saving...</> : '💾 Save Attendance'}
          </button>
        </div>
      </div>

      {alert && <div className={`alert alert-${alert.type}`}>{alert.type === 'success' ? '✓' : '⚠'} {alert.msg}</div>}

      {/* Summary */}
      <div className="stat-cards" style={{ marginBottom: 'var(--space-6)' }}>
        <div className="stat-card green">
          <div className="stat-card-value">{counts.present}</div>
          <div className="stat-card-label">Present</div>
        </div>
        <div className="stat-card" style={{ borderLeft: '3px solid var(--danger)' }}>
          <div className="stat-card-value">{counts.absent}</div>
          <div className="stat-card-label">Absent</div>
        </div>
        <div className="stat-card gold">
          <div className="stat-card-value">{counts.late}</div>
          <div className="stat-card-label">Late</div>
        </div>
      </div>

      {/* Student List */}
      <div className="card">
        <h3 style={{ marginBottom: 'var(--space-4)' }}>Students ({students.length})</h3>
        {students.length === 0 ? (
          <div className="empty-state">
            <div className="icon">👥</div>
            <h3>No students found</h3>
            <p>No students in your assigned batches.</p>
          </div>
        ) : (
          <div className="attendance-grid">
            {students.map(s => (
              <div key={s.id} className="attendance-row">
                <div>
                  <div className="attendance-name">{s.name}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{s.email} • {s.batch_name || 'No batch'}</div>
                </div>
                <div className="attendance-actions">
                  {['present', 'absent', 'late'].map(status => (
                    <button
                      key={status}
                      className={`attendance-btn ${status} ${attendance[s.id] === status ? `active-${status}` : ''}`}
                      onClick={() => setAttendance(prev => ({ ...prev, [s.id]: status }))}
                    >
                      {status === 'present' ? '✓' : status === 'absent' ? '✕' : '⏰'} {status.charAt(0).toUpperCase() + status.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
