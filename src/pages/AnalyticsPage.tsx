import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { PageTransition } from '@/shared/ui/PageTransition';
import { BentoCard } from '@/shared/ui/BentoCard';
import { useTranslation } from 'react-i18next';
import { getAnalytics, getAIInsights } from '@/store/financialAnalytics';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, AreaChart, Area, XAxis, YAxis } from 'recharts';
import { BrainCircuit, TrendingUp, TrendingDown, Wallet, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { usePrivacy } from '@/shared/context/PrivacyContext';

export const AnalyticsPage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { isPrivacyMode } = usePrivacy();

    const [timeframe, setTimeframe] = useState<'week' | 'month' | '6months'>('week');

    const analytics = useMemo(() => getAnalytics(), []);
    const insights = useMemo(() => getAIInsights(analytics), [analytics]);

    const formatCurrency = (val: number) => {
        if (isPrivacyMode) return '•••';
        return val.toLocaleString() + ' ؋';
    };

    return (
        <PageTransition className="pb-32 min-h-screen">
            {/* Header */}
            <div className="sticky top-0 z-40 px-6 py-4 backdrop-blur-xl bg-black/30 border-b border-white/5">
                <div className="flex items-center gap-3">
                    <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/5">
                        <ArrowLeft className="w-4 h-4 text-gray-400 rtl:rotate-180" />
                    </button>
                    <h1 className="text-lg font-bold text-white">{t('analytics.title', 'داشبورد مالی هوشمند')}</h1>
                </div>
            </div>

            <div className="px-6 mt-6 space-y-6">
                {/* AI Assistant Banner */}
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative overflow-hidden rounded-[24px] p-5 border border-primary/20 bg-gradient-to-r from-primary/10 to-violet-500/10"
                >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-[60px] rounded-full pointer-events-none" />
                    <div className="flex gap-4 relative z-10">
                        <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0 border border-primary/30 shadow-[0_0_15px_rgba(124,58,237,0.3)]">
                            <BrainCircuit className="w-6 h-6 text-primary-glow" />
                        </div>
                        <div>
                            <h2 className="text-sm font-bold text-white mb-1.5">{t('analytics.ai_title', 'دستیار هوشمند PBank')}</h2>
                            <ul className="space-y-1.5 list-disc list-inside text-xs text-gray-300">
                                {insights.map((insight, idx) => (
                                    <li key={idx}>
                                        {insight === 'savings_low' && t('analytics.insights.savings_low', 'پس‌انداز شما کمتر از ۱۰٪ درآمد است.')}
                                        {insight.startsWith('high_spending_category') && t('analytics.insights.high_spend', 'بیشترین خرج شما در دسته {{cat}} است.', { cat: insight.split(':')[1] })}
                                        {insight === 'good_savings' && t('analytics.insights.good_savings', 'آفرین! شما پس‌انداز عالی دارید.')}
                                        {insight === 'stable_finances' && t('analytics.insights.stable', 'امور مالی شما بسیار باثبات است.')}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </motion.div>

                {/* Score Cards */}
                <div className="grid grid-cols-2 gap-3">
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}>
                        <BentoCard variant="glass" className="p-4 flex flex-col gap-2 relative overflow-hidden">
                            <div className="absolute top-[-20%] right-[-20%] w-16 h-16 bg-emerald-500/20 blur-xl rounded-full" />
                            <div className="flex items-center gap-2">
                                <TrendingUp className="w-4 h-4 text-emerald-400" />
                                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{t('analytics.income', 'درآمد کل')}</span>
                            </div>
                            <span className="text-lg font-bold text-emerald-400">{formatCurrency(analytics.totalIncome)}</span>
                        </BentoCard>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}>
                        <BentoCard variant="glass" className="p-4 flex flex-col gap-2 relative overflow-hidden">
                            <div className="absolute top-[-20%] left-[-20%] w-16 h-16 bg-red-500/20 blur-xl rounded-full" />
                            <div className="flex items-center gap-2">
                                <TrendingDown className="w-4 h-4 text-red-400" />
                                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{t('analytics.expense', 'هزینه کل')}</span>
                            </div>
                            <span className="text-lg font-bold text-red-400">{formatCurrency(analytics.totalExpense)}</span>
                        </BentoCard>
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 gap-3">
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }}>
                        <BentoCard variant="default" className="p-5 flex items-center justify-between bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border-purple-500/30">
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <Wallet className="w-4 h-4 text-purple-400" />
                                    <span className="text-[10px] text-gray-300 font-bold uppercase tracking-wider">{t('analytics.net', 'خالص پس‌انداز')}</span>
                                </div>
                                <span className="text-xl font-[900] text-white">{formatCurrency(analytics.netSavings)}</span>
                            </div>
                            <div className="text-right">
                                <span className="text-sm font-bold text-purple-300">
                                    {analytics.savingsRate.toFixed(1)}%
                                </span>
                                <p className="text-[10px] text-gray-400">{t('analytics.savings_rate', 'نرخ پس‌انداز')}</p>
                            </div>
                        </BentoCard>
                    </motion.div>
                </div>

                {/* Expenses Breakdown */}
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="space-y-4"
                >
                    <h3 className="text-sm font-bold text-white px-2 mt-8">{t('analytics.categories', 'دسته‌بندی هزینه‌ها')}</h3>
                    <BentoCard variant="glass" className="p-5">
                        <div className="h-48 mb-6 relative">
                            {analytics.categories.length === 0 ? (
                                <div className="absolute inset-0 flex items-center justify-center text-sm text-gray-500">
                                    دانه‌ای موجود نیست
                                </div>
                            ) : (
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={analytics.categories}
                                            innerRadius={60}
                                            outerRadius={80}
                                            paddingAngle={5}
                                            dataKey="amount"
                                            stroke="none"
                                        >
                                            {analytics.categories.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            contentStyle={{ backgroundColor: '#000000CC', border: '1px solid #333', borderRadius: '12px' }}
                                            itemStyle={{ color: '#fff', fontSize: '12px', fontWeight: 'bold' }}
                                            formatter={(value: number = 0) => [isPrivacyMode ? '•••' : `${value.toLocaleString()} ؋`, '']}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            )}

                            {/* Inner absolute text for center of donut */}
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none flex-col">
                                <span className="text-[10px] text-gray-500">{t('analytics.expense')}</span>
                                <span className="text-sm font-bold text-white">
                                    {formatCurrency(analytics.totalExpense)}
                                </span>
                            </div>
                        </div>

                        {/* Legend */}
                        <div className="space-y-3 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
                            {analytics.categories.map((cat, i) => (
                                <div key={i} className="flex items-center justify-between text-sm">
                                    <div className="flex items-center gap-3">
                                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} />
                                        <span className="text-gray-300">{cat.category}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="font-mono text-gray-400 text-xs">{cat.percentage.toFixed(0)}%</span>
                                        <span className="font-bold text-white tabular-nums ltr-nums text-xs">
                                            {formatCurrency(cat.amount)}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </BentoCard>
                </motion.div>

                {/* Cashflow Trend */}
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="space-y-4"
                >
                    <div className="flex items-center justify-between px-2 mt-8">
                        <h3 className="text-sm font-bold text-white">{t('analytics.trend', 'روند جریان نقدی')}</h3>
                        {/* Time filters */}
                        <div className="flex bg-white/5 rounded-full p-1 border border-white/5">
                            {(['week', 'month', '6months'] as const).map(tf => (
                                <button
                                    key={tf}
                                    onClick={() => setTimeframe(tf)}
                                    className={`px-3 py-1 text-[10px] font-bold rounded-full transition-all ${timeframe === tf ? 'bg-white/10 text-white' : 'text-gray-500'
                                        }`}
                                >
                                    {t(`analytics.filters.${tf}`, tf === 'week' ? 'هفته' : tf === 'month' ? 'ماه' : '۶ ماه')}
                                </button>
                            ))}
                        </div>
                    </div>

                    <BentoCard variant="glass" className="h-[250px] p-4 text-[10px] rtl-chart">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={analytics.weeklyData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="day" stroke="#4b5563" fontSize={10} tickLine={false} axisLine={false} dy={10} />
                                <YAxis stroke="#4b5563" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#000000CC', border: '1px solid #333', borderRadius: '12px' }}
                                    itemStyle={{ color: '#fff', fontSize: '12px', fontWeight: 'bold' }}
                                />
                                <Area type="monotone" dataKey="income" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorIncome)" name={t('analytics.income_lbl', 'درآمد')} />
                                <Area type="monotone" dataKey="expense" stroke="#ef4444" strokeWidth={2} fillOpacity={1} fill="url(#colorExpense)" name={t('analytics.expense_lbl', 'هزینه')} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </BentoCard>
                </motion.div>
            </div>
        </PageTransition>
    );
};
