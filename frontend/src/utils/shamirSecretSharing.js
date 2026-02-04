import secrets from 'secrets.js-grempe';

/**
 * Split a secret into shares using Shamir's Secret Sharing
 * @param {string} secret - The secret to split (hex string)
 * @param {number} totalShares - Total number of shares to create
 * @param {number} threshold - Minimum shares needed to reconstruct
 * @returns {string[]} Array of share strings
 */
export const splitSecret = (secret, totalShares = 3, threshold = 2) => {
  try {
    // Convert secret to hex if it's not already
    let hexSecret = typeof secret === 'string' && secret.startsWith('0x') 
      ? secret.slice(2) 
      : secret;
    
    // If it's still not a string (e.g. Uint8Array), convert to hex
    if (typeof hexSecret !== 'string') {
      hexSecret = Array.from(new Uint8Array(hexSecret))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
    }
    
    // Split the secret
    const shares = secrets.share(hexSecret, totalShares, threshold);
    
    console.log(`✅ Secret split into ${totalShares} shares (need ${threshold} to reconstruct)`);
    return shares;
  } catch (error) {
    console.error('❌ Failed to split secret:', error);
    throw new Error(`Secret sharing failed: ${error.message}`);
  }
};

/**
 * Combine shares to reconstruct the original secret
 * @param {string[]} shares - Array of share strings (minimum threshold required)
 * @returns {string} Reconstructed secret as hex string
 */
export const combineShares = (shares) => {
  try {
    if (!Array.isArray(shares) || shares.length < 2) {
      throw new Error('At least 2 shares required to reconstruct secret');
    }
    
    // Combine the shares
    const reconstructed = secrets.combine(shares);
    
    console.log(`✅ Secret reconstructed from ${shares.length} shares`);
    return '0x' + reconstructed;
  } catch (error) {
    console.error('❌ Failed to combine shares:', error);
    throw new Error(`Secret reconstruction failed: ${error.message}`);
  }
};

/**
 * Convert hex string to bytes for smart contract storage
 * @param {string} hexString - Hex string (with or without 0x prefix)
 * @returns {Uint8Array} Byte array
 */
export const hexToBytes = (hexString) => {
  const hex = hexString.startsWith('0x') ? hexString.slice(2) : hexString;
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substr(i, 2), 16);
  }
  return bytes;
};

/**
 * Convert bytes to hex string
 * @param {Uint8Array} bytes - Byte array
 * @returns {string} Hex string with 0x prefix
 */
export const bytesToHex = (bytes) => {
  return '0x' + Array.from(bytes)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
};

/**
 * Test the secret sharing implementation
 * @returns {boolean} True if test passes
 */
export const testSecretSharing = () => {
  try {
    console.log('🧪 Testing Shamir Secret Sharing...');
    
    // Use window.crypto for browser compatibility
    const cryptoObj = window.crypto || window.msCrypto;
    const randomBytes = new Uint8Array(32);
    cryptoObj.getRandomValues(randomBytes);
    
    // Generate a test secret
    const testSecret = '0x' + Array.from(randomBytes)
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
    
    console.log('Original secret:', testSecret);
    
    // Split into 3 shares, need 2 to reconstruct
    const shares = splitSecret(testSecret, 3, 2);
    console.log('Shares created:', shares.length);
    
    // Reconstruct with 2 shares
    const reconstructed = combineShares([shares[0], shares[1]]);
    console.log('Reconstructed:', reconstructed);
    
    // Verify
    const match = testSecret === reconstructed;
    console.log(match ? '✅ Test PASSED' : '❌ Test FAILED');
    
    return match;
  } catch (error) {
    console.error('❌ Test failed:', error);
    return false;
  }
};
