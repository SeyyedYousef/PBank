import { useState } from 'react';
import { motion } from 'framer-motion';
import { PageTransition } from '@/shared/ui/PageTransition';
import { useWalletStore } from '@/store/walletStore';
import { useAuthStore } from '@/store/authStore';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/shared/ui/Button';
import { ArrowLeft, Copy, Check, Share2 } from 'lucide-react';

export const ReceivePage = () => {
    const navigate = useNavigate();
    const { pbankId } = useWalletStore();
    const { user } = useAuthStore();
    const [copied, setCopied] = useState(false);
    const [amount, setAmount] = useState('');

    const handleCopy = () => {
        navigator.clipboard.writeText(pbankId);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const formattedId = pbankId.replace(/(.{4})/g, '$1 ').trim();

    return (
        <PageTransition className="p-6 space-y-8 pb-32">
            {/* Header */}
            <header className="flex items-center gap-4 pt-4">
                <Button
                    variant="secondary"
                    size="icon"
                    onClick={() => navigate(-1)}
                    className="rounded-full w-12 h-12 bg-white/5 border border-white/10"
                >
                    <ArrowLeft className="w-6 h-6 text-white" />
                </Button>
                <div className="flex flex-col">
                    <h1 className="text-xl font-bold text-white">دریافت وجه</h1>
                    <span className="text-xs text-gray-400">آدرس PBank خود را به اشتراک بگذارید</span>
                </div>
            </header>

            {/* QR Code Section */}
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col items-center"
            >
                <div className="relative">
                    {/* Glow ring */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-primary via-emerald-400 to-primary-glow rounded-[32px] blur-xl opacity-20 animate-glow-pulse" />

                    <div className="relative omega-glass-card rounded-[32px] p-8 flex flex-col items-center gap-6">
                        {/* QR placeholder with cool scan pattern */}
                        <div className="w-48 h-48 bg-white rounded-2xl p-4 relative overflow-hidden">
                            {/* Generate a visual QR-like pattern */}
                            <div className="w-full h-full grid grid-cols-8 gap-[2px]">
                                {Array.from({ length: 64 }, (_, i) => {
                                    // Deterministic pattern based on pbankId
                                    const char = pbankId.charCodeAt(i % pbankId.length);
                                    const filled = (char + i * 7) % 3 !== 0;
                                    // Keep corners for QR finder patterns
                                    const isCorner = (
                                        (i < 24 && (i % 8 < 3)) || // top-left
                                        (i < 24 && (i % 8 > 4)) || // top-right
                                        (i > 39 && (i % 8 < 3))    // bottom-left
                                    );
                                    return (
                                        <div
                                            key={i}
                                            className={`rounded-[1px] ${isCorner || filled ? 'bg-black' : 'bg-transparent'}`}
                                        />
                                    );
                                })}
                            </div>
                            {/* Center logo */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-primary rounded-lg flex items-center justify-center shadow-lg">
                                <span className="text-white font-black text-sm">P</span>
                            </div>
                        </div>

                        {/* User info */}
                        <div className="text-center">
                            <p className="text-white font-bold text-lg">{user?.name || 'کاربر مهمان'}</p>
                            <p className="text-gray-400 text-xs mt-1 font-mono">@{user?.username || 'username'}</p>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* PBank ID */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="omega-glass rounded-2xl p-4 space-y-3"
            >
                <p className="text-gray-400 text-[11px] font-bold uppercase tracking-wider">شناسه PBank</p>
                <div className="flex items-center justify-between gap-3">
                    <p className="text-white font-mono text-sm tracking-wider ltr-nums flex-1 truncate" dir="ltr">
                        {formattedId}
                    </p>
                    <button
                        onClick={handleCopy}
                        className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${copied
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : 'bg-white/5 text-gray-400 hover:bg-white/10'
                            }`}
                    >
                        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </button>
                </div>
            </motion.div>

            {/* Amount Request */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="omega-glass rounded-2xl p-4 space-y-3"
            >
                <p className="text-gray-400 text-[11px] font-bold uppercase tracking-wider">درخواست مبلغ مشخص</p>
                <div className="flex gap-3">
                    <div className="relative flex-1">
                        <input
                            type="number"
                            placeholder="۰"
                            value={amount}
                            onChange={e => setAmount(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white text-sm outline-none focus:border-primary/50 transition-colors placeholder-gray-600"
                        />
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs">AFN</span>
                    </div>
                    <button className="px-5 py-3 rounded-xl bg-primary/20 text-primary font-bold text-sm hover:bg-primary/30 transition-colors border border-primary/20">
                        <Share2 className="w-4 h-4" />
                    </button>
                </div>
            </motion.div>

            {/* Share Button */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
            >
                <Button
                    className="w-full h-14 text-base font-bold shadow-lg shadow-primary/20"
                    onClick={() => {
                        if (navigator.share) {
                            navigator.share({
                                title: 'PBank Payment',
                                text: `آدرس PBank من: ${pbankId}${amount ? `\nمبلغ: ${amount} AFN` : ''}`,
                            });
                        }
                    }}
                >
                    <Share2 className="w-5 h-5 ml-2" />
                    اشتراک‌گذاری آدرس
                </Button>
            </motion.div>
        </PageTransition>
    );
};
