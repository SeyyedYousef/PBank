/**
 * Unit Tests for EncryptionService
 * Tests encrypt/decrypt roundtrip and tamper detection
 */
import { describe, it, expect, beforeAll, vi } from 'vitest';
import { EncryptionService } from './encryption';

// Mock crypto.subtle for Node.js environment
beforeAll(() => {
    // Web Crypto API is available in jsdom via setup
    if (!globalThis.crypto?.subtle) {
        console.warn('crypto.subtle not available, tests may fail');
    }
});

describe('EncryptionService', () => {
    describe('encrypt/decrypt roundtrip', () => {
        it('should encrypt and decrypt a string successfully', async () => {
            const originalData = 'Hello, PBank!';
            
            const encrypted = await EncryptionService.encrypt(originalData);
            expect(encrypted).toBeDefined();
            expect(typeof encrypted).toBe('string');
            expect(encrypted).not.toBe(originalData);
            
            const decrypted = await EncryptionService.decrypt<string>(encrypted);
            expect(decrypted).toBe(originalData);
        });

        it('should encrypt and decrypt an object successfully', async () => {
            const originalData = {
                userId: '123',
                balance: 1000000000,
                currency: 'AFN'
            };
            
            const encrypted = await EncryptionService.encrypt(originalData);
            const decrypted = await EncryptionService.decrypt<typeof originalData>(encrypted);
            
            expect(decrypted).toEqual(originalData);
        });

        it('should encrypt and decrypt nested objects', async () => {
            const originalData = {
                user: {
                    name: 'احمد',
                    phone: '+93799123456'
                },
                transactions: [
                    { id: 1, amount: 100 },
                    { id: 2, amount: 200 }
                ]
            };
            
            const encrypted = await EncryptionService.encrypt(originalData);
            const decrypted = await EncryptionService.decrypt<typeof originalData>(encrypted);
            
            expect(decrypted).toEqual(originalData);
        });

        it('should produce different ciphertext for same plaintext (random IV)', async () => {
            const data = 'Same data';
            
            const encrypted1 = await EncryptionService.encrypt(data);
            const encrypted2 = await EncryptionService.encrypt(data);
            
            // Different IVs should produce different ciphertext
            expect(encrypted1).not.toBe(encrypted2);
            
            // But both should decrypt to same value
            const decrypted1 = await EncryptionService.decrypt<string>(encrypted1);
            const decrypted2 = await EncryptionService.decrypt<string>(encrypted2);
            
            expect(decrypted1).toBe(data);
            expect(decrypted2).toBe(data);
        });
    });

    describe('tamper detection', () => {
        it('should return null for tampered ciphertext', async () => {
            const originalData = 'Sensitive data';
            const encrypted = await EncryptionService.encrypt(originalData);
            
            // Tamper with the ciphertext (modify a character in the middle)
            const chars = encrypted.split('');
            const midIndex = Math.floor(chars.length / 2);
            chars[midIndex] = chars[midIndex] === 'A' ? 'B' : 'A';
            const tampered = chars.join('');
            
            // Suppress console.error for this test
            const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
            
            const decrypted = await EncryptionService.decrypt<string>(tampered);
            
            expect(decrypted).toBeNull();
            consoleSpy.mockRestore();
        });

        it('should return null for invalid base64 input', async () => {
            const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
            
            const decrypted = await EncryptionService.decrypt<string>('not-valid-base64!!!');
            
            expect(decrypted).toBeNull();
            consoleSpy.mockRestore();
        });

        it('should return null for truncated ciphertext', async () => {
            const originalData = 'Some data';
            const encrypted = await EncryptionService.encrypt(originalData);
            
            // Truncate the ciphertext
            const truncated = encrypted.slice(0, encrypted.length - 10);
            
            const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
            
            const decrypted = await EncryptionService.decrypt<string>(truncated);
            
            expect(decrypted).toBeNull();
            consoleSpy.mockRestore();
        });
    });
});
