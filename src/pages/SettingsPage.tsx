import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PageTransition } from '@/shared/ui/PageTransition';
import {
    ArrowLeft, Moon, Sun, Globe, Bell, BellOff, Lock, KeyRound,
    Trash2, Shield, Fingerprint, Eye, EyeOff, ChevronLeft,
    Smartphone, FileText, HelpCircle, Star, LogOut
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@/shared/context/ThemeContext';
import { usePrivacy } from '@/shared/context/PrivacyContext';
import { useTranslation } from 'react-i18next';

type Section = 'main' | 'password' | 'language' | 'about';

export const SettingsPage = () => {
    const navigate = useNavigate();
    const { theme, setTheme } = useTheme();
    const { biometricEnabled, setBiometric, incognitoKeyboardEnabled, setIncognitoKeyboard } = usePrivacy();
    const { t, i18n } = useTranslation();
    const [section, setSection] = useState<Section>('main');
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    // Change Password state
    const [currentPass, setCurrentPass] = useState('');
    const [newPass, setNewPass] = useState('');
    const [confirmPass, setConfirmPass] = useState('');
    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [passChanged, setPassChanged] = useState(false);

    const changePassword = () => {
        if (newPass.length >= 6 && newPass === confirmPass) {
            setPassChanged(true);
            setTimeout(() => {
                setPassChanged(false);
                setSection('main');
                setCurrentPass('');
                setNewPass('');
                setConfirmPass('');
            }, 2000);
        }
    };

    const changeLanguage = (lang: string) => {
        i18n.changeLanguage(lang);
        setSection('main');
    };

    const Toggle = ({ active, onChange, label }: { active: boolean; onChange: () => void; label: string }) => (
        <button
            onClick={onChange}
            className={`omega-toggle ${active ? 'active' : ''}`}
            role="switch"
            aria-checked={active}
            aria-label={label}
        >
            <div className="omega-toggle-knob" />
        </button>
    );

    const SettingRow = ({
        icon: Icon, label, desc, right, onClick, danger
    }: {
        icon: React.ElementType; label: string; desc?: string;
        right?: React.ReactNode; onClick?: () => void; danger?: boolean
    }) => (
        <button
            onClick={onClick}
            className={`w-full flex items-center gap-4 py-4 px-5 group ${onClick ? 'hover:bg-white/[0.02] active:bg-white/[0.04]' : ''} transition-colors`}
        >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${danger ? 'bg-red-500/10 text-red-400' : 'bg-white/5 text-gray-400'
                }`}>
                <Icon className="w-5 h-5" />
            </div>
            <div className="flex-1 text-start">
                <p className={`text-sm font-bold ${danger ? 'text-red-400' : 'text-white'}`}>{label}</p>
                {desc && <p className="text-xs text-gray-500 mt-0.5">{desc}</p>}
            </div>
            {right || (onClick && <ChevronLeft className="w-4 h-4 text-gray-600 rtl:rotate-180" />)}
        </button>
    );

    if (section === 'password') {
        return (
            <PageTransition className="pb-32">
                <div className="sticky top-0 z-40 px-6 py-4 backdrop-blur-xl bg-black/30 border-b border-white/5">
                    <div className="flex items-center gap-3">
                        <button onClick={() => setSection('main')} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center" aria-label={t('common.back')}>
                            <ArrowLeft className="w-4 h-4 text-gray-400 rtl:rotate-180" />
                        </button>
                        <h1 className="text-lg font-bold text-white">{t('settings.change_password')}</h1>
                    </div>
                </div>
                <div className="px-6 mt-6 space-y-5">
                    <AnimatePresence>
                        {passChanged ? (
                            <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-20 space-y-4">
                                <div className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto">
                                    <Lock className="w-8 h-8 text-emerald-400" />
                                </div>
                                <p className="text-emerald-400 font-bold text-lg">{t('settings.password_changed')}</p>
                            </motion.div>
                        ) : (
                            <>
                                {[
                                    { label: t('settings.current_password'), value: currentPass, setter: setCurrentPass, show: showCurrent, toggle: () => setShowCurrent(!showCurrent) },
                                    { label: t('settings.new_password'), value: newPass, setter: setNewPass, show: showNew, toggle: () => setShowNew(!showNew) },
                                    { label: t('settings.confirm_password'), value: confirmPass, setter: setConfirmPass, show: showNew, toggle: () => setShowNew(!showNew) },
                                ].map((field, i) => (
                                    <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                                        <label className="text-xs text-gray-400 font-bold block mb-2">{field.label}</label>
                                        <div className="relative">
                                            <input
                                                type={field.show ? 'text' : 'password'}
                                                value={field.value}
                                                onChange={e => field.setter(e.target.value)}
                                                className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 px-4 pe-12 text-white outline-none focus:border-primary/50 text-sm"
                                            />
                                            <button onClick={field.toggle} className="absolute start-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white" type="button">
                                                {field.show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                            </button>
                                        </div>
                                    </motion.div>
                                ))}
                                {newPass && confirmPass && newPass !== confirmPass && (
                                    <p className="text-red-400 text-xs font-bold">{t('validation.passwords_mismatch')}</p>
                                )}
                                <button
                                    onClick={changePassword}
                                    disabled={!currentPass || newPass.length < 6 || newPass !== confirmPass}
                                    className="w-full py-4 rounded-2xl bg-gradient-to-r from-primary to-purple-600 text-white font-bold text-sm disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-lg shadow-primary/20 mt-4"
                                >
                                    {t('settings.change_password')}
                                </button>
                            </>
                        )}
                    </AnimatePresence>
                </div>
            </PageTransition>
        );
    }

    if (section === 'language') {
        const langs = [
            { code: 'fa', name: 'فارسی', flag: '🇮🇷', native: 'Farsi' },
            { code: 'ps', name: 'پښتو', flag: '🇦🇫', native: 'Pashto' },
            { code: 'en', name: 'English', flag: '🇬🇧', native: 'English' },
        ];
        return (
            <PageTransition className="pb-32">
                <div className="sticky top-0 z-40 px-6 py-4 backdrop-blur-xl bg-black/30 border-b border-white/5">
                    <div className="flex items-center gap-3">
                        <button onClick={() => setSection('main')} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center" aria-label={t('common.back')}>
                            <ArrowLeft className="w-4 h-4 text-gray-400 rtl:rotate-180" />
                        </button>
                        <h1 className="text-lg font-bold text-white">{t('settings.language')}</h1>
                    </div>
                </div>
                <div className="px-6 mt-6 space-y-2">
                    {langs.map(lang => (
                        <motion.button
                            key={lang.code}
                            onClick={() => changeLanguage(lang.code)}
                            className={`w-full omega-glass-card rounded-2xl p-4 flex items-center gap-4 transition-all ${i18n.language === lang.code ? 'border-primary/30 shadow-[0_0_20px_rgba(127,0,255,0.1)]' : ''
                                }`}
                            whileTap={{ scale: 0.98 }}
                        >
                            <span className="text-2xl">{lang.flag}</span>
                            <div className="flex-1 text-start">
                                <p className="text-sm font-bold text-white">{lang.name}</p>
                                <p className="text-xs text-gray-500">{lang.native}</p>
                            </div>
                            {i18n.language === lang.code && (
                                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                                    <div className="w-3 h-3 rounded-full bg-primary" />
                                </div>
                            )}
                        </motion.button>
                    ))}
                </div>
            </PageTransition>
        );
    }

    if (section === 'about') {
        return (
            <PageTransition className="pb-32">
                <div className="sticky top-0 z-40 px-6 py-4 backdrop-blur-xl bg-black/30 border-b border-white/5">
                    <div className="flex items-center gap-3">
                        <button onClick={() => setSection('main')} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center" aria-label={t('common.back')}>
                            <ArrowLeft className="w-4 h-4 text-gray-400 rtl:rotate-180" />
                        </button>
                        <h1 className="text-lg font-bold text-white">{t('settings.about')}</h1>
                    </div>
                </div>
                <div className="px-6 mt-10 text-center space-y-8">
                    <div className="space-y-3">
                        <div className="w-24 h-24 rounded-[2rem] bg-gradient-to-br from-primary/20 to-purple-600/10 border border-primary/20 flex items-center justify-center mx-auto shadow-xl">
                            <span className="text-4xl font-black text-white">P</span>
                        </div>
                        <h2 className="text-2xl font-[900] text-white">PBank</h2>
                        <p className="text-gray-500 text-sm">{t('common.version')} 2.0.0</p>
                    </div>
                    <div className="omega-glass-card rounded-2xl p-5 space-y-4 text-start">
                        <div className="flex justify-between">
                            <span className="text-gray-400 text-sm">Build</span>
                            <span className="text-gray-300 text-sm font-mono">2026.02.21</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-400 text-sm">Framework</span>
                            <span className="text-gray-300 text-sm font-mono">React 18</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-400 text-sm">Engine</span>
                            <span className="text-gray-300 text-sm font-mono">Vite 5</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-400 text-sm">Encryption</span>
                            <span className="text-gray-300 text-sm font-mono">AES-256-GCM</span>
                        </div>
                    </div>
                    <div className="space-y-3 text-sm text-gray-500">
                        <button className="block w-full text-center py-2 text-primary hover:text-white transition-colors">{t('settings.terms')}</button>
                        <button className="block w-full text-center py-2 text-primary hover:text-white transition-colors">{t('settings.privacy_policy')}</button>
                        <button className="block w-full text-center py-2 text-primary hover:text-white transition-colors">{t('settings.licenses')}</button>
                    </div>
                    <p className="text-[10px] text-gray-700">© 2026 PBank. All rights reserved.</p>
                </div>
            </PageTransition>
        );
    }

    return (
        <PageTransition className="pb-32">
            {/* Header */}
            <div className="sticky top-0 z-40 px-6 py-4 backdrop-blur-xl bg-black/30 border-b border-white/5">
                <div className="flex items-center gap-3">
                    <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center" aria-label={t('common.back')}>
                        <ArrowLeft className="w-4 h-4 text-gray-400 rtl:rotate-180" />
                    </button>
                    <h1 className="text-lg font-bold text-white">{t('settings.title')}</h1>
                </div>
            </div>

            <div className="mt-4 space-y-6">
                {/* Security */}
                <div>
                    <p className="px-6 text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">{t('settings.security')}</p>
                    <div className="omega-glass-card mx-4 rounded-2xl divide-y divide-white/5 overflow-hidden">
                        <SettingRow icon={KeyRound} label={t('settings.change_password')} desc={t('profile.hub.desc.password')} onClick={() => setSection('password')} />
                        <SettingRow icon={Fingerprint} label={t('settings.biometric')} desc={t('settings.biometric_desc')} right={<Toggle active={biometricEnabled} onChange={() => setBiometric(!biometricEnabled)} label={t('settings.biometric')} />} />
                        <SettingRow icon={Shield} label={t('settings.secure_keyboard')} desc={t('settings.secure_keyboard_desc')} right={<Toggle active={incognitoKeyboardEnabled} onChange={() => setIncognitoKeyboard(!incognitoKeyboardEnabled)} label={t('settings.secure_keyboard')} />} />
                    </div>
                </div>

                {/* Appearance */}
                <div>
                    <p className="px-6 text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">{t('settings.appearance')}</p>
                    <div className="omega-glass-card mx-4 rounded-2xl divide-y divide-white/5 overflow-hidden">
                        <SettingRow
                            icon={theme === 'dark' ? Moon : Sun}
                            label={t('settings.theme')}
                            desc={theme === 'dark' ? t('settings.theme_dark') : t('settings.theme_light')}
                            right={
                                <div className="flex bg-white/5 rounded-xl p-0.5">
                                    <button onClick={() => setTheme('dark')} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${theme === 'dark' ? 'bg-primary/20 text-primary' : 'text-gray-500'}`}>
                                        <Moon className="w-3.5 h-3.5" />
                                    </button>
                                    <button onClick={() => setTheme('light')} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${theme === 'light' ? 'bg-amber-500/20 text-amber-400' : 'text-gray-500'}`}>
                                        <Sun className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            }
                        />
                        <SettingRow icon={Globe} label={t('settings.language')} desc={i18n.language === 'fa' ? 'فارسی' : i18n.language === 'ps' ? 'پښتو' : 'English'} onClick={() => setSection('language')} />
                        <SettingRow
                            icon={notificationsEnabled ? Bell : BellOff}
                            label={t('settings.notifications_label')}
                            desc={notificationsEnabled ? t('settings.notifications_on') : t('settings.notifications_off')}
                            right={<Toggle active={notificationsEnabled} onChange={() => setNotificationsEnabled(!notificationsEnabled)} label={t('settings.notifications_label')} />}
                        />
                    </div>
                </div>

                {/* General */}
                <div>
                    <p className="px-6 text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">{t('settings.general')}</p>
                    <div className="omega-glass-card mx-4 rounded-2xl divide-y divide-white/5 overflow-hidden">
                        <SettingRow icon={Smartphone} label={t('settings.devices')} desc={t('settings.devices_desc')} onClick={() => navigate('/profile')} />
                        <SettingRow icon={Star} label={t('settings.rate')} desc={t('settings.rate_desc')} onClick={() => { }} />
                        <SettingRow icon={HelpCircle} label={t('settings.help')} desc={t('settings.help_desc')} onClick={() => { }} />
                        <SettingRow icon={FileText} label={t('settings.about')} desc={t('settings.about_desc')} onClick={() => setSection('about')} />
                    </div>
                </div>

                {/* Danger Zone */}
                <div>
                    <p className="px-6 text-[11px] font-bold text-red-400/60 uppercase tracking-wider mb-1">{t('settings.danger_zone')}</p>
                    <div className="omega-glass-card mx-4 rounded-2xl divide-y divide-white/5 overflow-hidden border-red-500/10">
                        <SettingRow icon={LogOut} label={t('settings.logout')} danger onClick={() => navigate('/onboarding')} />
                        <SettingRow icon={Trash2} label={t('settings.delete_account')} desc={t('settings.delete_account_desc')} danger onClick={() => setShowDeleteConfirm(true)} />
                    </div>
                </div>
            </div>

            {/* Delete Account Modal */}
            <AnimatePresence>
                {showDeleteConfirm && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-6"
                        onClick={() => setShowDeleteConfirm(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="bg-[#0f0a18] border border-red-500/20 rounded-3xl p-6 space-y-5 max-w-sm w-full"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="text-center space-y-3">
                                <div className="w-14 h-14 rounded-full bg-red-500/10 flex items-center justify-center mx-auto">
                                    <Trash2 className="w-6 h-6 text-red-400" />
                                </div>
                                <h3 className="text-lg font-bold text-white">{t('settings.delete_confirm_title')}</h3>
                                <p className="text-sm text-gray-400 leading-relaxed">{t('settings.delete_confirm_body')}</p>
                            </div>
                            <div className="space-y-2">
                                <button onClick={() => setShowDeleteConfirm(false)} className="w-full py-3.5 rounded-2xl bg-white/5 text-white font-bold text-sm hover:bg-white/10 transition-colors">
                                    {t('common.cancel')}
                                </button>
                                <button className="w-full py-3.5 rounded-2xl bg-red-500/10 text-red-400 font-bold text-sm border border-red-500/20 hover:bg-red-500/20 transition-colors">
                                    {t('settings.delete_account')}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </PageTransition>
    );
};
