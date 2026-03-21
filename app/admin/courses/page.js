'use client';
import { useState, useEffect } from 'react';

export default function AdminCourses() {
  const [courses, setCourses] = useState([]);
  const [name, setName] = useState('');
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(false);

  // Predefined courses requested by user
  const predefinedCourses = ['coding', 'aptitude', 'AI Awareness', 'soft skills'];

  const loadCourses = () => {
    fetch('/api/courses')
      .then(r => r.json())
      .then(d => setCourses(d.courses || []));
  };

  useEffect(() => {
    loadCourses();
  }, []);

  const handleCreate = async (courseName) => {
    setLoading(true);
    try {
      const res = await fetch('/api/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: courseName }),
      });
      const data = await res.json();
      if (res.ok) {
        setName('');
        setAlert({ type: 'success', msg: `Course "${data.name}" added successfully!` });
        loadCourses();
      } else {
        setAlert({ type: 'error', msg: data.error || 'Failed to add course' });
      }
    } catch (err) {
      setAlert({ type: 'error', msg: 'Network error' });
    }
    setLoading(false);
  };

  const handleAddDefault = async () => {
    setLoading(true);
    let addedCount = 0;
    for (const c of predefinedCourses) {
      // Check if it already exists to avoid unnecessary error messages
      if (!courses.some(existing => existing.name.toLowerCase() === c.toLowerCase())) {
        try {
          const res = await fetch('/api/courses', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: c }),
          });
          if (res.ok) addedCount++;
        } catch (e) {
          console.error('Error adding defaults');
        }
      }
    }
    if (addedCount > 0) {
      setAlert({ type: 'success', msg: `Successfully added ${addedCount} predefined courses!` });
      loadCourses();
    } else {
      setAlert({ type: 'info', msg: 'All predefined courses are already in the list.' });
    }
    setLoading(false);
  };

  const handleDelete = async (id, courseName) => {
    if (!confirm(`Are you sure you want to delete the course "${courseName}"?`)) return;
    
    try {
      const res = await fetch(`/api/courses?id=${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setAlert({ type: 'success', msg: `Course deleted successfully!` });
        loadCourses();
      } else {
        setAlert({ type: 'error', msg: 'Failed to delete course' });
      }
    } catch (err) {
      setAlert({ type: 'error', msg: 'Network error' });
    }
  };

  return (
    <div>
      <div className="dashboard-header">
        <div>
          <h1>📚 Manage Courses</h1>
          <p>Add and remove courses offered by the academy</p>
        </div>
        <button onClick={handleAddDefault} className="btn btn-secondary" disabled={loading}>
          {loading ? 'Processing...' : '+ Add Default Courses'}
        </button>
      </div>

      {alert && (
        <div className={`alert alert-${alert.type === 'error' ? 'danger' : alert.type}`} style={{ marginBottom: 'var(--space-6)' }}>
          {alert.type === 'success' ? '✓' : alert.type === 'info' ? 'ℹ' : '⚠'} {alert.msg}
        </div>
      )}

      <div className="grid-2">
        {/* Add Course Form */}
        <div className="card">
          <h3 style={{ marginBottom: 'var(--space-4)' }}>Add New Course</h3>
          <form onSubmit={(e) => { e.preventDefault(); handleCreate(name); }}>
            <div className="form-group">
              <label>Course Name</label>
              <input 
                className="form-input" 
                required 
                value={name} 
                onChange={e => setName(e.target.value)} 
                placeholder="e.g. Graphic Design" 
              />
            </div>
            <button type="submit" className="btn btn-primary w-full" disabled={loading || !name.trim()}>
              {loading ? 'Adding...' : 'Add Course'}
            </button>
          </form>
        </div>

        {/* Existing Courses List */}
        <div className="data-table-wrapper" style={{ marginBottom: 0 }}>
          <div className="data-table-header">
            <h3>Active Courses ({courses.length})</h3>
          </div>
          <table className="data-table">
            <thead>
              <tr>
                <th>Course Name</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {courses.map(course => (
                <tr key={course.id}>
                  <td style={{ fontWeight: 500, color: 'var(--text-primary)', textTransform: 'capitalize' }}>
                    {course.name}
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button 
                      onClick={() => handleDelete(course.id, course.name)} 
                      className="btn btn-danger btn-sm"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {courses.length === 0 && (
                <tr>
                  <td colSpan={2} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: 'var(--space-6)' }}>
                    No courses found. Click "Add Default Courses" or add one manually.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
