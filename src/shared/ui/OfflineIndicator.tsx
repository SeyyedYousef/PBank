import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WifiOff, Wifi } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const OfflineIndicator = () => {
    const { t } = useTranslation();
    const [isOffline, setIsOffline] = useState(!navigator.onLine);
    const [showOnline, setShowOnline] = useState(false);

    useEffect(() => {
        const handleOnline = () => {
            setIsOffline(false);
            setShowOnline(true);
            setTimeout(() => setShowOnline(false), 3000);
        };
        const handleOffline = () => setIsOffline(true);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    return (
        <AnimatePresence>
            {isOffline && (
                <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="bg-red-500 text-white text-xs font-bold safe-area-top z-[100] fixed top-0 left-0 right-0"
                    role="alert"
                    aria-live="assertive"
                >
                    <div className="flex items-center justify-center gap-2 py-1.5 px-4">
                        <WifiOff className="w-3 h-3" />
                        <span>{t('common.offline')}</span>
                    </div>
                </motion.div>
            )}
            {showOnline && (
                <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="bg-emerald-500 text-white text-xs font-bold safe-area-top z-[100] fixed top-0 left-0 right-0"
                    role="status"
                    aria-live="polite"
                >
                    <div className="flex items-center justify-center gap-2 py-1.5 px-4">
                        <Wifi className="w-3 h-3" />
                        <span>{t('common.online')}</span>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
