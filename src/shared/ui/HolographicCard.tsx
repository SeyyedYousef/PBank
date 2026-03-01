import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

interface HolographicCardProps {
    className?: string;
    children?: React.ReactNode;
}

export const HolographicCard: React.FC<HolographicCardProps> = ({ className, children }) => {
    const ref = useRef<HTMLDivElement>(null);
    const [hover, setHover] = useState(false);

    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseXSpring = useSpring(x);
    const mouseYSpring = useSpring(y);

    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["12deg", "-12deg"]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-12deg", "12deg"]);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!ref.current) return;

        const rect = ref.current.getBoundingClientRect();

        const width = rect.width;
        const height = rect.height;

        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        const xPct = mouseX / width - 0.5;
        const yPct = mouseY / height - 0.5;

        x.set(xPct);
        y.set(yPct);
    };

    const handleMouseLeave = () => {
        setHover(false);
        x.set(0);
        y.set(0);
    };

    return (
        <motion.div
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={handleMouseLeave}
            style={{
                rotateX,
                rotateY,
                transformStyle: "preserve-3d",
            }}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className={`relative w-full aspect-[1.586] rounded-[24px] cursor-pointer group perspective-1000 ${className}`}
        >
            {/* 3D Hardware Layer */}
            <div
                className="absolute inset-0 rounded-[24px] bg-[#0A0A0A] border border-white/10 shadow-2xl overflow-hidden"
                style={{ transform: "translateZ(0px)" }}
            >
                {/* Deep Space Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#1a0b2e] via-[#05040A] to-[#0f0518]" />

                {/* Nebula Glows */}
                <div className="absolute top-0 right-0 w-[80%] h-[80%] bg-[#7F00FF]/20 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/4" />
                <div className="absolute bottom-0 left-0 w-[60%] h-[60%] bg-[#BF55EC]/10 rounded-full blur-[60px] translate-y-1/3 -translate-x-1/4" />

                {/* Grid Pattern Overlay */}
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />

                {/* Holographic Shine Effect - Moves with mouse */}
                <motion.div
                    className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent z-20 pointer-events-none"
                    style={{
                        opacity: hover ? 0.4 : 0,
                        x: useTransform(mouseXSpring, [-0.5, 0.5], ["-50%", "50%"]),
                        y: useTransform(mouseYSpring, [-0.5, 0.5], ["-50%", "50%"]),
                    }}
                />

                {/* Glass Reflection */}
                <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none z-30" />

                {/* Content Layer - Projected forward */}
                <div
                    className="absolute inset-0 p-6 flex flex-col justify-between z-40"
                    style={{ transform: "translateZ(30px)" }}
                >
                    {children}
                </div>
            </div>
        </motion.div>
    );
};
