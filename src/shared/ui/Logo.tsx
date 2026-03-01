import { motion } from 'framer-motion';

interface LogoProps {
    className?: string;
    showText?: boolean;
    animated?: boolean;
    size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Logo = ({ className = '', showText = false, animated = false, size = 'md' }: LogoProps) => {
    const sizeMap = {
        sm: 'w-6 h-6',
        md: 'w-10 h-10',
        lg: 'w-16 h-16',
        xl: 'w-24 h-24'
    };

    const containerSize = sizeMap[size];

    return (
        <div className={`flex items-center gap-3 ${className}`}>
            <div className={`relative ${containerSize} flex-shrink-0`}>
                {animated ? (
                    <>
                        <motion.div
                            animate={{
                                scale: [1, 1.2, 1],
                                opacity: [0.5, 0.8, 0.5],
                            }}
                            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                            className="absolute inset-0 bg-gradient-to-tr from-primary via-purple-500 to-cyan-400 blur-lg rounded-full"
                        />
                        <svg
                            className="relative z-10 w-full h-full drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]"
                            viewBox="0 0 100 100"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <defs>
                                <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor="#fff" />
                                    <stop offset="50%" stopColor="#e2e8f0" />
                                    <stop offset="100%" stopColor="#94a3b8" />
                                </linearGradient>
                            </defs>
                            <motion.path
                                d="M30 80 V20 C30 20, 55 20, 65 25 C75 30, 80 40, 75 50 C70 60, 55 65, 45 65 H30"
                                stroke="url(#logoGrad)"
                                strokeWidth="12"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                initial={{ pathLength: 0 }}
                                animate={{ pathLength: 1 }}
                                transition={{ duration: 2, ease: "easeInOut" }}
                            />
                            <motion.circle
                                cx="50"
                                cy="42"
                                r="8"
                                fill="url(#logoGrad)"
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: 1.5, duration: 0.5, ease: "backOut" }}
                            />
                        </svg>
                    </>
                ) : (
                    <svg
                        className="w-full h-full drop-shadow-md"
                        viewBox="0 0 100 100"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <defs>
                            <linearGradient id="logoGradStatic" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#fff" />
                                <stop offset="100%" stopColor="#e2e8f0" />
                            </linearGradient>
                        </defs>
                        <path
                            d="M30 80 V20 C30 20, 55 20, 65 25 C75 30, 80 40, 75 50 C70 60, 55 65, 45 65 H30"
                            stroke="url(#logoGradStatic)"
                            strokeWidth="12"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                        <circle cx="50" cy="42" r="8" fill="url(#logoGradStatic)" />
                    </svg>
                )}
            </div>

            {showText && (
                <span className="text-xl font-black tracking-tight text-white drop-shadow-sm uppercase">
                    PBank
                </span>
            )}
        </div>
    );
};
