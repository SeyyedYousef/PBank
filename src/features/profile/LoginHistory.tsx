
import { Smartphone, Monitor, Globe, Clock } from 'lucide-react';

export const LoginHistory = () => {
    const logs = [
        { id: 1, device: 'iPhone 15 Pro Max', ip: '5.123.43.12', location: 'Tehran, IR', time: 'هم‌اکنون', status: 'success' },
        { id: 2, device: 'Windows 10 Chrome', ip: '89.32.11.90', location: 'Mashhad, IR', time: 'دیروز, 14:30', status: 'success' },
        { id: 3, device: 'Unknown Android', ip: '192.168.1.1', location: 'Shiraz, IR', time: '3 روز پیش', status: 'failed' },
    ];

    return (
        <div className="space-y-3">
            {logs.map((log) => (
                <div key={log.id} className="p-3 bg-white/5 rounded-xl border border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${log.status === 'success' ? 'bg-emerald-500/10' : 'bg-red-500/10'}`}>
                            {log.device.includes('iPhone') || log.device.includes('Android') ?
                                <Smartphone className={`w-5 h-5 ${log.status === 'success' ? 'text-emerald-500' : 'text-red-500'}`} /> :
                                <Monitor className={`w-5 h-5 ${log.status === 'success' ? 'text-emerald-500' : 'text-red-500'}`} />
                            }
                        </div>
                        <div>
                            <p className="font-bold text-gray-200 text-sm">{log.device}</p>
                            <div className="flex items-center gap-2 text-[10px] text-gray-500">
                                <span className="flex items-center gap-1"><Globe className="w-3 h-3" /> {log.location}</span>
                                <span className="w-1 h-1 rounded-full bg-gray-600" />
                                <span className="font-mono">{log.ip}</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full ${log.status === 'success' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                            {log.status === 'success' ? 'موفق' : 'ناموفق'}
                        </span>
                        <span className="text-[10px] text-gray-500 flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {log.time}
                        </span>
                    </div>
                </div>
            ))}
        </div>
    );
};
