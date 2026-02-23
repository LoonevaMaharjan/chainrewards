// ─── wallet.js ─────────────────────────────────────────────────────────────
// Handles Phantom wallet connection.
// The real Phantom provider lives at window.solana when the extension is installed.

/**
 * Connect to Phantom wallet.
 * Returns the public key string, or throws if Phantom is not installed.
 */
export async function connectPhantom() {
  const { solana } = window;

  if (!solana || !solana.isPhantom) {
    window.open('https://phantom.app/', '_blank');
    throw new Error('Phantom wallet not found. Please install it and try again.');
  }

  const response = await solana.connect();
  return response.publicKey.toString();
}

/**
 * Disconnect from Phantom wallet.
 */
export async function disconnectPhantom() {
  const { solana } = window;
  if (solana && solana.isPhantom) {
    await solana.disconnect();
  }
}

/**
 * Returns the currently connected public key, or null.
 */
export function getConnectedPublicKey() {
  const { solana } = window;
  if (solana && solana.isPhantom && solana.publicKey) {
    return solana.publicKey.toString();
  }
  return null;
}

/**
 * Shorten a public key for display: "ABCD...WXYZ"
 */
export function shortenAddress(address, chars = 4) {
  if (!address) return '';
  return `${address.slice(0, chars)}...${address.slice(-chars)}`;
}
