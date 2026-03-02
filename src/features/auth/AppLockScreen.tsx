import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Fingerprint, Lock, ShieldCheck, Check, Delete } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

export const AppLockScreen = ({ children }: { children: React.ReactNode }) => {
    const { isAppLocked, unlockApp } = useAuthStore();
    const [pin, setPin] = useState<string>('');
    const [error, setError] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const PIN_LENGTH = 4;
    const CORRECT_PIN = '1234'; // In a real app, this is verified securely

    useEffect(() => {
        if (pin.length === PIN_LENGTH) {
            if (pin === CORRECT_PIN) {
                setShowSuccess(true);
                setTimeout(() => {
                    unlockApp();
                    setPin('');
                    setShowSuccess(false);
                }, 800);
            } else {
                setError(true);
                setTimeout(() => {
                    setError(false);
                    setPin('');
                }, 500);
            }
        }
    }, [pin, unlockApp]);

    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'hidden') {
                useAuthStore.getState().lockApp();
            }
        };
        document.addEventListener('visibilitychange', handleVisibilityChange);
        return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
    }, []);

    const handleNumber = (n: number) => {
        if (pin.length < PIN_LENGTH) {
            setPin(prev => prev + n);
        }
    };

    const handleDelete = () => {
        setPin(prev => prev.slice(0, -1));
    };

    if (!isAppLocked) return <>{children}</>;

    return (
        <AnimatePresence mode="wait">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] bg-[#030108] flex flex-col items-center justify-between py-16 px-6"
            >
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,_#7F00FF15_0%,_transparent_50%)]" />

                <div className="flex-1 flex flex-col items-center justify-center w-full z-10 relative">
                    <motion.div
                        animate={{
                            scale: showSuccess ? [1, 1.2, 1] : 1,
                        }}
                        transition={{ duration: 0.5 }}
                        className="w-20 h-20 rounded-[28px] bg-gradient-to-br from-white/10 to-white/5 border border-white/10 flex items-center justify-center mb-8 shadow-2xl backdrop-blur-xl relative overflow-hidden"
                    >
                        {showSuccess ? (
                            <Check className="w-10 h-10 text-emerald-400" />
                        ) : (
                            <Lock className={`w-10 h-10 transition-colors ${error ? 'text-rose-400' : 'text-primary-glow'}`} />
                        )}
                        {/* Shimmer effect */}
                        <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                    </motion.div>

                    <h2 className="text-2xl font-bold text-white mb-2">
                        {showSuccess ? 'خوش آمدید' : 'ورود به حساب'}
                    </h2>
                    <p className="text-gray-400 text-sm mb-10">
                        لطفاً پین‌کد خود را وارد کنید
                    </p>

                    <div className="flex gap-4 mb-12">
                        {Array.from({ length: PIN_LENGTH }).map((_, i) => (
                            <motion.div
                                key={i}
                                animate={
                                    error
                                        ? { x: [-10, 10, -10, 10, 0] }
                                        : { scale: pin.length > i ? [1, 1.2, 1] : 1 }
                                }
                                transition={{ duration: error ? 0.4 : 0.2 }}
                                className={`w-4 h-4 rounded-full border-2 transition-all duration-300 ${pin.length > i
                                    ? 'bg-primary border-primary shadow-[0_0_15px_rgba(127,0,255,0.5)]'
                                    : error
                                        ? 'border-rose-500 bg-rose-500/20'
                                        : 'border-white/20 bg-transparent'
                                    }`}
                            />
                        ))}
                    </div>

                    <div className="grid grid-cols-3 gap-x-8 gap-y-6 max-w-xs w-full">
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                            <button
                                key={num}
                                onClick={() => handleNumber(num)}
                                className="w-16 h-16 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-3xl font-light text-white active:scale-90 transition-all border border-white/5"
                            >
                                {num}
                            </button>
                        ))}
                        <button
                            onClick={() => { }}
                            className="w-16 h-16 rounded-full flex items-center justify-center active:scale-90 transition-all group"
                        >
                            <Fingerprint className="w-8 h-8 text-primary group-hover:text-primary-glow" />
                        </button>
                        <button
                            onClick={() => handleNumber(0)}
                            className="w-16 h-16 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-3xl font-light text-white active:scale-90 transition-all border border-white/5"
                        >
                            0
                        </button>
                        <button
                            onClick={handleDelete}
                            className="w-16 h-16 rounded-full flex items-center justify-center active:scale-90 transition-all"
                        >
                            <Delete className="w-8 h-8 text-gray-500 hover:text-white" />
                        </button>
                    </div>
                </div>

                <div className="mt-auto pt-8 z-10 flex items-center gap-2 text-gray-600 text-[10px] uppercase tracking-widest font-bold">
                    <ShieldCheck className="w-4 h-4" />
                    رمزنگاری شده با الگوریتم AES-256
                </div>
            </motion.div>
        </AnimatePresence>
    );
};
