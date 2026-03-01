import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, Award, Target, Gift, Trophy } from 'lucide-react';

// Sub-components
import { LevelCard } from './LevelCard';
import { DailyStreakWidget } from './DailyStreakWidget';
import { BadgesGrid } from './BadgesGrid';
import { MissionProgress } from './MissionProgress';
import { MysteryBox } from './MysteryBox';
import { Leaderboard } from './Leaderboard';

type Tab = 'overview' | 'missions' | 'badges' | 'box' | 'leaderboard';

export const GamificationHub: React.FC = () => {
    const [activeTab, setActiveTab] = useState<Tab>('overview');

    const tabs = [
        { id: 'overview', icon: <LayoutDashboard size={20} />, label: 'نمای کلی' },
        { id: 'missions', icon: <Target size={20} />, label: 'مأموریت' },
        { id: 'badges', icon: <Award size={20} />, label: 'مدال‌ها' },
        { id: 'box', icon: <Gift size={20} />, label: 'شانس' },
        { id: 'leaderboard', icon: <Trophy size={20} />, label: 'رتبه‌بندی' },
    ];

    return (
        <div className="w-full bg-surface/50 backdrop-blur-xl border border-white/10 rounded-[32px] overflow-hidden shadow-2xl">
            {/* Content Area */}
            <div className="p-5 min-h-[300px]">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="h-full"
                    >
                        {activeTab === 'overview' && (
                            <div className="space-y-4">
                                <LevelCard />
                                <DailyStreakWidget />
                            </div>
                        )}
                        {activeTab === 'missions' && <MissionProgress />}
                        {activeTab === 'badges' && <BadgesGrid />}
                        {activeTab === 'box' && <MysteryBox />}
                        {activeTab === 'leaderboard' && <Leaderboard />}
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Navigation Bar */}
            <div className="bg-black/20 backdrop-blur-md border-t border-white/5 p-2">
                <div className="flex justify-between items-center">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as Tab)}
                            className={`
                                relative flex flex-col items-center justify-center p-2 rounded-2xl w-full transition-all duration-300
                                ${activeTab === tab.id ? 'text-white' : 'text-white/40 hover:text-white/70'}
                            `}
                        >
                            {activeTab === tab.id && (
                                <motion.div
                                    layoutId="activeTabBg"
                                    className="absolute inset-0 bg-white/10 rounded-2xl"
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                />
                            )}
                            <div className="relative z-10 flex flex-col items-center gap-1">
                                {tab.icon}
                                <span className="text-[10px] font-medium">{tab.label}</span>
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};
