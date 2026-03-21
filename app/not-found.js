import Link from 'next/link';

export default function NotFound() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: 'var(--bg-primary)', padding: 'var(--space-8)', textAlign: 'center' }}>
      <div style={{ fontSize: '6rem', fontWeight: 800, color: 'var(--primary-500)', lineHeight: 1, marginBottom: 'var(--space-4)' }}>
        404
      </div>
      <h2 style={{ marginBottom: 'var(--space-4)' }}>Page Not Found</h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-8)', maxWidth: '500px' }}>
        We couldn't find the page you're looking for. It might have been moved or doesn't exist.
      </p>
      <Link href="/" className="btn btn-primary btn-lg">
        Return to Home →
      </Link>
    </div>
  );
}
