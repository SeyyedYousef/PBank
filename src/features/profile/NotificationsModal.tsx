import { useState } from 'react';
import { Drawer } from 'vaul';
import { Bell, MessageSquare, Mail, Smartphone } from 'lucide-react';

interface NotificationsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const NotificationsModal = ({ isOpen, onClose }: NotificationsModalProps) => {
    const [settings, setSettings] = useState({
        push: true,
        sms: true,
        email: false
    });

    const toggle = (key: keyof typeof settings) => {
        setSettings(prev => ({ ...prev, [key]: !prev[key] }));
    };

    return (
        <Drawer.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <Drawer.Portal>
                <Drawer.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50" />
                <Drawer.Content className="bg-surface border-t border-white/10 flex flex-col rounded-t-[32px] mt-24 fixed bottom-0 left-0 right-0 z-50 h-[450px]">
                    <div className="p-4 bg-surface rounded-t-[32px] flex-1">
                        <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-white/20 mb-8" />

                        <div className="max-w-md mx-auto space-y-6">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-12 h-12 rounded-2xl bg-pink-500/20 flex items-center justify-center">
                                    <Bell className="w-6 h-6 text-pink-400" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-white">تنظیمات اعلان‌ها</h2>
                                    <p className="text-sm text-gray-400">مدیریت روش‌های اطلاع‌رسانی</p>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <ToggleItem
                                    icon={<Smartphone className="w-4 h-4 text-purple-400" />}
                                    title="نوتیفیکیشن برنامه"
                                    subtitle="دریافت اعلان تراکنش‌ها و اخبار"
                                    isActive={settings.push}
                                    onToggle={() => toggle('push')}
                                    color="purple"
                                />

                                <ToggleItem
                                    icon={<MessageSquare className="w-4 h-4 text-green-400" />}
                                    title="پیامک (SMS)"
                                    subtitle="هزینه هر پیامک: ۳۰۰ ریال"
                                    isActive={settings.sms}
                                    onToggle={() => toggle('sms')}
                                    color="green"
                                />

                                <ToggleItem
                                    icon={<Mail className="w-4 h-4 text-orange-400" />}
                                    title="پست الکترونیک"
                                    subtitle="خبرنامه و صورت‌حساب ماهانه"
                                    isActive={settings.email}
                                    onToggle={() => toggle('email')}
                                    color="orange"
                                />
                            </div>

                            <p className="text-xs text-center text-gray-500 mt-8">
                                تغییرات شما به صورت خودکار ذخیره می‌شوند.
                            </p>
                        </div>
                    </div>
                </Drawer.Content>
            </Drawer.Portal>
        </Drawer.Root>
    );
};

const ToggleItem = ({ icon, title, subtitle, isActive, onToggle, color }: any) => {
    const bgColors: any = {
        purple: 'bg-purple-500',
        green: 'bg-green-500',
        orange: 'bg-orange-500'
    };

    return (
        <div
            className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between cursor-pointer active:scale-95 transition-transform"
            onClick={onToggle}
        >
            <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
                    {icon}
                </div>
                <div>
                    <p className="font-bold text-gray-200 text-sm">{title}</p>
                    <p className="text-[10px] text-gray-500">{subtitle}</p>
                </div>
            </div>
            <div className={`w-12 h-6 rounded-full p-1 transition-colors ${isActive ? bgColors[color] : 'bg-white/10'}`}>
                <div className={`w-4 h-4 rounded-full bg-white transition-transform ${isActive ? 'translate-x-0' : '-translate-x-6'}`} />
            </div>
        </div>
    );
}
