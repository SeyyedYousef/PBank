import React from 'react';
import { motion } from 'framer-motion';
import { useGamification } from '@/shared/context/GamificationContext';
import { Crown, Sparkles } from 'lucide-react';

export const MembershipCard: React.FC = () => {
    const { level, xp, nextLevelXp, tierName } = useGamification();
    const progress = (xp / nextLevelXp) * 100;

    // Defines visual styles based on Tier (simulated logic for now based on name)
    const getTierStyle = () => {
        switch (tierName) {
            case 'پلاتینیوم': return 'from-slate-900 via-gray-800 to-black border-slate-700';
            case 'طلایی': return 'from-yellow-600 via-amber-500 to-yellow-800 border-yellow-400/30';
            case 'نقره‌ای': return 'from-gray-400 via-gray-300 to-gray-500 border-white/40 text-gray-900';
            default: return 'from-blue-600 via-indigo-600 to-purple-700 border-white/10'; // Blue/Start
        }
    };

    const isLightText = tierName === 'نقره‌ای'; // Silver might need dark text

    return (
        <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className={`
                w-full h-48 rounded-[32px] p-6 relative overflow-hidden shadow-2xl border
                bg-gradient-to-br ${getTierStyle()}
            `}
        >
            {/* Glossy Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/20 blur-[80px] rounded-full mix-blend-overlay" />

            <div className={`relative z-10 h-full flex flex-col justify-between ${isLightText ? 'text-gray-800' : 'text-white'}`}>
                {/* Header */}
                <div className="flex justify-between items-start">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <Crown className={`w-5 h-5 ${isLightText ? 'text-gray-700' : 'text-white/80'}`} />
                            <span className="text-sm font-medium tracking-wide opacity-80">عضویت {tierName}</span>
                        </div>
                        <h2 className="text-4xl font-black tracking-tight" style={{ fontFamily: 'system-ui' }}>
                            Level {level}
                        </h2>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
                        <Sparkles className="w-5 h-5 opacity-90" />
                    </div>
                </div>

                {/* Footer / Progress */}
                <div>
                    <div className="flex justify-between text-xs mb-2 opacity-80 font-mono">
                        <span>{xp} XP</span>
                        <span>{nextLevelXp} XP</span>
                    </div>
                    <div className="h-2 bg-black/20 rounded-full overflow-hidden backdrop-blur-sm">
                        <motion.div
                            className={`h-full relative ${isLightText ? 'bg-gray-800' : 'bg-white'}`}
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                        >
                            <div className="absolute top-0 right-0 h-full w-2 bg-white/50 blur-[2px]" />
                        </motion.div>
                    </div>
                    <p className="text-[10px] mt-2 opacity-60 text-center">
                        برای ارتقا به سطح بعد، فعالیت خود را ادامه دهید
                    </p>
                </div>
            </div>

            {/* Pattern Texture */}
            <div className="absolute inset-0 opacity-[0.07] bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay" />
        </motion.div>
    );
};
