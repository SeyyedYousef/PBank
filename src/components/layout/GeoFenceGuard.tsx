import React from 'react';
import { usePrivacy } from '@/shared/context/PrivacyContext';
import { ShieldAlert, MapPin, Lock } from 'lucide-react';
import { motion } from 'framer-motion';

export const GeoFenceGuard = ({ children }: { children: React.ReactNode }) => {
    const { geoFencingEnabled, isForeignLocation } = usePrivacy();

    if (geoFencingEnabled && isForeignLocation) {
        return (
            <div className="fixed inset-0 z-[9999] bg-red-950/90 backdrop-blur-3xl flex flex-col items-center justify-center p-6 text-center space-y-8">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="w-32 h-32 rounded-full bg-red-500/20 flex items-center justify-center relative"
                >
                    <div className="absolute inset-0 rounded-full border-4 border-red-500/30 animate-ping" />
                    <ShieldAlert className="w-16 h-16 text-red-500" />
                </motion.div>

                <div>
                    <h1 className="text-3xl font-black text-white mb-2">دسترسی مسدود شد</h1>
                    <p className="text-red-200 text-lg">
                        دسترسی به برنامه در خارج از کشور غیرفعال است.
                    </p>
                </div>

                <div className="bg-black/40 rounded-2xl p-6 border border-red-500/20 w-full max-w-sm">
                    <div className="flex items-center gap-4 mb-4">
                        <MapPin className="w-6 h-6 text-red-400" />
                        <div className="text-right">
                            <p className="font-bold text-white">موقعیت شناسایی شده</p>
                            <p className="text-xs text-red-300">هامبورگ، آلمان (IP: 192.168.x.x)</p>
                        </div>
                    </div>
                    <div className="h-px bg-red-500/20 my-4" />
                    <p className="text-xs text-red-300 leading-relaxed text-right">
                        سیستم Geo-Fencing فعال است و اجازه دسترسی خارج از محدوده مجاز را نمی‌دهد. برای دسترسی، باید به موقعیت مجاز بازگردید یا با پشتیبانی تماس بگیرید.
                    </p>
                </div>

                <div className="flex items-center gap-2 text-white/40 text-sm">
                    <Lock className="w-4 h-4" />
                    <span>Security Activated</span>
                </div>
            </div>
        );
    }

    return <>{children}</>;
};
