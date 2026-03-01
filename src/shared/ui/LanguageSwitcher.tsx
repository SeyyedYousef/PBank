import { useTranslation } from 'react-i18next';
import { Button } from '../ui/Button';
import { Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { MotionSystem } from './motion-system';

export const LanguageSwitcher = () => {
    const { i18n } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);

    const languages = [
        { code: 'fa', label: 'فارسی', flag: '🇮🇷' },
        { code: 'ps', label: 'پښتو', flag: '🇦🇫' },
        { code: 'en', label: 'English', flag: '🇬🇧' },
    ];

    const changeLanguage = (lng: string) => {
        i18n.changeLanguage(lng);
        setIsOpen(false);
    };

    return (
        <div className="relative z-50">
            <Button
                variant="glass"
                className="w-10 h-10 rounded-full !p-0 flex items-center justify-center bg-white/5 hover:bg-white/10 transition-all duration-300 hover:scale-105 active:scale-95"
                onClick={() => setIsOpen(!isOpen)}
            >
                <Globe className="w-4 h-4 text-primary-glow" />
            </Button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        variants={MotionSystem.dropdown}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="absolute top-12 left-0 w-36 bg-[#111] border border-white/10 rounded-[20px] shadow-2xl overflow-hidden backdrop-blur-xl"
                    >
                        {languages.map((lang) => (
                            <button
                                key={lang.code}
                                onClick={() => changeLanguage(lang.code)}
                                className={`
                                    w-full px-4 py-3 text-sm flex items-center gap-3 hover:bg-white/5 transition-colors
                                    ${i18n.language === lang.code ? 'text-primary' : 'text-gray-400'}
                                `}
                            >
                                <span className="text-xl filter drop-shadow-md">{lang.flag}</span>
                                <span className="font-bold relative">
                                    {lang.label}
                                    {i18n.language === lang.code && (
                                        <motion.div
                                            layoutId="active-lang"
                                            className="absolute -right-2 top-1.5 w-1 h-1 bg-primary rounded-full"
                                        />
                                    )}
                                </span>
                            </button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
