'use client';
import { useState, useEffect } from 'react';

export default function StudentMaterials() {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/materials')
      .then(r => r.json())
      .then(d => {
        setMaterials(d.materials || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const getFileIcon = (fileType) => {
    if (!fileType) return '📄';
    if (fileType.startsWith('image/')) return '🖼️';
    if (fileType.startsWith('video/')) return '🎥';
    if (fileType.includes('pdf')) return '📕';
    if (fileType.includes('zip') || fileType.includes('compressed')) return '🗜️';
    return '📄';
  };

  if (loading) return <div className="page-loading"><div className="loading-spinner" style={{width:40,height:40}}></div><p>Loading course materials...</p></div>;

  return (
    <div>
      <div className="dashboard-header">
        <div>
          <h1>📚 Course Materials</h1>
          <p>Access notes, presentations, and resources provided by your trainers</p>
        </div>
      </div>

      <div className="grid-2 mt-4">
        {materials.length === 0 ? (
          <div className="card" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: 'var(--space-8)' }}>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>No materials have been uploaded for your batch yet.</p>
          </div>
        ) : (
          materials.map(m => (
            <div key={m.id} className="card hover-card" style={{ borderLeft: '4px solid var(--primary-500)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-2)' }}>
                  <span style={{ fontSize: '1.8rem', background: 'var(--bg-tertiary)', padding: '10px', borderRadius: 'var(--radius-md)' }}>
                    {getFileIcon(m.file_type)}
                  </span>
                  <div>
                    <h3 style={{ margin: 0, color: 'var(--text-primary)' }}>{m.title}</h3>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Posted by {m.trainer_name}</p>
                  </div>
                </div>
                {m.description && <p style={{ fontSize: '0.9rem', marginBottom: 'var(--space-4)', color: 'var(--text-secondary)' }}>{m.description}</p>}
                
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 'var(--space-4)' }}>
                  <span className="badge">📅 {new Date(m.created_at).toLocaleDateString()}</span>
                </div>
              </div>
              
              <div style={{ display: 'flex', gap: 'var(--space-3)', marginTop: 'auto' }}>
                <a href={m.file_path} target="_blank" rel="noopener noreferrer" className="btn btn-secondary" style={{ flex: 1, textAlign: 'center' }}>
                  Preview
                </a>
                <a href={m.file_path} download className="btn btn-primary" style={{ flex: 1, textAlign: 'center' }}>
                  Download
                </a>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
