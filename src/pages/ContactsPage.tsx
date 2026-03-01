import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PageTransition } from '@/shared/ui/PageTransition';
import {
    ArrowLeft, Search, Star, UserPlus, User, Phone,
    Send, MoreVertical, Edit2, Trash2, X
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

interface Contact {
    id: string;
    name: string;
    phone: string;
    pbankId: string;
    avatar?: string;
    isFavorite: boolean;
    lastTransaction?: string;
}

const mockContacts: Contact[] = [
    { id: '1', name: 'احمد محمدی', phone: '+93 799 123 456', pbankId: 'PB-8291', isFavorite: true, lastTransaction: '۲ روز پیش' },
    { id: '2', name: 'فاطمه نوری', phone: '+93 700 654 321', pbankId: 'PB-4523', isFavorite: true, lastTransaction: 'دیروز' },
    { id: '3', name: 'محمد رحیمی', phone: '+93 788 987 654', pbankId: 'PB-7734', isFavorite: false, lastTransaction: '۱ هفته پیش' },
    { id: '4', name: 'زهرا احمدی', phone: '+93 793 456 789', pbankId: 'PB-1156', isFavorite: false, lastTransaction: '۲ هفته پیش' },
    { id: '5', name: 'علی حسینی', phone: '+93 707 321 987', pbankId: 'PB-9902', isFavorite: false },
    { id: '6', name: 'مریم کریمی', phone: '+93 781 111 222', pbankId: 'PB-3345', isFavorite: true, lastTransaction: '۳ روز پیش' },
    { id: '7', name: 'حسن جعفری', phone: '+93 772 333 444', pbankId: 'PB-6677', isFavorite: false },
    { id: '8', name: 'سارا موسوی', phone: '+93 796 555 666', pbankId: 'PB-8890', isFavorite: false, lastTransaction: '۱ ماه پیش' },
];

export const ContactsPage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [contacts, setContacts] = useState(mockContacts);
    const [searchQuery, setSearchQuery] = useState('');
    const [showSearch, setShowSearch] = useState(false);
    const [selectedContact, setSelectedContact] = useState<string | null>(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [newName, setNewName] = useState('');
    const [newPhone, setNewPhone] = useState('');

    const filtered = useMemo(() => {
        if (!searchQuery.trim()) return contacts;
        const q = searchQuery.toLowerCase();
        return contacts.filter(
            c => c.name.toLowerCase().includes(q) ||
                c.phone.includes(q) ||
                c.pbankId.toLowerCase().includes(q)
        );
    }, [contacts, searchQuery]);

    const favorites = filtered.filter(c => c.isFavorite);
    const others = filtered.filter(c => !c.isFavorite);

    const toggleFav = (id: string) => {
        setContacts(prev => prev.map(c => c.id === id ? { ...c, isFavorite: !c.isFavorite } : c));
    };

    const deleteContact = (id: string) => {
        setContacts(prev => prev.filter(c => c.id !== id));
        setSelectedContact(null);
    };

    const addContact = () => {
        if (!newName.trim() || !newPhone.trim()) return;
        const newContact: Contact = {
            id: Date.now().toString(),
            name: newName,
            phone: newPhone,
            pbankId: `PB-${Math.floor(Math.random() * 9000 + 1000)}`,
            isFavorite: false,
        };
        setContacts(prev => [...prev, newContact]);
        setNewName('');
        setNewPhone('');
        setShowAddModal(false);
    };

    const sendTo = (contact: Contact) => {
        navigate('/transfer', { state: { recipient: contact.pbankId, name: contact.name } });
    };

    const getInitials = (name: string) => name.split(' ').map(w => w[0]).join('').slice(0, 2);
    const getColor = (id: string) => {
        const colors = ['from-purple-500 to-violet-600', 'from-blue-500 to-cyan-500', 'from-emerald-500 to-teal-500', 'from-amber-500 to-orange-500', 'from-pink-500 to-rose-500'];
        return colors[parseInt(id) % colors.length];
    };

    const ContactCard = ({ contact }: { contact: Contact }) => (
        <motion.div
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="omega-glass-card rounded-2xl p-4 flex items-center gap-3 group"
        >
            {/* Avatar */}
            <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${getColor(contact.id)} flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow-lg`}>
                {getInitials(contact.name)}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0" onClick={() => sendTo(contact)} role="button" tabIndex={0} onKeyDown={e => e.key === 'Enter' && sendTo(contact)}>
                <p className="text-white font-bold text-sm truncate">{contact.name}</p>
                <p className="text-gray-500 text-xs font-mono mt-0.5">{contact.pbankId}</p>
                {contact.lastTransaction && (
                    <p className="text-gray-600 text-[10px] mt-0.5">آخرین تراکنش: {contact.lastTransaction}</p>
                )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1">
                <button
                    onClick={() => toggleFav(contact.id)}
                    className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                    aria-label={contact.isFavorite ? t('contacts.remove_fav', 'حذف از علاقه‌مندی‌ها') : t('contacts.add_fav', 'افزودن به علاقه‌مندی‌ها')}
                >
                    <Star className={`w-4 h-4 ${contact.isFavorite ? 'text-amber-400 fill-amber-400' : 'text-gray-600'}`} />
                </button>
                <button
                    onClick={() => sendTo(contact)}
                    className="p-2 rounded-lg hover:bg-primary/10 transition-colors"
                    aria-label={t('contacts.send_money', 'ارسال پول')}
                >
                    <Send className="w-4 h-4 text-primary" />
                </button>
                <button
                    onClick={() => setSelectedContact(selectedContact === contact.id ? null : contact.id)}
                    className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                    aria-label={t('contacts.more_options', 'گزینه‌های بیشتر')}
                >
                    <MoreVertical className="w-4 h-4 text-gray-500" />
                </button>
            </div>

            {/* Context Menu */}
            <AnimatePresence>
                {selectedContact === contact.id && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="absolute right-2 top-14 z-50 bg-[#1a1a2e] border border-white/10 rounded-xl shadow-2xl overflow-hidden"
                    >
                        <button
                            onClick={() => { setSelectedContact(null); }}
                            className="w-full px-4 py-3 flex items-center gap-2 text-sm text-gray-300 hover:bg-white/5 transition-colors"
                        >
                            <Edit2 className="w-4 h-4" /> {t('common.edit', 'ویرایش')}
                        </button>
                        <button
                            onClick={() => { navigator.clipboard.writeText(contact.phone); setSelectedContact(null); }}
                            className="w-full px-4 py-3 flex items-center gap-2 text-sm text-gray-300 hover:bg-white/5 transition-colors"
                        >
                            <Phone className="w-4 h-4" /> {t('contacts.copy_phone', 'کپی شماره')}
                        </button>
                        <button
                            onClick={() => deleteContact(contact.id)}
                            className="w-full px-4 py-3 flex items-center gap-2 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                        >
                            <Trash2 className="w-4 h-4" /> {t('common.delete', 'حذف')}
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );

    return (
        <PageTransition className="pb-32">
            {/* Header */}
            <div className="sticky top-0 z-40 px-6 py-4 backdrop-blur-xl bg-black/30 border-b border-white/5">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center" aria-label={t('accessibility.back_button', 'بازگشت')}>
                            <ArrowLeft className="w-4 h-4 text-gray-400 rtl:rotate-180" />
                        </button>
                        <h1 className="text-lg font-bold text-white">{t('services.addressBook', 'مخاطبین')}</h1>
                        <span className="text-xs text-gray-500 bg-white/5 px-2 py-0.5 rounded-full">{contacts.length}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <button onClick={() => setShowSearch(!showSearch)} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center" aria-label={t('contacts.search', 'جستجو')}>
                            {showSearch ? <X className="w-4 h-4 text-gray-400" /> : <Search className="w-4 h-4 text-gray-400" />}
                        </button>
                        <button onClick={() => setShowAddModal(true)} className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center" aria-label={t('contacts.add.title', 'افزودن مخاطب')}>
                            <UserPlus className="w-4 h-4 text-primary" />
                        </button>
                    </div>
                </div>

                {/* Search */}
                <AnimatePresence>
                    {showSearch && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                            <div className="pt-3 relative">
                                <Search className="absolute right-4 top-1/2 mt-1.5 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                <input
                                    type="text"
                                    placeholder={t('contacts.search_placeholder', 'جستجوی نام، شماره یا PBank ID...')}
                                    value={searchQuery}
                                    onChange={e => setSearchQuery(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pr-11 pl-4 text-sm text-white placeholder-gray-500 outline-none focus:border-primary/50 transition-colors"
                                    autoFocus
                                />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <div className="px-6 space-y-6 mt-4">
                {/* Favorites */}
                {favorites.length > 0 && (
                    <div>
                        <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-3 flex items-center gap-1.5">
                            <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                            {t('contacts.favorites', 'علاقه‌مندی‌ها')}
                        </p>
                        <div className="space-y-2">
                            {favorites.map(c => <ContactCard key={c.id} contact={c} />)}
                        </div>
                    </div>
                )}

                {/* All Contacts */}
                {others.length > 0 && (
                    <div>
                        <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-3 flex items-center gap-1.5">
                            <User className="w-3 h-3" />
                            {t('contacts.all', 'همه مخاطبین')}
                        </p>
                        <div className="space-y-2">
                            {others.map(c => <ContactCard key={c.id} contact={c} />)}
                        </div>
                    </div>
                )}

                {filtered.length === 0 && (
                    <div className="text-center py-16 space-y-3">
                        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto">
                            <User className="w-7 h-7 text-gray-600" />
                        </div>
                        <p className="text-gray-500 text-sm">{t('contacts.not_found', 'مخاطبی یافت نشد')}</p>
                    </div>
                )}
            </div>

            {/* Add Contact Modal */}
            <AnimatePresence>
                {showAddModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm"
                        onClick={() => setShowAddModal(false)}
                    >
                        <motion.div
                            initial={{ y: '100%' }}
                            animate={{ y: 0 }}
                            exit={{ y: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            className="w-full max-w-md bg-[#0f0a18] border-t border-white/10 rounded-t-[32px] p-6 space-y-5"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="w-12 h-1 bg-white/10 rounded-full mx-auto" />
                            <h3 className="text-lg font-bold text-white text-center">{t('contacts.add.title', 'افزودن مخاطب جدید')}</h3>

                            <div className="space-y-4">
                                <div>
                                    <label className="text-xs text-gray-400 font-bold mb-1.5 block">{t('contacts.add.name', 'نام')}</label>
                                    <input
                                        type="text"
                                        value={newName}
                                        onChange={e => setNewName(e.target.value)}
                                        placeholder={t('contacts.add.name_placeholder', 'نام مخاطب...')}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm text-white placeholder-gray-600 outline-none focus:border-primary/50"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs text-gray-400 font-bold mb-1.5 block">{t('contacts.add.phone', 'شماره تلفن')}</label>
                                    <input
                                        type="text"
                                        value={newPhone}
                                        onChange={e => setNewPhone(e.target.value)}
                                        placeholder="+93 7xx xxx xxx"
                                        dir="ltr"
                                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm text-white placeholder-gray-600 outline-none focus:border-primary/50"
                                    />
                                </div>
                            </div>

                            <button
                                onClick={addContact}
                                disabled={!newName.trim() || !newPhone.trim()}
                                className="w-full py-4 rounded-2xl bg-gradient-to-r from-primary to-purple-600 text-white font-bold text-sm disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-lg shadow-primary/30"
                            >
                                {t('contacts.add.submit', 'افزودن مخاطب')}
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </PageTransition>
    );
};
