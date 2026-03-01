import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Logo } from '@/shared/ui/Logo';

// ═══════════════════════════════════════════════
// PARTICLE FIELD - floating ambient dots
// ═══════════════════════════════════════════════
const particles = Array.from({ length: 10 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    duration: Math.random() * 8 + 6,
    delay: Math.random() * 4,
    opacity: Math.random() * 0.4 + 0.1,
}));

export const SplashScreen = ({ onComplete }: { onComplete: () => void }) => {
    const [phase, setPhase] = useState<'logo' | 'text' | 'exit'>('logo');

    useEffect(() => {
        const t1 = setTimeout(() => setPhase('text'), 1200);
        const t2 = setTimeout(() => setPhase('exit'), 3200);
        const t3 = setTimeout(onComplete, 4000);
        return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
    }, [onComplete]);

    return (
        <AnimatePresence>
            <motion.div
                className="fixed inset-0 z-[100] flex items-center justify-center bg-[#030108] overflow-hidden font-sans select-none"
                exit={{
                    opacity: 0,
                    scale: 1.05,
                    filter: 'blur(20px)',
                    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
                }}
            >
                {/* ── COSMIC BACKGROUND ── */}
                <div className="absolute inset-0">
                    {/* Aurora 1 */}
                    <motion.div
                        animate={{
                            opacity: [0.2, 0.5, 0.2],
                            scale: [1, 1.2, 1],
                            rotate: [0, 15, 0],
                        }}
                        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
                        className="absolute top-[-30%] left-[-10%] w-[600px] h-[600px] bg-gradient-to-br from-purple-700/40 via-violet-600/20 to-transparent rounded-full blur-[120px]"
                    />
                    {/* Aurora 2 */}
                    <motion.div
                        animate={{
                            opacity: [0.15, 0.4, 0.15],
                            scale: [1.1, 0.9, 1.1],
                            rotate: [0, -10, 0],
                        }}
                        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
                        className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-gradient-to-tl from-cyan-600/30 via-blue-700/15 to-transparent rounded-full blur-[100px]"
                    />
                    {/* Aurora 3 - gold accent */}
                    <motion.div
                        animate={{
                            opacity: [0, 0.25, 0],
                            x: [-20, 20, -20],
                        }}
                        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                        className="absolute top-[40%] left-[30%] w-[300px] h-[300px] bg-amber-500/10 rounded-full blur-[80px]"
                    />

                    {/* Particle Field */}
                    {particles.map((p) => (
                        <motion.div
                            key={p.id}
                            className="absolute rounded-full bg-white"
                            style={{
                                width: p.size,
                                height: p.size,
                                left: `${p.x}%`,
                                top: `${p.y}%`,
                            }}
                            animate={{
                                y: [-20, 20, -20],
                                opacity: [p.opacity, p.opacity * 2, p.opacity],
                            }}
                            transition={{
                                duration: p.duration,
                                repeat: Infinity,
                                ease: 'easeInOut',
                                delay: p.delay,
                            }}
                        />
                    ))}

                    {/* Subtle grid overlay */}
                    <div
                        className="absolute inset-0 opacity-[0.03]"
                        style={{
                            backgroundImage:
                                'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
                            backgroundSize: '60px 60px',
                        }}
                    />
                </div>

                {/* ── MAIN CONTENT ── */}
                <div className="relative z-10 flex flex-col items-center">
                    {/* Logo Container */}
                    <div className="relative mb-10">
                        {/* Breathing glow behind logo */}
                        <motion.div
                            animate={{
                                scale: [1, 1.6, 1],
                                opacity: [0.2, 0.5, 0.2],
                            }}
                            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                            className="absolute inset-0 bg-gradient-to-tr from-purple-600 via-primary to-cyan-500 blur-[80px] rounded-full"
                        />

                        {/* Glass container */}
                        <motion.div
                            initial={{ scale: 0.5, opacity: 0, rotateY: -90 }}
                            animate={{ scale: 1, opacity: 1, rotateY: 0 }}
                            transition={{
                                duration: 1.2,
                                ease: [0.16, 1, 0.3, 1],
                            }}
                            className="relative w-36 h-36 backdrop-blur-3xl bg-white/[0.04] rounded-[2.8rem] border border-white/[0.08] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.7),inset_0_1px_0_rgba(255,255,255,0.05)] flex items-center justify-center overflow-hidden"
                        >
                            {/* Holographic shimmer */}
                            <motion.div
                                animate={{ x: ['-150%', '250%'] }}
                                transition={{ duration: 3, repeat: Infinity, repeatDelay: 2, ease: 'easeInOut' }}
                                className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/[0.07] to-transparent -skew-x-12"
                            />

                            {/* Inner glow ring */}
                            <div className="absolute inset-[3px] rounded-[2.5rem] border border-white/[0.04] bg-gradient-to-b from-white/[0.02] to-transparent" />

                            <Logo animated size="xl" />
                        </motion.div>
                    </div>

                    {/* Brand Text */}
                    <div className="text-center space-y-4">
                        {/* PBANK */}
                        <div className="overflow-hidden">
                            <motion.h1
                                initial={{ y: 60, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ duration: 1, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
                                className="text-7xl font-[900] tracking-tighter m-0 p-0"
                            >
                                <span className="bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-white/50 drop-shadow-2xl">
                                    PBANK
                                </span>
                            </motion.h1>
                        </div>

                        {/* Tagline — appears in phase 2 */}
                        <motion.div
                            initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
                            animate={
                                phase === 'text' || phase === 'exit'
                                    ? { opacity: 1, y: 0, filter: 'blur(0px)' }
                                    : {}
                            }
                            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        >
                            <p className="text-sm font-medium text-gray-400 tracking-[0.25em] uppercase">
                                بانکداری هوشمند آینده
                            </p>
                        </motion.div>

                        {/* Trust badges */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={
                                phase === 'text' || phase === 'exit'
                                    ? { opacity: 1 }
                                    : {}
                            }
                            transition={{ duration: 1, delay: 0.3 }}
                            className="flex items-center justify-center gap-4 mt-6"
                        >
                            {['🔒 رمزنگاری پیشرفته', '⚡ پرداخت آنی', '🏦 مجوز DAB'].map((badge, i) => (
                                <motion.span
                                    key={i}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={
                                        phase === 'text' || phase === 'exit'
                                            ? { opacity: 1, scale: 1 }
                                            : {}
                                    }
                                    transition={{ delay: 0.4 + i * 0.15 }}
                                    className="text-[9px] text-gray-500 font-bold"
                                >
                                    {badge}
                                </motion.span>
                            ))}
                        </motion.div>
                    </div>
                </div>

                {/* ── LOADING BAR ── */}
                <div className="absolute bottom-14 left-0 right-0 flex flex-col items-center gap-3">
                    <div className="w-52 h-[3px] bg-white/[0.06] rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: '100%' }}
                            transition={{ duration: 3.5, ease: [0.4, 0, 0.2, 1] }}
                            className="h-full bg-gradient-to-r from-purple-500 via-primary to-cyan-400 rounded-full relative"
                        >
                            {/* Glow tip */}
                            <div className="absolute top-0 right-0 w-4 h-full bg-white/60 blur-[2px] rounded-full" />
                        </motion.div>
                    </div>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="text-[10px] text-gray-600 font-mono tracking-wider"
                    >
                        در حال آماده‌سازی...
                    </motion.p>
                </div>
            </motion.div>
        </AnimatePresence>
    );
};
