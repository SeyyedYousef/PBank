import { motion } from 'framer-motion';

interface SecurityToggleSwitchProps {
    enabled: boolean;
    onToggle: () => void;
    color?: 'emerald' | 'primary' | 'blue';
}

export const SecurityToggleSwitch = ({ enabled, onToggle, color = 'emerald' }: SecurityToggleSwitchProps) => {
    const colors: Record<string, string> = {
        emerald: 'bg-emerald-500',
        primary: 'bg-primary',
        blue: 'bg-blue-500',
    };

    return (
        <button
            onClick={onToggle}
            className={`omega-toggle ${enabled ? 'active' : ''}`}
            style={enabled ? { background: `linear-gradient(135deg, var(--tw-gradient-from), var(--tw-gradient-to))` } : {}}
            aria-checked={enabled}
            role="switch"
        >
            <div
                className={`omega-toggle relative w-[52px] h-[28px] rounded-full p-[3px] transition-all duration-400 ${enabled ? `${colors[color]} shadow-[0_0_20px_rgba(0,255,148,0.3)]` : 'bg-white/10'
                    }`}
            >
                <motion.div
                    className="w-[22px] h-[22px] rounded-full bg-white shadow-lg end-[auto]"
                    animate={{ x: enabled ? 24 : 0 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
            </div>
        </button>
    );
};
