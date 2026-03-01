import React from 'react';
import { motion } from 'framer-motion';
import { MotionSystem } from './motion-system';

interface PageTransitionProps {
    children: React.ReactNode;
    className?: string;
}

export const PageTransition: React.FC<PageTransitionProps> = ({ children, className = "" }) => {
    return (
        <motion.div
            initial="initial"
            animate="animate"
            exit="exit"
            variants={MotionSystem.pageTransition}
            className={`w-full min-h-screen ${className}`}
            style={{ willChange: 'transform, opacity' }} // Hint for GPU
        >
            {children}
        </motion.div>
    );
};
