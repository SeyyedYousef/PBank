import { useState, useRef, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { useWalletStore } from '@/store/walletStore';
import { usePrivacy } from '@/shared/context/PrivacyContext';
import { useGamification } from '@/shared/context/GamificationContext';

import {
    User, LogOut, Check, Eye, EyeOff, Edit2, Crown, Shield,
    Sparkles, BarChart3, Settings2
} from 'lucide-react';
import { motion, useMotionValue, useSpring, AnimatePresence } from 'framer-motion';
import { PageTransition } from '@/shared/ui/PageTransition';
import { SkeletonProfile } from '@/shared/ui/Skeleton';
import { useSound } from '@/shared/hooks/useSound';
import { ProfileEditModal } from '@/features/profile/ProfileEditModal';
import { useTranslation } from 'react-i18next';
import { AnalyticsSection } from '@/features/profile/components/AnalyticsSection';
import { SecuritySection } from '@/features/profile/components/SecuritySection';
import { SettingsSection } from '@/features/profile/components/SettingsSection';
import { AnimatedNumber } from '@/shared/ui/AnimatedNumber';

// ═══════════════════════════════════════════════
// MAIN PROFILE PAGE
// ═══════════════════════════════════════════════
export const ProfilePage = () => {
    const { t } = useTranslation();
    const { logout, user } = useAuthStore();
    const { balance } = useWalletStore();
    const { playClick } = useSound();
    const { isPrivacyMode, togglePrivacy } = usePrivacy();
    const { level, xp, nextLevelXp, tierName } = useGamification();
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [imgError, setImgError] = useState(false);
    const [activeSection, setActiveSection] = useState<'analytics' | 'security' | 'settings'>('analytics');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 200);
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
        { id: 'analytics', label: t('profile.stats_widget.title', 'تحلیل'), icon: BarChart3 },
        { id: 'security', label: t('settings.security', 'امنیت'), icon: Shield },
        { id: 'settings', label: t('settings.title', 'تنظیمات'), icon: Settings2 },
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

                                    <div className="mb-4">
                                        <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-1">{t('home.balance', 'موجودی')}</p>
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
                            {activeSection === 'analytics' && <AnalyticsSection key="analytics" />}

                            {/* ── SECURITY HUB ── */}
                            {activeSection === 'security' && <SecuritySection key="security" />}

                            {/* ── SETTINGS ── */}
                            {activeSection === 'settings' && <SettingsSection key="settings" />}
                        </AnimatePresence>

                        <ProfileEditModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} />
                    </>
                )}
            </div>
        </PageTransition >
    );
};
