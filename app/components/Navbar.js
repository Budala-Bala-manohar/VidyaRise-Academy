'use client';
import { useState } from 'react';
import Link from 'next/link';
import ThemeToggle from './ThemeToggle';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const links = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About Us' },
    { href: '/programs', label: 'Programs' },
    { href: '/methodology', label: 'Methodology' },
    { href: '/why-choose-us', label: 'Why Choose Us' },
    { href: '/contact', label: 'Contact' },
  ];

  return (
    <nav className="navbar" id="main-navbar">
      <div className="navbar-inner">
        <Link href="/" className="navbar-logo">
          <img src="/logo.jpg" alt="VidyaRise" className="logo-img" />
          VidyaRise Academy
        </Link>
        <div className="navbar-links">
          {links.map(l => (
            <Link key={l.href} href={l.href}>{l.label}</Link>
          ))}
          <ThemeToggle />
          <Link href="/login" className="navbar-cta">Login →</Link>
        </div>
        <button className="hamburger" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle menu">
          {mobileOpen ? '✕' : '☰'}
        </button>
      </div>
      <div className={`mobile-menu ${mobileOpen ? 'open' : ''}`}>
        {links.map(l => (
          <Link key={l.href} href={l.href} onClick={() => setMobileOpen(false)}>{l.label}</Link>
        ))}
        <Link href="/login" onClick={() => setMobileOpen(false)}>Login →</Link>
      </div>
    </nav>
  );
}
