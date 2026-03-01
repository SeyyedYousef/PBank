import React, { createContext, useContext } from 'react';
import { useGamificationStore, Badge, LeaderboardUser, FinancialGoal, Privilege } from '@/store/gamificationStore';

export type { Badge, LeaderboardUser, FinancialGoal, Privilege };

interface GamificationContextType {
  xp: number;
  level: number;
  nextLevelXp: number;
  tierName: string;
  addXp: (amount: number) => void;
  streakDays: number;
  isStreakClaimedToday: boolean;
  claimDailyStreak: () => void;
  badges: Badge[];
  leaderboard: LeaderboardUser[];
  financialGoals: FinancialGoal[];
  addFinancialGoal: (title: string, amount: number) => void;
  privileges: Privilege[];
  mysteryBoxCount: number;
  openMysteryBox: () => { reward: string } | null;
}

const GamificationContext = createContext<GamificationContextType | undefined>(undefined);

export const GamificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const store = useGamificationStore();

  return (
    <GamificationContext.Provider value={store}>
      {children}
    </GamificationContext.Provider>
  );
};

export const useGamification = () => {
  const context = useContext(GamificationContext);
  if (!context) {
    throw new Error('useGamification must be used within a GamificationProvider');
  }
  return context;
};
