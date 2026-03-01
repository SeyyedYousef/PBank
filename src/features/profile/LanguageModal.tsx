import { useState } from 'react';
import { Drawer } from 'vaul';
import { Globe, Check } from 'lucide-react';

interface LanguageModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const languages = [
    { id: 'fa', name: 'پارسی', englishName: 'Persian', flag: '🇮🇷' },
    { id: 'en', name: 'English', englishName: 'English', flag: '🇺🇸' },
    { id: 'ps', name: 'پشتو', englishName: 'Pashto', flag: '🇦🇫' },
];

export const LanguageModal = ({ isOpen, onClose }: LanguageModalProps) => {
    const [selectedLang, setSelectedLang] = useState('fa');

    return (
        <Drawer.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <Drawer.Portal>
                <Drawer.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50" />
                <Drawer.Content className="bg-surface border-t border-white/10 flex flex-col rounded-t-[32px] mt-24 fixed bottom-0 left-0 right-0 z-50 h-[450px]">
                    <div className="p-4 bg-surface rounded-t-[32px] flex-1">
                        <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-white/20 mb-8" />

                        <div className="max-w-md mx-auto space-y-6">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-12 h-12 rounded-2xl bg-blue-500/20 flex items-center justify-center">
                                    <Globe className="w-6 h-6 text-blue-400" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-white">زبان برنامه</h2>
                                    <p className="text-sm text-gray-400">Language Settings</p>
                                </div>
                            </div>

                            <div className="space-y-3">
                                {languages.map((lang) => (
                                    <button
                                        key={lang.id}
                                        onClick={() => setSelectedLang(lang.id)}
                                        className={`w-full p-4 rounded-2xl border flex items-center justify-between transition-all ${selectedLang === lang.id
                                            ? 'bg-blue-500/10 border-blue-500/50 shadow-[0_0_20px_-5px_rgba(59,130,246,0.3)]'
                                            : 'bg-white/5 border-white/10 hover:bg-white/10'
                                            }`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <span className="text-2xl">{lang.flag}</span>
                                            <div className="text-right">
                                                <p className={`font-bold ${selectedLang === lang.id ? 'text-blue-400' : 'text-gray-200'}`}>
                                                    {lang.name}
                                                </p>
                                                <p className="text-xs text-gray-500 font-sans">{lang.englishName}</p>
                                            </div>
                                        </div>
                                        {selectedLang === lang.id && (
                                            <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
                                                <Check className="w-3 h-3 text-white" />
                                            </div>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </Drawer.Content>
            </Drawer.Portal>
        </Drawer.Root>
    );
};
