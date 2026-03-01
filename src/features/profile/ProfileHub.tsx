import React from 'react';
import { motion } from 'framer-motion';
import {
    Shield, Globe, Bell, Smartphone, ChevronRight, Key, Moon
} from 'lucide-react';

// Components
import { MembershipCard } from '../gamification/MembershipCard';

import { useNavigate } from 'react-router-dom';
import { useSound } from '@/shared/hooks/useSound';
import { useTranslation } from 'react-i18next';

export const ProfileHub: React.FC = () => {
    const navigate = useNavigate();
    const { playClick } = useSound();
    const { t } = useTranslation();

    const handleItemClick = (title: string) => {
        playClick();
        // Here we would typically toggle state or navigate
        console.log(`Clicked on ${title}`);
    };

    const settingsGroups = [
        {
            title: t('profile.hub.groups.security'),
            items: [
                { icon: <Key className="text-emerald-400" />, title: t('profile.hub.items.password'), desc: t('profile.hub.desc.password') },
                { icon: <Shield className="text-emerald-400" />, title: t('profile.hub.items.auth_2fa'), desc: t('profile.hub.desc.auth_2fa'), status: "Active" },
                { icon: <Smartphone className="text-emerald-400" />, title: t('profile.hub.items.devices'), desc: t('profile.hub.desc.devices') },
            ]
        },
        {
            title: t('profile.hub.groups.general'),
            items: [
                { icon: <Globe className="text-blue-400" />, title: t('profile.hub.items.language'), desc: t('profile.hub.desc.language') },
                { icon: <Moon className="text-blue-400" />, title: t('profile.hub.items.appearance'), desc: t('profile.hub.desc.appearance') },
                { icon: <Bell className="text-blue-400" />, title: t('profile.hub.items.notifications'), desc: t('profile.hub.desc.notifications') },
            ]
        }
    ];

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-700">

            {/* Membership Card - Top Priority */}
            <section>
                <div className="flex items-center justify-between mb-4 px-1">
                    <h3 className="text-white font-bold text-lg">{t('profile.hub.user_status')}</h3>
                    <button
                        onClick={() => {
                            playClick();
                            navigate('/rewards');
                        }}
                        className="text-primary text-xs font-bold hover:text-primary-glow transition-colors"
                    >
                        {t('profile.hub.level_benefits')}
                    </button>
                </div>
                <button
                    type="button"
                    onClick={() => {
                        playClick();
                        navigate('/rewards');
                    }}
                    className="w-full text-right cursor-pointer transition-transform active:scale-95 focus:outline-none focus-visible:ring-4 focus-visible:ring-primary/50 rounded-3xl"
                >
                    <MembershipCard />
                </button>
            </section>

            {/* Account Grid */}
            <section className="space-y-6">
                {settingsGroups.map((group, groupIdx) => (
                    <div key={groupIdx}>
                        <h4 className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-3 px-2">{group.title}</h4>
                        <div className="bg-white/5 backdrop-blur-md border border-white/5 rounded-[32px] overflow-hidden">
                            {group.items.map((item, i) => (
                                <motion.div
                                    key={i}
                                    whileHover={{ backgroundColor: "rgba(255,255,255,0.08)" }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => handleItemClick(item.title)}
                                    role="button"
                                    tabIndex={0}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' || e.key === ' ') {
                                            e.preventDefault();
                                            handleItemClick(item.title);
                                        }
                                    }}
                                    className={`
                                        flex items-center justify-between p-5 cursor-pointer outline-none focus-visible:bg-white/10
                                        ${i !== group.items.length - 1 ? 'border-b border-white/5' : ''}
                                    `}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-2xl bg-black/40 flex items-center justify-center border border-white/5">
                                            {React.cloneElement(item.icon as React.ReactElement, { size: 20 })}
                                        </div>
                                        <div>
                                            <h5 className="text-white font-bold text-sm tracking-wide">{item.title}</h5>
                                            <p className="text-gray-500 text-xs mt-0.5">{item.desc}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        {item.status === 'Active' && (
                                            <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-bold px-2 py-1 rounded-full border border-emerald-500/20">
                                                {t('profile.hub.status.active')}
                                            </span>
                                        )}
                                        <ChevronRight className="w-4 h-4 text-gray-600 rtl:rotate-180" />
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                ))}
            </section>

            <div className="flex justify-center pb-4">
                <span className="text-gray-600 text-[10px] font-mono">PBank v1.0.2 (Build 2024.01)</span>
            </div>

        </div>
    );
};
