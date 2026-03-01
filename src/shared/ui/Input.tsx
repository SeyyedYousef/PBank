import React from 'react';
import { cn } from '@/shared/lib/utils';
import { motion } from 'framer-motion';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    icon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, label, error, icon, id, ...props }, ref) => {
        const inputId = id || `input-${React.useId()}`;
        const errorId = error ? `${inputId}-error` : undefined;

        return (
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative w-full group"
            >
                {label && (
                    <label
                        htmlFor={inputId}
                        className="block text-sm font-bold text-gray-400 mb-2 mr-1 group-focus-within:text-primary-glow transition-colors"
                    >
                        {label}
                    </label>
                )}
                <div className="relative">
                    <input
                        ref={ref}
                        id={inputId}
                        aria-invalid={!!error}
                        aria-describedby={errorId}
                        className={cn(
                            "w-full h-[60px] bg-white/5 border border-white/10 rounded-[20px] px-5 text-white placeholder:text-gray-600 focus:outline-none focus:border-primary-glow/50 focus:bg-[#0f0a18] focus:shadow-[0_0_20px_rgba(127,0,255,0.2)] transition-all font-sans dir-ltr",
                            "focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                            icon && "pl-12",
                            error && "border-error/50 focus:border-error bg-error/5",
                            className
                        )}
                        {...props}
                    />
                    {icon && (
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-primary-glow transition-colors" aria-hidden="true">
                            {icon}
                        </div>
                    )}
                </div>
                {error && (
                    <span id={errorId} role="alert" className="text-xs text-error mt-2 mr-1 block font-medium">{error}</span>
                )}
            </motion.div>
        );
    }
);

Input.displayName = "Input";
