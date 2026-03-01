import { useState, useEffect } from 'react';
import { BentoCard } from '@/shared/ui/BentoCard';
import { Smartphone, Zap, Wifi, Plane, Building, MoreHorizontal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { PageTransition } from '@/shared/ui/PageTransition';
import { SkeletonPage } from '@/shared/ui/Skeleton';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export const ServicesPage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 700);
        return () => clearTimeout(timer);
    }, []);

    const slides = [
        {
            id: 'mobile-credit',
            badge: t('services.banners.mobile.badge', 'پیشنهاد ویژه'),
            title: t('services.banners.mobile.title', '۲۰٪ تخفیف شارژ برای خطوط روشن'),
            bgGradient: 'from-primary/30 to-background',
            glowColor: 'bg-primary/40',
            floatyColor: 'from-white/20 to-transparent',
            accent: 'text-primary-glow',
        },
        {
            id: 'internet',
            badge: t('services.banners.internet.badge', 'اینترنت نامحدود'),
            title: t('services.banners.internet.title', 'بسته‌های شبانه با سرعت نور'),
            bgGradient: 'from-violet-500/30 to-background',
            glowColor: 'bg-violet-500/40',
            floatyColor: 'from-violet-300/20 to-transparent',
            accent: 'text-violet-300',
        },
        {
            id: 'electricity',
            badge: t('services.banners.electricity.badge', 'پاداش نقدی'),
            title: t('services.banners.electricity.title', '۵٪ بازگشت وجه در پرداخت قبض برق'),
            bgGradient: 'from-amber-500/30 to-background',
            glowColor: 'bg-amber-500/40',
            floatyColor: 'from-amber-300/20 to-transparent',
            accent: 'text-amber-300',
        }
    ];

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [slides.length]);

    const services = [
        { id: 'mobile-credit', icon: Smartphone, label: t('services.mobile_credit'), color: 'text-blue-400', bg: 'bg-blue-400/10' },
        { id: 'electricity', icon: Zap, label: t('services.electricity'), color: 'text-amber-400', bg: 'bg-amber-400/10' },
        { id: 'internet', icon: Wifi, label: t('services.internet'), color: 'text-violet-400', bg: 'bg-violet-400/10' },
        { id: 'flights', icon: Plane, label: t('services.flights'), color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
        { id: 'taxes', icon: Building, label: t('services.taxes'), color: 'text-rose-400', bg: 'bg-rose-400/10' },
        { id: 'others', icon: MoreHorizontal, label: t('services.others'), color: 'text-gray-400', bg: 'bg-white/5' },
    ];

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const item = {
        hidden: { opacity: 0, scale: 0.8 },
        show: { opacity: 1, scale: 1 }
    };

    return (
        <PageTransition className="p-6 space-y-8 pb-32">
            <header className="pt-4 text-center">
                <h1 className="text-3xl font-[800] text-transparent bg-clip-text bg-gradient-to-r from-primary-glow to-white drop-shadow-lg">
                    {t('services.title')}
                </h1>
            </header>

            {isLoading ? (
                <SkeletonPage />
            ) : (
                <>
                    {/* Featured Slider */}
                    <button
                        type="button"
                        className="relative h-48 w-full group cursor-pointer text-start outline-none focus-visible:ring-4 focus-visible:ring-primary/50 rounded-[32px] transition-shadow"
                        onClick={() => navigate(`/services/${slides[currentSlide].id}`)}
                        aria-label={`View details of ${slides[currentSlide].title}`}
                    >
                        <AnimatePresence mode='wait'>
                            <motion.div
                                key={currentSlide}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.5 }}
                                className="absolute inset-0"
                            >
                                <BentoCard variant="default" className="relative h-full overflow-hidden flex items-end p-0 border-white/10">
                                    <div className={`absolute inset-0 bg-gradient-to-br ${slides[currentSlide].bgGradient} opacity-60 z-0`} />
                                    <div className={`absolute top-0 end-0 w-32 h-32 ${slides[currentSlide].glowColor} blur-[50px] rounded-full pointer-events-none`} />

                                    <div className="relative z-10 w-full h-full p-6 flex items-end">
                                        <div className="space-y-3 w-full">
                                            <span className={`inline-block px-3 py-1 bg-white/10 backdrop-blur-md rounded-lg text-[10px] font-bold uppercase tracking-wider border border-white/10 ${slides[currentSlide].accent}`}>
                                                {slides[currentSlide].badge}
                                            </span>
                                            <h2 className="text-2xl font-[800] w-2/3 leading-tight drop-shadow-md text-white">
                                                {slides[currentSlide].title}
                                            </h2>
                                        </div>
                                    </div>

                                    {/* 3D-like floaty element */}
                                    <div className={`absolute -top-4 -start-4 w-24 h-24 bg-gradient-to-br ${slides[currentSlide].floatyColor} rounded-full blur-xl animate-pulse`} />
                                </BentoCard>
                            </motion.div>
                        </AnimatePresence>

                        {/* Dots Indicator */}
                        <div className="absolute bottom-4 start-6 flex gap-2 z-20">
                            {slides.map((_, idx) => (
                                <button
                                    key={idx}
                                    type="button"
                                    onClick={(e) => { e.stopPropagation(); setCurrentSlide(idx); }}
                                    aria-label={`Slide ${idx + 1}`}
                                    className={`w-2 h-2 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white ${idx === currentSlide ? 'bg-white w-6' : 'bg-white/30'}`}
                                />
                            ))}
                        </div>
                    </button>

                    {/* Grid */}
                    <motion.div
                        variants={container}
                        initial="hidden"
                        animate="show"
                        className="grid grid-cols-2 md:grid-cols-3 gap-4"
                    >
                        {services.map((svc) => (
                            <BentoCard
                                key={svc.id}
                                variants={item}
                                variant="heavy"
                                onClick={() => navigate(`/services/${svc.id}`)}
                                className="aspect-square flex flex-col items-center justify-center gap-3 p-2 cursor-pointer hover:bg-white/10 hover:border-white/20 transition-colors group"
                            >
                                <div className={`w-14 h-14 rounded-[20px] ${svc.bg} flex items-center justify-center mb-1 group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(0,0,0,0.2)]`}>
                                    <svc.icon className={`w-7 h-7 ${svc.color} drop-shadow-[0_0_5px_rgba(255,255,255,0.2)]`} />
                                </div>
                                <span className="text-xs font-bold text-center text-gray-300 group-hover:text-white transition-colors">{svc.label}</span>
                            </BentoCard>
                        ))}
                    </motion.div>
                </>
            )}
        </PageTransition>
    );
};
