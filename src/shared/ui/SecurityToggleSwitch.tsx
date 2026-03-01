import { motion } from 'framer-motion';

interface SecurityToggleSwitchProps {
    enabled: boolean;
    onToggle: () => void;
    color?: 'emerald' | 'primary' | 'blue';
}

export const SecurityToggleSwitch = ({ enabled, onToggle, color = 'emerald' }: SecurityToggleSwitchProps) => {
    const colors: Record<string, string> = {
        emerald: 'bg-emerald-500 shadow-[0_0_20px_rgba(0,255,148,0.3)]',
        primary: 'bg-primary shadow-[0_0_20px_rgba(127,0,255,0.3)]',
        blue: 'bg-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.3)]',
    };

    return (
        <button
            onClick={onToggle}
            className={`relative flex items-center justify-start w-[52px] h-[28px] rounded-full p-[3px] transition-all duration-400 ${enabled ? colors[color] : 'bg-white/10'
                }`}
            aria-checked={enabled}
            role="switch"
            type="button"
        >
            <motion.div
                className="w-[22px] h-[22px] rounded-full bg-white shadow-lg z-10 mx-[2px]"
                animate={{ x: enabled ? 20 : 0 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            />
        </button>
    );
};
