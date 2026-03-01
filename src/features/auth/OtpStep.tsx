import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Lock, Edit2, CheckCircle2 } from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';

interface OtpStepProps {
    phone: string;
    onSubmit: (otp: string) => void;
    onEditPhone: () => void;
}

export const OtpStep: React.FC<OtpStepProps> = ({ phone, onSubmit, onEditPhone }) => {
    const { t } = useTranslation();
    const [otp, setOtp] = useState(['', '', '', '', '']);
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const [isVerified, setIsVerified] = useState(false);
    const [resendTimer, setResendTimer] = useState(59);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    useEffect(() => {
        inputRefs.current[0]?.focus();
    }, []);

    // Resend timer countdown
    useEffect(() => {
        if (resendTimer <= 0) return;
        const interval = setInterval(() => setResendTimer(prev => prev - 1), 1000);
        return () => clearInterval(interval);
    }, [resendTimer]);

    const handleVerify = useCallback((code: string) => {
        setIsLoading(true);
        // Valid code is 88888 for demo purposes
        if (code !== '88888') {
            setTimeout(() => {
                setIsLoading(false);
                setIsError(true);
                setOtp(['', '', '', '', '']);
                inputRefs.current[0]?.focus();
            }, 600);
            return;
        }
        // Success animation then proceed
        setTimeout(() => {
            setIsLoading(false);
            setIsError(false);
            setIsVerified(true);
            setTimeout(() => onSubmit(code), 600);
        }, 800);
    }, [onSubmit]);

    const handleChange = (index: number, value: string) => {
        if (value.length > 1) value = value[0];
        if (isError) setIsError(false);

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (value && index < 4) {
            inputRefs.current[index + 1]?.focus();
        }

        if (index === 4 && value && newOtp.every(d => d !== '')) {
            handleVerify(newOtp.join(''));
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 5);
        if (pasted.length === 5) {
            const digits = pasted.split('');
            setOtp(digits);
            inputRefs.current[4]?.focus();
            handleVerify(pasted);
        }
    };

    const allFilled = otp.every(d => d !== '');

    return (
        <div className="flex flex-col h-full justify-between py-10 px-6 overflow-hidden relative">
            {/* Background */}
            <div className="absolute top-[-20%] right-[-20%] w-[350px] h-[350px] bg-violet-600/12 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-[-20%] left-[-20%] w-[300px] h-[300px] bg-primary/10 blur-[100px] rounded-full pointer-events-none" />

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
                                    opacity: [0.3, 0.5, 0.3],
                                }}
                                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                                className="absolute inset-0 bg-gradient-to-tr from-violet-500/30 to-primary/20 rounded-full blur-2xl"
                            />
                            <AnimatePresence mode="wait">
                                {isVerified ? (
                                    <motion.div
                                        key="verified"
                                        initial={{ scale: 0, rotate: -180 }}
                                        animate={{ scale: 1, rotate: 0 }}
                                        className="relative w-20 h-20 rounded-[24px] bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 border border-emerald-500/20 flex items-center justify-center backdrop-blur-xl"
                                    >
                                        <CheckCircle2 className="w-9 h-9 text-emerald-400 drop-shadow-[0_0_15px_rgba(52,211,153,0.5)]" />
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="lock"
                                        className="relative w-20 h-20 rounded-[24px] bg-gradient-to-br from-white/[0.08] to-white/[0.02] border border-white/[0.08] flex items-center justify-center backdrop-blur-xl shadow-xl"
                                    >
                                        <Lock className="w-9 h-9 text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]" />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        <h2 className="text-3xl font-[900] text-white tracking-tight">
                            {isVerified ? t('auth.otp.verified') : t('auth.otp.title')}
                        </h2>

                        <div className="flex items-center justify-center gap-2.5 text-gray-400 text-sm font-medium">
                            <span dir="ltr" className="text-gray-300 font-mono">+93 {phone}</span>
                            <button
                                onClick={onEditPhone}
                                className="text-primary/80 hover:text-primary transition-colors bg-primary/10 hover:bg-primary/20 p-1.5 rounded-lg"
                            >
                                <Edit2 className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    </motion.div>

                    {/* OTP Inputs */}
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={
                            isError
                                ? { opacity: 1, y: 0, x: [-12, 12, -12, 12, 0] }
                                : { opacity: 1, y: 0 }
                        }
                        transition={isError ? { duration: 0.4 } : { delay: 0.15 }}
                        className="flex justify-center gap-3"
                        dir="ltr"
                        onPaste={handlePaste}
                    >
                        {otp.map((digit, idx) => (
                            <div key={idx} className="relative group">
                                {/* Individual glow */}
                                <motion.div
                                    animate={{
                                        opacity: digit ? 0.6 : 0,
                                    }}
                                    className={`absolute -inset-1 rounded-2xl blur-sm transition-all ${isError
                                        ? 'bg-red-500/40 opacity-100'
                                        : isVerified
                                            ? 'bg-emerald-500/30'
                                            : 'bg-gradient-to-b from-primary/30 to-violet-500/30'
                                        }`}
                                />
                                <input
                                    ref={el => { inputRefs.current[idx] = el; }}
                                    type="text"
                                    inputMode="numeric"
                                    maxLength={1}
                                    value={digit}
                                    onChange={e => handleChange(idx, e.target.value)}
                                    onKeyDown={e => handleKeyDown(idx, e)}
                                    className={`relative w-[60px] h-[72px] rounded-2xl bg-[#0a0a14]/90 backdrop-blur-2xl border text-center text-3xl font-bold shadow-xl transition-all duration-300 outline-none ${isError
                                        ? 'border-red-500/60 text-red-400 shadow-[0_0_20px_rgba(239,68,68,0.2)]'
                                        : isVerified
                                            ? 'border-emerald-500/40 text-emerald-400 shadow-[0_0_20px_rgba(52,211,153,0.15)]'
                                            : digit
                                                ? 'border-primary/40 text-white scale-[1.03] shadow-[0_0_20px_rgba(127,0,255,0.15)]'
                                                : 'border-white/[0.06] text-gray-500 focus:border-white/20 focus:text-white focus:scale-[1.03]'
                                        }`}
                                />
                            </div>
                        ))}
                    </motion.div>

                    {/* Error message */}
                    <AnimatePresence>
                        {isError && (
                            <motion.p
                                initial={{ opacity: 0, y: -5 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                className="text-center text-red-400 text-sm font-bold"
                            >
                                {t('auth.otp.error_demo', 'کد وارد شده صحیح نیست (88888)')}
                            </motion.p>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Bottom */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="w-full max-w-sm mx-auto space-y-5 z-10"
            >
                <Button
                    onClick={() => handleVerify(otp.join(''))}
                    className={`w-full h-[60px] text-lg font-bold rounded-2xl transition-all duration-500 ${allFilled
                        ? 'bg-gradient-to-r from-violet-500 to-primary shadow-[0_8px_30px_rgba(168,85,247,0.4)] opacity-100'
                        : 'bg-white/[0.04] text-gray-600 cursor-not-allowed opacity-60'
                        }`}
                    disabled={!allFilled}
                    isLoading={isLoading}
                >
                    {t('auth.otp.submit', 'تایید کد')}
                </Button>

                <button
                    onClick={() => resendTimer <= 0 && setResendTimer(59)}
                    className={`w-full text-sm font-medium flex items-center justify-center gap-2 transition-colors ${resendTimer <= 0
                        ? 'text-primary hover:text-white cursor-pointer'
                        : 'text-gray-600 cursor-not-allowed'
                        }`}
                    disabled={resendTimer > 0}
                >
                    <span>{t('auth.otp.resend', 'ارسال مجدد کد')}</span>
                    {resendTimer > 0 && (
                        <span className="bg-white/5 px-2.5 py-1 rounded-lg text-xs font-mono text-gray-500 tabular-nums">
                            {Math.floor(resendTimer / 60)}:{String(resendTimer % 60).padStart(2, '0')}
                        </span>
                    )}
                </button>
            </motion.div>
        </div>
    );
};
