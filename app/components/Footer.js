import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <Link href="/" className="navbar-logo" style={{ fontSize: '1.25rem', marginBottom: 'var(--space-4)' }}>
            <img src="/logo.jpg" alt="VidyaRise" className="logo-img" style={{ height: '32px' }} />
            VidyaRise Academy
          </Link>
          <p>Empowering the next generation with innovative education, personalized learning experiences, and world-class teaching methodologies since 2018.</p>
        </div>
        <div className="footer-col">
          <h4>Quick Links</h4>
          <Link href="/about">About Us</Link>
          <Link href="/programs">Programs</Link>
          <Link href="/methodology">Methodology</Link>
          <Link href="/why-choose-us">Why Choose Us</Link>
          <Link href="/contact">Contact Us</Link>
        </div>
        <div className="footer-col">
          <h4>Portals</h4>
          <Link href="/login">Student Login</Link>
          <Link href="/login">Trainer Login</Link>
          <Link href="/login">Admin Login</Link>
        </div>
        <div className="footer-col">
          <h4>Contact</h4>
          <a href="mailto:gdrayala123@gmail.com">gdrayala123@gmail.com</a>
          <a href="tel:+918555089896">+91 8555 089 896</a>
          <a>19-91-1, Old Christian Palem,</a>
          <a>near bus stand, vinukonda</a>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} VidyaRise Academy. All rights reserved.</span>
        <span>Built with ❤️ for Education</span>
      </div>
    </footer>
  );
}
