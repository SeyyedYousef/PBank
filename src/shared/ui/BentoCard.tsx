import React from 'react';
import { cn } from '@/shared/lib/utils';
import { motion, HTMLMotionProps } from 'framer-motion';

interface BentoCardProps extends HTMLMotionProps<"div"> {
    children: React.ReactNode;
    className?: string;
    variant?: 'default' | 'heavy' | 'panel' | 'glass';
}

import { useFeedback } from '@/shared/hooks/useFeedback';

export const BentoCard = React.forwardRef<HTMLDivElement, BentoCardProps>(
    ({ className, children, variant = 'default', onClick, ...props }, ref) => {
        const { trigger } = useFeedback();

        const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
            if (onClick) {
                trigger('click');
                onClick(e);
            }
        };

        const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
            if (onClick && (e.key === 'Enter' || e.key === ' ')) {
                e.preventDefault();
                handleClick(e as any);
            }
        };

        return (
            <motion.div
                ref={ref}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleClick}
                onKeyDown={handleKeyDown}
                role={onClick ? "button" : undefined}
                tabIndex={onClick ? 0 : undefined}
                transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }} // smooth apple-like ease
                className={cn(
                    "rounded-squircle p-6 relative overflow-hidden outline-none focus-visible:ring-4 focus-visible:ring-primary/50", // Squircle-ish
                    variant === 'default' && "glass",
                    variant === 'heavy' && "glass-heavy",
                    variant === 'panel' && "glass-panel",
                    variant === 'glass' && "glass bg-amber-500/5 border-amber-500/20", // Special gold glass
                    className
                )}
                {...props}
            >
                {/* Subtle sheen effect */}
                <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent pointer-events-none" />
                <div className="relative z-10 h-full">
                    {children}
                </div>
            </motion.div>
        );
    }
);

BentoCard.displayName = "BentoCard";
