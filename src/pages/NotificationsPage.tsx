import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PageTransition } from '@/shared/ui/PageTransition';
import {
    ArrowLeft, Send, Gift, Shield, Star,
    Trash2, Check, CheckCheck, Info
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { EmptyState } from '@/shared/ui/EmptyState';

type NotifType = 'transaction' | 'security' | 'reward' | 'system' | 'promo';

interface Notification {
    id: string;
    type: NotifType;
    title: string;
    body: string;
    time: string;
    isRead: boolean;
    action?: string;
}

const mockNotifications: Notification[] = [
    { id: '1', type: 'transaction', title: 'ارسال موفق', body: 'مبلغ ۵,۰۰۰ افغانی به احمد ارسال شد.', time: '۲ دقیقه پیش', isRead: false, action: '/history' },
    { id: '2', type: 'security', title: 'ورود جدید شناسایی شد', body: 'ورود از دستگاه Samsung Galaxy S24 در کابل.', time: '۱ ساعت پیش', isRead: false },
    { id: '3', type: 'reward', title: 'جایزه روزانه! 🎁', body: 'جعبه رمز امروز آماده باز کردن است. ۵۰ XP کسب کنید.', time: '۳ ساعت پیش', isRead: false, action: '/rewards' },
    { id: '4', type: 'transaction', title: 'دریافت پول', body: 'مبلغ ۱۲,۰۰۰ افغانی از محمد دریافت شد.', time: 'دیروز', isRead: true },
    { id: '5', type: 'promo', title: '۲۰٪ تخفیف شارژ', body: 'ویژه کاربران VIP - تا پایان هفته.', time: 'دیروز', isRead: true, action: '/services/mobile-credit' },
    { id: '6', type: 'system', title: 'آپدیت امنیتی', body: 'نسخه جدید PBank با بهبودهای امنیتی منتشر شد.', time: '۲ روز پیش', isRead: true },
    { id: '7', type: 'security', title: 'رمز عبور تغییر کرد', body: 'رمز عبور شما با موفقیت تغییر یافت.', time: '۳ روز پیش', isRead: true },
    { id: '8', type: 'reward', title: 'سطح ارتقا یافت! 🚀', body: 'تبریک! شما به سطح نقره‌ای ارتقا یافتید.', time: '۵ روز پیش', isRead: true, action: '/rewards' },
];

const getNotifIcon = (type: NotifType) => {
    switch (type) {
        case 'transaction': return <Send className="w-5 h-5" />;
        case 'security': return <Shield className="w-5 h-5" />;
        case 'reward': return <Gift className="w-5 h-5" />;
        case 'promo': return <Star className="w-5 h-5" />;
        case 'system': return <Info className="w-5 h-5" />;
    }
};

const getNotifColor = (type: NotifType) => {
    switch (type) {
        case 'transaction': return { text: 'text-blue-400', bg: 'bg-blue-500/15', border: 'border-blue-500/20' };
        case 'security': return { text: 'text-red-400', bg: 'bg-red-500/15', border: 'border-red-500/20' };
        case 'reward': return { text: 'text-amber-400', bg: 'bg-amber-500/15', border: 'border-amber-500/20' };
        case 'promo': return { text: 'text-emerald-400', bg: 'bg-emerald-500/15', border: 'border-emerald-500/20' };
        case 'system': return { text: 'text-gray-400', bg: 'bg-white/5', border: 'border-white/10' };
    }
};

export const NotificationsPage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState(mockNotifications);
    const [filter, setFilter] = useState<'all' | 'unread'>('all');

    const unreadCount = notifications.filter(n => !n.isRead).length;
    const filtered = filter === 'unread' ? notifications.filter(n => !n.isRead) : notifications;

    const markAllRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    };

    const markRead = (id: string) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
    };

    const deleteNotif = (id: string) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    };

    const handleClick = (notif: Notification) => {
        markRead(notif.id);
        if (notif.action) navigate(notif.action);
    };

    return (
        <PageTransition className="pb-32">
            {/* Header */}
            <div className="sticky top-0 z-40 px-6 py-4 backdrop-blur-xl bg-black/30 border-b border-white/5">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => navigate(-1)}
                            className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center"
                            aria-label={t('accessibility.back_button', 'بازگشت')}
                        >
                            <ArrowLeft className="w-4 h-4 text-gray-400 rtl:rotate-180" />
                        </button>
                        <div className="flex items-center gap-2">
                            <h1 className="text-lg font-bold text-white">{t('notifications.title', 'اعلان‌ها')}</h1>
                            {unreadCount > 0 && (
                                <span className="px-2 py-0.5 rounded-full bg-primary/20 text-primary text-xs font-bold">
                                    {unreadCount}
                                </span>
                            )}
                        </div>
                    </div>
                    {unreadCount > 0 && (
                        <button
                            onClick={markAllRead}
                            className="text-xs font-bold text-primary hover:text-white transition-colors flex items-center gap-1"
                        >
                            <CheckCheck className="w-3.5 h-3.5" />
                            {t('notifications.mark_all_read', 'خواندن همه')}
                        </button>
                    )}
                </div>

                {/* Filter Tabs */}
                <div className="flex gap-2 mt-3">
                    {(['all', 'unread'] as const).map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${filter === f
                                ? 'bg-white/10 text-white border border-white/15'
                                : 'text-gray-500 hover:text-gray-300'
                                }`}
                        >
                            {f === 'all' ? t('notifications.filter.all', 'همه') : t('notifications.filter.unread', 'خوانده نشده')}
                        </button>
                    ))}
                </div>
            </div>

            <div className="px-6 mt-4 space-y-2">
                <AnimatePresence>
                    {filtered.length === 0 ? (
                        <EmptyState
                            preset="notifications"
                            title={t('notifications.empty_title', 'صندوق پیام‌ها خالی است')}
                            description={t('notifications.empty', 'اعلان جدیدی وجود ندارد. پیام‌های جدید در اینجا نمایش داده خواهند شد.')}
                        />
                    ) : (
                        filtered.map((notif, i) => {
                            const color = getNotifColor(notif.type);
                            return (
                                <motion.div
                                    key={notif.id}
                                    layout
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, x: -80 }}
                                    transition={{ delay: i * 0.03 }}
                                    onClick={() => handleClick(notif)}
                                    className={`relative omega-glass-card rounded-2xl p-4 cursor-pointer group ${!notif.isRead ? 'border-l-2 ' + color.border : ''
                                        }`}
                                    role="button"
                                    tabIndex={0}
                                    aria-label={`${notif.title}: ${notif.body}`}
                                    onKeyDown={e => e.key === 'Enter' && handleClick(notif)}
                                >
                                    <div className="flex items-start gap-3">
                                        {/* Icon */}
                                        <div className={`w-10 h-10 rounded-xl ${color.bg} flex items-center justify-center flex-shrink-0 ${color.text}`}>
                                            {getNotifIcon(notif.type)}
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <p className={`font-bold text-sm ${notif.isRead ? 'text-gray-300' : 'text-white'}`}>
                                                    {notif.title}
                                                </p>
                                                {!notif.isRead && (
                                                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse flex-shrink-0" />
                                                )}
                                            </div>
                                            <p className="text-gray-500 text-xs mt-1 leading-relaxed line-clamp-2">
                                                {notif.body}
                                            </p>
                                            <p className="text-gray-600 text-[10px] mt-2 font-mono">{notif.time}</p>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            {!notif.isRead && (
                                                <button
                                                    onClick={e => { e.stopPropagation(); markRead(notif.id); }}
                                                    className="p-1.5 rounded-lg hover:bg-white/10 text-gray-500 hover:text-white transition-colors"
                                                    title="خوانده شد"
                                                    aria-label="علامت‌گذاری به عنوان خوانده شده"
                                                >
                                                    <Check className="w-3.5 h-3.5" />
                                                </button>
                                            )}
                                            <button
                                                onClick={e => { e.stopPropagation(); deleteNotif(notif.id); }}
                                                className="p-1.5 rounded-lg hover:bg-red-500/10 text-gray-500 hover:text-red-400 transition-colors"
                                                title="حذف"
                                                aria-label="حذف اعلان"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })
                    )}
                </AnimatePresence>
            </div>
        </PageTransition>
    );
};
