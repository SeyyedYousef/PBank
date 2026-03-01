import { motion } from 'framer-motion';

export const RouteLoader = () => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="relative flex flex-col items-center">
                <motion.div
                    className="w-12 h-12 rounded-full border-2 border-white/20 border-t-white"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
            </div>
        </div>
    );
};
