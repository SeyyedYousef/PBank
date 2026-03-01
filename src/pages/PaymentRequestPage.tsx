import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/shared/ui/Button';
import { ArrowLeft, ShieldCheck } from 'lucide-react';
import { useWalletStore } from '../store/walletStore';

export const PaymentRequestPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { sendMoney } = useWalletStore();
    const [amount, setAmount] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

    const handlePay = () => {
        if (!amount) return;
        setIsProcessing(true);

        // Simulate processing
        setTimeout(() => {
            try {
                // In a real app, 'id' would be resolved to an address
                // Here we assume 'id' IS the address or username acting as address
                sendMoney(Number(amount), id || 'Unknown');
                navigate(`/receipt?amount=${amount}&recipient=${id}&message=${encodeURIComponent('Payment via Link')}`);
            } catch (error) {
                alert((error as Error).message);
                setIsProcessing(false);
            }
        }, 1500);
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="min-h-screen p-6 flex flex-col items-center pt-10 pb-32 relative overflow-hidden"
        >
            {/* Background Effects */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-primary/20 blur-[100px] rounded-full pointer-events-none" />

            <header className="w-full flex justify-between items-center mb-10 z-10">
                <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
                    <ArrowLeft className="w-6 h-6 text-white" />
                </Button>
                <div className="flex items-center gap-2 text-green-400 bg-green-400/10 px-3 py-1 rounded-full border border-green-400/20">
                    <ShieldCheck className="w-4 h-4" />
                    <span className="text-xs font-bold">درگاه امن پی‌بانک</span>
                </div>
            </header>

            <div className="flex flex-col items-center gap-4 z-10">
                <div className="w-24 h-24 rounded-[32px] bg-gradient-to-br from-primary to-primary-glow p-[2px] shadow-2xl shadow-primary/30">
                    <div className="w-full h-full rounded-[30px] bg-surface flex items-center justify-center overflow-hidden">
                        <span className="text-4xl font-bold text-white uppercase">{id ? id[0] : '?'}</span>
                    </div>
                </div>
                <div className="text-center space-y-1">
                    <h1 className="text-2xl font-bold text-white">{id}</h1>
                    <p className="text-gray-400 text-sm">درخواست پرداخت وجه دارد</p>
                </div>
            </div>

            <div className="mt-12 w-full max-w-xs space-y-8 z-10">
                <div className="text-center">
                    <div className="relative inline-block">
                        <input
                            type="number" // Simple input for now
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="0"
                            className="bg-transparent text-6xl font-[900] text-center text-white placeholder-white/20 outline-none w-full"
                            autoFocus
                        />
                        <span className="absolute -right-8 top-4 text-2xl text-gray-500">؋</span>
                    </div>
                    <p className="text-gray-500 mt-2 text-sm">مبلغ را به افغانی وارد کنید</p>
                </div>

                <Button
                    className="w-full h-16 text-xl font-bold shadow-lg shadow-primary/20"
                    onClick={handlePay}
                    disabled={isProcessing || !amount}
                >
                    {isProcessing ? 'در حال پردازش...' : 'پرداخت وجه'}
                </Button>
            </div>

            <div className="mt-auto z-10">
                <p className="text-center text-gray-500 text-xs">
                    تراکنش شما با رمزنگاری پایان‌به‌پایان محافظت می‌شود
                </p>
            </div>
        </motion.div>
    );
};
