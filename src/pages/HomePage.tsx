import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PageTransition } from '@/shared/ui/PageTransition';
import { useAuthStore } from '@/store/authStore';
import { useWalletStore } from '@/store/walletStore';
import { usePrivacy } from '@/shared/context/PrivacyContext';
import { useNavigate } from 'react-router-dom';
import {
    Send, Download, Eye, EyeOff, Bell, ArrowUpRight, ArrowDownLeft,
    Smartphone, Zap, Plane, CreditCard, Sparkles, TrendingUp, ChevronRight, PieChart
} from 'lucide-react';
import { SkeletonPage } from '@/shared/ui/Skeleton';
import { useTranslation } from 'react-i18next';

import { AnimatedNumber } from '@/shared/ui/AnimatedNumber';

export const HomePage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const { balance, transactions } = useWalletStore();
    const { isPrivacyMode, togglePrivacy } = usePrivacy();
    const [greeting, setGreeting] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const hour = new Date().getHours();
        if (hour < 12) setGreeting(t('home.greeting.morning'));
        else if (hour < 17) setGreeting(t('home.greeting.afternoon'));
        else if (hour < 21) setGreeting(t('home.greeting.evening'));
        else setGreeting(t('home.greeting.night'));
    }, [t]);

    // Simulate initial data loading
    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 800);
        return () => clearTimeout(timer);
    }, []);

    const quickServices = [
        { id: 'mobile-credit', icon: Smartphone, label: t('home.services.charge'), color: 'text-blue-400', bg: 'bg-blue-500/15' },
        { id: 'electricity', icon: Zap, label: t('home.services.electricity'), color: 'text-amber-400', bg: 'bg-amber-500/15' },
        { id: 'flights', icon: Plane, label: t('home.services.flight'), color: 'text-emerald-400', bg: 'bg-emerald-500/15' },
        { id: 'taxes', icon: CreditCard, label: t('home.services.tax'), color: 'text-rose-400', bg: 'bg-rose-500/15' },
    ];

    const recentTx = transactions.slice(0, 4);

    return (
        <PageTransition className="pb-32 relative">
            {/* Top Bar */}
            <div className="sticky top-0 z-40 px-6 py-4 flex items-center justify-between backdrop-blur-xl bg-black/30 border-b border-white/5">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white font-bold text-sm ring-2 ring-primary/30 shadow-lg shadow-primary/20">
                        {user?.name?.[0] || 'P'}
                    </div>
                    <div>
                        <p className="text-[11px] text-gray-400 font-medium">{greeting} 👋</p>
                        <p className="text-sm font-bold text-white">{user?.name || t('home.guest_user')}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={togglePrivacy}
                        className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all border border-white/5"
                    >
                        {isPrivacyMode
                            ? <EyeOff className="w-4 h-4 text-gray-400" />
                            : <Eye className="w-4 h-4 text-primary-glow" />
                        }
                    </button>
                    <button
                        onClick={() => navigate('/notifications')}
                        className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all border border-white/5 relative"
                        aria-label={t('notifications.title')}
                    >
                        <Bell className="w-4 h-4 text-gray-400" />
                        <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                    </button>
                </div>
            </div>

            {isLoading ? (
                <div className="px-6 mt-6">
                    <SkeletonPage />
                </div>
            ) : (
                <div className="px-6 space-y-8 mt-6">
                    {/* Balance Card — Hero */}
                    <motion.div
                        initial={{ opacity: 0, y: 30, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        className="relative overflow-hidden rounded-[28px] p-6 omega-glass neon-border-primary"
                    >
                        {/* Animated gradient orbs */}
                        <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/20 blur-[60px] rounded-full animate-float" />
                        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-emerald-500/15 blur-[50px] rounded-full animate-float" style={{ animationDelay: '-3s' }} />

                        <div className="relative z-10">
                            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-3">
                                {t('home.balance')}
                            </p>
                            <div className="flex items-baseline gap-2 mb-1">
                                <AnimatedNumber value={balance} visible={!isPrivacyMode} className="text-4xl font-black tracking-tight" />
                                <span className="text-gray-500 text-sm font-medium">AFN</span>
                            </div>

                            <button onClick={() => navigate('/analytics')} className="flex items-center gap-2 mt-1 hover:bg-white/5 px-2 py-1 rounded-lg transition-colors -ml-2 rtl:-mr-2">
                                <span className="flex items-center gap-1 text-emerald-400 text-[11px] font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full">
                                    <TrendingUp className="w-3 h-3" />
                                    +۱۲.۵٪
                                </span>
                                <span className="flex items-center gap-1 text-gray-500 text-[10px] uppercase font-bold tracking-wider">
                                    <PieChart className="w-3 h-3" />
                                    {t('analytics.title', 'داشبورد مالی')}
                                </span>
                                <ChevronRight className="w-3 h-3 text-gray-600 rtl:rotate-180" />
                            </button>
                        </div>

                        {/* Quick Actions Row */}
                        <div className="relative z-10 flex gap-3 mt-6">
                            <button
                                onClick={() => navigate('/transfer')}
                                className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-primary hover:bg-primary/90 text-white font-bold text-sm transition-all shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 active:scale-95"
                            >
                                <Send className="w-4 h-4" />
                                {t('home.send')}
                            </button>
                            <button
                                onClick={() => navigate('/receive')}
                                className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-white/8 hover:bg-white/12 text-white font-bold text-sm transition-all border border-white/10 hover:border-white/20 active:scale-95"
                            >
                                <Download className="w-4 h-4" />
                                {t('home.receive_btn')}
                            </button>
                        </div>
                    </motion.div>

                    {/* Quick Services */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.6 }}
                    >
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-white font-bold text-base">{t('home.quick_access')}</h2>
                            <button
                                onClick={() => navigate('/services')}
                                className="text-primary text-xs font-bold flex items-center gap-1 hover:text-primary-glow transition-colors"
                            >
                                {t('home.all_services')}
                                <ChevronRight className="w-3 h-3 rtl:rotate-180" />
                            </button>
                        </div>
                        <div className="grid grid-cols-4 gap-3">
                            {quickServices.map((svc, i) => (
                                <motion.button
                                    key={svc.id}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.3 + i * 0.08 }}
                                    onClick={() => navigate(`/services/${svc.id}`)}
                                    className="flex flex-col items-center gap-2 py-4 rounded-2xl omega-glass-card group"
                                >
                                    <div className={`w-11 h-11 rounded-xl ${svc.bg} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                                        <svc.icon className={`w-5 h-5 ${svc.color}`} />
                                    </div>
                                    <span className="text-[11px] font-bold text-gray-400 group-hover:text-white transition-colors">
                                        {svc.label}
                                    </span>
                                </motion.button>
                            ))}
                        </div>
                    </motion.div>

                    {/* Promo Banner */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.6 }}
                        className="relative overflow-hidden rounded-2xl p-5 bg-gradient-to-r from-violet-600/20 via-purple-600/15 to-primary/20 border border-white/10"
                    >
                        <div className="absolute -right-6 -top-6 w-24 h-24 bg-primary/30 blur-[40px] rounded-full" />
                        <div className="relative z-10 flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center flex-shrink-0">
                                <Sparkles className="w-6 h-6 text-primary-glow" />
                            </div>
                            <div className="flex-1">
                                <p className="text-white font-bold text-sm">{t('home.promo_title')}</p>
                                <p className="text-gray-400 text-[11px] mt-0.5">{t('home.promo_subtitle')}</p>
                            </div>
                            <ChevronRight className="w-5 h-5 text-gray-500 rtl:rotate-180" />
                        </div>
                    </motion.div>

                    {/* Recent Transactions */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.6 }}
                    >
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-white font-bold text-base">{t('home.recent_transactions')}</h2>
                            <button
                                onClick={() => navigate('/history')}
                                className="text-primary text-xs font-bold flex items-center gap-1 hover:text-primary-glow transition-colors"
                            >
                                {t('home.all')}
                                <ChevronRight className="w-3 h-3 rtl:rotate-180" />
                            </button>
                        </div>

                        <div className="omega-glass rounded-[24px] overflow-hidden divide-y divide-white/5">
                            <AnimatePresence>
                                {recentTx.length === 0 ? (
                                    <div className="p-8 text-center">
                                        <p className="text-gray-500 text-sm">{t('home.no_transactions')}</p>
                                    </div>
                                ) : (
                                    recentTx.map((tx, i) => (
                                        <motion.div
                                            key={tx.id}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.6 + i * 0.05 }}
                                            onClick={() => navigate(`/transaction/${tx.id}`)}
                                            className="flex items-center justify-between p-4 hover:bg-white/5 transition-colors cursor-pointer"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${tx.type === 'send'
                                                    ? 'bg-red-500/15'
                                                    : 'bg-emerald-500/15'
                                                    }`}>
                                                    {tx.type === 'send'
                                                        ? <ArrowUpRight className="w-5 h-5 text-red-400" />
                                                        : <ArrowDownLeft className="w-5 h-5 text-emerald-400" />
                                                    }
                                                </div>
                                                <div>
                                                    <p className="text-white font-bold text-sm">
                                                        {t(`history.tx_names.${tx.name}`, tx.name)}
                                                    </p>
                                                    <p className="text-gray-500 text-[11px]">
                                                        {tx.date === 'today' ? t('history.today', 'امروز') : tx.date === 'yesterday' ? t('history.yesterday', 'دیروز') : tx.date} • {tx.time}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-left">
                                                <p className={`font-bold text-sm tabular-nums ltr-nums ${tx.type === 'send' ? 'text-red-400' : 'text-emerald-400'
                                                    }`}>
                                                    {tx.type === 'send' ? '-' : '+'}{tx.amount.toLocaleString()}
                                                </p>
                                                <p className="text-gray-600 text-[10px]">AFN</p>
                                            </div>
                                        </motion.div>
                                    ))
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>
                </div>
            )}
        </PageTransition>
    );
};
