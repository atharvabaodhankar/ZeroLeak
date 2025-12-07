/**
 * Crypto utilities for AES encryption/decryption
 */

/**
 * Generate a random AES key
 * @returns {string} Base64 encoded key
 */
export const generateAESKey = () => {
  const key = new Uint8Array(32); // 256-bit key
  crypto.getRandomValues(key);
  return btoa(String.fromCharCode(...key));
};

/**
 * Encrypt data using AES-GCM
 * @param {Uint8Array} data 
 * @param {string} keyBase64 
 * @returns {Object} { iv: string, encryptedData: string }
 */
export const encryptAES = async (data, keyBase64) => {
  const key = await crypto.subtle.importKey(
    'raw',
    Uint8Array.from(atob(keyBase64), c => c.charCodeAt(0)),
    { name: 'AES-GCM' },
    false,
    ['encrypt']
  );

  const iv = new Uint8Array(12); // 96-bit IV for GCM
  crypto.getRandomValues(iv);

  const encrypted = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    data
  );

  return {
    iv: btoa(String.fromCharCode(...iv)),
    encryptedData: btoa(String.fromCharCode(...new Uint8Array(encrypted)))
  };
};

/**
 * Decrypt data using AES-GCM
 * @param {string} encryptedDataBase64 
 * @param {string} ivBase64 
 * @param {string} keyBase64 
 * @returns {Promise<Uint8Array>} Decrypted data
 */
export const decryptAES = async (encryptedDataBase64, ivBase64, keyBase64) => {
  const key = await crypto.subtle.importKey(
    'raw',
    Uint8Array.from(atob(keyBase64), c => c.charCodeAt(0)),
    { name: 'AES-GCM' },
    false,
    ['decrypt']
  );

  const iv = Uint8Array.from(atob(ivBase64), c => c.charCodeAt(0));
  const encryptedData = Uint8Array.from(atob(encryptedDataBase64), c => c.charCodeAt(0));

  const decrypted = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv },
    key,
    encryptedData
  );

  return new Uint8Array(decrypted);
};