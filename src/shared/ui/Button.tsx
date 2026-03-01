import React from 'react';
import { cn } from '@/shared/lib/utils';
import { motion, HTMLMotionProps } from 'framer-motion';

interface ButtonProps extends HTMLMotionProps<"button"> {
    variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'glass';
    size?: 'sm' | 'md' | 'lg' | 'icon';
    isLoading?: boolean;
}

import { MotionSystem } from '@/shared/ui/motion-system';
import { useFeedback } from '@/shared/hooks/useFeedback';

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', size = 'md', isLoading, children, onClick, ...props }, ref) => {
        const { trigger } = useFeedback();

        const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
            trigger('click');
            onClick?.(e);
        };

        return (
            <motion.button
                ref={ref}
                variants={MotionSystem.buttonTap}
                whileHover="hover"
                whileTap="tap"
                onClick={handleClick}
                aria-disabled={isLoading || props.disabled}
                aria-busy={isLoading}
                className={cn(
                    "relative inline-flex items-center justify-center rounded-[20px] font-bold transition-colors disabled:opacity-50 disabled:pointer-events-none overflow-hidden",
                    "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",

                    // Variants
                    variant === 'primary' && "bg-gradient-to-br from-primary to-[#6000C0] text-white shadow-[0_0_20px_rgba(127,0,255,0.4)] hover:shadow-[0_0_30px_rgba(127,0,255,0.6)] border border-white/10",
                    variant === 'secondary' && "glass-panel text-white hover:bg-white/10 border border-primary/30",
                    variant === 'glass' && "bg-white/5 backdrop-blur-md border border-white/10 text-white hover:bg-white/10 shadow-sm",
                    variant === 'ghost' && "bg-transparent text-primary-glow hover:bg-white/5",
                    variant === 'danger' && "bg-error/10 text-error border border-error/20 hover:bg-error/20",

                    // Sizes
                    size === 'sm' && "h-10 px-5 text-sm",
                    size === 'md' && "h-[56px] px-8 text-base",
                    size === 'lg' && "h-16 px-10 text-lg",
                    size === 'icon' && "h-[56px] w-[56px] p-0",

                    className
                )}
                disabled={isLoading || props.disabled}
                {...props}
            >
                {isLoading ? (
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/20 border-t-white" role="status" aria-label="در حال بارگذاری" />
                ) : (
                    children
                )}
            </motion.button>
        );
    }
);

Button.displayName = "Button";
