import React, { useState, useEffect } from 'react';
import { Delete } from 'lucide-react';
import { motion } from 'framer-motion';

interface SecureNumPadProps {
    onKeyPress: (key: string) => void;
    onDelete: () => void;
    randomize?: boolean;
}

export const SecureNumPad = ({ onKeyPress, onDelete, randomize = false }: SecureNumPadProps) => {
    const [keys, setKeys] = useState(['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0']);

    useEffect(() => {
        if (randomize) {
            setKeys(prev => {
                const nums = prev.filter(k => k !== '.');
                const shuffled = [...nums].sort(() => Math.random() - 0.5);
                // Keep dot and 0 usually at bottom, or fully randomize?
                // For better UX, let's keep 0 at bottom center usually, but "randomize" requested means full security.
                // Let's shuffle all digits 0-9.
                return shuffled;
            });
        }
    }, [randomize]);

    const renderKey = (key: string) => (
        <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => onKeyPress(key)}
            className="h-14 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-xl font-bold text-white hover:bg-white/10 active:bg-primary/20 transition-colors"
        >
            {key}
        </motion.button>
    );

    return (
        <div className="grid grid-cols-3 gap-3 p-4 bg-black/40 backdrop-blur-md rounded-t-3xl border-t border-white/10 select-none">
            {/* Standard layout logic or randomized */}
            {!randomize ? (
                <>
                    {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map(k => (
                        <React.Fragment key={k}>{renderKey(k)}</React.Fragment>
                    ))}
                    {renderKey('.')}
                    {renderKey('0')}
                </>
            ) : (
                // Fully randomized grid for high security
                keys.map(k => (
                    <React.Fragment key={k}>{renderKey(k)}</React.Fragment>
                ))
            )}

            <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={onDelete}
                className="h-14 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 hover:bg-red-500/20 active:bg-red-500/30 transition-colors"
            >
                <Delete className="w-6 h-6" />
            </motion.button>
        </div>
    );
};
