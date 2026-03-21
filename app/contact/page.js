'use client';
import { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setStatus('success');
        setForm({ name: '', email: '', subject: '', message: '' });
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
    setLoading(false);
  };

  return (
    <div>
      <Navbar />

      <section className="section" style={{ paddingTop: '8rem' }}>
        <div className="section-inner">
          <div className="section-header">
            <span className="section-label">Get In Touch</span>
            <h2>Contact <span className="gradient-text">Us</span></h2>
            <p>Have questions? We&apos;d love to hear from you. Send us a message and we&apos;ll get back within 24 hours.</p>
          </div>
        </div>
      </section>

      <section className="section" style={{ background: 'var(--bg-secondary)', paddingTop: 'var(--space-8)' }}>
        <div className="section-inner">
          <div className="grid-3" style={{ alignItems: 'start' }}>
            {/* Contact Info Cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              {[
                { icon: '📍', title: 'Visit Us', lines: ['19-91-1, Old Christian Palem', 'near bus stand, vinukonda'] },
                { icon: '📞', title: 'Call Us', lines: ['+91 8555 089 896', 'Mon-Sat: 9AM - 6PM'] },
                { icon: '✉️', title: 'Email Us', lines: ['gdrayala123@gmail.com'] },
              ].map((c, i) => (
                <div className="card" key={i}>
                  <div style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'flex-start' }}>
                    <div style={{ fontSize: '1.5rem' }}>{c.icon}</div>
                    <div>
                      <h3 style={{ fontSize: '1rem', marginBottom: 'var(--space-1)' }}>{c.title}</h3>
                      {c.lines.map((l, j) => <p key={j} style={{ fontSize: '0.875rem' }}>{l}</p>)}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Contact Form */}
            <div style={{ gridColumn: 'span 2' }}>
              <div className="card">
                <h3 style={{ marginBottom: 'var(--space-6)' }}>Send us a Message</h3>

                {status === 'success' && (
                  <div className="alert alert-success">✓ Message sent successfully! We&apos;ll get back to you soon.</div>
                )}
                {status === 'error' && (
                  <div className="alert alert-error">✕ Something went wrong. Please try again.</div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="grid-2">
                    <div className="form-group">
                      <label htmlFor="contact-name">Full Name</label>
                      <input id="contact-name" className="form-input" required value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="Your full name" />
                    </div>
                    <div className="form-group">
                      <label htmlFor="contact-email">Email Address</label>
                      <input id="contact-email" type="email" className="form-input" required value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="your@email.com" />
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="contact-subject">Subject</label>
                    <input id="contact-subject" className="form-input" value={form.subject} onChange={e => setForm({...form, subject: e.target.value})} placeholder="What is this about?" />
                  </div>
                  <div className="form-group">
                    <label htmlFor="contact-message">Message</label>
                    <textarea id="contact-message" className="form-textarea" required value={form.message} onChange={e => setForm({...form, message: e.target.value})} placeholder="Your message..." />
                  </div>
                  <button type="submit" className="btn btn-primary btn-lg w-full" disabled={loading}>
                    {loading ? <><span className="loading-spinner"></span> Sending...</> : 'Send Message →'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
