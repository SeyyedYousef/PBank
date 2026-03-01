import { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'framer-motion';
import { Check } from 'lucide-react';

interface SuccessAnimationProps {
    show: boolean;
    onComplete?: () => void;
    title?: string;
    subtitle?: string;
}

export const SuccessAnimation = ({ show, onComplete, title = "موفق!", subtitle }: SuccessAnimationProps) => {
    useEffect(() => {
        if (!show) return;

        const duration = 3000;
        const animationEnd = Date.now() + duration;

        const triggerConfetti = () => {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                if (onComplete) {
                    setTimeout(onComplete, 1000);
                }
                return;
            }

            const particleCount = 50 * (timeLeft / duration);

            confetti({
                particleCount,
                startVelocity: 30,
                spread: 360,
                origin: {
                    x: Math.random(),
                    // since they fall down, start a bit higher than random
                    y: Math.random() - 0.2
                },
                colors: ['#00FF94', '#7F00FF', '#00E8DB', '#FFFFFF'],
                disableForReducedMotion: true,
                zIndex: 100
            });

            requestAnimationFrame(triggerConfetti);
        };

        triggerConfetti();
    }, [show, onComplete]);

    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[90] flex items-center justify-center bg-black/60 backdrop-blur-md"
                >
                    <motion.div
                        initial={{ scale: 0.5, opacity: 0, y: 50 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.8, opacity: 0, y: -20 }}
                        transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 20,
                            delay: 0.1
                        }}
                        className="flex flex-col items-center justify-center space-y-4"
                    >
                        <div className="relative">
                            <motion.div
                                animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0.8, 0] }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                                className="absolute inset-0 bg-emerald-500 rounded-full blur-[30px]"
                            />
                            <div className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(0,255,148,0.5)] relative z-10 border-4 border-emerald-300">
                                <motion.div
                                    initial={{ pathLength: 0 }}
                                    animate={{ pathLength: 1 }}
                                    transition={{ duration: 0.5, delay: 0.2 }}
                                >
                                    <Check className="w-12 h-12 text-white" strokeWidth={4} />
                                </motion.div>
                            </div>
                        </div>

                        <motion.h2
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="text-3xl font-[900] text-white drop-shadow-lg"
                        >
                            {title}
                        </motion.h2>

                        {subtitle && (
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.5 }}
                                className="text-emerald-100 font-medium"
                            >
                                {subtitle}
                            </motion.p>
                        )}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
