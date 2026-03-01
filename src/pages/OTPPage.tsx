import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/Input';
import { useAuthStore } from '../store/authStore';
import { useTranslation } from 'react-i18next';

export const OTPPage = () => {
    const { t } = useTranslation();
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [resendTimer, setResendTimer] = useState(59);
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useAuthStore();

    const phone = location.state?.phone || 'Unknown';

    useEffect(() => {
        // Auto-fill for prototype demo
        const timer = setTimeout(() => {
            setOtp('88888');
        }, 1000);
        return () => clearTimeout(timer);
    }, []);

    // Resend timer countdown
    useEffect(() => {
        if (resendTimer <= 0) return;
        const interval = setInterval(() => setResendTimer(prev => prev - 1), 1000);
        return () => clearInterval(interval);
    }, [resendTimer]);

    const handleResend = () => {
        if (resendTimer <= 0) {
            setResendTimer(59);
            setOtp('');
            setError('');
            // In production, this would re-send the OTP
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        if (otp === '88888') {
            setTimeout(() => {
                login(phone);
                navigate('/');
            }, 800);
        } else {
            setLoading(false);
            setError(t('auth.otp.error_demo'));
        }
    };

    return (
        <div className="min-h-screen bg-background text-white p-6 font-sans">
            <div className="max-w-md mx-auto space-y-8 mt-10">
                <div className="text-center space-y-2">
                    <h1 className="text-2xl font-bold">{t('auth.otp.title_verify')}</h1>
                    <p className="text-gray-400 text-sm">{t('auth.otp.subtitle', { phone })}</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <Input
                        placeholder="- - - - -"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        className="text-center text-3xl tracking-[1em] font-mono h-20"
                        error={error}
                        maxLength={5}
                        dir="ltr"
                    />

                    <Button type="submit" className="w-full" isLoading={loading}>
                        {t('auth.otp.login')}
                    </Button>
                </form>

                {/* Resend Button with Timer */}
                <div className="text-center">
                    <button
                        onClick={handleResend}
                        className={`text-sm font-medium flex items-center justify-center gap-2 w-full transition-colors ${resendTimer <= 0
                                ? 'text-primary hover:text-white cursor-pointer'
                                : 'text-gray-600 cursor-not-allowed'
                            }`}
                        disabled={resendTimer > 0}
                    >
                        <span>{t('auth.otp.resend')}</span>
                        {resendTimer > 0 && (
                            <span className="bg-white/5 px-2.5 py-1 rounded-lg text-xs font-mono text-gray-500 tabular-nums">
                                {Math.floor(resendTimer / 60)}:{String(resendTimer % 60).padStart(2, '0')}
                            </span>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};
