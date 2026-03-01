import { Camera, Save, User, Trash2 } from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import { Drawer } from 'vaul';
import { useTranslation } from 'react-i18next';
import { useProfileEdit } from './hooks/useProfileEdit';
import { Skeleton } from '@/shared/ui/Skeleton';

interface ProfileEditModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const ProfileEditModal = ({ isOpen, onClose }: ProfileEditModalProps) => {
    const { t } = useTranslation();

    // Using our custom hook for all logic
    const {
        name, setName,
        username, setUsername,
        avatar,
        removeAvatar,
        fileInputRef,
        handleSave,
        handleFileChange,
        triggerFileInput,
        user,
        shakeField,
        isLoading
    } = useProfileEdit(isOpen, onClose);

    // If not open, don't render anything to save resources
    // But keep Drawer.Root for animation references if needed?
    // Vaul handles this well.

    return (
        <Drawer.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <Drawer.Portal>
                <Drawer.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50" />
                <Drawer.Content className="fixed bottom-0 left-0 right-0 z-50 mt-24 flex max-h-[90vh] flex-col rounded-t-[32px] border-t border-white/10 bg-surface outline-none">
                    <div className="flex-1 overflow-y-auto rounded-t-[32px] bg-surface p-4">
                        <div className="mx-auto mb-8 h-1.5 w-12 flex-shrink-0 rounded-full bg-white/20" />

                        <div className="mx-auto max-w-md space-y-8 pb-8">
                            <h2 className="mb-4 text-center text-xl font-bold text-white">
                                {t('profile.edit_modal.title')}
                            </h2>

                            {isLoading || !user ? (
                                /* Skeleton Loading State */
                                <div className="animate-pulse space-y-8">
                                    <div className="flex flex-col items-center gap-4">
                                        <Skeleton className="h-24 w-24 rounded-full" />
                                        <Skeleton className="h-4 w-32" />
                                    </div>
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <Skeleton className="h-4 w-20" />
                                            <Skeleton className="h-14 w-full rounded-2xl" />
                                        </div>
                                        <div className="space-y-2">
                                            <Skeleton className="h-4 w-20" />
                                            <Skeleton className="h-14 w-full rounded-2xl" />
                                        </div>
                                    </div>
                                    <Skeleton className="mt-4 h-14 w-full rounded-2xl" />
                                </div>
                            ) : (
                                /* Actual Form Content */
                                <>
                                    <div className="flex flex-col items-center gap-4">
                                        <div className="relative group">
                                            <button
                                                type="button"
                                                onClick={triggerFileInput}
                                                className="w-24 h-24 rounded-full bg-gradient-to-tr from-primary to-primary-glow p-[3px] cursor-pointer hover:scale-105 transition-transform relative focus:outline-none focus:ring-4 focus:ring-primary/50"
                                                aria-label={avatar ? t('profile.edit_modal.change_photo') : t('profile.edit_modal.upload_photo')}
                                            >
                                                <div className="w-full h-full rounded-full bg-surface flex items-center justify-center overflow-hidden relative">
                                                    {avatar ? (
                                                        <img src={avatar} alt={t('profile.edit_modal.user_avatar')} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <User className="w-10 h-10 text-white/50" />
                                                    )}

                                                    {/* Overlay */}
                                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <Camera className="w-8 h-8 text-white" />
                                                    </div>
                                                </div>
                                            </button>

                                            {avatar && (
                                                <button
                                                    type="button"
                                                    onClick={removeAvatar}
                                                    className="absolute -bottom-1 -right-1 w-8 h-8 bg-surface border border-white/10 rounded-full flex items-center justify-center hover:bg-red-500/20 hover:border-red-500/50 transition-colors text-gray-400 hover:text-red-500 focus:outline-none focus:ring-2 focus:ring-red-500"
                                                    title={t('common.remove')}
                                                    aria-label={t('common.remove_image')}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            )}
                                        </div>
                                        <p className="text-sm text-gray-400" id="photo-hint">
                                            {t('profile.edit_modal.tap_to_change')}
                                        </p>
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            className="hidden"
                                            accept="image/*"
                                            onChange={handleFileChange}
                                            aria-describedby="photo-hint"
                                        />
                                    </div>

                                    <div className="space-y-4">
                                        <div className={`space-y-2 ${shakeField === 'name' ? 'animate-shake text-error' : ''}`}>
                                            <label htmlFor="display-name" className="text-sm text-gray-400">
                                                {t('profile.edit_modal.display_name')}
                                            </label>
                                            <div className="relative">
                                                <div className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
                                                    <User className={`w-4 h-4 ${shakeField === 'name' ? 'text-error' : 'text-primary'}`} />
                                                </div>
                                                <input
                                                    id="display-name"
                                                    type="text"
                                                    value={name}
                                                    onChange={(e) => setName(e.target.value)}
                                                    className={`w-full bg-black/20 border rounded-2xl h-14 pr-14 pl-4 text-white focus:outline-none transition-colors ${shakeField === 'name'
                                                        ? 'border-error focus:border-error'
                                                        : 'border-white/10 focus:border-primary/50'
                                                        }`}
                                                />
                                            </div>
                                        </div>

                                        <div className={`space-y-2 ${shakeField === 'username' ? 'animate-shake text-error' : ''}`}>
                                            <label htmlFor="username" className="text-sm text-gray-400">
                                                {t('profile.edit_modal.username')}
                                            </label>
                                            <div className="relative">
                                                <div className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
                                                    <span className={`font-bold ${shakeField === 'username' ? 'text-error' : 'text-primary'}`}>@</span>
                                                </div>
                                                <input
                                                    id="username"
                                                    type="text"
                                                    value={username}
                                                    onChange={(e) => {
                                                        const val = e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '');
                                                        setUsername(val);
                                                    }}
                                                    className={`w-full bg-black/20 border rounded-2xl h-14 pr-14 pl-4 text-white focus:outline-none transition-colors dir-ltr font-mono ${shakeField === 'username'
                                                        ? 'border-error focus:border-error'
                                                        : 'border-white/10 focus:border-primary/50'
                                                        }`}
                                                    placeholder="username"
                                                />
                                            </div>
                                            <p className={`text-[10px] ${shakeField === 'username' ? 'text-error/80' : 'text-gray-500'}`}>
                                                {t('profile.edit_modal.username_hint')}
                                            </p>
                                        </div>
                                    </div>

                                    <Button
                                        className="w-full h-14 text-base font-bold rounded-2xl mt-4"
                                        onClick={handleSave}
                                    >
                                        <Save className="w-5 h-5 ml-2" />
                                        {t('common.save')}
                                    </Button>
                                </>
                            )}
                        </div>
                    </div>
                </Drawer.Content>
            </Drawer.Portal>
        </Drawer.Root>
    );
};
