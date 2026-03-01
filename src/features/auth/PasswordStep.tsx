import React, { useState } from 'react';
import { KeyRound, Eye, EyeOff, ShieldAlert, ArrowRight, Fingerprint } from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';

interface PasswordStepProps {
    onSubmit: (password: string) => void;
    isLoading?: boolean;
}

export const PasswordStep: React.FC<PasswordStepProps> = ({ onSubmit, isLoading }) => {
    const { t } = useTranslation();
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isFocused, setIsFocused] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (password.length >= 4) onSubmit(password);
    };

    // Password strength indicator
    const strength = password.length === 0 ? 0
        : password.length < 4 ? 1
            : password.length < 8 ? 2
                : 3;

    const strengthColors = ['', 'bg-red-500', 'bg-amber-500', 'bg-emerald-500'];
    const strengthLabels = ['', t('auth.password.strength.weak'), t('auth.password.strength.medium'), t('auth.password.strength.strong')];

    return (
        <div className="flex flex-col h-full justify-between py-10 px-6 overflow-hidden relative">
            {/* Background */}
            <div className="absolute top-[-20%] left-[-10%] w-[400px] h-[400px] bg-red-500/8 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-[-20%] right-[-15%] w-[300px] h-[300px] bg-primary/10 blur-[100px] rounded-full pointer-events-none" />

            <div className="flex-1 flex flex-col items-center justify-center -mt-8">
                <div className="w-full max-w-sm space-y-8">
                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center space-y-3"
                    >
                        {/* Icon */}
                        <div className="inline-flex items-center justify-center mb-4 relative">
                            <motion.div
                                animate={{
                                    scale: [1, 1.3, 1],
                                    opacity: [0.2, 0.4, 0.2],
                                }}
                                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                                className="absolute inset-0 bg-gradient-to-tr from-red-500/25 to-orange-500/15 rounded-full blur-2xl"
                            />
                            <div className="relative w-20 h-20 rounded-[24px] bg-gradient-to-br from-red-500/15 to-red-600/5 border border-red-500/15 flex items-center justify-center backdrop-blur-xl shadow-xl">
                                <ShieldAlert className="w-9 h-9 text-red-400 drop-shadow-[0_0_15px_rgba(239,68,68,0.4)]" />
                            </div>
                        </div>

                        <h2 className="text-3xl font-[900] text-white tracking-tight">
                            {t('auth.password.title', 'تایید هویت دو مرحله‌ای')}
                        </h2>
                        <p className="text-gray-400 text-sm font-medium leading-relaxed">
                            {t('auth.password.label', 'رمز عبور دوم خود را وارد کنید')}
                        </p>
                    </motion.div>

                    {/* Password Input */}
                    <motion.form
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15 }}
                        onSubmit={handleSubmit}
                        className="space-y-5"
                    >
                        <div className="relative group">
                            {/* Glow border */}
                            <motion.div
                                animate={{ opacity: isFocused ? 0.4 : 0 }}
                                className="absolute -inset-[2px] bg-gradient-to-r from-red-500/50 via-orange-500/30 to-red-500/50 rounded-[22px] blur-sm transition-opacity"
                            />

                            <div
                                className={`relative flex items-center bg-[#0a0a14]/90 backdrop-blur-3xl border rounded-[20px] overflow-hidden transition-all duration-500 ${isFocused
                                    ? 'border-white/15 shadow-[0_0_30px_rgba(239,68,68,0.08)]'
                                    : 'border-white/[0.06]'
                                    }`}
                            >
                                {/* Lock icon */}
                                <div className="flex items-center justify-center px-5">
                                    <KeyRound className="w-5 h-5 text-gray-600" />
                                </div>

                                {/* Input */}
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder={t('auth.password.placeholder', '••••••••')}
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    onFocus={() => setIsFocused(true)}
                                    onBlur={() => setIsFocused(false)}
                                    className="flex-1 h-16 bg-transparent text-lg font-bold text-white placeholder:text-gray-700 outline-none tracking-wider"
                                    autoFocus
                                />

                                {/* Toggle visibility */}
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="px-5 text-gray-500 hover:text-white transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        {/* Password Strength Bar */}
                        <AnimatePresence>
                            {password.length > 0 && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="space-y-2"
                                >
                                    <div className="flex gap-1.5">
                                        {[1, 2, 3].map(level => (
                                            <div key={level} className="flex-1 h-1 rounded-full bg-white/[0.06] overflow-hidden">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: strength >= level ? '100%' : '0%' }}
                                                    className={`h-full rounded-full ${strengthColors[level]} transition-colors`}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                    <p className={`text-[10px] font-bold text-right ${strength === 1 ? 'text-red-400' : strength === 2 ? 'text-amber-400' : 'text-emerald-400'
                                        }`}>
                                        {strengthLabels[strength]}
                                    </p>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Forgot Password */}
                        <div className="text-right">
                            <button type="button" className="text-sm text-primary/80 hover:text-primary transition-colors font-medium">
                                {t('auth.password.forgot', 'رمز عبور را فراموش کردم')}
                            </button>
                        </div>
                    </motion.form>

                    {/* Biometric hint */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="flex items-center justify-center gap-2 text-gray-600 text-xs"
                    >
                        <Fingerprint className="w-4 h-4" />
                        <span>{t('auth.password.biometric_hint')}</span>
                    </motion.div>
                </div>
            </div>

            {/* Submit Button */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                className="w-full max-w-sm mx-auto z-10"
            >
                <Button
                    onClick={() => password.length >= 4 && onSubmit(password)}
                    className={`w-full h-[60px] text-lg font-bold rounded-2xl transition-all duration-500 ${password.length >= 4
                        ? 'bg-gradient-to-r from-red-500 to-orange-600 shadow-[0_8px_30px_rgba(239,68,68,0.3)] hover:shadow-[0_12px_40px_rgba(239,68,68,0.5)] opacity-100'
                        : 'bg-white/[0.04] text-gray-600 cursor-not-allowed opacity-60'
                        }`}
                    disabled={password.length < 4 || isLoading}
                    isLoading={isLoading}
                >
                    <span className="flex items-center gap-3 justify-center">
                        {t('auth.password.submit', 'ورود به حساب')}
                        <ArrowRight className="w-5 h-5 rtl:rotate-180" />
                    </span>
                </Button>
            </motion.div>
        </div>
    );
};
