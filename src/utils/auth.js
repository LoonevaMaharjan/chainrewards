// ─── auth.js ───────────────────────────────────────────────────────────────
// Handles localStorage-based auth.
// In production replace with a real backend (Firebase, Supabase, etc.)
// Passwords are stored in plain text here for demo purposes only.
// In production always hash passwords server-side.

// ── Business ────────────────────────────────────────────────────────────────

export function signupBusiness({ email, password, businessName, businessType, walletAddress }) {
  const users = getBusinessUsers();
  if (users.find(u => u.email === email)) {
    throw new Error('Email already registered.');
  }

  const user = {
    email,
    password,           // ⚠️ hash in production
    businessName,
    businessType,
    walletAddress,
    createdAt: Date.now(),
  };

  users.push(user);
  localStorage.setItem('businessUsers', JSON.stringify(users));
  saveSession(user, 'business');
  return user;
}

export function loginBusiness({ email, password }) {
  const users = getBusinessUsers();
  const user = users.find(u => u.email === email && u.password === password);
  if (!user) throw new Error('Invalid email or password.');
  saveSession(user, 'business');
  return user;
}

// ── Customer ────────────────────────────────────────────────────────────────

export function signupCustomer({ email, password, fullName, walletAddress }) {
  const users = getCustomerUsers();
  if (users.find(u => u.email === email)) {
    throw new Error('Email already registered.');
  }

  const user = {
    email,
    password,
    fullName,
    walletAddress,
    createdAt: Date.now(),
  };

  users.push(user);
  localStorage.setItem('customerUsers', JSON.stringify(users));
  saveSession(user, 'customer');
  return user;
}

export function loginCustomer({ email, password }) {
  const users = getCustomerUsers();
  const user = users.find(u => u.email === email && u.password === password);
  if (!user) throw new Error('Invalid email or password.');
  saveSession(user, 'customer');
  return user;
}

// ── Session ─────────────────────────────────────────────────────────────────

export function saveSession(user, userType) {
  localStorage.setItem('currentUser', JSON.stringify(user));
  localStorage.setItem('userType', userType);
}

export function loadSession() {
  const raw = localStorage.getItem('currentUser');
  const userType = localStorage.getItem('userType');
  if (!raw || !userType) return null;
  return { user: JSON.parse(raw), userType };
}

export function clearSession() {
  localStorage.removeItem('currentUser');
  localStorage.removeItem('userType');
}

// ── Helpers ─────────────────────────────────────────────────────────────────

function getBusinessUsers() {
  return JSON.parse(localStorage.getItem('businessUsers') || '[]');
}

function getCustomerUsers() {
  return JSON.parse(localStorage.getItem('customerUsers') || '[]');
}
