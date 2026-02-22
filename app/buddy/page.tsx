"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/layout/Navbar";

const C = {
    blue: "#3B82F6",
    purple: "#A855F7",
    navy: "#0D0B1E",
    card: "rgba(255,255,255,0.02)",
    border: "rgba(255,255,255,0.05)",
};

export default function BuddyPage() {
    const [messages, setMessages] = useState([
        { role: "assistant", content: "Hi! I'm MLera Buddy, your personal AI tutor. I can explain any concept, help you debug models, or quiz you on what you've learned. What would you like to explore today?" }
    ]);
    const [input, setInput] = useState("");
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSend = () => {
        if (!input.trim()) return;
        setMessages([...messages, { role: "user", content: input }]);
        setInput("");

        // Fake response
        setTimeout(() => {
            setMessages(prev => [...prev, { role: "assistant", content: "I am a conceptual AI placeholder for the MLera IDRP platform. Once the backend is connected, I will provide deep, intuitive explanations for your Machine Learning queries!" }]);
        }, 1000);
    };

    return (
        <div className="min-h-screen font-sans text-foreground h-screen flex flex-col overflow-hidden">
            <Navbar />

            <div className="fixed inset-0 pointer-events-none z-0">
                <motion.div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] rounded-full blur-[140px] opacity-[0.08]" style={{ background: C.blue }} animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 8, repeat: Infinity }} />
                <div className="absolute inset-0 opacity-[0.025]" style={{ backgroundImage: "radial-gradient(rgba(168,85,247,1) 1px, transparent 1px)", backgroundSize: "30px 30px" }} />
            </div>

            <main className="relative z-10 flex-1 flex flex-col max-w-4xl mx-auto w-full px-4 pt-24 pb-6 h-full">
                {/* Header */}
                <div className="text-center mb-8">
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring" }} className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center text-3xl" style={{ background: `linear-gradient(135deg,${C.blue},${C.purple})`, boxShadow: `0 10px 30px ${C.purple}40` }}>
                        🤖
                    </motion.div>
                    <h1 className="text-3xl font-black mb-2" style={{ fontFamily: "'Georgia',serif" }}>MLera <span className="bg-clip-text text-transparent" style={{ backgroundImage: `linear-gradient(135deg,${C.blue},${C.purple})` }}>Buddy</span></h1>
                    <p className="text-sm font-mono text-white/40 uppercase tracking-widest">Always-on ML Tutor</p>
                </div>

                {/* Chat Area */}
                <div className="flex-1 overflow-y-auto mb-6 rounded-2xl border p-4 sm:p-6 space-y-6" style={{ background: "rgba(0,0,0,0.2)", borderColor: C.border }}>
                    <AnimatePresence>
                        {messages.map((m, i) => (
                            <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 md:p-5 text-sm md:text-base leading-relaxed ${m.role === 'user' ? 'rounded-br-sm text-white' : 'rounded-bl-sm text-white/80 border'}`}
                                    style={m.role === 'user' ? { background: `linear-gradient(135deg,${C.blue},${C.purple})` } : { background: C.card, borderColor: C.border }}>
                                    {m.content}
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                    <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="relative">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Ask a question about Backpropagation, Random Forests..."
                        className="w-full h-14 pl-6 pr-16 rounded-xl border outline-none text-white placeholder-white/20"
                        style={{ background: "rgba(255,255,255,0.03)", borderColor: "rgba(255,255,255,0.1)" }}
                    />
                    <button onClick={handleSend} className="absolute right-2 top-2 bottom-2 aspect-square rounded-lg flex items-center justify-center transition-transform hover:scale-105 active:scale-95" style={{ background: `linear-gradient(135deg,${C.blue},${C.purple})` }}>
                        ↑
                    </button>
                </div>
            </main>
        </div>
    );
}
