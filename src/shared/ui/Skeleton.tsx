import { cn } from "@/shared/lib/utils";
import { motion } from "framer-motion";

/* ═══════════════════════════════════════════════
   SKELETON SYSTEM — Premium Loading States
   ═══════════════════════════════════════════════ */

export function Skeleton({
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            className={cn(
                "relative overflow-hidden rounded-md bg-white/[0.06]",
                className
            )}
            {...props}
        >
            {/* Shimmer sweep */}
            <motion.div
                animate={{ x: ['-100%', '200%'] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.04] to-transparent -skew-x-12"
            />
        </div>
    );
}

/* ── Preset Skeleton Variants ── */

export function SkeletonCard() {
    return (
        <div className="omega-glass-card rounded-2xl p-5 space-y-4">
            <div className="flex items-center gap-3">
                <Skeleton className="w-12 h-12 rounded-full" />
                <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-2/3 rounded-lg" />
                    <Skeleton className="h-3 w-1/3 rounded-lg" />
                </div>
            </div>
            <Skeleton className="h-10 w-full rounded-xl" />
        </div>
    );
}

export function SkeletonTransaction() {
    return (
        <div className="flex items-center gap-3 py-3">
            <Skeleton className="w-11 h-11 rounded-xl" />
            <div className="flex-1 space-y-2">
                <Skeleton className="h-3.5 w-24 rounded-md" />
                <Skeleton className="h-2.5 w-16 rounded-md" />
            </div>
            <div className="space-y-2 text-right">
                <Skeleton className="h-3.5 w-20 rounded-md ml-auto" />
                <Skeleton className="h-2.5 w-12 rounded-md ml-auto" />
            </div>
        </div>
    );
}

export function SkeletonBalance() {
    return (
        <div className="omega-glass-card rounded-3xl p-6 space-y-4">
            <Skeleton className="h-3 w-20 rounded-md" />
            <Skeleton className="h-10 w-44 rounded-xl" />
            <div className="flex gap-3 mt-4">
                {[1, 2, 3].map(i => (
                    <Skeleton key={i} className="h-14 flex-1 rounded-2xl" />
                ))}
            </div>
        </div>
    );
}

export function SkeletonService() {
    return (
        <div className="grid grid-cols-3 gap-3">
            {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="omega-glass-card rounded-2xl p-4 flex flex-col items-center gap-2">
                    <Skeleton className="w-10 h-10 rounded-xl" />
                    <Skeleton className="h-2.5 w-14 rounded-md" />
                </div>
            ))}
        </div>
    );
}

export function SkeletonProfile() {
    return (
        <div className="space-y-6 p-6">
            <div className="flex flex-col items-center gap-4">
                <Skeleton className="w-24 h-24 rounded-full" />
                <Skeleton className="h-5 w-32 rounded-lg" />
                <Skeleton className="h-3 w-24 rounded-md" />
            </div>
            <div className="space-y-3">
                {[1, 2, 3, 4].map(i => (
                    <Skeleton key={i} className="h-16 w-full rounded-2xl" />
                ))}
            </div>
        </div>
    );
}

export function SkeletonPage() {
    return (
        <div className="p-6 space-y-6 animate-in fade-in">
            <SkeletonBalance />
            <div className="space-y-2">
                {[1, 2, 3, 4].map(i => (
                    <SkeletonTransaction key={i} />
                ))}
            </div>
        </div>
    );
}
