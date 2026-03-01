import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGamification, Badge } from '@/shared/context/GamificationContext';
import { Lock } from 'lucide-react';

export const BadgesGrid: React.FC = () => {
    const { badges } = useGamification();
    const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);

    // Handle Escape key to close modal
    React.useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setSelectedBadge(null);
        };
        if (selectedBadge) {
            window.addEventListener('keydown', handleKeyDown);
        }
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedBadge]);

    return (
        <div className="w-full">
            <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-3 px-1">ویترین افتخارات</h3>
            <div className="grid grid-cols-2 gap-3">
                {badges.map((badge) => (
                    <motion.div
                        key={badge.id}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setSelectedBadge(badge)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                setSelectedBadge(badge);
                            }
                        }}
                        className={`
                            relative rounded-2xl p-4 cursor-pointer overflow-hidden flex items-center gap-3 border outline-none focus-visible:ring-4 focus-visible:ring-primary/50
                            ${badge.isUnlocked
                                ? 'bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border-gray-200 dark:border-gray-700 shadow-sm'
                                : 'bg-gray-100 dark:bg-gray-900 border-transparent opacity-60'
                            }
                        `}
                    >
                        {/* Glow for unlocked */}
                        {badge.isUnlocked && (
                            <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-${badge.color.split('-')[1]}-500/20 to-transparent blur-2xl rounded-full -mr-10 -mt-10`} />
                        )}

                        <div className={`
                            w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-inner
                            ${badge.isUnlocked ? 'bg-white dark:bg-black/20' : 'bg-gray-200 dark:bg-gray-800 grayscale'}
                        `}>
                            {badge.icon}
                        </div>

                        <div className="flex-1 min-w-0">
                            <h4 className={`text-sm font-bold truncate ${badge.isUnlocked ? 'text-gray-800 dark:text-gray-100' : 'text-gray-500'}`}>
                                {badge.name}
                            </h4>
                            <p className="text-[10px] text-gray-500 truncate">
                                {badge.isUnlocked ? 'کسب شده' : 'قفل'}
                            </p>
                        </div>

                        {!badge.isUnlocked && (
                            <Lock size={14} className="text-gray-400" />
                        )}
                    </motion.div>
                ))}
            </div>

            {/* Premium Badge Details Modal */}
            <AnimatePresence>
                {selectedBadge && (
                    <div
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                        onClick={() => setSelectedBadge(null)}
                        role="dialog"
                        aria-modal="true"
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white dark:bg-slate-900 w-full max-w-xs rounded-[32px] p-0 text-center shadow-2xl relative overflow-hidden ring-1 ring-white/20"
                        >
                            {/* Premium Header Background */}
                            <div className={`h-32 w-full bg-gradient-to-b from-gray-900 to-slate-900 flex items-center justify-center relative overflow-hidden`}>
                                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
                                <div className="relative z-10 text-7xl drop-shadow-2xl filter">
                                    {selectedBadge.icon}
                                </div>
                                {selectedBadge.isUnlocked && (
                                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-slate-900 to-transparent" />
                                )}
                            </div>

                            <div className="p-6 pt-2">
                                <h3 className={`text-2xl font-black mb-2 ${selectedBadge.isUnlocked ? 'bg-gradient-to-r from-amber-500 to-yellow-600 bg-clip-text text-transparent' : 'text-gray-500'}`}>
                                    {selectedBadge.name}
                                </h3>

                                <div className="w-16 h-1 bg-gray-200 dark:bg-gray-800 rounded-full mx-auto mb-4" />

                                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-6 font-medium">
                                    {selectedBadge.description}
                                </p>

                                <button
                                    onClick={() => setSelectedBadge(null)}
                                    className={`
                                        w-full py-3.5 rounded-2xl font-bold transition-transform active:scale-95
                                        ${selectedBadge.isUnlocked
                                            ? 'bg-gradient-to-r from-slate-800 to-black text-white shadow-lg'
                                            : 'bg-gray-100 dark:bg-gray-800 text-gray-400'
                                        }
                                    `}
                                >
                                    {selectedBadge.isUnlocked ? 'بستن' : 'هنوز قفل است'}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};
