import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Shield, Globe, ArrowRight } from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from '@/shared/ui/LanguageSwitcher';

interface IntroStepProps {
    onStart: () => void;
}

const slides = [
    {
        icon: Zap,
        gradient: 'from-amber-500 to-orange-600',
        glow: 'rgba(245,158,11,0.3)',
        bg: 'radial-gradient(circle at 50% 40%, rgba(245,158,11,0.12) 0%, transparent 60%)',
    },
    {
        icon: Shield,
        gradient: 'from-purple-500 to-violet-600',
        glow: 'rgba(168,85,247,0.3)',
        bg: 'radial-gradient(circle at 50% 40%, rgba(168,85,247,0.12) 0%, transparent 60%)',
    },
    {
        icon: Globe,
        gradient: 'from-cyan-400 to-blue-600',
        glow: 'rgba(34,211,238,0.3)',
        bg: 'radial-gradient(circle at 50% 40%, rgba(34,211,238,0.12) 0%, transparent 60%)',
    },
];

export const IntroStep: React.FC<IntroStepProps> = ({ onStart }) => {
    const { t } = useTranslation();
    const [currentIndex, setCurrentIndex] = useState(0);

    const features = [
        {
            title: t('auth.intro.slides.1.title', 'پرداخت آنی'),
            description: t('auth.intro.slides.1.desc', 'ارسال و دریافت پول در کسری از ثانیه'),
        },
        {
            title: t('auth.intro.slides.2.title', 'امنیت حرفه‌ای'),
            description: t('auth.intro.slides.2.desc', 'حفاظت چند‌لایه با رمزنگاری نظامی'),
        },
        {
            title: t('auth.intro.slides.3.title', 'دسترسی جهانی'),
            description: t('auth.intro.slides.3.desc', 'هرجای دنیا باشید، حساب شما همراهتان است'),
        },
    ];

    const slide = slides[currentIndex];
    const feature = features[currentIndex];
    const isLast = currentIndex === features.length - 1;
    const Icon = slide.icon;

    const nextSlide = () => {
        if (!isLast) {
            setCurrentIndex(prev => prev + 1);
        } else {
            onStart();
        }
    };

    return (
        <div className="flex flex-col h-full justify-between items-center py-10 px-6 relative overflow-hidden">
            {/* Language Switcher */}
            <div className="absolute top-5 left-5 z-50">
                <LanguageSwitcher />
            </div>

            {/* Skip button */}
            {!isLast && (
                <button
                    onClick={onStart}
                    className="absolute top-5 right-5 z-50 text-gray-500 text-xs font-bold hover:text-white transition-colors px-3 py-1.5 rounded-full bg-white/5 border border-white/5"
                >
                    {t('auth.intro.skip')}
                </button>
            )}

            {/* Ambient glow */}
            <motion.div
                key={currentIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0 pointer-events-none"
                style={{ background: slide.bg }}
            />

            {/* Main Content */}
            <div className="flex-1 flex flex-col justify-center items-center w-full max-w-sm z-10">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentIndex}
                        initial={{ opacity: 0, scale: 0.85, y: 30 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 1.1, y: -20, filter: 'blur(8px)' }}
                        transition={{ type: 'spring', stiffness: 200, damping: 22 }}
                        className="flex flex-col items-center text-center space-y-8"
                    >
                        {/* Icon Container */}
                        <div className="relative">
                            {/* Outer glow */}
                            <motion.div
                                animate={{
                                    scale: [1, 1.3, 1],
                                    opacity: [0.3, 0.6, 0.3],
                                }}
                                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                                className={`absolute inset-0 bg-gradient-to-br ${slide.gradient} blur-[50px] rounded-full`}
                            />

                            {/* Glass card */}
                            <div className="relative p-8 rounded-[36px] bg-gradient-to-br from-white/[0.08] to-white/[0.02] border border-white/[0.08] backdrop-blur-2xl shadow-2xl">
                                {/* Shimmer */}
                                <motion.div
                                    animate={{ x: ['-100%', '200%'] }}
                                    transition={{ duration: 3, repeat: Infinity, repeatDelay: 2, ease: 'easeInOut' }}
                                    className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/[0.05] to-transparent -skew-x-12 rounded-[36px]"
                                />
                                <Icon
                                    className="w-20 h-20 relative z-10"
                                    style={{
                                        filter: `drop-shadow(0 0 20px ${slide.glow})`,
                                        color: 'white',
                                    }}
                                />
                            </div>
                        </div>

                        {/* Text */}
                        <div className="space-y-4">
                            <motion.h2
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.15 }}
                                className="text-4xl font-[900] tracking-tight text-white"
                            >
                                {feature.title}
                            </motion.h2>
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.3 }}
                                className="text-base text-gray-400 font-medium leading-relaxed max-w-[280px] mx-auto"
                            >
                                {feature.description}
                            </motion.p>
                        </div>
                    </motion.div>
                </AnimatePresence>

                {/* Dots */}
                <div className="flex gap-2.5 mt-12">
                    {slides.map((_, idx) => (
                        <motion.div
                            key={idx}
                            animate={{
                                width: idx === currentIndex ? 32 : 8,
                                opacity: idx === currentIndex ? 1 : 0.3,
                            }}
                            className={`h-2 rounded-full transition-colors duration-500 ${idx === currentIndex
                                ? `bg-gradient-to-r ${slide.gradient}`
                                : 'bg-white/20'
                                }`}
                        />
                    ))}
                </div>
            </div>

            {/* CTA Button */}
            <div className="w-full max-w-sm space-y-4 z-10">
                <Button
                    onClick={nextSlide}
                    className={`w-full h-[60px] text-lg font-bold rounded-2xl border-none bg-gradient-to-r ${slide.gradient} shadow-lg transition-all duration-500`}
                    style={{ boxShadow: `0 8px 30px ${slide.glow}` }}
                >
                    <span className="relative z-10 flex items-center gap-3 justify-center">
                        {isLast ? t('auth.intro.start') : t('auth.intro.continue')}
                        <ArrowRight className="w-5 h-5 rtl:rotate-180" />
                    </span>
                </Button>
            </div>
        </div>
    );
};
