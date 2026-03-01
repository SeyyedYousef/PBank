import React, { useState, useMemo } from 'react';
import { AreaChart, Area, ResponsiveContainer, Tooltip } from 'recharts';
import { TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { useFeedback } from '@/shared/hooks/useFeedback';
import { useWalletStore } from '@/store/walletStore';
import { useTranslation } from 'react-i18next';

export const ProfileStatsWidget = React.memo(() => {
    const { t } = useTranslation();
    const [range, setRange] = useState<'1W' | '1M' | '6M'>('1M');
    const { trigger } = useFeedback();
    const { transactions, balance } = useWalletStore();

    // Reconstruct balance history from transactions (Real Data Logic)
    const historyData = useMemo(() => {
        let currentBal = balance;
        const points = transactions.map(t => {
            const point = { value: currentBal, date: t.date };
            if (t.type === 'send') {
                currentBal += t.amount;
            } else if (t.type === 'receive' || t.type === 'deposit') {
                currentBal -= t.amount;
            }
            return point;
        });
        points.push({ value: currentBal, date: 'Start' });
        return points.reverse();
    }, [transactions, balance]);

    const getData = () => {
        const totalPoints = historyData.length;
        switch (range) {
            case '1W': return historyData.slice(Math.max(0, totalPoints - 7));
            case '1M': return historyData.slice(Math.max(0, totalPoints - 30));
            case '6M': return historyData;
            default: return historyData;
        }
    };

    const currentData = getData();
    const displayData = currentData.length > 0 ? currentData : [{ value: balance }];

    const lastValue = displayData[displayData.length - 1].value;
    const firstValue = displayData[0].value;
    const diff = lastValue - firstValue;
    const percentage = firstValue !== 0 ? ((diff / firstValue) * 100).toFixed(1) : 0;
    const isPositive = diff >= 0;



    const filters = [
        { id: '1W', label: t('profile.stats_widget.filters.1W') },
        { id: '1M', label: t('profile.stats_widget.filters.1M') },
        { id: '6M', label: t('profile.stats_widget.filters.6M') },
    ];

    const getRangeLabel = () => {
        switch (range) {
            case '1W': return t('profile.stats_widget.weekly');
            case '1M': return t('profile.stats_widget.monthly');
            case '6M': return t('profile.stats_widget.six_months');
            default: return '';
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 rounded-[32px] bg-gradient-to-br from-white/10 to-white/5 border border-white/10 overflow-hidden relative"
        >
            <div className="flex justify-between items-start mb-6 relative z-10">
                <div>
                    <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">
                        {t('profile.stats_widget.title')} {getRangeLabel()}
                    </h3>
                    <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-black text-white">
                            {lastValue.toLocaleString()} <span className="text-sm font-medium text-gray-500">{t('profile.stats_widget.currency')}</span>
                        </span>
                        <span className={`text-xs font-bold flex items-center gap-1 ${isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
                            <TrendingUp size={12} className={isPositive ? '' : 'rotate-180'} />
                            {isPositive ? '+' : ''}{percentage}٪
                        </span>
                    </div>
                </div>

                {/* Minimalist Ghost Filters */}
                <div className="flex gap-1">
                    {filters.map((f) => (
                        <button
                            key={f.id}
                            onClick={() => {
                                setRange(f.id as any);
                                trigger('click');
                            }}
                            aria-pressed={range === f.id}
                            aria-label={`نمایش آمار ${f.label}`}
                            className={`
                            px-3 py-1 rounded-full text-[10px] font-bold transition-all
                            ${range === f.id
                                    ? 'bg-white/10 text-emerald-400 border border-white/5 shadow-sm'
                                    : 'text-white/30 hover:text-white hover:bg-white/5'
                                }
                        `}
                        >
                            {f.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="h-32 w-full -mx-2 -mb-4">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={displayData}>
                        <defs>
                            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={isPositive ? "#10b981" : "#ef4444"} stopOpacity={0.3} />
                                <stop offset="95%" stopColor={isPositive ? "#10b981" : "#ef4444"} stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 2 }} />
                        <Area
                            type="monotone"
                            dataKey="value"
                            stroke={isPositive ? "#10b981" : "#ef4444"}
                            strokeWidth={3}
                            fillOpacity={1}
                            fill="url(#colorValue)"
                            animationDuration={1000}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </motion.div>
    );
});

import { TooltipProps } from 'recharts';

interface CustomTooltipProps extends TooltipProps<number, string> {
    payload?: any[];
}

const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-black/80 backdrop-blur-xl border border-white/10 p-2 rounded-lg shadow-xl">
                <p className="text-white font-mono text-sm">{`${payload[0].value.toLocaleString()} AFN`}</p>
            </div>
        );
    }
    return null;
};
