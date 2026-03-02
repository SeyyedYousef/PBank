import { motion } from 'framer-motion';
import { Bell, Key, Wallet, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useSound } from '@/shared/hooks/useSound';

export const SettingsSection = () => {
    const { t, i18n } = useTranslation();
    const { playClick } = useSound();

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
        >
            {/* Language Switcher */}
            <div className="omega-glass rounded-[24px] p-5 space-y-4">
                <p className="text-gray-400 text-[10px] font-bold uppercase tracking-wider">{t('settings.language', 'زبان برنامه')}</p>
                <div className="grid grid-cols-3 gap-3">
                    {[
                        { code: 'fa', name: 'فارسی', flag: '🇮🇷' },
                        { code: 'en', name: 'English', flag: '🇬🇧' },
                        { code: 'ps', name: 'پشتو', flag: '🇦🇫' },
                    ].map(lang => (
                        <button
                            key={lang.code}
                            onClick={() => { i18n.changeLanguage(lang.code); playClick(); }}
                            className={`flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all group ${i18n.language === lang.code ? 'bg-primary/10 border-primary/40 shadow-[0_0_20px_rgba(127,0,255,0.1)]' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}
                        >
                            <span className="text-3xl group-hover:scale-125 transition-transform">{lang.flag}</span>
                            <span className="text-white text-xs font-bold">{lang.name}</span>
                        </button>
                    ))}
                </div>
            </div>



            {/* More Settings */}
            <div className="omega-glass rounded-[24px] overflow-hidden divide-y divide-white/5">
                {[
                    { icon: <Bell className="text-blue-400" />, title: t('settings.notifications_label', 'اعلان‌ها'), desc: t('settings.notifications_desc', 'مدیریت نوتیفیکیشن‌ها') },
                    { icon: <Key className="text-amber-400" />, title: t('settings.change_password', 'تغییر رمز عبور'), desc: t('settings.password_desc', 'به‌روزرسانی رمز امنیتی') },
                    { icon: <Wallet className="text-emerald-400" />, title: t('settings.bank_accounts', 'حساب‌های بانکی'), desc: t('settings.accounts_desc', 'حساب‌های متصل') },
                ].map((item, i) => (
                    <motion.button
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors text-right"
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
                        <ChevronRight className="w-4 h-4 text-gray-600 rtl:rotate-180" />
                    </motion.button>
                ))}
            </div>

            <div className="text-center py-4">
                <p className="text-gray-700 text-[10px] font-mono">PBank v2.0.0 • Build 2026.02</p>
            </div>
        </motion.div>
    );
};
