import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';
import { useTranslation } from 'react-i18next';
import { useWalletStore } from '@/store/walletStore';
import { usePrivacy } from '@/shared/context/PrivacyContext';
import { ProgressRing } from '@/shared/ui/ProgressRing';

export const AnalyticsSection = () => {
    const { t } = useTranslation();
    const { balance, transactions } = useWalletStore();
    const { isPrivacyMode } = usePrivacy();

    // ── Analytics Data ──
    const totalSent = transactions.filter(t => t.type === 'send').reduce((s, t) => s + t.amount, 0);
    const totalReceived = transactions.filter(t => t.type === 'receive' || t.type === 'deposit').reduce((s, t) => s + t.amount, 0);
    const totalExpenses = totalSent;
    const totalIncome = totalReceived;

    // Chart data
    const chartData = transactions.slice().reverse().reduce((acc: { value: number }[], tx) => {
        const prev = acc.length > 0 ? acc[acc.length - 1].value : balance - totalReceived + totalSent;
        const next = tx.type === 'send' ? prev - tx.amount : prev + tx.amount;
        acc.push({ value: next });
        return acc;
    }, []);

    if (chartData.length === 0) chartData.push({ value: balance });

    // Spending categories
    const categories = [
        { name: t('profile.categories.shopping', 'خرید'), amount: 2100, color: '#7F00FF', percent: 35 },
        { name: t('profile.categories.bills', 'قبوض'), amount: 1800, color: '#00E8DB', percent: 30 },
        { name: t('profile.categories.entertainment', 'تفریح'), amount: 900, color: '#BF55EC', percent: 15 },
        { name: t('profile.categories.transport', 'حمل‌ونقل'), amount: 700, color: '#FFC700', percent: 12 },
        { name: t('profile.categories.other', 'سایر'), amount: 500, color: '#FF2E63', percent: 8 },
    ];

    // Financial health score
    const savingsRatio = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome * 100) : 50;
    const healthScore = Math.round(Math.max(0, Math.min(100, savingsRatio + 50)));
    const healthColor = healthScore >= 70 ? '#00FF94' : healthScore >= 40 ? '#FFC700' : '#FF2E63';

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
        >
            {/* Balance Chart */}
            <div className="omega-glass rounded-[24px] p-5 space-y-4">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-gray-400 text-[10px] font-bold uppercase tracking-wider">{t('profile.stats_widget.title', 'روند موجودی')}</p>
                        <p className="text-white font-black text-xl mt-1">
                            {isPrivacyMode ? '•••' : `${balance.toLocaleString()} AFN`}
                        </p>
                    </div>
                    <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold ${totalIncome >= totalExpenses ? 'bg-emerald-500/15 text-emerald-400' : 'bg-red-500/15 text-red-400'
                        }`}>
                        {totalIncome >= totalExpenses ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                        {totalIncome > 0 ? `${Math.round((totalIncome - totalExpenses) / totalIncome * 100)}%` : '0%'}
                    </div>
                </div>
                <div className="h-28 w-full -mx-2 -mb-2">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData}>
                            <defs>
                                <linearGradient id="profileGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#7F00FF" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#7F00FF" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <Area type="monotone" dataKey="value" stroke="#7F00FF" strokeWidth={2.5} fill="url(#profileGrad)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Income / Expense Cards */}
            <div className="grid grid-cols-2 gap-3">
                <div className="omega-glass rounded-2xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 rounded-xl bg-emerald-500/15 flex items-center justify-center">
                            <ArrowDownLeft className="w-4 h-4 text-emerald-400" />
                        </div>
                        <span className="text-gray-400 text-[10px] font-bold uppercase">{t('profile.analytics.income', 'درآمد')}</span>
                    </div>
                    <p className="text-emerald-400 font-black text-lg">
                        {isPrivacyMode ? '•••' : `+${totalIncome.toLocaleString()}`}
                    </p>
                </div>
                <div className="omega-glass rounded-2xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 rounded-xl bg-red-500/15 flex items-center justify-center">
                            <ArrowUpRight className="w-4 h-4 text-red-400" />
                        </div>
                        <span className="text-gray-400 text-[10px] font-bold uppercase">{t('profile.analytics.expense', 'هزینه')}</span>
                    </div>
                    <p className="text-red-400 font-black text-lg">
                        {isPrivacyMode ? '•••' : `-${totalExpenses.toLocaleString()}`}
                    </p>
                </div>
            </div>

            {/* Spending Breakdown */}
            <div className="omega-glass rounded-[24px] p-5 space-y-4">
                <p className="text-gray-400 text-[10px] font-bold uppercase tracking-wider">{t('profile.analytics.expense_summary', 'خلاصه هزینه‌ها')}</p>
                <div className="space-y-3">
                    {categories.map((cat, i) => (
                        <motion.div
                            key={cat.name}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="flex items-center gap-3"
                        >
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} />
                            <span className="text-white text-sm font-bold flex-1">{cat.name}</span>
                            <div className="flex-1 max-w-[120px]">
                                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                                    <motion.div
                                        className="h-full rounded-full"
                                        style={{ backgroundColor: cat.color }}
                                        initial={{ width: 0 }}
                                        animate={{ width: `${cat.percent}%` }}
                                        transition={{ delay: 0.3 + i * 0.1, duration: 0.8 }}
                                    />
                                </div>
                            </div>
                            <span className="text-gray-400 text-xs font-mono w-10 text-left">{cat.percent}%</span>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Financial Health */}
            <div className="omega-glass rounded-[24px] p-5">
                <p className="text-gray-400 text-[10px] font-bold uppercase tracking-wider mb-4">{t('profile.hub.groups.security', 'سلامت مالی')}</p>
                <div className="flex items-center gap-6">
                    <ProgressRing percent={healthScore} size={80} stroke={6} color={healthColor}>
                        <span className="text-xl font-black" style={{ color: healthColor }}>{healthScore}</span>
                    </ProgressRing>
                    <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-emerald-400" />
                            <span className="text-white text-xs font-bold">پس‌انداز: {Math.max(0, Math.round(savingsRatio))}%</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-primary" />
                            <span className="text-white text-xs font-bold">تراکنش‌ها: {transactions.length}</span>
                        </div>
                        <p className="text-gray-500 text-[10px]">
                            {healthScore >= 70 ? 'وضعیت مالی عالی 🎉' : healthScore >= 40 ? 'وضعیت مالی متوسط' : 'نیاز به توجه بیشتر'}
                        </p>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};
