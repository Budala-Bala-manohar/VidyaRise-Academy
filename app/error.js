'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({ error, reset }) {
  useEffect(() => {
    // Log the error to an error reporting service in production
    console.error(error);
  }, [error]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: 'var(--bg-primary)', padding: 'var(--space-8)', textAlign: 'center' }}>
      <div style={{ fontSize: '4rem', marginBottom: 'var(--space-4)' }}>⚠️</div>
      <h2 style={{ marginBottom: 'var(--space-4)' }}>Something went wrong!</h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-8)', maxWidth: '500px' }}>
        We apologize for the inconvenience. An unexpected error occurred while processing your request. Please try again or return to the home page.
      </p>
      <div style={{ display: 'flex', gap: 'var(--space-4)' }}>
        <button
          onClick={() => reset()}
          className="btn btn-primary"
        >
          Try Again
        </button>
        <Link href="/" className="btn btn-secondary">
          Return Home
        </Link>
      </div>
    </div>
  );
}
