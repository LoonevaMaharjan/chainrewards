import React, { useState } from 'react';
import AuthCard, { Field, PrimaryButton, LinkButton } from './AuthCard';
import { loginCustomer } from '../utils/auth';
import { connectPhantom } from '../utils/wallet';

export default function CustomerLogin({ onSuccess, onSignup, onBack }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError('');
    if (!email || !password) { setError('Please fill in all fields.'); return; }
    setLoading(true);
    try {
      let walletAddress;
      try {
        walletAddress = await connectPhantom();
      } catch {
        walletAddress = 'dev_wallet_' + email.split('@')[0];
      }
      const user = loginCustomer({ email, password });
      user.walletAddress = walletAddress;
      onSuccess(user);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard title="Customer Login" subtitle="Sign in to collect stamps & rewards" onBack={onBack}>
      {error && (
        <div style={{ background: '#fff0f0', border: '1px solid #ffcccc', borderRadius: '8px', padding: '12px', marginBottom: '20px', color: '#cc0000', fontSize: '14px' }}>
          ⚠️ {error}
        </div>
      )}

      <Field label="📧 Email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" />
      <Field label="🔒 Password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••"
        style={{ marginBottom: '30px' }}
        onKeyDown={e => e.key === 'Enter' && handleLogin()}
      />

      <PrimaryButton gradient="linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)" onClick={handleLogin} disabled={loading}>
        {loading ? '⏳ Signing in...' : '🔓 Sign In'}
      </PrimaryButton>

      <div style={{ textAlign: 'center' }}>
        <span style={{ color: '#888' }}>Don't have an account? </span>
        <LinkButton color="#00b4d8" onClick={onSignup}>Sign Up</LinkButton>
      </div>
    </AuthCard>
  );
}
