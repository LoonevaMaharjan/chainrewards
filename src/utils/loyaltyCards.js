// ─── loyaltyCards.js ───────────────────────────────────────────────────────
// All loyalty-card CRUD operations using localStorage.
// Swap these functions for on-chain Anchor calls when your Solana program is ready.

// ── Business program ────────────────────────────────────────────────────────

export function saveBusiness(email, businessData) {
  localStorage.setItem(`business_${email}`, JSON.stringify(businessData));
}

export function getBusiness(email) {
  const raw = localStorage.getItem(`business_${email}`);
  return raw ? JSON.parse(raw) : null;
}

// ── Customer cards ───────────────────────────────────────────────────────────

export function getCustomerCards(customerEmail) {
  const raw = localStorage.getItem(`customer_cards_${customerEmail}`);
  return raw ? JSON.parse(raw) : [];
}

export function saveCustomerCards(customerEmail, cards) {
  localStorage.setItem(`customer_cards_${customerEmail}`, JSON.stringify(cards));
}

/**
 * Create a new loyalty card for a customer at a specific business.
 * Returns the updated cards array, or throws if business not found.
 */
export function createCard(customerEmail, businessEmail) {
  const business = getBusiness(businessEmail);
  if (!business) throw new Error('Business not found. Check the email and try again.');

  const cards = getCustomerCards(customerEmail);

  // Prevent duplicate cards for the same business
  if (cards.find(c => c.businessEmail === businessEmail)) {
    throw new Error('You already have a loyalty card for this business.');
  }

  const newCard = {
    id: Date.now().toString(),
    businessEmail,
    businessName: business.businessName,
    businessType: business.businessType,
    stamps: 0,
    maxStamps: business.stampsRequired,
    tokenReward: business.tokenReward,
    createdAt: Date.now(),
    // QR payload: decoded by the business to identify the customer + card
    qrCode: `${customerEmail.split('@')[0].toUpperCase()}-${Date.now().toString(36).toUpperCase()}`,
  };

  const updated = [...cards, newCard];
  saveCustomerCards(customerEmail, updated);
  return updated;
}

/**
 * Add a stamp to a customer's card.
 * Called by the business after scanning a QR code.
 * Returns a result object or throws on error.
 */
export function addStampToCard(businessEmail, customerEmail, qrCode) {
  const cards = getCustomerCards(customerEmail);
  const idx = cards.findIndex(
    c => c.qrCode === qrCode && c.businessEmail === businessEmail
  );

  if (idx === -1) throw new Error('Card not found or does not belong to your business.');
  if (cards[idx].stamps >= cards[idx].maxStamps) throw new Error('Card is full. Customer must redeem first.');

  cards[idx].stamps += 1;
  saveCustomerCards(customerEmail, cards);
  return { stamps: cards[idx].stamps, maxStamps: cards[idx].maxStamps };
}

/**
 * Redeem a completed card. Resets stamps back to 0.
 * In production this triggers an on-chain token transfer.
 */
export function redeemCard(customerEmail, cardId) {
  const cards = getCustomerCards(customerEmail);
  const card = cards.find(c => c.id === cardId);

  if (!card) throw new Error('Card not found.');
  if (card.stamps < card.maxStamps) throw new Error('Card is not full yet.');

  const updated = cards.map(c => c.id === cardId ? { ...c, stamps: 0 } : c);
  saveCustomerCards(customerEmail, updated);
  return card.tokenReward;
}

export function deleteBusiness(email) {
  localStorage.removeItem(`business_${email}`);
}
