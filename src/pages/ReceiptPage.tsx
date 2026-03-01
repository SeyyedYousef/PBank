import { motion } from 'framer-motion';
import { Check, Home, Share2, Download, Copy, CheckCircle2, ShieldCheck } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { BentoCard } from '@/shared/ui/BentoCard';
import { Button } from '@/shared/ui/Button';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { SuccessAnimation } from '@/shared/ui/SuccessAnimation';

export const ReceiptPage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();
    const [copied, setCopied] = useState(false);
    const {
        amount = 0,
        recipient = t('common.unknown'),
        message = '',
        date = new Date().toLocaleDateString('fa-IR'),
        time = new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })
    } = location.state || {};

    const [showAnimation, setShowAnimation] = useState(true);

    const trackingCode = `PB-${Date.now().toString(36).toUpperCase().slice(-6)}`;

    const copyTracking = () => {
        navigator.clipboard.writeText(trackingCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const shareReceipt = async () => {
        const text = `${t('receipt.title')}\n---\n${t('receipt.total_amount')}: ${Number(amount).toLocaleString()} ؋\n${t('receipt.recipient')}: ${recipient}\n${date} - ${time}\n${t('receipt.tracking')}: ${trackingCode}`;
        if (navigator.share) {
            try { await navigator.share({ title: 'PBank Receipt', text }); } catch { /* cancelled */ }
        } else {
            navigator.clipboard.writeText(text);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-6 min-h-screen flex flex-col justify-between pb-10"
        >
            <SuccessAnimation
                show={showAnimation}
                onComplete={() => setShowAnimation(false)}
                title={t('receipt.success')}
                subtitle={`${amount.toLocaleString()} ؋`}
            />

            <div className="flex-1 flex flex-col items-center justify-center space-y-8">
                {/* Success Animation Container */}
                <div className="relative">
                    <motion.div
                        animate={{ scale: [1, 1.4, 1], opacity: [0.2, 0.4, 0.2] }}
                        transition={{ duration: 3, repeat: Infinity }}
                        className="absolute inset-0 bg-emerald-500/20 blur-[80px] rounded-full"
                    />
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.2 }}
                        className="w-28 h-28 rounded-full bg-gradient-to-tr from-[#00FF94] to-[#00C070] flex items-center justify-center shadow-[0_0_50px_rgba(0,255,148,0.5)] relative z-10"
                    >
                        <motion.div
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ delay: 0.5, duration: 0.5 }}
                        >
                            <Check className="w-14 h-14 text-[#05040A] stroke-[3]" />
                        </motion.div>
                    </motion.div>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-center space-y-2"
                >
                    <h1 className="text-2xl font-bold text-white">{t('receipt.success')}</h1>
                    <p className="text-success text-lg font-medium tracking-wide">{date} - {time}</p>
                </motion.div>

                {/* Receipt Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="w-full max-w-sm"
                >
                    <BentoCard variant="glass" className="p-6 space-y-5 border-white/20 bg-white/5 relative overflow-hidden">
                        {/* Top edge */}
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent" />

                        <div className="space-y-4">
                            <div className="flex justify-between items-center pb-4 border-b border-white/10">
                                <span className="text-gray-400 text-sm">{t('receipt.total_amount')}</span>
                                <span className="text-2xl font-[900] text-white tracking-tight">
                                    {Number(amount).toLocaleString()} <span className="text-sm font-normal text-gray-400">؋</span>
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-400 text-sm">{t('receipt.recipient')}</span>
                                <span className="font-bold text-white max-w-[180px] truncate">{recipient}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-400 text-sm">{t('receipt.tracking')}</span>
                                <div className="flex items-center gap-1.5">
                                    <span className="font-mono text-gray-300 tracking-wider text-sm">{trackingCode}</span>
                                    <button onClick={copyTracking} className="p-1 rounded hover:bg-white/10 transition" aria-label={t('common.copy')}>
                                        {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-gray-500" />}
                                    </button>
                                </div>
                            </div>
                            {message && message !== 'undefined' && message !== '' && (
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-400 text-sm">{t('receipt.message')}</span>
                                    <span className="font-bold text-white max-w-[150px] truncate">{message}</span>
                                </div>
                            )}
                            <div className="flex justify-between items-center">
                                <span className="text-gray-400 text-sm">{t('receipt.fee')}</span>
                                <span className="font-bold text-success">{t('common.free')}</span>
                            </div>
                        </div>

                        {/* Security badge */}
                        <div className="flex items-center gap-2 pt-3 border-t border-white/5">
                            <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                            <p className="text-[10px] text-gray-500">{t('history.details.secure_desc')}</p>
                        </div>
                    </BentoCard>
                </motion.div>
            </div>

            {/* Actions */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="space-y-3"
            >
                <Button className="w-full h-14 gap-2" variant="primary" onClick={() => navigate('/')}>
                    <Home className="w-5 h-5" />
                    {t('receipt.go_home')}
                </Button>
                <div className="grid grid-cols-2 gap-3">
                    <Button variant="secondary" className="h-12 border-white/10" onClick={shareReceipt}>
                        <Share2 className="w-5 h-5 ml-2" />
                        {t('receipt.share')}
                    </Button>
                    <Button variant="secondary" className="h-12 border-white/10">
                        <Download className="w-5 h-5 ml-2" />
                        {t('receipt.download')}
                    </Button>
                </div>
            </motion.div>
        </motion.div>
    );
};
