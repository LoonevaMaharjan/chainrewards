import React from 'react';

// Shared wrapper used by all login/signup pages
export default function AuthCard({ emoji, title, subtitle, children, onBack, maxWidth = 500 }) {
  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', padding: '20px' }}>
      <div style={{ maxWidth, margin: '0 auto' }}>
        <button
          onClick={onBack}
          style={{ background: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', marginBottom: '20px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px', boxShadow: '0 2px 8px rgba(0,0,0,0.12)' }}
        >
          ← Back
        </button>
        <div style={{ background: 'white', borderRadius: '20px', padding: '40px', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <div style={{ fontSize: '64px', marginBottom: '16px' }}>{emoji}</div>
            <h2 style={{ fontSize: '30px', margin: '0 0 8px 0', color: '#222' }}>{title}</h2>
            {subtitle && <p style={{ color: '#888', margin: 0, fontSize: '15px' }}>{subtitle}</p>}
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}

// Reusable labelled input
export function Field({ label, ...inputProps }) {
  return (
    <div style={{ marginBottom: '20px' }}>
      <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '14px', color: '#444' }}>
        {label}
      </label>
      <input
        {...inputProps}
        style={{
          width: '100%',
          padding: '12px 14px',
          border: '2px solid #e0e0e0',
          borderRadius: '8px',
          fontSize: '16px',
          transition: 'border-color 0.2s',
          ...inputProps.style,
        }}
      />
    </div>
  );
}

// Primary action button
export function PrimaryButton({ children, gradient, disabled, ...props }) {
  const bg = disabled ? '#ccc' : (gradient || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)');
  return (
    <button
      disabled={disabled}
      {...props}
      style={{
        width: '100%',
        padding: '16px',
        background: bg,
        color: 'white',
        border: 'none',
        borderRadius: '12px',
        fontSize: '18px',
        fontWeight: 'bold',
        cursor: disabled ? 'not-allowed' : 'pointer',
        marginBottom: '16px',
        transition: 'opacity 0.2s',
        ...props.style,
      }}
    >
      {children}
    </button>
  );
}

// Text link button
export function LinkButton({ children, color = '#667eea', ...props }) {
  return (
    <button
      {...props}
      style={{
        background: 'none',
        border: 'none',
        color,
        fontWeight: 'bold',
        cursor: 'pointer',
        fontSize: '15px',
        textDecoration: 'underline',
        ...props.style,
      }}
    >
      {children}
    </button>
  );
}

// Page shell used by dashboard pages (with Logout button top-left)
export function PageShell({ children, onLogout, maxWidth = 800 }) {
  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', padding: '20px' }}>
      <div style={{ maxWidth, margin: '0 auto' }}>
        <button
          onClick={onLogout}
          style={{ background: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', marginBottom: '20px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px', boxShadow: '0 2px 8px rgba(0,0,0,0.12)' }}
        >
          ← Logout
        </button>
        <div style={{ background: 'white', borderRadius: '20px', padding: '40px', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
          {children}
        </div>
      </div>
    </div>
  );
}
