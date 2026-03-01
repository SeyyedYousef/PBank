import { describe, it, expect, beforeEach } from 'vitest';
import { useWalletStore } from './walletStore';

describe('useWalletStore', () => {
    beforeEach(() => {
        // Reset state
        useWalletStore.setState({
            balance: 1000,
            transactions: []
        });
    });

    it('should initialize with default balance', () => {
        const state = useWalletStore.getState();
        expect(state.balance).toBe(1000);
        expect(state.transactions).toHaveLength(0);
    });

    it('should send money and update balance', () => {
        const { sendMoney } = useWalletStore.getState();

        sendMoney(200, 'Recipient User', 'Test transfer');

        const state = useWalletStore.getState();
        expect(state.balance).toBe(800);
        expect(state.transactions).toHaveLength(1);
        expect(state.transactions[0].type).toBe('send');
        expect(state.transactions[0].amount).toBe(200);
        expect(state.transactions[0].name).toBe('Recipient User');
    });

    it('should receive money and update balance', () => {
        const { receiveMoney } = useWalletStore.getState();

        receiveMoney(500, 'Sender User', 'Test receive');

        const state = useWalletStore.getState();
        expect(state.balance).toBe(1500);
        expect(state.transactions).toHaveLength(1);
        expect(state.transactions[0].type).toBe('receive');
        expect(state.transactions[0].amount).toBe(500);
    });

    it('should throw error if balance is insufficient', () => {
        const { sendMoney } = useWalletStore.getState();

        expect(() => {
            sendMoney(2000, 'Anyone');
        }).toThrow('موجودی کافی نیست!');
    });
});
