import { useState, useEffect, useRef } from 'react';

interface AnimatedNumberProps {
    value: number;
    visible?: boolean;
    duration?: number;
    formatOptions?: Intl.NumberFormatOptions;
    locale?: string;
    className?: string;
    placeholder?: string;
}

export const AnimatedNumber = ({
    value,
    visible = true,
    duration = 1200,
    formatOptions,
    locale,
    className = '',
    placeholder = '•••••'
}: AnimatedNumberProps) => {
    const [display, setDisplay] = useState(0);
    const animRef = useRef<number>();

    useEffect(() => {
        if (!visible) return;
        const start = performance.now();
        const from = display;

        const animate = (now: number) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 4); // ease-out-quart
            setDisplay(Math.round(from + (value - from) * eased));

            if (progress < 1) {
                animRef.current = requestAnimationFrame(animate);
            }
        };

        animRef.current = requestAnimationFrame(animate);
        return () => {
            if (animRef.current) cancelAnimationFrame(animRef.current);
        };
    }, [value, visible, duration]); // Removed 'display' from dependency array on purpose to capture starting value

    if (!visible) {
        return <span className={className}>{placeholder}</span>;
    }

    return (
        <span className={`tabular-nums ltr-nums ${className}`}>
            {display.toLocaleString(locale, formatOptions)}
        </span>
    );
};
