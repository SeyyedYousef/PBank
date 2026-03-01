import { describe, it, expect, beforeEach, vi } from 'vitest';
import { SecureStorage } from './secureStorage';

describe('SecureStorage Utility', () => {
    beforeEach(() => {
        SecureStorage.clear();
        vi.restoreAllMocks();
        localStorage.clear();
        sessionStorage.clear();
    });

    it('should store and retrieve items in memory by default', () => {
        SecureStorage.setItem('test-key', 'secret-value', 'memory');
        expect(SecureStorage.getItem('test-key')).toBe('secret-value');

        // Should NOT be in storage
        expect(localStorage.getItem('pb_secure_test-key')).toBeNull();
        expect(sessionStorage.getItem('pb_secure_test-key')).toBeNull();
    });

    it('should store encrypted items in localStorage', () => {
        SecureStorage.setItem('local-key', 'local-value', 'local');

        // Should return decrypted value
        expect(SecureStorage.getItem('local-key')).toBe('local-value');

        // Should be encrypted in actual localStorage
        const raw = localStorage.getItem('pb_secure_local-key');
        expect(raw).not.toBe('local-value');
        expect(raw).toBeTruthy();
    });

    it('should remove items correctly', () => {
        SecureStorage.setItem('rem-key', 'val');
        expect(SecureStorage.getItem('rem-key')).toBe('val');

        SecureStorage.removeItem('rem-key');
        expect(SecureStorage.getItem('rem-key')).toBeNull();
    });
});
