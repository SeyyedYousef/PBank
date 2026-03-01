import { motion, PanInfo } from 'framer-motion';
import { Toast, useToastStore } from './toastStore';
import { CheckCircle, AlertTriangle, XCircle, Info, X } from 'lucide-react';
import { useFeedback } from '@/shared/hooks/useFeedback';
import clsx from 'clsx';

const icons = {
    success: CheckCircle,
    warning: AlertTriangle,
    error: XCircle,
    info: Info,
};

const styles = {
    success: 'bg-none border-success/30 text-success shadow-glow-success',
    warning: 'bg-none border-warning/30 text-warning shadow-glow-warning',
    error: 'bg-none border-error/30 text-error shadow-glow-error',
    info: 'bg-none border-primary/30 text-primary shadow-glow-primary',
};

const backgrounds = {
    success: 'bg-success/10',
    warning: 'bg-warning/10',
    error: 'bg-error/10',
    info: 'bg-primary/10',
};

interface ToastItemProps {
    toast: Toast;
}

export const ToastItem = ({ toast }: ToastItemProps) => {
    const dismiss = useToastStore((state) => state.dismiss);
    const { trigger } = useFeedback(); // Add feedback hook
    const Icon = icons[toast.type];

    const handleDragEnd = (_: unknown, info: PanInfo) => {
        if (info.offset.x > 100 || info.offset.x < -100) {
            dismiss(toast.id);
        }
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={handleDragEnd}
            className={clsx(
                "relative w-full max-w-sm flex items-center gap-3 p-4 rounded-2xl border backdrop-blur-md shadow-lg pointer-events-auto overflow-hidden",
                styles[toast.type],
                backgrounds[toast.type]
            )}
        >
            <div className="absolute inset-0 bg-white/5 mix-blend-overlay" />

            <Icon className="w-6 h-6 flex-shrink-0" />

            <p className="flex-1 text-sm font-medium text-white/90 dir-rtl">
                {toast.message}
            </p>

            <button
                onClick={() => {
                    trigger('click');
                    dismiss(toast.id);
                }}
                className="p-1 hover:bg-white/10 rounded-full transition-colors"
            >
                <X className="w-4 h-4 text-white/50" />
            </button>

            {/* Progress bar could go here */}
        </motion.div>
    );
};
