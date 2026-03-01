import { render, screen } from '@testing-library/react';
import { HomePage } from '../pages/HomePage';
import { describe, it, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';

// Mock required stores/hooks to prevent errors during render
vi.mock('@/store/authStore', () => ({
    useAuthStore: () => ({
        user: { name: 'Test User', username: 'testuser', avatar: null }
    })
}));

vi.mock('@/store/walletStore', () => ({
    useWalletStore: () => ({
        balance: 10000,
        transactions: []
    })
}));

vi.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => key,
    })
}));

describe('HomePage Critical Path', () => {
    it('renders without crashing', () => {
        render(
            <BrowserRouter>
                <HomePage />
            </BrowserRouter>
        );
        // Basic assertion to ensure component mounted
        // Looking for a known element, e.g., the greeting or balance
        expect(screen.getByText(/Test User/i)).toBeInTheDocument();
    });
});
