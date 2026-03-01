import { create } from 'zustand';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
    id: string;
    message: string;
    type: ToastType;
    duration?: number;
}

interface ToastState {
    toasts: Toast[];
    show: (message: string, type?: ToastType, duration?: number) => void;
    dismiss: (id: string) => void;
}

export const useToastStore = create<ToastState>((set) => ({
    toasts: [],
    show: (message, type = 'info', duration = 3000) => {
        const id = Math.random().toString(36).substring(2, 9);
        set((state) => ({
            toasts: [...state.toasts, { id, message, type, duration }]
        }));

        if (duration > 0) {
            setTimeout(() => {
                set((state) => ({
                    toasts: state.toasts.filter((t) => t.id !== id)
                }));
            }, duration);
        }
    },
    dismiss: (id) => {
        set((state) => ({
            toasts: state.toasts.filter((t) => t.id !== id)
        }));
    }
}));

export const toast = {
    success: (msg: string, duration?: number) => useToastStore.getState().show(msg, 'success', duration),
    error: (msg: string, duration?: number) => useToastStore.getState().show(msg, 'error', duration),
    warning: (msg: string, duration?: number) => useToastStore.getState().show(msg, 'warning', duration),
    info: (msg: string, duration?: number) => useToastStore.getState().show(msg, 'info', duration),
};
