import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { SecureStorage } from '@/shared/lib/secureStorage';

export type Badge = {
    id: string;
    name: string;
    description: string;
    icon: string;
    isUnlocked: boolean;
    color: string;
};

export type LeaderboardUser = {
    id: string;
    name: string;
    score: number;
    rank: number;
    isCurrentUser?: boolean;
};

export type FinancialGoal = {
    id: string;
    title: string;
    targetAmount: number;
    currentAmount: number;
    icon: string;
    color: string;
};

export type Privilege = {
    id: string;
    title: string;
    description: string;
    requiredLevel: number;
    icon: string;
    isUnlocked: boolean;
};

interface GamificationState {
    xp: number;
    level: number;
    nextLevelXp: number;
    tierName: string;
    streakDays: number;
    isStreakClaimedToday: boolean;
    badges: Badge[];
    leaderboard: LeaderboardUser[];
    financialGoals: FinancialGoal[];
    privileges: Privilege[];
    mysteryBoxCount: number;

    addXp: (amount: number) => void;
    claimDailyStreak: () => void;
    unlockBadge: (badgeId: string) => void;
    updateGoal: (goalId: string, amount: number) => void;
    addFinancialGoal: (title: string, amount: number) => void;
    openMysteryBox: () => { reward: string } | null;
}

const getTierName = (lvl: number) => {
    if (lvl >= 20) return 'پلاتینیوم';
    if (lvl >= 10) return 'طلایی';
    if (lvl >= 5) return 'نقره‌ای';
    return 'آبی';
};

export const useGamificationStore = create<GamificationState>()(
    persist(
        (set, get) => ({
            xp: 2450,
            level: 5,
            nextLevelXp: 5000,
            tierName: 'نقره‌ای',
            streakDays: 12,
            isStreakClaimedToday: false,
            badges: [
                { id: '1', name: 'بنیان‌گذار', description: 'عضویت بیش از ۱ سال', icon: '🏛️', isUnlocked: true, color: 'text-amber-500' },
                { id: '2', name: 'کلوپ میلیاردی', description: 'گردش حساب بالای ۱ میلیارد', icon: '💳', isUnlocked: false, color: 'text-gray-900 dark:text-gray-200' },
                { id: '3', name: 'سرمایه‌گذار فرشته', description: 'حمایت از ۵ کسب و کار', icon: '👼', isUnlocked: false, color: 'text-blue-400' },
                { id: '4', name: 'خیرین', description: 'کمک به خیریه از طریق اپ', icon: '❤️', isUnlocked: true, color: 'text-red-500' },
                { id: '5', name: 'معامله‌گر برتر', description: '۱۰ معامله موفق در بورس', icon: '📈', isUnlocked: false, color: 'text-green-500' },
                { id: '6', name: 'سفیر برند', description: 'دعوت ۱۰ کاربر فعال', icon: '🤝', isUnlocked: false, color: 'text-indigo-400' },
            ],
            leaderboard: [
                { id: '1', name: 'کاربر-۹۹۸۲', score: 15400, rank: 1 },
                { id: '2', name: 'کاربر-۳۳۲۱', score: 12100, rank: 2 },
                { id: 'me', name: 'شما', score: 9850, rank: 3, isCurrentUser: true },
                { id: '4', name: 'کاربر-۱۱۰۲', score: 8500, rank: 4 },
            ],
            financialGoals: [
                { id: '1', title: 'خرید آیفون ۱۶', targetAmount: 60000, currentAmount: 45000, icon: '📱', color: '#3b82f6' },
            ],
            privileges: [
                { id: '1', title: 'انتقال رایگان', description: 'بدون کارمزد انتقال دهید', requiredLevel: 5, icon: '💸', isUnlocked: true },
                { id: '2', title: 'کارت فیزیکی خاص', description: 'دریافت کارت با طرح اختصاصی', requiredLevel: 10, icon: '💳', isUnlocked: false },
                { id: '3', title: 'پشتیبانی VIP', description: 'پاسخگویی زیر ۲ دقیقه', requiredLevel: 15, icon: '👑', isUnlocked: false },
                { id: '4', title: ' وام فوری', description: 'دریافت وام بدون ضامن', requiredLevel: 20, icon: '🏦', isUnlocked: false },
            ],
            mysteryBoxCount: 2,

            addXp: (amount) => {
                const { xp, level, nextLevelXp } = get();
                let newXp = xp + amount;
                let newLevel = level;

                if (newXp >= nextLevelXp) {
                    newLevel += 1;
                    newXp -= nextLevelXp;
                }

                set({
                    xp: newXp,
                    level: newLevel,
                    tierName: getTierName(newLevel)
                });
            },

            claimDailyStreak: () => {
                const { isStreakClaimedToday, streakDays } = get();
                if (!isStreakClaimedToday) {
                    set({
                        streakDays: streakDays + 1,
                        isStreakClaimedToday: true
                    });
                    get().addXp(50);
                }
            },

            unlockBadge: (badgeId) => {
                set((state) => ({
                    badges: state.badges.map(b => b.id === badgeId ? { ...b, isUnlocked: true } : b)
                }));
            },

            updateGoal: (goalId, amount) => {
                set((state) => ({
                    financialGoals: state.financialGoals.map(g =>
                        g.id === goalId ? { ...g, currentAmount: Math.min(g.targetAmount, g.currentAmount + amount) } : g
                    )
                }));
            },

            addFinancialGoal: (title, amount) => {
                const newGoal: FinancialGoal = {
                    id: Date.now().toString(),
                    title,
                    targetAmount: amount,
                    currentAmount: 0,
                    icon: '🎯',
                    color: '#10b981'
                };
                set((state) => ({
                    financialGoals: [...state.financialGoals, newGoal]
                }));
                get().addXp(20);
            },

            openMysteryBox: () => {
                const { mysteryBoxCount } = get();
                if (mysteryBoxCount > 0) {
                    set({ mysteryBoxCount: mysteryBoxCount - 1 });
                    const rewards = ['۱۰ امتیاز', '۲۰ امتیاز', 'کد تخفیف ۵٪', '۱ روز اشتراک رایگان'];
                    const reward = rewards[Math.floor(Math.random() * rewards.length)];

                    if (reward.includes('امتیاز')) {
                        const points = parseInt(reward.split(' ')[0]);
                        get().addXp(points);
                    }

                    return { reward };
                }
                return null;
            }
        }),
        {
            name: 'gamification-storage',
            storage: createJSONStorage(() => ({
                getItem: (name) => SecureStorage.getItem(name),
                setItem: (name, value) => SecureStorage.setItem(name, value, 'local'),
                removeItem: (name) => SecureStorage.removeItem(name),
            })),
        }
    )
);
