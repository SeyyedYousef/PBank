import { useState } from 'react';
import { motion } from 'framer-motion';
import { useGamification } from '@/shared/context/GamificationContext';
import { Plus, X, Check } from 'lucide-react';

export const MissionProgress: React.FC = () => {
    const { financialGoals, addFinancialGoal } = useGamification();
    const [isAdding, setIsAdding] = useState(false);
    const [newTitle, setNewTitle] = useState('');
    const [newAmount, setNewAmount] = useState('');

    const handleAdd = () => {
        if (newTitle && newAmount) {
            addFinancialGoal(newTitle, parseInt(newAmount));
            setNewTitle('');
            setNewAmount('');
            setIsAdding(false);
        }
    };

    return (
        <div className="w-full">
            <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-3 px-1">اهداف مالی</h3>
            <div className="space-y-4">
                {financialGoals.map((goal) => (
                    <div key={goal.id} className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                        <div className="flex justify-between items-center mb-2">
                            <div className="flex items-center gap-3">
                                <span className="text-xl bg-gray-100 dark:bg-gray-700 p-2 rounded-xl">{goal.icon}</span>
                                <div>
                                    <h4 className="font-semibold text-sm text-gray-900 dark:text-gray-100">{goal.title}</h4>
                                    <p className="text-xs text-gray-500">
                                        {(goal.currentAmount / goal.targetAmount * 100).toFixed(0)}% تکمیل شده
                                    </p>
                                </div>
                            </div>
                            <span className="text-xs font-mono font-bold text-gray-400">
                                {goal.currentAmount.toLocaleString()} / {goal.targetAmount.toLocaleString()}
                            </span>
                        </div>

                        {/* Progress Bar */}
                        <div className="h-2 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                            <motion.div
                                className="h-full rounded-full relative"
                                style={{ backgroundColor: goal.color }}
                                initial={{ width: 0 }}
                                animate={{ width: `${(goal.currentAmount / goal.targetAmount) * 100}%` }}
                                transition={{ duration: 1, delay: 0.2 }}
                            >
                                <div className="absolute top-0 right-0 h-full w-1 bg-white/40 blur-[1px]" />
                            </motion.div>
                        </div>
                    </div>
                ))}

                {/* Add New Goal Card */}
                {!isAdding ? (
                    <motion.button
                        layout
                        onClick={() => setIsAdding(true)}
                        whileTap={{ scale: 0.98 }}
                        className="w-full p-4 rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center gap-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-400 dark:hover:border-gray-500 transition-colors"
                    >
                        <Plus size={20} />
                        <span className="font-semibold text-sm">افزودن هدف جدید</span>
                    </motion.button>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 space-y-3"
                    >
                        <h4 className="font-bold text-sm text-gray-700 dark:text-gray-200">هدف جدید</h4>
                        <input
                            type="text"
                            placeholder="نام هدف (مثلا: خرید لپ‌تاپ)"
                            value={newTitle}
                            onChange={(e) => setNewTitle(e.target.value)}
                            className="w-full p-3 bg-gray-50 dark:bg-gray-900 rounded-xl text-sm outline-none border border-transparent focus:border-primary transition-colors text-right"
                        />
                        <input
                            type="number"
                            placeholder="مبلغ هدف (افغانی)"
                            value={newAmount}
                            onChange={(e) => setNewAmount(e.target.value)}
                            className="w-full p-3 bg-gray-50 dark:bg-gray-900 rounded-xl text-sm outline-none border border-transparent focus:border-primary transition-colors text-right font-mono"
                        />
                        <div className="flex gap-2">
                            <button
                                onClick={() => setIsAdding(false)}
                                className="flex-1 py-2 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-500 flex items-center justify-center"
                            >
                                <X size={18} />
                            </button>
                            <button
                                onClick={handleAdd}
                                disabled={!newTitle || !newAmount}
                                className="flex-[3] py-2 rounded-xl bg-primary text-white flex items-center justify-center font-bold disabled:opacity-50"
                            >
                                <Check size={18} className="mr-2" />
                                ثبت هدف
                            </button>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
};
