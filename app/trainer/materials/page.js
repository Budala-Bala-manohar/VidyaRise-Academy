'use client';
import { useState, useEffect } from 'react';

export default function TrainerMaterials() {
  const [materials, setMaterials] = useState([]);
  const [batches, setBatches] = useState([]);
  const [schools, setSchools] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', batch_id: '', school_id: '' });
  const [file, setFile] = useState(null);
  const [alert, setAlert] = useState(null);
  const [uploading, setUploading] = useState(false);

  const loadData = () => {
    fetch('/api/materials').then(r => r.json()).then(d => setMaterials(d.materials || []));
    fetch('/api/batches').then(r => r.json()).then(d => setBatches(d.batches || []));
    fetch('/api/schools').then(r => r.json()).then(d => setSchools(d.schools || []));
  };

  useEffect(() => { loadData(); }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return setAlert({ type: 'danger', msg: 'Please select a file' });
    
    setUploading(true);
    setAlert(null);

    const formData = new FormData();
    formData.append('title', form.title);
    formData.append('description', form.description);
    if (form.batch_id) formData.append('batch_id', form.batch_id);
    if (form.school_id) formData.append('school_id', form.school_id);
    formData.append('file', file);

    try {
      const res = await fetch('/api/materials', {
        method: 'POST',
        body: formData, // fetch automatically sets the correct multipart/form-data boundary
      });
      
      if (res.ok) {
        setForm({ title: '', description: '', batch_id: '', school_id: '' });
        setFile(null);
        setShowForm(false);
        setAlert({ type: 'success', msg: 'Material uploaded successfully!' });
        loadData();
      } else {
        const errorData = await res.json();
        setAlert({ type: 'danger', msg: errorData.error || 'Upload failed' });
      }
    } catch (err) {
      setAlert({ type: 'danger', msg: 'Network error during upload' });
    } finally {
      setUploading(false);
    }
  };


  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this material?')) return;
    try {
      const res = await fetch(`/api/materials?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setAlert({ type: 'success', msg: 'Material deleted successfully' });
        loadData();
      } else {
        const errorData = await res.json();
        setAlert({ type: 'danger', msg: errorData.error || 'Failed to delete' });
      }
    } catch (err) {
      setAlert({ type: 'danger', msg: 'Network error during deletion' });
    }
  };

  const getFileIcon = (fileType) => {
    if (!fileType) return '📄';
    if (fileType.startsWith('image/')) return '🖼️';
    if (fileType.startsWith('video/')) return '🎥';
    if (fileType.includes('pdf')) return '📕';
    if (fileType.includes('zip') || fileType.includes('compressed')) return '🗜️';
    return '📄';
  };

  return (
    <div>
      <div className="dashboard-header">
        <div>
          <h1>📚 Course Materials</h1>
          <p>Upload files, documents, images, and videos for your batches</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn btn-primary">
          {showForm ? '✕ Cancel' : '+ Upload Material'}
        </button>
      </div>

      {alert && <div className={`alert alert-${alert.type}`}>{alert.type === 'success' ? '✓' : '⚠'} {alert.msg}</div>}

      {showForm && (
        <div className="card mb-8">
          <h3 style={{ marginBottom: 'var(--space-4)' }}>Upload New Course Material</h3>
          <form onSubmit={handleUpload}>
            <div className="grid-2">
              <div className="form-group">
                <label>Title</label>
                <input className="form-input" required value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="e.g. Chapter 1 Notes" />
              </div>
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label>Target School (Optional)</label>
                <select className="form-select" value={form.school_id} onChange={e => setForm({...form, school_id: e.target.value, batch_id: ''})}>
                  <option value="">Select School (or leave blank)</option>
                  {schools.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
                <small style={{ color: 'var(--text-muted)' }}>If selected, material will be available to all batches in this school.</small>
              </div>
              <div className="form-group">
                <label>Target Batch (Optional)</label>
                <select className="form-select" value={form.batch_id} onChange={e => setForm({...form, batch_id: e.target.value, school_id: ''})}>
                  <option value="">Select Batch (or leave blank)</option>
                  {batches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                </select>
                <small style={{ color: 'var(--text-muted)' }}>If selected, material will only be available to this batch.</small>
              </div>
            </div>
            
            <div className="form-group">
              <label>Description (Optional)</label>
              <textarea className="form-textarea" value={form.description} onChange={e => setForm({...form, description: e.target.value})} placeholder="Optional details about this material..." />
            </div>
            
            <div className="form-group">
              <label>Select File</label>
              <div style={{ border: '2px dashed var(--border-medium)', padding: 'var(--space-6)', borderRadius: 'var(--radius-md)', textAlign: 'center', backgroundColor: 'var(--bg-tertiary)' }}>
                <input 
                  type="file" 
                  id="fileUpload" 
                  className="form-input" 
                  required 
                  onChange={e => setFile(e.target.files[0])} 
                  style={{ display: 'none' }} 
                />
                <label htmlFor="fileUpload" className="btn btn-secondary cursor-pointer">
                  Browse Files
                </label>
                {file && (
                  <p style={{ marginTop: 'var(--space-3)', color: 'var(--text-accent)', fontWeight: 500 }}>
                    Selected: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                  </p>
                )}
                <p style={{ marginTop: 'var(--space-2)', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  Supports all standard formats (PDF, DOCX, ZIP, MP4, JPG, PNG)
                </p>
              </div>
            </div>

            <button type="submit" className="btn btn-primary" disabled={uploading} style={{ width: '100%', marginTop: 'var(--space-4)' }}>
              {uploading ? 'Uploading...' : 'Upload Material'}
            </button>
          </form>
        </div>
      )}

      {/* Materials List */}
      <div className="grid-2">
        {materials.length === 0 ? (
          <p style={{ color: 'var(--text-muted)' }}>No materials uploaded yet.</p>
        ) : (
          materials.map(m => (
            <div key={m.id} className="card" style={{ borderLeft: '3px solid var(--primary-500)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-2)' }}>
                  <span style={{ fontSize: '1.5rem' }}>{getFileIcon(m.file_type)}</span>
                  <h3 style={{ margin: 0 }}>{m.title}</h3>
                </div>
                {m.description && <p style={{ fontSize: '0.9rem', marginBottom: 'var(--space-3)' }}>{m.description}</p>}
                
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 'var(--space-4)' }}>
                  {m.batch_name && <span className="badge badge-primary">📦 Batch: {m.batch_name}</span>}
                  {m.school_name && <span className="badge badge-secondary">🏫 School: {m.school_name}</span>}
                  <span className="badge">📅 {new Date(m.created_at).toLocaleDateString()}</span>
                </div>
              </div>
              
              <div style={{ display: 'flex', gap: 'var(--space-3)', marginTop: 'auto' }}>
                <a href={m.file_path} target="_blank" rel="noopener noreferrer" className="btn btn-secondary btn-sm" style={{ flex: 1, textAlign: 'center' }}>
                  Preview
                </a>
                <a href={m.file_path} download className="btn btn-primary btn-sm" style={{ flex: 1, textAlign: 'center' }}>
                  Download
                </a>
                <button onClick={() => handleDelete(m.id)} className="btn btn-danger btn-sm" style={{ flex: 1 }}>
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
