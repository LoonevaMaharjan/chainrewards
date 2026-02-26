import React, { useState } from 'react';
import AuthCard, { Field, PrimaryButton, LinkButton } from './AuthCard';
import { signupCustomer } from '../utils/auth';
import { connectPhantom } from '../utils/wallet';

function PasswordField({ label, value, onChange, style }) {
  const [show, setShow] = useState(false);
  return (
    <div style={{ marginBottom: '30px', position: 'relative', ...style }}>
      <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '14px', color: '#444' }}>
        {label}
      </label>
      <div style={{ position: 'relative' }}>
        <input
          type={show ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          placeholder="••••••••"
          style={{
            width: '100%',
            padding: '12px 44px 12px 14px',
            border: '2px solid #e0e0e0',
            borderRadius: '8px',
            fontSize: '16px',
            boxSizing: 'border-box',
            outline: 'none',
          }}
        />
        <button
          type="button"
          onClick={() => setShow(s => !s)}
          style={{
            position: 'absolute',
            right: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '4px',
            color: '#aaa',
            fontSize: '18px',
            lineHeight: 1,
            display: 'flex',
            alignItems: 'center',
          }}
          tabIndex={-1}
          aria-label={show ? 'Hide password' : 'Show password'}
        >
          {show ? (
            // Eye-off icon
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/>
              <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/>
              <line x1="1" y1="1" x2="23" y2="23"/>
            </svg>
          ) : (
            // Eye icon
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
              <circle cx="12" cy="12" r="3"/>
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}

export default function CustomerSignup({ onSuccess, onLogin, onBack }) {
  const [fullName, setFullName] = useState('');
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);

  const ready = fullName && email && password;

  const handleSignup = async () => {
    setError('');
    if (!ready) { setError('Please fill in all fields.'); return; }
    setLoading(true);
    try {
      let walletAddress;
      try {
        walletAddress = await connectPhantom();
      } catch {
        walletAddress = 'dev_wallet_' + email.split('@')[0];
      }
      const user = signupCustomer({ email, password, fullName, walletAddress });
      onSuccess(user);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard emoji="✨" title="Create Customer Account" subtitle="Start collecting stamps & earning rewards" onBack={onBack}>
      {error && (
        <div style={{ background: '#fff0f0', border: '1px solid #ffcccc', borderRadius: '8px', padding: '12px', marginBottom: '20px', color: '#cc0000', fontSize: '14px' }}>
          ⚠️ {error}
        </div>
      )}

      <Field label="👤 Full Name" type="text" value={fullName} onChange={e => setFullName(e.target.value)} placeholder="John Doe" />
      <Field label="📧 Email"     type="email" value={email}    onChange={e => setEmail(e.target.value)}    placeholder="you@example.com" />

      <PasswordField
        label="🔒 Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />

      <PrimaryButton gradient="linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)" onClick={handleSignup} disabled={!ready || loading}>
        {loading ? '⏳ Creating account...' : '✨ Create Account & Connect Wallet'}
      </PrimaryButton>

      <div style={{ textAlign: 'center' }}>
        <span style={{ color: '#888' }}>Already have an account? </span>
        <LinkButton color="#00b4d8" onClick={onLogin}>Sign In</LinkButton>
      </div>
    </AuthCard>
  );
}