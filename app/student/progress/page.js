'use client';
import { useState, useEffect, useRef } from 'react';

export default function StudentProgress() {
  const [results, setResults] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const canvasRef = useRef(null);

  useEffect(() => {
    Promise.all([
      fetch('/api/assessment-results').then(r => r.json()),
      fetch('/api/submissions').then(r => r.json()),
    ]).then(([r, s]) => {
      setResults(r.results || []);
      setSubmissions(s.submissions || []);
    });
  }, []);

  useEffect(() => {
    if (!canvasRef.current || results.length === 0) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.parentElement.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = 300 * dpr;
    canvas.style.width = rect.width + 'px';
    canvas.style.height = '300px';
    ctx.scale(dpr, dpr);
    const w = rect.width;
    const h = 300;
    const padding = { top: 30, right: 30, bottom: 50, left: 50 };
    const chartW = w - padding.left - padding.right;
    const chartH = h - padding.top - padding.bottom;

    // Data
    const data = results.map(r => ({ label: r.assessment_title?.substring(0, 15) || 'Test', value: Math.round((r.score / r.total) * 100) }));

    // Clear
    ctx.clearRect(0, 0, w, h);

    // Grid lines
    ctx.strokeStyle = 'rgba(255,255,255,0.05)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const y = padding.top + (chartH / 4) * i;
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(w - padding.right, y);
      ctx.stroke();
      ctx.fillStyle = 'rgba(255,255,255,0.3)';
      ctx.font = '11px Inter';
      ctx.textAlign = 'right';
      ctx.fillText((100 - 25 * i) + '%', padding.left - 8, y + 4);
    }

    // Bars
    const barW = Math.min(60, chartW / data.length - 10);
    const gap = (chartW - barW * data.length) / (data.length + 1);

    data.forEach((d, i) => {
      const x = padding.left + gap + i * (barW + gap);
      const barH = (d.value / 100) * chartH;
      const y = padding.top + chartH - barH;

      // Gradient bar
      const grad = ctx.createLinearGradient(x, y, x, y + barH);
      if (d.value >= 80) { grad.addColorStop(0, '#4ade80'); grad.addColorStop(1, '#16a34a'); }
      else if (d.value >= 50) { grad.addColorStop(0, '#fbbf24'); grad.addColorStop(1, '#d97706'); }
      else { grad.addColorStop(0, '#f87171'); grad.addColorStop(1, '#dc2626'); }

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.roundRect(x, y, barW, barH, [4, 4, 0, 0]);
      ctx.fill();

      // Value label
      ctx.fillStyle = 'rgba(255,255,255,0.8)';
      ctx.font = 'bold 12px Outfit';
      ctx.textAlign = 'center';
      ctx.fillText(d.value + '%', x + barW / 2, y - 8);

      // X label
      ctx.fillStyle = 'rgba(255,255,255,0.4)';
      ctx.font = '10px Inter';
      ctx.fillText(d.label, x + barW / 2, h - padding.bottom + 20);
    });
  }, [results]);

  const avgScore = results.length > 0 ? Math.round(results.reduce((s, r) => s + (r.score / r.total) * 100, 0) / results.length) : 0;
  const bestScore = results.length > 0 ? Math.round(Math.max(...results.map(r => (r.score / r.total) * 100))) : 0;

  return (
    <div>
      <div className="dashboard-header">
        <div>
          <h1>📈 Progress Chart</h1>
          <p>Visual overview of your academic performance</p>
        </div>
      </div>

      <div className="stat-cards">
        <div className="stat-card purple">
          <div className="stat-card-value">{results.length}</div>
          <div className="stat-card-label">Tests Taken</div>
        </div>
        <div className="stat-card gold">
          <div className="stat-card-value">{avgScore}%</div>
          <div className="stat-card-label">Average Score</div>
        </div>
        <div className="stat-card green">
          <div className="stat-card-value">{bestScore}%</div>
          <div className="stat-card-label">Best Score</div>
        </div>
        <div className="stat-card blue">
          <div className="stat-card-value">{submissions.length}</div>
          <div className="stat-card-label">Assignments Submitted</div>
        </div>
      </div>

      {/* Chart */}
      <div className="chart-card mb-8">
        <h3>Assessment Performance</h3>
        {results.length > 0 ? (
          <div style={{ width: '100%', marginTop: 'var(--space-4)' }}>
            <canvas ref={canvasRef}></canvas>
          </div>
        ) : (
          <div className="empty-state">
            <div className="icon">📊</div>
            <h3>No data yet</h3>
            <p>Complete some assessments to see your progress chart.</p>
          </div>
        )}
      </div>

      {/* Assignment Marks Distribution */}
      {submissions.filter(s => s.marks != null).length > 0 && (
        <div className="chart-card">
          <h3>Assignment Grades</h3>
          <div style={{ display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap', marginTop: 'var(--space-4)' }}>
            {submissions.filter(s => s.marks != null).map(s => (
              <div key={s.id} style={{ flex: '1 1 auto', minWidth: 120, background: 'var(--bg-glass)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-4)', textAlign: 'center' }}>
                <div style={{ fontSize: '1.5rem', fontFamily: 'Outfit', fontWeight: 700, color: s.marks >= 80 ? 'var(--success)' : s.marks >= 50 ? 'var(--warning)' : 'var(--danger)' }}>{s.marks}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 'var(--space-1)' }}>{s.assignment_title?.substring(0, 20)}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
