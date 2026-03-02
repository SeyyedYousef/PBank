import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Fingerprint, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from './Button';

interface PaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => Promise<void>;
    amount: number;
    recipientName: string;
    recipientDetails?: string;
    serviceName?: string;
    status: 'idle' | 'loading' | 'success' | 'error';
    errorMsg?: string;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    amount,
    recipientName,
    recipientDetails,
    serviceName = 'انتقال وجه',
    status,
    errorMsg
}) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={status !== 'loading' ? onClose : undefined}
                        className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, y: '100%' }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        className="fixed bottom-0 left-0 right-0 z-[101] p-6 bg-[#0a0a14] rounded-t-[32px] border-t border-white/10 shadow-[0_-20px_40px_rgba(0,0,0,0.5)] safe-bottom pb-8"
                    >
                        {status === 'success' ? (
                            <div className="text-center py-6 space-y-4">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="w-20 h-20 mx-auto rounded-full bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30"
                                >
                                    <CheckCircle2 className="w-10 h-10 text-emerald-400" />
                                </motion.div>
                                <h3 className="text-2xl font-bold text-white">پرداخت موفق</h3>
                                <p className="text-gray-400 text-sm">مبلغ باموفقیت به {recipientName} واریز شد.</p>
                                <Button onClick={onClose} className="w-full h-14 mt-4 bg-white/10 hover:bg-white/20">
                                    بستن
                                </Button>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                <div className="flex justify-center">
                                    <div className="w-12 h-1.5 bg-white/20 rounded-full" />
                                </div>

                                <div className="text-center space-y-2">
                                    <h3 className="text-xl font-bold text-white">تایید {serviceName}</h3>
                                    <p className="text-gray-400 text-sm">لطفاً اطلاعات زیر را قبل از پرداخت تایید کنید</p>
                                </div>

                                <div className="omega-glass-card rounded-2xl p-4 space-y-3">
                                    <div className="flex justify-between items-center text-sm border-b border-white/5 pb-3">
                                        <span className="text-gray-400">گیرنده / سرویس</span>
                                        <div className="text-left">
                                            <span className="text-white font-bold block">{recipientName}</span>
                                            {recipientDetails && (
                                                <span className="text-gray-500 text-[10px]">{recipientDetails}</span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-center text-sm border-b border-white/5 pb-3">
                                        <span className="text-gray-400">مبلغ پرداخت</span>
                                        <span className="text-white font-black text-xl ltr-nums tabular-nums">
                                            {amount.toLocaleString()} <span className="text-gray-500 text-xs font-normal">AFN</span>
                                        </span>
                                    </div>

                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-gray-400">کمیشن خدمات</span>
                                        <span className="text-emerald-400 font-bold">رایگان</span>
                                    </div>
                                </div>

                                {status === 'error' && (
                                    <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl flex gap-2 items-start text-rose-400 text-xs text-start">
                                        <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                                        <p>{errorMsg || 'خطایی در انجام پرداخت رخ داد'}</p>
                                    </div>
                                )}

                                <div className="pt-2 flex gap-3">
                                    <Button
                                        variant="ghost"
                                        onClick={onClose}
                                        disabled={status === 'loading'}
                                        className="flex-1 h-14 border border-white/20"
                                    >
                                        انصراف
                                    </Button>
                                    <Button
                                        onClick={onConfirm}
                                        disabled={status === 'loading'}
                                        className="flex-[2] h-14 bg-gradient-to-r from-primary to-purple-600 shadow-lg shadow-primary/30"
                                    >
                                        {status === 'loading' ? (
                                            <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                                        ) : (
                                            <div className="flex items-center justify-center gap-2">
                                                <Fingerprint className="w-5 h-5" />
                                                تایید و پرداخت
                                            </div>
                                        )}
                                    </Button>
                                </div>

                                <p className="text-center text-[10px] text-gray-500 flex items-center justify-center gap-1 font-mono">
                                    <ShieldCheck className="w-3 h-3" />
                                    انتقال امن روی بستر بانکی
                                </p>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};
