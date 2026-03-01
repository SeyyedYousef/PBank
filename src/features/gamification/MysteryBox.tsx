import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gift, Sparkles } from 'lucide-react';
import { useGamification } from '@/shared/context/GamificationContext';

export const MysteryBox: React.FC = () => {
    const { mysteryBoxCount, openMysteryBox } = useGamification();
    const [reward, setReward] = useState<string | null>(null);
    const [isOpening, setIsOpening] = useState(false);

    const handleOpen = () => {
        if (mysteryBoxCount > 0 && !isOpening) {
            setIsOpening(true);
            setTimeout(() => {
                const result = openMysteryBox();
                if (result) {
                    setReward(result.reward);
                }
                setIsOpening(false);
            }, 2000); // 2 seconds animation
        }
    };

    return (
        <div className="w-full">
            <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-2 px-1">جعبه شانس</h3>

            <motion.div
                className={`
                    relative w-full rounded-2xl p-6 overflow-hidden min-h-[140px] flex flex-col items-center justify-center
                    ${mysteryBoxCount > 0
                        ? 'bg-gradient-to-br from-indigo-500 to-purple-600 cursor-pointer shadow-lg shadow-purple-500/30'
                        : 'bg-gray-100 dark:bg-gray-800 border border-dashed border-gray-300 dark:border-gray-600'
                    }
                `}
                onClick={handleOpen}
                whileTap={mysteryBoxCount > 0 ? { scale: 0.98 } : {}}
            >
                {/* Reward Overlay */}
                <AnimatePresence>
                    {reward && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 p-4 text-center"
                            onClick={(e) => {
                                e.stopPropagation();
                                setReward(null);
                            }}
                        >
                            <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-2xl">
                                <Sparkles className="w-12 h-12 text-yellow-400 mx-auto mb-2 animate-spin-slow" />
                                <h4 className="text-xl font-bold text-white mb-1">تبریک!</h4>
                                <p className="text-purple-400 font-medium">{reward}</p>
                                <button className="mt-4 text-sm text-gray-400 underline">بستن</button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {mysteryBoxCount > 0 ? (
                    <>
                        <motion.div
                            animate={isOpening ? {
                                rotate: [0, -10, 10, -10, 10, 0],
                                scale: [1, 1.1, 1]
                            } : {
                                y: [0, -5, 0]
                            }}
                            transition={isOpening ? { duration: 0.5, repeat: 3 } : { duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        >
                            <Gift size={48} className="text-white mb-2" />
                        </motion.div>
                        <h4 className="text-white font-bold text-lg">
                            {isOpening ? "در حال باز شدن..." : "برای باز کردن بزنید!"}
                        </h4>
                        <span className="text-white/70 text-sm bg-white/20 px-3 py-1 rounded-full mt-2">
                            {mysteryBoxCount.toLocaleString('fa-IR')} عدد موجود
                        </span>

                        {/* Sparkles Background */}
                        <div className="absolute top-2 right-4 text-white/30 animate-pulse">✨</div>
                        <div className="absolute bottom-3 left-4 text-white/20 animate-pulse delay-75">✨</div>
                    </>
                ) : (
                    <div className="text-center text-gray-400">
                        <Gift size={32} className="mx-auto mb-2 opacity-50" />
                        <span className="text-sm font-medium">جعبه‌ای موجود نیست</span>
                        <p className="text-xs text-gray-500 mt-1">با انجام ۱۰ تراکنش یک جعبه بگیرید.</p>
                    </div>
                )}
            </motion.div>
        </div>
    );
};
