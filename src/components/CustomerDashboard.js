import React, { useState } from 'react';
import { PageShell } from './AuthCard';
import { createCard, redeemCard, removeCard, deleteCustomerAccount, getCustomerCards } from '../utils/loyaltyCards';
import { BUSINESS_TYPES } from '../constants';

export default function CustomerDashboard({ currentUser, cards, onCardsChange, onShowQR, onLogout }) {
  const [bizEmail,    setBizEmail]    = useState('');
  const [addError,    setAddError]    = useState('');
  const [addSuccess,  setAddSuccess]  = useState('');
  const [showConfirm, setShowConfirm] = useState(false); // delete account modal

  // ── Add card ───────────────────────────────────────────────────────────────
  const handleAddCard = () => {
    setAddError('');
    setAddSuccess('');
    if (!bizEmail.trim()) { setAddError('Please enter the business email.'); return; }
    try {
      const updated = createCard(currentUser.email, bizEmail.trim().toLowerCase());
      onCardsChange(updated);
      setAddSuccess(`✅ Card added for ${updated[updated.length - 1].businessName}!`);
      setBizEmail('');
    } catch (err) {
      setAddError(`⚠️ ${err.message}`);
    }
  };

  // ── Redeem card ────────────────────────────────────────────────────────────
  const handleRedeem = (cardId) => {
    try {
      const reward = redeemCard(currentUser.email, cardId);
      alert(`🎉 You redeemed ${reward} Token. Check your Phantom wallet.`);
      onCardsChange(getCustomerCards(currentUser.email));
    } catch (err) {
      alert(`⚠️ ${err.message}`);
    }
  };

  // ── Remove single card ─────────────────────────────────────────────────────
  const handleRemoveCard = (cardId, businessName) => {
    const confirmed = window.confirm(
      `🗑️ Remove your loyalty card for "${businessName}"?\n\nYou will lose all your current stamps. This cannot be undone.`
    );
    if (!confirmed) return;
    const updated = removeCard(currentUser.email, cardId);
    onCardsChange(updated);
  };

  // ── Delete account ─────────────────────────────────────────────────────────
  const handleDeleteAccount = () => {
    deleteCustomerAccount(currentUser.email);
    onLogout();
  };

  return (
    <PageShell onLogout={onLogout}>

      {/* ── Delete Account Confirmation Modal ── */}
      {showConfirm && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000, padding: '20px',
        }}>
          <div style={{ background: 'white', borderRadius: '16px', padding: '36px', maxWidth: '420px', width: '100%', boxShadow: '0 20px 60px rgba(0,0,0,0.25)' }}>
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <div style={{ fontSize: '48px', marginBottom: '12px' }}>⚠️</div>
              <h3 style={{ fontSize: '22px', margin: '0 0 8px 0', color: '#cc0000' }}>Delete Account</h3>
              <p style={{ color: '#666', margin: 0, fontSize: '15px', lineHeight: '1.5' }}>
                This will permanently delete your account and <strong>all your loyalty cards</strong>. This cannot be undone.
              </p>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => setShowConfirm(false)}
                style={{ flex: 1, padding: '14px', background: '#f0f0f0', border: 'none', borderRadius: '10px', fontSize: '15px', fontWeight: '600', cursor: 'pointer', color: '#555' }}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                style={{ flex: 1, padding: '14px', background: 'linear-gradient(135deg, #ff4444, #cc0000)', color: 'white', border: 'none', borderRadius: '10px', fontSize: '15px', fontWeight: '700', cursor: 'pointer' }}
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Header ── */}
      <div style={{ marginBottom: '28px' }}>
        <h2 style={{ fontSize: '30px', margin: '0 0 4px 0' }}>My Loyalty Cards</h2>
        <p style={{ color: '#888', margin: 0 }}>Welcome back, {currentUser.fullName}! 👋</p>
      </div>

      {/* ── Cards list ── */}
      {cards.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '48px 0' }}>
          {/* <div style={{ fontSize: '64px', marginBottom: '16px' }}>🎴</div> */}
          <p style={{ color: '#aaa', fontSize: '18px' }}>No loyalty cards yet.</p>
          <p style={{ color: '#bbb', fontSize: '14px' }}>Ask a business for their email and add a card below.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '20px', marginBottom: '36px' }}>
          {cards.map(card => {
            const config = BUSINESS_TYPES.find(b => b.id === card.businessType);
            const progress = Math.min((card.stamps / card.maxStamps) * 100, 100);
            const isFull = card.stamps >= card.maxStamps;

            return (
              <div key={card.id} style={{ border: `3px solid ${config.color}`, borderRadius: '16px', padding: '24px', background: '#fafafa' }}>

                {/* Card header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '18px' }}>
                  <div>
                    <img src={config.stampShape} alt={config.name} width={30} height={30} style={{ marginBottom: '6px' }} />
                    <h3 style={{ margin: '0 0 2px 0', fontSize: '20px' }}>{card.businessName}</h3>
                    <p style={{ margin: 0, color: '#999', fontSize: '13px' }}>{config.name}</p>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <button
                      onClick={() => onShowQR(card)}
                      style={{ background: config.color, color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' }}
                    >
                      Show QR
                    </button>
                    {/* Remove card */}
                    <button
                      onClick={() => handleRemoveCard(card.id, card.businessName)}
                      title="Remove this card"
                      style={{ background: 'white', color: '#cc0000', border: '2px solid #ffcccc', borderRadius: '8px', padding: '10px 12px', cursor: 'pointer', fontSize: '16px', lineHeight: 1, display: 'flex', alignItems: 'center' }}
                    >
                      🗑️
                    </button>
                  </div>
                </div>

                {/* Progress bar */}
                <div style={{ marginBottom: '14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ fontSize: '13px', fontWeight: '600', color: '#555' }}>Progress</span>
                    <span style={{ fontSize: '13px', fontWeight: '700', color: config.color }}>{card.stamps}/{card.maxStamps} stamps</span>
                  </div>
                  <div style={{ background: '#e0e0e0', height: '10px', borderRadius: '5px', overflow: 'hidden' }}>
                    <div style={{ background: config.color, height: '100%', width: `${progress}%`, transition: 'width 0.4s ease' }} />
                  </div>
                </div>

                {/* Stamp grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px', marginBottom: '16px' }}>
                  {Array.from({ length: card.maxStamps }).map((_, i) => (
                    <div
                      key={i}
                      style={{
                        aspectRatio: '1',
                        border: `2px solid ${i < card.stamps ? config.color : '#ddd'}`,
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '20px',
                        background: i < card.stamps ? `${config.color}18` : '#f9f9f9',
                        transition: 'all 0.2s',
                      }}
                    >
                      {i < card.stamps ? <img src={config.stampShape} alt="" width={20} height={20} /> : null}
                    </div>
                  ))}
                </div>

                {/* Redeem button */}
                {isFull && (
                  <button
                    onClick={() => handleRedeem(card.id)}
                    style={{ width: '100%', padding: '15px', background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: 'white', border: 'none', borderRadius: '12px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 15px rgba(245,87,108,0.35)' }}
                  >
                    🎁 Redeem {card.tokenReward} Token!
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ── Add new card ── */}
      <div style={{ borderTop: '2px solid #f0f0f0', paddingTop: '28px' }}>
        <h3 style={{ fontSize: '20px', margin: '0 0 12px 0' }}>Add a Loyalty Card</h3>

        {addError   && <div style={{ background: '#fff0f0', border: '1px solid #ffcccc', borderRadius: '8px', padding: '10px 14px', marginBottom: '14px', color: '#cc0000',  fontSize: '14px' }}>{addError}</div>}
        {addSuccess && <div style={{ background: '#f0fff4', border: '1px solid #b2dfdb', borderRadius: '8px', padding: '10px 14px', marginBottom: '14px', color: '#1b5e20',  fontSize: '14px' }}>{addSuccess}</div>}

        <div style={{ display: 'flex', gap: '10px' }}>
          <input
            type="email"
            value={bizEmail}
            onChange={e => setBizEmail(e.target.value)}
            placeholder="Enter business email..."
            onKeyDown={e => e.key === 'Enter' && handleAddCard()}
            style={{ flex: 1, padding: '12px 14px', border: '2px solid #e0e0e0', borderRadius: '8px', fontSize: '15px' }}
          />
          <button
            onClick={handleAddCard}
            style={{ padding: '12px 24px', background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '15px', whiteSpace: 'nowrap' }}
          >
            ➕ Add
          </button>
        </div>
        <p style={{ fontSize: '12px', color: '#bbb', marginTop: '8px' }}>
          💡 Ask the business owner for their registered email address
        </p>
      </div>

      {/* ── Danger Zone ── */}
      <div style={{ borderTop: '2px solid #f0f0f0', marginTop: '36px', paddingTop: '28px' }}>
        {/* <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#cc0000', margin: '0 0 8px 0' }}>⚠️ Danger Zone</h3> */}
        
        <button
          onClick={() => setShowConfirm(true)}
          style={{ padding: '12px 24px', background: 'white', color: '#cc0000', border: '2px solid #ffcccc', borderRadius: '10px', fontSize: '14px', fontWeight: '700', cursor: 'pointer' }}
        >
          🗑️ Delete My Account
        </button>
        <p style={{ fontSize: '13px', color: '#aaa', margin: '0 0 14px 0' }}>
          Permanently delete your account and all loyalty cards.
        </p>
      </div>

    </PageShell>
  );
}