'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [role, setRole] = useState('student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Login failed');
        setLoading(false);
        return;
      }
      // Redirect based on role
      if (data.user.role === 'admin') router.push('/admin');
      else if (data.user.role === 'trainer') router.push('/trainer');
      else router.push('/student');
    } catch {
      setError('Network error. Please try again.');
      setLoading(false);
    }
  };

  const demoCredentials = {
    student: { email: 'student@vidyarise.com', password: 'student123' },
    trainer: { email: 'trainer@vidyarise.com', password: 'trainer123' },
    admin: { email: 'admin@vidyarise.com', password: 'admin123' },
  };

  const fillDemo = () => {
    setEmail(demoCredentials[role].email);
    setPassword(demoCredentials[role].password);
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <Link href="/" className="navbar-logo" style={{ display: 'flex', justifyContent: 'center', marginBottom: 'var(--space-6)' }}>
          <img src="/logo.jpg" alt="VidyaRise" className="logo-img" style={{ height: '50px' }} />
          VidyaRise Academy
        </Link>
        <h1>Welcome Back</h1>
        <p className="subtitle">Sign in to access your dashboard</p>

        {/* Role Selector */}
        <div className="login-roles">
          {['student', 'trainer', 'admin'].map(r => (
            <button
              key={r}
              className={`login-role-btn ${role === r ? 'active' : ''}`}
              onClick={() => { setRole(r); setError(''); }}
              type="button"
            >
              {r === 'student' ? '🎓' : r === 'trainer' ? '👨‍🏫' : '⚙️'} {r.charAt(0).toUpperCase() + r.slice(1)}
            </button>
          ))}
        </div>

        {error && <div className="login-error">⚠️ {error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="login-email">Email</label>
            <input
              id="login-email"
              type="email"
              className="form-input"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder={`${role}@vidyarise.com`}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="login-password">Password</label>
            <input
              id="login-password"
              type="password"
              className="form-input"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>
          <button type="submit" className="btn btn-primary btn-lg w-full" disabled={loading} style={{ marginBottom: 'var(--space-4)' }}>
            {loading ? <><span className="loading-spinner"></span> Signing In...</> : `Sign In as ${role.charAt(0).toUpperCase() + role.slice(1)} →`}
          </button>
          <button type="button" className="btn btn-secondary btn-sm w-full" onClick={fillDemo}>
            Fill Demo Credentials
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: 'var(--space-6)' }}>
          <Link href="/" style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>← Back to Home</Link>
        </div>
      </div>
    </div>
  );
}
