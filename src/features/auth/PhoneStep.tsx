import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Smartphone, ArrowRight, ShieldCheck } from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import { useTranslation } from 'react-i18next';

interface PhoneStepProps {
    onSubmit: (phone: string) => void;
}

export const PhoneStep: React.FC<PhoneStepProps> = ({ onSubmit }) => {
    const { t } = useTranslation();
    const [phone, setPhone] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isFocused, setIsFocused] = useState(false);

    const formatPhone = (value: string) => {
        const digits = value.replace(/\D/g, '');
        if (digits.startsWith('0')) {
            const truncated = digits.slice(0, 10);
            if (truncated.length > 7) return `${truncated.slice(0, 4)} ${truncated.slice(4, 7)} ${truncated.slice(7)}`;
            if (truncated.length > 4) return `${truncated.slice(0, 4)} ${truncated.slice(4)}`;
            return truncated;
        }
        const truncated = digits.slice(0, 9);
        if (truncated.length > 6) return `${truncated.slice(0, 3)} ${truncated.slice(3, 6)} ${truncated.slice(6)}`;
        if (truncated.length > 3) return `${truncated.slice(0, 3)} ${truncated.slice(3)}`;
        return truncated;
    };

    const isValid = () => {
        const raw = phone.replace(/\s/g, '');
        if (raw.startsWith('0')) return raw.length === 10 && raw[1] === '7';
        return raw.length === 9 && raw.startsWith('7');
    };

    const handleSubmit = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        let rawPhone = phone.replace(/\s/g, '');
        if (rawPhone.startsWith('0')) rawPhone = rawPhone.substring(1);
        if (rawPhone.length === 9 && rawPhone.startsWith('7')) {
            setIsLoading(true);
            setTimeout(() => {
                onSubmit(rawPhone);
                setIsLoading(false);
            }, 600);
        }
    };

    return (
        <div className="flex flex-col h-full justify-between py-10 px-6 overflow-hidden relative">
            {/* Background */}
            <div className="absolute top-[-20%] left-[-20%] w-[350px] h-[350px] bg-primary/15 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-[-15%] right-[-15%] w-[300px] h-[300px] bg-cyan-500/10 blur-[100px] rounded-full pointer-events-none" />

            <div className="flex-1 flex flex-col items-center justify-center -mt-8">
                <div className="w-full max-w-sm space-y-8">
                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center space-y-3"
                    >
                        {/* Icon */}
                        <div className="inline-flex items-center justify-center mb-4 relative">
                            <motion.div
                                animate={{
                                    scale: [1, 1.3, 1],
                                    opacity: [0.3, 0.5, 0.3],
                                }}
                                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                                className="absolute inset-0 bg-gradient-to-tr from-primary/30 to-cyan-500/20 rounded-full blur-2xl"
                            />
                            <div className="relative w-20 h-20 rounded-[24px] bg-gradient-to-br from-white/[0.08] to-white/[0.02] border border-white/[0.08] flex items-center justify-center backdrop-blur-xl shadow-xl">
                                <Smartphone className="w-9 h-9 text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]" />
                            </div>
                        </div>

                        <h2 className="text-3xl font-[900] text-white tracking-tight">
                            {t('auth.phone.label', 'شماره موبایل')}
                        </h2>
                        <p className="text-gray-400 text-sm font-medium leading-relaxed">
                            {t('auth.phone.subtitle', 'شماره تلفن خود را وارد کنید')}
                        </p>
                    </motion.div>

                    {/* Phone Input */}
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15 }}
                        className="relative group"
                    >
                        {/* Glow border */}
                        <motion.div
                            animate={{
                                opacity: isFocused ? 0.5 : 0,
                            }}
                            className="absolute -inset-[2px] bg-gradient-to-r from-primary via-cyan-500 to-primary rounded-[22px] blur-sm transition-opacity"
                        />

                        <div
                            className={`relative flex items-center bg-[#0a0a14]/90 backdrop-blur-3xl border rounded-[20px] p-1.5 shadow-2xl transition-all duration-500 ${isFocused
                                ? 'border-white/20 shadow-[0_0_30px_rgba(127,0,255,0.1)]'
                                : 'border-white/[0.06]'
                                }`}
                            dir="ltr"
                        >
                            {/* Country prefix */}
                            <div className="flex items-center justify-center gap-2.5 pl-5 pr-4 py-4 bg-white/[0.03] rounded-l-[16px] border-r border-white/[0.05]">
                                <span className="text-2xl">🇦🇫</span>
                                <span className="font-mono text-lg font-bold text-white/80 tracking-wider">+93</span>
                            </div>

                            {/* Separator */}
                            <div className="w-px h-10 bg-gradient-to-b from-transparent via-white/15 to-transparent mx-2" />

                            {/* Input */}
                            <input
                                type="text"
                                inputMode="numeric"
                                placeholder="07xx xxx xxx"
                                value={phone}
                                onChange={(e) => setPhone(formatPhone(e.target.value))}
                                onFocus={() => setIsFocused(true)}
                                onBlur={() => setIsFocused(false)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                                className="flex-1 h-14 bg-transparent text-xl font-bold tracking-[0.12em] text-white placeholder:text-gray-700 placeholder:tracking-normal placeholder:text-lg pl-3 pr-4 outline-none"
                                autoFocus
                                dir="ltr"
                            />

                            {/* Valid indicator */}
                            {isValid() && (
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="mr-3 w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center"
                                >
                                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                                </motion.div>
                            )}
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Bottom section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="w-full max-w-sm mx-auto space-y-5 z-10"
            >
                <Button
                    onClick={() => handleSubmit()}
                    className={`w-full h-[60px] text-lg font-bold rounded-2xl transition-all duration-500 ${isValid()
                        ? 'bg-gradient-to-r from-primary to-purple-600 shadow-[0_8px_30px_rgba(127,0,255,0.4)] hover:shadow-[0_12px_40px_rgba(127,0,255,0.6)] opacity-100'
                        : 'bg-white/[0.04] text-gray-600 cursor-not-allowed opacity-60'
                        }`}
                    disabled={!isValid()}
                    isLoading={isLoading}
                >
                    <span className="flex items-center gap-3 justify-center">
                        {t('auth.phone.submit')}
                        <ArrowRight className="w-5 h-5 rtl:rotate-180" />
                    </span>
                </Button>

                <p className="text-center text-[10px] text-gray-600 font-medium flex items-center justify-center gap-1.5">
                    <ShieldCheck className="w-3 h-3" />
                    {t('auth.phone.secure')}
                </p>
            </motion.div>
        </div>
    );
};
