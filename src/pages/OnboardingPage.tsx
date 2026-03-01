import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { IntroStep } from '@/features/auth/IntroStep';
import { PhoneStep } from '@/features/auth/PhoneStep';
import { OtpStep } from '@/features/auth/OtpStep';
import { PasswordStep } from '@/features/auth/PasswordStep';
import { useAuthStore } from '../store/authStore';

type Step = 'INTRO' | 'PHONE' | 'OTP' | 'PASSWORD';

const stepOrder: Step[] = ['INTRO', 'PHONE', 'OTP', 'PASSWORD'];

export const OnboardingPage = () => {
    const navigate = useNavigate();
    const { login, isLoading, error, tempPhone, setTempPhone } = useAuthStore();
    const [currentStep, setCurrentStep] = useState<Step>(tempPhone ? 'OTP' : 'INTRO');
    const [direction, setDirection] = useState(1);

    const goToStep = (step: Step, dir: number = 1) => {
        setDirection(dir);
        setCurrentStep(step);
    };

    const handleIntroStart = () => goToStep('PHONE');

    const handlePhoneSubmit = (inputPhone: string) => {
        setTempPhone(inputPhone);
        goToStep('OTP');
    };

    const handleOtpSubmit = (otp: string) => {
        console.log('OTP Submitted:', otp);
        goToStep('PASSWORD');
    };

    const handlePasswordSubmit = async (password: string) => {
        try {
            await login(tempPhone || '', password);
            navigate('/');
        } catch (err) {
            console.error('Login failed', err);
        }
    };

    const handleEditPhone = () => goToStep('PHONE', -1);

    // Progress indicator (step index)
    const stepIndex = stepOrder.indexOf(currentStep);

    const variants = {
        enter: (dir: number) => ({
            x: dir > 0 ? 60 : -60,
            opacity: 0,
            filter: 'blur(12px)',
            scale: 0.96,
        }),
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1,
            filter: 'blur(0px)',
            scale: 1,
        },
        exit: (dir: number) => ({
            zIndex: 0,
            x: dir < 0 ? 60 : -60,
            opacity: 0,
            filter: 'blur(12px)',
            scale: 0.96,
        }),
    };

    return (
        <div className="min-h-screen bg-[#030108] text-white font-sans overflow-hidden relative">
            {/* Cinematic Background */}
            <div className="absolute inset-0">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,_#7F00FF10_0%,_transparent_50%)]" />
                <motion.div
                    animate={{
                        opacity: [0.15, 0.25, 0.15],
                        x: [0, 20, 0],
                    }}
                    transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
                    className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-primary/8 blur-[120px] rounded-full"
                />
                <motion.div
                    animate={{
                        opacity: [0.1, 0.2, 0.1],
                        y: [0, -15, 0],
                    }}
                    transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
                    className="absolute top-[30%] left-0 w-[300px] h-[300px] bg-violet-600/6 blur-[100px] rounded-full"
                />
            </div>

            <div className="flex items-center justify-center min-h-screen p-4 relative z-10">
                <div className="w-full max-w-md relative">
                    {/* Progress Steps */}
                    {currentStep !== 'INTRO' && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-center justify-center gap-2 mb-6"
                        >
                            {['PHONE', 'OTP', 'PASSWORD'].map((step, i) => (
                                <div key={step} className="flex items-center gap-2">
                                    <div
                                        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-500 ${stepIndex > i + 1
                                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                            : stepIndex === i + 1
                                                ? 'bg-primary/20 text-primary border border-primary/30 shadow-[0_0_15px_rgba(127,0,255,0.2)]'
                                                : 'bg-white/5 text-gray-600 border border-white/5'
                                            }`}
                                    >
                                        {stepIndex > i + 1 ? '✓' : i + 1}
                                    </div>
                                    {i < 2 && (
                                        <div className={`w-12 h-[2px] rounded-full transition-colors duration-500 ${stepIndex > i + 1 ? 'bg-emerald-500/30' : 'bg-white/5'
                                            }`} />
                                    )}
                                </div>
                            ))}
                        </motion.div>
                    )}

                    {/* Main Card */}
                    <div className="bg-white/[0.03] backdrop-blur-3xl border border-white/[0.06] rounded-[32px] overflow-hidden shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] min-h-[600px] relative">
                        {/* Inner highlight */}
                        <div className="absolute inset-[1px] rounded-[31px] border border-white/[0.02] pointer-events-none" />

                        <AnimatePresence mode="popLayout" custom={direction}>
                            <motion.div
                                key={currentStep}
                                custom={direction}
                                variants={variants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{
                                    x: { type: 'spring', stiffness: 300, damping: 30 },
                                    opacity: { duration: 0.25 },
                                    filter: { duration: 0.3 },
                                    scale: { duration: 0.3 },
                                }}
                                className="absolute inset-0 w-full h-full"
                            >
                                {currentStep === 'INTRO' && <IntroStep onStart={handleIntroStart} />}
                                {currentStep === 'PHONE' && <PhoneStep onSubmit={handlePhoneSubmit} />}
                                {currentStep === 'OTP' && <OtpStep phone={tempPhone || ''} onSubmit={handleOtpSubmit} onEditPhone={handleEditPhone} />}
                                {currentStep === 'PASSWORD' && (
                                    <>
                                        <PasswordStep onSubmit={handlePasswordSubmit} isLoading={isLoading} />
                                        <AnimatePresence>
                                            {error && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: 20 }}
                                                    className="absolute bottom-4 left-4 right-4 p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl text-center text-sm backdrop-blur-xl font-bold"
                                                >
                                                    {error}
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </>
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Version badge */}
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1 }}
                        className="text-center text-[10px] text-gray-700 mt-4 font-mono"
                    >
                        PBank v2.0 • Secured by AES-256
                    </motion.p>
                </div>
            </div>
        </div>
    );
};
