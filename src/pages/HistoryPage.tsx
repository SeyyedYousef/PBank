import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PageTransition } from '@/shared/ui/PageTransition';
import { useWalletStore, Transaction } from '@/store/walletStore';
import { usePrivacy } from '@/shared/context/PrivacyContext';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { SkeletonPage } from '@/shared/ui/Skeleton';
import { EmptyState } from '@/shared/ui/EmptyState';
import {
    ArrowUpRight, ArrowDownLeft, Download as DepositIcon,
    Search, Calendar, X
} from 'lucide-react';

type FilterType = 'all' | 'send' | 'receive' | 'deposit';

export const HistoryPage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { transactions } = useWalletStore();
    const { isPrivacyMode } = usePrivacy();
    const [filter, setFilter] = useState<FilterType>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [showSearch, setShowSearch] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 200);
        return () => clearTimeout(timer);
    }, []);

    const filters: { id: FilterType; label: string; color: string }[] = [
        { id: 'all', label: t('history.filters.all', 'همه'), color: 'text-white' },
        { id: 'send', label: t('history.filters.send', 'ارسال'), color: 'text-red-400' },
        { id: 'receive', label: t('history.filters.receive', 'دریافت'), color: 'text-emerald-400' },
        { id: 'deposit', label: t('history.filters.deposit', 'واریز'), color: 'text-blue-400' },
    ];

    const filteredTx = useMemo(() => {
        let result = transactions;
        if (filter !== 'all') result = result.filter(tx => tx.type === filter);
        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            result = result.filter(tx =>
                t(`history.tx_names.${tx.name}`, tx.name).toLowerCase().includes(q) ||
                t(`history.tx_titles.${tx.title}`, tx.title).toLowerCase().includes(q) ||
                tx.tracking.includes(q)
            );
        }
        return result;
    }, [transactions, filter, searchQuery, t]);

    // Group by date
    const grouped = useMemo(() => {
        const map = new Map<string, Transaction[]>();
        filteredTx.forEach(tx => {
            const key = tx.date;
            if (!map.has(key)) map.set(key, []);
            map.get(key)!.push(tx);
        });
        return Array.from(map.entries());
    }, [filteredTx]);

    const getTxIcon = (type: string) => {
        switch (type) {
            case 'send': return <ArrowUpRight className="w-5 h-5 text-red-400" />;
            case 'receive': return <ArrowDownLeft className="w-5 h-5 text-emerald-400" />;
            case 'deposit': return <DepositIcon className="w-5 h-5 text-blue-400" />;
            default: return null;
        }
    };

    const getTxBg = (type: string) => {
        switch (type) {
            case 'send': return 'bg-red-500/15';
            case 'receive': return 'bg-emerald-500/15';
            case 'deposit': return 'bg-blue-500/15';
            default: return 'bg-white/10';
        }
    };

    // Summary stats
    const totalSent = transactions.filter(t => t.type === 'send').reduce((s, tx) => s + tx.amount, 0);
    const totalReceived = transactions.filter(t => t.type === 'receive' || t.type === 'deposit').reduce((s, tx) => s + tx.amount, 0);

    return (
        <PageTransition className="pb-32">
            {/* Header */}
            <div className="sticky top-0 z-40 px-6 py-4 backdrop-blur-xl bg-black/30 border-b border-white/5">
                <div className="flex items-center justify-between">
                    <h1 className="text-lg font-bold text-white">{t('history.title')}</h1>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setShowSearch(!showSearch)}
                            className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all border border-white/5"
                        >
                            {showSearch ? <X className="w-4 h-4 text-gray-400" /> : <Search className="w-4 h-4 text-gray-400" />}
                        </button>
                    </div>
                </div>

                {/* Search Bar */}
                <AnimatePresence>
                    {showSearch && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                        >
                            <div className="pt-3">
                                <div className="relative">
                                    <Search className="absolute end-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                    <input
                                        type="text"
                                        placeholder={t('history.search', 'جستجو در تراکنش‌ها...')}
                                        value={searchQuery}
                                        onChange={e => setSearchQuery(e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pe-11 ps-4 text-sm text-white placeholder-gray-500 outline-none focus:border-primary/50 transition-colors text-start"
                                        autoFocus
                                    />
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <div className="px-6 space-y-6 mt-4">
                {/* Summary Cards */}
                <div className="grid grid-cols-2 gap-3">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="omega-glass rounded-2xl p-4"
                    >
                        <p className="text-gray-400 text-[11px] font-bold uppercase tracking-wider mb-2">{t('history.sent', 'ارسال شده')}</p>
                        <p className="text-red-400 font-bold text-xl tabular-nums ltr-nums text-start">
                            {isPrivacyMode ? '•••' : `-${totalSent.toLocaleString()}`}
                        </p>
                        <p className="text-gray-600 text-[10px] text-start">AFN</p>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="omega-glass rounded-2xl p-4"
                    >
                        <p className="text-gray-400 text-[11px] font-bold uppercase tracking-wider mb-2">{t('history.received', 'دریافت شده')}</p>
                        <p className="text-emerald-400 font-bold text-xl tabular-nums ltr-nums text-start">
                            {isPrivacyMode ? '•••' : `+${totalReceived.toLocaleString()}`}
                        </p>
                        <p className="text-gray-600 text-[10px] text-start">AFN</p>
                    </motion.div>
                </div>

                {/* Filter Tabs */}
                <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
                    {filters.map(f => (
                        <button
                            key={f.id}
                            onClick={() => setFilter(f.id)}
                            className={`
                                px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap
                                ${filter === f.id
                                    ? 'bg-white/10 border border-white/15 text-white shadow-sm'
                                    : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'
                                }
                            `}
                        >
                            {f.label}
                        </button>
                    ))}
                </div>

                {/* Transaction List */}
                <div className="space-y-6">
                    {isLoading ? (
                        <SkeletonPage />
                    ) : grouped.length === 0 ? (
                        <EmptyState
                            preset="transactions"
                            title={t('history.empty_title', 'تاریخچه تراکنش‌ها خالی است')}
                            description={t('history.empty', 'هیچ تراکنشی یافت نشد. می‌توانید با ارسال یا دریافت پول شروع کنید.')}
                            icon={Calendar}
                        />
                    ) : (
                        grouped.map(([date, txs], gi) => (
                            <motion.div
                                key={date}
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: gi * 0.05 }}
                            >
                                <p className="text-gray-500 text-[11px] font-bold uppercase tracking-wider mb-3 px-1 text-start">
                                    {date === 'today' ? t('history.today', 'امروز') : date === 'yesterday' ? t('history.yesterday', 'دیروز') : date}
                                </p>
                                <div className="omega-glass rounded-[20px] overflow-hidden divide-y divide-white/5">
                                    {txs.map((tx, i) => (
                                        <motion.div
                                            key={tx.id}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: gi * 0.05 + i * 0.03 }}
                                            onClick={() => navigate(`/transaction/${tx.id}`)}
                                            className="flex items-center justify-between p-4 hover:bg-white/5 transition-colors cursor-pointer group"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${getTxBg(tx.type)} group-hover:scale-105 transition-transform`}>
                                                    {getTxIcon(tx.type)}
                                                </div>
                                                <div className="min-w-0 text-start">
                                                    <p className="text-white font-bold text-sm truncate">{t(`history.tx_names.${tx.name}`, tx.name)}</p>
                                                    <p className="text-gray-500 text-[11px] truncate">{t(`history.tx_titles.${tx.title}`, tx.title)} • {tx.time}</p>
                                                </div>
                                            </div>
                                            <div className="flex-shrink-0 ms-3 text-end">
                                                <p className={`font-bold text-sm tabular-nums ltr-nums ${tx.type === 'send' ? 'text-red-400' : 'text-emerald-400'
                                                    }`}>
                                                    {isPrivacyMode ? '•••' : `${tx.type === 'send' ? '-' : '+'}${tx.amount.toLocaleString()}`}
                                                </p>
                                                <p className="text-gray-600 text-[10px] font-mono">#{tx.tracking.slice(-4)}</p>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>
                        ))
                    )}
                </div>
            </div>
        </PageTransition>
    );
};
