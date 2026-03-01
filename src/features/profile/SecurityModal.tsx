
import { Drawer } from 'vaul';
import { Shield, Fingerprint, Lock, Globe } from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import { usePrivacy } from '@/shared/context/PrivacyContext';

interface SecurityModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const SecurityModal = ({ isOpen, onClose }: SecurityModalProps) => {
    const {
        biometricEnabled, toggleBiometric,
        incognitoKeyboardEnabled, toggleIncognitoKeyboard,
        geoFencingEnabled, toggleGeoFencing,
        isForeignLocation, toggleForeignLocation
    } = usePrivacy();

    return (
        <Drawer.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <Drawer.Portal>
                <Drawer.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50" />
                <Drawer.Content className="bg-surface border-t border-white/10 flex flex-col rounded-t-[32px] mt-24 fixed bottom-0 left-0 right-0 z-50 h-[600px]">
                    <div className="p-4 bg-surface rounded-t-[32px] flex-1 overflow-y-auto">
                        <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-white/20 mb-8" />

                        <div className="max-w-md mx-auto space-y-6">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-12 h-12 rounded-2xl bg-purple-500/20 flex items-center justify-center">
                                    <Shield className="w-6 h-6 text-purple-400" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-white">امنیت حساب</h2>
                                    <p className="text-sm text-gray-400">مدیریت رمز عبور و لایه‌های امنیتی</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <SecurityToggle
                                    title="ورود و انتقال بیومتریک"
                                    subtitle="تایید اثر انگشت برای هر تراکنش"
                                    icon={<Fingerprint className={biometricEnabled ? 'text-emerald-400' : 'text-gray-400'} />}
                                    enabled={biometricEnabled}
                                    onToggle={toggleBiometric}
                                />

                                <SecurityToggle
                                    title="کیبورد ناشناس"
                                    subtitle="کیبورد امن داخلی تصادفی"
                                    icon={<Shield className={incognitoKeyboardEnabled ? 'text-emerald-400' : 'text-gray-400'} />}
                                    enabled={incognitoKeyboardEnabled}
                                    onToggle={toggleIncognitoKeyboard}
                                />

                                <SecurityToggle
                                    title="Geo-Fencing"
                                    subtitle="قفل شدن خارج از کشور (امنیت سفر)"
                                    icon={<Globe className={geoFencingEnabled ? 'text-emerald-400' : 'text-gray-400'} />}
                                    enabled={geoFencingEnabled}
                                    onToggle={toggleGeoFencing}
                                />

                                {geoFencingEnabled && (
                                    <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-between">
                                        <div>
                                            <p className="font-bold text-red-200 text-sm">شبیه‌سازی موقعیت خارجی</p>
                                            <p className="text-[10px] text-red-300/70">فقط برای تست (Debug)</p>
                                        </div>
                                        <div
                                            className={`w-10 h-6 rounded-full p-1 cursor-pointer transition-colors ${isForeignLocation ? 'bg-red-500' : 'bg-white/10'}`}
                                            onClick={toggleForeignLocation}
                                        >
                                            <div className={`w-4 h-4 rounded-full bg-white transition-transform ${isForeignLocation ? 'translate-x-4' : 'translate-x-0'}`} />
                                        </div>
                                    </div>
                                )}

                                <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
                                            <Lock className="w-4 h-4 text-gray-400" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-200 text-sm">تایید دو مرحله‌ای</p>
                                            <p className="text-[10px] text-gray-500">افزایش امنیت حساب کاربری</p>
                                        </div>
                                    </div>
                                    <Button variant="secondary" className="w-full text-xs h-9 border-white/10">
                                        فعال‌سازی
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </Drawer.Content>
            </Drawer.Portal>
        </Drawer.Root>
    );
};

const SecurityToggle = ({ title, subtitle, icon, enabled, onToggle }: any) => (
    <div
        className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between cursor-pointer active:scale-95 transition-transform"
        onClick={onToggle}
    >
        <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
                {icon}
            </div>
            <div>
                <p className="font-bold text-gray-200 text-sm">{title}</p>
                <p className="text-[10px] text-gray-500">{subtitle}</p>
            </div>
        </div>
        <div className={`w-12 h-6 rounded-full p-1 transition-colors ${enabled ? 'bg-emerald-500' : 'bg-white/10'}`}>
            <div className={`w-4 h-4 rounded-full bg-white transition-transform ${enabled ? 'translate-x-0' : '-translate-x-6'}`} />
        </div>
    </div>
);
