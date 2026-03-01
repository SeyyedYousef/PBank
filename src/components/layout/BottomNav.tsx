
import { NavLink } from 'react-router-dom';
import { Home, History, Grid, User } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { useTranslation } from 'react-i18next';

export const BottomNav = () => {
    const { t } = useTranslation();
    const navItems = [
        { icon: Home, label: t('nav.home'), path: '/' },
        { icon: History, label: t('nav.history'), path: '/history' },
        { icon: Grid, label: t('nav.services'), path: '/services' },
        { icon: User, label: t('nav.profile'), path: '/profile' },
    ];

    return (
        <nav
            aria-label={t('nav.mainNavigation', 'ناوبری اصلی')}
            role="navigation"
            className={cn(
                "glass-heavy rounded-full px-6 py-3 flex items-center gap-8",
                "shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] border-white/10"
            )}
        >
            {navItems.map((item) => (
                <NavLink
                    key={item.path}
                    to={item.path}
                    aria-label={item.label}
                    className={({ isActive }) => cn(
                        "relative px-3 py-2 rounded-xl transition-all duration-300 flex flex-col items-center gap-1",
                        "hover:bg-white/5",
                        "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                        isActive ? "text-primary-glow" : "text-gray-400"
                    )}
                >
                    {({ isActive }) => (
                        <>
                            <item.icon
                                className={cn("w-5 h-5", isActive && "drop-shadow-[0_0_8px_rgba(191,85,236,0.6)]")}
                                aria-hidden="true"
                            />
                            <span className={cn("text-[10px] font-bold", isActive ? "opacity-100" : "opacity-70")}>
                                {item.label}
                            </span>
                            {isActive && (
                                <span className="absolute -top-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary-glow rounded-full" aria-hidden="true" />
                            )}
                        </>
                    )}
                </NavLink>
            ))}
        </nav>
    );
};
