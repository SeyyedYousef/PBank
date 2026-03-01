import { motion } from 'framer-motion';
import { Shield, Fingerprint, Lock, Globe, Smartphone } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { usePrivacy } from '@/shared/context/PrivacyContext';
import { useAuthStore } from '@/store/authStore';
import { useSound } from '@/shared/hooks/useSound';
import { SecurityToggleSwitch } from '@/shared/ui/SecurityToggleSwitch';

export const SecuritySection = () => {
    const { t } = useTranslation();
    const { playClick } = useSound();
    const { is2faEnabled, toggle2fa } = useAuthStore();
    const { biometricEnabled, toggleBiometric, incognitoKeyboardEnabled, toggleIncognitoKeyboard, geoFencingEnabled, toggleGeoFencing } = usePrivacy();

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
        >
            {/* Security Score */}
            <div className="omega-glass rounded-[24px] p-5 relative overflow-hidden scan-line-overlay">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent" />
                <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                                <Shield className="w-5 h-5 text-emerald-400" />
                            </div>
                            <div>
                                <p className="text-white font-bold text-sm">{t('settings.security', 'مرکز امنیت')}</p>
                                <p className="text-gray-500 text-[10px]">{t('profile.hub.groups.security', 'سطح حفاظت حساب')}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/20">
                            <Shield className="w-3 h-3 text-emerald-400" />
                            <span className="text-emerald-400 text-[10px] font-black">
                                {[biometricEnabled, incognitoKeyboardEnabled, geoFencingEnabled, is2faEnabled].filter(Boolean).length}/4
                            </span>
                        </div>
                    </div>

                    {/* Security level bar */}
                    <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-gradient-to-r from-emerald-500 to-emerald-300 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${(([biometricEnabled, incognitoKeyboardEnabled, geoFencingEnabled, is2faEnabled].filter(Boolean).length) / 4) * 100}%` }}
                            transition={{ duration: 1 }}
                        />
                    </div>
                </div>
            </div>

            {/* Security Toggles */}
            <div className="omega-glass rounded-[24px] overflow-hidden divide-y divide-white/5">
                {[
                    {
                        icon: <Fingerprint className={biometricEnabled ? 'text-emerald-400' : 'text-gray-500'} />,
                        title: t('settings.biometric', 'اثر انگشت / Face ID'),
                        desc: t('settings.biometric_desc', 'تایید بیومتریک برای هر تراکنش'),
                        enabled: biometricEnabled,
                        onToggle: toggleBiometric,
                    },
                    {
                        icon: <Shield className={is2faEnabled ? 'text-emerald-400' : 'text-gray-500'} />,
                        title: t('profile.hub.items.auth_2fa', 'تایید دو مرحله‌ای (2FA)'),
                        desc: t('profile.hub.desc.auth_2fa', 'امنیت بیشتر هنگام ورود'),
                        enabled: is2faEnabled,
                        onToggle: toggle2fa,
                    },
                    {
                        icon: <Lock className={incognitoKeyboardEnabled ? 'text-emerald-400' : 'text-gray-500'} />,
                        title: t('settings.secure_keyboard', 'کیبورد امن'),
                        desc: t('settings.secure_keyboard_desc', 'صفحه‌کلید تصادفی داخلی'),
                        enabled: incognitoKeyboardEnabled,
                        onToggle: toggleIncognitoKeyboard,
                    },
                    {
                        icon: <Globe className={geoFencingEnabled ? 'text-emerald-400' : 'text-gray-500'} />,
                        title: t('settings.geofencing', 'محدودیت جغرافیایی'),
                        desc: t('settings.geofencing_desc', 'قفل خودکار خارج از مرزها'),
                        enabled: geoFencingEnabled,
                        onToggle: toggleGeoFencing,
                    },
                ].map((item, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.08 }}
                        className="flex items-center justify-between p-4 hover:bg-white/5 transition-colors"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/5">
                                {item.icon}
                            </div>
                            <div>
                                <p className="text-white font-bold text-sm">{item.title}</p>
                                <p className="text-gray-500 text-[10px]">{item.desc}</p>
                            </div>
                        </div>
                        <SecurityToggleSwitch enabled={item.enabled} onToggle={() => { item.onToggle(); playClick(); }} />
                    </motion.div>
                ))}
            </div>

            {/* Active Sessions */}
            <div className="omega-glass rounded-[24px] p-5 space-y-4">
                <div className="flex items-center justify-between">
                    <p className="text-gray-400 text-[10px] font-bold uppercase tracking-wider">{t('settings.devices', 'نشست‌های فعال')}</p>
                    <span className="bg-emerald-500/15 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-full">3 دستگاه</span>
                </div>

                {/* Mini Map */}
                <div className="w-full h-36 bg-gradient-to-br from-blue-900/20 to-purple-900/10 rounded-2xl border border-white/10 relative overflow-hidden">
                    <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 200 100" preserveAspectRatio="none">
                        <path d="M0 100 L30 70 L60 85 L90 60 L120 75 L150 50 L180 65 L200 40 L200 100 Z" fill="currentColor" className="text-blue-500/30" />
                    </svg>

                    {/* Device pins */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                        <div className="relative">
                            <div className="w-3.5 h-3.5 rounded-full bg-emerald-500 animate-ping absolute inset-0" />
                            <div className="w-3.5 h-3.5 rounded-full bg-emerald-500 relative z-10 border-2 border-white shadow" />
                        </div>
                        <span className="text-[8px] font-bold text-white mt-1 bg-black/60 px-1.5 rounded">کابل</span>
                    </div>
                    <div className="absolute top-1/3 left-1/4 flex flex-col items-center opacity-60">
                        <div className="w-2.5 h-2.5 rounded-full bg-gray-400 border border-white shadow" />
                        <span className="text-[7px] text-gray-400 mt-0.5">مشهد</span>
                    </div>
                    <div className="absolute top-2/3 right-1/4 flex flex-col items-center opacity-40">
                        <div className="w-2.5 h-2.5 rounded-full bg-gray-500 border border-white shadow" />
                        <span className="text-[7px] text-gray-500 mt-0.5">شیراز</span>
                    </div>
                </div>

                {/* Session list */}
                <div className="space-y-2">
                    {[
                        { name: 'iPhone 15 Pro', location: 'کابل', status: 'فعال', active: true },
                        { name: 'Windows 11', location: 'مشهد', status: '۲ ساعت پیش', active: false },
                        { name: 'Samsung S21', location: 'شیراز', status: '۵ روز پیش', active: false },
                    ].map((session, i) => (
                        <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                            <div className="flex items-center gap-3">
                                <Smartphone className={`w-4 h-4 ${session.active ? 'text-emerald-400' : 'text-gray-500'}`} />
                                <div>
                                    <p className="text-white text-xs font-bold">{session.name}</p>
                                    <p className="text-gray-500 text-[10px]">{session.location}</p>
                                </div>
                            </div>
                            <span className={`text-[10px] font-bold ${session.active ? 'text-emerald-400' : 'text-gray-600'}`}>
                                {session.active && <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1 animate-pulse" />}
                                {session.status}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </motion.div>
    );
};
