import React from 'react';
import { motion } from 'framer-motion';
import { useGamification } from '@/shared/context/GamificationContext';

export const LevelCard: React.FC = () => {
    const { level, xp, nextLevelXp } = useGamification();
    const progress = (xp / nextLevelXp) * 100;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full bg-gradient-to-br from-indigo-900 to-purple-900 rounded-3xl p-6 relative overflow-hidden text-white shadow-xl"
        >
            {/* Background Decorations */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/20 rounded-full blur-3xl -mr-10 -mt-10" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-500/20 rounded-full blur-2xl -ml-5 -mb-5" />

            <div className="relative z-10 flex justify-between items-start mb-4">
                <div>
                    <h2 className="text-lg font-medium text-white/80">سطح کاربری</h2>
                    <div className="flex items-baseline gap-2">
                        <span className="text-5xl font-bold tracking-tighter shadow-glow">
                            {level}
                        </span>
                        <span className="text-sm font-semibold text-purple-200">ستاره‌دار</span>
                    </div>
                </div>
                <div className="bg-white/10 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                    <span className="text-xs font-medium">تا مرحله بعد</span>
                </div>
            </div>

            <div className="relative z-10">
                <div className="flex justify-between text-xs mb-2 text-white/70">
                    <span>{xp} XP</span>
                    <span>{nextLevelXp} XP</span>
                </div>
                <div className="h-4 bg-black/30 rounded-full overflow-hidden border border-white/5">
                    <motion.div
                        className="h-full bg-gradient-to-r from-blue-400 via-purple-400 to-pink-500 relative"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                    >
                        <div className="absolute top-0 left-0 w-full h-full opacity-30 bg-[url('https://www.transparenttextures.com/patterns/diagonal-stripes.png')]"></div>
                        {/* Shine Effect */}
                        <div className="absolute top-0 right-0 h-full w-2 bg-white/50 blur-[2px] shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
};
