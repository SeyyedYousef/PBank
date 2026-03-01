import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { SecureStorage } from '@/shared/lib/secureStorage';

export interface Transaction {
    id: string | number;
    type: 'send' | 'receive' | 'deposit';
    amount: number;
    title: string;
    name: string;
    date: string;
    time: string;
    tracking: string;
    status: 'success' | 'pending' | 'failed';
    note?: string;
    message?: string;
}

interface WalletState {
    balance: number;
    transactions: Transaction[];
    pbankId: string;
    sendMoney: (amount: number, recipient: string, message?: string) => void;
    receiveMoney: (amount: number, sender: string, message?: string) => void;
}

import { EncryptionService } from '@/shared/lib/security/encryption';

// Custom storage adapter with Military-Grade Encryption
const secureLocalStorage = {
    getItem: async (name: string) => {
        const encryptedValue = SecureStorage.getItem(name);
        if (!encryptedValue) return null;

        // Decrypt the data at rest
        const decrypted = await EncryptionService.decrypt<string>(encryptedValue);
        return decrypted;
    },
    setItem: async (name: string, value: string) => {
        // Encrypt data before hitting the storage
        const encrypted = await EncryptionService.encrypt(value);
        SecureStorage.setItem(name, encrypted, 'local');
    },
    removeItem: async (name: string) => {
        SecureStorage.removeItem(name);
    },
};

export const useWalletStore = create<WalletState>()(
    persist(
        (set, get) => ({
            balance: 12450, // Default initial balance if nothing persisted
            transactions: [
                { id: 1, type: 'send', title: 'buy_book', name: 'Ahmad', amount: 500, time: '14:30', date: 'today', tracking: '29837412', status: 'success', note: 'book_purchase' },
                { id: 2, type: 'receive', title: 'salary', name: 'Sara', amount: 12000, time: '10:15', date: 'today', tracking: '88273611', status: 'success', note: 'monthly_salary' },
                { id: 3, type: 'send', title: 'topup', name: 'Mobile Topup', amount: 100, time: '21:00', date: 'yesterday', tracking: '11223344', status: 'success', note: '' },
                { id: 4, type: 'send', title: 'cafe', name: 'Naderi Cafe', amount: 450, time: '18:45', date: 'yesterday', tracking: '99887766', status: 'success', note: 'coffee_friends' },
                { id: 5, type: 'receive', title: 'refund', name: 'Refund', amount: 50, time: '09:00', date: '2024/01/01', tracking: '55443322', status: 'success', note: 'ride_cancel' },
                { id: 6, type: 'send', title: 'bill', name: 'Electricity Bill', amount: 3200, time: '12:00', date: '2024/01/01', tracking: '66778899', status: 'success', note: 'dec_bill' },
            ], // Default initial transactions
            pbankId: "8888" + Math.floor(Math.random() * 1000000000000).toString().padStart(12, '0'),

            sendMoney: (amount, recipient, message) => {
                const { balance, transactions } = get();
                if (balance < amount) throw new Error("INSUFFICIENT_FUNDS");

                const newTransaction: Transaction = {
                    id: Date.now().toString(),
                    type: 'send',
                    amount: amount,
                    title: recipient,
                    name: recipient,
                    date: new Date().toISOString().split('T')[0],
                    time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
                    tracking: Math.floor(Math.random() * 100000000).toString(),
                    status: 'success',
                    note: 'transfer',
                    message: message
                };

                set({
                    balance: balance - amount,
                    transactions: [newTransaction, ...transactions]
                });
            },

            receiveMoney: (amount, sender, message) => {
                const { balance, transactions } = get();
                const newTransaction: Transaction = {
                    id: Date.now().toString(),
                    type: 'receive',
                    amount: amount,
                    title: sender,
                    name: sender,
                    date: new Date().toISOString().split('T')[0],
                    time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
                    tracking: Math.floor(Math.random() * 100000000).toString(),
                    status: 'success',
                    note: 'receive',
                    message: message
                };

                set({
                    balance: balance + amount,
                    transactions: [newTransaction, ...transactions]
                });
            },
        }),
        {
            name: 'wallet-storage',
            storage: createJSONStorage(() => secureLocalStorage),
        }
    )
);
