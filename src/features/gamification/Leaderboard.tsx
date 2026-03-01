import React from 'react';
import { useGamification } from '@/shared/context/GamificationContext';

export const Leaderboard: React.FC = () => {
    const { leaderboard } = useGamification();

    return (
        <div className="w-full bg-white dark:bg-gray-800 rounded-3xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
            <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
                <span>🏆</span> برترین‌های هفته
            </h3>

            <div className="space-y-3">
                {leaderboard.map((user, index) => (
                    <div
                        key={user.id}
                        className={`
                            flex items-center justify-between p-3 rounded-2xl
                            ${user.isCurrentUser
                                ? 'bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-500/30'
                                : 'bg-gray-50 dark:bg-gray-700/30'
                            }
                        `}
                    >
                        <div className="flex items-center gap-3">
                            <div className={`
                                w-8 h-8 flex items-center justify-center rounded-full font-bold text-sm
                                ${index === 0 ? 'bg-yellow-100 text-yellow-600' :
                                    index === 1 ? 'bg-gray-200 text-gray-600' :
                                        index === 2 ? 'bg-orange-100 text-orange-600' :
                                            'text-gray-400'}
                            `}>
                                {index + 1}
                            </div>
                            <div className="flex flex-col">
                                <span className={`text-sm font-semibold ${user.isCurrentUser ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-700 dark:text-gray-300'}`}>
                                    {user.name}
                                </span>
                                {user.isCurrentUser && <span className="text-[10px] text-indigo-400">این شمایید!</span>}
                            </div>
                        </div>

                        <div className="font-mono font-bold text-sm text-gray-600 dark:text-gray-400">
                            {user.score.toLocaleString()} امتیاز
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
