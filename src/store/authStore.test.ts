import { describe, it, expect, beforeEach } from 'vitest';
import { useAuthStore } from '../store/authStore';
import { SecureStorage } from '../shared/lib/secureStorage';

describe('useAuthStore', () => {
    beforeEach(() => {
        SecureStorage.clear();
        useAuthStore.setState({ isAuthenticated: false, phone: null, tempPhone: null, user: null, accessToken: null, refreshToken: null });
    });

    it('should set tempPhone', () => {
        const { setTempPhone } = useAuthStore.getState();
        setTempPhone('0791234567');
        expect(useAuthStore.getState().tempPhone).toBe('0791234567');
    });

    it('should login successfully', async () => {
        const { login } = useAuthStore.getState();

        await login('0791234567');

        const state = useAuthStore.getState();
        expect(state.isAuthenticated).toBe(true);
        expect(state.phone).toBe('0791234567');
        expect(state.user?.username).toBeDefined();
        // Since we use mock data in AuthService, we expect the mock user
        expect(state.user?.name).toBe('کاربر پی‌بانک');

        // Verify Persistence
        // Note: We changed storage key to 'auth-storage-v2' in the new store
        expect(SecureStorage.getItem('auth-storage-v2')).toBeTruthy();
    });

    it('should logout successfully', async () => {
        const store = useAuthStore.getState();
        await store.login('0799999999');

        await store.logout();

        const state = useAuthStore.getState();
        expect(state.isAuthenticated).toBe(false);
        expect(state.phone).toBeNull();
        expect(state.user).toBeNull();
    });
});
