import React, { useState } from 'react';
import { PageShell, Field, PrimaryButton } from './AuthCard';
import { saveBusiness } from '../utils/loyaltyCards';
import { BUSINESS_TYPES } from '../constants';

export default function BusinessSetup({ currentUser, onLogout, onDone }) {
  const [stampsReq, setStampsReq] = useState('10');
  const [tokenReward, setTokenReward] = useState('1.0');
  const [error, setError] = useState('');

  const businessConfig = BUSINESS_TYPES.find(b => b.id === currentUser.businessType);

  const handleCreate = () => {
    setError('');
    if (!stampsReq || parseInt(stampsReq) < 1) { setError('Stamps required must be at least 1.'); return; }
    if (!tokenReward || parseFloat(tokenReward) <= 0) { setError('Token reward must be greater than 0.'); return; }

    const biz = {
      businessType: currentUser.businessType,
      businessName: currentUser.businessName,
      stampsRequired: parseInt(stampsReq),
      tokenReward: parseFloat(tokenReward),
      ownerEmail: currentUser.email,
      walletAddress: currentUser.walletAddress,
      createdAt: Date.now(),
    };

    saveBusiness(currentUser.email, biz);
    onDone(biz);
  };

  return (
    <PageShell onLogout={onLogout}>
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
       <img src={businessConfig.stampShape} alt={businessConfig.name} width={64} height={64} style={{ marginBottom: '12px' }} />
        <h2 style={{ fontSize: '30px', margin: '0 0 8px 0' }}>Setup Your Loyalty Program</h2>
        <p style={{ color: '#555', fontSize: '18px', margin: 0 }}>{currentUser.businessName}</p>
        <p style={{ color: '#999', fontSize: '14px', margin: '4px 0 0 0' }}>{businessConfig.name}</p>
      </div>

      {error && (
        <div style={{ background: '#fff0f0', border: '1px solid #ffcccc', borderRadius: '8px', padding: '12px', marginBottom: '20px', color: '#cc0000', fontSize: '14px' }}>
          ⚠️ {error}
        </div>
      )}

      <Field label="Stamps required to earn reward" type="number" min="1" max="30" value={stampsReq} onChange={e => setStampsReq(e.target.value)} />
      <Field label="Token reward amount (SOL)" type="number" step="0.1" min="0.01" value={tokenReward} onChange={e => setTokenReward(e.target.value)} style={{ marginBottom: '32px' }} />

      <PrimaryButton onClick={handleCreate}>✅ Create Loyalty Program</PrimaryButton>
    </PageShell>
  );
}
