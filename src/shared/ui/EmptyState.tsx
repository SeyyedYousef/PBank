import { motion } from 'framer-motion';
import { LucideIcon, Inbox, Search, Users, Bell, CreditCard } from 'lucide-react';

interface EmptyStateProps {
    icon?: LucideIcon;
    title: string;
    description?: string;
    action?: React.ReactNode;
    preset?: 'transactions' | 'search' | 'contacts' | 'notifications' | 'generic';
}

const presetIcons: Record<string, LucideIcon> = {
    transactions: CreditCard,
    search: Search,
    contacts: Users,
    notifications: Bell,
    generic: Inbox,
};

export const EmptyState = ({ icon, title, description, action, preset = 'generic' }: EmptyStateProps) => {
    const Icon = icon || presetIcons[preset];

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col items-center justify-center py-16 px-6 text-center"
        >
            {/* Animated Icon */}
            <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                className="relative mb-6"
            >
                <div className="absolute inset-0 bg-primary/10 blur-[30px] rounded-full" />
                <div className="relative w-20 h-20 rounded-full bg-white/5 border border-white/[0.06] flex items-center justify-center">
                    <Icon className="w-8 h-8 text-gray-500" />
                </div>
            </motion.div>

            <h3 className="text-base font-bold text-gray-300 mb-1">{title}</h3>
            {description && (
                <p className="text-sm text-gray-600 max-w-[250px] leading-relaxed">{description}</p>
            )}

            {action && <div className="mt-5">{action}</div>}
        </motion.div>
    );
};
