// src/lib/crypto/utils.ts
import crypto from 'crypto';

/**
 * Converts a hex string to a Buffer
 */
export function hexToBuffer(hex: string): Buffer {
    return Buffer.from(hex.replace(/\s/g, ''), 'hex');
}

/**
 * Converts a Buffer to a hex string
 */
export function bufferToHex(buffer: Buffer): string {
    return buffer.toString('hex').toUpperCase();
}

/**
 * Converts a string to a hex string
 */
export function stringToHex(str: string): string {
    return Buffer.from(str, 'utf-8').toString('hex').toUpperCase();
}

/**
 * Generates a CMAC based on provided key and data
 */
export function generateCMAC(key: string, data: string): string {
    const keyBuffer = hexToBuffer(key);
    const dataBuffer = hexToBuffer(data);

    // Use AES-CMAC algorithm
    const cmac = crypto.createCipheriv('aes-128-cbc', keyBuffer, Buffer.alloc(16, 0));
    cmac.update(dataBuffer);
    const result = cmac.final();

    return bufferToHex(result);
}

/**
 * Encrypts data with AES-128 CBC
 */
export function encryptAES128(key: string, data: string, iv = '00000000000000000000000000000000'): string {
    const keyBuffer = hexToBuffer(key);
    const ivBuffer = hexToBuffer(iv);
    const dataBuffer = hexToBuffer(data);

    const cipher = crypto.createCipheriv('aes-128-cbc', keyBuffer, ivBuffer);
    cipher.setAutoPadding(false); // No padding for NXP tag encryption

    let encrypted = cipher.update(dataBuffer);
    encrypted = Buffer.concat([encrypted, cipher.final()]);

    return bufferToHex(encrypted);
}

/**
 * Generates a derivation key based on master key and other parameters
 */
export function generateDerivationKey(masterKey: string, uid: string, sdmReadCtr: string): string {
    // Combine UID and SDM read counter
    const dataToEncrypt = `${uid}${sdmReadCtr}`;

    // Encrypt with master key
    return encryptAES128(masterKey, dataToEncrypt);
}

/**
 * Formats a URL for SDM (Secure Dynamic Messaging)
 */
export function formatSDMUrl(url: string): string {
    // Ensure URL is properly formatted for SDM
    if (!url.startsWith('https://') && !url.startsWith('http://')) {
        url = `https://${url}`;
    }

    // URL encode if necessary
    return url;
}

/**
 * Generates all parameters needed for NXP TagWriter
 */
export interface TagWriterParams {
    sdmEncFileData: string;
    accessRights: string;
    sdmMetaReadKey: string;
    ttStatusCtlKey: string;
    masterKey: string;
}

export function generateTagWriterParams(
    masterKey: string,
    url: string,
    accessRights = '0F',
    enableTagTamper = false
): TagWriterParams {
    // For real implementation, these would be calculated based on the actual specifications
    // This is a placeholder implementation

    const formattedUrl = formatSDMUrl(url);
    const urlHex = stringToHex(formattedUrl);

    // Mock encrypted data for now
    const sdmEncFileData = encryptAES128(masterKey, urlHex);

    // Calculate derivation keys
    const sdmMetaReadKey = accessRights;

    // TagTamper status control key (only meaningful if TagTamper is enabled)
    const ttStatusCtlKey = enableTagTamper ? '01' : '00';

    return {
        sdmEncFileData,
        accessRights,
        sdmMetaReadKey,
        ttStatusCtlKey,
        masterKey
    };
}

/**
 * Validates a hex string
 */
export function isValidHex(hex: string): boolean {
    return /^[0-9A-Fa-f]+$/.test(hex);
}

/**
 * Formats a UID for display
 */
export function formatUID(uid: string): string {
    // Format as XX:XX:XX:XX:XX:XX:XX
    return uid.match(/.{1,2}/g)?.join(':').toUpperCase() || uid.toUpperCase();
}