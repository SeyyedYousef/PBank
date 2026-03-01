import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useWalletStore } from '../store/walletStore';
import { SecureStorage } from '../shared/lib/secureStorage';
import { EncryptionService } from '../shared/lib/security/encryption';

describe('Critical Security Integration Flow', () => {
    beforeEach(() => {
        SecureStorage.clear();
        useWalletStore.setState({
            balance: 1000,
            transactions: [],
            // Mock sending money function logic is internal to store, so we test the effect
        });
    });

    it('should encrypt sensitive transaction data before storage', async () => {
        const store = useWalletStore.getState();
        const spyEncrypt = vi.spyOn(EncryptionService, 'encrypt');
        const spyStorage = vi.spyOn(SecureStorage, 'setItem');

        // Execute Critical Action
        store.sendMoney(100, 'Test User', 'Secret Message');

        // Wait for async storage operations (Zustand persist is async)
        await new Promise(resolve => setTimeout(resolve, 100));

        // Verify Encryption was called
        expect(spyEncrypt).toHaveBeenCalled();

        // Verify Storage received something (the encrypted string)
        // We can't check exact value because IV/Salt is random
        expect(spyStorage).toHaveBeenCalledWith(
            expect.stringContaining('wallet-storage'), // Key
            expect.any(String), // Value (Encrypted)
            'local' // Type
        );
    });

    it('should decrypt data correctly upon retrieval', async () => {
        // 1. Manually seed storage with encrypted data
        const secretData = JSON.stringify({ state: { balance: 5000 }, version: 0 });
        const encrypted = await EncryptionService.encrypt(secretData);
        SecureStorage.setItem('wallet-storage', encrypted, 'local');

        // 2. Re-initialize store (simulate app reload) or manually invoke storage.getItem
        // Since we can't easily re-init the hook, we test the adapter logic via the service directly
        // or assumes the store calls getItem on init. 

        // Let's verify the decryption service manually to ensure the integrity
        const stored = SecureStorage.getItem('wallet-storage');
        expect(stored).toBeTruthy();

        const decrypted = await EncryptionService.decrypt<any>(stored!);
        expect(decrypted).toBeTruthy();
        const parsed = JSON.parse(decrypted!);
        expect(parsed.state.balance).toBe(5000);
    });
});
