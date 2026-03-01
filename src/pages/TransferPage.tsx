import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PageTransition } from '@/shared/ui/PageTransition';
import { ArrowLeft, User, Hash, Scan, Wifi, Smartphone, X, Keyboard, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { BentoCard } from '@/shared/ui/BentoCard';
import { Button } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/Input';
import { useWalletStore } from '@/store/walletStore';
import { useGamificationStore } from '@/store/gamificationStore';
import { usePrivacy } from '@/shared/context/PrivacyContext';
import { ProximityRadar } from '@/shared/ui/ProximityRadar';
import { BiometricPrompt } from '@/shared/ui/BiometricPrompt';
import { SecureNumPad } from '@/shared/ui/SecureNumPad';
import { useTranslation } from 'react-i18next';
import { validateTransfer } from '@/shared/lib/schemas/transferSchema';

export const TransferPage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { sendMoney } = useWalletStore();
    const { addXp } = useGamificationStore();
    const { biometricEnabled, incognitoKeyboardEnabled } = usePrivacy();

    const [amount, setAmount] = useState('');
    const [recipient, setRecipient] = useState('');
    const [message, setMessage] = useState('');
    const [mode, setMode] = useState<'address' | 'qr' | 'radar'>('address');
    const [showRadar, setShowRadar] = useState(false);

    // Security States
    const [showBiometric, setShowBiometric] = useState(false);
    const [showSecureKeyboard, setShowSecureKeyboard] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [submitError, setSubmitError] = useState('');
    const [isTransferring, setIsTransferring] = useState(false);

    const handleTransferStep = () => {
        setErrors({});
        setSubmitError('');

        const validation = validateTransfer({
            amount: Number(amount) || 0,
            recipient,
            message,
        });

        if (!validation.success) {
            setErrors(validation.errors);
            return;
        }

        if (biometricEnabled) {
            setShowBiometric(true);
        } else {
            performTransfer();
        }
    };

    const performTransfer = async () => {
        try {
            setIsTransferring(true);
            setSubmitError('');
            const amountNum = Number(amount);

            // Mock network simulation
            await new Promise((resolve, reject) => {
                setTimeout(() => {
                    if (!navigator.onLine) {
                        reject(new Error(t('common.offline', 'دسترسی به اینترنت قطع است')));
                    } else if (Math.random() > 0.9) {
                        reject(new Error('خطا در ارتباط با سرور بانکی (Timeout)'));
                    } else {
                        resolve(true);
                    }
                }, 1500);
            });

            sendMoney(amountNum, recipient, message);
            addXp(50); // Reward for activity

            navigate('/receipt', {
                state: {
                    amount: amountNum,
                    recipient,
                    message,
                    date: new Date().toLocaleDateString('fa-IR'),
                    time: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })
                },
                replace: true
            });
        } catch (error) {
            setSubmitError((error as Error).message);
        } finally {
            setIsTransferring(false);
        }
    };

    const handleBiometricSuccess = () => {
        setTimeout(() => {
            setShowBiometric(false);
            performTransfer();
        }, 500);
    };

    const contacts = [
        { name: 'علی محمدی', phone: '0x71C...92F', bg: 'bg-emerald-500/20', text: 'text-emerald-400' },
        { name: 'سارا احمدی', phone: '0x3A2...11B', bg: 'bg-rose-500/20', text: 'text-rose-400' },
        { name: 'رضا کبیری', phone: '0x99C...22D', bg: 'bg-blue-500/20', text: 'text-blue-400' },
    ];

    return (
        <PageTransition className="p-6 space-y-6 pb-32">
            {/* Header */}
            <header className="flex items-center gap-4 pt-4">
                <Button
                    variant="secondary"
                    size="icon"
                    onClick={() => navigate(-1)}
                    className="rounded-full w-12 h-12 bg-white/5 border border-white/10"
                >
                    <ArrowLeft className="w-6 h-6 text-white" />
                </Button>
                <div className="flex flex-col">
                    <h1 className="text-xl font-bold text-white">{t('transfer.title')}</h1>
                    <span className="text-xs text-gray-400 font-mono">{t('transfer.network')}</span>
                </div>
            </header>

            {/* Payment Mode Tabs */}
            <div className="flex p-1 bg-white/5 rounded-2xl border border-white/5">
                {[
                    { id: 'address', label: t('transfer.tabs.address'), icon: Hash },
                    { id: 'qr', label: t('transfer.tabs.qr'), icon: Scan },
                    { id: 'radar', label: t('transfer.tabs.radar'), icon: Wifi },
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => {
                            setMode(tab.id as any);
                            if (tab.id === 'radar') setShowRadar(true);
                        }}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl transition-all ${mode === tab.id ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-gray-400 hover:text-white'
                            }`}
                    >
                        <tab.icon className="w-4 h-4" />
                        <span className="text-xs font-bold">{tab.label}</span>
                    </button>
                ))}
            </div>

            <AnimatePresence mode="wait">
                {mode === 'address' && (
                    <motion.div
                        key="address"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="space-y-6"
                    >
                        {/* Submit Error Banner */}
                        <AnimatePresence>
                            {submitError && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="bg-red-500/10 border border-red-500/20 rounded-2xl p-3 flex items-center gap-3"
                                >
                                    <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                                    <p className="text-sm text-red-300">{submitError}</p>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Amount Input */}
                        <div className="text-center py-4 space-y-4">
                            <p className="text-gray-400 text-sm">{t('transfer.amount.label')}</p>
                            <div className="relative inline-block">
                                <input
                                    type="number"
                                    placeholder={t('transfer.amount.placeholder')}
                                    value={amount}
                                    onChange={(e) => { setAmount(e.target.value); setErrors(prev => ({ ...prev, amount: '' })); }}
                                    readOnly={incognitoKeyboardEnabled}
                                    onClick={() => {
                                        if (incognitoKeyboardEnabled) setShowSecureKeyboard(true);
                                    }}
                                    className={`bg-transparent text-5xl font-[900] text-center text-white placeholder-white/20 outline-none w-full max-w-[200px] ${incognitoKeyboardEnabled ? 'cursor-pointer' : ''} ${errors.amount ? 'text-red-400' : ''}`}
                                    autoFocus={!incognitoKeyboardEnabled}
                                    aria-label={t('transfer.amount.label')}
                                />
                                <span className="absolute -right-6 top-2 text-xl text-gray-500">؋</span>
                            </div>
                            {errors.amount && (
                                <p className="text-xs text-red-400 flex items-center justify-center gap-1">
                                    <AlertCircle className="w-3 h-3" />
                                    {errors.amount}
                                </p>
                            )}

                            {incognitoKeyboardEnabled && !showSecureKeyboard && !errors.amount && (
                                <p className="text-[10px] text-emerald-400 flex items-center justify-center gap-1">
                                    <Keyboard className="w-3 h-3" />
                                    {t('transfer.secure_keyboard')}
                                </p>
                            )}
                        </div>

                        {/* Destination Input */}
                        <div className="space-y-4">
                            <Input
                                icon={<Hash className="w-5 h-5" />}
                                placeholder={t('transfer.destination.placeholder')}
                                className="text-left dir-ltr font-mono"
                                value={recipient}
                                onChange={(e) => { setRecipient(e.target.value); setErrors(prev => ({ ...prev, recipient: '' })); }}
                                error={errors.recipient}
                            />
                            {/* Message Input - New Feature */}
                            <Input
                                icon={<span className="text-gray-400 font-bold text-xs">{t('transfer.message.label')}</span>}
                                placeholder={t('transfer.message.placeholder')}
                                className="text-right"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                            />
                        </div>

                        {/* Recent Contacts */}
                        <div className="space-y-3">
                            <h3 className="text-sm font-bold text-gray-400 flex items-center gap-2">
                                <User className="w-4 h-4" />
                                {t('transfer.recent_contacts')}
                            </h3>
                            <div className="grid grid-cols-1 gap-2">
                                {contacts.map((contact) => (
                                    <BentoCard
                                        key={contact.phone}
                                        variant="glass"
                                        onClick={() => setRecipient(contact.phone)}
                                        className="flex items-center gap-3 p-3 cursor-pointer hover:bg-white/10 transition-colors"
                                    >
                                        <div className={`w-8 h-8 rounded-lg ${contact.bg} flex items-center justify-center border border-white/5`}>
                                            <span className={`font-bold text-xs ${contact.text}`}>{contact.name[0]}</span>
                                        </div>
                                        <div className="overflow-hidden">
                                            <p className="text-sm font-bold text-white truncate">{contact.name}</p>
                                            <p className="text-[10px] text-gray-500 font-mono tracking-wider truncate">{contact.phone}</p>
                                        </div>
                                    </BentoCard>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}

                {mode === 'qr' && (
                    <motion.div
                        key="qr"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="flex flex-col items-center justify-center h-[400px] border-2 border-dashed border-white/20 rounded-3xl bg-black/20"
                    >
                        <div className="w-64 h-64 border-2 border-primary rounded-3xl relative overflow-hidden flex items-center justify-center">
                            <div className="absolute inset-0 bg-primary/10 animate-pulse" />
                            <div className="absolute top-0 left-0 w-full h-1 bg-primary shadow-[0_0_20px_rgba(124,58,237,1)] animate-[scan_2s_linear_infinite]" />
                            <Smartphone className="w-12 h-12 text-white/50" />
                        </div>
                        <p className="mt-4 text-gray-400 text-sm">{t('transfer.qr.instruction')}</p>
                        <Button variant="ghost" className="mt-4 text-primary" onClick={() => setMode('address')}>
                            {t('transfer.qr.back')}
                        </Button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Proximity Radar Modal */}
            <AnimatePresence>
                {showRadar && (
                    <ProximityRadar
                        onSelectUser={(user) => {
                            setRecipient(`0x${user.id}...`); // Mock Address
                            setShowRadar(false);
                            setMode('address');
                        }}
                        onCancel={() => {
                            setShowRadar(false);
                            setMode('address');
                        }}
                    />
                )}
            </AnimatePresence>

            {/* Action Button (Only for Address mode) */}
            {mode === 'address' && (
                <div className="fixed bottom-24 left-6 right-6">
                    <Button
                        onClick={handleTransferStep}
                        disabled={!amount || !recipient || isTransferring}
                        isLoading={isTransferring}
                        className="w-full h-14 text-lg font-bold shadow-[0_0_30px_rgba(127,0,255,0.4)] disabled:opacity-50 disabled:shadow-none bg-gradient-to-r from-primary to-purple-600 border-none"
                    >
                        {isTransferring ? 'در حال پردازش...' : t('transfer.submit')}
                    </Button>
                </div>
            )}

            {/* Biometric Prompt */}
            <BiometricPrompt
                isOpen={showBiometric}
                onSuccess={handleBiometricSuccess}
                onCancel={() => setShowBiometric(false)}
            />

            {/* Secure Keyboard Overlay */}
            <AnimatePresence>
                {showSecureKeyboard && incognitoKeyboardEnabled && (
                    <motion.div
                        initial={{ y: '100%' }}
                        animate={{ y: 0 }}
                        exit={{ y: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        className="fixed bottom-0 left-0 right-0 z-50"
                    >
                        <div className="flex justify-end p-2 bg-black/40 backdrop-blur-md border-t border-white/10">
                            <Button size="sm" variant="ghost" onClick={() => setShowSecureKeyboard(false)}>
                                <X className="w-5 h-5" />
                            </Button>
                        </div>
                        <SecureNumPad
                            onKeyPress={(key) => {
                                if (key === '.' && amount.includes('.')) return;
                                if (amount.length < 10) setAmount(prev => prev + key);
                            }}
                            onDelete={() => setAmount(prev => prev.slice(0, -1))}
                            randomize
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </PageTransition>
    );
};
