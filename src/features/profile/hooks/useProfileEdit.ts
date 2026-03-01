import { useState, useRef, useEffect, ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '@/store/authStore';
import { toast } from '@/shared/ui/Toast';
import { useFeedback } from '@/shared/hooks/useFeedback';
import { z } from 'zod';

export const useProfileEdit = (isOpen: boolean, onClose: () => void) => {
    const { t } = useTranslation();
    const { user, updateUser, isLoading } = useAuthStore();
    const { trigger } = useFeedback();

    // Form State
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [avatar, setAvatar] = useState<string | undefined>();
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Sync with user store
    useEffect(() => {
        if (isOpen && user) {
            setName(user.name);
            setUsername(user.username || '');
            setAvatar(user.avatar);
        }
    }, [isOpen, user]);

    // Validation Schema (Dynamic for i18n)
    const schema = z.object({
        name: z.string()
            .min(2, t('validation.min_length', { min: 2 }))
            .max(50, t('validation.max_length', { max: 50 })),
        username: z.string()
            .min(3, t('validation.min_length', { min: 3 }))
            .max(30, t('validation.max_length', { max: 30 }))
            .regex(/^[a-z0-9_]+$/, t('profile.edit_modal.username_hint')),
    });

    // Shake Animation State
    const [shakeField, setShakeField] = useState<'name' | 'username' | null>(null);

    const triggerShake = (field: 'name' | 'username') => {
        setShakeField(field);
        setTimeout(() => setShakeField(null), 500); // Reset after animation
    };

    const handleSave = () => {
        try {
            const validData = schema.parse({ name, username });

            updateUser({
                name: validData.name,
                username: validData.username,
                avatar
            });

            trigger('success'); // Success feedback
            toast.success(t('profile.edit_modal.success'));
            onClose();
        } catch (e) {
            trigger('error'); // Error feedback
            if (e instanceof z.ZodError) {
                // Determine which field failed first
                const firstError = (e as any).errors[0];
                const failedField = firstError.path[0] as 'name' | 'username';
                triggerShake(failedField);

                toast.error(firstError.message);
            } else {
                toast.error(t('validation.generic_error'));
            }
        }
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 5 * 1024 * 1024) {
            toast.error(t('validation.image_size'));
            return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target?.result as string;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const MAX_SIZE = 400;
                let width = img.width;
                let height = img.height;

                if (width > height) {
                    if (width > MAX_SIZE) {
                        height *= MAX_SIZE / width;
                        width = MAX_SIZE;
                    }
                } else {
                    if (height > MAX_SIZE) {
                        width *= MAX_SIZE / height;
                        height = MAX_SIZE;
                    }
                }

                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                if (ctx) {
                    ctx.drawImage(img, 0, 0, width, height);
                    setAvatar(canvas.toDataURL('image/jpeg', 0.8));
                }
            };
        };
        reader.readAsDataURL(file);
    };

    const removeAvatar = () => {
        trigger('click');
        setAvatar(undefined);
    };

    const triggerFileInput = () => {
        trigger('click');
        fileInputRef.current?.click();
    };

    return {
        name, setName,
        username, setUsername,
        avatar, setAvatar,
        fileInputRef,
        handleSave,
        handleFileChange,
        removeAvatar,
        triggerFileInput,
        user,
        shakeField,
        isLoading
    };
};
