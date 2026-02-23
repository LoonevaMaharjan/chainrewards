import React, { useState } from 'react';
import AuthCard, { Field, PrimaryButton, LinkButton } from './AuthCard';
import { signupCustomer } from '../utils/auth';
import { connectPhantom } from '../utils/wallet';

export default function CustomerSignup({ onSuccess, onLogin, onBack }) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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
      <Field label="📧 Email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" />
      <Field label="🔒 Password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••"
        style={{ marginBottom: '30px' }}
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
