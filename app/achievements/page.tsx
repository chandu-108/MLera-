"use client";

import { motion } from "framer-motion";
import Navbar from "@/components/layout/Navbar";

const C = {
    emerald: "#10b981",
    coral: "#FF6B6B",
    amber: "#f59e0b",
    purple: "#A855F7",
    navy: "#0D0B1E",
    border: "rgba(255,255,255,0.05)",
    card: "rgba(255,255,255,0.02)"
};

function G({ children }: { children: React.ReactNode }) {
    return <span className="bg-clip-text text-transparent inline" style={{ backgroundImage: "linear-gradient(135deg,#f59e0b 0%,#FF4757 60%,#A855F7 100%)" }}>{children}</span>;
}

export default function AchievementsPage() {
    const achievements = [
        { title: "First Blood", desc: "Complete your first concept card.", icon: "🩸", color: C.coral, unlocked: true, date: "Oct 12, 2025" },
        { title: "Backprop Master", desc: "Perfect score on the Backpropagation quiz.", icon: "🧠", color: C.purple, border: C.purple, unlocked: true, date: "Nov 04, 2025" },
        { title: "7-Day Streak", desc: "Study for 7 consecutive days.", icon: "🔥", color: C.amber, unlocked: true, date: "Nov 09, 2025" },
        { title: "Tree Hugger", desc: "Complete the Decision Trees module.", icon: "🌲", color: C.emerald, unlocked: false },
        { title: "Tensor Tamer", desc: "Write your first PyTorch training loop.", icon: "🤖", color: C.coral, unlocked: false },
        { title: "Overfitter", desc: "Achieve 100% train accuracy and <50% test accuracy.", icon: "📉", color: C.amber, unlocked: false },
    ];

    return (
        <div className="min-h-screen font-sans text-foreground overflow-hidden">
            <Navbar />

            <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
                <motion.div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] rounded-full blur-[140px] opacity-[0.08]" style={{ background: C.amber }} animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 15, repeat: Infinity }} />
                <motion.div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full blur-[140px] opacity-[0.08]" style={{ background: C.coral }} animate={{ scale: [1.2, 1, 1.2] }} transition={{ duration: 12, repeat: Infinity }} />
                <div className="absolute inset-0 opacity-[0.035]" style={{ backgroundImage: "radial-gradient(rgba(245,158,11,1) 1px, transparent 1px)", backgroundSize: "36px 36px" }} />
            </div>

            <main className="relative z-10 pt-32 pb-24 px-6 max-w-6xl mx-auto">
                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-center mb-16">
                    <div className="inline-flex items-center justify-center p-4 rounded-full mb-6" style={{ background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.2)" }}>
                        <span className="text-4xl">🏆</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black mb-4 tracking-tight" style={{ fontFamily: "'Georgia',serif" }}>
                        Badges of <G>Honor.</G>
                    </h1>
                    <p className="text-lg text-white/50 max-w-xl mx-auto">
                        Your ML journey isn't just about reading—it's about doing. Unlock achievements as you master concepts and hit milestones.
                    </p>
                </motion.div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {achievements.map((a, i) => (
                        <motion.div key={i} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1 }}
                            className="rounded-2xl p-6 relative overflow-hidden group transition-all"
                            style={{ background: C.card, border: `1px solid ${a.unlocked ? a.color + '40' : C.border}`, filter: a.unlocked ? 'none' : 'grayscale(100%) opacity(50%)' }}>

                            {a.unlocked && (
                                <div className="absolute top-0 right-0 w-32 h-32 opacity-[0.08] pointer-events-none rounded-full blur-2xl transition-opacity group-hover:opacity-[0.15]" style={{ background: a.color }} />
                            )}

                            <div className="flex items-start justify-between mb-4">
                                <div className="w-14 h-14 rounded-xl flex items-center justify-center text-3xl" style={{ background: a.unlocked ? `${a.color}15` : 'rgba(255,255,255,0.05)', border: `1px solid ${a.unlocked ? a.color + '30' : 'rgba(255,255,255,0.05)'}` }}>
                                    {a.icon}
                                </div>
                                {a.unlocked && <div className="text-xs font-mono text-white/30">{a.date}</div>}
                            </div>

                            <h3 className="text-lg font-bold text-white mb-2">{a.title}</h3>
                            <p className="text-sm text-white/50 leading-relaxed">{a.desc}</p>

                            {!a.unlocked && (
                                <div className="mt-4 inline-flex items-center gap-2 text-xs font-mono px-2 py-1 rounded" style={{ background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.4)" }}>
                                    🔒 Locked
                                </div>
                            )}
                        </motion.div>
                    ))}
                </div>
            </main>
        </div>
    );
}
