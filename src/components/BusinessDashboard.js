import React from 'react';
import { PageShell } from './AuthCard';
import { BUSINESS_TYPES } from '../constants';

export default function BusinessDashboard({ currentUser, businessData, onLogout, onScan }) {
  const config = BUSINESS_TYPES.find(b => b.id === businessData.businessType);

  const copyEmail = () => {
    navigator.clipboard.writeText(currentUser.email);
    alert('✅ Email copied to clipboard!');
  };

  return (
    <PageShell onLogout={onLogout}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '36px' }}>
        <img src={config.stampShape} alt={config.name} width={64} height={64} style={{ marginBottom: '12px' }} />
        <h2 style={{ fontSize: '30px', margin: '0 0 6px 0' }}>{businessData.businessName}</h2>
        <p style={{ color: '#777', margin: 0 }}>{config.name}</p>
        <p style={{ color: '#bbb', fontSize: '13px', margin: '6px 0 0 0' }}>{currentUser.walletAddress}</p>
      </div>

      {/* Stats */}
      <div style={{ background: '#f8f9fa', padding: '24px', borderRadius: '14px', marginBottom: '28px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', textAlign: 'center' }}>
          <div>
            <div style={{ fontSize: '40px', fontWeight: 'bold', color: config.color }}>{businessData.stampsRequired}</div>
            <div style={{ color: '#888', fontSize: '13px', marginTop: '4px' }}>Stamps Required</div>
          </div>
          <div>
            <div style={{ fontSize: '40px', fontWeight: 'bold', color: config.color }}>{businessData.tokenReward}</div>
            <div style={{ color: '#888', fontSize: '13px', marginTop: '4px' }}>SOL Reward</div>
          </div>
        </div>
      </div>

      {/* Scan Button */}
      <button
        onClick={onScan}
        style={{
          width: '100%',
          padding: '20px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          border: 'none',
          borderRadius: '14px',
          fontSize: '18px',
          fontWeight: 'bold',
          cursor: 'pointer',
          marginBottom: '20px',
          boxShadow: '0 6px 20px rgba(102,126,234,0.4)',
        }}
      >
        📷 Scan Customer QR Code
      </button>

      {/* Share email */}
      <div style={{ padding: '18px', background: '#e8f4fd', borderRadius: '12px', border: '1px solid #b3d9f5' }}>
        <p style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#1a6fa8', fontWeight: '600' }}>
          📧 Share your email with customers so they can link their loyalty card:
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <code style={{ background: 'white', padding: '8px 12px', borderRadius: '6px', fontSize: '14px', flex: 1, border: '1px solid #b3d9f5' }}>
            {currentUser.email}
          </code>
          <button
            onClick={copyEmail}
            style={{ padding: '8px 16px', background: '#1a6fa8', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold' }}
          >
            Copy
          </button>
        </div>
      </div>
    </PageShell>
  );
}
