// ─── Business Types ────────────────────────────────────────────────────────
// Add or remove entries here to support new business categories.
// Each entry drives the stamp shape shown on loyalty cards.

// ─── Business Types ────────────────────────────────────────────────────────
export const BUSINESS_TYPES = [
  { id: 'coffee',   name: 'Coffee Shop',    color: '#8B4513', stampShape: '/stamps/coffee.png' },
  { id: 'nails',    name: 'Nail Salon',     color: '#FF69B4', stampShape: '/stamps/nails.png' },
  { id: 'pizza',    name: 'Pizza Place',    color: '#FF6347', stampShape: '/stamps/pizzaa.png' },
  { id: 'retail',   name: 'Retail Store',   color: '#4169E1', stampShape: '/stamps/shopping.png' },
  { id: 'wellness', name: 'Wellness Center',color: '#32CD32', stampShape: '/stamps/wellness.png' },
];

// ─── App Config ────────────────────────────────────────────────────────────
export const APP_NAME = 'ChainRewards';

// Solana network: 'devnet' | 'testnet' | 'mainnet-beta'
export const SOLANA_NETWORK = 'devnet';

// Your deployed Anchor program ID (replace after `anchor deploy`)
export const PROGRAM_ID = 'YOUR_PROGRAM_ID_HERE';
