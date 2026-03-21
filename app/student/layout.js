'use client';
import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import ThemeToggle from '../components/ThemeToggle';

export default function StudentLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/auth/me').then(r => r.json()).then(data => {
      if (!data.user || data.user.role !== 'student') {
        router.push('/login');
      } else {
        setUser(data.user);
        setLoading(false);
      }
    }).catch(() => router.push('/login'));
  }, [router]);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  };

  if (loading) return <div className="page-loading"><div className="loading-spinner" style={{width:40,height:40}}></div><p>Loading...</p></div>;

  const links = [
    { href: '/student', icon: '🏠', label: 'Dashboard' },
    { href: '/student/tasks', icon: '📋', label: 'Assigned Tasks' },
    { href: '/student/assignments', icon: '✍️', label: 'Weekly Assignments' },
    { href: '/student/materials', icon: '📚', label: 'Course Materials' },
    { href: '/student/marks', icon: '📊', label: 'View Marks' },
    { href: '/student/progress', icon: '📈', label: 'Progress Chart' },
    { href: '/student/assessments', icon: '🎯', label: 'Assessments' },
  ];

  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        <div className="sidebar-logo">
          <img src="/logo.jpg" alt="VidyaRise" className="logo-img" style={{ height: '32px' }} />
          Student
        </div>
        <div className="sidebar-section">
          <div className="sidebar-section-title">Navigation</div>
          {links.map(l => (
            <Link key={l.href} href={l.href} className={`sidebar-link ${pathname === l.href ? 'active' : ''}`}>
              <span className="icon">{l.icon}</span> {l.label}
            </Link>
          ))}
        </div>
        <div className="sidebar-section">
          <div className="sidebar-section-title">Account</div>
          <div className="sidebar-link" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>Theme Option</span>
            <ThemeToggle />
          </div>
          <button onClick={handleLogout} className="sidebar-link" style={{ width: '100%', border: 'none', background: 'none', cursor: 'pointer', textAlign: 'left' }}>
            <span className="icon">🚪</span> Logout
          </button>
        </div>
        {user && (
          <div className="sidebar-user">
            <div className="sidebar-user-name">{user.name}</div>
            <div className="sidebar-user-role">{user.role}</div>
          </div>
        )}
      </aside>
      <main className="dashboard-main">
        {children}
      </main>
    </div>
  );
}
