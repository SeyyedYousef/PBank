import { motion } from 'framer-motion';
import { LucideIcon, RefreshCw, WifiOff, AlertTriangle } from 'lucide-react';
import { Button } from './Button';

interface ErrorStateProps {
    icon?: LucideIcon;
    title?: string;
    description?: string;
    onRetry?: () => void;
    retryLabel?: string;
    type?: 'network' | 'generic' | 'empty';
}

const errorConfig = {
    network: {
        icon: WifiOff,
        title: 'اتصال اینترنت قطع شده',
        description: 'لطفاً اتصال خود را بررسی کنید و دوباره تلاش کنید.',
        gradient: 'from-red-500/20 to-orange-500/20',
        iconColor: 'text-red-400',
    },
    generic: {
        icon: AlertTriangle,
        title: 'خطایی رخ داد',
        description: 'مشکلی در بارگذاری اطلاعات پیش آمد. لطفاً دوباره تلاش کنید.',
        gradient: 'from-amber-500/20 to-yellow-500/20',
        iconColor: 'text-amber-400',
    },
    empty: {
        icon: AlertTriangle,
        title: 'موردی یافت نشد',
        description: 'هنوز اطلاعاتی برای نمایش وجود ندارد.',
        gradient: 'from-gray-500/20 to-gray-600/20',
        iconColor: 'text-gray-400',
    },
};

export const ErrorState = ({
    icon,
    title,
    description,
    onRetry,
    retryLabel = 'تلاش مجدد',
    type = 'generic',
}: ErrorStateProps) => {
    const config = errorConfig[type];
    const Icon = icon || config.icon;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-16 px-6 text-center"
        >
            {/* Icon Container */}
            <div className="relative mb-6">
                <div className={`absolute inset-0 bg-gradient-to-br ${config.gradient} blur-[40px] rounded-full`} />
                <div className={`relative w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center`}>
                    <Icon className={`w-9 h-9 ${config.iconColor}`} />
                </div>
            </div>

            {/* Text */}
            <h3 className="text-lg font-bold text-white mb-2">
                {title || config.title}
            </h3>
            <p className="text-sm text-gray-500 max-w-[280px] leading-relaxed mb-6">
                {description || config.description}
            </p>

            {/* Retry Button */}
            {onRetry && (
                <Button
                    variant="secondary"
                    onClick={onRetry}
                    className="gap-2 px-6 border-white/10"
                >
                    <RefreshCw className="w-4 h-4" />
                    {retryLabel}
                </Button>
            )}
        </motion.div>
    );
};
