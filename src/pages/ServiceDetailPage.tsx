import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/shared/ui/Button';
import { PageTransition } from '@/shared/ui/PageTransition';
import {
    ArrowLeft, Smartphone, Zap, Wifi, Plane, Building, MoreHorizontal,
    Check, Calendar, MapPin, Users, Star, Clock, Search
} from 'lucide-react';

// ── Service Config ──
const serviceConfigs: Record<string, {
    title: string;
    subtitle: string;
    icon: any;
    color: string;
    bgGradient: string;
    glowColor: string;
}> = {
    'mobile-credit': {
        title: 'کریدت موبایل',
        subtitle: 'شارژ و بسته اینترنت',
        icon: Smartphone,
        color: 'text-blue-400',
        bgGradient: 'from-blue-600/20 to-blue-900/10',
        glowColor: 'bg-blue-500/30',
    },
    'electricity': {
        title: 'برق برشنا',
        subtitle: 'پرداخت قبض برق',
        icon: Zap,
        color: 'text-amber-400',
        bgGradient: 'from-amber-600/20 to-amber-900/10',
        glowColor: 'bg-amber-500/30',
    },
    'internet': {
        title: 'اینترنت',
        subtitle: 'بسته‌های اینترنت و وای‌فای',
        icon: Wifi,
        color: 'text-violet-400',
        bgGradient: 'from-violet-600/20 to-violet-900/10',
        glowColor: 'bg-violet-500/30',
    },
    'flights': {
        title: 'پرواز',
        subtitle: 'خرید بلیط هواپیما',
        icon: Plane,
        color: 'text-emerald-400',
        bgGradient: 'from-emerald-600/20 to-emerald-900/10',
        glowColor: 'bg-emerald-500/30',
    },
    'taxes': {
        title: 'مالیات',
        subtitle: 'پرداخت مالیات و عوارض',
        icon: Building,
        color: 'text-rose-400',
        bgGradient: 'from-rose-600/20 to-rose-900/10',
        glowColor: 'bg-rose-500/30',
    },
    'others': {
        title: 'سایر خدمات',
        subtitle: 'خدمات متنوع',
        icon: MoreHorizontal,
        color: 'text-gray-400',
        bgGradient: 'from-gray-600/20 to-gray-900/10',
        glowColor: 'bg-gray-500/30',
    },
};

// ── Mobile Top-up Component ──
const MobileTopupUI = () => {
    const [phone, setPhone] = useState('');
    const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
    const [operator, setOperator] = useState<string>('roshan');

    const operators = [
        { id: 'roshan', name: 'روشن', color: 'bg-red-500/15 border-red-500/20 text-red-400' },
        { id: 'etisalat', name: 'اتصالات', color: 'bg-emerald-500/15 border-emerald-500/20 text-emerald-400' },
        { id: 'mtn', name: 'MTN', color: 'bg-yellow-500/15 border-yellow-500/20 text-yellow-400' },
        { id: 'salaam', name: 'سلام', color: 'bg-blue-500/15 border-blue-500/20 text-blue-400' },
    ];

    const amounts = [50, 100, 200, 500, 1000, 2000];

    return (
        <div className="space-y-6">
            {/* Operator Selection */}
            <div>
                <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-3">اپراتور</p>
                <div className="grid grid-cols-4 gap-2">
                    {operators.map(op => (
                        <button
                            key={op.id}
                            onClick={() => setOperator(op.id)}
                            className={`py-3 rounded-xl border text-xs font-bold transition-all ${operator === op.id ? op.color : 'bg-white/5 border-white/10 text-gray-500'
                                } ${operator === op.id ? 'scale-105 shadow-lg' : 'hover:bg-white/10'}`}
                        >
                            {op.name}
                        </button>
                    ))}
                </div>
            </div>

            {/* Phone Number */}
            <div>
                <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-3">شماره موبایل</p>
                <div className="relative">
                    <Smartphone className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input
                        type="tel"
                        placeholder="07X XXX XXXX"
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pr-12 pl-4 text-white text-sm outline-none focus:border-primary/50 transition-colors placeholder-gray-600 font-mono ltr-nums"
                        dir="ltr"
                    />
                </div>
            </div>

            {/* Amount Grid */}
            <div>
                <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-3">مبلغ شارژ (AFN)</p>
                <div className="grid grid-cols-3 gap-3">
                    {amounts.map(amt => (
                        <button
                            key={amt}
                            onClick={() => setSelectedAmount(amt)}
                            className={`py-4 rounded-2xl border font-bold text-base transition-all ${selectedAmount === amt
                                ? 'bg-primary/20 border-primary/40 text-white shadow-lg shadow-primary/10 scale-105'
                                : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:text-white'
                                }`}
                        >
                            {amt.toLocaleString()}
                        </button>
                    ))}
                </div>
            </div>

            {/* Summary */}
            {selectedAmount && phone && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="omega-glass rounded-2xl p-4 space-y-2"
                >
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-400">مبلغ</span>
                        <span className="text-white font-bold">{selectedAmount.toLocaleString()} AFN</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-400">کارمزد</span>
                        <span className="text-emerald-400 font-bold">رایگان</span>
                    </div>
                    <div className="border-t border-white/10 pt-2 flex justify-between text-sm">
                        <span className="text-gray-400">مجموع</span>
                        <span className="text-white font-black text-lg">{selectedAmount.toLocaleString()} AFN</span>
                    </div>
                </motion.div>
            )}

            <Button
                disabled={!selectedAmount || !phone}
                className="w-full h-14 text-base font-bold shadow-lg shadow-primary/20 disabled:opacity-40 disabled:shadow-none"
            >
                <Check className="w-5 h-5 ml-2" />
                پرداخت و شارژ
            </Button>
        </div>
    );
};

// ── Electricity (Brishna) Component ──
const ElectricityUI = () => {
    const [meterId, setMeterId] = useState('');
    const [amount, setAmount] = useState('');
    const [lookupDone, setLookupDone] = useState(false);

    const handleLookup = () => {
        if (meterId.length >= 5) setLookupDone(true);
    };

    return (
        <div className="space-y-6">
            {/* Meter ID Input */}
            <div>
                <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-3">شماره میتر</p>
                <div className="flex gap-3">
                    <div className="relative flex-1">
                        <Zap className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-400" />
                        <input
                            type="text"
                            placeholder="شماره میتر برق"
                            value={meterId}
                            onChange={e => setMeterId(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pr-12 pl-4 text-white text-sm outline-none focus:border-amber-500/50 transition-colors placeholder-gray-600 font-mono ltr-nums"
                            dir="ltr"
                        />
                    </div>
                    <button
                        onClick={handleLookup}
                        className="px-5 rounded-2xl bg-amber-500/20 text-amber-400 font-bold text-sm hover:bg-amber-500/30 transition-colors border border-amber-500/20"
                    >
                        استعلام
                    </button>
                </div>
            </div>

            {/* Account Info */}
            <AnimatePresence>
                {lookupDone && (
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="omega-glass rounded-2xl p-4 space-y-3 neon-border-gold"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
                                <Zap className="w-5 h-5 text-amber-400" />
                            </div>
                            <div>
                                <p className="text-white font-bold text-sm">حساب برشنا</p>
                                <p className="text-gray-400 text-[11px]">نام: احمد محمدی • کابل، افغانستان</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3 pt-2">
                            <div className="bg-white/5 rounded-xl p-3 text-center">
                                <p className="text-gray-400 text-[10px]">بدهی فعلی</p>
                                <p className="text-amber-400 font-bold text-lg">۱,۲۵۰</p>
                            </div>
                            <div className="bg-white/5 rounded-xl p-3 text-center">
                                <p className="text-gray-400 text-[10px]">آخرین پرداخت</p>
                                <p className="text-emerald-400 font-bold text-lg">۸۰۰</p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Amount */}
            <div>
                <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-3">مبلغ پرداخت (AFN)</p>
                <input
                    type="number"
                    placeholder="مبلغ را وارد کنید"
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-4 text-white text-sm outline-none focus:border-amber-500/50 transition-colors placeholder-gray-600"
                />
                {lookupDone && (
                    <div className="flex gap-2 mt-3">
                        {[500, 1000, 1250].map(a => (
                            <button
                                key={a}
                                onClick={() => setAmount(a.toString())}
                                className="px-4 py-2 rounded-xl bg-white/5 text-gray-400 text-xs font-bold hover:bg-white/10 hover:text-white transition-all border border-white/5"
                            >
                                {a.toLocaleString()}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            <Button
                disabled={!meterId || !amount}
                className="w-full h-14 text-base font-bold bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 shadow-lg shadow-amber-600/20 disabled:opacity-40 disabled:shadow-none"
            >
                <Zap className="w-5 h-5 ml-2" />
                پرداخت قبض
            </Button>
        </div>
    );
};

// ── Flights Component ──
const FlightsUI = () => {
    const [origin, setOrigin] = useState('کابل');
    const [destination, setDestination] = useState('');
    const [date, setDate] = useState('');
    const [passengers, setPassengers] = useState(1);
    const [searched, setSearched] = useState(false);

    const mockFlights = [
        { airline: 'آریانا افغان', code: 'FG-301', time: '08:30', arrive: '10:45', price: 8500, stops: 0, duration: '2h 15m' },
        { airline: 'کام ایر', code: 'KM-412', time: '14:00', arrive: '16:30', price: 7200, stops: 0, duration: '2h 30m' },
        { airline: 'ترکیش ایرلاینز', code: 'TK-720', time: '22:15', arrive: '04:30+1', price: 15800, stops: 1, duration: '6h 15m' },
    ];

    return (
        <div className="space-y-6">
            {/* Route Inputs */}
            <div className="omega-glass rounded-2xl p-4 space-y-4">
                <div className="flex gap-3 items-center">
                    <div className="flex-1">
                        <p className="text-gray-500 text-[10px] mb-1">مبدأ</p>
                        <div className="flex items-center gap-2 bg-white/5 rounded-xl py-3 px-3 border border-white/10">
                            <MapPin className="w-4 h-4 text-emerald-400" />
                            <input
                                type="text"
                                value={origin}
                                onChange={e => setOrigin(e.target.value)}
                                className="bg-transparent text-white text-sm outline-none w-full"
                            />
                        </div>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center mt-4 flex-shrink-0">
                        <Plane className="w-4 h-4 text-gray-400 rotate-90" />
                    </div>
                    <div className="flex-1">
                        <p className="text-gray-500 text-[10px] mb-1">مقصد</p>
                        <div className="flex items-center gap-2 bg-white/5 rounded-xl py-3 px-3 border border-white/10">
                            <MapPin className="w-4 h-4 text-rose-400" />
                            <input
                                type="text"
                                placeholder="شهر مقصد"
                                value={destination}
                                onChange={e => setDestination(e.target.value)}
                                className="bg-transparent text-white text-sm outline-none w-full placeholder-gray-600"
                            />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <p className="text-gray-500 text-[10px] mb-1">تاریخ</p>
                        <div className="flex items-center gap-2 bg-white/5 rounded-xl py-3 px-3 border border-white/10">
                            <Calendar className="w-4 h-4 text-blue-400" />
                            <input
                                type="date"
                                value={date}
                                onChange={e => setDate(e.target.value)}
                                className="bg-transparent text-white text-sm outline-none w-full"
                            />
                        </div>
                    </div>
                    <div>
                        <p className="text-gray-500 text-[10px] mb-1">مسافران</p>
                        <div className="flex items-center gap-2 bg-white/5 rounded-xl py-3 px-3 border border-white/10">
                            <Users className="w-4 h-4 text-purple-400" />
                            <div className="flex items-center gap-3 flex-1">
                                <button
                                    onClick={() => setPassengers(Math.max(1, passengers - 1))}
                                    className="w-6 h-6 rounded-full bg-white/10 text-white text-xs font-bold"
                                >-</button>
                                <span className="text-white font-bold text-sm">{passengers}</span>
                                <button
                                    onClick={() => setPassengers(Math.min(9, passengers + 1))}
                                    className="w-6 h-6 rounded-full bg-white/10 text-white text-xs font-bold"
                                >+</button>
                            </div>
                        </div>
                    </div>
                </div>

                <Button
                    onClick={() => setSearched(true)}
                    disabled={!destination || !date}
                    className="w-full h-12 font-bold disabled:opacity-40"
                >
                    <Search className="w-4 h-4 ml-2" />
                    جستجوی پرواز
                </Button>
            </div>

            {/* Results */}
            <AnimatePresence>
                {searched && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="space-y-3"
                    >
                        <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">{mockFlights.length} پرواز یافت شد</p>
                        {mockFlights.map((flight, i) => (
                            <motion.div
                                key={flight.code}
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="omega-glass-card rounded-2xl p-4 space-y-3 cursor-pointer active:scale-[0.98] transition-transform"
                            >
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-white font-bold text-sm">{flight.airline}</p>
                                        <p className="text-gray-500 text-[10px] font-mono">{flight.code}</p>
                                    </div>
                                    <div className="text-left">
                                        <p className="text-emerald-400 font-black text-lg">{flight.price.toLocaleString()}</p>
                                        <p className="text-gray-500 text-[10px]">AFN / نفر</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 pt-1">
                                    <div className="text-center">
                                        <p className="text-white font-bold text-base">{flight.time}</p>
                                        <p className="text-gray-500 text-[10px]">{origin}</p>
                                    </div>
                                    <div className="flex-1 flex flex-col items-center gap-1">
                                        <p className="text-gray-500 text-[10px]">{flight.duration}</p>
                                        <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent relative">
                                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-primary" />
                                        </div>
                                        <p className="text-gray-600 text-[10px]">{flight.stops === 0 ? 'مستقیم' : `${flight.stops} توقف`}</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-white font-bold text-base">{flight.arrive}</p>
                                        <p className="text-gray-500 text-[10px]">{destination}</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

// ── Taxes Component ──
const TaxesUI = () => {
    const [taxType, setTaxType] = useState('income');
    const [taxId, setTaxId] = useState('');
    const [amount, setAmount] = useState('');

    const taxTypes = [
        { id: 'income', label: 'مالیات درآمد', icon: '💰' },
        { id: 'business', label: 'مالیات تجاری', icon: '🏢' },
        { id: 'property', label: 'مالیات ملکی', icon: '🏠' },
        { id: 'customs', label: 'گمرک', icon: '📦' },
    ];

    return (
        <div className="space-y-6">
            {/* Tax Type */}
            <div>
                <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-3">نوع مالیات</p>
                <div className="grid grid-cols-2 gap-3">
                    {taxTypes.map(tt => (
                        <button
                            key={tt.id}
                            onClick={() => setTaxType(tt.id)}
                            className={`flex items-center gap-3 p-4 rounded-2xl border transition-all ${taxType === tt.id
                                ? 'bg-rose-500/15 border-rose-500/30 shadow-lg'
                                : 'bg-white/5 border-white/10 hover:bg-white/10'
                                }`}
                        >
                            <span className="text-2xl">{tt.icon}</span>
                            <span className={`text-xs font-bold ${taxType === tt.id ? 'text-rose-400' : 'text-gray-400'}`}>
                                {tt.label}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Tax ID */}
            <div>
                <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-3">شماره مالیاتی (TIN)</p>
                <div className="relative">
                    <Building className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-rose-400" />
                    <input
                        type="text"
                        placeholder="شماره مالیاتی خود را وارد کنید"
                        value={taxId}
                        onChange={e => setTaxId(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pr-12 pl-4 text-white text-sm outline-none focus:border-rose-500/50 transition-colors placeholder-gray-600 font-mono ltr-nums"
                        dir="ltr"
                    />
                </div>
            </div>

            {/* Amount */}
            <div>
                <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-3">مبلغ پرداخت (AFN)</p>
                <input
                    type="number"
                    placeholder="مبلغ مالیات"
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-4 text-white text-sm outline-none focus:border-rose-500/50 transition-colors placeholder-gray-600"
                />
            </div>

            {/* Info Box */}
            <div className="omega-glass rounded-2xl p-4 space-y-2">
                <div className="flex justify-between text-sm">
                    <span className="text-gray-400">نوع</span>
                    <span className="text-white font-bold">{taxTypes.find(t => t.id === taxType)?.label}</span>
                </div>
                {amount && (
                    <>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-400">مبلغ</span>
                            <span className="text-white font-bold">{Number(amount).toLocaleString()} AFN</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-400">کارمزد خدمات</span>
                            <span className="text-emerald-400 font-bold">رایگان</span>
                        </div>
                    </>
                )}
            </div>

            <Button
                disabled={!taxId || !amount}
                className="w-full h-14 text-base font-bold bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 shadow-lg shadow-rose-600/20 disabled:opacity-40 disabled:shadow-none"
            >
                <Building className="w-5 h-5 ml-2" />
                پرداخت مالیات
            </Button>
        </div>
    );
};

// ── Internet Component ──
const InternetUI = () => {
    const [selectedPlan, setSelectedPlan] = useState<number | null>(null);

    const plans = [
        { id: 1, name: 'بسته ۱ ماهه', data: '10GB', speed: '4G', price: 350, popular: false },
        { id: 2, name: 'بسته ۱ ماهه', data: '30GB', speed: '4G+', price: 700, popular: true },
        { id: 3, name: 'بسته ۱ ماهه', data: '50GB', speed: '4G+', price: 1100, popular: false },
        { id: 4, name: 'بسته ۳ ماهه', data: '100GB', speed: '4G+', price: 2500, popular: false },
        { id: 5, name: 'بسته شبانه', data: 'نامحدود', speed: '4G', price: 200, popular: false },
        { id: 6, name: 'بسته VIP', data: 'نامحدود', speed: '5G', price: 5000, popular: false },
    ];

    return (
        <div className="space-y-6">
            <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">بسته اینترنت مورد نظر خود را انتخاب کنید</p>

            <div className="space-y-3">
                {plans.map((plan, i) => (
                    <motion.button
                        key={plan.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.06 }}
                        onClick={() => setSelectedPlan(plan.id)}
                        className={`w-full omega-glass-card rounded-2xl p-4 flex items-center gap-4 transition-all text-right ${selectedPlan === plan.id ? 'neon-border-primary scale-[1.02]' : ''
                            } ${plan.popular ? 'ring-1 ring-primary/30' : ''}`}
                    >
                        <div className="w-12 h-12 rounded-xl bg-violet-500/15 flex items-center justify-center flex-shrink-0">
                            <Wifi className="w-6 h-6 text-violet-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                                <p className="text-white font-bold text-sm">{plan.data}</p>
                                {plan.popular && (
                                    <span className="px-2 py-0.5 rounded-full bg-primary/20 text-primary text-[9px] font-bold">
                                        محبوب
                                    </span>
                                )}
                            </div>
                            <p className="text-gray-500 text-[11px]">{plan.name} • {plan.speed}</p>
                        </div>
                        <div className="text-left flex-shrink-0">
                            <p className="text-white font-black text-lg">{plan.price.toLocaleString()}</p>
                            <p className="text-gray-500 text-[10px]">AFN</p>
                        </div>
                    </motion.button>
                ))}
            </div>

            <Button
                disabled={!selectedPlan}
                className="w-full h-14 text-base font-bold bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 shadow-lg shadow-violet-600/20 disabled:opacity-40 disabled:shadow-none"
            >
                <Wifi className="w-5 h-5 ml-2" />
                خرید بسته
            </Button>
        </div>
    );
};

// ── Others Component ──
const OthersUI = () => {
    const services = [
        { icon: '🎮', name: 'شارژ بازی', desc: 'خرید جم، کوین و آیتم' },
        { icon: '📺', name: 'تلویزیون', desc: 'پرداخت اشتراک ماهانه' },
        { icon: '💧', name: 'آب', desc: 'پرداخت قبض آب' },
        { icon: '🏥', name: 'بیمه درمان', desc: 'حق بیمه ماهانه' },
        { icon: '🎓', name: 'شهریه', desc: 'پرداخت شهریه دانشگاه' },
        { icon: '🚗', name: 'جریمه', desc: 'جریمه ترافیکی' },
    ];

    return (
        <div className="space-y-4">
            <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">سرویس‌های بیشتر</p>
            <div className="grid grid-cols-2 gap-3">
                {services.map((svc, i) => (
                    <motion.button
                        key={svc.name}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.06 }}
                        className="omega-glass-card rounded-2xl p-5 flex flex-col items-center gap-3 text-center group"
                    >
                        <span className="text-3xl group-hover:scale-110 transition-transform">{svc.icon}</span>
                        <div>
                            <p className="text-white font-bold text-sm">{svc.name}</p>
                            <p className="text-gray-500 text-[10px] mt-0.5">{svc.desc}</p>
                        </div>
                    </motion.button>
                ))}
            </div>
        </div>
    );
};

// ── Main Page ──
export const ServiceDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const config = serviceConfigs[id || ''] || serviceConfigs['others'];
    const IconComp = config.icon;

    const renderServiceUI = () => {
        switch (id) {
            case 'mobile-credit': return <MobileTopupUI />;
            case 'electricity': return <ElectricityUI />;
            case 'internet': return <InternetUI />;
            case 'flights': return <FlightsUI />;
            case 'taxes': return <TaxesUI />;
            default: return <OthersUI />;
        }
    };

    return (
        <PageTransition className="pb-32">
            {/* Hero Header */}
            <div className={`relative overflow-hidden px-6 pt-4 pb-8 bg-gradient-to-b ${config.bgGradient}`}>
                <div className={`absolute -top-10 -right-10 w-40 h-40 ${config.glowColor} blur-[60px] rounded-full`} />
                <div className={`absolute -bottom-10 -left-10 w-32 h-32 ${config.glowColor} blur-[50px] rounded-full opacity-50`} />

                <div className="relative z-10">
                    <header className="flex items-center gap-4 mb-6">
                        <button
                            onClick={() => navigate('/services')}
                            className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all border border-white/5 backdrop-blur-md"
                        >
                            <ArrowLeft className="w-5 h-5 text-white" />
                        </button>
                        <div>
                            <h1 className="text-xl font-bold text-white">{config.title}</h1>
                            <p className="text-gray-400 text-xs">{config.subtitle}</p>
                        </div>
                    </header>

                    <div className="flex items-center gap-4">
                        <div className={`w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-md border border-white/10`}>
                            <IconComp className={`w-8 h-8 ${config.color}`} />
                        </div>
                        <div className="flex gap-2">
                            {[
                                { icon: Star, label: '4.8' },
                                { icon: Clock, label: 'فوری' },
                            ].map((badge, i) => (
                                <div key={i} className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/10">
                                    <badge.icon className="w-3 h-3 text-gray-400" />
                                    <span className="text-gray-300 text-[10px] font-bold">{badge.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Service Content */}
            <div className="px-6 mt-6">
                {renderServiceUI()}
            </div>
        </PageTransition>
    );
};
