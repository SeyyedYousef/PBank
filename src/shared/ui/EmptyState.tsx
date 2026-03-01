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
            {/* Animated 3D-like Icon Illustration */}
            <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="relative mb-8 mt-4"
            >
                {/* Background ambient glow */}
                <div className="absolute inset-0 bg-primary/30 blur-[45px] rounded-full scale-150" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-purple-500/20 blur-[30px] rounded-full" />

                {/* Floating particles */}
                <motion.div animate={{ y: [-5, 5, -5], x: [-5, 5, -5] }} transition={{ duration: 3, repeat: Infinity }} className="absolute -top-4 -right-2 w-2 h-2 rounded-full bg-cyan-400 blur-[1px]" />
                <motion.div animate={{ y: [5, -5, 5], x: [5, -5, 5] }} transition={{ duration: 4, repeat: Infinity }} className="absolute -bottom-2 -left-4 w-3 h-3 rounded-full bg-primary blur-[2px]" />
                <motion.div animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }} transition={{ duration: 2, repeat: Infinity }} className="absolute top-1/2 right-[-20px] w-1.5 h-1.5 rounded-full bg-emerald-400" />

                {/* Main Glass block */}
                <div className="relative w-28 h-28 transform perspective-[1000px] rotateX-[10deg] rotateY-[-10deg]">
                    <div className="absolute inset-0 omega-glass-heavy rounded-[28px] border-[2px] border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5),inset_0_2px_15px_rgba(255,255,255,0.1)] flex items-center justify-center overflow-hidden">
                        {/* Inner diagonal sheen */}
                        <div className="absolute top-0 left-[-100%] w-[200%] h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-[30deg] animate-[holographic_3s_linear_infinite]" />
                        <Icon className="w-12 h-12 text-primary-glow flex-shrink-0 drop-shadow-[0_0_15px_rgba(127,0,255,0.6)]" strokeWidth={1.5} />
                    </div>
                </div>
            </motion.div>

            <h3 className="text-lg font-black text-white mb-2 tracking-wide">{title}</h3>
            {description && (
                <p className="text-sm text-gray-600 max-w-[250px] leading-relaxed">{description}</p>
            )}

            {action && <div className="mt-5">{action}</div>}
        </motion.div>
    );
};
