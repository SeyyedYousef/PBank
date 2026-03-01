import { Outlet } from 'react-router-dom';
import { BottomNav } from './BottomNav';
import { motion } from 'framer-motion';
import { MotionSystem } from '@/shared/ui/motion-system';

export const MainLayout = () => {
    return (
        // Wrapper needs to be relative to contain the fixed background
        <div className="relative w-full min-h-screen">
            {/* Fixed Background Layer - Aurora Borealis Style */}
            <div className="fixed inset-0 z-[-1] bg-[#05040A] overflow-hidden">
                {/* Moving Gradient Mesh */}
                <div className="absolute inset-0 opacity-40 animate-aurora bg-[radial-gradient(circle_at_50%_50%,_#7F00FF_0%,_transparent_50%),_radial-gradient(circle_at_0%_0%,_#BF55EC_0%,_transparent_40%),_radial-gradient(circle_at_100%_100%,_#120B1F_0%,_transparent_60%)]" />

                {/* Floating Orbs for Depth */}
                <div className="absolute top-[10%] left-[20%] w-64 h-64 bg-primary/30 blur-[100px] rounded-full animate-float" style={{ animationDelay: '0s' }} />
                <div className="absolute bottom-[20%] right-[10%] w-72 h-72 bg-[#BF55EC]/20 blur-[120px] rounded-full animate-float" style={{ animationDelay: '-4s' }} />

                {/* Noise Overlay for Texture */}
                <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] brightness-100 contrast-150" />
            </div>

            {/* Scrollable Content */}
            <div className="max-w-md mx-auto min-h-screen pb-28 px-0 relative z-10">
                <motion.div
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    variants={MotionSystem.pageTransition}
                    className="w-full"
                >
                    <Outlet />
                </motion.div>
            </div>

            {/* Floating Nav */}
            <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center pb-5 pointer-events-none">
                <div className="pointer-events-auto">
                    <BottomNav />
                </div>
            </div>
        </div>
    );
};
