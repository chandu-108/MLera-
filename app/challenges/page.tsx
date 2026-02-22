"use client";

import { motion } from "framer-motion";
import Navbar from "@/components/layout/Navbar";

// ── Brand Colors ──
const C = {
    coral: "#FF6B6B",
    purple: "#A855F7",
    navy: "#0D0B1E",
    card: "rgba(255,255,255,0.02)",
    border: "rgba(255,255,255,0.05)",
};

function G({ children }: { children: React.ReactNode }) {
    return (
        <span className="bg-clip-text text-transparent inline" style={{ backgroundImage: "linear-gradient(135deg,#FF6B6B 0%,#FF4757 25%,#C026D3 65%,#A855F7 100%)" }}>
            {children}
        </span>
    );
}

export default function ChallengesPage() {
    const challenges = [
        { title: "Implement Backpropagation", diff: "Hard", pts: 500, icon: "⚡" },
        { title: "Optimize a Decision Tree", diff: "Medium", pts: 250, icon: "🌳" },
        { title: "Build a Simple Q-Table", diff: "Medium", pts: 300, icon: "🎮" },
        { title: "Fix the Vanishing Gradient", diff: "Hard", pts: 600, icon: "📉" },
        { title: "Classify Handwritten Digits", diff: "Easy", pts: 100, icon: "🔢" },
        { title: "Tune Hyperparameters", diff: "Easy", pts: 150, icon: "⚙️" },
    ];

    return (
        <div className="min-h-screen font-sans text-foreground overflow-hidden">
            <Navbar />

            {/* Ambient BG */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
                <motion.div className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full blur-[150px] opacity-[0.1]" style={{ background: C.coral }} animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 10, repeat: Infinity }} />
                <motion.div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full blur-[120px] opacity-[0.1]" style={{ background: C.purple }} animate={{ scale: [1.1, 1, 1.1] }} transition={{ duration: 12, repeat: Infinity }} />
                <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "radial-gradient(rgba(168,85,247,1) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
            </div>

            <main className="relative z-10 pt-32 pb-24 px-6 max-w-7xl mx-auto">
                {/* Header */}
                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-center max-w-3xl mx-auto mb-16">
                    <span className="text-xs font-mono uppercase tracking-widest px-3 py-1.5 rounded-full border mb-6 inline-block" style={{ borderColor: `${C.coral}40`, color: C.coral, background: `${C.coral}10` }}>Global Leaderboard Placeholder</span>
                    <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight" style={{ fontFamily: "'Georgia',serif" }}>
                        Test your <G>Limits.</G>
                    </h1>
                    <p className="text-lg text-white/50 leading-relaxed">
                        Apply what you've learned in the Learning Path to real-world ML problems. Complete challenges to earn points, climb the leaderboard, and solidify your understanding.
                    </p>
                </motion.div>

                {/* Challenge Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {challenges.map((c, i) => (
                        <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} whileHover={{ y: -5, boxShadow: `0 15px 40px ${C.purple}20` }} className="rounded-2xl p-6 border relative group overflow-hidden cursor-pointer" style={{ background: C.card, borderColor: C.border }}>
                            <div className="absolute top-0 right-0 w-32 h-32 opacity-0 group-hover:opacity-[0.05] transition-opacity duration-500 rounded-full blur-2xl" style={{ background: C.purple }} />

                            <div className="flex justify-between items-start mb-6">
                                <div className="text-4xl">{c.icon}</div>
                                <div className="text-right">
                                    <div className="text-lg font-black" style={{ color: C.coral }}>{c.pts} <span className="text-xs text-white/30 font-bold uppercase tracking-widest">pts</span></div>
                                </div>
                            </div>

                            <h3 className="text-xl font-bold text-white mb-2">{c.title}</h3>

                            <div className="flex items-center gap-3 mt-6">
                                <span className="text-xs font-mono px-2 py-1 rounded border" style={{
                                    borderColor: c.diff === 'Hard' ? 'rgba(239,68,68,0.3)' : c.diff === 'Medium' ? 'rgba(245,158,11,0.3)' : 'rgba(16,185,129,0.3)',
                                    color: c.diff === 'Hard' ? '#ef4444' : c.diff === 'Medium' ? '#f59e0b' : '#10b981',
                                    background: 'rgba(255,255,255,0.02)'
                                }}>{c.diff}</span>
                                <span className="text-xs font-mono text-white/30">0/1 Complete</span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </main>
        </div>
    );
}
