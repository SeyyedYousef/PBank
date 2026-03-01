import { motion } from 'framer-motion';
import { PageTransition } from '@/shared/ui/PageTransition';
import {
    ArrowLeft, ArrowUpRight, ArrowDownLeft, Copy, Share2,
    RefreshCw, CheckCircle2, Clock, XCircle, ShieldCheck
} from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useWalletStore, Transaction } from '@/store/walletStore';

export const TransactionDetailPage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { id } = useParams();
    const { transactions } = useWalletStore();
    const tx: Transaction | undefined = transactions.find(t => String(t.id) === id);
    const [copiedField, setCopiedField] = useState<string | null>(null);

    if (!tx) {
        return (
            <PageTransition className="flex items-center justify-center min-h-screen">
                <div className="text-center space-y-3">
                    <p className="text-gray-400">{t('common.no_data')}</p>
                    <button onClick={() => navigate('/')} className="text-primary text-sm font-bold">{t('common.back')}</button>
                </div>
            </PageTransition>
        );
    }

    const isSend = tx.type === 'send';
    const statusConfig = {
        success: { icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-500/10', label: t('history.status.success') },
        pending: { icon: Clock, color: 'text-amber-400', bg: 'bg-amber-500/10', label: t('history.status.pending') },
        failed: { icon: XCircle, color: 'text-red-400', bg: 'bg-red-500/10', label: t('history.status.failed') },
    };
    const status = statusConfig[tx.status];
    const StatusIcon = status.icon;

    const copyToClipboard = (text: string, field: string) => {
        navigator.clipboard.writeText(text);
        setCopiedField(field);
        setTimeout(() => setCopiedField(null), 2000);
    };

    const shareReceipt = async () => {
        const text = `${t('receipt.title')}\n---\n${t('history.details.amount')}: ${Number(tx.amount).toLocaleString()} ؋\n${t('history.details.counterparty')}: ${tx.name}\n${t('history.details.date')}: ${tx.date} - ${tx.time}\n${t('history.details.tracking_code')}: ${tx.tracking}\n${t('history.details.status')}: ${status.label}`;
        if (navigator.share) {
            try { await navigator.share({ title: t('receipt.title'), text }); } catch { /* cancelled */ }
        } else {
            copyToClipboard(text, 'share');
        }
    };

    const DetailRow = ({ label, value, copyable, mono }: { label: string; value: string; copyable?: boolean; mono?: boolean }) => (
        <div className="flex items-center justify-between py-3.5 border-b border-white/5 last:border-b-0">
            <span className="text-sm text-gray-400 font-medium">{label}</span>
            <div className="flex items-center gap-2">
                <span className={`text-sm font-bold ${mono ? 'font-mono text-gray-300 tracking-wider' : 'text-white'}`}>
                    {value}
                </span>
                {copyable && (
                    <button
                        onClick={() => copyToClipboard(value, label)}
                        className="p-1 rounded-md hover:bg-white/10 transition-colors"
                        aria-label={`${t('common.copy')} ${label}`}
                    >
                        {copiedField === label ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                            <Copy className="w-3.5 h-3.5 text-gray-500" />
                        )}
                    </button>
                )}
            </div>
        </div>
    );

    return (
        <PageTransition className="pb-32">
            {/* Header */}
            <div className="sticky top-0 z-40 px-6 py-4 backdrop-blur-xl bg-black/30 border-b border-white/5">
                <div className="flex items-center gap-3">
                    <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center" aria-label={t('common.back')}>
                        <ArrowLeft className="w-4 h-4 text-gray-400 rtl:rotate-180" />
                    </button>
                    <h1 className="text-lg font-bold text-white">{t('history.details.title')}</h1>
                </div>
            </div>

            <div className="px-6 mt-6 space-y-6">
                {/* Hero Amount */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center space-y-4"
                >
                    {/* Icon */}
                    <div className="relative inline-flex">
                        <motion.div
                            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
                            transition={{ duration: 3, repeat: Infinity }}
                            className={`absolute inset-0 ${isSend ? 'bg-red-500/20' : 'bg-emerald-500/20'} blur-[40px] rounded-full`}
                        />
                        <div className={`relative w-20 h-20 rounded-[24px] flex items-center justify-center ${isSend ? 'bg-red-500/10 border border-red-500/20' : 'bg-emerald-500/10 border border-emerald-500/20'}`}>
                            {isSend
                                ? <ArrowUpRight className="w-9 h-9 text-red-400" />
                                : <ArrowDownLeft className="w-9 h-9 text-emerald-400" />}
                        </div>
                    </div>

                    {/* Amount */}
                    <div>
                        <motion.p
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className={`text-4xl font-[900] ${isSend ? 'text-red-400' : 'text-emerald-400'}`}
                        >
                            {isSend ? '−' : '+'}{Number(tx.amount).toLocaleString()}
                            <span className="text-lg text-gray-500 mr-1">؋</span>
                        </motion.p>
                        <p className="text-gray-500 text-sm mt-1">{isSend ? t('history.details.success_send') : t('history.details.success_receive')}</p>
                    </div>

                    {/* Status badge */}
                    <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full ${status.bg} ${status.color} text-xs font-bold`}>
                        <StatusIcon className="w-3.5 h-3.5" />
                        {status.label}
                    </div>
                </motion.div>

                {/* Details Card */}
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    className="omega-glass-card rounded-2xl p-5"
                >
                    <DetailRow label={t('history.details.counterparty')} value={t(`history.tx_names.${tx.name}`, tx.name)} />
                    <DetailRow label={t('history.details.date')} value={tx.date === 'today' ? t('history.today', 'امروز') : tx.date === 'yesterday' ? t('history.yesterday', 'دیروز') : tx.date} />
                    <DetailRow label={t('history.details.time')} value={tx.time} />
                    <DetailRow label={t('history.details.tracking_code')} value={tx.tracking} copyable mono />
                    <DetailRow label={t('history.details.fee')} value={t('common.free')} />
                    {tx.note && <DetailRow label={t('history.details.note')} value={t(`history.tx_notes.${tx.note}`, tx.note)} />}
                    {tx.message && <DetailRow label={t('history.details.message')} value={tx.message} />}
                </motion.div>

                {/* Security */}
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 }}
                    className="flex items-center gap-3 p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/10"
                >
                    <ShieldCheck className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                    <div>
                        <p className="text-sm font-bold text-emerald-400">{t('history.details.secure')}</p>
                        <p className="text-[10px] text-gray-500 mt-0.5">{t('history.details.secure_desc')}</p>
                    </div>
                </motion.div>

                {/* Actions */}
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="grid grid-cols-2 gap-3"
                >
                    <button
                        onClick={shareReceipt}
                        className="omega-glass-card rounded-2xl p-4 flex flex-col items-center gap-2 active:scale-95 transition-transform"
                    >
                        <Share2 className="w-5 h-5 text-blue-400" />
                        <span className="text-xs font-bold text-gray-300">{t('history.details.share')}</span>
                    </button>
                    <button
                        onClick={() => navigate('/transfer')}
                        className="omega-glass-card rounded-2xl p-4 flex flex-col items-center gap-2 active:scale-95 transition-transform"
                    >
                        <RefreshCw className="w-5 h-5 text-primary" />
                        <span className="text-xs font-bold text-gray-300">{t('history.details.repeat')}</span>
                    </button>
                </motion.div>
            </div>
        </PageTransition>
    );
};
