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
                { id: 1, type: 'send', title: 'خرید کتاب', name: 'احمد رضایی', amount: 500, time: '14:30', date: 'امروز', tracking: '29837412', status: 'success', note: 'بابت خرید کتاب' },
                { id: 2, type: 'receive', title: 'حقوق', name: 'سارا کریمی', amount: 12000, time: '10:15', date: 'امروز', tracking: '88273611', status: 'success', note: 'حقوق ماهانه' },
                { id: 3, type: 'send', title: 'شارژ', name: 'خرید شارژ', amount: 100, time: '21:00', date: 'دیروز', tracking: '11223344', status: 'success', note: '' },
                { id: 4, type: 'send', title: 'کافه', name: 'کافه نادری', amount: 450, time: '18:45', date: 'دیروز', tracking: '99887766', status: 'success', note: 'قهوه با دوستان' },
                { id: 5, type: 'receive', title: 'عودت وجه', name: 'برگشت پول', amount: 50, time: '09:00', date: '۱۴۰۲/۱۰/۰۱', tracking: '55443322', status: 'success', note: 'لغو اسنپ' },
                { id: 6, type: 'send', title: 'قبض', name: 'قبض برق', amount: 3200, time: '12:00', date: '۱۴۰۲/۱۰/۰۱', tracking: '66778899', status: 'success', note: 'دوره آذر' },
            ], // Default initial transactions
            pbankId: "8888" + Math.floor(Math.random() * 1000000000000).toString().padStart(12, '0'),

            sendMoney: (amount, recipient, message) => {
                const { balance, transactions } = get();
                if (balance < amount) throw new Error("موجودی کافی نیست!");

                const newTransaction: Transaction = {
                    id: Date.now().toString(),
                    type: 'send',
                    amount: amount,
                    title: `انتقال به ${recipient}`,
                    name: recipient,
                    date: new Date().toLocaleDateString('fa-IR'),
                    time: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }),
                    tracking: Math.floor(Math.random() * 100000000).toString(),
                    status: 'success',
                    note: 'انتقال وجه',
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
                    title: `دریافت از ${sender}`,
                    name: sender,
                    date: new Date().toLocaleDateString('fa-IR'),
                    time: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }),
                    tracking: Math.floor(Math.random() * 100000000).toString(),
                    status: 'success',
                    note: 'دریافت وجه',
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
