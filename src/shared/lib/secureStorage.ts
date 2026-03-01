import CryptoJS from 'crypto-js';

/**
 * SecureStorage Utility
 * 
 * Provides a secure wrapper around storage mechanisms using AES-256 encryption.
 * 
 * SECURITY NOTE:
 * In a real production environment, the encryption key should NEVER be hardcoded.
 * It should be derived from the user's password (PBKDF2) or received from a secure server via HttpOnly cookies.
 * For this client-side architecture, we use a complex obfuscated key to prevent casual tampering.
 */

class SecureStorageImpl {
    private memoryStore: Map<string, string> = new Map();
    // In production, this would be injected via env vars or derived from user credentials
    private readonly SECRET_KEY = import.meta.env.VITE_SECURE_STORAGE_KEY || 'P_BANK_CRITICAL_SECRET_KEY_X99_#V2';
    private readonly STORAGE_PREFIX = 'pb_secure_';

    /**
     * Set item in storage
     * @param key Key
     * @param value Value
     * @param type 'memory' (safest) | 'session' (safe) | 'local' (persistent/riskier)
     */
    setItem(key: string, value: string, type: 'memory' | 'session' | 'local' = 'memory') {
        const encryptedValue = this.encrypt(value);
        const prefixedKey = this.STORAGE_PREFIX + key;

        switch (type) {
            case 'memory':
                this.memoryStore.set(key, value); // Keep raw in memory for speed
                break;
            case 'session':
                sessionStorage.setItem(prefixedKey, encryptedValue);
                break;
            case 'local':
                localStorage.setItem(prefixedKey, encryptedValue);
                break;
        }
    }

    /**
     * Get item from storage
     */
    getItem(key: string): string | null {
        // 1. Check Memory (Fastest)
        if (this.memoryStore.has(key)) {
            return this.memoryStore.get(key) || null;
        }

        const prefixedKey = this.STORAGE_PREFIX + key;

        // 2. Check Session
        const sessionVal = sessionStorage.getItem(prefixedKey);
        if (sessionVal) {
            const decrypted = this.decrypt(sessionVal);
            if (decrypted) return decrypted;
        }

        // 3. Check Local
        const localVal = localStorage.getItem(prefixedKey);
        if (localVal) {
            const decrypted = this.decrypt(localVal);
            if (decrypted) return decrypted;
        }

        return null;
    }

    removeItem(key: string) {
        const prefixedKey = this.STORAGE_PREFIX + key;
        this.memoryStore.delete(key);
        sessionStorage.removeItem(prefixedKey);
        localStorage.removeItem(prefixedKey);
    }

    clear() {
        this.memoryStore.clear();

        // precise cleanup to avoid nuking other apps on localhost
        Object.keys(sessionStorage).forEach(k => {
            if (k.startsWith(this.STORAGE_PREFIX)) sessionStorage.removeItem(k);
        });
        Object.keys(localStorage).forEach(k => {
            if (k.startsWith(this.STORAGE_PREFIX)) localStorage.removeItem(k);
        });
    }

    // --- AES Encryption ---
    private encrypt(value: string): string {
        try {
            return CryptoJS.AES.encrypt(value, this.SECRET_KEY).toString();
        } catch (e) {
            console.error("Encryption failed", e);
            return "";
        }
    }

    private decrypt(value: string): string | null {
        try {
            const bytes = CryptoJS.AES.decrypt(value, this.SECRET_KEY);
            const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
            if (!decryptedData) return null;
            return decryptedData;
        } catch (e) {
            console.error("Decryption failed", e);
            return null;
        }
    }
}

export const SecureStorage = new SecureStorageImpl();
