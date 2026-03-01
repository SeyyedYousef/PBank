import { create } from 'zustand';

interface AppLockState {
    isLocked: boolean;
    lastActive: number;
    lockApp: () => void;
    unlockApp: () => void;
    updateActivity: () => void;
}

export const useAppLockStore = create<AppLockState>((set) => ({
    isLocked: false,
    lastActive: Date.now(),
    lockApp: () => set({ isLocked: true }),
    unlockApp: () => set({ isLocked: false, lastActive: Date.now() }),
    updateActivity: () => set({ lastActive: Date.now() }),
}));
