import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PageTransition } from '@/shared/ui/PageTransition';
import { useGamification } from '@/shared/context/GamificationContext';
import { useNavigate } from 'react-router-dom';
import {
    ArrowLeft, Crown, Star, Gift, Zap, Trophy, Lock,
    Sparkles, Target, Flame
} from 'lucide-react';

export const RewardsPage = () => {
    const navigate = useNavigate();
    const {
        level, xp, nextLevelXp, tierName,
        badges, streakDays, isStreakClaimedToday, claimDailyStreak,
        mysteryBoxCount, openMysteryBox, privileges
    } = useGamification();
    const [activeTab, setActiveTab] = useState<'overview' | 'badges' | 'privileges'>('overview');
    const [mysteryResult, setMysteryResult] = useState<string | null>(null);

    const progress = (xp / nextLevelXp) * 100;
    const circumference = 2 * Math.PI * 60;
    const strokeDashoffset = circumference - (progress / 100) * circumference;

    const handleMysteryBox = () => {
        const result = openMysteryBox();
        if (result) {
            setMysteryResult(result.reward);
            setTimeout(() => setMysteryResult(null), 3000);
        }
    };

    const tabs = [
        { id: 'overview', label: 'نمای کلی', icon: Star },
        { id: 'badges', label: 'نشان‌ها', icon: Trophy },
        { id: 'privileges', label: 'امتیازات', icon: Crown },
    ] as const;

    return (
        <PageTransition className="pb-32">
            {/* Header */}
            <div className="sticky top-0 z-40 px-6 py-4 backdrop-blur-xl bg-black/30 border-b border-white/5">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all border border-white/5"
                    >
                        <ArrowLeft className="w-5 h-5 text-white" />
                    </button>
                    <h1 className="text-lg font-bold text-white">پاداش‌ها و سطح‌بندی</h1>
                </div>
            </div>

            <div className="px-6 space-y-8 mt-6">
                {/* Level Progress Ring */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                    className="flex flex-col items-center relative"
                >
                    {/* Glow behind */}
                    <div className="absolute top-4 w-40 h-40 bg-primary/20 blur-[60px] rounded-full" />

                    <div className="relative">
                        <svg width="140" height="140" className="progress-ring">
                            <circle cx="70" cy="70" r="60" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
                            <circle
                                cx="70" cy="70" r="60" fill="none"
                                stroke="url(#levelGradient)"
                                strokeWidth="8"
                                strokeDasharray={circumference}
                                strokeDashoffset={strokeDashoffset}
                                className="progress-ring-circle"
                            />
                            <defs>
                                <linearGradient id="levelGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor="#7F00FF" />
                                    <stop offset="50%" stopColor="#BF55EC" />
                                    <stop offset="100%" stopColor="#00FF94" />
                                </linearGradient>
                            </defs>
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-3xl font-black text-white">{level}</span>
                            <span className="text-[10px] text-gray-400 uppercase tracking-wider font-bold">سطح</span>
                        </div>
                    </div>

                    <div className="text-center mt-4 space-y-1">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/15 border border-primary/20">
                            <Crown className="w-4 h-4 text-primary-glow" />
                            <span className="text-primary-glow font-bold text-sm">{tierName}</span>
                        </div>
                        <p className="text-gray-400 text-xs font-mono">
                            {xp} / {nextLevelXp} XP
                        </p>
                    </div>
                </motion.div>

                {/* Streak & Mystery Box Row */}
                <div className="grid grid-cols-2 gap-3">
                    {/* Daily Streak */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="omega-glass-card rounded-2xl p-4 space-y-3"
                    >
                        <div className="flex items-center gap-2">
                            <Flame className="w-5 h-5 text-orange-400" />
                            <span className="text-white font-bold text-sm">روزهای متوالی</span>
                        </div>
                        <p className="text-3xl font-black text-orange-400">{streakDays}</p>
                        <button
                            onClick={claimDailyStreak}
                            disabled={isStreakClaimedToday}
                            className={`w-full py-2 rounded-xl text-xs font-bold transition-all ${isStreakClaimedToday
                                ? 'bg-white/5 text-gray-500 cursor-not-allowed'
                                : 'bg-orange-500/20 text-orange-400 hover:bg-orange-500/30 active:scale-95'
                                }`}
                        >
                            {isStreakClaimedToday ? '✓ امروز گرفتید' : 'دریافت امتیاز'}
                        </button>
                    </motion.div>

                    {/* Mystery Box */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="omega-glass-card rounded-2xl p-4 space-y-3"
                    >
                        <div className="flex items-center gap-2">
                            <Gift className="w-5 h-5 text-purple-400" />
                            <span className="text-white font-bold text-sm">جعبه رمز</span>
                        </div>
                        <p className="text-3xl font-black text-purple-400">{mysteryBoxCount}</p>
                        <button
                            onClick={handleMysteryBox}
                            disabled={mysteryBoxCount <= 0}
                            className={`w-full py-2 rounded-xl text-xs font-bold transition-all ${mysteryBoxCount <= 0
                                ? 'bg-white/5 text-gray-500 cursor-not-allowed'
                                : 'bg-purple-500/20 text-purple-400 hover:bg-purple-500/30 active:scale-95 animate-breathe'
                                }`}
                        >
                            {mysteryBoxCount <= 0 ? 'جعبه‌ای ندارید' : '🎁 باز کردن'}
                        </button>
                    </motion.div>
                </div>

                {/* Mystery Box Result */}
                <AnimatePresence>
                    {mysteryResult && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.8, y: -20 }}
                            className="p-4 rounded-2xl bg-gradient-to-r from-purple-600/20 to-primary/20 border border-purple-500/30 text-center"
                        >
                            <Sparkles className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                            <p className="text-white font-bold">🎉 {mysteryResult}</p>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Tab Navigation */}
                <div className="flex p-1 bg-white/5 rounded-2xl border border-white/5">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl transition-all text-xs font-bold ${activeTab === tab.id
                                ? 'bg-white/10 text-white shadow-sm'
                                : 'text-gray-500 hover:text-gray-300'
                                }`}
                        >
                            <tab.icon className="w-3.5 h-3.5" />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                <AnimatePresence mode="wait">
                    {activeTab === 'badges' && (
                        <motion.div
                            key="badges"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="grid grid-cols-3 gap-3"
                        >
                            {badges.map((badge, i) => (
                                <motion.div
                                    key={badge.id}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: i * 0.05 }}
                                    className={`omega-glass-card rounded-2xl p-4 flex flex-col items-center gap-2 text-center ${!badge.isUnlocked ? 'opacity-40 grayscale' : ''
                                        }`}
                                >
                                    <span className="text-3xl">{badge.icon}</span>
                                    <span className="text-[10px] font-bold text-white leading-tight">{badge.name}</span>
                                    {!badge.isUnlocked && <Lock className="w-3 h-3 text-gray-500" />}
                                </motion.div>
                            ))}
                        </motion.div>
                    )}

                    {activeTab === 'privileges' && (
                        <motion.div
                            key="privileges"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="space-y-3"
                        >
                            {privileges.map((priv, i) => (
                                <motion.div
                                    key={priv.id}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    className={`omega-glass-card rounded-2xl p-4 flex items-center gap-4 ${!priv.isUnlocked ? 'opacity-50' : ''
                                        }`}
                                >
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${priv.isUnlocked ? 'bg-primary/20' : 'bg-white/5'
                                        }`}>
                                        <span className="text-xl">{priv.icon}</span>
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-white font-bold text-sm">{priv.title}</p>
                                        <p className="text-gray-500 text-[11px]">{priv.description}</p>
                                    </div>
                                    {priv.isUnlocked
                                        ? <Zap className="w-4 h-4 text-emerald-400" />
                                        : <Lock className="w-4 h-4 text-gray-600" />
                                    }
                                </motion.div>
                            ))}
                        </motion.div>
                    )}

                    {activeTab === 'overview' && (
                        <motion.div
                            key="overview"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="space-y-4"
                        >
                            {/* XP Milestones */}
                            <div className="omega-glass rounded-2xl p-4 space-y-4">
                                <h3 className="text-white font-bold text-sm flex items-center gap-2">
                                    <Target className="w-4 h-4 text-primary-glow" />
                                    اهداف پیش‌رو
                                </h3>
                                {[
                                    { label: 'سطح بعدی', xp: nextLevelXp, icon: '⭐' },
                                    { label: 'نشان طلایی', xp: 5000, icon: '🏆' },
                                    { label: 'باز شدن ویژگی VIP', xp: 10000, icon: '💎' },
                                ].map((goal, i) => (
                                    <div key={i} className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-400 text-xs flex items-center gap-2">
                                                <span>{goal.icon}</span>
                                                {goal.label}
                                            </span>
                                            <span className="text-gray-500 text-[10px] font-mono">{Math.min(xp, goal.xp)}/{goal.xp}</span>
                                        </div>
                                        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                                            <motion.div
                                                className="h-full bg-gradient-to-r from-primary to-primary-glow rounded-full"
                                                initial={{ width: 0 }}
                                                animate={{ width: `${Math.min((xp / goal.xp) * 100, 100)}%` }}
                                                transition={{ delay: 0.3 + i * 0.1, duration: 1, ease: [0.16, 1, 0.3, 1] }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Stats */}
                            <div className="grid grid-cols-3 gap-3">
                                {[
                                    { label: 'نشان‌ها', value: badges.filter(b => b.isUnlocked).length, total: badges.length, color: 'text-amber-400' },
                                    { label: 'امتیازات', value: privileges.filter(p => p.isUnlocked).length, total: privileges.length, color: 'text-emerald-400' },
                                    { label: 'کل XP', value: xp, total: null, color: 'text-purple-400' },
                                ].map((stat, i) => (
                                    <div key={i} className="omega-glass rounded-xl p-3 text-center">
                                        <p className={`text-xl font-black ${stat.color}`}>{stat.value}</p>
                                        {stat.total !== null && (
                                            <p className="text-gray-600 text-[10px]">از {stat.total}</p>
                                        )}
                                        <p className="text-gray-400 text-[10px] font-bold mt-1">{stat.label}</p>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </PageTransition>
    );
};
