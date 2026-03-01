import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Fingerprint, Lock, ShieldCheck, Check } from 'lucide-react';
import { usePrivacy } from '@/shared/context/PrivacyContext';
import { useTranslation } from 'react-i18next';
import { Logo } from '@/shared/ui/Logo';

export const AppLockScreen = () => {
    const { t } = useTranslation();
    const { biometricEnabled } = usePrivacy();

    // We only lock if biometrics are enabled AND the app went to background then foreground
    const [isLocked, setIsLocked] = useState(false);
    const [status, setStatus] = useState<'idle' | 'scanning' | 'success' | 'failed'>('idle');

    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.hidden) {
                // App went to background
                if (biometricEnabled) {
                    setIsLocked(true);
                    setStatus('idle');
                }
            } else {
                // App came to foreground
                // We're already locked from the 'hidden' event, trigger biometric scan if applicable
                if (isLocked && biometricEnabled && status === 'idle') {
                    handleUnlock();
                }
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
    }, [biometricEnabled, isLocked, status]);

    const handleUnlock = () => {
        setStatus('scanning');
        // Native biometric call would go here. For PWA demo, simulate delay.
        setTimeout(() => {
            setStatus('success');
            setTimeout(() => {
                setIsLocked(false);
                setStatus('idle');
            }, 800);
        }, 1500);
    };

    if (!isLocked) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: 50, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05, filter: 'blur(10px)' }}
                transition={{ type: 'spring', damping: 20, stiffness: 200 }}
                className="fixed inset-0 z-[9999] bg-[#030108] flex flex-col items-center justify-between py-20 px-6 backdrop-blur-3xl safe-area-y"
            >
                {/* Background ambient glow */}
                <div className="absolute top-[20%] right-[-10%] w-64 h-64 bg-primary/20 blur-[100px] rounded-full pointer-events-none" />
                <div className="absolute bottom-[20%] left-[-10%] w-64 h-64 bg-emerald-500/10 blur-[100px] rounded-full pointer-events-none" />

                <div className="flex flex-col items-center space-y-6 flex-1 justify-center z-10 w-full relative">
                    <Logo animated={false} size="lg" />

                    <div className="text-center mt-6 space-y-2">
                        <h2 className="text-2xl font-bold text-white flex items-center justify-center gap-2">
                            <Lock className="w-5 h-5 text-primary" />
                            {t('applock.title', 'برنامه قفل شده است')}
                        </h2>
                        <p className="text-sm text-gray-400">
                            {t('applock.subtitle', 'برای ورود به PBank، هویت خود را تایید کنید')}
                        </p>
                    </div>

                    <div className="mt-16 relative">
                        {status === 'idle' || status === 'failed' ? (
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleUnlock}
                                className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center relative overflow-hidden ring-1 ring-primary/40 group cursor-pointer shadow-[0_0_30px_rgba(124,58,237,0.3)]"
                            >
                                <div className="absolute inset-0 bg-primary/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                                <Fingerprint className={`w-12 h-12 relative z-10 ${status === 'failed' ? 'text-red-500' : 'text-primary'}`} />
                            </motion.button>
                        ) : status === 'scanning' ? (
                            <motion.div
                                key="scanning"
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center relative"
                            >
                                <div className="absolute inset-0 rounded-full border-4 border-primary/30 animate-[ping_1.5s_cubic-bezier(0,0,0.2,1)_infinite]" />
                                <div className="absolute top-0 left-0 w-full h-[2px] bg-primary shadow-[0_0_15px_rgba(124,58,237,1)] animate-[scan_2s_linear_infinite]" />
                                <Fingerprint className="w-12 h-12 text-primary" />
                            </motion.div>
                        ) : (
                            <motion.div
                                key="success"
                                initial={{ scale: 0.5, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="w-24 h-24 rounded-full bg-emerald-500 flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.5)]"
                            >
                                <Check className="w-12 h-12 text-white" strokeWidth={3} />
                            </motion.div>
                        )}

                        {status === 'failed' && (
                            <motion.p
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-red-400 text-xs text-center mt-6 font-bold absolute -bottom-10 left-1/2 -translate-x-1/2 w-full whitespace-nowrap"
                            >
                                {t('applock.failed', 'اثر انگشت شناسایی نشد. مجدد تلاش کنید.')}
                            </motion.p>
                        )}
                    </div>
                </div>

                <div className="z-10 text-center w-full flex flex-col items-center">
                    <button
                        onClick={() => window.location.href = '/onboarding'}
                        className="text-sm font-bold text-gray-500 hover:text-white transition-colors mb-6"
                    >
                        {t('applock.use_pin', 'ورود با پین کد')}
                    </button>
                    <div className="flex items-center justify-center gap-2 text-primary">
                        <ShieldCheck className="w-4 h-4" />
                        <span className="text-[10px] uppercase font-bold tracking-widest text-primary/70">Secured Session</span>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
};
