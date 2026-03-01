import React from 'react';

export default function Home({ onBusiness, onCustomer }) {
  return (
    <div style={{ minHeight: '100vh', background: '#ffffff', padding: '20px', display: 'flex', alignItems: 'center' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', width: '100%' }}>
        <div style={{ background: 'white', borderRadius: '20px', padding: '48px 40px', boxShadow: '0 8px 48px rgba(102, 126, 234, 0.18), 0 2px 16px rgba(0,0,0,0.08)' }}>
          <h1 style={{ fontSize: '48px', margin: '0 0 10px 0', color: '#333', textAlign: 'center' }}>
            🎁 ChainRewards
          </h1>
          <p style={{ textAlign: 'center', color: '#888', fontSize: '18px', marginBottom: '48px' }}>
            EARN YOUR REWARDS
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            <button
              onClick={onBusiness}
              style={{
                background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                color: 'white',
                padding: '40px 24px',
                border: 'none',
                borderRadius: '16px',
                cursor: 'pointer',
                boxShadow: '0 8px 25px rgba(245, 87, 108, 0.35)',
                transition: 'transform 0.15s, box-shadow 0.15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 12px 30px rgba(245,87,108,0.45)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 25px rgba(245,87,108,0.35)'; }}
            >
              <div style={{ fontSize: '22px', fontWeight: 'bold', marginBottom: '8px' }}>I'm a Business</div>
              <div style={{ fontSize: '14px', opacity: 0.85 }}>Create your loyalty program</div>
            </button>

            <button
              onClick={onCustomer}
              style={{
                background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                color: 'white',
                padding: '40px 24px',
                border: 'none',
                borderRadius: '16px',
                cursor: 'pointer',
                boxShadow: '0 8px 25px rgba(79, 172, 254, 0.35)',
                transition: 'transform 0.15s, box-shadow 0.15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 12px 30px rgba(79,172,254,0.45)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 25px rgba(79,172,254,0.35)'; }}
            >
              <div style={{ fontSize: '22px', fontWeight: 'bold', marginBottom: '8px' }}>I'm a Customer</div>
              <div style={{ fontSize: '14px', opacity: 0.85 }}>Collect stamps & earn rewards</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}