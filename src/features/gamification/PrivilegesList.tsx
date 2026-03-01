import React from 'react';
import { motion } from 'framer-motion';
import { Lock, Unlock } from 'lucide-react';
import { useGamification } from '@/shared/context/GamificationContext';

export const PrivilegesList: React.FC = () => {
    const { privileges, level } = useGamification();

    return (
        <div className="w-full">
            <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4 px-1">مزایا و پاداش‌ها</h3>
            <div className="grid gap-3">
                {privileges.map((priv) => {
                    const isUnlocked = level >= priv.requiredLevel;
                    return (
                        <motion.div
                            key={priv.id}
                            className={`
                                relative p-4 rounded-2xl border flex items-center justify-between overflow-hidden
                                ${isUnlocked
                                    ? 'bg-gradient-to-r from-emerald-500/10 to-transparent border-emerald-500/20'
                                    : 'bg-gray-50 dark:bg-gray-800/50 border-gray-100 dark:border-gray-700 opacity-80'
                                }
                            `}
                        >
                            <div className="flex items-center gap-4 z-10">
                                <div className={`
                                    w-12 h-12 rounded-xl flex items-center justify-center text-2xl
                                    ${isUnlocked ? 'bg-emerald-100 dark:bg-emerald-500/20' : 'bg-gray-200 dark:bg-gray-700'}
                                `}>
                                    {priv.icon}
                                </div>
                                <div>
                                    <h4 className={`font-bold ${isUnlocked ? 'text-gray-900 dark:text-white' : 'text-gray-500'}`}>
                                        {priv.title}
                                    </h4>
                                    <p className="text-xs text-gray-400 mt-0.5">
                                        {priv.description}
                                    </p>
                                </div>
                            </div>

                            <div className="z-10 flex flex-col items-end">
                                {isUnlocked ? (
                                    <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-500/10 px-2 py-1 rounded-lg">
                                        <Unlock size={12} /> فعال
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-1 text-xs font-bold text-gray-400 bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded-lg">
                                        <Lock size={12} /> سطح {priv.requiredLevel}
                                    </span>
                                )}
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
};
