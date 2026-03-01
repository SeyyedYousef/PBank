import { useState } from 'react';
import { Drawer } from 'vaul';
import { Smartphone, Laptop, LogOut, Map, History, Radio } from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import { DeviceMap } from './DeviceMap';
import { LoginHistory } from './LoginHistory';
import { useFeedback } from '@/shared/hooks/useFeedback';

interface SessionsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const SessionsModal = ({ isOpen, onClose }: SessionsModalProps) => {
    const [view, setView] = useState<'list' | 'map' | 'history'>('list');
    const { trigger } = useFeedback();

    return (
        <Drawer.Root open={isOpen} onOpenChange={(open) => {
            if (!open) {
                onClose();
                setTimeout(() => setView('list'), 300); // Reset view on close
            }
        }}>
            <Drawer.Portal>
                <Drawer.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50" />
                <Drawer.Content className="fixed bottom-0 left-0 right-0 z-50 mt-24 flex max-h-[90vh] flex-col rounded-t-[32px] border-t border-white/10 bg-surface outline-none">
                    <div className="flex-1 overflow-y-auto rounded-t-[32px] bg-surface p-4">
                        <div className="mx-auto mb-6 h-1.5 w-12 flex-shrink-0 rounded-full bg-white/20" />

                        <div className="mx-auto max-w-md space-y-6 pb-8">
                            <div className="flex items-center gap-4">
                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-500/20">
                                    <Smartphone className="h-6 w-6 text-orange-400" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-white">نشست‌های فعال</h2>
                                    <p className="text-sm text-gray-400">مدیریت دستگاه‌های متصل</p>
                                </div>
                            </div>

                            {/* View Switcher Tabs */}
                            <div className="flex rounded-xl border border-white/5 bg-white/5 p-1">
                                <button
                                    onClick={() => { setView('list'); trigger('click'); }}
                                    className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all ${view === 'list' ? 'bg-white/10 text-white' : 'text-gray-500'}`}
                                    aria-label="نمایش لیست"
                                    aria-pressed={view === 'list'}
                                >
                                    <Radio className="w-3 h-3" /> لیست
                                </button>
                                <button
                                    onClick={() => { setView('map'); trigger('click'); }}
                                    className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all ${view === 'map' ? 'bg-white/10 text-white' : 'text-gray-500'}`}
                                    aria-label="نمایش نقشه"
                                    aria-pressed={view === 'map'}
                                >
                                    <Map className="w-3 h-3" /> نقشه
                                </button>
                                <button
                                    onClick={() => { setView('history'); trigger('click'); }}
                                    className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all ${view === 'history' ? 'bg-white/10 text-white' : 'text-gray-500'}`}
                                    aria-label="نمایش تاریخچه"
                                    aria-pressed={view === 'history'}
                                >
                                    <History className="w-3 h-3" /> تاریخچه
                                </button>
                            </div>

                            {view === 'list' && (
                                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <div className="relative overflow-hidden rounded-2xl border border-emerald-500/20 bg-gradient-to-r from-emerald-500/10 to-transparent p-4">
                                        <div className="absolute left-2 top-2">
                                            <span className="rounded-full bg-emerald-500 px-2 py-0.5 text-[10px] text-white">دستگاه فعلی</span>
                                        </div>
                                        <div className="mt-2 flex items-center gap-4">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/20">
                                                <Smartphone className="h-5 w-5 text-emerald-400" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-white">iPhone 15 Pro Max</p>
                                                <p className="flex items-center gap-1 text-[10px] text-emerald-400">
                                                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
                                                    آنلاین - تهران
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mb-2 mt-6 px-2 text-xs font-bold uppercase tracking-wider text-gray-500">سایر دستگاه‌ها</div>

                                    <SessionItem
                                        icon={<Laptop className="h-5 w-5 text-gray-400" />}
                                        name="Windows 11 - Chrome"
                                        location="مشهد، ایران"
                                        time="آخرین بازدید: ۲ ساعت پیش"
                                    />

                                    <SessionItem
                                        icon={<Smartphone className="h-5 w-5 text-gray-400" />}
                                        name="Samsung S21"
                                        location="شیراز، ایران"
                                        time="آخرین بازدید: ۵ روز پیش"
                                    />

                                    <Button
                                        variant="danger"
                                        className="mt-8 h-12 w-full rounded-xl opacity-90 hover:opacity-100"
                                        onClick={() => trigger('error')}
                                    >
                                        <LogOut className="ml-2 h-4 w-4" />
                                        خاتمه همه نشست‌های دیگر
                                    </Button>
                                </div>
                            )}

                            {view === 'map' && (
                                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <DeviceMap />
                                    <p className="mt-4 text-center text-xs text-gray-500">
                                        موقعیت تقریبی دستگاه‌های فعال بر اساس IP
                                    </p>
                                </div>
                            )}

                            {view === 'history' && (
                                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <LoginHistory />
                                </div>
                            )}
                        </div>
                    </div>
                </Drawer.Content>
            </Drawer.Portal>
        </Drawer.Root>
    );
};

interface SessionItemProps {
    icon: React.ReactNode;
    name: string;
    location: string;
    time: string;
}

const SessionItem = ({ icon, name, location, time }: SessionItemProps) => (
    <div className="group flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-4">
        <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 transition-colors group-hover:bg-white/10">
                {icon}
            </div>
            <div>
                <p className="text-sm font-bold text-gray-300">{name}</p>
                <div className="flex flex-col">
                    <span className="text-[10px] text-gray-500">{location}</span>
                    <span className="text-[10px] text-gray-600">{time}</span>
                </div>
            </div>
        </div>
        <button
            className="rounded-lg p-2 text-gray-600 transition-colors hover:bg-red-500/10 hover:text-red-400"
            aria-label={`خروج از نشست ${name}`}
            title="خروج از نشست"
        >
            <LogOut className="h-4 w-4" />
        </button>
    </div>
);
