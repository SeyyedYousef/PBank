import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Send, Phone, Info, Bot, User } from 'lucide-react';
import { PageTransition } from '@/shared/ui/PageTransition';
import { Button } from '@/shared/ui/Button';

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'bot' | 'agent';
    time: string;
}

export const SupportPage = () => {
    const navigate = useNavigate();
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            text: 'سلام! به پشتیبانی پی‌بانک خوش آمدید. چگونه می‌توانم شما را راهنمایی کنم؟',
            sender: 'bot',
            time: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })
        }
    ]);
    const [inputUrl, setInputUrl] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const handleSend = () => {
        if (!inputUrl.trim()) return;

        const newUserMsg: Message = {
            id: Date.now().toString(),
            text: inputUrl,
            sender: 'user',
            time: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })
        };

        setMessages(prev => [...prev, newUserMsg]);
        setInputUrl('');
        setIsTyping(true);

        // Mock Bot Response
        setTimeout(() => {
            setIsTyping(false);
            setMessages(prev => [...prev, {
                id: (Date.now() + 1).toString(),
                text: 'پیام شما دریافت شد. در حال حاضر کارشناسان ما بررسی می‌کنند و به زودی پاسخ خواهند داد. برای موارد اضطراری می‌توانید با شماره 1515 تماس بگیرید.',
                sender: 'bot',
                time: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })
            }]);
        }, 1500);
    };

    return (
        <PageTransition className="flex flex-col h-screen bg-[#030108]">
            {/* Header */}
            <header className="px-6 py-4 flex items-center justify-between border-b border-white/5 bg-white/[0.02] backdrop-blur-xl z-10 sticky top-0">
                <div className="flex items-center gap-4">
                    <Button
                        variant="secondary"
                        size="icon"
                        onClick={() => navigate(-1)}
                        className="rounded-full w-10 h-10 bg-white/5 border border-white/10"
                    >
                        <ArrowLeft className="w-5 h-5 text-white" />
                    </Button>
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30">
                                <Bot className="w-5 h-5 text-primary-glow" />
                            </div>
                            <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-[#030108] rounded-full" />
                        </div>
                        <div>
                            <h1 className="text-white font-bold text-sm">پشتیبانی آنلاین</h1>
                            <p className="text-emerald-400 text-[10px] font-bold">پاسخگویی سریع</p>
                        </div>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-white transition-colors">
                        <Phone className="w-4 h-4" />
                    </button>
                    <button className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-white transition-colors">
                        <Info className="w-4 h-4" />
                    </button>
                </div>
            </header>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 pb-24">
                <div className="text-center">
                    <span className="px-3 py-1 rounded-full bg-white/5 text-gray-500 text-[10px]">امروز</span>
                </div>

                <AnimatePresence initial={false}>
                    {messages.map((msg) => (
                        <motion.div
                            key={msg.id}
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div className={`flex items-end gap-2 max-w-[80%] ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${msg.sender === 'user' ? 'bg-white/10' : 'bg-primary/20'}`}>
                                    {msg.sender === 'user' ? <User className="w-3 h-3 text-white" /> : <Bot className="w-3 h-3 text-primary" />}
                                </div>

                                <div className={`flex flex-col gap-1 ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                                    <div className={`p-4 rounded-2xl text-sm leading-relaxed ${msg.sender === 'user'
                                        ? 'bg-gradient-to-tr from-primary to-purple-600 text-white rounded-br-sm'
                                        : 'bg-white/10 text-gray-200 border border-white/5 rounded-bl-sm backdrop-blur-md'
                                        }`}>
                                        {msg.text}
                                    </div>
                                    <span className="text-gray-500 text-[10px] font-mono px-1">{msg.time}</span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {isTyping && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex justify-start"
                    >
                        <div className="flex items-end gap-2 max-w-[80%]">
                            <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                                <Bot className="w-3 h-3 text-primary" />
                            </div>
                            <div className="p-4 rounded-2xl bg-white/5 border border-white/5 rounded-bl-sm flex gap-1.5 items-center">
                                <motion.div className="w-1.5 h-1.5 bg-gray-400 rounded-full" animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0 }} />
                                <motion.div className="w-1.5 h-1.5 bg-gray-400 rounded-full" animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} />
                                <motion.div className="w-1.5 h-1.5 bg-gray-400 rounded-full" animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} />
                            </div>
                        </div>
                    </motion.div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[#030108] via-[#030108] to-transparent z-20 pb-safe">
                <div className="max-w-md mx-auto w-full relative flex items-center">
                    <input
                        type="text"
                        value={inputUrl}
                        onChange={(e) => setInputUrl(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="پیام خود را بنویسید..."
                        className="w-full h-14 bg-white/10 border border-white/20 rounded-[24px] pl-16 pr-6 text-white text-sm outline-none focus:bg-white/15 focus:border-primary/50 transition-all backdrop-blur-xl"
                    />
                    <button
                        onClick={handleSend}
                        disabled={!inputUrl.trim()}
                        className="absolute left-2 w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white disabled:opacity-50 disabled:bg-white/10 transition-colors"
                    >
                        <Send className="w-4 h-4 rtl:-scale-x-100" />
                    </button>
                </div>
            </div>
        </PageTransition>
    );
};
