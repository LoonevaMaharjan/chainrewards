import React, { useState } from 'react';
import AuthCard, { Field, PrimaryButton, LinkButton } from './AuthCard';
import { signupBusiness } from '../utils/auth';
import { connectPhantom } from '../utils/wallet';
import { BUSINESS_TYPES } from '../constants';

function PasswordField({ label, value, onChange }) {
  const [show, setShow] = useState(false);
  return (
    <div style={{ marginBottom: '30px' }}>
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
          tabIndex={-1}
          aria-label={show ? 'Hide password' : 'Show password'}
          style={{
            position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
            background: 'none', border: 'none', cursor: 'pointer', padding: '4px',
            color: '#aaa', display: 'flex', alignItems: 'center',
          }}
        >
          {show ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/>
              <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/>
              <line x1="1" y1="1" x2="23" y2="23"/>
            </svg>
          ) : (
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

export default function BusinessSignup({ onSuccess, onLogin, onBack }) {
  const [businessName, setBusinessName] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [email,        setEmail]        = useState('');
  const [password,     setPassword]     = useState('');
  const [error,        setError]        = useState('');
  const [loading,      setLoading]      = useState(false);

  const ready = businessName && selectedType && email && password;

  const handleSignup = async () => {
    setError('');
    if (!ready) { setError('Please fill in all fields and choose a business type.'); return; }
    setLoading(true);
    try {
      let walletAddress;
      try {
        walletAddress = await connectPhantom();
      } catch {
        walletAddress = 'dev_wallet_' + email.split('@')[0];
      }
      const user = signupBusiness({ email, password, businessName, businessType: selectedType, walletAddress });
      onSuccess(user);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard emoji="✨" title="Create Business Account" subtitle="Set up your loyalty rewards program" onBack={onBack} maxWidth={600}>
      {error && (
        <div style={{ background: '#fff0f0', border: '1px solid #ffcccc', borderRadius: '8px', padding: '12px', marginBottom: '20px', color: '#cc0000', fontSize: '14px' }}>
          ⚠️ {error}
        </div>
      )}

      <Field label="Business Name" type="text" value={businessName} onChange={e => setBusinessName(e.target.value)} placeholder="Joe's Coffee Shop" />

      {/* Business Type Selector */}
      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '12px', fontWeight: '600', fontSize: '14px', color: '#444' }}>
          Business Type <span style={{ color: '#888', fontWeight: 'normal' }}>(sets your stamp design)</span>
        </label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
          {BUSINESS_TYPES.map(type => (
            <button
              key={type.id}
              onClick={() => setSelectedType(type.id)}
              style={{
                padding: '14px 10px',
                border: selectedType === type.id ? `3px solid ${type.color}` : '2px solid #e0e0e0',
                borderRadius: '12px',
                background: selectedType === type.id ? `${type.color}18` : 'white',
                cursor: 'pointer',
                textAlign: 'center',
                transition: 'all 0.15s',
              }}
            >
              <img src={type.stampShape} alt={type.name} width={32} height={32} style={{ marginBottom: '6px' }} />
              <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#444' }}>{type.name}</div>
            </button>
          ))}
        </div>
      </div>

      <Field label="📧 Email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="business@example.com" />

      <PasswordField
        label="🔒 Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />

      <PrimaryButton gradient="linear-gradient(135deg, #f093fb 0%, #f5576c 100%)" onClick={handleSignup} disabled={!ready || loading}>
        {loading ? '⏳ Creating account...' : '✨ Create Account & Connect Wallet'}
      </PrimaryButton>

      <div style={{ textAlign: 'center' }}>
        <span style={{ color: '#888' }}>Already have an account? </span>
        <LinkButton color="#f5576c" onClick={onLogin}>Sign In</LinkButton>
      </div>
    </AuthCard>
  );
}