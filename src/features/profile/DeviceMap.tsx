


export const DeviceMap = () => {
    return (
        <div className="w-full h-48 bg-blue-900/20 rounded-2xl border border-white/10 relative overflow-hidden group">
            {/* Abstract Map Background */}
            <svg className="absolute inset-0 w-full h-full opacity-30" viewBox="0 0 100 100" preserveAspectRatio="none">
                <path d="M0 100 L20 80 L40 90 L60 70 L80 85 L100 60 L100 100 Z" fill="currentColor" className="text-blue-500" />
                <circle cx="20" cy="30" r="15" fill="currentColor" className="text-blue-500/20" />
                <circle cx="80" cy="20" r="10" fill="currentColor" className="text-blue-500/10" />
            </svg>

            {/* Current Device Pin */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                <div className="relative">
                    <div className="w-4 h-4 rounded-full bg-emerald-500 animate-ping absolute inset-0" />
                    <div className="w-4 h-4 rounded-full bg-emerald-500 relative z-10 border-2 border-white shadow-lg" />
                </div>
                <div className="bg-surface/80 backdrop-blur-md px-3 py-1 rounded-full mt-2 border border-white/10 shadow-xl">
                    <p className="text-[10px] font-bold text-white">تهران، کنونی</p>
                </div>
            </div>

            {/* Other Device Pin */}
            <div className="absolute top-1/3 left-1/4 flex flex-col items-center opacity-60">
                <div className="w-3 h-3 rounded-full bg-gray-400 border-2 border-white shadow-lg" />
                <div className="bg-surface/80 backdrop-blur-md px-2 py-0.5 rounded-full mt-1 border border-white/10">
                    <p className="text-[8px] font-bold text-gray-300">مشهد</p>
                </div>
            </div>
        </div>
    );
};
