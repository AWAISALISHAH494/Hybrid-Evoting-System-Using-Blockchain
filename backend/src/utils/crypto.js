const crypto = require('crypto');

// Convert hex string to Buffer for encryption key
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY
    ? Buffer.from(process.env.ENCRYPTION_KEY, 'hex')
    : crypto.randomBytes(32);
const IV_LENGTH = 16;
const ALGORITHM = 'aes-256-gcm';

/**
 * Encrypt vote data using AES-256-GCM
 * @param {string} text - Vote data to encrypt
 * @returns {string} Encrypted data in format: iv:authTag:encrypted
 */
function encryptVote(text) {
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv(ALGORITHM, ENCRYPTION_KEY, iv);

    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    const authTag = cipher.getAuthTag();

    return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`;
}

/**
 * Decrypt vote data
 * @param {string} encryptedData - Encrypted data in format: iv:authTag:encrypted
 * @returns {string} Decrypted vote data
 */
function decryptVote(encryptedData) {
    const parts = encryptedData.split(':');
    const iv = Buffer.from(parts[0], 'hex');
    const authTag = Buffer.from(parts[1], 'hex');
    const encrypted = parts[2];

    const decipher = crypto.createDecipheriv(ALGORITHM, ENCRYPTION_KEY, iv);
    decipher.setAuthTag(authTag);

    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
}

/**
 * Generate SHA-256 hash
 * @param {string} data - Data to hash
 * @returns {string} Hex encoded hash
 */
function generateHash(data) {
    return crypto.createHash('sha256').update(data).digest('hex');
}

/**
 * Generate digital signature
 * @param {string} data - Data to sign
 * @returns {string} Signature
 */
function generateSignature(data) {
    const hmac = crypto.createHmac('sha256', ENCRYPTION_KEY);
    hmac.update(data);
    return hmac.digest('hex');
}

/**
 * Verify digital signature
 * @param {string} data - Original data
 * @param {string} signature - Signature to verify
 * @returns {boolean} True if valid
 */
function verifySignature(data, signature) {
    const expectedSignature = generateSignature(data);
    return crypto.timingSafeEqual(
        Buffer.from(signature, 'hex'),
        Buffer.from(expectedSignature, 'hex')
    );
}

module.exports = {
    encryptVote,
    decryptVote,
    generateHash,
    generateSignature,
    verifySignature
};
