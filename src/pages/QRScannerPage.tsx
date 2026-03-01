import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PageTransition } from '@/shared/ui/PageTransition';
import { ArrowLeft, Zap, Camera, FlashlightOff, Copy, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Simulated QR scanner (no real camera — mock for frontend)
export const QRScannerPage = () => {
    const navigate = useNavigate();
    const [isScanning, setIsScanning] = useState(true);
    const [scannedData, setScannedData] = useState<string | null>(null);
    const [flashOn, setFlashOn] = useState(false);
    const [copied, setCopied] = useState(false);

    // Simulate a scan after 3 seconds
    useEffect(() => {
        if (!isScanning) return;
        const timer = setTimeout(() => {
            setScannedData('PB-8291');
            setIsScanning(false);
        }, 3000);
        return () => clearTimeout(timer);
    }, [isScanning]);

    const copyResult = () => {
        if (scannedData) {
            navigator.clipboard.writeText(scannedData);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const sendToAddress = () => {
        if (scannedData) {
            navigate('/transfer', { state: { recipient: scannedData } });
        }
    };

    const rescan = () => {
        setScannedData(null);
        setIsScanning(true);
    };

    return (
        <PageTransition className="min-h-screen bg-black relative overflow-hidden">
            {/* Header */}
            <div className="absolute top-0 left-0 right-0 z-40 px-6 py-4 flex items-center justify-between">
                <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-full bg-black/60 backdrop-blur-xl flex items-center justify-center border border-white/10" aria-label="بازگشت">
                    <ArrowLeft className="w-4 h-4 text-white rtl:rotate-180" />
                </button>
                <h1 className="text-sm font-bold text-white">اسکن QR Code</h1>
                <button
                    onClick={() => setFlashOn(!flashOn)}
                    className={`w-10 h-10 rounded-full backdrop-blur-xl flex items-center justify-center border transition-colors ${flashOn ? 'bg-amber-500/20 border-amber-500/30' : 'bg-black/60 border-white/10'
                        }`}
                    aria-label="فلش"
                >
                    {flashOn ? <Zap className="w-4 h-4 text-amber-400" /> : <FlashlightOff className="w-4 h-4 text-gray-400" />}
                </button>
            </div>

            {/* Camera View (simulated) */}
            <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
                {/* Simulated camera noise */}
                <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")' }} />

                {/* Scan Frame */}
                <div className="relative w-72 h-72">
                    {/* Corner brackets */}
                    {['top-0 left-0', 'top-0 right-0 rotate-90', 'bottom-0 right-0 rotate-180', 'bottom-0 left-0 -rotate-90'].map((cls, i) => (
                        <div key={i} className={`absolute ${cls} w-14 h-14`}>
                            <div className="absolute top-0 left-0 w-full h-[3px] bg-primary rounded-full shadow-[0_0_10px_rgba(127,0,255,0.5)]" />
                            <div className="absolute top-0 left-0 h-full w-[3px] bg-primary rounded-full shadow-[0_0_10px_rgba(127,0,255,0.5)]" />
                        </div>
                    ))}

                    {/* Scanning line */}
                    {isScanning && (
                        <motion.div
                            animate={{ y: [0, 288, 0] }}
                            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                            className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent shadow-[0_0_20px_rgba(127,0,255,0.6)]"
                        />
                    )}

                    {/* Center dot */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <motion.div
                            animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="w-3 h-3 rounded-full border-2 border-primary/50"
                        />
                    </div>

                    {/* Grid overlay */}
                    <div className="absolute inset-4 grid grid-cols-3 grid-rows-3 opacity-10">
                        {Array.from({ length: 9 }).map((_, i) => (
                            <div key={i} className="border border-white/20" />
                        ))}
                    </div>
                </div>

                {/* Overlay gradient */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/60" />
                </div>
            </div>

            {/* Bottom Panel */}
            <div className="absolute bottom-0 left-0 right-0 z-40 p-6 space-y-4">
                {scannedData ? (
                    <motion.div
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="space-y-4"
                    >
                        <div className="omega-glass-card rounded-2xl p-5 space-y-4 border-emerald-500/20">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-emerald-500/15 flex items-center justify-center">
                                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-bold text-emerald-400">شناسایی شد!</p>
                                    <p className="text-xs text-gray-400 mt-0.5">آدرس PBank</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 bg-white/5 rounded-xl p-3">
                                <code className="flex-1 text-sm font-mono text-white tracking-wider">{scannedData}</code>
                                <button onClick={copyResult} className="p-1.5 rounded-lg hover:bg-white/10" aria-label="کپی آدرس">
                                    {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-gray-500" />}
                                </button>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <button onClick={rescan} className="py-4 rounded-2xl bg-white/5 text-white font-bold text-sm border border-white/10 active:bg-white/10 transition">
                                اسکن مجدد
                            </button>
                            <button onClick={sendToAddress} className="py-4 rounded-2xl bg-gradient-to-r from-primary to-purple-600 text-white font-bold text-sm shadow-lg shadow-primary/20 active:scale-[0.98] transition">
                                ارسال پول
                            </button>
                        </div>
                    </motion.div>
                ) : (
                    <div className="text-center space-y-3">
                        <div className="flex items-center justify-center gap-2 text-gray-300 text-sm font-medium">
                            <Camera className="w-4 h-4" />
                            <span>QR Code را در کادر قرار دهید</span>
                        </div>
                        <p className="text-[10px] text-gray-600">اسکن خودکار فعال است</p>
                    </div>
                )}
            </div>
        </PageTransition>
    );
};
