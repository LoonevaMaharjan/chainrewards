import React, { useState } from 'react';
import { PageShell, Field, PrimaryButton } from './AuthCard';
import { addStampToCard } from '../utils/loyaltyCards';

export default function ScanQR({ currentUser, onBack }) {
  const [customerEmail, setCustomerEmail] = useState('');
  const [qrData, setQrData] = useState('');
  const [message, setMessage] = useState(null); // { type: 'success'|'error', text }

  const handleAddStamp = () => {
    setMessage(null);
    if (!customerEmail || !qrData) {
      setMessage({ type: 'error', text: 'Please enter both customer email and QR code data.' });
      return;
    }
    try {
      const result = addStampToCard(currentUser.email, customerEmail, qrData);
      setMessage({ type: 'success', text: `✅ Stamp added! Customer now has ${result.stamps}/${result.maxStamps} stamps.` });
      setQrData('');
      setCustomerEmail('');
    } catch (err) {
      setMessage({ type: 'error', text: `⚠️ ${err.message}` });
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', padding: '20px' }}>
      <div style={{ maxWidth: '520px', margin: '0 auto' }}>
        <button
          onClick={onBack}
          style={{ background: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', marginBottom: '20px', cursor: 'pointer', fontWeight: 'bold', boxShadow: '0 2px 8px rgba(0,0,0,0.12)' }}
        >
          ← Back
        </button>

        <div style={{ background: 'white', borderRadius: '20px', padding: '40px', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
          <h2 style={{ fontSize: '26px', textAlign: 'center', margin: '0 0 24px 0' }}>Scan Customer QR</h2>

          {/* Camera placeholder — replace with html5-qrcode in production */}
          <div style={{
            border: '3px dashed #667eea',
            borderRadius: '14px',
            padding: '56px 20px',
            textAlign: 'center',
            marginBottom: '28px',
            background: '#f8f9ff',
          }}>
            <div style={{ fontSize: '56px', marginBottom: '16px' }}>📷</div>
            <p style={{ color: '#667eea', fontWeight: '600', margin: '0 0 6px 0' }}>Camera Scanner</p>
            {/* <p style={{ color: '#999', fontSize: '13px', margin: 0 }}>
              Integrate <code>html5-qrcode</code> here to scan QR codes with the camera.<br />
              For now, paste the QR data below.
            </p> */}
          </div>

          {message && (
            <div style={{
              background: message.type === 'success' ? '#f0fff4' : '#fff0f0',
              border: `1px solid ${message.type === 'success' ? '#b2dfdb' : '#ffcccc'}`,
              borderRadius: '8px',
              padding: '12px',
              marginBottom: '20px',
              color: message.type === 'success' ? '#1b5e20' : '#cc0000',
              fontSize: '14px',
            }}>
              {message.text}
            </div>
          )}

          <Field label="Customer Email" type="email" value={customerEmail} onChange={e => setCustomerEmail(e.target.value)} placeholder="customer@example.com" />
          <div style={{ marginBottom: '28px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '14px', color: '#444' }}>
              QR Code Data
            </label>
            <textarea
              value={qrData}
              onChange={e => setQrData(e.target.value)}
              placeholder="Paste the QR code text here..."
              rows={3}
              style={{ width: '100%', padding: '12px 14px', border: '2px solid #e0e0e0', borderRadius: '8px', fontSize: '13px', fontFamily: 'monospace', resize: 'vertical' }}
            />
          </div>

          <PrimaryButton onClick={handleAddStamp} disabled={!customerEmail || !qrData}>
            ✅ Add Stamp
          </PrimaryButton>

          <div style={{ marginTop: '20px', padding: '16px', background: '#fffbea', borderRadius: '10px', border: '1px solid #ffe082' }}>
            <p style={{ margin: 0, fontSize: '13px', color: '#7a5c00', lineHeight: '1.6' }}>
              <strong>💡 How to stamp:</strong><br />
              1. Customer opens their app and taps <em>"Show QR"</em><br />
              2. The QR code text appears below the QR image<br />
              3. Paste that text above and enter the customer's email<br />
              4. Hit <strong>Add Stamp</strong>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
