import React, { useState, useEffect } from 'react';
import { PageShell, Field } from './AuthCard';
import { BUSINESS_TYPES } from '../constants';
import { deleteBusiness, saveBusiness } from '../utils/loyaltyCards';

// ── Helper: scan localStorage for customer cards belonging to this business ──
function getBusinessCustomers(businessEmail) {
  const customers = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (!key.startsWith('customer_cards_')) continue;
    const customerEmail = key.replace('customer_cards_', '');
    try {
      const cards = JSON.parse(localStorage.getItem(key)) || [];
      const card = cards.find(c => c.businessEmail === businessEmail);
      if (card) {
        customers.push({
          customerEmail,
          customerName: customerEmail.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
          stamps: card.stamps,
          maxStamps: card.maxStamps,
          tokenReward: card.tokenReward,
          completedCount: card.completedCount ?? 0,   // ← how many times fully redeemed
          cardId: card.id,
          createdAt: card.createdAt,
        });
      }
    } catch (_) {}
  }
  return customers.sort((a, b) => b.createdAt - a.createdAt);
}

// ── Tab Bar ──────────────────────────────────────────────────────────────────
function TabBar({ active, onChange }) {
  const tabs = [
    { id: 'dashboard', label: '🏠 Dashboard' },
    { id: 'customers', label: '👥 Customers' },
    { id: 'edit',      label: '✏️ Edit'      },
  ];
  return (
    <div style={{ display: 'flex', gap: '8px', marginBottom: '32px', background: '#f0f2f5', padding: '6px', borderRadius: '12px' }}>
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          style={{
            flex: 1,
            padding: '12px',
            border: 'none',
            borderRadius: '8px',
            fontSize: '15px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.2s',
            background: active === tab.id ? 'white' : 'transparent',
            color: active === tab.id ? '#667eea' : '#888',
            boxShadow: active === tab.id ? '0 2px 8px rgba(0,0,0,0.1)' : 'none',
          }}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

// ── Stamp Progress Bar ───────────────────────────────────────────────────────
function StampBar({ stamps, maxStamps, color }) {
  const pct = Math.min((stamps / maxStamps) * 100, 100);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <div style={{ flex: 1, height: '8px', background: '#eee', borderRadius: '4px', overflow: 'hidden' }}>
        <div style={{ width: `${pct}%`, height: '100%', background: color, borderRadius: '4px', transition: 'width 0.3s' }} />
      </div>
      <span style={{ fontSize: '12px', color: '#888', whiteSpace: 'nowrap' }}>{stamps}/{maxStamps}</span>
    </div>
  );
}

// ── Edit Tab ─────────────────────────────────────────────────────────────────
function EditTab({ currentUser, businessData, onSaved }) {
  const [businessName, setBusinessName] = useState(businessData.businessName);
  const [businessType, setBusinessType] = useState(businessData.businessType);
  const [stampsReq,    setStampsReq]    = useState(String(businessData.stampsRequired));
  const [tokenReward,  setTokenReward]  = useState(String(businessData.appTokenReward ?? businessData.tokenReward ?? ''));
  const [error,        setError]        = useState('');
  const [success,      setSuccess]      = useState(false);

  const selectedConfig = BUSINESS_TYPES.find(b => b.id === businessType);

  const handleSave = () => {
    setError('');
    setSuccess(false);
    if (!businessName.trim())                         { setError('Business name cannot be empty.');       return; }
    if (!stampsReq || parseInt(stampsReq) < 1)        { setError('Stamps required must be at least 1.');  return; }
    if (!tokenReward || parseFloat(tokenReward) <= 0) { setError('Token reward must be greater than 0.'); return; }

    const updated = {
      ...businessData,
      businessName:   businessName.trim(),
      businessType,
      stampsRequired: parseInt(stampsReq),
      appTokenReward: parseFloat(tokenReward),
      tokenReward:    parseFloat(tokenReward),
    };
    saveBusiness(currentUser.email, updated);
    setSuccess(true);
    onSaved(updated);
  };

  return (
    <div>
      <div style={{ textAlign: 'center', marginBottom: '28px' }}>
        <img src={selectedConfig.stampShape} alt={selectedConfig.name} width={56} height={56} style={{ marginBottom: '10px' }} />
        <h3 style={{ fontSize: '22px', margin: '0 0 4px 0' }}>Edit Loyalty Program</h3>
      </div>

      {error && (
        <div style={{ background: '#fff0f0', border: '1px solid #ffcccc', borderRadius: '8px', padding: '12px', marginBottom: '20px', color: '#cc0000', fontSize: '14px' }}>
          ⚠️ {error}
        </div>
      )}
      {success && (
        <div style={{ background: '#f0fff4', border: '1px solid #b2dfdb', borderRadius: '8px', padding: '12px', marginBottom: '20px', color: '#2e7d32', fontSize: '14px' }}>
          ✅ Changes saved successfully!
        </div>
      )}

      <Field label="Business Name" type="text" value={businessName} onChange={e => { setBusinessName(e.target.value); setSuccess(false); }} />

      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '14px', color: '#444' }}>Business Type</label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '10px' }}>
          {BUSINESS_TYPES.map(bt => (
            <button key={bt.id} onClick={() => { setBusinessType(bt.id); setSuccess(false); }}
              style={{ padding: '12px 10px', border: `2px solid ${businessType === bt.id ? bt.color : '#e0e0e0'}`, borderRadius: '10px', background: businessType === bt.id ? bt.color + '18' : 'white', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', transition: 'all 0.15s' }}>
              <img src={bt.stampShape} alt={bt.name} width={28} height={28} />
              <span style={{ fontSize: '12px', fontWeight: '600', color: businessType === bt.id ? bt.color : '#555' }}>{bt.name}</span>
            </button>
          ))}
        </div>
      </div>

      <Field label="Stamps required to earn reward" type="number" min="1" max="30" value={stampsReq} onChange={e => { setStampsReq(e.target.value); setSuccess(false); }} />
      <Field label="Token reward amount" type="number" step="0.1" min="0.01" value={tokenReward} onChange={e => { setTokenReward(e.target.value); setSuccess(false); }} style={{ marginBottom: '28px' }} />

      <div style={{ background: '#f8f9fa', borderRadius: '12px', padding: '16px', marginBottom: '24px', border: `2px dashed ${selectedConfig.color}55` }}>
        <p style={{ margin: '0 0 10px 0', fontSize: '12px', fontWeight: '700', color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Preview</p>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
          <div>
            <p style={{ margin: '0 0 2px 0', fontWeight: '700', fontSize: '17px', color: '#222' }}>{businessName || '—'}</p>
            <p style={{ margin: 0, fontSize: '13px', color: '#888' }}>{selectedConfig.name}</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '13px', color: '#555' }}>
              <strong style={{ color: selectedConfig.color, fontSize: '16px' }}>{stampsReq || '—'}</strong> stamps &nbsp;→&nbsp;
              <strong style={{ color: selectedConfig.color, fontSize: '16px' }}>{tokenReward || '—'}</strong> tokens
            </span>
          </div>
        </div>
      </div>

      <button onClick={handleSave} style={{ width: '100%', padding: '16px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', border: 'none', borderRadius: '12px', fontSize: '17px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 16px rgba(102,126,234,0.35)' }}>
        💾 Save Changes
      </button>
    </div>
  );
}

// ── Customers Tab ────────────────────────────────────────────────────────────
function CustomersTab({ businessEmail, config }) {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    setCustomers(getBusinessCustomers(businessEmail));
  }, [businessEmail]);

  const filtered = customers.filter(c =>
    c.customerName.toLowerCase().includes(search.toLowerCase()) ||
    c.customerEmail.toLowerCase().includes(search.toLowerCase())
  );

  if (customers.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px', color: '#aaa' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>👥</div>
        <p style={{ fontSize: '18px', fontWeight: '600', color: '#888' }}>No customers yet</p>
        <p style={{ fontSize: '14px' }}>Customers will appear here once they link their loyalty card using your email.</p>
      </div>
    );
  }

  const totalCompleted = customers.reduce((sum, c) => sum + c.completedCount, 0);

  return (
    <div>
      {/* Search */}
      <input
        placeholder="🔍  Search customers..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        style={{ width: '100%', padding: '12px 16px', border: '2px solid #e0e0e0', borderRadius: '10px', fontSize: '15px', marginBottom: '20px', boxSizing: 'border-box', outline: 'none' }}
      />

      {/* Summary stats */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
        {[
          { label: 'Total Customers', value: customers.length,                                                       emoji: '👥' },
          { label: 'Cards Completed', value: totalCompleted,                                                         emoji: '🏆' },
          { label: 'Active Cards',    value: customers.filter(c => c.stamps > 0 && c.stamps < c.maxStamps).length,   emoji: '🎯' },
          { label: 'Ready to Redeem', value: customers.filter(c => c.stamps >= c.maxStamps).length,                  emoji: '⭐' },
        ].map(stat => (
          <div key={stat.label} style={{ flex: 1, background: '#f8f9fa', borderRadius: '12px', padding: '12px 8px', textAlign: 'center' }}>
            <div style={{ fontSize: '20px' }}>{stat.emoji}</div>
            <div style={{ fontSize: '20px', fontWeight: 'bold', color: config.color }}>{stat.value}</div>
            <div style={{ fontSize: '10px', color: '#888', marginTop: '2px', lineHeight: '1.3' }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div style={{ overflowX: 'auto', borderRadius: '12px', border: '1px solid #eee' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
          <thead>
            <tr style={{ background: '#f8f9fa' }}>
              {['#', 'Customer', 'Progress', 'Completed 🏆', 'Reward', 'Status'].map(h => (
                <th key={h} style={{ padding: '14px 16px', textAlign: 'left', fontWeight: '700', color: '#555', whiteSpace: 'nowrap' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={6} style={{ padding: '32px', textAlign: 'center', color: '#aaa' }}>No results for "{search}"</td></tr>
            ) : filtered.map((c, idx) => {
              const isFull = c.stamps >= c.maxStamps;
              return (
                <tr key={c.cardId} style={{ borderTop: '1px solid #f0f0f0', background: idx % 2 === 0 ? 'white' : '#fafafa' }}>

                  {/* # */}
                  <td style={{ padding: '14px 16px', color: '#bbb', fontWeight: '600' }}>{idx + 1}</td>

                  {/* Customer */}
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ fontWeight: '700', color: '#222' }}>{c.customerName}</div>
                    <div style={{ color: '#aaa', fontSize: '12px' }}>{c.customerEmail}</div>
                  </td>

                  {/* Progress bar */}
                  <td style={{ padding: '14px 16px', minWidth: '140px' }}>
                    <StampBar stamps={c.stamps} maxStamps={c.maxStamps} color={config.color} />
                  </td>

                  {/* Completed count */}
                  <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                    {c.completedCount > 0 ? (
                      <span style={{
                        display: 'inline-flex', alignItems: 'center', gap: '4px',
                        padding: '4px 10px', borderRadius: '20px',
                        background: '#fff8e1', color: '#e65100',
                        fontSize: '13px', fontWeight: '700',
                      }}>
                        🏆 {c.completedCount}
                      </span>
                    ) : (
                      <span style={{ color: '#ccc', fontSize: '13px' }}>—</span>
                    )}
                  </td>

                  {/* Reward */}
                  <td style={{ padding: '14px 16px', color: '#555' }}>{c.tokenReward}</td>

                  {/* Status */}
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{
                      padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '700',
                      background: isFull ? '#fff3cd' : c.stamps > 0 ? '#e8f5e9' : '#f0f0f0',
                      color: isFull ? '#856404' : c.stamps > 0 ? '#2e7d32' : '#888',
                    }}>
                      {isFull ? '⭐ Ready' : c.stamps > 0 ? '🎯 Active' : '🆕 New'}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <p style={{ textAlign: 'right', fontSize: '12px', color: '#ccc', marginTop: '12px' }}>
        Showing {filtered.length} of {customers.length} customers
      </p>
    </div>
  );
}

// ── Dashboard Tab ────────────────────────────────────────────────────────────
function DashboardTab({ currentUser, businessData, config, onScan, handleDelete }) {
  const copyEmail = () => {
    navigator.clipboard.writeText(currentUser.email);
    alert('✅ Email copied to clipboard!');
  };

  return (
    <>
      <div style={{ textAlign: 'center', marginBottom: '36px' }}>
        <img src={config.stampShape} alt={config.name} width={64} height={64} style={{ marginBottom: '12px' }} />
        <h2 style={{ fontSize: '30px', margin: '0 0 6px 0' }}>{businessData.businessName}</h2>
        <p style={{ color: '#777', margin: 0 }}>{config.name}</p>
        <p style={{ color: '#bbb', fontSize: '13px', margin: '6px 0 0 0' }}>{currentUser.walletAddress}</p>
      </div>

      <div style={{ background: '#f8f9fa', padding: '24px', borderRadius: '14px', marginBottom: '28px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', textAlign: 'center' }}>
          <div>
            <div style={{ fontSize: '40px', fontWeight: 'bold', color: config.color }}>{businessData.stampsRequired}</div>
            <div style={{ color: '#888', fontSize: '13px', marginTop: '4px' }}>Stamps Required</div>
          </div>
          <div>
            <div style={{ fontSize: '40px', fontWeight: 'bold', color: config.color }}>
              {businessData.appTokenReward ?? businessData.tokenReward}
            </div>
            <div style={{ color: '#888', fontSize: '13px', marginTop: '4px' }}>Token Reward</div>
          </div>
        </div>
      </div>

      <button onClick={onScan} style={{ width: '100%', padding: '20px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', border: 'none', borderRadius: '14px', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer', marginBottom: '20px', boxShadow: '0 6px 20px rgba(102,126,234,0.4)' }}>
        📷 Scan Customer QR Code
      </button>

      <div style={{ padding: '18px', background: '#e8f4fd', borderRadius: '12px', border: '1px solid #b3d9f5', marginBottom: '20px' }}>
        <p style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#1a6fa8', fontWeight: '600' }}>
          📧 Share your email with customers so they can link their loyalty card:
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <code style={{ background: 'white', padding: '8px 12px', borderRadius: '6px', fontSize: '14px', flex: 1, border: '1px solid #b3d9f5' }}>
            {currentUser.email}
          </code>
          <button onClick={copyEmail} style={{ padding: '8px 16px', background: '#1a6fa8', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold' }}>
            Copy
          </button>
        </div>
      </div>

      <button onClick={handleDelete} style={{ width: '100%', padding: '14px', background: 'white', color: '#cc0000', border: '2px solid #ffcccc', borderRadius: '12px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer' }}>
        🗑️ Delete Loyalty Program
      </button>
    </>
  );
}

// ── Main Export ──────────────────────────────────────────────────────────────
export default function BusinessDashboard({ currentUser, businessData: initialData, onLogout, onScan, onDeleted }) {
  const [activeTab,    setActiveTab]    = useState('dashboard');
  const [businessData, setBusinessData] = useState(initialData);

  const config = BUSINESS_TYPES.find(b => b.id === businessData.businessType);

  const handleDelete = () => {
    const confirmed = window.confirm(`⚠️ Are you sure you want to delete "${businessData.businessName}"? This cannot be undone.`);
    if (!confirmed) return;
    deleteBusiness(currentUser.email);
    onDeleted();
  };

  const handleSaved = (updated) => {
    setBusinessData(updated);
    setTimeout(() => setActiveTab('dashboard'), 1000);
  };

  return (
    <PageShell onLogout={onLogout}>
      <TabBar active={activeTab} onChange={setActiveTab} />

      {activeTab === 'dashboard' && (
        <DashboardTab currentUser={currentUser} businessData={businessData} config={config} onScan={onScan} handleDelete={handleDelete} />
      )}
      {activeTab === 'customers' && (
        <CustomersTab businessEmail={currentUser.email} config={config} />
      )}
      {activeTab === 'edit' && (
        <EditTab currentUser={currentUser} businessData={businessData} onSaved={handleSaved} />
      )}
    </PageShell>
  );
}