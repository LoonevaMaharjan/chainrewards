import React from 'react';
import { BUSINESS_TYPES } from '../constants';

// A simple visual QR code placeholder.
// In production install qrcode.react: npm install qrcode.react
// Then: import { QRCodeSVG } from 'qrcode.react';  →  <QRCodeSVG value={card.qrCode} size={220} />

function QRPlaceholder({ value }) {
  return (
    <div style={{
      width: 220,
      height: 220,
      border: '4px solid #222',
      borderRadius: '12px',
      background: 'white',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px',
      boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
    }}>
      <div style={{ fontSize: '56px', marginBottom: '10px' }}>📱</div>
      <div style={{ fontSize: '9px', fontFamily: 'monospace', wordBreak: 'break-all', textAlign: 'center', color: '#555', lineHeight: '1.4' }}>
        {value}
      </div>
    </div>
  );
}

export default function ShowQR({ card, onBack }) {
  const config = BUSINESS_TYPES.find(b => b.id === card.businessType);

  const copyQR = () => {
    navigator.clipboard.writeText(card.qrCode);
    alert('✅ QR data copied! Paste it at the business scanner.');
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', padding: '20px' }}>
      <div style={{ maxWidth: '460px', margin: '0 auto' }}>
        <button
          onClick={onBack}
          style={{ background: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', marginBottom: '20px', cursor: 'pointer', fontWeight: 'bold', boxShadow: '0 2px 8px rgba(0,0,0,0.12)' }}
        >
          ← Back
        </button>

        <div style={{ background: 'white', borderRadius: '20px', padding: '40px', boxShadow: '0 20px 60px rgba(0,0,0,0.3)', textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '12px' }}>{config.stampShape}</div>
          <h2 style={{ fontSize: '26px', margin: '0 0 6px 0' }}>{card.businessName}</h2>
          <p style={{ color: '#888', margin: '0 0 28px 0', fontSize: '14px' }}>Show this to the business to collect your stamp</p>

          {/* QR Code */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
            {/* Swap QRPlaceholder for <QRCodeSVG> once qrcode.react is installed */}
            <QRPlaceholder value={card.qrCode} />
          </div>

          {/* QR data box */}
          <div style={{ background: '#f5f5f5', borderRadius: '10px', padding: '14px', marginBottom: '16px', textAlign: 'left' }}>
            <p style={{ margin: '0 0 6px 0', fontSize: '12px', fontWeight: '600', color: '#888', textTransform: 'uppercase', letterSpacing: '0.5px' }}>QR Code Data</p>
            <p style={{ margin: 0, fontSize: '11px', fontFamily: 'monospace', color: '#444', wordBreak: 'break-all', lineHeight: '1.5' }}>{card.qrCode}</p>
          </div>

          <button
            onClick={copyQR}
            style={{
              width: '100%',
              padding: '13px',
              background: config.color,
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '15px',
              marginBottom: '20px',
            }}
          >
            📋 Copy QR Data
          </button>

          {/* Stamp count */}
          <div style={{ background: '#f8f9fa', borderRadius: '10px', padding: '16px' }}>
            <p style={{ margin: '0 0 4px 0', fontSize: '13px', color: '#999' }}>Current Stamps</p>
            <p style={{ margin: 0, fontSize: '36px', fontWeight: 'bold', color: config.color }}>{card.stamps}/{card.maxStamps}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
