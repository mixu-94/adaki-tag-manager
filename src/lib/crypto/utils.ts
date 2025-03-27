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
 * Pad data to a multiple of 16 bytes (AES block size)
 */
export function padData(data: string): string {
    // Convert hex string to buffer
    const buffer = hexToBuffer(data);

    // Calculate padding needed (PKCS#7 padding)
    const blockSize = 16;
    const padLength = blockSize - (buffer.length % blockSize);

    // Create padding buffer
    const padding = Buffer.alloc(padLength, padLength);

    // Concatenate data and padding
    const paddedBuffer = Buffer.concat([buffer, padding]);

    return bufferToHex(paddedBuffer);
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
 * Generate a random hex string of specified length
 */
export function generateRandomHex(byteLength: number): string {
    return bufferToHex(crypto.randomBytes(byteLength));
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
    // Format the URL properly
    const formattedUrl = formatSDMUrl(url);

    // Convert URL to hex
    const urlHex = stringToHex(formattedUrl);

    // Pad the data if necessary to meet AES block size requirements
    const paddedUrlHex = padData(urlHex);

    // Encrypt with master key
    const sdmEncFileData = encryptAES128(masterKey, paddedUrlHex);

    // SDM Meta Read Access Key (simplified for this implementation)
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

/**
 * Generates a SUM (Secure Unique Message) for tag verification
 */
export function generateSUM(masterKey: string, uid: string, data: string): string {
    // Generate CMAC for the combined UID and data
    const signature = generateCMAC(masterKey, uid + data);

    // Create SUM object
    return JSON.stringify({
        id: uid,
        data: data,
        signature: signature
    });
}