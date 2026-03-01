import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, CheckCircle2 } from 'lucide-react';
import { useGamification } from '@/shared/context/GamificationContext';

export const DailyStreakWidget: React.FC = () => {
    const { streakDays, isStreakClaimedToday, claimDailyStreak } = useGamification();

    return (
        <motion.div
            whileTap={!isStreakClaimedToday ? { scale: 0.98 } : {}}
            onClick={claimDailyStreak}
            className={`
                group relative w-full rounded-2xl p-4 flex items-center justify-between cursor-pointer overflow-hidden
                ${isStreakClaimedToday
                    ? 'bg-orange-500/10 border border-orange-500/20'
                    : 'bg-gradient-to-r from-orange-500 to-red-600 shadow-lg shadow-orange-500/30'
                }
            `}
        >
            <div className="flex items-center gap-4 z-10">
                <div className={`
                    p-3 rounded-xl flex items-center justify-center
                    ${isStreakClaimedToday ? 'bg-orange-500 text-white' : 'bg-white/20 text-white'}
                `}>
                    <Flame className={`w-6 h-6 ${!isStreakClaimedToday && 'animate-pulse'}`} fill={isStreakClaimedToday ? "currentColor" : "none"} />
                </div>
                <div>
                    <h3 className={`font-bold text-lg ${isStreakClaimedToday ? 'text-orange-600 dark:text-orange-400' : 'text-white'}`}>
                        {streakDays} روز متوالی
                    </h3>
                    <p className={`text-xs ${isStreakClaimedToday ? 'text-gray-500' : 'text-white/80'}`}>
                        {isStreakClaimedToday ? "کارت عالیه! 🔥" : "بزن تا امتیاز بگیری"}
                    </p>
                </div>
            </div>

            <div className="z-10">
                <AnimatePresence mode="wait">
                    {isStreakClaimedToday ? (
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="bg-green-500 text-white p-2 rounded-full"
                        >
                            <CheckCircle2 size={20} />
                        </motion.div>
                    ) : (
                        <motion.div
                            animate={{ x: [0, 5, 0] }}
                            transition={{ repeat: Infinity, duration: 1.5 }}
                            className="bg-white text-orange-600 px-3 py-1.5 rounded-full text-xs font-bold shadow-sm"
                        >
                            +۵۰ امتیاز
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Background effect for unclaimed state */}
            {!isStreakClaimedToday && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
            )}
        </motion.div>
    );
};
