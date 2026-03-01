import { useState, useRef, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { useWalletStore } from '@/store/walletStore';
import { usePrivacy } from '@/shared/context/PrivacyContext';
import { useGamification } from '@/shared/context/GamificationContext';
import {
    User, LogOut, Check, Eye, EyeOff, Edit2, Crown, Shield,
    TrendingUp, TrendingDown, ChevronRight, Globe, Moon, Bell,
    Key, Smartphone, Fingerprint, Lock, Sparkles, BarChart3,
    Wallet, ArrowUpRight, ArrowDownLeft, Settings2
} from 'lucide-react';
import { motion, useMotionValue, useSpring, AnimatePresence } from 'framer-motion';
import { PageTransition } from '@/shared/ui/PageTransition';
import { SkeletonProfile } from '@/shared/ui/Skeleton';
import { useSound } from '@/shared/hooks/useSound';
import { ProfileEditModal } from '@/features/profile/ProfileEditModal';
import { useTranslation } from 'react-i18next';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';

import { AnimatedNumber } from '@/shared/ui/AnimatedNumber';
import { ProgressRing } from '@/shared/ui/ProgressRing';
import { SecurityToggleSwitch } from '@/shared/ui/SecurityToggleSwitch';

// ═══════════════════════════════════════════════
// MAIN PROFILE PAGE
// ═══════════════════════════════════════════════
export const ProfilePage = () => {
    const { t } = useTranslation();
    const { logout, user } = useAuthStore();
    const { balance, transactions } = useWalletStore();
    const { playClick } = useSound();
    const { isPrivacyMode, togglePrivacy, biometricEnabled, toggleBiometric, incognitoKeyboardEnabled, toggleIncognitoKeyboard, geoFencingEnabled, toggleGeoFencing } = usePrivacy();
    const { level, xp, nextLevelXp, tierName } = useGamification();
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [imgError, setImgError] = useState(false);
    const [activeSection, setActiveSection] = useState<'analytics' | 'security' | 'settings'>('analytics');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 600);
        return () => clearTimeout(timer);
    }, []);

    // 3D Card tilt
    const cardRef = useRef<HTMLDivElement>(null);
    const rotateX = useMotionValue(0);
    const rotateY = useMotionValue(0);
    const springX = useSpring(rotateX, { stiffness: 200, damping: 20 });
    const springY = useSpring(rotateY, { stiffness: 200, damping: 20 });

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        rotateX.set(y * -15);
        rotateY.set(x * 15);
    };

    const handleMouseLeave = () => {
        rotateX.set(0);
        rotateY.set(0);
    };

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
        { name: 'خرید', amount: 2100, color: '#7F00FF', percent: 35 },
        { name: 'قبوض', amount: 1800, color: '#00E8DB', percent: 30 },
        { name: 'تفریح', amount: 900, color: '#BF55EC', percent: 15 },
        { name: 'حمل‌ونقل', amount: 700, color: '#FFC700', percent: 12 },
        { name: 'سایر', amount: 500, color: '#FF2E63', percent: 8 },
    ];

    // Financial health score
    const savingsRatio = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome * 100) : 50;
    const healthScore = Math.round(Math.max(0, Math.min(100, savingsRatio + 50)));
    const healthColor = healthScore >= 70 ? '#00FF94' : healthScore >= 40 ? '#FFC700' : '#FF2E63';

    // Tier badge
    const getTierGlow = () => {
        switch (tierName) {
            case 'پلاتینیوم': return 'from-slate-400 to-white shadow-[0_0_30px_rgba(200,200,200,0.3)]';
            case 'طلایی': return 'from-yellow-400 to-amber-500 shadow-[0_0_30px_rgba(255,199,0,0.3)]';
            case 'نقره‌ای': return 'from-gray-300 to-gray-500 shadow-[0_0_30px_rgba(180,180,180,0.2)]';
            default: return 'from-blue-400 to-primary shadow-[0_0_30px_rgba(127,0,255,0.3)]';
        }
    };

    const sectionTabs = [
        { id: 'analytics', label: 'تحلیل', icon: BarChart3 },
        { id: 'security', label: 'امنیت', icon: Shield },
        { id: 'settings', label: 'تنظیمات', icon: Settings2 },
    ] as const;

    return (
        <PageTransition className="min-h-screen relative overflow-x-hidden bg-black pb-32">
            {/* Background Orbs */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute -top-[20%] left-[10%] w-[300px] h-[300px] bg-primary/10 blur-[60px] rounded-full" />
                <div className="absolute top-[10%] -right-[10%] w-[250px] h-[250px] bg-purple-500/10 blur-[50px] rounded-full" />
            </div>

            {/* Sticky Header */}
            <div className="sticky top-0 z-50 px-6 py-4 flex justify-between items-center backdrop-blur-xl bg-black/30 border-b border-white/5">
                <h1 className="text-sm font-bold text-gray-400 uppercase tracking-widest">{t('profile.title')}</h1>
                <div className="flex items-center gap-2">
                    <button
                        className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all border border-white/5"
                        onClick={() => { togglePrivacy(); playClick(); }}
                    >
                        {isPrivacyMode ? <EyeOff className="w-4 h-4 text-gray-400" /> : <Eye className="w-4 h-4 text-primary-glow" />}
                    </button>
                    <button
                        onClick={logout}
                        className="w-10 h-10 rounded-full bg-red-500/10 hover:bg-red-500/20 flex items-center justify-center transition-all border border-red-500/20 text-red-500"
                    >
                        <LogOut className="w-4 h-4" />
                    </button>
                </div>
            </div>

            <div className="px-6 relative z-10 space-y-8 mt-4">
                {isLoading ? (
                    <SkeletonProfile />
                ) : (
                    <>
                        {/* ═══ THE HERO CARD — 3D Tilt ═══ */}
                        <div className="perspective-card">
                            <motion.div
                                ref={cardRef}
                                onMouseMove={handleMouseMove}
                                onMouseLeave={handleMouseLeave}
                                style={{
                                    rotateX: springX,
                                    rotateY: springY,
                                }}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                                className="perspective-card-inner relative overflow-hidden rounded-[28px] p-6 omega-glass-heavy neon-border-primary"
                            >
                                {/* Animated gradient background */}
                                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-purple-500/10 animate-gradient-shift opacity-50" />
                                <div className="absolute -top-12 -right-12 w-32 h-32 bg-primary/20 blur-[50px] rounded-full" />
                                <div className="absolute -bottom-8 -left-8 w-28 h-28 bg-emerald-500/15 blur-[40px] rounded-full" />

                                <div className="relative z-10">
                                    {/* Top row */}
                                    <div className="flex items-start justify-between mb-6">
                                        <div className="flex items-center gap-4">
                                            {/* Avatar */}
                                            <div
                                                className="relative group cursor-pointer"
                                                onClick={() => setIsEditModalOpen(true)}
                                            >
                                                <div className="absolute inset-0 bg-gradient-to-tr from-primary via-emerald-400 to-primary-glow rounded-full blur-lg opacity-40 group-hover:opacity-60 transition-opacity" />
                                                <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-gray-800 to-black p-0.5 relative z-10 ring-2 ring-white/10 overflow-hidden">
                                                    {user?.avatar && !imgError ? (
                                                        <img src={user.avatar} alt="Profile" className="w-full h-full object-cover rounded-full" onError={() => setImgError(true)} />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/30 to-purple-900/30 rounded-full">
                                                            <User className="w-8 h-8 text-white/50" />
                                                        </div>
                                                    )}
                                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
                                                        <Edit2 className="w-5 h-5 text-white" />
                                                    </div>
                                                </div>
                                                {/* Verified */}
                                                <div className="absolute -bottom-0.5 -right-0.5 w-6 h-6 rounded-full bg-emerald-500 border-2 border-black flex items-center justify-center z-20 shadow-lg">
                                                    <Check className="w-3 h-3 text-white stroke-[3px]" />
                                                </div>
                                            </div>

                                            <div>
                                                <h2 className="text-xl font-black text-white tracking-tight">
                                                    {isPrivacyMode ? '•••••' : (user?.name || 'کاربر مهمان')}
                                                </h2>
                                                <p className="text-gray-400 font-mono text-xs bg-white/5 px-2 py-0.5 rounded-full inline-block mt-1">
                                                    @{user?.username || 'username'}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Tier Badge — Glowing */}
                                        <div className={`px-3 py-1.5 rounded-full bg-gradient-to-r ${getTierGlow()} flex items-center gap-1.5`}>
                                            <Crown className="w-3.5 h-3.5 text-white" />
                                            <span className="text-white text-[10px] font-black uppercase tracking-wider">{tierName}</span>
                                        </div>
                                    </div>

                                    {/* Balance */}
                                    <div className="mb-4">
                                        <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-1">موجودی</p>
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-3xl font-black text-white">
                                                <AnimatedNumber value={balance} visible={!isPrivacyMode} />
                                            </span>
                                            <span className="text-gray-500 text-sm">AFN</span>
                                        </div>
                                    </div>

                                    {/* Level Progress */}
                                    <div className="flex items-center gap-3">
                                        <div className="flex-1">
                                            <div className="flex justify-between text-[10px] mb-1.5">
                                                <span className="text-gray-500 font-mono">Lv.{level}</span>
                                                <span className="text-gray-600 font-mono">{xp}/{nextLevelXp} XP</span>
                                            </div>
                                            <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                                                <motion.div
                                                    className="h-full bg-gradient-to-r from-primary to-emerald-400 rounded-full relative"
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${(xp / nextLevelXp) * 100}%` }}
                                                    transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                                                >
                                                    <div className="absolute top-0 right-0 h-full w-3 bg-white/40 blur-[3px]" />
                                                </motion.div>
                                            </div>
                                        </div>
                                        <Sparkles className="w-4 h-4 text-primary-glow" />
                                    </div>
                                </div>
                            </motion.div>
                        </div>

                        {/* ═══ SECTION TABS ═══ */}
                        <div className="flex p-1 bg-white/5 rounded-2xl border border-white/5">
                            {sectionTabs.map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => { setActiveSection(tab.id); playClick(); }}
                                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl transition-all text-xs font-bold ${activeSection === tab.id
                                        ? 'bg-white/10 text-white shadow-sm'
                                        : 'text-gray-500 hover:text-gray-300'
                                        }`}
                                >
                                    <tab.icon className="w-3.5 h-3.5" />
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        {/* ═══ SECTION CONTENT ═══ */}
                        <AnimatePresence mode="wait">
                            {/* ── ANALYTICS DASHBOARD ── */}
                            {activeSection === 'analytics' && (
                                <motion.div
                                    key="analytics"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="space-y-6"
                                >
                                    {/* Balance Chart */}
                                    <div className="omega-glass rounded-[24px] p-5 space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-gray-400 text-[10px] font-bold uppercase tracking-wider">روند موجودی</p>
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
                                                <span className="text-gray-400 text-[10px] font-bold uppercase">درآمد</span>
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
                                                <span className="text-gray-400 text-[10px] font-bold uppercase">هزینه</span>
                                            </div>
                                            <p className="text-red-400 font-black text-lg">
                                                {isPrivacyMode ? '•••' : `-${totalExpenses.toLocaleString()}`}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Spending Breakdown */}
                                    <div className="omega-glass rounded-[24px] p-5 space-y-4">
                                        <p className="text-gray-400 text-[10px] font-bold uppercase tracking-wider">خلاصه هزینه‌ها</p>
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
                                        <p className="text-gray-400 text-[10px] font-bold uppercase tracking-wider mb-4">سلامت مالی</p>
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
                            )}

                            {/* ── SECURITY HUB ── */}
                            {activeSection === 'security' && (
                                <motion.div
                                    key="security"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="space-y-6"
                                >
                                    {/* Security Score */}
                                    <div className="omega-glass rounded-[24px] p-5 relative overflow-hidden scan-line-overlay">
                                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent" />
                                        <div className="relative z-10">
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                                                        <Shield className="w-5 h-5 text-emerald-400" />
                                                    </div>
                                                    <div>
                                                        <p className="text-white font-bold text-sm">مرکز امنیت</p>
                                                        <p className="text-gray-500 text-[10px]">سطح حفاظت حساب</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/20">
                                                    <Shield className="w-3 h-3 text-emerald-400" />
                                                    <span className="text-emerald-400 text-[10px] font-black">
                                                        {[biometricEnabled, incognitoKeyboardEnabled, geoFencingEnabled].filter(Boolean).length + 1}/4
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Security level bar */}
                                            <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                                                <motion.div
                                                    className="h-full bg-gradient-to-r from-emerald-500 to-emerald-300 rounded-full"
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${(([biometricEnabled, incognitoKeyboardEnabled, geoFencingEnabled].filter(Boolean).length + 1) / 4) * 100}%` }}
                                                    transition={{ duration: 1 }}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Security Toggles */}
                                    <div className="omega-glass rounded-[24px] overflow-hidden divide-y divide-white/5">
                                        {[
                                            {
                                                icon: <Fingerprint className={biometricEnabled ? 'text-emerald-400' : 'text-gray-500'} />,
                                                title: 'اثر انگشت / Face ID',
                                                desc: 'تایید بیومتریک برای هر تراکنش',
                                                enabled: biometricEnabled,
                                                onToggle: toggleBiometric,
                                            },
                                            {
                                                icon: <Lock className={incognitoKeyboardEnabled ? 'text-emerald-400' : 'text-gray-500'} />,
                                                title: 'کیبورد امن',
                                                desc: 'صفحه‌کلید تصادفی داخلی',
                                                enabled: incognitoKeyboardEnabled,
                                                onToggle: toggleIncognitoKeyboard,
                                            },
                                            {
                                                icon: <Globe className={geoFencingEnabled ? 'text-emerald-400' : 'text-gray-500'} />,
                                                title: 'محدودیت جغرافیایی',
                                                desc: 'قفل خودکار خارج از مرزها',
                                                enabled: geoFencingEnabled,
                                                onToggle: toggleGeoFencing,
                                            },
                                        ].map((item, i) => (
                                            <motion.div
                                                key={i}
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: i * 0.08 }}
                                                className="flex items-center justify-between p-4 hover:bg-white/5 transition-colors"
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/5">
                                                        {item.icon}
                                                    </div>
                                                    <div>
                                                        <p className="text-white font-bold text-sm">{item.title}</p>
                                                        <p className="text-gray-500 text-[10px]">{item.desc}</p>
                                                    </div>
                                                </div>
                                                <SecurityToggleSwitch enabled={item.enabled} onToggle={() => { item.onToggle(); playClick(); }} />
                                            </motion.div>
                                        ))}
                                    </div>

                                    {/* Active Sessions */}
                                    <div className="omega-glass rounded-[24px] p-5 space-y-4">
                                        <div className="flex items-center justify-between">
                                            <p className="text-gray-400 text-[10px] font-bold uppercase tracking-wider">نشست‌های فعال</p>
                                            <span className="bg-emerald-500/15 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-full">3 دستگاه</span>
                                        </div>

                                        {/* Mini Map */}
                                        <div className="w-full h-36 bg-gradient-to-br from-blue-900/20 to-purple-900/10 rounded-2xl border border-white/10 relative overflow-hidden">
                                            <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 200 100" preserveAspectRatio="none">
                                                <path d="M0 100 L30 70 L60 85 L90 60 L120 75 L150 50 L180 65 L200 40 L200 100 Z" fill="currentColor" className="text-blue-500/30" />
                                            </svg>

                                            {/* Device pins */}
                                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                                                <div className="relative">
                                                    <div className="w-3.5 h-3.5 rounded-full bg-emerald-500 animate-ping absolute inset-0" />
                                                    <div className="w-3.5 h-3.5 rounded-full bg-emerald-500 relative z-10 border-2 border-white shadow" />
                                                </div>
                                                <span className="text-[8px] font-bold text-white mt-1 bg-black/60 px-1.5 rounded">کابل</span>
                                            </div>
                                            <div className="absolute top-1/3 left-1/4 flex flex-col items-center opacity-60">
                                                <div className="w-2.5 h-2.5 rounded-full bg-gray-400 border border-white shadow" />
                                                <span className="text-[7px] text-gray-400 mt-0.5">مشهد</span>
                                            </div>
                                            <div className="absolute top-2/3 right-1/4 flex flex-col items-center opacity-40">
                                                <div className="w-2.5 h-2.5 rounded-full bg-gray-500 border border-white shadow" />
                                                <span className="text-[7px] text-gray-500 mt-0.5">شیراز</span>
                                            </div>
                                        </div>

                                        {/* Session list */}
                                        <div className="space-y-2">
                                            {[
                                                { name: 'iPhone 15 Pro', location: 'کابل', status: 'فعال', active: true },
                                                { name: 'Windows 11', location: 'مشهد', status: '۲ ساعت پیش', active: false },
                                                { name: 'Samsung S21', location: 'شیراز', status: '۵ روز پیش', active: false },
                                            ].map((session, i) => (
                                                <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                                                    <div className="flex items-center gap-3">
                                                        <Smartphone className={`w-4 h-4 ${session.active ? 'text-emerald-400' : 'text-gray-500'}`} />
                                                        <div>
                                                            <p className="text-white text-xs font-bold">{session.name}</p>
                                                            <p className="text-gray-500 text-[10px]">{session.location}</p>
                                                        </div>
                                                    </div>
                                                    <span className={`text-[10px] font-bold ${session.active ? 'text-emerald-400' : 'text-gray-600'}`}>
                                                        {session.active && <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1 animate-pulse" />}
                                                        {session.status}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* ── SETTINGS ── */}
                            {activeSection === 'settings' && (
                                <motion.div
                                    key="settings"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="space-y-6"
                                >
                                    {/* Language Switcher */}
                                    <div className="omega-glass rounded-[24px] p-5 space-y-4">
                                        <p className="text-gray-400 text-[10px] font-bold uppercase tracking-wider">زبان برنامه</p>
                                        <div className="grid grid-cols-3 gap-3">
                                            {[
                                                { code: 'fa', name: 'فارسی', flag: '🇮🇷' },
                                                { code: 'en', name: 'English', flag: '🇺🇸' },
                                                { code: 'ps', name: 'پشتو', flag: '🇦🇫' },
                                            ].map(lang => (
                                                <button
                                                    key={lang.code}
                                                    className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all group"
                                                >
                                                    <span className="text-3xl group-hover:scale-125 transition-transform">{lang.flag}</span>
                                                    <span className="text-white text-xs font-bold">{lang.name}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Theme Switcher */}
                                    <div className="omega-glass rounded-[24px] p-5 space-y-4">
                                        <p className="text-gray-400 text-[10px] font-bold uppercase tracking-wider">تم برنامه</p>
                                        <div className="grid grid-cols-3 gap-3">
                                            {[
                                                { id: 'dark', name: 'تاریک', icon: Moon, gradient: 'from-gray-900 to-black', active: true },
                                                { id: 'light', name: 'روشن', icon: Sparkles, gradient: 'from-gray-200 to-white', active: false },
                                                { id: 'cyber', name: 'سایبرپانک', icon: Sparkles, gradient: 'from-purple-900 to-primary', active: false },
                                            ].map(theme => (
                                                <button
                                                    key={theme.id}
                                                    className={`relative overflow-hidden flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all ${theme.active
                                                        ? 'border-primary/40 bg-primary/10 shadow-lg shadow-primary/10'
                                                        : 'border-white/10 bg-white/5 hover:bg-white/10'
                                                        }`}
                                                >
                                                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${theme.gradient} flex items-center justify-center border border-white/10`}>
                                                        <theme.icon className="w-5 h-5 text-white" />
                                                    </div>
                                                    <span className="text-white text-xs font-bold">{theme.name}</span>
                                                    {theme.active && (
                                                        <div className="absolute top-2 left-2 w-3 h-3 rounded-full bg-primary flex items-center justify-center">
                                                            <Check className="w-2 h-2 text-white" />
                                                        </div>
                                                    )}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* More Settings */}
                                    <div className="omega-glass rounded-[24px] overflow-hidden divide-y divide-white/5">
                                        {[
                                            { icon: <Bell className="text-blue-400" />, title: 'اعلان‌ها', desc: 'مدیریت نوتیفیکیشن‌ها' },
                                            { icon: <Key className="text-amber-400" />, title: 'تغییر رمز عبور', desc: 'به‌روزرسانی رمز امنیتی' },
                                            { icon: <Wallet className="text-emerald-400" />, title: 'حساب‌های بانکی', desc: 'حساب‌های متصل' },
                                        ].map((item, i) => (
                                            <motion.button
                                                key={i}
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: i * 0.05 }}
                                                className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors text-right"
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/5">
                                                        {item.icon}
                                                    </div>
                                                    <div>
                                                        <p className="text-white font-bold text-sm">{item.title}</p>
                                                        <p className="text-gray-500 text-[10px]">{item.desc}</p>
                                                    </div>
                                                </div>
                                                <ChevronRight className="w-4 h-4 text-gray-600 rtl:rotate-180" />
                                            </motion.button>
                                        ))}
                                    </div>

                                    <div className="text-center py-4">
                                        <p className="text-gray-700 text-[10px] font-mono">PBank v2.0.0 • Build 2026.02</p>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <ProfileEditModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} />
                    </>
                )}
            </div>
        </PageTransition >
    );
};
