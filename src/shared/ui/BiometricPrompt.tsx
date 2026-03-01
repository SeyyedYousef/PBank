import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Fingerprint, Check } from 'lucide-react';
import { Drawer } from 'vaul';

interface BiometricPromptProps {
    isOpen: boolean;
    onSuccess: () => void;
    onCancel: () => void;
}

export const BiometricPrompt = ({ isOpen, onSuccess, onCancel }: BiometricPromptProps) => {
    const [status, setStatus] = useState<'scanning' | 'success' | 'failed'>('scanning');

    useEffect(() => {
        if (isOpen) {
            setStatus('scanning');
            // Simulate scanning delay
            const timer = setTimeout(() => {
                setStatus('success');
                // Auto close after success
                setTimeout(() => {
                    onSuccess();
                }, 1000);
            }, 2000);

            return () => clearTimeout(timer);
        }
    }, [isOpen, onSuccess]);

    return (
        <Drawer.Root open={isOpen} onOpenChange={(open) => !open && onCancel()}>
            <Drawer.Portal>
                <Drawer.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" />
                <Drawer.Content className="bg-surface border-t border-white/10 flex flex-col rounded-t-[32px] fixed bottom-0 left-0 right-0 z-50 h-[350px]">
                    <div className="p-8 flex flex-col items-center justify-center flex-1 space-y-6">
                        <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-white/20 absolute top-4" />

                        <h3 className="text-xl font-bold text-white text-center">
                            {status === 'scanning' && 'لطفا اثر انگشت خود را اسکن کنید'}
                            {status === 'success' && 'هویت شما تایید شد'}
                            {status === 'failed' && 'عدم تطابق اثر انگشت'}
                        </h3>

                        <div className="relative">
                            <AnimatePresence mode="wait">
                                {status === 'scanning' && (
                                    <motion.div
                                        key="scanning"
                                        initial={{ scale: 0.8, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        exit={{ scale: 0.8, opacity: 0 }}
                                        className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center relative"
                                    >
                                        <div className="absolute inset-0 rounded-full border-4 border-primary/30 animate-ping" />
                                        <Fingerprint className="w-12 h-12 text-primary animate-pulse" />
                                    </motion.div>
                                )}

                                {status === 'success' && (
                                    <motion.div
                                        key="success"
                                        initial={{ scale: 0.8, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        exit={{ scale: 0.8, opacity: 0 }}
                                        className="w-24 h-24 rounded-full bg-emerald-500/20 flex items-center justify-center"
                                    >
                                        <Check className="w-12 h-12 text-emerald-500" />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        <p className="text-sm text-gray-400 text-center">
                            برای تایید تراکنش نیاز به احراز هویت است
                        </p>
                    </div>
                </Drawer.Content>
            </Drawer.Portal>
        </Drawer.Root>
    );
};
