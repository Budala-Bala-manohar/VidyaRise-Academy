'use client';
import { useState } from 'react';

export default function AdminReports() {
  const [downloading, setDownloading] = useState(null);

  const downloadReport = async (type, label) => {
    setDownloading(type);
    try {
      const res = await fetch(`/api/reports?type=${type}`);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${type}_report.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Download failed:', err);
    }
    setDownloading(null);
  };

  const reports = [
    { type: 'users', icon: '👥', title: 'User Report', desc: 'Complete list of all users with roles, schools, and contact info.', color: 'var(--primary-500)' },
    { type: 'performance', icon: '📊', title: 'Performance Report', desc: 'Assessment scores and percentages for all students.', color: 'var(--accent-500)' },
    { type: 'attendance', icon: '✅', title: 'Attendance Report', desc: 'Daily attendance records for all students and trainers.', color: 'var(--success)' },
  ];

  return (
    <div>
      <div className="dashboard-header">
        <div><h1>📥 Download Reports</h1><p>Generate and download CSV reports</p></div>
      </div>

      <div className="grid-3">
        {reports.map(r => (
          <div key={r.type} className="card" style={{ borderTop: `3px solid ${r.color}`, textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: 'var(--space-4)' }}>{r.icon}</div>
            <h3>{r.title}</h3>
            <p style={{ marginBottom: 'var(--space-6)' }}>{r.desc}</p>
            <button 
              onClick={() => downloadReport(r.type, r.title)} 
              className="btn btn-primary w-full"
              disabled={downloading === r.type}
            >
              {downloading === r.type ? <><span className="loading-spinner"></span> Generating...</> : '📥 Download CSV'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
