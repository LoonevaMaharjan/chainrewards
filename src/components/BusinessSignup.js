import React, { useState } from 'react';
import AuthCard, { Field, PrimaryButton, LinkButton } from './AuthCard';
import { signupBusiness } from '../utils/auth';
import { connectPhantom } from '../utils/wallet';
import { BUSINESS_TYPES } from '../constants';

export default function BusinessSignup({ onSuccess, onLogin, onBack }) {
  const [businessName, setBusinessName] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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
      <Field label="🔒 Password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" style={{ marginBottom: '30px' }} />

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
