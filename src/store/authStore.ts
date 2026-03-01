import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { SecureStorage } from '@/shared/lib/secureStorage';
import { AuthService } from '@/shared/api/authService';

export interface UserProfile {
    name: string;
    username?: string;
    email?: string;
    avatar?: string;
}

interface AuthState {
    isAuthenticated: boolean;
    phone: string | null;
    tempPhone: string | null; // For login flow persistence
    user: UserProfile | null;
    accessToken: string | null;
    refreshToken: string | null;
    isLoading: boolean;
    error: string | null;

    setTempPhone: (phone: string) => void;
    login: (phone: string, password?: string) => Promise<void>;
    logout: () => Promise<void>;
    updateUser: (data: Partial<UserProfile>) => void;
    rotateTokens: () => Promise<void>;
}

// Custom storage adapter for Zustand to use our SecureStorage
const secureSessionStorage = {
    getItem: (name: string) => SecureStorage.getItem(name),
    setItem: (name: string, value: string) => SecureStorage.setItem(name, value, 'session'),
    removeItem: (name: string) => SecureStorage.removeItem(name),
};

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            isAuthenticated: false,
            phone: null,
            tempPhone: null,
            user: null,
            accessToken: null,
            refreshToken: null,
            isLoading: false,
            error: null,

            setTempPhone: (phone) => set({ tempPhone: phone }),

            login: async (phone: string, password?: string) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await AuthService.login(phone, password);

                    set({
                        isAuthenticated: true,
                        phone,
                        user: response.user,
                        accessToken: response.accessToken,
                        refreshToken: response.refreshToken,
                        isLoading: false
                    });

                    // Setup silent refresh (simplified for POC)
                    // In real app, this should be handled by Axios Interceptors, 
                    // not setTimeouts in store which leak memory if not cleared.
                } catch (err: unknown) {
                    const errorMessage = err instanceof Error ? err.message : 'Login failed';
                    set({
                        isLoading: false,
                        error: errorMessage
                    });
                    throw err; // Re-throw to let UI handle it if needed
                }
            },

            logout: async () => {
                try {
                    // Attempt server logout, but clear client state regardless
                    await AuthService.logout();
                } finally {
                    set({
                        isAuthenticated: false,
                        phone: null,
                        user: null,
                        accessToken: null,
                        refreshToken: null
                    });

                    // Force clear purely secure items that might be in local/session
                    SecureStorage.clear();
                }
            },

            updateUser: (data) => {
                set((state) => ({
                    user: state.user ? { ...state.user, ...data } : null
                }));
            },

            rotateTokens: async () => {
                const { refreshToken } = get();
                if (!refreshToken) return;

                try {
                    const tokens = await AuthService.refreshToken(refreshToken);
                    set({
                        accessToken: tokens.accessToken,
                        refreshToken: tokens.refreshToken
                    });
                } catch (error) {
                    console.error("Token rotation failed", error);
                    // If rotation fails (e.g. refresh token expired), force logout
                    get().logout();
                }
            },
        }),
        {
            name: 'auth-storage-v2', // Changed name to invalidate old insecure cache
            storage: createJSONStorage(() => secureSessionStorage),
            partialize: (state) => ({
                // Only persist necessary fields
                // Never persist 'isLoading' or 'error'
                isAuthenticated: state.isAuthenticated,
                phone: state.phone,
                tempPhone: state.tempPhone,
                user: state.user,
                accessToken: state.accessToken,
                refreshToken: state.refreshToken
            }),
        }
    )
);
