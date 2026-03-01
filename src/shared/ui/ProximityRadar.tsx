import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Smartphone, Wifi } from 'lucide-react';
import { Button } from './Button';

interface NearbyUser {
    id: string;
    name: string;
    distance: number; // meters
    avatar?: string;
}

interface ProximityRadarProps {
    onSelectUser: (user: NearbyUser) => void;
    onCancel: () => void;
}

export const ProximityRadar = ({ onSelectUser, onCancel }: ProximityRadarProps) => {
    const [scanning, setScanning] = useState(true);
    const [users, setUsers] = useState<NearbyUser[]>([]);

    useEffect(() => {
        // Mock scanning effect
        const timer = setTimeout(() => {
            setUsers([
                { id: '1', name: 'Sara Kamali', distance: 2.5 },
                { id: '2', name: 'Reza Ahmadi', distance: 5.0 },
                { id: '3', name: 'Unknown User (0x7F...2A)', distance: 8.2 },
            ]);
            setScanning(false);
        }, 3000);

        return () => clearTimeout(timer);
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl p-6"
        >
            <div className="w-full max-w-sm flex flex-col items-center gap-8 relative">
                <Button onClick={onCancel} variant="secondary" className="absolute top-0 right-0 z-20 rounded-full w-10 h-10 p-0 flex items-center justify-center bg-white/10 hover:bg-white/20">
                    ✕
                </Button>

                <div className="text-center space-y-2">
                    <h2 className="text-2xl font-bold text-white flex items-center justify-center gap-2">
                        <Wifi className="w-6 h-6 text-primary animate-pulse" />
                        جستجوی اطراف
                    </h2>
                    <p className="text-gray-400 text-sm">در حال پیدا کردن کاربران نزدیک...</p>
                </div>

                {/* Radar Visual */}
                <div className="relative w-72 h-72 flex items-center justify-center">
                    {/* Ripple Rings */}
                    {[1, 2, 3].map((i) => (
                        <motion.div
                            key={i}
                            className="absolute inset-0 border border-primary/20 rounded-full"
                            animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
                            transition={{ duration: 2, repeat: Infinity, delay: i * 0.5, ease: "easeOut" }}
                        />
                    ))}

                    {/* Central Emitter */}
                    <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center border border-primary/50 shadow-[0_0_30px_rgba(124,58,237,0.4)] z-10 relative">
                        <Smartphone className="w-8 h-8 text-white" />
                        <div className="absolute inset-0 rounded-full border border-primary/40 animate-[spin_4s_linear_infinite] border-t-transparent border-l-transparent" />
                    </div>

                    {/* Found Users */}
                    <AnimatePresence>
                        {users.map((user, index) => (
                            <motion.button
                                key={user.id}
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 1 }}
                                whileHover={{ scale: 1.1 }}
                                onClick={() => onSelectUser(user)}
                                className="absolute flex flex-col items-center gap-1"
                                style={{
                                    top: `${50 + Math.sin(index * 2) * 35}%`,
                                    left: `${50 + Math.cos(index * 2) * 35}%`,
                                }}
                            >
                                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-emerald-500 to-emerald-400 p-[2px] shadow-[0_0_20px_rgba(16,185,129,0.5)]">
                                    <div className="w-full h-full rounded-full bg-black flex items-center justify-center">
                                        <User className="w-6 h-6 text-emerald-400" />
                                    </div>
                                </div>
                                <span className="text-[10px] font-bold text-white bg-black/50 px-2 py-0.5 rounded-full backdrop-blur-sm whitespace-nowrap">
                                    {user.name}
                                </span>
                            </motion.button>
                        ))}
                    </AnimatePresence>
                </div>

                <div className="text-center">
                    {scanning ? (
                        <span className="text-primary-glow text-sm animate-pulse font-mono tracking-widest">SCANNING_NET...</span>
                    ) : (
                        <span className="text-emerald-400 text-sm font-bold">{users.length} کاربر پیدا شد</span>
                    )}
                </div>
            </div>
        </motion.div>
    );
};
